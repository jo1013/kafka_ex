import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { fetchNews } from '../api/newsApi';

function NewsPage() {
    const [newsData, setNewsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;
    const navigate = useNavigate();

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

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Latest News</h1>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newsData.map(news => (
                    <NewsCard
                        key={news._id}
                        id={news._id}
                        title={news.title}
                        imageUrl={news.image}
                    />
                ))}
            </div>
            <div className="flex justify-between items-center mt-8">
                <button
                    className={`px-4 py-2 text-lg font-semibold rounded-lg ${currentPage > 1 ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={handlePrevious}
                    disabled={currentPage <= 1}
                >
                    Previous
                </button>
                <span className="text-lg">Page {currentPage} of {totalPages}</span>
                <button
                    className={`px-4 py-2 text-lg font-semibold rounded-lg ${currentPage < totalPages ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={handleNext}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default NewsPage;



