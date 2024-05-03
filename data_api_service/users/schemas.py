# data_api_service/users/schemas.py
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    subscriptions: List[str] = []

class LoginResponse(BaseModel):
    message : str
    user_id : Optional[str] = None
    token: str



class UserDisplay(UserBase):
    user_id: str
    created_at: datetime
    updated_at: datetime
    subscriptions: List[str]

class UserLogin(UserBase):
    password: str

class UserPasswordReset(BaseModel):
    email: EmailStr

class User(BaseModel):
    email: str
    password: str
    user_id: Optional[str] = None


class ClickEvent(BaseModel):
    user_id: str
    news_id: str
    activity_type: str = "click"
    timestamp: datetime = Field(default_factory=datetime.utcnow)