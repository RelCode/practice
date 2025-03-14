import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { TaskItem, TaskStatus } from '../../utils/dataStructures';
import { useAuth } from '../../utils/AuthContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';

const TaskForm: React.FC = () => {
const navigate = useNavigate();
const { token, isAuthenticated } = useAuth();
const [id, setId] = useState<number>(0);
const [taskName, setTaskName] = useState<string>("");
const [taskDescription, setTaskDescription] = useState<string>("");
const [dueDate, setDueDate] = useState<Date | null>(null);
const [taskStatus, setTaskStatus] = useState<string>("New");
const taskId = new URL(window.location.href).searchParams.get("taskId") || null;
const projectId = new URL(window.location.href).searchParams.get("projectId") || null;

if(!isAuthenticated){
    window.location.href = "/login";
}

if(taskId && id === 0){
    setId(parseInt(taskId));
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

const fetchCurrentTaskDetails = async () => {
    actionLoader("Loading task details...");
    try {
        await fetch(`/api/tasks/${taskId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json())
        .then(data => {
            if(data.message){
                Swal.close();
                showMessage("error", "Error", data.message);
                return;
            }
            setId(data['taskId']);
            setTaskName(data['title']);
            setTaskDescription(data['description']);
            setDueDate(data['dueDate'] ? new Date(data['dueDate']) : null);
            setTaskStatus(data['status']);
            Swal.close();
        })
        .catch(error => {
            console.log("Error", error);
            Swal.close();
        })
    } catch (error) {
        console.log("Error", error);
        Swal.close();
        showMessage("error", "Error", "An error occurred while fetching task details");
    }
}

useEffect(() => {
    taskId && Number(taskId) !== 0 && fetchCurrentTaskDetails();
}, []);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim() || !taskDescription.trim() || !dueDate) {
        showMessage("error", "Validation Error", "Please fill in all required fields");
        return;
    }

    const taskData = {
        taskId: "",
        title: taskName,
        description: taskDescription,
        dueDate: dueDate?.toISOString(),
        status: taskStatus,
        projectId: projectId,
        project: {},
        assignments: []
    };

    actionLoader(taskId ? "Updating task..." : "Creating task...");

    try {
        const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";
        const method = taskId ? "PUT" : "POST";
        console.log("properties", [url, method, taskData]);
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
        }).then(response => response.json())
        .then(data => {
            console.log("is there feedback? ", data);
            if(data.errors){
                showMessage("error", "Error", data.errors[Object.keys(data.errors)[0]][0] || "Please fill in all required fields");
                return;
            }
            if(data.message){
                Swal.close();
                showMessage("error", "Error", data.message);
                return;
            }
            setId(data.taskId);
            Swal.close();
            showMessage("success", "Success", "Task has been saved successfully");
            if (projectId) {
                setTimeout(() => navigate(`/projects/edit?projectId=${projectId}`), 1500);
            } else {
                setTimeout(() => navigate('/dashboard'), 1500);
            }
        }).catch(error => {
            console.log("Error", error);
            Swal.close();
            showMessage("error", "Error", "An error occurred while saving the task");
        });
    } catch (error) {
        Swal.close();
        showMessage("error", "Error", "An error occurred while saving the task");
    }
};

return (
    <Box sx={{ py: 4 }}>
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <AssignmentIndIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h4" color="primary">
                        {taskId ? 'Edit Task' : 'Create New Task'}
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Task Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Due Date"
                            value={dueDate}
                            onChange={(newValue) => setDueDate(newValue)}
                            slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                        />
                    </LocalizationProvider>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="task-status-label">Status</InputLabel>
                        <Select
                            labelId="task-status-label"
                            value={taskStatus}
                            label="Status"
                            onChange={(e) => setTaskStatus(e.target.value)}
                        >
                            {Object.keys(TaskStatus).map((status: string, index: number) => (
                                <MenuItem key={status} value={index}>
                                    {Object.values(TaskStatus)[index]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(projectId ? `/view-project?projectId=${projectId}` : '/dashboard')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                        >
                            {taskId ? 'Update Task' : 'Create Task'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    </Box>
);
};

export default TaskForm;