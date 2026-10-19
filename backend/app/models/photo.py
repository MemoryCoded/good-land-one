from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import (
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Index,
    UniqueConstraint,
    func,
)

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.collection import Collection


# The Photo class is a SQLAlchemy model that represents a photo in the database. It defines the structure of the "photos" table, including columns for various attributes of a photo, such as title, description, artist name, filename, dimensions, and more. The class also establishes relationships with other models, such as the Collection model, and includes constraints and indexes to ensure data integrity and optimize query performance.
# It inherits from the Base class, which is a declarative base provided by SQLAlchemy for defining models. The Photo class uses mapped_column to define the columns in the table, specifying data types, constraints, and default values. It also defines relationships with other models using the relationship function, allowing for easy navigation between related data in the database.
# An orm is needed for database
class Photo(Base):
    __tablename__ = "photos"

    id: Mapped[int] = mapped_column(primary_key=True)

    collection_id: Mapped[int] = mapped_column(
        ForeignKey("collections.id"), nullable=False
    )
    position: Mapped[int] = mapped_column(nullable=False)

    is_archived: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    in_gallery: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    artist_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    copyright_override: Mapped[str | None] = mapped_column(String(255), nullable=True)

    canvas_theme: Mapped[str | None] = mapped_column(String(50), nullable=True)
    canvas_overrides: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    view_b_background: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    color_palette: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    info_toggles: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    thumbnail_small: Mapped[str] = mapped_column(String(255), nullable=False)
    thumbnail_medium: Mapped[str] = mapped_column(String(255), nullable=False)
    thumbnail_large: Mapped[str] = mapped_column(String(255), nullable=False)

    mime_type: Mapped[str] = mapped_column(String(50), nullable=False)
    size_bytes: Mapped[int] = mapped_column(nullable=False)
    width: Mapped[int] = mapped_column(nullable=False)
    height: Mapped[int] = mapped_column(nullable=False)

    date_taken: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    date_source: Mapped[str] = mapped_column(
        String(20), default="taken", nullable=False
    )
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    print_available: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    base_price_cents: Mapped[int | None] = mapped_column(nullable=True)
    edition_size: Mapped[int | None] = mapped_column(nullable=True)
    edition_number: Mapped[int | None] = mapped_column(nullable=True)

    collection: Mapped["Collection"] = relationship(
        "Collection",
        back_populates="photos",
        foreign_keys=[collection_id],
    )

    # Index may be redudant after unique constraint
    __table_args__ = (
        UniqueConstraint(
            "collection_id", "position", name="uq_photos_collection_position"
        ),
        Index("ix_photos_collection_position", "collection_id", "position"),
        Index("ix_photos_archived", "is_archived"),
        Index("ix_photos_gallery", "in_gallery"),
    )
