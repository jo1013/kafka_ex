

# Kafka 서버가 준비될 때까지 대기
until kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic news_topic; do
  echo "Kafka가 준비되지 않았습니다. 잠시 후 다시 시도합니다."
  sleep 5
done

echo "Kafka 토픽 'news_topic' 생성 완료."
