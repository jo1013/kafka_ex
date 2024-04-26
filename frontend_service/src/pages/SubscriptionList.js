// SubscriptionList.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button } from '@mui/material';
import NewsCard from '../components/NewsCard';
import { NewsList } from '../api/newsApi';  // Ensure this is correctly imported
import {subscribeToNews} from '../api/subscribedNewsApi';
import {unsubscribeFromNews} from '../api/subscribedNewsApi';
function SubscriptionList() {
    const [newsList, setNewsList] = useState([]);
    const [subscribedIds, setSubscribedIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    const loadNews = async () => {
        try {
            setLoading(true);
            const allNews = await NewsList();  // Call fetchNews to get the news data
            setNewsList(allNews.news || []);  // Set the newsList state with the fetched news data
            const ids = new Set(allNews.subscribed?.map(news => news._id));  // Safely map over possibly undefined 'subscribed'
            setSubscribedIds(ids);
        } catch (error) {
            console.error('뉴스 데이터 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    const toggleSubscription = async (newsId) => {
        try {
            let newIds = new Set(subscribedIds);
            if (subscribedIds.has(newsId)) {
                // await unsubscribeFromNews(newsId); // Uncomment and define this function to make it work
                newIds.delete(newsId);
            } else {
                // await subscribeToNews(newsId); // Uncomment and define this function to make it work
                newIds.add(newsId);
            }
            setSubscribedIds(newIds);
            loadNews();
        } catch (error) {
            console.error('뉴스 구독 변경 실패:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                All News List
            </Typography>
            {loading ? (
                <Typography variant="h6" align="center">Loading...</Typography>
            ) : (
                <Grid container spacing={4}>
                    {newsList.map(news => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={news._id}>
                            <NewsCard
                                id={news._id}
                                title={news.title}
                                imageUrl={news.image}
                                source={news.source}
                                published_at={news.published_at}
                            />
                            <Button
                                variant="contained"
                                color={subscribedIds.has(news._id) ? "primary" : "secondary"}
                                onClick={() => toggleSubscription(news._id)}
                                sx={{ mt: 2 }}
                            >
                                {subscribedIds.has(news._id) ? 'Unsubscribe' : 'Subscribe'}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default SubscriptionList;
