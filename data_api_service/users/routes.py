# data_api_service/users/routes.py
from fastapi import APIRouter, status, HTTPException
from .schemas import UserCreate, UserDisplay, UserLogin, UserPasswordReset
from .models import authenticate_user, create_user, reset_password

router = APIRouter()

@router.post("/signup", response_model=UserDisplay, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate):
    user_dict = create_user(user_data)
    return UserDisplay(**user_dict)

@router.post("/login", response_model=UserDisplay)
def login(user_credentials: UserLogin):
    user = authenticate_user(user_credentials.email, user_credentials.password)
    if user:
        return {"message": "Login successful", "user_id": str(user['_id'])}
    else:
        raise HTTPException(status_code=401, detail="Login failed")

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password_api(request: UserPasswordReset):
    reset_password(request.email)
    return {"message": "Password reset instructions have been sent to your email."}