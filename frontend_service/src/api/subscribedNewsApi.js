//subscribedNewsApi.js

import axios from 'axios';

// FastAPI 서버의 `/news` 엔드포인트를 가리키도록 API_ENDPOINT 업데이트
const API_ENDPOINT = 'http://localhost:8001/subscriptions'; // 포트번호 확인 필요


export const fetchSubscribedNewsApi = async (page = 1, page_size = 10, subscribed = true) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}?page=${page}&page_size=${page_size}&subscribed=${subscribed}&sort=-created_at`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('뉴스를 가져오는데 실패했습니다:', error);
    throw error;
  }
};


// 뉴스 구독 함수
export const subscribeToNews = async (newsId) => {
  try {
      const response = await axios.post(`${API_ENDPOINT}/${newsId}/subscribe`);
      console.log('뉴스 구독 성공:', response.data);
      return response.data;
  } catch (error) {
      console.error('뉴스 구독 실패:', error);
      throw error;
  }
};

// 뉴스 구독 취소 함수
export const unsubscribeFromNews = async (newsId) => {
  try {
      const response = await axios.post(`${API_ENDPOINT}/${newsId}/unsubscribe`);
      console.log('뉴스 구독 취소 성공:', response.data);
      return response.data;
  } catch (error) {
      console.error('뉴스 구독 취소 실패:', error);
      throw error;
  }
};