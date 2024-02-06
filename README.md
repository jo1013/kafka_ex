### 프로젝트: 실시간 뉴스 피드 시스템

#### **목적**:
이 프로젝트의 목적은 실시간으로 뉴스 기사를 수집, 처리하여 사용자에게 제공하는 시스템을 구축하는 것입니다.

#### **단계별 구성**:

1. **데이터 수집**:
   - **출처**: 공개 API([MediaStack](https://mediastack.com/))를 사용하여 다양한 뉴스 소스에서 실시간 기사 수집
   - **도구**: Python을 사용하여 API에서 데이터를 요청하고 Kafka로 전송

2. **Kafka 설정**:
   - **토픽 생성**: 뉴스 기사에 대한 Kafka 토픽 생성
   - **Producer 설정**: Python 애플리케이션을 Kafka Producer로 설정하여 뉴스 데이터를 Kafka 토픽에 전송

3. **데이터 처리**:
   - **Consumer 설정**: Kafka Consumer를 사용하여 데이터 스트림 수신
   - **데이터 가공**: Python 또는 Spark를 사용하여 데이터 정제 및 가공 (예: 키워드 추출, 카테고리 분류)

4. **데이터 저장 및 검색**:
   - **데이터베이스**: 처리된 뉴스 데이터를 Elasticsearch 또는 기타 NoSQL 데이터베이스에 저장
   - **검색 API**: 사용자가 키워드로 뉴스 기사를 검색할 수 있는 API 구축

5. **아키텍처 구성**:
   - **아키텍처 설계**: 전체 시스템의 아키텍처를 설계하고 문서화
   - **모니터링 및 로깅**: Kafka 및 다른 컴포넌트에 대한 모니터링 및 로깅 설정

6. **프론트엔드**:
   - **사용자 인터페이스**: 웹 애플리케이션을 구축하여 사용자가 뉴스 기사를 검색하고 볼 수 있도록 함
   - **기술 스택**: React, Vue.js 또는 Angular를 사용하여 프론트엔드 개발

7. **테스트 및 배포**:
   - **단위 테스트**: 각 컴포넌트에 대한 단위 테스트 작성
   - **통합 테스트**: 전체 시스템에 대한 통합 테스트 수행
   - **배포**: Docker와 Kubernetes를 사용하여 시스템을 클라우드에 배포

#### **추가 사항**:

- **확장성 고려**: Kafka 클러스터를 활용하여 시스템의 확장성 보장
- **보안 설정**: Kafka 및 데이터베이스의 보안 설정 강화
- **실시간 대시보드**: Kibana나 Grafana를 사용하여 데이터 흐름 및 시스템 상태 모니터링

#### **실행 방법**:

1. **환경 설정 파일 (.env) 작성**:
   - `.env` 파일에 필요한 환경 변수를 정의합니다.
   - 작성 예시:
     ```
     KAFKA_SERVER=your_kafka_server_address
     MEDIASTACK_API_KEY=your_mediastack_api_key
     ```

2. **Docker Compose를 사용한 시스템 실행**:
   - 터미널에서 다음 명령어를 실행하여 Docker 컨테이너를 시작합니다.
     ```
     $ docker-compose up
     ```

이 프로젝트를 통해 Kafka의 기본적인 사용 방법은 물론, 실시간 데이터 처리, 시스템 설계 및 배포 등에 대한 실질적인 경험을 얻을 수 있습니다. 데이터 수집부터 프론트엔드 개발, 시스템 모니터링에 이르기까지 전체적인 개발 프로세스를 경험할 수 있는 좋은 기회가 될 것입니다.



api_call은 kafka에 외부api(news)를 가져온 데이터를 넣는 컨테이너(현재1개)
zookeeper_service는 주키퍼
kafka_service는 카프카서비스
consumer_service는 카프카에서 가져와서 몽고디비에 데이터를 넣는작업(현재 1개)
data_api_service 는 프런트에 데이터를 제공하는 FAST-API (python3)
frontend_service 는 뉴스데이터를 표시해주는 피드 프런트 (react)


트러블 슈팅 사항 : 

m1은 arm64 라서 confluent에서 제공하는 이미지는 사용할수없다 ..

참고 : https://github.com/arm64-compat/confluent-platform?tab=readme-ov-file
https://devkhk.tistory.com/32


### 몽고디비 환경세팅 과정
  - 
```
$ docker exec -it mongodb_service bash
$ mongosh
```

```
use news_admin
db.createUser({
    user: "myUser",
    pwd: "myUserPassword",
    roles: [{ role: "readWrite", db: "myNewDatabase" }]
})
db.createCollection("myCollection")
```



Based on the project description you've provided for the real-time news feed system, I'll outline the README content, integrating the additional information you've mentioned regarding the system's components and troubleshooting issues. This README will cover the project's purpose, step-by-step setup, additional features, execution instructions, and troubleshooting tips, particularly focusing on the ARM64 compatibility issue for M1 Mac users.

---

# Real-time News Feed System

## Purpose

The goal of this project is to develop a system that collects, processes, and delivers news articles to users in real-time.

## Overview

The system is designed to leverage a variety of technologies and platforms, including Kafka for real-time data streaming, Docker for containerization, and MongoDB for data storage, to provide a seamless experience in accessing real-time news information.

## System Components

- **Data Collection**: Utilizes the MediaStack public API to gather news articles from various sources in real-time. Python scripts request data from the API and forward it to Kafka.
- **Kafka Setup**: Involves creating Kafka topics for news articles, configuring Python applications as Kafka Producers to send data to these topics, and setting up Kafka Consumers to receive streamed data.
- **Data Processing**: Data streamed through Kafka is processed (e.g., keyword extraction, categorization) using Python or Spark.
- **Data Storage and Retrieval**: Processed data is stored in Elasticsearch or another NoSQL database. A search API enables users to find news articles based on keywords.
- **Architecture and Monitoring**: The system's architecture is carefully designed and documented, with monitoring and logging for Kafka and other components established.
- **Frontend**: A web application developed using frameworks like React, Vue.js, or Angular allows users to search for and view news articles.
- **Testing and Deployment**: Comprehensive unit and integration tests are conducted before deploying the system using Docker and Kubernetes on cloud infrastructure.

## Additional Features

- **Scalability**: Utilizes a Kafka cluster to ensure the system can scale effectively.
- **Security**: Implements enhanced security configurations for Kafka and databases.
- **Real-time Dashboard**: Employs tools like Kibana or Grafana for monitoring data flow and system health.

## Execution Instructions

### Environment Setup

1. Create a `.env` file with necessary environment variables:
   ```
   KAFKA_SERVER=your_kafka_server_address
   MEDIASTACK_API_KEY=your_mediastack_api_key
   ```

### Running the System with Docker Compose

Execute the following command in the terminal to start Docker containers:
```
$ docker-compose up
```

## System Components Overview

- **API Call Container**: Fetches data from external APIs (e.g., news sources) and sends it to Kafka.
- **Zookeeper Service**: Manages Kafka's state.
- **Kafka Service**: The core messaging service.
- **Consumer Service**: Consumes data from Kafka and inserts it into MongoDB.
- **Data API Service**: Provides data to the frontend via a FAST-API built with Python.
- **Frontend Service**: Displays news data to users, built with React.

## Troubleshooting

### ARM64 Compatibility

M1 Mac users may encounter issues due to the ARM64 architecture. The official Confluent images are not compatible with ARM64. Refer to the following resources for solutions:

- [ARM64 Compatible Confluent Platform](https://github.com/arm64-compat/confluent-platform?tab=readme-ov-file)
- [Setting up Kafka on M1 Mac](https://devkhk.tistory.com/32)

### MongoDB Environment Setup

```
$ docker exec -it mongodb_service bash
$ mongosh
```
Then, create a user and collection:
```
use news_admin
db.createUser({
    user: "myUser",
    pwd: "myUserPassword",
    roles: [{ role: "readWrite", db: "myNewDatabase" }]
})
db.createCollection("myCollection")
```

## Learning Outcomes

Participants in this project will gain hands-on experience with Kafka, real-time data processing, system design and deployment, and full-stack development, from data collection to frontend presentation and system monitoring.

프로젝트 설명을 바탕으로 실시간 뉴스 피드 시스템에 대한 README 내용을 정리하였습니다. 이 README는 프로젝트의 목적, 단계별 설치 안내, 추가 기능, 실행 방법, 그리고 특히 M1 Mac 사용자를 위한 ARM64 호환성 문제에 대한 문제 해결 팁을 포함합니다.

---

# 실시간 뉴스 피드 시스템

## 목적

이 프로젝트의 목적은 사용자에게 실시간으로 뉴스 기사를 수집, 처리하여 제공하는 시스템을 구축하는 것입니다.

## 개요

시스템은 실시간 뉴스 정보 접근을 위한 원활한 경험을 제공하기 위해 Kafka를 사용한 실시간 데이터 스트리밍, Docker를 사용한 컨테이너화, MongoDB를 사용한 데이터 저장 등 다양한 기술과 플랫폼을 활용하도록 설계되었습니다.

## 시스템 구성 요소

- **데이터 수집**: MediaStack 공개 API를 사용하여 다양한 소스에서 실시간으로 뉴스 기사를 수집합니다. Python 스크립트는 API에서 데이터를 요청하고 Kafka로 전송합니다.
- **Kafka 설정**: 뉴스 기사에 대한 Kafka 토픽을 생성하고, Python 애플리케이션을 Kafka Producer로 설정하여 데이터를 이 토픽에 전송하며, Kafka Consumer를 설정하여 스트림 데이터를 수신합니다.
- **데이터 처리**: Kafka를 통해 스트림된 데이터는 Python 또는 Spark를 사용하여 처리됩니다(예: 키워드 추출, 분류).
- **데이터 저장 및 검색**: 처리된 데이터는 Elasticsearch 또는 다른 NoSQL 데이터베이스에 저장됩니다. 검색 API를 통해 사용자는 키워드로 뉴스 기사를 찾을 수 있습니다.
- **아키텍처 및 모니터링**: 시스템의 아키텍처는 신중하게 설계되고 문서화되며, Kafka 및 기타 컴포넌트에 대한 모니터링 및 로깅이 설정됩니다.
- **프론트엔드**: React, Vue.js, Angular와 같은 프레임워크를 사용하여 개발된 웹 애플리케이션을 통해 사용자가 뉴스 기사를 검색하고 볼 수 있습니다.
- **테스트 및 배포**: 컨테이너화된 각 컴포넌트에 대한 단위 테스트와 전체 시스템에 대한 통합 테스트를 실시한 후, Docker와 Kubernetes를 사용하여 클라우드 인프라에 시스템을 배포합니다.

## 추가 기능

- **확장성**: Kafka 클러스터를 사용하여 시스템이 효과적으로 확장될 수 있도록 합니다.
- **보안**: Kafka 및 데이터베이스에 대한 보안 설정을 강화합니다.
- **실시간 대시보드**: Kibana나 Grafana를 사용하여 데이터 흐름과 시스템 상태를 모니터링합니다.

## 실행 방법

### 환경 설정

1. 필요한 환경 변수를 정의한 `.env` 파일을 생성합니다:
   ```
   KAFKA_SERVER=your_kafka_server_address
   MEDIASTACK_API_KEY=your_mediastack_api_key
   ```

### Docker Compose를 사용한 시스템 실행

터미널에서 다음 명령어를 실행하여 Docker 컨테이너를 시작합니다:
```
$

 docker-compose up
```

## 시스템 구성 요소 개요

- **API Call 컨테이너**: 외부 API(예: 뉴스 소스)에서 데이터를 가져와 Kafka로 전송합니다.
- **Zookeeper 서비스**: Kafka의 상태를 관리합니다.
- **Kafka 서비스**: 핵심 메시징 서비스입니다.
- **Consumer 서비스**: Kafka에서 데이터를 소비하여 MongoDB에 삽입합니다.
- **Data API 서비스**: Python으로 구축된 FAST-API를 통해 프론트엔드에 데이터를 제공합니다.
- **Frontend 서비스**: 사용자에게 뉴스 데이터를 표시하는 React로 구축된 서비스입니다.

## 문제 해결

### ARM64 호환성

M1 Mac 사용자는 ARM64 아키텍처로 인해 문제를 겪을 수 있습니다. 공식 Confluent 이미지는 ARM64와 호환되지 않습니다. 해결책에 대한 자료는 다음을 참조하세요:

- [ARM64 호환 Confluent 플랫폼](https://github.com/arm64-compat/confluent-platform?tab=readme-ov-file)
- [M1 Mac에서 Kafka 설정](https://devkhk.tistory.com/32)

### MongoDB 환경 설정

```
$ docker exec -it mongodb_service bash
$ mongosh
```
그 다음, 사용자와 컬렉션을 생성합니다:
```
use news_admin
db.createUser({
    user: "myUser",
    pwd: "myUserPassword",
    roles: [{ role: "readWrite", db: "myNewDatabase" }]
})
db.createCollection("myCollection")
```

## 학습 성과

이 프로젝트에 참여하는 사람들은 Kafka의 기본 사용법, 실시간 데이터 처리, 시스템 설계 및 배포, 데이터 수집부터 프론트엔드 표시, 시스템 모니터링에 이르기까지 전반적인 개발 프로세스에 대한 실질적인 경험을 얻을 수 있습니다.

---

이 README는 실시간 뉴스 피드 시스템을 설정하고 실행하기 위한 종합적인 안내서를 제공합니다. `kafka_ex_copy.zip` 파일에 포함된 특정 세부 사항을 README에 포함하거나 조정해야 하는 경우 알려주시면, 그 세부 사항을 통합하는 데 도움을 드릴 수 있습니다.