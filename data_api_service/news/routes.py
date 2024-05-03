# ## data_api_service/news/routes.py


# data_api_service/news/routes.py
from fastapi import APIRouter
from .models import NewsModel
from .schemas import NewsResponse, NewsData
from fastapi.encoders import jsonable_encoder
from typing import List
from bson import ObjectId

router = APIRouter()
news_model = NewsModel()

@router.get("/", response_model=NewsResponse)
async def get_news(page: int = 1, page_size: int = 10):
    skip = (page - 1) * page_size
    news_items, total_items = news_model.get_news(skip, page_size)
    news_list = [NewsData(**jsonable_encoder(news, custom_encoder={ObjectId: str})) for news in news_items]
    return NewsResponse(newsList=news_list, totalItems=total_items)

@router.get("/list", response_model=NewsResponse)
async def get_news_list() :
    news_items, total_items = news_model.get_news_list()
    news_list = [NewsData(**news) for news in news_items]
    return {"newsList": news_list, "totalItems": total_items}


