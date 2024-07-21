# data_api_service/users/routes.py
import os
from datetime import timedelta, datetime
from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from .schemas import UserCreate, UserDisplay, UserLogin, UserPasswordReset, LoginResponse, ClickEvent
from .models import authenticate_user, create_user, reset_password, record_click_event, UserModel
from .schemas import Token, User
from dependencies import create_access_token, decode_access_token

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 30

user_model = UserModel()

@router.post("/click", status_code=status.HTTP_201_CREATED)
def record_click(click_data: ClickEvent):
    result = record_click_event(click_data)
    return result

@router.post("/signup", response_model=UserDisplay, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate):
    try:
        user_dict = create_user(user_data)
        return UserDisplay(**user_dict)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=LoginResponse)
def login(user_credentials: UserLogin):
    user = authenticate_user(user_credentials.email, user_credentials.password)
    if user:
        access_token = create_access_token(data={"user_id": str(user['_id'])}, expires_delta=timedelta(minutes=15))
        return {"message": "Login successful", "token": access_token, "user_id": str(user['_id'])}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password_api(request: UserPasswordReset):
    reset_password(request.email)
    return {"message": "Password reset instructions have been sent to your email."}



@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = user_model.find_by_username(form_data.username)
    if not user or not user_model.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_id": str(user["_id"])}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
async def register_user(user: User):
    existing_user = user_model.find_by_username(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    user_id = user_model.create_user(user.username, user.password)
    return {"message": "User registered successfully", "user_id": user_id}

@router.get("/me", response_model=User)
async def read_users_me(token: str = Depends(decode_access_token)):
    user = user_model.find_by_id(token)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)