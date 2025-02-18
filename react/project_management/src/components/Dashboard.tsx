import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Chip,
    Card,
    CardContent,
    CardActionArea
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Project } from '../utils/dataStructures';
import { useAuth } from '../utils/AuthContext';

const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const { token, refreshData } = useAuth();

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

    useEffect(() => {
        actionLoader("Loading projects...");
        fetch("api/projects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            Swal.close();
            setProjects(data);
        })
        .catch(error => {
            Swal.close();
            console.error("Error", error);
            showMessage("error", "Error", "An error occurred while loading projects");
        });
    },[token, refreshData]);

    console.log("Projects", projects);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 4 }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Typography variant="h4" color="primary">
                                Projects Dashboard
                            </Typography>
                        </Box>
                        <Button
                            component={RouterLink}
                            to="/create-project"
                            variant="contained"
                            startIcon={<AddIcon />}
                            size="large"
                        >
                            Create New Project
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {projects.map((project) => (
                            <Grid item xs={12} sm={6} md={4} key={project.id}>
                                <Card>
                                    <CardActionArea component={RouterLink} to={`/project/${project.id}`}>
                                        <CardContent>
                                            <Typography variant="h4" gutterBottom>
                                                {project.name}
                                            </Typography>
                                            <Typography variant="h6" color="text.secondary">
                                                {project.description}
                                            </Typography>
                                            <Typography variant="h5" color="text.primary" sx={{ mt: 2 }}>
                                                Number of Tasks: {project?.tasks ? project.tasks.length : 0}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default Dashboard;