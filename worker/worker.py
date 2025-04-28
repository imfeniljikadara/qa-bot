from celery import Celery
import os
from dotenv import load_dotenv
load_dotenv()

celery_app = Celery(
    "worker",
    broker=os.getenv("REDIS_BROKER_URL"),
    backend=os.getenv("REDIS_BROKER_URL"),
)

celery_app.conf.task_routes = {
    "app.tasks.process_question": {"queue": "qa_tasks"},
}