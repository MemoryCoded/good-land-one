import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends  # ← add Depends
from sqlalchemy import text  # ← add text
from sqlalchemy.ext.asyncio import AsyncSession  # ← add AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, get_db  # ← add get_db
from app.routes.photos import router as photos_router
from app.routes.collections import router as collections_router
from app.routes.admin import photos as admin_photos


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create folder if not
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register routers
app.include_router(photos_router)
app.include_router(collections_router)
app.include_router(admin_photos.router)


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
