# Node.js 이미지를 기반으로 설정
FROM node:14

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 앱 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 추가
COPY . .

# 앱 실행
CMD ["npm", "start"]
