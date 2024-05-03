#### subscriptions/models.py
from datetime import datetime
from pymongo import DESCENDING, ASCENDING
from bson import ObjectId
from database import db


class SubscriptionModel:

    def __init__(self):
        self.collection = db.get_subscriptions_collection()

    def find_subscriptions(self, user_id, sort):
        # 정렬 순서를 결정합니다.
        sort_order = DESCENDING if sort.startswith('-') else ASCENDING
        sort_field = sort.lstrip('-+')  # '-' 또는 '+' 기호를 제거하여 순수 필드 이름을 추출합니다.

        # 사용자 ID로 필터링하고, 적절한 페이징과 정렬을 적용하여 구독 목록을 조회합니다.
        return list(
            self.collection.find({"user_id": ObjectId(user_id)})
            .sort(sort_field, sort_order)
        )
    def toggle_subscription(self, subscription_id, is_subscribe):
        update_result = self.collection.update_one(
            {"_id": ObjectId(subscription_id)},
            {"$set": {"is_subscribe": is_subscribe, "updated_at": datetime.utcnow()}}
        )
        return update_result.modified_count > 0
        
    def find_one(self, query):
        return self.collection.find_one(query)
