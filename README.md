**Gemini Q&A Bot**\
A scalable **Q&A bot** powered by **Gemini 1.5 Flash**, built with
**FastAPI**, **Celery**, **RabbitMQ (CloudAMQP)**, and **Redis
(Railway)** for caching.\
**Frontend**: Simple **chat-style UI** with animations, deployed on
**Vercel**.\
\
**Live URLs**

-   Backend API:
    [[https://qa-bot-api.onrender.com](https://qa-bot-api.onrender.com/)]{.underline}

-   **Frontend UI**: https://your-vercel-deployment-url\
    \
    **Setup Instructions**\
    1️⃣ Clone the Repository\
    `bash`\
    CopyEdit\
    `git clone https://github.com/imfeniljikadara/qa-bot.git`\
    `cd qa-bot`\
    \
    **Environment Variables**\
    Create a **.env** file with:\
    `env`\
    CopyEdit\
    `GEMINI_API_KEY=<your-gemini-api-key>`\
    `BROKER_URL=<your-cloudamqp-url>       # RabbitMQ (CloudAMQP)`\
    `CACHE_URL=<your-railway-redis-url>     # Redis (Railway)`\
    \
    **Docker Setup**\
    Dockerfile is included.\
    `bash`\
    CopyEdit\
    `docker build -t qa-bot .`\
    `docker run -p 8000:8000 --env-file .env qa-bot`\
    For **local dev with Redis** and **RabbitMQ**, extend with
    **docker-compose** (optional).\
    \
    **Render Deployment Commands**\
    In Render's **Start Command**:\
    `bash`\
    CopyEdit\
    `sh -c "PYTHONPATH=. celery -A worker.worker.celery_app worker --loglevel=info -Q qa_tasks & uvicorn app.main:app --host 0.0.0.0 --port 8000"`\
    \
    **API Reference**\
    POST /ask

```{=html}
<!-- -->
```
-   Request Body:\
    `json`\
    CopyEdit\
    `{`\
    `  "question": "What is artificial intelligence?"`\
    `}`

```{=html}
<!-- -->
```
-   **Response:**\
    `json`\
    CopyEdit\
    `{`\
    `  "task_id": "abc123",`\
    `  "status": "PENDING"`\
    `}`\
    \
    **GET /result/{task_id}**

```{=html}
<!-- -->
```
-   Response (Pending):\
    `json`\
    CopyEdit\
    `{`\
    `  "status": "PENDING",`\
    `  "result": null`\
    `}`

```{=html}
<!-- -->
```
-   **Response (Completed):**\
    `json`\
    CopyEdit\
    `{`\
    `  "status": "COMPLETED",`\
    `  "result": "Artificial Intelligence (AI) is a branch of computer science..."`\
    `}`

```{=html}
<!-- -->
```
-   **Cached Response:**\
    `json`\
    CopyEdit\
    `{`\
    `  "status": "COMPLETED",`\
    `  "result": "This response was served from cache."`\
    `}`\
    \
    **Architecture**\
    `scss`\
    CopyEdit\
    `User ``→`` Frontend (Vercel) ``→`` FastAPI (Render)`\
    `                          ``↘`` Redis (Railway)  ``→`` Caching`\
    `                           ``↘`` Celery (same container)`\
    `                              ``↘`` RabbitMQ (CloudAMQP) ``→`` Task Queue`\
    `                                 ``↘`` Gemini 1.5 Flash (Google API)`\
    **Key Components:**

```{=html}
<!-- -->
```
-   FastAPI: Serves API requests.

-   **Celery**: Handles background processing of AI tasks.

-   **RabbitMQ (CloudAMQP)**: Message broker for Celery.

-   **Redis (Railway)**: Caches previous answers.

-   **Gemini 1.5 Flash**: Provides AI answers.

-   **Frontend (Vercel)**: Chat-style interface with animations.\
    \
    **Example Input/Output**\
    Input:\
    `vbnet`\
    CopyEdit\
    `Question: "What is machine learning?"`\
    **Output:**\
    `vbnet`\
    CopyEdit\
    `Answer: "Machine learning is a subset of artificial intelligence (AI) that enables systems to learn..."`\
    \
    **Assumptions**

```{=html}
<!-- -->
```
-   Scalable architecture with message queue (RabbitMQ) and cache
    (Redis).

-   **Async task processing** ensures backend responsiveness.

-   **Cache** prevents redundant Gemini API calls for repeated
    questions.

-   **RPC backend** is used with Celery + RabbitMQ for result handling.\
    \
    **Docker Commands**\
    Build & Run:\
    `bash`\
    CopyEdit\
    `docker build -t qa-bot .`\
    `docker run -p 8000:8000 --env-file .env qa-bot`

    ## Caching Methodology

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
