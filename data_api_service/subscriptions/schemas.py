## subscriptions/schemas.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SubscriptionBase(BaseModel):
    user_id: str
    news_id: str
    is_subscribe: bool

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    tag: Optional[str] = None
    source: Optional[str] = None
    class Config:
        orm_mode = True


class Subscription(SubscriptionBase):
    id: Optional[str] = None  # 데이터베이스에서 자동 할당된 ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "user_id": "user123",
                "news_id": "news456",
                "is_subscribe": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
        }
        
class SubscriptionInDB(SubscriptionBase):
    # 이 클래스는 데이터베이스에서 읽은 데이터를 나타내며, DB에 의해 자동으로 관리되는 필드를 추가할 수 있습니다.
    id: Optional[str] = None  # 데이터베이스에서 자동으로 할당되는 ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None  # 업데이트 시점을 기록합니다.

    class Config:
        orm_mode = True  # ORM 모드를 활성화하여 데이터베이스 객체와의 호환성을 보장합니다.
        schema_extra = {
            "example": {
                "id": "123",
                "user_id": "user123",
                "news_id": "news456",
                "is_subscribe": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
        }