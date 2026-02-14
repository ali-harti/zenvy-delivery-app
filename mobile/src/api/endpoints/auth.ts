import { apiClient } from '../http';
import { ApiResponse, LoginResponse, RegisterResponse, UserDTO } from '../types/dto';

export const authApi = {
    login: (credentials: any) =>
        apiClient.post<any, ApiResponse<LoginResponse>>('/auth/login', credentials),

    register: (data: any) =>
        apiClient.post<any, ApiResponse<RegisterResponse>>('/auth/register', data),

    logout: () =>
        apiClient.post<any, ApiResponse<void>>('/auth/logout'),

    getMe: () =>
        apiClient.get<any, ApiResponse<UserDTO>>('/auth/me'),
};
