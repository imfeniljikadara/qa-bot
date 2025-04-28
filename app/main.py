from fastapi import FastAPI, HTTPException
from app.models import QuestionRequest, TaskStatusResponse, TaskResultResponse
from app.tasks import process_question
from celery.result import AsyncResult
from app.cache import cache_get

app = FastAPI()

@app.post("/ask", response_model=TaskStatusResponse)
async def ask_question(request: QuestionRequest):
    cached_answer = await cache_get(request.question)
    if cached_answer:
        return TaskStatusResponse(task_id="cached", status="COMPLETED")
    task = process_question.apply_async(args=[request.question])
    return TaskStatusResponse(task_id=task.id, status=task.status)

@app.get("/result/{task_id}", response_model=TaskResultResponse)
async def get_result(task_id: str):
    if task_id == "cached":
        return TaskResultResponse(status="COMPLETED", result="This response was served from cache.")
    task_result = AsyncResult(task_id)
    if task_result.state == "PENDING":
        return TaskResultResponse(status="PENDING", result=None)
    elif task_result.state == "SUCCESS":
        return TaskResultResponse(status="COMPLETED", result=task_result.result)
    else:
        raise HTTPException(status_code=500, detail="Task failed.")