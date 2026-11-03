from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Collection


class CollectionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_collections(self) -> list[Collection]:
        stmt = select(Collection).order_by(Collection.sort_order)
        result = await self.db.execute(stmt)
        # The scalars method is used to extract the individual Collection objects from the result of the query. The all method is then called to retrieve all the Collection objects as a list.
        return list(result.scalars().all())

    # Check if a collection exists
    async def get_by_id(self, collection_id: int) -> Collection | None:
        stmt = select(Collection).where(Collection.id == collection_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
