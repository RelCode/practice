import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Project } from "./dataStructures";

interface AuthContextType {
    token: string | null;
    userName: string | null;
    project: Project | null;
    setTempProject: (project: Project) => void;
    login: (token: string, userName: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    refreshData: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'));
    const [project, setProject] = useState<Project | null>(null);
    const setTempProject = (project: Project) => {
        setProject(project);
    }
    const login = (newToken: string, loggedInUser: string) => {
        setToken(newToken);
        setUserName(loggedInUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('userName', loggedInUser);
        window.location.href = "/dashboard";
    }
    const logout = () => {
        setToken(null);
        setUserName(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
    }
    useEffect(() => {
        if (token){
            try {
                const decodedToken = jwtDecode(token);
                const expirationTime = decodedToken.exp! * 1000;
                if (Date.now() >= expirationTime){
                    logout();
                }else{
                    const timeoutId = setTimeout(logout, expirationTime - Date.now());
                    return () => clearTimeout(timeoutId);
                }
            } catch {
                logout();
            }
        }
    },[token]);

    return (
        <AuthContext.Provider value={{ token, userName, project, setTempProject, login, logout, isAuthenticated: !!token, refreshData: false }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}