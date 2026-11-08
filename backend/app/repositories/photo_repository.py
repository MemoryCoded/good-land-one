from sqlalchemy import select, func, update  # <-- Added 'update' here
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models import Photo

"""
Repositories isolate all database access.
Routes never write SQL.
Services never write SQL.
Only repositories do.
This means if ever change databases,
only repositories change.
"""


class PhotoRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_published_photos(self, limit: int = 50) -> list[Photo]:
        stmt = (
            select(Photo)
            .options(joinedload(Photo.collection))
            .where(Photo.is_archived.is_(False))  # Not in Archive
            .where(Photo.in_gallery.is_(True))  # Must be in Gallery
            .where(Photo.is_uncategorized.is_(False))  # NOT in UNCAT
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_photo_by_id(self, photo_id: int) -> Photo | None:
        stmt = (
            select(Photo)
            .options(joinedload(Photo.collection))
            .where(Photo.id == photo_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_max_position(self, collection_id: int) -> int:
        stmt = select(func.max(Photo.position)).where(
            Photo.collection_id == collection_id
        )
        result = await self.db.execute(stmt)
        return result.scalar() or 0

    async def create_photo(self, photo_data: dict) -> Photo:
        photo = Photo(**photo_data)
        self.db.add(photo)
        await self.db.flush()
        return photo

    async def get_paginated_photos(self, skip: int = 0, limit: int = 50) -> list[Photo]:
        stmt = (
            select(Photo)
            .options(joinedload(Photo.collection))
            .order_by(Photo.uploaded_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def update_photo(self, photo_id: int, update_data: dict) -> Photo | None:
        photo = await self.get_photo_by_id(photo_id)
        if not photo:
            return None

        new_collection_id = update_data.get("collection_id")
        if new_collection_id and new_collection_id != photo.collection_id:
            max_pos = await self.get_max_position(new_collection_id)
            update_data["position"] = max_pos + 1

        for key, value in update_data.items():
            setattr(photo, key, value)

        await self.db.flush()
        return await self.get_photo_by_id(photo_id)

    async def get_uncategorized_photos(self, limit: int = 50) -> list[Photo]:
        stmt = (
            select(Photo)
            .options(joinedload(Photo.collection))
            .where(Photo.is_archived.is_(False))
            .where(Photo.is_uncategorized.is_(True))
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    # --- NEW METHOD ---
    async def archive_collection_photos(self, collection_id: int):
        """
        When a collection is deleted, move its photos to the Archive
        so they aren't lost or orphaned in the database.
        """
        stmt = (
            update(Photo)
            .where(Photo.collection_id == collection_id)
            .values(is_archived=True, in_gallery=False, is_uncategorized=False)
        )
        await self.db.execute(stmt)

    async def delete_photo(self, photo_id: int) -> Photo | None:
        photo = await self.get_photo_by_id(photo_id)
        if photo:
            await self.db.delete(photo)
        return photo
