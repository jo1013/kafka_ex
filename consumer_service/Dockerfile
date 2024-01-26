
FROM openjdk:11-jre-slim

# Java 환경 변수 설정
ENV JAVA_HOME=/usr/local/openjdk-11
ENV PATH=$JAVA_HOME/bin:$PATH

RUN apt-get update && \
    apt-get install -y wget && \
    wget https://downloads.apache.org/spark/spark-3.3.4/spark-3.3.4-bin-hadoop2.tgz && \
    tar -xvzf spark-3.3.4-bin-hadoop2.tgz && \
    mv spark-3.3.4-bin-hadoop2 /opt/spark && \
    rm spark-3.3.4-bin-hadoop2.tgz


# Install Python and other required packages
RUN apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Install PySpark and other required Python packages
COPY requirements.txt /app/
WORKDIR /app


RUN pip3 install -r requirements.txt

# Spark 환경 변수 설정 (여기서 SPARK_HOME은 Spark 설치 위치에 따라 달라질 수 있음)
# 예를 들어, Spark이 /opt/spark에 설치된 경우:
ENV SPARK_HOME=/opt/spark
ENV PATH=$SPARK_HOME/bin:$PATH

# PySpark 스크립트 복사
COPY kafka_consumer.py /app/


CMD ["python3", "kafka_consumer.py"]
