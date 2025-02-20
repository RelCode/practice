import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { Box, Container, TextField, Button, Typography, Paper, Link } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { validateEmail } from "../../utils/Validator";


const Login: React.FunctionComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isAuthenticated } = useAuth();

    if(isAuthenticated){
        window.location.href = "/dashboard";
    }

    const actionLoader = (message: string) : void => {
        withReactContent(Swal).fire({
            title: message,
            allowOutsideClick: false,
            didOpen: () => {
                withReactContent(Swal).showLoading();
            }
        })
    }

    const showMessage = (swalIcon: SweetAlertIcon, swalTitle: string, swalText: string, swalColor: string = '#1976d2') : void => {
        withReactContent(Swal).fire({
            icon: swalIcon,
            title: swalTitle,
            text: swalText,
            confirmButtonColor: swalColor
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(email === "" || password === "") {
            showMessage("error", "Error", "Please fill in all fields");
            return;
        }
        if(!validateEmail(email)) {
            showMessage("error", "Error", "Invalid email address");
            return;
        }
        actionLoader("Logging in...");
        const payload : object = { 
            email: email, 
            password: password 
        };
        fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => response.json())
        .then(data => {
            console.log("Data: ", data);
            if(data.message){
                withReactContent(Swal).close();
                showMessage("error", "Error", data.message);
                return;
            }
            withReactContent(Swal).close();
            login(data.token, data.userName);
        }).catch(error => {
            console.log("Error: ", error);
            withReactContent(Swal).close();
            showMessage("error", "Error", "An error occurred. Please try again later.");
        })
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
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="off"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
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