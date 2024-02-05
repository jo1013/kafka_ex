from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import os
import time


KAFKA_TOPIC = os.environ.get('KAFKA_TOPIC') 
KAFKA_SERVER = os.environ.get('KAFKA_SERVER') 
MONGODB_URI = os.environ.get('MONGODB_URI')
MONGODB_COLLECTION = os.environ.get('MONGODB_COLLECTION')
MONGODB_GROUP_ID = os.environ.get('MONGODB_GROUP_ID')
MONGODB_DATABASE = os.environ.get('MONGODB_DATABASE')

# 환경 변수에서 설정 값 로드
time.sleep(60)
    
app = FastAPI()


client = MongoClient(MONGODB_URI)

db = client[MONGODB_DATABASE]
collection = db.get_collection(MONGODB_COLLECTION)

@app.get("/")
def read_root():
    news_data = collection.find_one({})
    return {"NewsData": news_data}

@app.get("/healthcheck")
def mongodb_healthcheck():
    try:
        # MongoDB 서버와의 연결 상태를 확인합니다.
        # 이는 서버가 응답하는지 확인하는 간단한 방법입니다.
        client.admin.command('ping')
        return {"status": "MongoDB connection is successful"}
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="MongoDB connection failed")