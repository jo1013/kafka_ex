import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // 페이지 리다이렉션을 위해 useHistory 훅 임포트
import { signupUser } from '../api/userApi'; // 수정된 경로에 따라 임포트 경로 확인

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory(); // 리다이렉션을 위한 훅 사용

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // API를 호출하여 회원가입 처리
      const response = await signupUser(email, password);
      console.log('회원가입 성공:', response);
      alert("회원가입 성공. 로그인 페이지로 이동합니다.");
      history.push('/login'); // 회원가입 성공 후 로그인 페이지로 리다이렉션
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(`회원가입 실패: ${error.response.data.detail}`);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpPage;
