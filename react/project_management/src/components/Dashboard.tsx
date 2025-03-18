import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActionArea
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
// import  from '@mui/icons-material/Dashboard';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Project, TaskItem } from '../utils/dataStructures';
import { useAuth } from '../utils/AuthContext';
import { Edit, OpenInFull } from '@mui/icons-material';
import * as _ from "lodash";

const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [numberOfTasks, setNumberOfTasks] = useState<{[projectId:number]:number}>({});
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const { token, setTempProject, refreshData, isAuthenticated } = useAuth();

    if(!isAuthenticated){
        window.location.href = "/login";
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
            console.log("Data||", data);
            Swal.close();
            setProjects(data.projects);
            setNumberOfTasks(data.numberOfTasks);
        })
        .catch(error => {
            Swal.close();
            console.error("Error", error);
            showMessage("error", "Error", "An error occurred while loading projects");
        });
    },[token, refreshData]);

    console.log("Projects", projects);

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FolderIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h4" color="primary">
                    Projects Dashboard
                    </Typography>
                </Box>
                <Button
                    component={RouterLink}
                    to="/manage-project"
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="large"
                >
                    Create New Project
                </Button>
                </Box>

                <Grid container spacing={3}>
                {_.map(projects,(project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.projectId}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* <CardActionArea 
                        component={RouterLink} 
                        to={`/view-project/?projectId=${project.projectId}`}
                        sx={{ height: '100%' }}
                        > */}
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h4" gutterBottom>
                            {project.name}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                            {project.description}
                            </Typography>
                            <Box
                            sx={{
                                mt: 'auto',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                            >
                                <Typography variant="h5" color="text.primary" sx={{ mt: 'auto', pt: 2 }}>
                                    Number of Tasks: {numberOfTasks?.[project.projectId]}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        onClick={() => setTempProject(project)}
                                        component={RouterLink}
                                        to={`/view-project/?projectId=${project.projectId}`}
                                        variant="outlined"
                                        size="large"
                                    >
                                        <OpenInFull />
                                    </Button>
                                    <Button 
                                        onClick={() => setTempProject(project)}
                                        component={RouterLink}
                                        to={`/manage-project/?projectId=${project.projectId}`}
                                        sx={{ ml: 2 }} variant="contained" size="large"
                                    >
                                        <Edit />
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                        {/* </CardActionArea> */}
                    </Card>
                    </Grid>
                ))}
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h4" color="primary">
                    My Tasks
                    </Typography>
                </Box>
                </Box>

                <Grid container spacing={3}>
                {/* {projects.flatMap(project => project.tasks).map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardActionArea 
                        component={RouterLink} 
                        to={`/view-task/?taskId=${task.id}`}
                        sx={{ height: '100%' }}
                        >
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h5" gutterBottom>
                            {task.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                            {task.description}
                            </Typography>
                            <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>
                            Status: {task.taskStatus}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Due Date: {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                    </Grid>
                ))} */}
                </Grid>
            </Paper>
            </Container>
        </Box>
    );
};

export default Dashboard;