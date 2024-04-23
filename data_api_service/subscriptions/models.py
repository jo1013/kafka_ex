from pymongo import MongoClient
from bson import ObjectId
from database import db

class SubscriptionModel:
    def __init__(self):
        self.collection = db.get_subscriptions_collection()

    def find_all(self, user_id):
        return list(self.collection.find({"user_id": ObjectId(user_id)}))

    def find_by_id(self, subscription_id):
        return self.collection.find_one({"_id": ObjectId(subscription_id)})

    def insert_one(self, subscription_data):
        return self.collection.insert_one(subscription_data).inserted_id

    def update_one(self, subscription_id, subscription_data):
        return self.collection.update_one({"_id": ObjectId(subscription_id)}, {"$set": subscription_data})

    def delete_one(self, subscription_id):
        return self.collection.delete_one({"_id": ObjectId(subscription_id)})
