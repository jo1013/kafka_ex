// SubscriptionList.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import {NewsList} from '../api/newsApi';  // Ensure this is correctly imported
import {toggleNewsSubscription, fetchSubscribedNewsApi} from '../api/subscribedNewsApi';
import { getUserIdFromJwt } from '../utils/auth'; // 이 함수를 import합니다.


function SubscriptionList() {
    const [newsList, setNewsList] = useState([]);
    const [subscribedNews, setSubscribedNews] = useState(new Set()); // 구독된 뉴스 ID를 관리하기 위해 Set을 사용합니다.
    const [loading, setLoading] = useState(false);
    const userId = getUserIdFromJwt(); // JWT에서 userId 추출
    console.log(userId)

    // const loadNews = async () => {
    //     setLoading(true);
    //     try {
    //         const allNews = await NewsList() || {};
    //         const subscriptions = await fetchSubscribedNewsApi(userId) || []; // 구독 정보를 가져옴
    //         const subscribedSet = new Set(subscriptions.map(sub => sub.news_id || null).filter(id => id !== null));
    //         setNewsList(allNews.newsList || []);
    //         setSubscribedNews(subscribedSet); // 구독 정보를 Set으로 저장
    //     } catch (error) {
    //         console.error('뉴스 데이터 로딩 실패:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };    
    const loadNews = async () => {
        setLoading(true);
        try {
            const allNews = await NewsList() || {};
            const subscriptions = await fetchSubscribedNewsApi(userId) || [];
            // subscriptions 데이터 구조 확인 후 적절히 조정 필요
            const subscribedSet = new Set(subscriptions.filter(sub => sub.is_subscribe).map(sub => sub.news_id));
            setNewsList(allNews.newsList || []);
            setSubscribedNews(subscribedSet); // 구독된 뉴스 ID 관리
        } catch (error) {
            console.error('뉴스 데이터 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscriptionToggle = async (newsId) => {
        const isSubscribed = subscribedNews.has(newsId);
        const action = isSubscribed ? 'unsubscribe' : 'subscribe';
        try {
            await toggleNewsSubscription(newsId, action);
            setSubscribedNews(prevSubscribedNews => {
                const newSubscribedNews = new Set(prevSubscribedNews);
                if (isSubscribed) {
                    newSubscribedNews.delete(newsId);
                } else {
                    newSubscribedNews.add(newsId);
                }
                return newSubscribedNews;
            });
        } catch (error) {
            console.error('구독 처리 실패:', error);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);
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
        <Card onClick={() => handleSubscriptionToggle(news._id)}
              sx={{
                  opacity: subscribedNews.has(news._id) ? 1 : 0.5,
                  backgroundColor: subscribedNews.has(news._id) ? 'blue' : 'transparent'
              }}>
            <CardContent>
                <Typography variant="h6" component="p">
                    {news.source || 'No Source Available'}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );

}

export default SubscriptionList;