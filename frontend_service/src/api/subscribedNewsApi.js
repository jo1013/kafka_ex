//subscribedNewsApi.js

import axios from 'axios';

// FastAPI 서버의 `/news` 엔드포인트를 가리키도록 API_ENDPOINT 업데이트
const API_ENDPOINT = 'http://localhost:8001/subscriptions'; // 포트번호 확인 필요

const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
  }
});

export const fetchSubscribedNewsApi = async () => {
  try {
    const response = await api.get(`/`);
    console.log('Subscribed news fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch subscribed news:', error);
    throw error;
  }
};


export const toggleNewsSubscription = async (newsId, action) => {
  try {
    const response = await api.patch(`/${newsId}?action=${action}`);
    console.log(`뉴스 ${action} 성공:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`뉴스 ${action} 실패:`, error.response ? error.response.data : error.message);
    throw error;
  }
};
