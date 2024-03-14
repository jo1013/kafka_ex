// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signupUser } from '../api/userApi';


// function SignUpPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // `useHistory` 대신 `useNavigate` 사용

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       // API를 호출하여 회원가입 처리
//       const response = await signupUser(email, password);
//       console.log('회원가입 성공:', response);
//       alert("회원가입 성공. 로그인 페이지로 이동합니다.");
//       navigate('/login'); // 회원가입 성공 후 로그인 페이지로 리다이렉션
//     } catch (error) {
//       console.error('회원가입 실패:', error);
//       alert(`회원가입 실패: ${error.response.data.detail}`);
//     }
//   };

//   return (
//     <div>
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// }

// export default SignUpPage;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/userApi';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await signupUser(email, password);
      console.log('회원가입 성공:', response);
      alert("회원가입 성공. 로그인 페이지로 이동합니다.");
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(`회원가입 실패: ${error.response.data.detail}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
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
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUpPage;
