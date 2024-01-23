#!/bin/bash
# Kafka 서버가 준비될 때까지 대기
until kafka-topics --list --bootstrap-server kafka_service:29092 | grep -q 'crypto'; do
  echo "Kafka가 준비되지 않았습니다. 잠시 후 다시 시도합니다."
  sleep 5
done

# Kafka 토픽 'crypto'가 이미 존재하지 않는 경우 생성
if ! kafka-topics --list --bootstrap-server kafka_service:29092 | grep -q 'crypto'; then
  kafka-topics --create --bootstrap-server kafka_service:29092 --replication-factor 1 --partitions 1 --topic crypto
  echo "Kafka 토픽 'crypto' 생성 완료."
else
  echo "Kafka 토픽 'crypto' 이미 존재함."
fi
# User


#  kafka:
#     image: confluentinc/cp-kafka:6.1.1
#     depends_on:
#       - zookeeper
#     ports:
#       - '9092:9092'
#     expose:
#       - '29092'
#     environment:
#       KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
#       KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
#       KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
#       KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
#       KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: '1'
#       KAFKA_MIN_INSYNC_REPLICAS: '1'

#   init-kafka:
#     image: confluentinc/cp-kafka:6.1.1
#     depends_on:
#       - kafka
#     entrypoint: [ '/bin/sh', '-c' ]
#     command: |
#       "
#       # blocks until kafka is reachable
#       kafka-topics --bootstrap-server kafka:29092 --list

#       echo -e 'Creating kafka topics'
#       kafka-topics --bootstrap-server kafka:29092 --create --if-not-exists --topic my-topic-1 --replication-factor 1 --partitions 1
#       kafka-topics --bootstrap-server kafka:29092 --create --if-not-exists --topic my-topic-2 --replication-factor 1 --partitions 1

#       echo -e 'Successfully created the following topics:'
#       kafka-topics --bootstrap-server kafka:29092 --list