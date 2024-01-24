FROM ghcr.io/arm64-compat/confluentinc/cp-kafka:6.2.5
USER root
RUN mkdir /app
COPY create_kafka_topic.sh /app/
RUN chmod +x /app/create_kafka_topic.sh
# m1용 이미지

  