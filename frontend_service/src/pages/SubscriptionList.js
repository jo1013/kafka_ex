// frontend_service/src/pages/SubscriptionList.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { NewsList } from '../api/newsApi';
import { toggleNewsSubscription, fetchSubscribedNewsApi } from '../api/subscribedNewsApi';

function SubscriptionList() {
    const [newsList, setNewsList] = useState([]);
    const [subscribedNews, setSubscribedNews] = useState(new Set());
    const [pendingSubscriptions, setPendingSubscriptions] = useState(new Map());
    const [loading, setLoading] = useState(false);

    const loadNews = async () => {
        setLoading(true);
        try {
            const allNews = await NewsList() || {};
            const subscriptions = await fetchSubscribedNewsApi() || [];
            const subscribedSet = new Set(subscriptions.filter(sub => sub.is_subscribe).map(sub => sub.news_id));
            setNewsList(allNews.newsList || []);
            setSubscribedNews(subscribedSet);
        } catch (error) {
            console.error('뉴스 데이터 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscriptionToggle = (newsId) => {
        setPendingSubscriptions(prevPending => {
            const newPending = new Map(prevPending);
            const isSubscribed = subscribedNews.has(newsId);

            if (prevPending.has(newsId)) {
                newPending.delete(newsId);
            } else {
                const newStatus = isSubscribed ? 'unsubscribe' : 'subscribe';
                newPending.set(newsId, newStatus);
            }
            return newPending;
        });
    };

    const applyChanges = async () => {
        for (const [newsId, action] of pendingSubscriptions.entries()) {
            try {
                await toggleNewsSubscription(newsId, action);
                setSubscribedNews(prevSubscribed => {
                    const newSubscribed = new Set(prevSubscribed);
                    if (action === 'subscribe') {
                        newSubscribed.add(newsId);
                    } else {
                        newSubscribed.delete(newsId);
                    }
                    return newSubscribed;
                });
            } catch (error) {
                console.error(`구독 처리 실패: ${newsId}`, error);
            }
        }
        setPendingSubscriptions(new Map());
    };

    useEffect(() => {
        loadNews();
    }, []);
    const getBackgroundColor = (newsId) => {
        const isPendingSubscribed = pendingSubscriptions.has(newsId)
            ? pendingSubscriptions.get(newsId) === 'subscribe'
            : subscribedNews.has(newsId);

        return isPendingSubscribed ? '#add8e6' : 'white'; // 옅은 파란색
    };
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                All News List
            </Typography>
            {loading ? (
                <Typography variant="h6" align="center">Loading...</Typography>
            ) : (
                <>
                    <Grid container spacing={4}>
                        {newsList.map(news => {
                            const backgroundColor = getBackgroundColor(news._id);

                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={news._id}>
                                    <Card
                                        onClick={() => handleSubscriptionToggle(news._id)}
                                        sx={{
                                            opacity: 1,
                                            backgroundColor,
                                            cursor: 'pointer',
                                            border: '1px solid #dcdcdc',
                                            transition: 'background-color 0.3s'
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" component="p">
                                                {news.source || 'No Source Available'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 4 }}
                        onClick={applyChanges}
                        disabled={pendingSubscriptions.size === 0}
                    >
                        Apply Changes
                    </Button>
                </>
            )}
        </Container>
    );
}

export default SubscriptionList;