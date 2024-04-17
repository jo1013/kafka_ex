import React, { useEffect, useState, useRef } from 'react';
import NewsCard from '../components/NewsCard';
import { fetchNews } from '../api/newsApi';
import { Container, Grid, Typography } from '@mui/material';

function NewsPage() {
    const [newsData, setNewsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchNews(currentPage, 12); // itemsPerPage를 12로 설정
                if (data && data.newsList && Array.isArray(data.newsList)) {
                    setNewsData(prevNews => [...prevNews, ...data.newsList]);
                    setHasMore(data.totalItems > currentPage * 12);
                    setCurrentPage(prevPage => prevPage + 1);
                }
            } catch (e) {
                console.error(`데이터 로딩 중 오류 발생: ${e.message}`);
            }
        };

        loadData();
    }, [currentPage]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => observer.disconnect();
    }, [hasMore]);

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Latest News
            </Typography>
            <Grid container spacing={4}>
                {newsData.map(news => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={news._id}>
                        <NewsCard
                            id={news._id}
                            title={news.title}
                            imageUrl={news.image}
                            source={news.source} // Add source prop to each NewsCard
                            published_at={news.published_at}  // published_at 값을 전달
                        />
                    </Grid>
                ))}
            </Grid>
            <div ref={loader} style={{ height: '100px', margin: '30px 0' }} />
        </Container>
    );
}

export default NewsPage;
