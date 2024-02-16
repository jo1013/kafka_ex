import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import NewsCard from './components/NewsCard';
import NewsDetail from './components/NewsDetail';
import { fetchNews } from './api/newsApi';
import './styles/App.css'; // 스타일 임포트

function App() {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1); // 페이지 그룹 (1~5, 6~10, ...)
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const pagesPerGroup = 5; // 페이지 그룹당 페이지 수

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNews();
        if (data && Array.isArray(data.NewsData)) {
          const totalItems = data.NewsData.length;
          setTotalPages(Math.ceil(totalItems / itemsPerPage));
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

  const handlePreviousGroup = () => {
    setPageGroup(pageGroup - 1);
    setCurrentPage((pageGroup - 2) * pagesPerGroup + 1); // 이전 그룹의 첫 페이지로 이동
  };

  const handleNextGroup = () => {
    setPageGroup(pageGroup + 1);
    setCurrentPage(pageGroup * pagesPerGroup + 1); // 다음 그룹의 첫 페이지로 이동
  };

  // 현재 페이지 그룹 계산
  const startPage = (pageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <div className="App">
            <h1>실시간 뉴스 피드 시스템</h1>
            <div className="newsList">
              {newsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((news, index) => (
                <NewsCard key={index} id={news._id} title={news.title} imageUrl={news.image} />
              ))}
            </div>
            <div className="pagination">
              {pageGroup > 1 && <button onClick={handlePreviousGroup}>이전 페이지</button>}
              {visiblePages.map(page => (
                <button key={page} className={currentPage === page ? 'current' : ''} onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              ))}
              {endPage < totalPages && <button onClick={handleNextGroup}>다음 페이지</button>}
            </div>
          </div>
        </Route>
        <Route path="/news/:id" component={NewsDetail} />
      </Switch>
    </Router>
  );
}

export default App;
