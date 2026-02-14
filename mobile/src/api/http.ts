import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@config/env';
import { storage } from '@utils/storage';
import { AppError } from './types/errors';
import { normalizeError, AppErrorCode } from './utils/errorNormalizer';

export const apiClient = axios.create({
    baseURL: ENV.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor: Attach Token & Request ID
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add X-Request-ID if not present (simple generation)
        if (!config.headers['X-Request-ID']) {
            config.headers['X-Request-ID'] = `mobile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Error Normalization
apiClient.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<any>) => {
        const status = error.response ? error.response.status : (error.request ? 0 : -1);
        const data = error.response ? error.response.data : null;

        const normalized = normalizeError(status, data);

        // Handle 401 Unauthorized (Global Logout trigger check)
        if (normalized.code === AppErrorCode.UNAUTHORIZED) {
            // Could emit a global event here if needed
            // DeviceEventEmitter.emit('auth:unauthorized');
        }

        return Promise.reject(normalized);
    }
);
