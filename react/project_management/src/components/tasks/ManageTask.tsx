import React, { useState, useEffect, ReactElement } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { TaskItem, TaskStatus, User, ColorCodes } from '../../utils/dataStructures';
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
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
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

    const processUserData = (data: any): void => {
        var userList: User[] = data.userList;
        var assignedUsers: User[] = data.assignedUsers;
        console.log("User List", userList);
        console.log("Assigned Users", assignedUsers);
        if (assignedUsers.length > 0){
            console.log("Assigned Users", assignedUsers);
        }else{
            setAvailableUsers(userList);
        }
    }

    const fetchAvailableUsers = async () => {
        try {
            const response = await fetch(`/api/assignTasks/${taskId}`, {
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
            setTask(data.taskItem);
            processUserData(data);
        } catch (error) {
            console.error("Error", error);
            showMessage("error", "Error", "An error occurred while loading available users");
        } finally {
            setLoading(false);
        }
    };

    console.log("Task", task);

    useEffect(() => {
        if (taskId) {
            // fetchTaskDetails();
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

    const colorCodeStatus = (status: string): ReactElement => {
        return (<strong style={{color:ColorCodes[TaskStatus.indexOf(status)]}}>[{status}]</strong>)
    }

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
                                                {task.title} { colorCodeStatus(task.status) }
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" paragraph>
                                                {task.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Due Date: { task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-za') : 'N/A' }
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="users-select-label">Assign Users</InputLabel>
                                        <Select
                                            labelId="users-select-label"
                                            multiple
                                            value={selectedUsers}
                                            onChange={(e) => setSelectedUsers(e.target.value as string[])}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        const user = availableUsers.find(u => u.userId === value);
                                                        return (
                                                            <Chip key={value} label={user?.lastName || value} />
                                                        );
                                                    })}
                                                </Box>
                                            )}
                                        >
                                            {availableUsers.map((user) => (
                                                <MenuItem key={user.userId} value={user.userId}>
                                                    {user.firstName} {user.lastName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>Select users to assign to this task</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                                <Button
                                        variant="outlined"
                                        startIcon={<SaveIcon />}
                                        onClick={() => navigate(`/view-project/?projectId=${projectId}`)}
                                        size="large"
                                    >
                                        Cancel
                                    </Button>
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