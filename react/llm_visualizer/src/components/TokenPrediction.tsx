import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Chip, LinearProgress, Card, CardContent, TextField, Button, CircularProgress, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define interface for token prediction data
interface TokenData {
    token: string;
    probability: number;
}

interface TokenPredictionProps {
    inputText?: string;
}

// Styled components for better visualization
const TokenBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
}));

const TokenPrediction: React.FC<TokenPredictionProps> = ({ inputText = '' }) => {
    const [prompt, setPrompt] = useState<string>(inputText || 'The quick brown fox jumps over');
    const [topTokens, setTopTokens] = useState<TokenData[]>([]);
    const [selectedToken, setSelectedToken] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    const fetchTokenPredictions = async () => {
        setIsGenerating(true);
        setError('');
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/token-predictions`, {
                text: prompt.trim()
            });
            setTopTokens(response.data.topTokens);
            setSelectedToken(response.data.selectedToken || '');
        } catch (err) {
            setError('Failed to fetch token predictions. Please try again.');
            console.error('Token prediction error:', err);
        } finally {
            setIsGenerating(false);
        }
    };
    
    useEffect(() => {
        if (prompt) {
            fetchTokenPredictions();
        }
    }, []);
    
    // Find the max probability for scaling the bars
    const maxProbability = Math.max(...topTokens.map(t => t.probability), 0.01);
    
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Token Prediction
                </Typography>
                
                <Card>
                    <CardContent>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Input Text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        
                        <Button 
                            variant="contained" 
                            onClick={fetchTokenPredictions}
                            disabled={prompt.trim().length < 3 || isGenerating}
                            sx={{ mb: 2 }}
                        >
                            {isGenerating ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                                    Predicting...
                                </Box>
                            ) : 'Predict Next Token'}
                        </Button>
                        
                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                        
                        {(isGenerating || topTokens.length > 0) && (
                            <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                                <Typography variant="body1">
                                    Generating next token after: "<strong>{prompt.trim().split(/\s+/).pop() || ''}</strong>"
                                </Typography>
                            </Paper>
                        )}
                        
                        {isGenerating && (
                            <Box sx={{ width: '100%', mb: 2 }}>
                                <LinearProgress />
                                <Typography variant="caption" sx={{ mt: 1 }}>
                                    Generating next token...
                                </Typography>
                            </Box>
                        )}
                        
                        {topTokens.length > 0 && (
                            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Top candidates:
                                </Typography>
                                
                                {topTokens.map((tokenData, index) => (
                                    <TokenBar key={index}>
                                        <Chip 
                                            label={`"${tokenData.token}"`}
                                            color={tokenData.token === selectedToken ? "primary" : "default"}
                                            sx={{ minWidth: 80, mr: 2 }}
                                            onClick={() => {
                                                setSelectedToken(tokenData.token);
                                                setPrompt(prompt.trim() + ' ' + tokenData.token);
                                            }}
                                        />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={(tokenData.probability / maxProbability) * 100}
                                                sx={{ 
                                                    height: 20, 
                                                    borderRadius: 1,
                                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: tokenData.token === selectedToken ? 'primary.main' : 'secondary.main'
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" sx={{ ml: 2, minWidth: 60 }}>
                                            {(tokenData.probability * 100).toFixed(2)}%
                                        </Typography>
                                    </TokenBar>
                                ))}
                            </Paper>
                        )}
                        
                        {selectedToken && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">Selected token:</Typography>
                                <Chip 
                                    label={`"${selectedToken}"`}
                                    color="success"
                                    sx={{ fontSize: '1.1rem', p: 1 }}
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default TokenPrediction;