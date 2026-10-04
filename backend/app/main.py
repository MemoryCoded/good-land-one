from fastapi import FastAPI
from app.config import settings

# Create FastAPI app instance - Uvicorn ASGI
app = FastAPI(
    title="Gallery API",
    description="API for the Gallery Website",
    version="1.0.0",
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "environment": settings.environment,
    }
