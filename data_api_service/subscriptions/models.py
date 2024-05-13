# data_api_service/subscriptions/models.py
from datetime import datetime
from bson import ObjectId
from database import db
from common import to_str_id 
from .schemas import SubscriptionCreate

class SubscriptionModel:

    def __init__(self):
        self.collection = db.get_subscriptions_collection()

    def find_subscriptions(self, user_id, sort):
        # 정렬 순서를 결정합니다.
        sort_order = -1 if sort.startswith('-') else 1
        sort_field = sort.lstrip('-+')  # '-' 또는 '+' 기호를 제거하여 순수 필드 이름을 추출합니다.


        subscriptions = list(
            self.collection.find({"user_id": ObjectId(user_id)}).sort(sort_field, sort_order)
        )
        return [
            {
                **sub,
                '_id': to_str_id(sub['_id']),
                'user_id': to_str_id(sub['user_id']),
                'created_at': sub['created_at'].isoformat(),
                'updated_at': sub['updated_at'].isoformat()
            } for sub in subscriptions
        ]

    def toggle_subscription(self, subscription_id, is_subscribe):
        update_result = self.collection.update_one(
            {"_id": ObjectId(subscription_id)},
            {"$set": {"is_subscribe": is_subscribe, "updated_at": datetime.utcnow()}}
        )
        return update_result.modified_count > 0

    def find_one(self, query):
        if '_id' in query:
            query['_id'] = ObjectId(query['_id'])
        if 'user_id' in query:
            query['user_id'] = ObjectId(query['user_id'])        
        sub = self.collection.find_one(query)
        if sub:
            return {
                **sub,
                '_id': to_str_id(sub['_id']),
                'user_id': to_str_id(sub['user_id']),
                'news_id': sub['news_id'],
                'created_at': sub['created_at'].isoformat(),
                'updated_at': sub['updated_at'].isoformat()
            }
        return None

    def create_subscription(self, subscription_data: SubscriptionCreate):
        new_subscription = subscription_data.dict()
        new_subscription["created_at"] = new_subscription["updated_at"] = datetime.utcnow()
        new_subscription["user_id"] = ObjectId(new_subscription["user_id"])
        new_subscription_id = self.collection.insert_one(new_subscription).inserted_id
        return to_str_id(new_subscription_id)