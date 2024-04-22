# users/models.py
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import List, Optional

class User(BaseModel):
    email: EmailStr
    password: str
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    subscriptions: List[str]

class UserSignUp(BaseModel):
    email: EmailStr
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    subscriptions: List[str] = []

class UserPasswordReset(BaseModel):
    email: str
