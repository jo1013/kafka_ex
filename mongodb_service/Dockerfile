# 베이스 이미지
FROM mongo:6.0
COPY mongo_init.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/mongo_init.sh