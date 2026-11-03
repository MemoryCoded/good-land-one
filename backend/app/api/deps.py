from fastapi import Header, HTTPException, status
from app.config import settings


async def get_current_admin(
    authorization: str = Header(..., description="Bearer<token>"),
):
    # Check if header is provided
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )

    # Check if matches secret key
    expected_token = f"Bearer {settings.admin_api_key}"

    # TEMPORARY DEBUG PRINTS
    print("\n--- AUTH DEBUG ---")
    print(f"EXPECTED: '{expected_token}'")
    print(f"RECEIVED: '{authorization}'")
    print("------------------\n")

    if authorization != expected_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid admin token",
        )

    return True
