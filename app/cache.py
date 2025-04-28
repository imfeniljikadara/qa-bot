import redis.asyncio as redis
import os

redis_client = redis.from_url(os.getenv("REDIS_CACHE_URL"), decode_responses=True)

async def cache_get(key: str):
    return await redis_client.get(key)

async def cache_set(key: str, value: str):
    await redis_client.set(key, value, ex=3600)