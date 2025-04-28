from pydantic import BaseModel

class QuestionRequest(BaseModel):
    question: str

class TaskStatusResponse(BaseModel):
    task_id: str
    status: str

class TaskResultResponse(BaseModel):
    status: str
    result: str | None