import React, { useEffect, useState } from 'react';
import NewsCard from './components/NewsCard';
import { fetchNews } from './api/newApi';

function App() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchNews(); // API 호출로부터 응답 받기
      const data = response.NewsData; // 응답 객체에서 실제 뉴스 데이터 추출
      if (Array.isArray(data)) { // data가 배열인 경우 직접 설정
        setNewsData(data);
      } else {
        setNewsData([data]); // data가 단일 객체인 경우 배열로 변환
      }
    };
    loadData();
  }, []);

  return (
    <div className="App">
      <h1>실시간 뉴스 피드 시스템</h1>
      {newsData.map(news => (
        <NewsCard 
        key={news.id} // 'id' 대신 '_id'를 사용해야 할 수 있음
        title={news.title} 
        content={news.description} // 'content' 대신 'description' 사용
        imageUrl={news.image} // 'imageUrl' 대신 'image' 사용
      />
      ))}
    </div>
  );
}

export default App;
