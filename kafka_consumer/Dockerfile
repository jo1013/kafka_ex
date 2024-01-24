FROM python:3.8-slim

# Install Java (required for Spark)
RUN apt-get update && apt-get install -y openjdk-11-jre-headless && rm -rf /var/lib/apt/lists/*

# Install PySpark and other required Python packages
COPY requirements.txt /app/
WORKDIR /app
RUN pip install -r requirements.txt

# Copy the PySpark script
COPY kafka_consumer.py /app/

CMD ["python", "kafka_consumer.py"]
