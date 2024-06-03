import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import SearchPage from '../components/SearchPage';
import { fetchNews } from '../api/newsApi';
import { fetchSubscribedNews } from '../api/subscribedNewsApi';
import { Container, Typography, Tabs, Tab, Box, Grid, Button } from '@mui/material';

function NewsPage() {
    const [newsData, setNewsData] = useState([]);
    const [subscribedNews, setSubscribedNews] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(1);
    const [subscribedPage, setSubscribedPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [subscribedHasMore, setSubscribedHasMore] = useState(true);
    const loader = useRef(null);
    const subscribedLoader = useRef(null);
    const navigate = useNavigate();

    const handleCardClick = (newsId) => {
        navigate(`/news/${newsId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        window.location.href = '/login';
    };

    const handleSubscriptionList = () => {
        navigate('/subscriptions');
    };

    useEffect(() => {
        if (!hasMore || loading || tabValue !== 0) return;

        setLoading(true);
        const loadData = async () => {
            try {
                const data = await fetchNews(page);
                if (data && data.newsList.length > 0) {
                    setNewsData(prev => [...prev, ...data.newsList]);
                    setPage(prev => prev + 1);  // 데이터 로딩 후 페이지 번호 증가
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [page, hasMore, loading, tabValue]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && tabValue === 0) {
                    setPage(prev => prev + 1); // 페이지 증가
                }
            },
            { threshold: 1.0 }
        );
        if (loader.current) {
            observer.observe(loader.current);
        }
        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [loader, hasMore, loading, tabValue]);

    useEffect(() => {
        if (!subscribedHasMore || loading || tabValue !== 2) return;

        setLoading(true);
        const loadSubscribedData = async () => {
            try {
                const data = await fetchSubscribedNews(subscribedPage);
                if (data && data.length > 0) {
                    setSubscribedNews(prev => [...prev, ...data]);
                    setPage(prev => prev + 1);  // 데이터 로딩 후 페이지 번호 증가
                } else {
                    setSubscribedHasMore(false);
                }
            } catch (error) {
                console.error('구독 뉴스 데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSubscribedData();
    }, [subscribedPage, subscribedHasMore, loading, tabValue]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && subscribedHasMore && !loading && tabValue === 2) {
                    setSubscribedPage(prev => prev + 1); // 페이지 증가
                }
            },
            { threshold: 1.0 }
        );
        if (subscribedLoader.current) {
            observer.observe(subscribedLoader.current);
        }
        return () => {
            if (subscribedLoader.current) {
                observer.unobserve(subscribedLoader.current);
            }
        };
    }, [subscribedLoader, subscribedHasMore, loading, tabValue]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 0) {
            setPage(1); // 페이지 초기화
            setNewsData([]); // 뉴스 데이터 초기화
            setHasMore(true); // 더 가져올 데이터가 있다고 설정
        } else if (newValue === 2) {
            setSubscribedPage(1); // 구독 뉴스 페이지 초기화
            setSubscribedNews([]); // 구독 뉴스 데이터 초기화
            setSubscribedHasMore(true); // 더 가져올 구독 뉴스가 있다고 설정
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">Latest News</Typography>
            <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mr: 2, mb: 2 }}>Logout</Button>
            <Button variant="contained" color="secondary" onClick={handleSubscriptionList} sx={{ mb: 2 }}>Subscription List</Button>
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
                                onClick={() => handleCardClick(news._id)}
                            />
                        </Grid>
                    ))}
                    {hasMore && (
                        <div ref={loader} style={{ height: '20px', margin: '20px 0' }}>
                            <Typography align="center">Loading more news...</Typography>
                        </div>
                    )}
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
                                onClick={() => handleCardClick(news._id)}
                            />
                        </Grid>
                    ))}
                    {subscribedHasMore && (
                        <div ref={subscribedLoader} style={{ height: '20px', margin: '20px 0' }}>
                            <Typography align="center">Loading more subscribed news...</Typography>
                        </div>
                    )}
                </Grid>
            )}
        </Container>
    );
}

export default NewsPage;
