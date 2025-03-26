import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { TaskItem, TaskStatus } from '../../utils/dataStructures';
import { useAuth } from '../../utils/AuthContext';
import SaveIcon from '@mui/icons-material/Save';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Grid,
    Card,
    CardContent,
    FormHelperText,
    CircularProgress
} from '@mui/material';

const ManageTask: React.FC = () => {
    const [task, setTask] = useState<TaskItem | null>(null);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const { token, isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get("taskId");
    const projectId = searchParams.get("projectId");
    const navigate = useNavigate();

    if (!isAuthenticated) {
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

    const fetchTaskDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/tasks/detail/${taskId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.message) {
                showMessage("error", "Error", data.message);
                return;
            }
            
            setTask(data);
            setSelectedStatus(data.status);
            // setSelectedUsers(data.assignedUsers?.map((user: User) => user.userId) || []);
        } catch (error) {
            console.error("Error", error);
            showMessage("error", "Error", "An error occurred while loading task details");
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const response = await fetch(`/api/assignTasks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log("UserData", data);
            
            if (data.message) {
                showMessage("error", "Error", data.message);
                return;
            }
            
            setAvailableUsers(data);
        } catch (error) {
            console.error("Error", error);
            showMessage("error", "Error", "An error occurred while loading available users");
        }
    };

    useEffect(() => {
        if (taskId) {
            fetchTaskDetails();
            fetchAvailableUsers();
        }
    }, [taskId, token]);

    const handleSubmit = async () => {
        actionLoader("Updating task...");
        
        try {
            const response = await fetch(`/api/tasks/update/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: selectedStatus,
                    assignedUsers: selectedUsers
                })
            });
            
            const data = await response.json();
            Swal.close();
            
            if (data.message && !data.success) {
                showMessage("error", "Error", data.message);
                return;
            }
            
            showMessage("success", "Success", "Task updated successfully");
            navigate(`/tasks?projectId=${projectId}`);
        } catch (error) {
            Swal.close();
            console.error("Error", error);
            showMessage("error", "Error", "An error occurred while updating the task");
        }
    };

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AssignmentIndIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Typography variant="h4" color="primary">
                                Manage Task
                            </Typography>
                        </Box>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        task ? (
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5" gutterBottom>
                                                {task.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" paragraph>
                                                {task.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Due Date: {new Date(task.dueDate).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="status-select-label">Task Status</InputLabel>
                                        <Select
                                            labelId="status-select-label"
                                            value={selectedStatus}
                                            label="Task Status"
                                            // onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
                                        >
                                            {Object.values(TaskStatus).map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="users-select-label">Assign Users</InputLabel>
                                        <Select
                                            labelId="users-select-label"
                                            multiple
                                            value={selectedUsers}
                                            onChange={(e) => setSelectedUsers(e.target.value as string[])}
                                            // renderValue={(selected) => (
                                            //     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            //         {selected.map((value) => {
                                            //             const user = availableUsers.find(u => u.userId === value);
                                            //             return (
                                            //                 <Chip key={value} label={user?.userName || value} />
                                            //             );
                                            //         })}
                                            //     </Box>
                                            // )}
                                        >
                                            {/* {availableUsers.map((user) => (
                                                <MenuItem key={user.userId} value={user.userId}>
                                                    {user.userName}
                                                </MenuItem>
                                            ))} */}
                                        </Select>
                                        <FormHelperText>Select users to assign to this task</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSubmit}
                                        size="large"
                                    >
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography variant="h6" color="error" align="center">
                                Task not found
                            </Typography>
                        )
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default ManageTask;