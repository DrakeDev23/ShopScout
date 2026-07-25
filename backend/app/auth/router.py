from fastapi import APIRouter, HTTPException
from app.auth.schemas import LoginRequest, LoginResponse, UserProfile

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    if request.user_type == "store":
        return LoginResponse(
            status="success",
            user_type="store",
            redirect_target="owner",
            user=UserProfile(
                name="Store Owner",
                email=request.email,
                role="store_owner"
            )
        )
    return LoginResponse(
        status="success",
        user_type="customer",
        redirect_target="customer",
        user=UserProfile(
            name="Alex Morgan",
            email=request.email,
            role="customer"
        )
    )
