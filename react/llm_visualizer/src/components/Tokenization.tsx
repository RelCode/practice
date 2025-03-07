import React, { useState } from 'react';
import axios from 'axios';
import { 
    Box, 
    TextField, 
    Button, 
    Paper, 
    Typography,
    Container,
    CircularProgress
} from '@mui/material';

const Tokenization: React.FC = () => {
const [prompt, setPrompt] = useState<string>('');
const [tokens, setTokens] = useState<string[]>([]);
const [processed, setProcessed] = useState<string>('');
const [savedTokens, setSavedTokens] = useState<string[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string>('');

const handleTokenization = async () => {
    setTokens([]);
    setLoading(true);
    const submittedPrompt = prompt.trimStart().trimEnd();
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/tokenize`, {
            text: submittedPrompt,
        });
        setProcessed(prompt);
        setTokens(response.data.tokens);
        setError('');
    } catch (err) {
        setError('Failed to tokenize the prompt. Please try again.');
        console.error('Tokenization error:', err);
    } finally{
        setLoading(false);
    }
};

return (
    <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Text Tokenization
            </Typography>
            
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    label="Enter your prompt"
                    value={prompt}
                    onChange={(e) => {
                        if(e.target.value === ""){
                            setTokens([]);
                        }
                        setPrompt(e.target.value)
                    }}
                    sx={{ mb: 2 }}
                />
                <Button 
                    variant="contained" 
                    onClick={handleTokenization}
                    disabled={prompt.trim().length < 3 || loading || prompt === processed}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                            Processing...
                        </Box>
                    ) : 'Tokenize'}
                </Button>
            </Paper>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {prompt !== "" && tokens.length > 0 && (
                <Paper elevation={3} sx={{ p: 3, mb: 3, position: 'relative' }}>
                    {
                        savedTokens.length === 0 && (
                            <Button 
                        sx={{ 
                            position: 'absolute', 
                            right: 8, 
                            top: 8,
                            minWidth: '36px',
                            width: '36px',
                            height: '36px',
                            padding: 0
                        }}
                        variant="contained"
                        color="primary"
                        title="Save tokens"
                        onClick={() => {
                            setProcessed('');
                            setSavedTokens(tokens);
                        }}
                    >
                        <Box component="span" sx={{ fontSize: '24px' }}>+</Box>
                    </Button>
                        )
                    }
                    <Typography variant="h6" gutterBottom>
                        Tokens:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tokens.map((token, i) => (
                            <Paper 
                                key={i}
                                sx={{ 
                                    p: 1, 
                                    background: "darkseagreen",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "16pt",
                                    display: 'inline-block',
                                    animation: 'slideIn 0.5s ease forwards',
                                    opacity: 0,
                                    transform: 'translateX(-20px)',
                                    animationDelay: `${i * 0.4}s`,
                                    '@keyframes slideIn': {
                                        '0%': {
                                            opacity: 0,
                                            transform: 'translateX(-20px)',
                                        },
                                        '100%': {
                                            opacity: 1,
                                            transform: 'translateX(0)',
                                        },
                                    },
                                }}
                            >
                                {token}
                            </Paper>
                        ))}
                    </Box>
                </Paper>
            )}
            {
                savedTokens.length > 0 && (
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 3, 
                            position: 'relative',
                            animation: 'slideDown 0.5s ease forwards',
                            '@keyframes slideDown': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translateY(-20px)',
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                },
                            },
                        }}
                    >
                        <Button 
                            sx={{ 
                                position: 'absolute', 
                                right: 8, 
                                top: 8,
                                minWidth: '36px',
                                width: '36px',
                                height: '36px',
                                padding: 0
                            }}
                            variant="contained"
                            color="error"
                            title="Remove tokens"
                            onClick={() => setSavedTokens([])}
                        >
                            <Box component="span" sx={{ fontSize: '24px' }}>-</Box>
                        </Button>
                        <Typography variant="h6" gutterBottom>
                            Previous Tokens:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {savedTokens.map((token, i) => (
                                <Paper 
                                    key={i}
                                    sx={{ 
                                        p: 1, 
                                        background: "darkseagreen",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "16pt",
                                        display: 'inline-block'
                                    }}
                                >
                                    {token}
                                </Paper>
                            ))}
                        </Box>
                    </Paper>
                )
            }
        </Box>
    </Container>
);
};

export default Tokenization;