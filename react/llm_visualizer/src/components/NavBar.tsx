import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from '@mui/material';

const NavBar: React.FC = () => {
    const [ changePath, setChangePath ] = React.useState<string>('');
    const [ selectedPath, setSelectedPath ] = React.useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const path = window.location.pathname.split('/')[1];
        setSelectedPath(path === '' ? '/' : `/${path}`);
    },[changePath]);

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Tokenization', path: '/tokenization' },
        { label: 'Embeddings', path: '/embeddings' },
        { label: 'Attention', path: '/attention' },
        { label: 'Feed-Forward Network', path: '/feedforward' },
        { label: 'Token Prediction', path: '/token-prediction' },
        { label: 'Generation', path: '/generation' }
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
                            onClick={() => {
                                setChangePath(item.path);
                                navigate(item.path);
                            }}
                            style={{
                                backgroundColor: (selectedPath === '' ? '/' : selectedPath) === item.path ? 'rgba(255, 255, 255, 0.4)' : 'transparent',
                                color: '#fff',
                                borderRadius: '4px'
                            }}
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