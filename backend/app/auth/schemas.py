from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    user_type: str = "customer"

class UserProfile(BaseModel):
    name: str
    email: str
    role: str

class LoginResponse(BaseModel):
    status: str
    user_type: str
    redirect_target: str
    user: UserProfile
