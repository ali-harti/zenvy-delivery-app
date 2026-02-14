import { create } from 'zustand';
import { storage } from '@utils/storage';
import { useLivreurStore } from '../../stores/livreur.store';
import { useDeliveryStore } from '../../stores/delivery.store';
import { apiClient } from '@api/http';
import { UserDTO, LoginResponse, RegisterResponse } from '@api/types/dto';
import { socketService } from '@realtime/socket';
import { NormalizedError } from '@api/utils/errorNormalizer';

interface AuthState {
    user: UserDTO | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    isHydrated: boolean;

    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    needsCustomerOnboarding: boolean;
    setNeedsCustomerOnboarding: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    needsCustomerOnboarding: false,
    isHydrated: false, // Start false

    setNeedsCustomerOnboarding: (v) => set({ needsCustomerOnboarding: v }),

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post<any, ApiResponse<LoginResponse>>('/auth/login', credentials);

            // @ts-ignore
            const { token, user } = response.data || response;

            if (!user || !token) {
                console.error("Invalid login response:", response);
                throw new Error("Invalid response from server");
            }

            await storage.setToken(token);
            await storage.setItem('zenvy_user', user);

            // Connect Socket
            socketService.connect();

            console.log("[AuthStore] Login success. Role:", user.role);
            set({
                isAuthenticated: true,
                user,
                isLoading: false,
                needsCustomerOnboarding: user.role === 'customer' // Force onboarding for customers
            });

            // ✅ Force Livreur Onboarding for every login (Session Reset)
            if (user.role === 'courier') {
                useLivreurStore.getState().resetShift();
            }

            console.log("[AuthStore] needsCustomerOnboarding set to:", user.role === 'customer');
        } catch (error: any) {
            const normalized = error as NormalizedError;
            set({
                isLoading: false,
                error: normalized.message || 'Login failed'
            });
            throw error;
        }
    },

    register: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post<any, ApiResponse<RegisterResponse>>('/auth/register', data);

            // Check if response has data property (standard API wrapper)
            // @ts-ignore
            const { token, user } = response.data || response;

            if (!user || !token) {
                console.error("Invalid auth response:", response);
                throw new Error("Invalid response from server");
            }

            // Do NOT auto-login. Just return success.
            set({ isLoading: false });
        } catch (error: any) {
            const normalized = error as NormalizedError;
            set({
                isLoading: false,
                error: normalized.message || 'Registration failed'
            });
            throw error;
        }
    },

    logout: async () => {
        await storage.removeToken();
        await storage.removeItem('zenvy_user');

        // Disconnect Socket
        socketService.disconnect();

        // ✅ Clear Role-Specific Stores
        useLivreurStore.getState().resetShift();
        useDeliveryStore.getState().clearActiveDelivery();

        set({
            user: null,
            isAuthenticated: false,
            error: null,
            needsCustomerOnboarding: false
        });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const token = await storage.getToken();
            const storedUser = await storage.getItem<UserDTO>('zenvy_user');

            console.log("[AuthStore] checkAuth found:", { token: !!token, user: storedUser?.email });

            if (!token || !storedUser) {
                set({ isAuthenticated: false, user: null, isLoading: false, isHydrated: true });
                return;
            }

            set({ isAuthenticated: true, user: storedUser, isLoading: false, isHydrated: true });
            // Reconnect socket on app launch if auth exists
            socketService.connect();

        } catch (error) {
            set({ isAuthenticated: false, user: null, isLoading: false, isHydrated: true });
        }
    },

    updateProfile: async (data: Partial<UserDTO>) => {
        // In a real app, API call here: await apiClient.patch('/users/me', data);
        // For now, local update
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...data };
        set({ user: updatedUser });
        await storage.setItem('zenvy_user', updatedUser);
    }
}));

// Type helper for response
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
