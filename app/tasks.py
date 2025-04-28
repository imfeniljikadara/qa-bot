from worker.worker import celery_app
from app.utils import ask_gemini
from app.cache import cache_set

@celery_app.task()
def process_question(question: str):
    import asyncio
    loop = asyncio.get_event_loop()
    answer = loop.run_until_complete(ask_gemini(question))
    loop.run_until_complete(cache_set(question, answer))
    return answer