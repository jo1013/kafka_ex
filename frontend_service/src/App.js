import React, { useEffect, useState } from 'react';
import NewsCard from './components/NewsCard';
import { fetchNews } from './api/newApi'; // API 호출 함수가 정의된 경로 확인 필요

function App() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);


useEffect(() => {
const loadData = async () => {
    try {
    const data = await fetchNews(); // API 호출 및 데이터 직접 받기
    if (data && Array.isArray(data.NewsData)) {
        setNewsData(data.NewsData);
    } else {
        setError("데이터 형식이 올바르지 않습니다.");
    }
    } catch (e) {
    setError(`데이터 로딩 중 오류 발생: ${e.message}`);
    }
};
loadData();
}, []);

  return (
    <div className="App">
      <h1>실시간 뉴스 피드 시스템</h1>
      {error && <p className="error">{error}</p>}
      {newsData.map(news => (
        <NewsCard 
          key={news.id || news._id} // MongoDB의 ObjectId('_id')를 고려
          title={news.title} 
          content={news.description || '설명 없음'} 
          imageUrl={news.image || '기본 이미지 URL'} // 기본 이미지 URL 추가
        />
      ))}
    </div>
  );
}

export default App;
