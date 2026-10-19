from pydantic import BaseModel, ConfigDict


# CollectionResponse is a Pydantic model that defines the structure of the data for a collection. It includes fields such as id, name, nickname, description, sort_order, is_archive, theme_preset, and copyright_holder.
# The model uses ConfigDict to specify that it should be created from attributes of an object.
class CollectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    nickname: str | None
    description: str | None
    sort_order: int
    is_archive: bool
    theme_preset: str
    copyright_holder: str | None
