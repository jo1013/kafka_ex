from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import os
import time

# 환경 변수에서 설정 값 로드
time.sleep(60)
    
app = FastAPI()

# MongoDB에 연결
client = MongoClient(
    host=os.environ["MONGODB_HOST"],
    port=os.environ["MONGODB_PORT"],
    username=os.environ["MONGODB_ROOT_USERNAME"],
    password=os.environ["MONGODB_ROOT_PASSWORD"],
)
db = client[os.environ["MONGODB_DATABASE"]]

@app.get("/")
def read_root():

    news_data = db.news.find_one({})
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