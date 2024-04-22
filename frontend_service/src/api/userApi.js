//userApi.js
import axios from 'axios';

// 사용자 관련 기능을 수행하는 서버의 기본 URL 설정
const USER_API_ENDPOINT = 'http://localhost:8001/user';



// 뉴스 클릭 이벤트를 기록하는 함수
export const recordNewsClick = async (userId, newsId) => {
  try {
    const response = await axios.post(`${USER_API_ENDPOINT}/click`, {
      user_id: userId,
      news_id: newsId,
      activity_type: 'click',
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // 로컬 스토리지에서 토큰 가져오기
      }
    });

    if (!response.data) {
      throw new Error('Failed to record click');
    }

    return response.data;
  } catch (error) {
    console.error('Failed to record click:', error);
    throw error;
  }
};


// 사용자 회원가입
export const signupUser = async (email, password) => {
  try {
    const response = await axios.post(`${USER_API_ENDPOINT}/signup`, { email, password });
    return response.data; // 회원가입 성공 시 반환되는 데이터
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

// 사용자 로그인
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${USER_API_ENDPOINT}/login`, { email, password });
    return response.data; // 로그인 성공 시 반환되는 데이터 (예: 사용자 정보, 토큰 등)
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// 아이디 찾기
export const findUserId = async (email) => {
  try {
    const response = await axios.get(`${USER_API_ENDPOINT}/find-id?email=${email}`);
    return response.data; // 아이디 찾기 성공 시 반환되는 데이터 (예: 사용자 아이디)
  } catch (error) {
    console.error('아이디 찾기 실패:', error);
    throw error;
  }
};

// 비밀번호 찾기
export const resetUserPassword = async (email) => {
  try {
    const response = await axios.post(`${USER_API_ENDPOINT}/find-password`, { email });
    return response.data; // 비밀번호 찾기 성공 시 반환되는 데이터 (예: 새 비밀번호 또는 비밀번호 재설정 링크)
  } catch (error) {
    console.error('비밀번호 찾기 실패:', error);
    throw error;
  }
};
