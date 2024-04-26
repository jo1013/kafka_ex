## subscriptions/routes.py
from fastapi import APIRouter, HTTPException
from .models import SubscriptionModel
from .schemas import Subscription, SubscriptionCreate, SubscriptionUpdate
from typing import List
from database import db
from typing import List
from fastapi import APIRouter, Query, HTTPException
from .models import SubscriptionModel
from .schemas import Subscription
from database import db




router = APIRouter()
sub_collection = db.get_subscriptions_collection()




@router.get("/", response_model=List[Subscription])
async def fetch_subscribed_news(user_id: str, page: int = 1, page_size: int = 10, sort: str = "-created_at"):
    subscription_model = SubscriptionModel()
    skip = (page - 1) * page_size
    subscriptions = subscription_model.find_subscriptions(user_id, skip, page_size, sort)
    return subscriptions


# 뉴스 구독
@router.post("/{news_id}/subscribe", response_model=Subscription)
async def subscribe_news(news_id: str, user_id: str):
    subscription_model = SubscriptionModel()
    subscription_data = {"user_id": user_id, "news_id": news_id}
    subscription_id = subscription_model.insert_one(subscription_data)
    return {**subscription_data, "id": str(subscription_id)}

# 뉴스 구독 취소
@router.post("/{news_id}/unsubscribe")
async def unsubscribe_news(news_id: str, user_id: str):
    subscription_model = SubscriptionModel()
    result = subscription_model.delete_subscription_by_news_id(news_id, user_id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"message": "Subscription successfully cancelled"}


@router.post("/", response_model=Subscription)
async def create_subscription(subscription: SubscriptionCreate):
    subscription_model = SubscriptionModel()
    subscription_id = subscription_model.insert_one(subscription.dict())
    return {**subscription.dict(), "id": str(subscription_id)}

@router.put("/{subscription_id}", response_model=Subscription)
async def update_subscription(subscription_id: str, subscription: SubscriptionUpdate):
    subscription_model = SubscriptionModel()
    updated_subscription = subscription_model.update_one(subscription_id, subscription.dict())
    if updated_subscription.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {**subscription.dict(), "id": subscription_id}

@router.delete("/{subscription_id}")
async def delete_subscription(subscription_id: str):
    subscription_model = SubscriptionModel()
    deleted_subscription = subscription_model.delete_one(subscription_id)
    if deleted_subscription.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"message": "Subscription deleted successfully"}
