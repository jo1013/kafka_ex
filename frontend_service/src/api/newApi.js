import axios from 'axios';

const API_ENDPOINT = 'data_api_service:8000'; // 예시 API 엔드포인트

export const fetchNews = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}`);
    return response.data;
  } catch (error) {
    console.error('뉴스를 가져오는데 실패했습니다:', error);
    return [];
  }
};
