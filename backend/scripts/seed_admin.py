# ruff: noqa: E402
"""
Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env, hashes the password,
and inserts/updates the admin user in the database.
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import bcrypt
from sqlalchemy import select

from app.config import settings
from app.database import AsyncSessionLocal
from app.models import User


async def seed_admin() -> None:
    if not settings.admin_email or not settings.admin_password:
        print("Error:ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env")
        sys.exit(1)
        return

    password_hash = bcrypt.hashpw(
        settings.admin_password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    async with AsyncSessionLocal() as session:
        # Check if the admin user already exists
        result = await session.execute(
            select(User).where(User.email == settings.admin_email)
        )
        existing = result.scalar_one_or_none()

        if existing:
            # Update the existing admin user's password hash
            existing.password_hash = password_hash
            existing.is_admin = True
            existing.is_active = True
            print(f"Updating existing admin user: {settings.admin_email}")
        else:
            # Create a new admin user
            new_admin = User(
                email=settings.admin_email,
                password_hash=password_hash,
                is_admin=True,
                is_active=True,
            )
            session.add(new_admin)
            print(f"Creating new admin user: {settings.admin_email}")

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed_admin())
