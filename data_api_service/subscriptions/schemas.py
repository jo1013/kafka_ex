## subscriptions/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SubscriptionBase(BaseModel):
    user_id: str
    tag: Optional[str] = None
    source: Optional[str] = None

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    tag: Optional[str] = None
    source: Optional[str] = None
    class Config:
        orm_mode = True


class Subscription(SubscriptionBase):
    pass

class SubscriptionInDB(SubscriptionBase):
    pass
