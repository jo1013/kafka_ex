// NewsPage.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import NewsCard from '../components/NewsCard';
import SearchPage from '../components/SearchPage';
import { fetchNews } from '../api/newsApi';
import { Container, Typography, Tabs, Tab, Box, Grid } from '@mui/material';




function NewsPage() {
    const [newsData, setNewsData] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(1);  // 페이지 상태 추가
    const [loading, setLoading] = useState(false);  // 로딩 상태 추가
    const [hasMore, setHasMore] = useState(true);  // 더 로드할 데이터가 있는지
    const loader = useRef(null);

    useEffect(() => {
        if (!hasMore || loading) return;  // 로딩 중이거나 더 이상 로드할 데이터가 없으면 호출 중지
    
        setLoading(true);  // 데이터 로딩 시작
        const loadData = async () => {
            try {
                const data = await fetchNews(page);  // 현재 페이지 번호를 파라미터로 전달
                if (data && data.newsList.length > 0) {
                    setNewsData(prev => [...prev, ...data.newsList]);
                    setPage(prev => prev + 1);  // 데이터 로딩 후 페이지 번호 증가
                } else {
                    setHasMore(false);  // 데이터가 더 이상 없다면 로딩 중지
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            } finally {
                setLoading(false);  // 로딩 상태 해제
            }
        };
        loadData();
    }, [page, hasMore, loading]);  // 의존성 배열에 page, hasMore, loading 추가
    

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);  // 페이지 번호 증가
                }
            },
            { threshold: 0.1 }
        );
        if (loader.current) {
            observer.observe(loader.current);
        }
        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [loader, hasMore]);


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Latest News
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="All News" />
                    <Tab label="Search" />
                </Tabs>
            </Box>
            {tabValue === 0 && (
                <Grid container spacing={4}>
                    {newsData.map(news => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={news._id}>
                            <NewsCard
                                id={news._id}
                                title={news.title}
                                imageUrl={news.image}
                                source={news.source}
                                published_at={news.published_at}
                            />
                        </Grid>
                    ))}
                   {hasMore && <div ref={loader} />}  // 로더 요소 표시 조건 추가
                </Grid>
            )}
            {tabValue === 1 && <SearchPage newsData={newsData} />}
        </Container>
    );
}

export default NewsPage;
