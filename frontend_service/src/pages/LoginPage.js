// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loginUser } from '../api/userApi';

// function LoginPage({ onLoginSuccess }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     try {
//       const data = await loginUser(email, password);
//       if (data && data.message === "Login successful") {
//         alert('로그인 성공!');
//         onLoginSuccess(true);
//         navigate('/news');
//       } else {
//         throw new Error('로그인에 실패했습니다.');
//       }
//     } catch (error) {
//       alert(`로그인 실패: ${error.response?.data?.detail || error.message}`);
//     }
//   };

//   const navigateToSignUp = () => {
//     navigate('/signup');
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
//       <h1 className="text-3xl font-semibold mb-6">Login</h1>
//       <form onSubmit={handleLogin} className="w-full max-w-xs">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 mb-4 text-gray-700 bg-white border rounded shadow"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-4 text-gray-700 bg-white border rounded shadow"
//         />
//         <div className="flex justify-between items-center">
//           <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
//             Log In
//           </button>
//           <button type="button" onClick={navigateToSignUp} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition-colors">
//             Sign Up
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default LoginPage;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userApi';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            onClick={navigateToSignUp}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
