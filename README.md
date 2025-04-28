### Gemini Q&A Bot

A scalable **Q&A bot** powered by **Gemini 1.5 Flash**, built with
**FastAPI**, **Celery**, **RabbitMQ (CloudAMQP)**, and **Redis
(Railway)** for caching.\
**Frontend**: Simple **chat-style UI** with animations, deployed on
**Vercel**.

### Setup Instructions
1. Clone the Repository
    ```
   git clone https://github.com/imfeniljikadara/qa-bot.git
    cd qa-bot
    ```
2. Environment Variables
   ```
    GEMINI_API_KEY=<your-gemini-api-key>
    BROKER_URL=<your-cloudamqp-url>    
    CACHE_URL=<your-railway-redis-url>   
   ```
3. Docker Setup
   ```
    docker build -t qa-bot .
    docker run -p 8000:8000 --env-file .env qa-bot
   ```
4. Render Deployment Commands
    ```
    sh -c "PYTHONPATH=. celery -A worker.worker.celery_app worker --loglevel=info -Q qa_tasks & uvicorn app.main:app --host 0.0.0.0 --port 8000"`\
    ```

### Caching Methodology

- **Redis (Railway)** is used to **cache responses** to repeated questions.
- Cached answers are **retrieved instantly** (without re-querying Gemini).
- Cache **expiration** is set to **1 hour** to balance **freshness** and **performance**.
- This significantly **reduces API calls** and **improves response time** for frequent queries.

### Example Cache Flow:

1. User asks: "What is AI?"
2. System checks Redis:
   - **If found** → returns cached answer immediately.
   - **If not found** → queries Gemini → caches the result.

- **Cache Layer** optimizes **scalability** and ensures **efficient resource usage**.