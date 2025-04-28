# Gemini Q&A Bot

A scalable **Q&A bot** powered by **Gemini 1.5 Flash**, built with
**FastAPI**, **Celery**, **RabbitMQ (CloudAMQP)**, and **Redis
(Railway)** for caching.\
**Frontend**: Simple **chat-style UI** with animations, deployed on
**Vercel**.

# Setup Instructions
- Clone the Repository
    ```
   git clone https://github.com/imfeniljikadara/qa-bot.git
    cd qa-bot
    ```
- Environment Variables
   ```
    GEMINI_API_KEY=<your-gemini-api-key>
    BROKER_URL=<your-cloudamqp-url>    
    CACHE_URL=<your-railway-redis-url>   
   ```
- Docker Setup
   ```
    docker build -t qa-bot .
    docker run -p 8000:8000 --env-file .env qa-bot
   ```
- Render Deployment Commands
    ```
    sh -c "PYTHONPATH=. celery -A worker.worker.celery_app worker --loglevel=info -Q qa_tasks & uvicorn app.main:app --host 0.0.0.0 --port 8000"`\
    ```

# Caching Logic

Redis (Railway) is used as a **cache layer** to store **answers** for **previously asked questions**. This helps improve **response time** and reduce **Gemini API usage**.

## Flow:

1. **User submits a question** via the frontend.
2. The **backend checks Redis** for the exact question.
   - **If found (cache hit)**:
     - The **cached answer** is returned **immediately**.
     - Response includes a flag (`task_id: "cached"`) indicating it was **served from cache**.
   - **If not found (cache miss)**:
     - The question is **queued to Celery** (RabbitMQ broker).
     - The **Gemini 1.5 Flash model** processes the question.
     - The **new answer is cached** in Redis for **future requests**.

## Cache Expiry (TTL):

- Cached answers have a **Time-To-Live (TTL)** of **1 hour**.
- Ensures the cache stays **fresh** and **relevant**, while optimizing **performance**.

## Benefits:

- **Instant responses** for repeated questions.
- **Minimizes Gemini API costs** by avoiding redundant calls.
- Helps the system scale to **1000s of requests/day** with **consistent performance**.


## Caching Methodology

- **Redis (Railway)** is used to **cache responses** to repeated questions.
- Cached answers are **retrieved instantly** (without re-querying Gemini).
- Cache **expiration** is set to **1 hour** to balance **freshness** and **performance**.
- This significantly **reduces API calls** and **improves response time** for frequent queries.

## Example Cache Flow:

1. User asks: "What is AI?"
2. System checks Redis:
   - **If found** → returns cached answer immediately.
   - **If not found** → queries Gemini → caches the result.

- **Cache Layer** optimizes **scalability** and ensures **efficient resource usage**.