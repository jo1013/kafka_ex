from pymongo import DESCENDING
from bson import ObjectId
from database import db



class NewsModel:
    def __init__(self):
        self.news_collection = db.get_news_collection()
        self.news_list_collection = db.get_news_list_collection()

    def get_news(self, skip: int, limit: int):
        news_cursor = self.news_collection.find().sort([("published_at", DESCENDING)]).skip(skip).limit(limit)
        total_items = self.news_collection.count_documents({})
        return list(news_cursor), total_items

    def get_news_list(self):
        news_cursor = self.news_list_collection.find().sort([("published_at", DESCENDING)])
        total_items = self.news_list_collection.count_documents({})
        return list(news_cursor), total_items
        

    def find_by_id(self, news_id):
        return self.news_collection.find_one({"_id": ObjectId(news_id)})

    def insert_one(self, news_data):
        return self.news_collection.insert_one(news_data).inserted_id

    def update_one(self, news_id, news_data):
        return self.news_collection.update_one({"_id": ObjectId(news_id)}, {"$set": news_data})

    def delete_one(self, news_id):
        return self.news_collection.delete_one({"_id": ObjectId(news_id)})
