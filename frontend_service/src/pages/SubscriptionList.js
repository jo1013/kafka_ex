import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { NewsList } from '../api/newsApi';
import { toggleNewsSubscription, fetchSubscribedNewsApi } from '../api/subscribedNewsApi';
import { useNavigate } from 'react-router-dom';

function SubscriptionList() {
    const [newsList, setNewsList] = useState([]);
    const [subscribedNews, setSubscribedNews] = useState(new Map());
    const [pendingSubscriptions, setPendingSubscriptions] = useState(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const allNews = await NewsList() || {};
            const subscriptions = await fetchSubscribedNewsApi() || [];
            console.log('Fetched news:', allNews);
            console.log('Fetched subscriptions:', subscriptions);
            
            const subscribedMap = new Map(subscriptions.map(sub => [sub.news_id, sub.is_subscribe]));
            console.log('Subscribed Map:', subscribedMap);

            setNewsList(allNews.newsList || []);
            setSubscribedNews(subscribedMap);
        } catch (error) {
            console.error('뉴스 데이터 로딩 실패:', error);
            setError('Failed to load news. Click to retry.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscriptionToggle = (newsId) => {
        setPendingSubscriptions(prevPending => {
            const newPending = new Map(prevPending);
            const currentStatus = subscribedNews.get(newsId);
            const newStatus = currentStatus ? 'unsubscribe' : 'subscribe';
            
            console.log(`Toggling subscription for News ID: ${newsId}, Current Status: ${currentStatus}, New Status: ${newStatus}`);

            if (newPending.has(newsId)) {
                newPending.delete(newsId);
            } else {
                newPending.set(newsId, newStatus);
            }
            
            return newPending;
        });
    };

    const applyChanges = async () => {
        const feedbackMessages = [];

        await Promise.all(Array.from(pendingSubscriptions.entries()).map(async ([newsId, action]) => {
            try {
                await toggleNewsSubscription(newsId, action);
                setSubscribedNews(prev => new Map(prev).set(newsId, action === 'subscribe'));
            } catch (error) {
                console.error(`Subscription toggle failed for ${newsId}:`, error);
                feedbackMessages.push(`Failed to process request for news ID ${newsId}.`);
            }
        }));

        setPendingSubscriptions(new Map());

        if (feedbackMessages.length === 0) {
            alert('All changes have been successfully applied!');
            navigate('/news');
        } else {
            alert(feedbackMessages.join("\n"));
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6">{error}</Typography>
                <Button variant="contained" onClick={loadNews}>Retry</Button>
            </Container>
        );
    }

    const getBackgroundColor = (newsId) => {
        if (pendingSubscriptions.has(newsId)) {
            return pendingSubscriptions.get(newsId) === 'subscribe' ? '#add8e6' : 'white';
        }
        const isSubscribed = subscribedNews.get(newsId);
        console.log(`News ID: ${newsId}, Is Subscribed: ${isSubscribed}`);
        return isSubscribed ? '#add8e6' : 'white';
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
                            console.log(`News ID: ${news._id}, Background Color: ${backgroundColor}`);

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
