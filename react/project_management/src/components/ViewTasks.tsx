import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { TaskItem, TaskStatus } from '../utils/dataStructures';
import * as _ from "lodash";
import { useAuth } from '../utils/AuthContext';

import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Card,
    CardContent
} from '@mui/material';
import { Edit, OpenInFull } from '@mui/icons-material';
import { el } from 'date-fns/locale';

const ViewTasks: React.FC = () => {
const [tasks, setTasks] = useState<TaskItem[]>([]);
const { token, isAuthenticated } = useAuth();
const [ searchParams ] = useSearchParams();
const projectId = searchParams.get("projectId");

if(!isAuthenticated){
    window.location.href = "/login";
}

const actionLoader = (message: string): void => {
    withReactContent(Swal).fire({
        title: message,
        allowOutsideClick: false,
        didOpen: () => {
            withReactContent(Swal).showLoading();
        }
    });
};

const showMessage = (swalIcon: SweetAlertIcon, swalTitle: string, swalText: string, swalColor: string = '#1976d2'): void => {
    withReactContent(Swal).fire({
        icon: swalIcon,
        title: swalTitle,
        text: swalText,
        confirmButtonColor: swalColor
    });
};

const fetchProjectTasks = async () => {
    actionLoader("Loading tasks...");
    fetch(`/api/tasks/${projectId}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.message){
            Swal.close();
            showMessage("error", "Error", data.message);
            return;
        }
        console.log("Data",data);
        Swal.close();
        setTasks(data);
    })
    .catch(error => {
        Swal.close();
        console.error("Error", error);
        showMessage("error", "Error", "An error occurred while loading tasks");
    });
}

useEffect(() => {
    fetchProjectTasks();
}, [token]);

return (
    <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Typography variant="h4" color="primary">
                            Project Tasks
                        </Typography>
                    </Box>
                    <Button
                        component={RouterLink}
                        to={`/manage-task?action=create&projectId=${projectId}`}
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="large"
                    >
                        Create New Task
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    { tasks.length > 0 ? tasks.map((task) => (
                        <Grid item xs={12} sm={6} md={4} key={task.taskItemId}>
                            <Card sx={{ height: '100%', display: 'flex' }}>
                                {/* <CardActionArea component={RouterLink} to={`/task/${task.id}`} sx={{ height: '100%' }}> */}
                                    <CardContent sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Typography variant="h3" gutterBottom>
                                            {task.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" gutterBottom>
                                            {task.description}
                                        </Typography>
                                        <Box>
                                            <Typography variant="h5" color="primary">
                                                Status: {task.status}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Due Date: {new Date(task.dueDate).toLocaleDateString()}
                                            </Typography>
                                            {/* <Typography variant="body2" color="text.secondary">
                                                Assigned to: {task.}
                                            </Typography> */}
                                        </Box>
                                        { task.status !== TaskStatus.Completed ? (<Box
                                        sx={{
                                            mt: 'auto',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                        >
                                            <Button
                                                component={RouterLink}
                                                to={`/manage-task?action=update&projectId=${task.projectId}`}
                                                variant="outlined"
                                                size="large"
                                            >
                                                <OpenInFull />
                                            </Button>
                                            <Button
                                                component={RouterLink}
                                                to={`/manage-task?projectId=${task.projectId}&taskId=${task.taskItemId}`}
                                                sx={{ ml: 2 }} variant="contained" size="large"
                                            >
                                                <Edit />
                                            </Button>
                                        </Box>) : null }
                                    </CardContent>
                                {/* </CardActionArea> */}
                            </Card>
                        </Grid>
                    )) : (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        No tasks found
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ) }
                </Grid>
            </Paper>
        </Container>
    </Box>
);
};

export default ViewTasks;