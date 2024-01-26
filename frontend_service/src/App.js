import React, { useEffect, useState } from 'react';
import NewsCard from './components/NewsCard';
import { fetchNews } from './api/newApi';

function App() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchNews();
      setNewsData(data);
    };

    loadData();
  }, []);

  return (
    <div className="App">
      <h1>실시간 뉴스 피드 시스템</h1>
      {newsData.map(news => (
        <NewsCard 
          key={news.id} // 뉴스 데이터에 고유 ID가 있다고 가정
          title={news.title} 
          content={news.content} 
          imageUrl={news.imageUrl} 
        />
      ))}
    </div>
  );
}

export default App;
