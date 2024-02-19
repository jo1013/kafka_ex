import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NewsCard from './components/NewsCard';
import NewsDetail from './components/NewsDetail';
import { fetchNews } from './api/newsApi';
import './styles/App.css'; // 스타일 임포트

function App() {
  const [newsData, setNewsData] = useState([]);
  const [setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const pagesPerGroup = 5; // 페이지 그룹당 페이지 수

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNews(currentPage, itemsPerPage);
        if (data && data.newsList && Array.isArray(data.newsList)) {
          setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
          setNewsData(data.newsList);

        }
      } catch (e) {
        setError(`데이터 로딩 중 오류 발생: ${e.message}`);
      }
    };
    loadData();
  }, [currentPage, itemsPerPage, setError]);

  // 페이지 그룹 계산
  const pageGroup = Math.ceil(currentPage / pagesPerGroup);

  // 현재 페이지 그룹에 따라 표시할 페이지 번호 계산
  const startPage = (pageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);


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
            <div className="newsList">
              {newsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((news, index) => (
                <NewsCard key={index} id={news._id} title={news.title} imageUrl={news.image} />
              ))}
            </div>
            <div className="pagination">
              {visiblePages.map(page => (
                <button key={page} className={currentPage === page ? 'current' : ''} onClick={() => 
                  handlePageClick(page)}>
                  {page}
                </button>
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
