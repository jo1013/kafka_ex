import axios from 'axios';

// FastAPI 서버의 `/news` 엔드포인트를 가리키도록 API_ENDPOINT 업데이트
const API_ENDPOINT = 'http://localhost:8001/news'; // 포트번호 확인 필요

export const fetchNews = async () => {
  try {
    // Axios를 사용하여 `/news` 엔드포인트로부터 뉴스 데이터 요청
    const response = await axios.get(`${API_ENDPOINT}`);
    // 정상 응답시, 응답 데이터의 .NewsData 프로퍼티 반환 (API 응답 구조에 따라 조정 필요)
    return response.data; // API 응답 구조가 { NewsData: [...] } 형태라고 가정
  } catch (error) {
    console.error('뉴스를 가져오는데 실패했습니다:', error);
    throw error; 
  }
};
