// frontend_service/src/pages/SubscriptionList.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { NewsList } from '../api/newsApi';
import { toggleNewsSubscription, fetchSubscribedNewsApi } from '../api/subscribedNewsApi';
import { useNavigate } from 'react-router-dom';



function SubscriptionList() {
    const [newsList, setNewsList] = useState([]);
    const [subscribedNews, setSubscribedNews] = useState(new Set());
    const [pendingSubscriptions, setPendingSubscriptions] = useState(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // <--- 최상위에서 호출

    const loadNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const allNews = await NewsList() || {};
            const subscriptions = await fetchSubscribedNewsApi() || [];
            const subscribedMap = new Map(subscriptions.map(sub => [sub.news_id, sub.is_subscribe]));
            setNewsList(allNews.newsList || []);
            setSubscribedNews(subscribedMap);
        } catch (error) {
            console.error('뉴스 데이터 로딩 실패:', error);
            setError('Failed to load news. Click to retry.');  // 오류 메시지 설정
        } finally {
            setLoading(false);
        }
    };
   
    const handleSubscriptionToggle = (newsId) => {
        setPendingSubscriptions(prevPending => {
            const newPending = new Map(prevPending);
            const currentStatus = subscribedNews.get(newsId);
            const newStatus = currentStatus ? 'unsubscribe' : 'subscribe';
            // Toggle logic: If already pending an action, revert to none. If not, add the opposite action.
            if (newPending.has(newsId)) {
                newPending.delete(newsId);  // Revert any pending changes
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
                // 서버 응답 후 상태 업데이트
                setSubscribedNews(prev => new Map(prev).set(newsId, action === 'subscribe'));
            } catch (error) {
                console.error(`Subscription toggle failed for ${newsId}:`, error);
                feedbackMessages.push(`Failed to process request for news ID ${newsId}.`);
            }
        }));
    
        if (feedbackMessages.length > 0) {
            alert(feedbackMessages.join("\n"));
        }
    
        setPendingSubscriptions(new Map());  // 변경 사항 적용 후 펜딩 상태 초기화
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
        // Check if there's a pending subscription change
        if (pendingSubscriptions.has(newsId)) {
            // Show intended future state as a visual cue
            return pendingSubscriptions.get(newsId) === 'subscribe' ? '#add8e6' : 'white';
        }
        // Reflect the current subscription state
        return subscribedNews.get(newsId) ? '#add8e6' : 'white';
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