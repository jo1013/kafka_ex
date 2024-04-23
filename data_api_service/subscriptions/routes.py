from fastapi import APIRouter, HTTPException
from .models import SubscriptionModel
from .schemas import Subscription, SubscriptionCreate, SubscriptionUpdate
from typing import List
from database import db

router = APIRouter()
sub_collection = db.get_subscriptions_collection()


@router.get("/", response_model=List[Subscription])
async def read_subscriptions(user_id: str):
    subscription_model = SubscriptionModel()
    subscriptions = subscription_model.find_all(user_id)
    return [sub_collection(**item) for item in subscriptions]

@router.get("/{subscription_id}", response_model=Subscription)
async def read_subscription_by_id(subscription_id: str):
    subscription_model = SubscriptionModel()
    subscription_item = subscription_model.find_by_id(subscription_id)
    if subscription_item is None:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub_collection(**subscription_item)

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
