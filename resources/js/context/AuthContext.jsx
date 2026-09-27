import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('m3s_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('m3s_token') || null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState('login'); // 'login' or 'register'

    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        const { token: authToken, user: authUser } = res.data;
        setToken(authToken);
        setUser(authUser);
        localStorage.setItem('m3s_token', authToken);
        localStorage.setItem('m3s_user', JSON.stringify(authUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        setIsAuthModalOpen(false);
        return authUser;
    };

    const register = async (userData) => {
        const res = await axios.post('/api/auth/register', userData);
        const { token: authToken, user: authUser } = res.data;
        setToken(authToken);
        setUser(authUser);
        localStorage.setItem('m3s_token', authToken);
        localStorage.setItem('m3s_user', JSON.stringify(authUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        setIsAuthModalOpen(false);
        return authUser;
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post('/api/auth/logout');
            }
        } catch (e) {
            // ignore
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('m3s_token');
            localStorage.removeItem('m3s_user');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const openAuthModal = (tab = 'login') => {
        setAuthModalTab(tab);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const isAdmin = user && user.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAdmin,
            login,
            register,
            logout,
            isAuthModalOpen,
            authModalTab,
            setAuthModalTab,
            openAuthModal,
            closeAuthModal,
            setUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
