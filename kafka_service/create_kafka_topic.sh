
# 카프카 서비스가 준비될 때까지 대기
echo "Waiting for Kafka to be ready..."
while ! docker exec kafka_service kafka-topics --list --bootstrap-server localhost:9092 > /dev/null 2>&1; do
sleep 1
done

echo "Kafka is ready."

# 토픽 생성
TOPIC_NAME="crypto"
docker exec -it kafka_service kafka-topics --create --topic $TOPIC_NAME --partitions 1 --replication-factor 1 --if-not-exists --bootstrap-server localhost:9092

echo "Topic $TOPIC_NAME created."
