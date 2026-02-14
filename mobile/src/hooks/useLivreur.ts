import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { livreurApi, LivreurProfile } from '../api/endpoints/livreur';

// Keys
export const LIVREUR_KEYS = {
    all: ['livreur'] as const,
    profile: () => [...LIVREUR_KEYS.all, 'profile'] as const,
    zones: () => [...LIVREUR_KEYS.all, 'zones'] as const,
};

// Hooks
export function useLivreurProfile() {
    return useQuery({
        queryKey: LIVREUR_KEYS.profile(),
        queryFn: async () => {
            const response = await livreurApi.getProfile();
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 mins
    });
}

export function useAvailableZones() {
    return useQuery({
        queryKey: LIVREUR_KEYS.zones(),
        queryFn: async () => {
            const response = await livreurApi.getAvailableZones();
            return response.data;
        },
    });
}

export function useUpdateVehicle() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vehicle: string) => livreurApi.updateVehicle(vehicle),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LIVREUR_KEYS.profile() });
        },
    });
}

export function useCompleteOnboarding() {
    return useMutation({
        mutationFn: livreurApi.completeOnboarding,
    });
}
