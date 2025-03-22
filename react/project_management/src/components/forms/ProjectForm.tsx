import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Project, TaskItem } from '../../utils/dataStructures';
import { useAuth } from '../../utils/AuthContext';

import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    TextField,
    Autocomplete,
    Chip,
} from '@mui/material';


const ProjectForm: React.FC = () => {
const navigate = useNavigate();
const { token, isAuthenticated } = useAuth();
const [id, setId] = useState<number>(0);
const [projectName, setProjectName] = useState<string>("");
const [projectDescription, setProjectDescription] = useState<string>("");
const [selectedTasks, setSelectedTasks] = useState<TaskItem[]>([]);
const [availableTasks, setAvailableTasks] = useState<TaskItem[]>([]);
const projectId = new URL(window.location.href).searchParams.get("projectId") || null;

if(!isAuthenticated){
    window.location.href = "/login";
}

if(projectId && id === 0){
    setId(parseInt(projectId));
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

const fetchCurrentProjectDetails = async () => {
    actionLoader("Loading project details...");
    try {
        await fetch(`/api/projects/${projectId}`, {
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
            setId(data['projectId']);
            setProjectName(data['name']);
            setProjectDescription(data['description']);
            Swal.close();
        })
        .catch(error => {
            console.log("Error", error);
            Swal.close();
        })
    } catch (error) {
        console.log("Error", error);
        Swal.close();
        showMessage("error", "Error", "An error occurred while fetching project details");
    }
}

useEffect(() => {
    // Fetch available tasks
    projectId && Number(projectId) !== 0 && fetchCurrentProjectDetails();
}, []);
console.log("Project ID", projectId);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim() || !projectDescription.trim()) {
        showMessage("error", "Validation Error", "Please fill in all required fields");
        return;
    }

    const projectData = {
        name: projectName,
        description: projectDescription,
        ownerId: "",
        taskIds: selectedTasks.map(task => task.taskItemId)
    };
    console.log("Project Data", projectData);

    actionLoader(projectId ? "Updating project..." : "Creating project...");

    try {
        const url = projectId ? `/api/projects/${projectId}` : "/api/projects";
        const method = projectId ? "PUT" : "POST";
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
        }).then(response => response.json())
        .then(data => {
            if(data.errors){
                showMessage("error", "Error", data.errors[Object.keys(data.errors)[0]][0] || "Please fill in all required fields");
                return;
            }
            if(data.message){
                Swal.close();
                showMessage("error", "Error", data.message);
                return;
            }
            setId(data.projectId);
            Swal.close();
            showMessage("success", "Success", "Project has been saved successfully");
        }).catch(error => {
            console.log("Error", error);
            Swal.close();
            showMessage("error", "Error", "An error occurred while saving the project");
        });
    } catch (error) {
        Swal.close();
        showMessage("error", "Error", "An error occurred while saving the project");
    }
};

return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 4 }}>
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h4" color="primary">
                        {projectId ? 'Edit Project' : 'Create New Project'}
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Project Description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                    />

                    { availableTasks.length > 0 && (<Autocomplete
                        multiple
                        options={availableTasks}
                        getOptionLabel={(option) => option.title}
                        value={selectedTasks}
                        onChange={(_, newValue) => setSelectedTasks(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Link Tasks"
                                margin="normal"
                            />
                        )}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    label={option.title}
                                    {...getTagProps({ index })}
                                    key={option.taskItemId}
                                />
                            ))
                        }
                    />)}

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                            {id > 0 && projectName.length > 2 && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate(`/manage-task?action=create&projectId=${id}`)}
                                >
                                    Create Tasks for { projectName.substring(0,30) + (projectName.length > 30 ? "..." : "") }
                                </Button>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                            >
                                {projectId ? 'Update Project' : 'Create Project'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Container>
    </Box>
);
};

export default ProjectForm;