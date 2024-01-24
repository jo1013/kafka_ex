from kafka import KafkaProducer
import requests
import json
import logging
import os


kafka_server = os.environ.get('KAFKA_SERVER') 
mediastack_api_key = os.environ.get('MEDIASTACK_API_KEY')
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')



# Kafka Producer 설정
producer = KafkaProducer(bootstrap_servers=kafka_server,
                         api_version=(0,11,5),
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))




try :
    # Mediastack API 호출
    url = "http://api.mediastack.com/v1/news"
    params = {
        'access_key': mediastack_api_key,
        'keywords': 'crypto',
        'countries': 'us,kr,cn'
    }
    response = requests.get(url, params=params)
    logging.info("데이터 수집 완료")
    news_data = response.json()


except Exception as e :
    logging.error("오류 발생: %s", str(e))
    news_data = {'data': []}
# Kafka로 데이터 전송
for article in news_data['data']:
    producer.send('crypto', article)
