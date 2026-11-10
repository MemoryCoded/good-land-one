from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PhotoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    collection_id: int
    collection_name: str | None = None
    collection_sort_order: int | None = None
    position: int
    title: str | None
    description: str | None
    artist_name: str | None
    filename: str
    thumbnail_small: str
    thumbnail_medium: str
    thumbnail_large: str
    width: int
    height: int
    mime_type: str
    size_bytes: int
    date_taken: datetime | None
    canvas_theme: str | None
    uploaded_at: datetime
    is_archived: bool
    in_gallery: bool
    is_uncategorized: bool


# Schema for what the frontend sends when editing
class PhotoUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    artist_name: str | None = None
    is_archived: bool | None = None
    in_gallery: bool | None = None
    is_uncategorized: bool | None = None
    collection_id: int | None = None
    position: int | None = None
    new_collection_name: str | None = None
    date_taken: datetime | None = None
