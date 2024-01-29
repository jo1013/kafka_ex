# 베이스 이미지
FROM mongo:6.0

# create_mongo_init.sh 스크립트를 컨테이너에 복사하고 실행 권한 부여
COPY create_mongo_init.sh /scripts/create-mongo-init.sh


# 기본 엔트리포인트와 CMD를 사용하여 MongoDB를 시작하고 스크립트 실행
ENTRYPOINT ["/bin/bash", "-c", "chmod +x /scripts/create-mongo-init.sh && docker-entrypoint.sh mongod && /scripts/create-mongo-init.sh"]