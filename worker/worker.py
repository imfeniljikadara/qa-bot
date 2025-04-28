from celery import Celery
import os

celery_app = Celery(
    "worker",
    broker=os.getenv("BROKER_URL"),   
    backend=os.getenv("BROKER_URL"),  
)

celery_app.conf.task_routes = {
    "app.tasks.process_question": {"queue": "qa_tasks"},
}