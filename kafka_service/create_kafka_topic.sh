
# # 카프카 서비스가 준비될 때까지 대기
# echo "Waiting for Kafka to be ready..."
# while ! docker exec kafka_service kafka-topics --list --bootstrap-server localhost:9092 > /dev/null 2>&1; do
# sleep 1
# done

# echo "Kafka is ready."

# # 토픽 생성
# declare -a topics=("crypto" "tech" "finance" "blockchain")

# for topic in "${topics[@]}"
# do
#   docker exec -it kafka_service kafka-topics --create --topic "$topic" --partitions 1 --replication-factor 1 --if-not-exists --bootstrap-server localhost:9092
#   echo "Topic $topic created."
# done


#!/bin/bash

# Kafka 토픽 생성 스크립트
echo "Waiting for Kafka to be ready..."

# Kafka가 준비될 때까지 대기
while ! kafka-topics --bootstrap-server localhost:9092 --list > /dev/null 2>&1; do
    echo "Waiting for Kafka to become available..."
    sleep 1
done

echo "Kafka is ready."

# 토픽 생성
declare -a topics=("crypto" "tech" "finance" "blockchain")

for topic in "${topics[@]}"
do
  kafka-topics --create --topic "$topic" --partitions 1 --replication-factor 1 --if-not-exists --bootstrap-server localhost:9092
  echo "Topic $topic created."
done
