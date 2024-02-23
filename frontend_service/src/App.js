import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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
      <Switch>
        {/* 로그인 페이지. 이미 로그인한 경우 메인 페이지로 리디렉션 */}
        <Route path="/login">
          {isLoggedIn ? <Redirect to="/news" /> : <LoginPage onLoginSuccess={onLoginSuccess} />}
        </Route>
        {/* 회원가입 페이지 */}
        <Route path="/signup" component={SignUpPage} />
        {/* 뉴스 상세 페이지 */}
        <Route path="/news/:id" component={NewsDetail} />
        {/* 메인 페이지 (뉴스 목록 페이지로 사용) */}
        <Route path="/news" exact component={NewsPage} />
        {/* 기본 경로 설정. 로그인하지 않은 경우 로그인 페이지로 리디렉션 */}
        <Route exact path="/">
          {isLoggedIn ? <Redirect to="/news" /> : <Redirect to="/login" />}
        </Route>
        {/* 기타 라우트 설정 */}
      </Switch>
    </Router>
  );
}

export default App;
