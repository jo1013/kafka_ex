from fastapi import APIRouter, HTTPException
from .models import NewsModel
from .schemas import News, NewsCreate, NewsUpdate
from typing import List
from database import db


router = APIRouter()

@router.get("/", response_model=List[News])
async def read_news(skip: int = 0, limit: int = 10):
    news_model = NewsModel()
    news = news_model.find_all(skip, limit)
    return [NewsInDB(**item) for item in news]

@router.get("/{news_id}", response_model=News)
async def read_news_by_id(news_id: str):
    news_model = NewsModel()
    news_item = news_model.find_by_id(news_id)
    if news_item is None:
        raise HTTPException(status_code=404, detail="News not found")
    return NewsInDB(**news_item)

@router.post("/", response_model=News)
async def create_news(news: NewsCreate):
    news_model = NewsModel()
    news_id = news_model.insert_one(news.dict())
    return {**news.dict(), "id": str(news_id)}

@router.put("/{news_id}", response_model=News)
async def update_news(news_id: str, news: NewsUpdate):
    news_model = NewsModel()
    updated_news = news_model.update_one(news_id, news.dict())
    if updated_news.matched_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {**news.dict(), "id": news_id}

@router.delete("/{news_id}")
async def delete_news(news_id: str):
    news_model = NewsModel()
    deleted_news = news_model.delete_one(news_id)
    if deleted_news.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "News deleted successfully"}
