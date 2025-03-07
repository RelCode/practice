import React, { useState } from 'react';
import { Card, CardActionArea, Box, Grid, Typography, CircularProgress } from '@mui/material';

interface TokensProps {
    text: string;
    onTokenClick?: (token: string, index: number) => void;
    loading: boolean;
}

const Tokens: React.FC<TokensProps> = ({ text, onTokenClick, loading }) => {
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const tokens = text.split(/\s+/).filter(token => token.length > 0);

    const handleTokenClick = (token: string, index: number) => {
        if (onTokenClick) {
            console.log("Token clicked: ", token);
            setSelectedToken(token);
            onTokenClick(token, index);
        }
    };

    const getStyles = (currentToken: string) => {
        const bgColor = currentToken === selectedToken ? '#1976d2' : '#f5f5f5';
        const bgColorHover = currentToken === selectedToken ? '#1565C0' : '#e0e0e0';
        return { 
            minWidth: 80,
            minHeight: 50,
            backgroundColor: bgColor,
            '&:hover': {
                backgroundColor: bgColorHover,
            }
        }
    }

    return (
        <Grid 
            container 
            spacing={1} 
            sx={{ 
            padding: 2,
            justifyContent: 'center' 
            }}
        >
            {tokens.map((token, index) => (
            <Grid item key={`${token}-${index}`} position={'relative'}>
                <Card 
                    sx={getStyles(token)}
                >
                <CardActionArea 
                    onClick={() => handleTokenClick(token, index)}
                    sx={{ height: '100%' }}
                    disabled={loading}
                >
                    {
                        loading && selectedToken === token && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
                                <CircularProgress size={32} sx={{ color: 'white', mr: 1, fontWeight: 900 }} />
                            </Box>
                        )
                    }
                    <Typography
                        sx={{
                            padding: 1.5,
                            textAlign: 'center',
                            fontSize: 30
                        }}
                        color={selectedToken === token ? 'white' : 'text.primary'}
                    >
                       {token}
                    </Typography>
                </CardActionArea>
                </Card>
            </Grid>
            ))}
        </Grid>
    );
};

export default Tokens;