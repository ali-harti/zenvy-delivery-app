import { LivreurProfileData } from './profile.types';
// import { apiClient } from '@api/http'; // For future real API integration

/**
 * Fetches the current livreur's profile data
 * @returns Promise with profile data
 * 
 * TODO: Replace with real API call when backend endpoint is ready:
 * return apiClient.get<LivreurProfileData>('/users/me/profile');
 */
export const fetchLivreurProfile = async (): Promise<LivreurProfileData> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock data based on the design structure
    return {
        id: 'liv_12345',
        firstName: 'Karim',
        lastName: 'Benali',
        // Using a placeholder image service
        avatarUrl: 'https://i.pravatar.cc/300?u=karim_benali',
        roleLabel: 'Livreur',
        ratingScore: 4.9,
        vehicleType: 'Motorbike',
        stats: {
            totalDeliveries: 1245,
            formattedRating: '4.9',
            memberSinceYear: 2023,
        },
    };
};
