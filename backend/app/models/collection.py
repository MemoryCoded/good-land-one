from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base

if TYPE_CHECKING:
    from app.models.photo import Photo


class Collection(Base):
    __tablename__ = "collections"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    nickname: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(unique=True, nullable=False)
    is_archive: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    cover_photo_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "photos.id",
            ondelete="SET NULL",
            use_alter=True,
            name="fk_collection_cover_photo",
        ),
        nullable=True,
    )
    theme_preset: Mapped[str] = mapped_column(
        String(50), default="kodak", nullable=False
    )
    theme_overrides: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    copyright_holder: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    photos: Mapped[list["Photo"]] = relationship(
        "Photo",
        back_populates="collection",
        foreign_keys="Photo.collection_id",
    )
