from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Dict, Any
from datetime import datetime
from typing import Optional
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from bson import ObjectId, errors
import os
import json

# Database connection
MONGODB_URI = os.getenv('MONGODB_URI')
MONGODB_DATABASE = os.getenv('MONGODB_DATABASE')
MONGODB_COLLECTION = os.getenv('MONGODB_COLLECTION')

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DATABASE]
collection = db[MONGODB_COLLECTION]

app = FastAPI()




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows all origins for testing purposes. Adjust in production.
    allow_credentials=True,
    allow_methods=["*"],  # This allows all methods.
    allow_headers=["*"],  # This allows all headers.
)


client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client[MONGODB_DATABASE]
collection = db.get_collection(MONGODB_COLLECTION)



# Pydantic 모델에서 ObjectId를 처리하기 위한 클래스
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value, values, **kwargs):
        if not ObjectId.is_valid(value):
            raise ValueError(f"Not a valid ObjectId: {value}")
        return ObjectId(value)




# MongoDB 문서를 나타내는 Pydantic 모델
class NewsData(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    author: Optional[str] = None
    title: str
    description: Optional[str] = None
    url: HttpUrl
    source: str
    image: Optional[HttpUrl] = None
    category: Optional[str] = None  # 선택적으로 변경
    language: Optional[str] = None  # 선택적으로 변경
    country: Optional[str] = None  # 선택적으로 변경
    published_at: Optional[datetime] = None  # 선택적으로 변경

 
    class Config:
        orm_mode = True
        json_encoders = {ObjectId: str}

# 새로운 응답 모델 정의
class NewsResponse(BaseModel):
    newsList: List[NewsData]
    totalItems: int


@app.get("/news", response_model=NewsResponse)
async def get_news(page: int = 1, page_size: int = 10):
    skip = (page - 1) * page_size
    news_cursor = collection.find().skip(skip).limit(page_size)
    news_list = [NewsData(**jsonable_encoder(news, custom_encoder={ObjectId: str})) for news in news_cursor]
    total_items = collection.count_documents({})
    return NewsResponse(newsList=news_list, totalItems=total_items)



@app.get("/news/details/{news_id}", response_model=NewsData)
async def get_news_details(news_id: str):
    try:
        news_item = collection.find_one({"_id": ObjectId(news_id)})
        if not news_item:
            raise HTTPException(status_code=404, detail="News not found")
        return news_item
    except errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid news ID format")


@app.get("/healthcheck")
def mongodb_healthcheck():
    try:
        client.admin.command('ping')
        return {"status": "MongoDB connection is successful"}
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="MongoDB connection failed")
