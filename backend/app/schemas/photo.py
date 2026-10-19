from datetime import datetime
from pydantic import BaseModel, ConfigDict


# Schemas are for data validation and serialization. They are used to define the structure of the data that is sent and received by the API endpoints.
# The API endpoints are defined in the routes, and they use the schemas to validate the input data and serialize the output data.
# Schemas can also be used to enforce data types, required fields, and other validation rules.
# JSON serialization is handled by Pydantic, which converts the data to and from JSON format.
class PhotoResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    collection_id: int
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
