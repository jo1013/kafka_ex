// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { fetchNewsDetail } from '../api/newsApi'; // 가정: API 호출 함수


// function NewsDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate(); // useHistory 대신 useNavigate 사용
//   const [newsDetail, setNewsDetail] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const loadNewsDetail = async () => {
//       try {
//         console.log("Fetched ID:", id);
//         const data = await fetchNewsDetail(id); // 특정 뉴스의 상세 정보를 가져오는 함수
//         console.log("Fetched data:", data);
//         setNewsDetail(data);
//       } catch (error) {
//         setError(`뉴스 상세 정보를 가져오는데 실패했습니다. ${error.message}`);
//       }
//     };

//     loadNewsDetail();
//   }, [id]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!newsDetail) {
//     return <div>로딩 중...</div>;
//   }

//   // 이전 페이지로 돌아가기
//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="detailContainer">
//       <button onClick={handleGoBack} className="goBackButton">이전 페이지로 돌아가기</button>
//       <h2 className="detailTitle">{newsDetail.title}</h2>
//       <img src={newsDetail.image || '기본 이미지 URL'} alt={newsDetail.title} className="detailImage" />
//       <p className="detailDescription">{newsDetail.description}</p>
//       <a href={newsDetail.url} className="detailLink" target="_blank" rel="noopener noreferrer">원문 보기</a>
//     </div>
//   );
// }

// export default NewsDetail;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNewsDetail } from '../api/newsApi';
import { Button, Container, Typography, Box, Paper, Link } from '@mui/material';

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsDetail, setNewsDetail] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNewsDetail = async () => {
      try {
        const data = await fetchNewsDetail(id);
        setNewsDetail(data);
      } catch (error) {
        setError(`뉴스 상세 정보를 가져오는데 실패했습니다. ${error.message}`);
      }
    };

    loadNewsDetail();
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!newsDetail) {
    return <Typography>로딩 중...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>이전 페이지로 돌아가기</Button>
        <Paper elevation={3} sx={{ my: 2, p: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {newsDetail.title}
          </Typography>
          <img src={newsDetail.image || '기본 이미지 URL'} alt={newsDetail.title} style={{ width: '100%', height: 'auto' }} />
          <Typography paragraph sx={{ mt: 2 }}>
            {newsDetail.description}
          </Typography>
          <Link href={newsDetail.url} target="_blank" rel="noopener noreferrer" variant="body2">
            원문 보기
          </Link>
        </Paper>
      </Box>
    </Container>
  );
}

export default NewsDetail;
