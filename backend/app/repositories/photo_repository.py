from sqlalchemy import select
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
