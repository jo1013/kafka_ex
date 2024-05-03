# data_api_service/users/routes.py
from fastapi import APIRouter, status, HTTPException, Depends
from datetime import timedelta
from .schemas import UserCreate, UserDisplay, UserLogin, UserPasswordReset, LoginResponse, ClickEvent
from .models import authenticate_user, create_user, reset_password, record_click_event
from dependencies import create_access_token  # JWT 생성 함수를 공용 dependencies에서 가져오기


router = APIRouter()


@router.post("/click", status_code=status.HTTP_201_CREATED)
def record_click(click_data: ClickEvent):
    result = record_click_event(click_data)
    return result

@router.post("/signup", response_model=UserDisplay, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate):
    user_dict = create_user(user_data)
    return UserDisplay(**user_dict)

@router.post("/login", response_model=LoginResponse)
def login(user_credentials: UserLogin):
    user = authenticate_user(user_credentials.email, user_credentials.password)
    if user:
        # access_token = create_access_token(data={"user_id": str(user.id)}, expires_delta=timedelta(minutes=15))
        # return {"message": "Login successful", "token": access_token, "user_id" : user.id}
        access_token = create_access_token(data={"user_id": str(user['_id'])}, expires_delta=timedelta(minutes=15))
        return {"message": "Login successful", "token": access_token, "user_id": str(user['_id'])}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password_api(request: UserPasswordReset):
    reset_password(request.email)
    return {"message": "Password reset instructions have been sent to your email."}