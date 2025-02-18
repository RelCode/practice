import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
AppBar, 
Toolbar, 
Button, 
Box, 
Container,
Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from './AuthContext';

export const Navigation: React.FC = () => {
	const { isAuthenticated, logout } = useAuth();
	
	return (
		<AppBar position="relative" color="primary">
			<Container maxWidth="lg">
				<Toolbar>
					<Typography
						variant="h6"
						component={RouterLink}
						to="/"
						sx={{
						flexGrow: 1,
						textDecoration: 'none',
						color: 'inherit'
						}}
					>
						TaskMaster
					</Typography>
					
					<Box sx={{ display: 'flex', gap: 2 }}>
						{isAuthenticated ? (
						<>
							<Button
							color="inherit"
							component={RouterLink}
							to="/dashboard"
							startIcon={<DashboardIcon />}
							>
							Dashboard
							</Button>
							<Button
							color="inherit"
							component={RouterLink}
							to="/profile"
							startIcon={<PersonIcon />}
							>
							Profile
							</Button>
							<Button
							color="inherit"
							onClick={logout}
							startIcon={<LogoutIcon />}
							>
							Logout
							</Button>
						</>
						) : (
						<>
							<Button
							color="inherit"
							component={RouterLink}
							to="/login"
							startIcon={<LoginIcon />}
							>
							Login
							</Button>
							<Button
							color="inherit"
							component={RouterLink}
							to="/register"
							startIcon={<PersonAddIcon />}
							>
							Register
							</Button>
						</>
						)}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};