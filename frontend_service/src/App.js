import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NewsCard from './components/NewsCard';
import NewsDetail from './components/NewsDetail';
import { fetchNews } from './api/newsApi';
import './styles/App.css'; // 스타일 임포트

function App() {
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const pagesPerGroup = 5;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNews(currentPage, itemsPerPage);
        console.log(data); // 로딩된 데이터 로그
        if (data && data.newsList && Array.isArray(data.newsList)) {
          setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
          setNewsData(data.newsList);
        }
      } catch (e) {
        setError(`데이터 로딩 중 오류 발생: ${e.message}`);
      }
    };
    loadData();
  }, [currentPage, itemsPerPage]);

  const handlePageClick = (page) => {
    console.log(`Page ${page} clicked`);
    setCurrentPage(page);
  };

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <div className="App">
            <h1>실시간 뉴스 피드 시스템</h1>
            {error && <p className="error">{error}</p>}
            <div className="newsList">
              {newsData.map((news, index) => {
                return <NewsCard key={news._id} id={news._id} title={news.title} imageUrl={news.image} />;
              })}
            </div>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} className={currentPage === page ? 'current' : ''} onClick={() => handlePageClick(page)}>
                  {page}
                </button>
              ))}
            </div>
            <p>현재 페이지: {currentPage}</p>
          </div>
        </Route>
        <Route path="/news/:id" component={NewsDetail} />
      </Switch>
    </Router>
  );
}

export default App;
