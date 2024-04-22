from fastapi import APIRouter
from .models import NewsModel
from .schemas import *
from typing import List
from database import db
from fastapi.encoders import jsonable_encoder
from typing import List, Dict, Any, Optional
from datetime import datetime
from pymongo import DESCENDING
from bson import ObjectId
import os
import json
import secrets
import string

router = APIRouter()
news_collection = db.get_news_collection()

@router.get("/", response_model=NewsResponse)
async def get_news(page: int = 1, page_size: int = 10):
    skip = (page - 1) * page_size    
    news_cursor = news_collection.find().sort([("published_at", DESCENDING)]).skip(skip).limit(page_size) # 최신 뉴스부터 정렬
    news_list = [NewsData(**jsonable_encoder(news, custom_encoder={ObjectId: str})) for news in news_cursor]
    total_items = news_collection.count_documents({})
    return NewsResponse(newsList=news_list, totalItems=total_items)
