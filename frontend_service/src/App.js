import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NewsCard from './components/NewsCard';
import NewsDetail from './components/NewsDetail';
import { fetchNews } from './api/newsApi';
import './styles/App.css'; // 스타일 임포트

function App() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null); // 이 줄을 추가하여 error 상태를 초기화합니다.
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0); // 이 줄을 추가하여 totalPages 상태를 초기화합니다.

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNews();
        if (data && Array.isArray(data.NewsData)) {
          const totalItems = data.NewsData.length;
          setTotalPages(Math.ceil(totalItems / itemsPerPage));
          setNewsData(data.NewsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } else {
          setError("데이터 형식이 올바르지 않습니다.");
        }
      } catch (e) {
        setError(`데이터 로딩 중 오류 발생: ${e.message}`);
      }
    };
    loadData();
  }, [currentPage]);

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <div className="App">
            <h1>실시간 뉴스 피드 시스템</h1>
            <div className="newsList">
              {newsData.map((news, index) => (
                <NewsCard key={index} id={news._id} title={news.title} imageUrl={news.image} />
              ))}
            </div>
          </div>
        </Route>
        <Route path="/news/:id" component={NewsDetail} />
      </Switch>
    </Router>
  );
}

export default App;
