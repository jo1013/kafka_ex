from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from bson import ObjectId
import os

# 환경 변수에서 설정 값 로드
KAFKA_TOPIC = os.getenv('KAFKA_TOPIC')
KAFKA_SERVER = os.getenv('KAFKA_SERVER')
MONGODB_URI = os.getenv('MONGODB_URI')
MONGODB_COLLECTION = os.getenv('MONGODB_COLLECTION')
MONGODB_GROUP_ID = os.getenv('MONGODB_GROUP_ID')
MONGODB_DATABASE = os.getenv('MONGODB_DATABASE')

app = FastAPI()

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client[MONGODB_DATABASE]
collection = db.get_collection(MONGODB_COLLECTION)

# Pydantic 모델에서 ObjectId를 처리하기 위한 클래스
# class PyObjectId(ObjectId):
#     @classmethod
#     def __get_validators__(cls):
#         yield cls.validate

#     @classmethod
#     def validate(cls, v):
#         if not ObjectId.is_valid(v):
#             raise ValueError(f"Not a valid ObjectId: {v}")
#         return ObjectId(v)

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
    data: Optional[dict] = None

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_alias = True

@app.get("/")
def read_root():
    news_data = collection.find_one({})
    if news_data:
        return {"NewsData": NewsData(**news_data).dict(by_alias=True)}
    return {"NewsData": "No data found"}

@app.get("/healthcheck")
def mongodb_healthcheck():
    try:
        client.admin.command('ping')
        return {"status": "MongoDB connection is successful"}
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="MongoDB connection failed")
