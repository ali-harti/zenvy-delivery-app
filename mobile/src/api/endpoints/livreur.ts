import { apiClient } from '../http';
import { ApiResponse } from '../types/response';

export interface LivreurProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    photoUrl: string;
    rating: number;
    preferredVehicle: 'bike' | 'scooter' | 'car';
    currentZone: string;
    onboardingComplete: boolean;
    locationPermissionGranted: boolean;
    notificationPermissionGranted: boolean;
}

export interface DeliveryZone {
    id: string;
    name: string;
    city: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
}

export const livreurApi = {
    getProfile: () => apiClient.get<never, ApiResponse<LivreurProfile>>('/livreur/profile'),

    getOnboardingStatus: () => apiClient.get<never, ApiResponse<{ completed: boolean }>>('/livreur/onboarding/status'),

    completeOnboarding: (data: {
        preferredVehicle: string;
        currentZone: string;
        locationPermission: boolean;
        notificationPermission: boolean;
        isOnline: boolean;
    }) => apiClient.post<never, ApiResponse<void>>('/livreur/onboarding/complete', data),

    updateVehicle: (vehicle: string) => apiClient.put<never, ApiResponse<void>>('/livreur/vehicle', { vehicle }),

    updateZone: (zoneId: string) => apiClient.put<never, ApiResponse<void>>('/livreur/zone', { zone: zoneId }),

    // Zone endpoints might belong here if specific to livreur selection
    getAvailableZones: () => apiClient.get<never, ApiResponse<DeliveryZone[]>>('/zones/available'),
};
