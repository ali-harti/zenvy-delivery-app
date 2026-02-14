// Define the shape of the data coming from the DB
export interface LivreurProfileData {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    roleLabel: string; // e.g., "Livreur"
    ratingScore: number; // e.g., 4.9
    vehicleType: string; // e.g., "Motorbike"
    stats: {
        totalDeliveries: number;
        formattedRating: string;
        memberSinceYear: number;
    };
}
