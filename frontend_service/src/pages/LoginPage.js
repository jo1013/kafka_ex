import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userApi';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await loginUser(email, password);
      if (data && data.message === "Login successful") {
        alert('로그인 성공!');
        onLoginSuccess(true);
        navigate('/news');
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    } catch (error) {
      alert(`로그인 실패: ${error.response?.data?.detail || error.message}`);
    }
  };

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 text-gray-700 bg-white border rounded shadow"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 text-gray-700 bg-white border rounded shadow"
        />
        <div className="flex justify-between items-center">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
            Log In
          </button>
          <button type="button" onClick={navigateToSignUp} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition-colors">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
