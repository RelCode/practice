import React from 'react';
import { AuthProvider } from './utils/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './utils/Navigation';
import { Login, Register } from './components/auth';
import { Home, Dashboard, ViewTasks } from './components';
import { ProjectForm, TaskForm } from './components/forms';
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
	return (
		<AuthProvider>
			<Router>
				<Navigation />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/view-project" element={<ViewTasks />} />
					<Route path="/manage-project" element={<ProjectForm />} />
					<Route path="/manage-task" element={<TaskForm />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
