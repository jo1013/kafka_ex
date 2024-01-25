# FROM python:3.12-slim

# # Install Java (using a different version)
# RUN apt-get update && apt-get install -y openjdk-8-jre-headless && rm -rf /var/lib/apt/lists/*

# # Install PySpark and other required Python packages
# COPY requirements.txt /app/
# WORKDIR /app
# RUN pip install -r requirements.txt

# # Copy the PySpark script
# COPY kafka_consumer.py /app/

# CMD ["python", "kafka_consumer.py"]


FROM openjdk:11-jre-slim

# Install Python and other required packages
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Install PySpark and other required Python packages
COPY requirements.txt /app/
WORKDIR /app
RUN pip3 install -r requirements.txt

# Copy the PySpark script
COPY kafka_consumer.py /app/

CMD ["python3", "kafka_consumer.py"]
