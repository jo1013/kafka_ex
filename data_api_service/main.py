from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from typing import Optional
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from bson import ObjectId, json_util
import os
import json

# 환경 변수에서 설정 값 로드
KAFKA_TOPIC = os.getenv('KAFKA_TOPIC')
KAFKA_SERVER = os.getenv('KAFKA_SERVER')
MONGODB_URI = os.getenv('MONGODB_URI')
MONGODB_COLLECTION = os.getenv('MONGODB_COLLECTION')
MONGODB_GROUP_ID = os.getenv('MONGODB_GROUP_ID')
MONGODB_DATABASE = os.getenv('MONGODB_DATABASE')

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
    author: Optional[str] = None  # author 필드를 Optional로 변경
    title: str
    description: Optional[str] = None
    url: HttpUrl
    source: str
    image: Optional[HttpUrl] = None
    category: str
    language: str
    country: str
    published_at: datetime

    class Config:
        json_encoders = {
            ObjectId: lambda obj: str(obj),
            datetime: lambda dt: dt.isoformat()
        }
        allow_population_by_alias = True

@app.get("/")
async def read_root():
    news_data = collection.find_one({})
    if news_data:
        # MongoDB 문서의 '_id' 필드를 문자열로 변환
        news_data['_id'] = str(news_data['_id'])
        # MongoDB 문서를 Pydantic 모델로 변환
        return {"NewsData": NewsData(**news_data)}
    return {"NewsData": "No data found"}


@app.get("/news")
async def get_news(limit: int = 10):
    news_cursor = collection.find().limit(limit)  # limit 매개변수로 반환할 문서 수 제어
    news_list = [NewsData(**json_util.loads(json_util.dumps(news_item))) for news_item in news_cursor]
    return {"NewsData": news_list}

@app.get("/news/paginated")
async def get_paginated_news(page: int = 1, page_size: int = 10):
    skip = (page - 1) * page_size
    news_cursor = collection.find().skip(skip).limit(page_size)
    news_list = [NewsData(**json_util.loads(json_util.dumps(news_item))) for news_item in news_cursor]
    return {"NewsData": news_list}



@app.get("/news/filter")
async def get_filtered_news(category: Optional[str] = None, language: Optional[str] = None, limit: int = 10):
    query = {}
    if category:
        query["category"] = category
    if language:
        query["language"] = language
    news_cursor = collection.find(query).limit(limit)
    news_list = [NewsData(**json_util.loads(json_util.dumps(news_item))) for news_item in news_cursor]
    return {"NewsData": news_list}


@app.get("/healthcheck")
def mongodb_healthcheck():
    try:
        client.admin.command('ping')
        return {"status": "MongoDB connection is successful"}
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="MongoDB connection failed")
