import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; // Link 컴포넌트 임포트
import NewsCard from '../components/NewsCard'; // 경로 확인 필요
import { fetchNews } from '../api/newsApi'; // API 호출 함수의 경로 확인 필요
import '../styles/NewsPage.css'; // CSS 파일의 경로 확인 필요

function NewsPage() {
    const [newsData, setNewsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    const history = useHistory();

    
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
      }, [currentPage]);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };
    const handleLogout = () => {
      // 로컬 스토리지에서 사용자 정보 제거
      localStorage.removeItem('userToken');
      // 로그인 페이지로 리디렉션
      history.push('/login');
    };
    return (
        <div className="App">
            <h1>실시간 뉴스 피드 시스템</h1>
            {error && <p className="error">{error}</p>}
            <button onClick={handleLogout}>로그아웃</button>
            <div className="newsList">
                {newsData.map((news) => {
                    return (
                        <Link to={`/news/${news._id}`} key={news._id}>
                            <NewsCard id={news._id} title={news.title} imageUrl={news.image} />
                        </Link>
                    );
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
    );
}

export default NewsPage;
