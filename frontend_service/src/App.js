import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import NewsPage from './pages/NewsPage';
import NewsDetail from './components/NewsDetail';
import SubscriptionList from './pages/SubscriptionList';

const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    // 로그인하지 않은 사용자를 로그인 페이지로 리디렉션
    return <Navigate replace to="/login" />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate replace to="/news" /> : <LoginPage onLoginSuccess={onLoginSuccess} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/news/:id" element={<ProtectedRoute isLoggedIn={isLoggedIn}><NewsDetail /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute isLoggedIn={isLoggedIn}><NewsPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate replace to={isLoggedIn ? "/news" : "/login"} />} />
        <Route path="/subscriptions" element={<ProtectedRoute isLoggedIn={isLoggedIn}><SubscriptionList /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
