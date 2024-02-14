import requests
import json
import logging
import os
import time
from kafka import KafkaProducer

# 환경 변수 또는 설정 파일에서 Kafka 서버 및 API 키 로드
kafka_server = os.environ.get('KAFKA_SERVER')
mediastack_api_key = os.environ.get('MEDIASTACK_API_KEY')
keywords = ['crypto', 'tech', 'finance', 'blockchain']
last_call_file = 'last_call_timestamps.json'
min_interval = 3600  # 최소 호출 간격 (초)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Kafka Producer 설정
producer = KafkaProducer(bootstrap_servers=kafka_server,
                         api_version=(0, 11, 5),
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

def load_last_call_timestamps():
    if os.path.exists(last_call_file):
        with open(last_call_file, 'r') as file:
            return json.load(file)
    else:
        return {keyword: 0 for keyword in keywords}

def save_last_call_timestamps(timestamps):
    with open(last_call_file, 'w') as file:
        json.dump(timestamps, file)

last_call_timestamps = load_last_call_timestamps()

while True:  # 무한 루프로 변경
    for keyword in keywords:
        current_time = time.time()
        if current_time - last_call_timestamps.get(keyword, 0) < min_interval:
            logging.info(f"Skipping {keyword} due to interval limit.")
            continue

        try:
            url = "http://api.mediastack.com/v1/news"
            params = {
                'access_key': mediastack_api_key,
                'keywords': keyword,
                'countries': 'us,kr'
            }
            response = requests.get(url, params=params)
            if response.status_code == 200:
                news_data = response.json()['data']
                for article in news_data:
                    producer.send(keyword, article)
                last_call_timestamps[keyword] = current_time
                save_last_call_timestamps(last_call_timestamps)
                logging.info(f"Data collection complete for {keyword}")
            else:
                logging.error(f"Failed to fetch data for {keyword}")
        except Exception as e:
            logging.error("Error occurred: %s", str(e))

    # 일정 시간 대기 후 다시 시작
    time.sleep(min_interval)
