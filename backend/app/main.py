from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends  # ← add Depends
from sqlalchemy import text  # ← add text
from sqlalchemy.ext.asyncio import AsyncSession  # ← add AsyncSession
from app.config import settings
from app.database import engine, get_db  # ← add get_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield

    # shutdown
    await engine.dispose()


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


@app.get("/db-check")
async def db_check(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT 1"))
    return {"db": "connected", "result": result.scalar()}
