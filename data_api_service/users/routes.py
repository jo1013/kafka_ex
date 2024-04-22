# users/routes.py
from fastapi import APIRouter, HTTPException
from .models import UserSignUp, User, UserPasswordReset
from bson import ObjectId
from datetime import datetime
from database.connection import db_instance
from fastapi import APIRouter
from database import db
import bcrypt

router = APIRouter()

@router.post("/signup", response_model=User)
async def signup(user_data: UserSignUp, db: Any):
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    user_data.password = hashed_password
    user_data.created_at = user_data.updated_at = datetime.utcnow()
    result = db.user_collection.insert_one(user_data.dict())
    user_data.user_id = str(result.inserted_id)
    return user_data

@router.post("/login", response_model=User)
async def login(user_data: User, db: Any):
    user = db.user_collection.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not bcrypt.checkpw(user_data.password.encode('utf-8'), user['password']):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return user

@router.post("/find-password", response_model=str)
async def find_password(request: UserPasswordReset, db: Any):
    user = db.user_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(10))
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    db.user_collection.update_one({"_id": user['_id']}, {"$set": {"password": hashed_password}})
    return new_password

