from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Collection, Photo


class CollectionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_collections(self) -> list[Collection]:
        stmt = (
            select(Collection)
            .join(Photo, Collection.id == Photo.collection_id)
            .group_by(Collection.id)
            .order_by(Collection.sort_order)
        )
        result = await self.db.execute(stmt)
        # The scalars method is used to extract the individual Collection objects from the result of the query. The all method is then called to retrieve all the Collection objects as a list.
        return list(result.scalars().all())

    async def get_by_name(self, name: str) -> Collection | None:
        stmt = select(Collection).where(Collection.name == name)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create_collection(self, name: str) -> Collection:
        # Find current highest sort_order
        max_order = await self.db.scalar(select(func.max(Collection.sort_order)))

        new_col = Collection(
            name=name,
            sort_order=(max_order or 0) + 1,
            is_archive=False,
            theme_preset="white",
        )

        self.db.add(new_col)
        await self.db.flush()

        return new_col

    # Check if a collection exists
    async def get_by_id(self, collection_id: int) -> Collection | None:
        stmt = select(Collection).where(Collection.id == collection_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
