from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Photo

"""
Repositories isolate all database access.
Routes never write SQL.
Services never write SQL.
Only repositories do.
This means if ever change databases,
only repositories change.

"""


# Returns a list of published photo objects, limited to the specified number.
class PhotoRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_published_photos(self, limit: int = 50) -> list[Photo]:
        stmt = (
            select(Photo)
            .where(Photo.is_archived.is_(False))
            .where(Photo.in_gallery.is_(True))
            .limit(limit)
        )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_photo_by_id(self, photo_id: int) -> Photo | None:
        stmt = select(Photo).where(Photo.id == photo_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_max_position(self, collection_id: int) -> int:
        stmt = select(func.max(Photo.position)).where(
            Photo.collection_id == collection_id
        )
        result = await self.db.execute(stmt)

        # Returns an integer, or 0 if the collection is empty
        return result.scalar() or 0

    # Insert a new photo
    async def create_photo(self, photo_data: dict) -> Photo:
        photo = Photo(**photo_data)
        self.db.add(photo)
        await self.db.flush()  # Pushes db to generate the ID but does not commit

        return photo

    async def get_paginated_photos(self, skip: int = 0, limit: int = 50) -> list[Photo]:
        stmt = (
            select(Photo).order_by(Photo.uploaded_at.desc()).offset(skip).limit(limit)
        )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())
