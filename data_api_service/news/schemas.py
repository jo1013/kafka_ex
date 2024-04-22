

from typing import List
from fastapi import APIRouter
from pydantic import BaseModel, Field
from bson import ObjectId
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Dict, Any, Optional
from datetime import datetime
from bson import ObjectId


router = APIRouter()

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

class NewsCreate(NewsData):
    pass

class NewsUpdate(NewsData):
    pass


