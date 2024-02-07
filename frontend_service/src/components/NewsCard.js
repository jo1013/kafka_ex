// src/components/NewsCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NewsCard.css';




function NewsCard({ id, title, imageUrl }) {
  return (
    <Link to={`/news/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>

      <div className="newsCard">
        <img src={imageUrl || '기본 이미지 URL'} alt={title} className="newsImage" />
        <div className="newsContent">
          <h3>{title}</h3>
        </div>
      </div>
    </Link>
  );
}

export default NewsCard;