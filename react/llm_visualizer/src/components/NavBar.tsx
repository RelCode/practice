import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from '@mui/material';
import path from 'path';

const NavBar: React.FC = () => {
    const navigate = useNavigate();

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Tokenization', path: '/tokenization' },
        { label: 'Embeddings', path: '/embeddings' },
        { label: 'Attention', path: '/attention' },
        { label: 'Feed-Forward Network', path: '/feedforward' },
        // { label: 'Transformer', path: '/transformer' },
        // { label: 'Generation', path: '/generation' },
        { label: 'Token Prediction', path: '/token-prediction' }
    ];

    return (
        <AppBar position="relative">
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                    LLM Visualizer
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            color="inherit"
                            onClick={() => navigate(item.path)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;