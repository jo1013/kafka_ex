import requests
import json
import logging
import os
import time
from kafka import KafkaProducer

# 환경 변수 또는 설정 파일에서 Kafka 서버 및 API 키 로드
kafka_server = os.getenv('KAFKA_SERVER')
gnews_api_key = os.getenv('GNEWS_API_KEY')
kafka_topics = os.getenv('KAFKA_TOPICS', '').replace(' ', '').split(',')
last_call_file = 'last_call_timestamps.json'
min_interval = 3600  # 최소 호출 간격 (초)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Kafka Producer 설정
producer = KafkaProducer(bootstrap_servers=kafka_server,
                         api_version=(0, 11, 5),
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

def load_last_call_timestamps():
    try:
        with open(last_call_file, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        logging.info(f"No data found or decode error in {last_call_file}, initializing with empty dictionary.")
        return {}

def save_last_call_timestamps(timestamps):
    with open(last_call_file, 'w') as file:
        json.dump(timestamps, file)

def fetch_and_send_articles(topic):
    url = f"https://gnews.io/api/v4/search?q={topic}&apikey={gnews_api_key}&lang=en"
    try:
        response = requests.get(url)
        response.raise_for_status()  # 오류가 있을 경우 예외를 발생시킴
        data = response.json()
        articles = data.get("articles", [])
        for article in articles:
            producer.send(topic, article)
        logging.info(f"Data collection complete for {topic}")
    except requests.RequestException as e:
        logging.error("Error occurred: %s", str(e))

def main():
    last_call_timestamps = load_last_call_timestamps()

    while True:
        for topic in kafka_topics:
            current_time = time.time()
            if current_time - last_call_timestamps.get(topic, 0) < min_interval:
                logging.info(f"Skipping {topic} due to interval limit.")
                continue

            fetch_and_send_articles(topic)
            last_call_timestamps[topic] = current_time

        save_last_call_timestamps(last_call_timestamps)
        time.sleep(min_interval)

if __name__ == "__main__":
    main()
