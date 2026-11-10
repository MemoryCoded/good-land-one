from datetime import timezone
from fastapi import Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
import os

from app.database import get_db
from app.repositories.photo_repository import PhotoRepository
from app.repositories.collection_repository import CollectionRepository
from app.schemas.photo import PhotoResponse
from app.services.image_service import process_and_save_image


class PhotoService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db
        self.photo_repo = PhotoRepository(db)
        self.collection_repo = CollectionRepository(db)

    async def get_gallery(self, limit: int = 50) -> list[PhotoResponse]:
        photos = await self.photo_repo.get_published_photos(limit=limit)
        return [
            PhotoResponse.model_validate(
                {
                    **photo.__dict__,
                    "collection_name": photo.collection.name
                    if photo.collection
                    else None,
                    "collection_sort_order": photo.collection.sort_order
                    if photo.collection
                    else None,
                }
            )
            for photo in photos
        ]

    async def get_admin_library(
        self, skip: int = 0, limit: int = 100
    ) -> list[PhotoResponse]:
        photos = await self.photo_repo.get_paginated_photos(skip=skip, limit=limit)
        return [
            PhotoResponse.model_validate(
                {
                    **photo.__dict__,
                    "collection_name": photo.collection.name
                    if photo.collection
                    else None,
                    "collection_sort_order": photo.collection.sort_order
                    if photo.collection
                    else None,
                }
            )
            for photo in photos
        ]

    async def update_photo_metadata(self, photo_id: int, update_data: dict):
        try:
            new_collection_name = update_data.pop("new_collection_name", None)

            if new_collection_name:
                clean_name = new_collection_name.strip()
                if clean_name:
                    existing = await self.collection_repo.get_by_name(clean_name)
                    if existing:
                        update_data["collection_id"] = existing.id
                    else:
                        new_col = await self.collection_repo.create_collection(
                            clean_name
                        )
                        update_data["collection_id"] = new_col.id

            # FIX: Strip timezone from date_taken before saving to DB
            if "date_taken" in update_data and update_data["date_taken"] is not None:
                dt = update_data["date_taken"]
                if dt.tzinfo is not None:
                    dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
                update_data["date_taken"] = dt

            updated_photo = await self.photo_repo.update_photo(photo_id, update_data)
            if not updated_photo:
                raise ValueError(f"Photo {photo_id} not found")

            await self.db.commit()
            await self.db.refresh(updated_photo, ["collection"])
            return updated_photo
        except Exception as e:
            await self.db.rollback()
            raise e

    async def process_upload_batch(
        self,
        files: list[UploadFile],
        collection_id: int,
        is_archived: bool,
        in_gallery: bool,
        is_uncategorized: bool,
    ) -> int:
        collection = await self.collection_repo.get_by_id(collection_id)
        if not collection:
            raise ValueError(f"Collection {collection_id} does not exist.")

        processed_data = []
        for file in files:
            raw = await file.read()
            meta = await asyncio.to_thread(process_and_save_image, raw, file.filename)
            processed_data.append((meta, len(raw)))

        try:
            max_pos = await self.photo_repo.get_max_position(collection_id)
            for meta, file_size in processed_data:
                max_pos += 1
                photo_data = {
                    "collection_id": collection_id,
                    "position": max_pos,
                    "filename": meta["filename"],
                    "thumbnail_small": meta["thumb_small"],
                    "thumbnail_medium": meta["thumb_medium"],
                    "thumbnail_large": meta["thumb_large"],
                    "width": meta["width"],
                    "height": meta["height"],
                    "mime_type": meta["mime_type"],
                    "size_bytes": file_size,
                    "date_taken": meta.get("date_taken"),
                    "is_archived": is_archived,
                    "in_gallery": in_gallery,
                    "is_uncategorized": is_uncategorized,
                }
                await self.photo_repo.create_photo(photo_data)
            await self.db.commit()
        except Exception as e:
            await self.db.rollback()
            raise e
        return len(processed_data)

    async def delete_photo(self, photo_id: int):
        try:
            photo = await self.photo_repo.delete_photo(photo_id)
            if photo:
                files_to_delete = [
                    photo.filename,
                    photo.thumbnail_small,
                    photo.thumbnail_medium,
                    photo.thumbnail_large,
                ]
                for file_path in files_to_delete:
                    if file_path:
                        local_path = file_path.replace("/static/", "static/")
                        if os.path.exists(local_path):
                            os.remove(local_path)
            await self.db.commit()
            return photo
        except Exception as e:
            await self.db.rollback()
            raise e

    async def delete_collection(self, collection_id: int):
        try:
            await self.photo_repo.archive_collection_photos(collection_id)
            await self.collection_repo.delete_collection(collection_id)
            await self.db.commit()
        except Exception as e:
            await self.db.rollback()
            raise e
