## subscriptions/routes.py
import logging
from typing import List
from datetime import datetime
from fastapi import APIRouter, Query, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from database import db
from dependencies import decode_access_token
from .models import SubscriptionModel
from .schemas import Subscription, SubscriptionCreate

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("uvicorn")

router = APIRouter()
sub_collection = db.get_subscriptions_collection()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.get("/", response_model=List[Subscription])
async def fetch_subscribed_news(token: str = Depends(oauth2_scheme)):
    user_id = decode_access_token(token)
    subscription_model = SubscriptionModel()
    subscriptions = subscription_model.find_subscriptions(user_id, 'updated_at')
    return subscriptions


@router.patch("/{news_id}", response_model=Subscription)
async def toggle_subscription(news_id: str, action: str = Query(..., regex="^(subscribe|unsubscribe)$"), token: str = Depends(oauth2_scheme)):
    user_id = decode_access_token(token)
    subscription_model = SubscriptionModel()

    # Fetch the current state of the subscription
    existing_subscription = subscription_model.find_by_id({"news_id": news_id, "user_id": user_id})
    if not existing_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")

    # Determine the new subscription state based on the action
    new_is_subscribe = True if action == "subscribe" else False

    # Update if there's a change in subscription status or refresh the updated_at timestamp
    if existing_subscription.get("is_subscribe") != new_is_subscribe or action == "subscribe":
        successful_update = subscription_model.toggle_subscription(existing_subscription["_id"], new_is_subscribe)
        if not successful_update:
            raise HTTPException(status_code=500, detail="Failed to update subscription")
        return subscription_model.find_by_id(existing_subscription["_id"])
    else:
        # If already subscribed and trying to subscribe again, or vice versa
        raise HTTPException(status_code=400, detail="No change in subscription status required")

    return existing_subscription