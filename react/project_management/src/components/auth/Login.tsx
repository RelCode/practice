import React, { useState } from "react";
import { Box, Container, TextField, Button, Typography, Paper, Link } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';

const Login: React.FunctionComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login attempt with:", { email, password });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
                        Sign in to continue managing your projects
                    </Typography>

                    <Box sx={{ mb: 5 }}>
                        <LoginIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Link href="/register" variant="body2">New user? Register here</Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;