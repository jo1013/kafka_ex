# data_api_service/subscriptions/routes.py
import logging
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from fastapi import APIRouter, Query, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from database import db
from dependencies import decode_access_token
from .models import SubscriptionModel
from .schemas import Subscription, SubscriptionCreate

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("uvicorn")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")


@router.get("/", response_model=List[Subscription])
async def fetch_subscribed_news(token: str = Depends(oauth2_scheme)):
    user_id = decode_access_token(token)
    subscription_model = SubscriptionModel()
    subscriptions = subscription_model.find_subscriptions(user_id, 'updated_at')
    return subscriptions


@router.patch("/{news_id}", response_model=Subscription)
async def toggle_subscription(
    news_id: str,
    action: str = Query(..., regex="^(subscribe|unsubscribe)$"),
    token: str = Depends(oauth2_scheme)
):
    user_id = decode_access_token(token)
    subscription_model = SubscriptionModel()

    # Fetch the current state of the subscription
    existing_subscription = subscription_model.find_one({"news_id": news_id, "user_id": ObjectId(user_id)})
    
    if existing_subscription:
        new_is_subscribe = action == "subscribe"
        if existing_subscription["is_subscribe"] == new_is_subscribe:
            raise HTTPException(
                status_code=400,
                detail=f"Already {'subscribed' if new_is_subscribe else 'unsubscribed'}"
            )

        successful_update = subscription_model.toggle_subscription(existing_subscription["_id"], new_is_subscribe)

        if not successful_update:
            raise HTTPException(status_code=500, detail="Failed to update subscription")

        return subscription_model.find_one({"_id": existing_subscription["_id"]})

    else:
        if action == "subscribe":
            new_subscription = SubscriptionCreate(
                user_id=user_id,
                news_id=news_id,
                is_subscribe=True
            )
            created_subscription_id = subscription_model.create_subscription(new_subscription.dict())
            return subscription_model.find_one({"_id": created_subscription_id})

        raise HTTPException(status_code=404, detail="Subscription not found")
