from pydantic import BaseModel, Field
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

class SubscriptionInDBBase(SubscriptionBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class Subscription(SubscriptionInDBBase):
    pass

class SubscriptionInDB(SubscriptionInDBBase):
    pass
