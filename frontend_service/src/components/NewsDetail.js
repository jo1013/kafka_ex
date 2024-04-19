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
