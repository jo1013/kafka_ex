from fastapi import FastAPI
from pymongo import MongoClient
import os
import time
# 환경 변수에서 설정 값 로드





time.sleep(60)
    
app = FastAPI()

# MongoDB에 연결
client = MongoClient(
    host=os.environ["MONGODB_HOST"],
    username=os.environ["MONGODB_ROOT_USERNAME"],
    password=os.environ["MONGODB_ROOT_PASSWORD"],
)
db = client[os.environ["MONGODB_DATABASE"]]

@app.get("/")
def read_root():

    news_data = db.news.find_one({})
    return {"NewsData": news_data}
