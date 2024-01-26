from fastapi import FastAPI
from pymongo import MongoClient
import os

app = FastAPI()

# MongoDB에 연결
client = MongoClient(
    host=os.environ["MONGODB_HOST"],
    username=os.environ["MONGO_INITDB_ROOT_USERNAME"],
    password=os.environ["MONGO_INITDB_ROOT_PASSWORD"],
)
db = client[os.environ["MONGO_INITDB_DATABASE"]]

@app.get("/")
def read_root():
    # MongoDB에서 데이터를 가져오는 예제 쿼리
    news_data = db.news.find_one({})
    return {"Hello": "World", "NewsData": news_data}
