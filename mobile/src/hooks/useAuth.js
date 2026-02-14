import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { login, register, logout, checkAuth } from '../store/slices/authSlice';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const handleLogin = async (credentials) => {
        return dispatch(login(credentials)).unwrap();
    };

    const handleRegister = async (userData) => {
        return dispatch(register(userData)).unwrap();
    };

    const handleLogout = async () => {
        return dispatch(logout()).unwrap();
    };

    const checkAuthStatus = () => {
        dispatch(checkAuth());
    };

    return {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        checkAuthStatus
    };
};
