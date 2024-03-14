import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

function NewsCard({ id, title, imageUrl }) {
  const navigate = useNavigate();
  const defaultImage = 'https://council.gb.go.kr/images/common/gb_wait.png'; // 기본 이미지 URL

  const handleClick = () => {
    navigate(`/news/${id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* CardActionArea에 onClick 이벤트 핸들러 추가 */}
      <CardActionArea sx={{ flexGrow: 1 }} onClick={handleClick}>
      <CardMedia
        component="img"
        image={imageUrl || defaultImage}
        alt={title}
        sx={{
          height: 140, // 높이는 필요에 따라 조정하세요.
          objectFit: 'contain', // 이미지를 컨테이너에 맞게 조정하되, 비율을 유지합니다.
          width: '100%', // 너비를 100%로 설정하여 컨테이너의 너비에 맞춥니다.
        }}
      />
        
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          {/* 내용 추가 */}
        </CardContent>
      </CardActionArea>
      {/* 카드 액션 추가 (옵션) */}
    </Card>
  );
}

export default NewsCard;
