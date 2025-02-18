import React from 'react';
import { AuthProvider } from './utils/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './utils/ProtectedRoutes';
import { Navigation } from './utils/Navigation';
import { Login, Register } from './components/auth';
import { Home, Dashboard } from './components';
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
					<Route path="/dashboard" element={<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
