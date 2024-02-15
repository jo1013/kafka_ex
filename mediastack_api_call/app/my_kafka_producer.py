import requests
import json
import logging
import os
import time
from kafka import KafkaProducer

# 환경 변수 또는 설정 파일에서 Kafka 서버 및 API 키 로드
kafka_server = os.environ.get('KAFKA_SERVER')
mediastack_api_key = os.environ.get('MEDIASTACK_API_KEY')
kafka_topics = os.environ.get('KAFKA_TOPICS').replace(' ','').split(',')
last_call_file = 'last_call_timestamps.json'
min_interval = 3600  # 최소 호출 간격 (초)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Kafka Producer 설정
producer = KafkaProducer(bootstrap_servers=kafka_server,
                         api_version=(0, 11, 5),
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

def load_last_call_timestamps(last_call_file):
    # 파일이 존재하는지 및 비어 있지 않은지 확인
    if os.path.exists(last_call_file) and os.path.getsize(last_call_file) > 0:
        try:
            with open(last_call_file, 'r') as file:
                return json.load(file)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from {last_call_file}: {e}")
            # JSON 디코딩 실패 시 빈 딕셔너리 반환
            return {}
    else:
        # 파일이 비어 있거나 존재하지 않을 경우 빈 딕셔너리 반환
        print(f"No data found in {last_call_file}, initializing with empty dictionary.")
        return {}

def save_last_call_timestamps(timestamps):
    with open(last_call_file, 'w') as file:
        json.dump(timestamps, file)

last_call_timestamps = load_last_call_timestamps(last_call_file)

while True:  # 무한 루프로 변경
    for topic in kafka_topics:
        current_time = time.time()
        if current_time - last_call_timestamps.get(topic, 0) < min_interval:
            logging.info(f"Skipping {topic} due to interval limit.")
            continue

        try:
            url = "http://api.mediastack.com/v1/news"
            params = {
                'access_key': mediastack_api_key,
                'keywords': topic,
                'countries': 'us,kr'
            }
            response = requests.get(url, params=params)
            if response.status_code == 200:
                news_data = response.json()['data']
                for article in news_data:
                    producer.send(topic, article)
                last_call_timestamps[topic] = current_time
                save_last_call_timestamps(last_call_timestamps)
                logging.info(f"Data collection complete for {topic}")
            else:
                logging.error(f"Failed to fetch data for {topic}")
        except Exception as e:
            logging.error("Error occurred: %s", str(e))

    # 일정 시간 대기 후 다시 시작
    time.sleep(min_interval)
