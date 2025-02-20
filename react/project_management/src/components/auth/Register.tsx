import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { Box, Container, TextField, Button, Typography, Paper, Link } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { validateEmail } from "../../utils/Validator";

const Register: React.FunctionComponent = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { isAuthenticated } = useAuth();

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
        if (firstName === "" || lastName === "" || email === "" || password === "" || confirmPassword === "") {
            showMessage("error", "Error", "Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            showMessage("error", "Error", "Passwords do not match");
            return;
        }
        if (!validateEmail(email)) {
            showMessage("error", "Error", "Invalid email address");
            return;
        }
        actionLoader("Creating account...");
        const payload: object = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
        fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => response.json())
        .then(data => {
            console.log("Data: ", data);
            if (data.errors) {
                withReactContent(Swal).close();
                showMessage("error", "Error", data.errors[0].description);
                return;
            }
            withReactContent(Swal).close();
            showMessage("success", "Success", "Account created successfully");
            resetFields();
        }).catch(error => {
            console.log("Error: ", error);
            withReactContent(Swal).close();
            showMessage("error", "Error", "An error occurred. Please try again later.");
        });
    };

    const resetFields = () : void => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

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
                        Join TaskMaster
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        Create an account to start managing projects
                    </Typography>

                    <Box sx={{ mb: 5 }}>
                        <PersonAddIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoFocus
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create Account
                        </Button>
                        <Link href="/login" variant="body2">Already have an account? Sign in</Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;