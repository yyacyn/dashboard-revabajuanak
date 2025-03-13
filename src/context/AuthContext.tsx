import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    lastPath: string;
    setLastPath: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [lastPath, setLastPath] = useState("/");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                setIsAuthenticated(true);
                // Get last path from localStorage if available
                const savedPath = localStorage.getItem("lastPath");
                if (savedPath) {
                    setLastPath(savedPath);
                }
            } else {
                localStorage.removeItem("token");
            }
        }
    }, []);

    // Store the current path in localStorage whenever it changes
    useEffect(() => {
        if (lastPath !== "/" && lastPath !== "/signin" && lastPath !== "/signup") {
            localStorage.setItem("lastPath", lastPath);
        }
    }, [lastPath]);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("lastPath");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, lastPath, setLastPath }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};