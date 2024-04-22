# database.py
from pymongo import MongoClient
import os

class Database:
    def __init__(self):
        # 일반 데이터베이스 연결
        self.client = MongoClient(os.getenv('MONGODB_URI'))
        self.db = self.client[os.getenv('MONGODB_DATABASE')]
        self.collection = self.db[os.getenv('MONGODB_COLLECTION')]

        # 사용자 정보 데이터베이스 연결
        self.user_client = MongoClient(os.getenv('MONGODB_USER_URI'))
        self.user_db = self.user_client[os.getenv('MONGODB_USER_DATABASE')]
        self.user_collection = self.user_db[os.getenv('MONGODB_USER_INFO_COLLECTION')]

    def get_collection(self, collection_name):
        return self.db[collection_name]

    def get_user_collection(self, collection_name):
        return self.user_db[collection_name]

db = Database()
