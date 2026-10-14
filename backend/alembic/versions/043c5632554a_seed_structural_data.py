"""seed structural data

Revision ID: 043c5632554a
Revises: 9970da9146ba
Create Date: 2026-10-12 20:58:48.316700

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "043c5632554a"
down_revision: Union[str, None] = "9970da9146ba"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Insert Archive Collection
    op.execute(
        """
        INSERT INTO collections(name, nickname, sort_order, is_archive, theme_preset)

        VALUES('Archive', NULL, 0, TRUE, 'kodak')
        """
    )

    # Insert the ecommerce feature flag (off by default)

    op.execute(
        """
        INSERT INTO feature_flags(name, is_enabled)\
        VALUES('ecommerce', FALSE)
        """
    )


def downgrade() -> None:
    # Delete Archive Collection
    op.execute(
        """
        DELETE FROM collections WHERE name='Archive'
        """
    )

    # Delete the ecommerce feature flag

    op.execute(
        """
        DELETE FROM feature_flags WHERE name='ecommerce'
        """
    )
