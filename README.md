
# Real-time News Feed System

## Overview

This project aims to build a system that collects, processes, and delivers news articles to users in real-time, leveraging the power of Kafka for data streaming, Docker for containerization, and MongoDB for data storage.

## System Components

- **API Call Container**: Fetches data from external APIs and sends it to Kafka.
- **Zookeeper Service**: Manages Kafka's state.
- **Kafka Service**: Handles message streaming.
- **Consumer Service**: Consumes data from Kafka and stores it in MongoDB.
- **Data API Service**: Provides processed data to the frontend via FAST-API.
- **Frontend Service**: Displays news data to users, built with React.
- **MongoDB Service**: Stores data consumed from Kafka.

## Features

- **Real-time Data Collection**: Uses MediaStack API for gathering news articles.
- **Data Processing**: Includes data cleaning and categorization using Python or Spark.
- **Scalable Architecture**: Ensures scalability using a Kafka cluster.
- **Security**: Implements security configurations for Kafka and databases.
- **Monitoring**: Utilizes Kibana or Grafana for system monitoring.

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- An account and API key from [MediaStack](https://mediastack.com/)

### Configuration

1. **Environment Variables**: Create a `.env` file in the project root with the following content:

    ```env
    # Kafka
    KAFKA_SERVER=kafka_service:29092

    # MediaStack
    MEDIASTACK_API_KEY=<your_mediastack_api_key>

    # MongoDB
    MONGODB_ROOT_USERNAME=admin
    MONGODB_ROOT_PASSWORD=<your_mongodb_root_password>
    MONGODB_DATABASE=news
    MONGODB_URI=mongodb://admin:<your_mongodb_root_password>@mongodb_service:27017/news
    ```

2. **`.gitignore` Configuration**: Ensure to exclude sensitive files:

    ```
    .env
    mongodb_service/mongodb_data/
    *.log
    ```

### Running the System

Execute the following command in your terminal:

```bash
docker-compose up
```

## MongoDB Setup

After starting the MongoDB container, set up the initial database and user:

```bash
docker exec -it mongodb_service bash
mongosh
```

In the MongoDB shell, create the database and user:

```javascript
use news_admin
db.createUser({
    user: "myUser",
    pwd: "myUserPassword",
    roles: [{ role: "readWrite", db: "myNewDatabase" }]
})
db.createCollection("myCollection")
```

## ARM64 Compatibility Note

For M1 Mac users, use ARM64-compatible Docker images. Refer to [ARM64 Compatible Confluent Platform](https://github.com/arm64-compat/confluent-platform?tab=readme-ov-file) for Kafka setup.

## Project Outcomes

Participants will gain experience in real-time data processing, system architecture design, front-end development, and deployment strategies, providing a comprehensive understanding of building and managing a real-time news feed system.

---



---

# 실시간 뉴스 피드 시스템

## 개요

이 프로젝트는 사용자에게 실시간으로 뉴스 기사를 수집, 처리, 제공하는 시스템을 구축하는 것을 목표로 합니다. 데이터 스트리밍을 위한 Kafka, 컨테이너화를 위한 Docker, 데이터 저장을 위한 MongoDB의 강력한 기능을 활용합니다.

## 시스템 구성 요소

- **API 호출 컨테이너**: 외부 API에서 데이터를 가져와 Kafka로 전송합니다.
- **주키퍼 서비스(Zookeeper Service)**: Kafka의 상태를 관리합니다.
- **카프카 서비스(Kafka Service)**: 메시지 스트리밍을 처리합니다.
- **컨슈머 서비스(Consumer Service)**: Kafka에서 데이터를 소비하여 MongoDB에 저장합니다.
- **데이터 API 서비스(Data API Service)**: 처리된 데이터를 FAST-API를 통해 프론트엔드에 제공합니다.
- **프런트엔드 서비스(Frontend Service)**: React로 구축된 사용자 인터페이스를 통해 뉴스 데이터를 사용자에게 표시합니다.
- **몽고디비 서비스(MongoDB Service)**: Kafka에서 소비된 데이터를 저장합니다.

## 특징

- **실시간 데이터 수집**: MediaStack API를 사용하여 뉴스 기사를 수집합니다.
- **데이터 처리**: 데이터 정제 및 분류를 포함한 처리 작업을 Python 또는 Spark를 사용하여 수행합니다.
- **확장 가능한 아키텍처**: Kafka 클러스터를 사용하여 시스템의 확장성을 보장합니다.
- **보안**: Kafka 및 데이터베이스의 보안 설정을 구현합니다.
- **모니터링**: 시스템 모니터링을 위해 Kibana 또는 Grafana를 사용합니다.

## 설정 지침

### 사전 요구 사항

- Docker 및 Docker Compose 설치
- [MediaStack](https://mediastack.com/) 계정 및 API 키

### 환경 설정

1. **환경 변수 설정**: 프로젝트 루트에 다음 내용을 포함한 `.env` 파일을 생성합니다:

    ```env
    # Kafka
    KAFKA_SERVER=kafka_service:29092

    # MediaStack
    MEDIASTACK_API_KEY=<your_mediastack_api_key>

    # MongoDB
    MONGODB_ROOT_USERNAME=admin
    MONGODB_ROOT_PASSWORD=<your_mongodb_root_password>
    MONGODB_DATABASE=news
    MONGODB_URI=mongodb://admin:<your_mongodb_root_password>@mongodb_service:27017/news
    ```

2. **`.gitignore` 설정**: 민감한 파일을 제외하도록 설정합니다:

    ```
    .env
    mongodb_service/mongodb_data/
    *.log
    ```

### 시스템 실행

터미널에서 다음 명령어를 실행합니다:

```bash
docker-compose up
```

## MongoDB 설정

MongoDB 컨테이너 시작 후 초기 데이터베이스와 사용자를 설정합니다:

```bash
docker exec -it mongodb_service bash
mongosh
```

MongoDB 쉘에서 데이터베이스와 사용자 생성:

```javascript
use news_admin
db.createUser({
    user: "myUser",
    pwd: "myUserPassword",
    roles: [{ role: "readWrite", db: "myNewDatabase" }]
})
db.createCollection("myCollection")
```

## ARM64 호환성 참고 사항

M1 Mac 사용자는 ARM64 아키텍처로 인한 호환성 문제를 겪을 수 있습니다. Kafka 설정을 위해 ARM64와 호환되는 Docker 이미지를 사용하세요. [ARM64 호환 Confluent

 플랫폼](https://github.com/arm64-compat/confluent-platform?tab=readme-ov-file)을 참조하세요.

## 프로젝트 성과

참여자들은 실시간 데이터 처리, 시스템 아키텍처 설계, 프런트엔드 개발, 배포 전략을 포함하여 실시간 뉴스 피드 시스템을 구축하고 관리하는 데 필요한 포괄적인 이해를 얻게 됩니다.

---
