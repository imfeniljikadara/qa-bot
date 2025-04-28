from celery import Celery
import os

BROKER_URL = os.getenv("BROKER_URL")

celery_app = Celery(
    "worker",
    broker=BROKER_URL,
    backend="rpc://",
)

celery_app.autodiscover_tasks(['app.tasks'])

celery_app.conf.task_routes = {
    "app.tasks.process_question": {"queue": "qa_tasks"},
}