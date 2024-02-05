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
$ docker exec -it mongodb_service bash
$ mongosh
'''
use news_admin
db.createUser({
    user: "myUser",
    pwd: "myUserPassword",
    roles: [{ role: "readWrite", db: "myNewDatabase" }]
})
db.createCollection("myCollection")
'''