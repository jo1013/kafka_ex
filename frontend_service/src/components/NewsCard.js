import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NewsCard.css';

function NewsCard({ id, title, imageUrl }) {
  // 이미지가 없는 경우 기본 이미지를 배경으로 사용하도록 설정
  const backgroundImageUrl = imageUrl ? `url(${imageUrl})` : `url('기본 이미지 URL')`;

  return (
    <Link to={`/news/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="newsCard">
        <div className="newsImage" style={{ backgroundImage: backgroundImageUrl }}></div>
        <div className="newsContent">
          <h3>{title}</h3>
        </div>
      </div>
    </Link>
  );
}

export default NewsCard;
