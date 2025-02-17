import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Stack,
} from '@mui/material';
import KanbanIcon from '@mui/icons-material/ViewKanban';

const Home: React.FC = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
                    <Typography variant="h2" color="primary" gutterBottom>
                        Welcome to TaskMaster
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 5 }}>
                        Streamline your projects, boost productivity, and collaborate seamlessly with your team.
                    </Typography>

                    <Box sx={{ mb: 5 }}>
                        <KanbanIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                    </Box>

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        sx={{ mb: 8 }}
                    >
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            size="large"
                        >
                            Get Started
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            size="large"
                        >
                            Sign In
                        </Button>
                    </Stack>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Organize
                            </Typography>
                            <Typography color="text.secondary">
                                Keep your projects structured and on track
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Collaborate
                            </Typography>
                            <Typography color="text.secondary">
                                Work together with your team efficiently
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Succeed
                            </Typography>
                            <Typography color="text.secondary">
                                Achieve your goals with clear progress tracking
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default Home;