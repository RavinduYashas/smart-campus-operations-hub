import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (token, userData = null) => {
        localStorage.setItem('token', token);
        if (userData) {
            setUser(userData);
            setLoading(false);
        } else {
            await fetchUser(token);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    const fetchUser = async (token) => {
        try {
            const response = await axios.get('http://localhost:8081/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }

        // Set up Axios interceptor for handling 401 errors globally
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, token: localStorage.getItem('token') }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
