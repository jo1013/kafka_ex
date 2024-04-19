// NewsPage.js
import React, { useEffect, useState, useRef } from 'react';
import NewsCard from '../components/NewsCard';
import SearchPage from '../components/SearchPage';
import { fetchNews } from '../api/newsApi';
import { Container, Typography, Tabs, Tab, Box, Grid } from '@mui/material';




function NewsPage() {
    const [newsData, setNewsData] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const loader = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchNews();  // API 호출
                if (data) {
                    setNewsData(data.newsList);  // 데이터 세팅
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                // 여기에서 사용자에게 오류 메시지를 보여주거나 다른 조치를 취할 수 있습니다.
                // 예를 들어, 오류 메시지 상태를 설정하고 UI에 표시할 수 있습니다.
                setError('뉴스를 로드하는 데 실패했습니다. 나중에 다시 시도해주세요.');
            }
        };
        loadData();
    }, []);

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
                </Grid>
            )}
            {tabValue === 1 && <SearchPage newsData={newsData} />}
        </Container>
    );
}

export default NewsPage;
