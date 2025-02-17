import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    }
    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
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
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
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