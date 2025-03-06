import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
} from '@mui/material';

const Home: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1}}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center">
                        LLM Visualizer
                    </Typography>
                    
                    <Typography variant="h5" component="h2" gutterBottom align="center" color="primary">
                        Understanding Large Language Models in Action
                    </Typography>

                    <Box sx={{ my: 4 }}>
                        <Typography variant="body1" paragraph>
                            Welcome to LLM Visualizer, an interactive platform designed to demystify how Large Language Models work in generative AI applications.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Input Processing
                                    </Typography>
                                    <Typography variant="body2">
                                        Discover how user prompts are processed and tokenized before being fed into the language model.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Model Operation
                                    </Typography>
                                    <Typography variant="body2">
                                        Visualize how the LLM processes information and generates responses using attention mechanisms and neural networks.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Output Generation
                                    </Typography>
                                    <Typography variant="body2">
                                        See how the model generates and refines its output, creating coherent and contextually relevant responses.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="body1" paragraph>
                            This interactive visualization tool helps you understand the complete journey of how LLMs process and generate text, from the moment you input a prompt until you receive the final response.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Home;