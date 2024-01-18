#!/bin/bash
# Kafka 서버가 준비될 때까지 대기
until kafka-topics.sh --list --bootstrap-server 127.0.0.1:9092 | grep -q 'crypto'; do
  echo "Kafka가 준비되지 않았습니다. 잠시 후 다시 시도합니다."
  sleep 5
done

# Kafka 토픽 'crypto'가 이미 존재하지 않는 경우 생성
if ! kafka-topics.sh --list --bootstrap-server 127.0.0.1:9092 | grep -q 'crypto'; then
  kafka-topics.sh --create --bootstrap-server 127.0.0.1:9092 --replication-factor 1 --partitions 1 --topic crypto
  echo "Kafka 토픽 'crypto' 생성 완료."
else
  echo "Kafka 토픽 'crypto' 이미 존재함."
fi
