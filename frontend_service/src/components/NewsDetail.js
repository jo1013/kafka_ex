// NewsDetail.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNewsDetail } from '../api/newsApi'; // 가정: API 호출 함수
import '../styles/NewsDetail.css';
function NewsDetail() {
  const { id } = useParams();
  const [newsDetail, setNewsDetail] = useState(null);
  const [error, setError] = useState(''); // error 상태 추가


  useEffect(() => {
    const loadNewsDetail = async () => {
      try {
        console.log("Fetched ID:", id);
        const data = await fetchNewsDetail(id); // 특정 뉴스의 상세 정보를 가져오는 함수
        console.log("Fetched data:", data);
        setNewsDetail(data);
      } catch (error) {
        setError('뉴스 상세 정보를 가져오는데 실패했습니다. ${error.message}')
      }
    };

    loadNewsDetail();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!newsDetail) {
    return <div>로딩 중...</div>;
  }

  return (

    <div className="detailContainer">
      <h2 className="detailTitle">{newsDetail.title}</h2>
      <img src={newsDetail.image || '기본 이미지 URL'} alt={newsDetail.title} className="detailImage" />
      <p className="detailDescription">{newsDetail.description}</p>
      <a href={newsDetail.url} className="detailLink" target="_blank" rel="noopener noreferrer">원문 보기</a>
    </div>
  );
}

export default NewsDetail;
