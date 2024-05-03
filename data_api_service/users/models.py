# data_api_service/users/model.py
from fastapi import HTTPException
import secrets
import string
from database import db
from .schemas import UserCreate, ClickEvent
import bcrypt
from datetime import datetime

user_collection = db.get_user_collection()

def create_user(user_data: UserCreate):
    if user_collection.find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    user_dict = user_data.dict(exclude={"password"})
    user_dict['password'] = hashed_password
    user_dict['created_at'] = user_dict['updated_at'] = datetime.utcnow()
    result = user_collection.insert_one(user_dict)
    user_dict['user_id'] = str(result.inserted_id)
    return user_dict


def authenticate_user(email: str, password: str):
    user = user_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return user

def reset_password(email: str):
    user = user_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(10))
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    user_collection.update_one({"_id": user['_id']}, {"$set": {"password": hashed_password}})
    return new_password

def record_click_event(click_data: ClickEvent):
    click_dict = click_data.dict()
    result = click_collection.insert_one(click_dict)
    return {"status": "success", "inserted_id": str(result.inserted_id)}
