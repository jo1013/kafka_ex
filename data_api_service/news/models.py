from pymongo import MongoClient
from bson import ObjectId
from database import db

class NewsModel:
    def __init__(self):
        self.collection = db.get_collection('news')

    def find_all(self, skip, limit):
        return list(self.collection.find().skip(skip).limit(limit))

    def find_by_id(self, news_id):
        return self.collection.find_one({"_id": ObjectId(news_id)})

    def insert_one(self, news_data):
        return self.collection.insert_one(news_data).inserted_id

    def update_one(self, news_id, news_data):
        return self.collection.update_one({"_id": ObjectId(news_id)}, {"$set": news_data})

    def delete_one(self, news_id):
        return self.collection.delete_one({"_id": ObjectId(news_id)})
