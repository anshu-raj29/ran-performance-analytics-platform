from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token
from app.models.schemas import LoginRequest, LoginResponse


router = APIRouter(tags=["authentication"])

DUMMY_USERS = {
    "admin": {
        "password": "admin123",
        "role": "Admin",
        "display_name": "RAN Operations Admin",
    },
    "admin@ran-lab.local": {
        "password": "admin123",
        "role": "Admin",
        "display_name": "RAN Operations Admin",
    },
    "analyst": {
        "password": "analyst123",
        "role": "Analyst",
        "display_name": "Network Intelligence Analyst",
    },
    "analyst@ran-lab.local": {
        "password": "analyst123",
        "role": "Analyst",
        "display_name": "Network Intelligence Analyst",
    },
}


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest) -> LoginResponse:
    user = DUMMY_USERS.get(payload.username.lower())
    if not user or user["password"] != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    return LoginResponse(
        access_token=create_access_token(payload.username.lower(), user["role"]),
        role=user["role"],
        display_name=user["display_name"],
    )
