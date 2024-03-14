import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import NewsPage from './pages/NewsPage';
import NewsDetail from './components/NewsDetail';
// 기타 필요한 임포트

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* 로그인 페이지. 이미 로그인한 경우 뉴스 페이지로 리디렉션 */}
        <Route path="/login" element={isLoggedIn ? <Navigate replace to="/news" /> : <LoginPage onLoginSuccess={onLoginSuccess} />} />
        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<SignUpPage />} />
        {/* 뉴스 상세 페이지 */}
        <Route path="/news/:id" element={<NewsDetail />} />
        {/* 메인 페이지 (뉴스 목록 페이지로 사용) */}
        <Route path="/news" element={<NewsPage />} />
        {/* 기본 경로 설정. 로그인하지 않은 경우 로그인 페이지로 리디렉션 */}
        <Route path="/" element={isLoggedIn ? <Navigate replace to="/news" /> : <Navigate replace to="/login" />} />
        {/* 기타 라우트 설정 */}
      </Routes>
    </Router>
  );
}

export default App;
