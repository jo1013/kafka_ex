import React from 'react';
import '../styles/NewsCard.css';

function NewsCard({ title, content, imageUrl }) {
  return (
    <div className="news-card">
      <img src={imageUrl} alt="News" className="news-image"/>
      <div className="news-content">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default NewsCard;
