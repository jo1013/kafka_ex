import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { fetchNews } from '../api/newsApi';
import { Container, Grid, Button, Typography, Box, Pagination } from '@mui/material';

function NewsPage() {
    const [newsData, setNewsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 12;
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchNews(currentPage, itemsPerPage);
                if (data && data.newsList && Array.isArray(data.newsList)) {
                    setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
                    setNewsData(data.newsList);
                }
            } catch (e) {
                setError(`데이터 로딩 중 오류 발생: ${e.message}`);
            }
        };
        loadData();
    }, [currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Latest News
            </Typography>
            {error && <Typography color="error" align="center">{error}</Typography>}
            <Grid container spacing={4}>
                {newsData.map(news => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={news._id}>
                        <NewsCard
                            id={news._id}
                            title={news.title}
                            imageUrl={news.image}
                        />
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                <Button
                    variant="contained"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    Previous
                </Button>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
                <Button
                    variant="contained"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </Button>
            </Box>
        </Container>
    );
}

export default NewsPage;
