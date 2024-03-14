# Node.js 이미지를 기반으로 설정
FROM node:14

# 작업 디렉토리 설정
WORKDIR /usr/src/app


COPY . .
# 앱 의존성 설치


RUN npm install
RUN npm install react-router-dom@6
RUN npm install @mui/material @emotion/react @emotion/styled



RUN npm run build


# 앱 소스 추가


# 앱 실행
CMD ["npm", "start"]
