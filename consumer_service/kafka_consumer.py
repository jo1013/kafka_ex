from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json
from pyspark.sql.types import StructType, StringType
import os


# kafka_server = os.environ.get('KAFKA_SERVER') 
# mediastack_api_key = os.environ.get('MEDIASTACK_API_KEY')



KAFKA_TOPIC = os.environ.get('KAFKA_TOPIC') 
KAFKA_SERVER = os.environ.get('KAFKA_SERVER') 
MONGODB_URI = os.environ.get('MONGODB_URI') 


def main():
    spark = SparkSession.builder \
        .appName("KafkaConsumerApp") \
        .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.1, org.mongodb.spark:mongo-spark-connector_2.12:3.0.0") \
        .getOrCreate()

    # Define the schema of the data
    schema = StructType() \
        .add("title", StringType()) \
        .add("content", StringType())

    # Create DataFrame representing the stream of input lines from Kafka
    df = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", KAFKA_SERVER) \
        .option("subscribe", KAFKA_TOPIC) \
        .load() \
        .select(from_json(col("value").cast("string"), schema).alias("data")) \
        .select("data.*")

    # Write the stream to MongoDB
    query = df.writeStream \
        .format("com.mongodb.spark.sql.DefaultSource") \
        .option("uri", MONGODB_URI) \
        .start()

    query.awaitTermination()

if __name__ == "__main__":
    main()
