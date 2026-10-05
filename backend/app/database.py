from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import settings

Base = declarative_base()

# Create an asynchronous engine for the database connection using SQLAlchemy's create_async_engine function.
# The database URL is modified to use the asyncpg driver for PostgreSQL.
# The echo parameter is set to True if the environment is development, enabling SQL query logging.
# Pool settings are configured for connection pooling.
engine = create_async_engine(
    settings.database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.environment == "development",
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

"""
AsyncSessionLocal is an asynchronous session factory created using SQLAlchemy's async_sessionmaker.
Session is a batch of related operations that are executed together.
"""
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
