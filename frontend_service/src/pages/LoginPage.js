import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // useHistory 훅 임포트
import '../styles/LoginPage.css';
import { loginUser } from '../api/userApi'; // API 호출 함수 임포트

function LoginPage({ onLoginSuccess }) { // onLogin prop 제거
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory(); // useHistory 훅 사용

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await loginUser(email, password);
      if (data && data.message === "Login successful") { // 로그인 성공 확인
        alert('로그인 성공!');
        onLoginSuccess(true); // 로그인 성공 시 상태 업데이트 함수 호출
      } else {
        // 이 조건은 실제로는 필요하지 않을 수 있습니다.
        throw new Error('로그인에 실패했습니다.'); // 로그인 실패 처리
      }
    } catch (error) {
      alert(`로그인 실패: ${error.response?.data?.detail || error.message}`);
    }
  };

  const navigateToSignUp = () => {
    history.push('/signup'); // '/signup' 경로로 이동
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="form-actions">
          <button type="submit">Log In</button>
          <button type="button" onClick={navigateToSignUp}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
