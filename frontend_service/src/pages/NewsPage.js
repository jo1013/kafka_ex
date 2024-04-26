// NewsPage.js
import React, { useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom'; // 올바른 import
import NewsCard from '../components/NewsCard';
import SearchPage from '../components/SearchPage';
import { fetchNews } from '../api/newsApi';
import { fetchSubscribedNewsApi } from '../api/subscribedNewsApi';
import { Container, Typography, Tabs, Tab, Box, Grid, Button } from '@mui/material';

function NewsPage() {
    const [newsData, setNewsData] = useState([]);
    const [subscribedNews, setSubscribedNews] = useState([]); // 구독 뉴스 상태 추가
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(1);  // 페이지 상태 추가
    const [loading, setLoading] = useState(false);  // 로딩 상태 추가
    const [hasMore, setHasMore] = useState(true);  // 더 로드할 데이터가 있는지
    const loader = useRef(null);
    const navigate = useNavigate(); // 네비게이트 함수 추가

    const handleLogout = () => {
        localStorage.removeItem('userToken');  // 사용자 토큰을 로컬 스토리지에서 제거
        window.location.href = '/login';  // 예시: 로그인 페이지로 리다이렉트
    };

    const handleSubscriptionList = () => {
        navigate('/subscriptions'); // 구독 리스트 페이지로 이동
    };

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

    useEffect(() => {
        const fetchSubscribedNews = async () => {
            try {
                const data = await fetchSubscribedNewsApi(); // 구독한 뉴스를 가져오는 API 함수
                setSubscribedNews(data);
            } catch (error) {
                console.error('구독 뉴스 데이터 로딩 실패:', error);
            }
        };
        fetchSubscribedNews();
    }, []); // 구독 뉴스 데이터 불러오기

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Latest News
            </Typography>
            <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mr: 2, mb: 2 }}>
                Logout
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSubscriptionList} sx={{ mb: 2 }}>
                Subscription List
            </Button>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="All News" />
                    <Tab label="Search" />
                    <Tab label="Subscribed News" />
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
                   {hasMore && <div ref={loader} />} 
                </Grid>
            )}
            {tabValue === 1 && <SearchPage newsData={newsData} />}
            {tabValue === 2 && (
                <Grid container spacing={4}>
                    {subscribedNews.map(news => (
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
                </Grid>
            )}
        </Container>
    );
}

export default NewsPage;