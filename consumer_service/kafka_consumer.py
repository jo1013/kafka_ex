from kafka import KafkaConsumer
from pymongo import MongoClient
import json
import os
import time
# 환경 변수에서 설정 값 로드
KAFKA_TOPIC = os.environ.get('KAFKA_TOPIC') 
KAFKA_SERVER = os.environ.get('KAFKA_SERVER') 
MONGODB_URI = os.environ.get('MONGODB_URI')
MONGODB_COLLECTION = os.environ.get('MONGODB_COLLECTION')
MONGODB_GROUP_ID = os.environ.get('MONGODB_GROUP_ID')




def main():
    time.sleep(60)
    # MongoDB 클라이언트 설정
    client = MongoClient(MONGODB_URI)
    db = client.get_default_database()
    
    # MongoDB에 컬렉션이 존재하는지 확인
    if MONGODB_COLLECTION not in db.list_collection_names():
        print(f"Creating new collection: {MONGODB_COLLECTION}")
    
    collection = db[MONGODB_COLLECTION]

    # Kafka Consumer 설정
    consumer = KafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=[KAFKA_SERVER],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id=MONGODB_GROUP_ID,  # 적절한 그룹 ID로 변경
        value_deserializer=lambda x: json.loads(x.decode('utf-8')))

    # Kafka에서 메시지 읽기 및 MongoDB에 저장
    for message in consumer:
        msg_data = message.value
        print("Received message:", msg_data)
        # MongoDB에 데이터 삽입
        collection.insert_one(msg_data)

if __name__ == "__main__":
    main()
