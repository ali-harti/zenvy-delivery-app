import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/http';
// import { Store, Product } from '../../api/types/dto'; // Removed invalid imports
import { MOROCCO_STORES } from '../seed/moroccoStores';
import { MOROCCO_PRODUCTS } from '../seed/moroccoProducts';

// Define types locally if missing to avoid blockage, can move to DTO later
export interface ProductDTO {
    id: string | number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category?: string;
    isAvailable: boolean;
    stock?: number;
    popular?: boolean;
}

export interface StoreDetailDTO {
    id: string | number;
    name: string;
    category: string;
    imageUrl?: string;
    heroImageUrl?: string;
    address?: string;
    rating: number;
    deliveryFee: number;
    minimumOrder?: number;
    eta?: string;
    etaMin?: number;
    etaMax?: number;
    products: ProductDTO[];
    isPromoted?: boolean;
}

export const useStoreList = () => {
    return useQuery({
        queryKey: ['stores'],
        queryFn: async () => {
            try {
                const response = await apiClient.get<{ stores: StoreDetailDTO[] }>('/stores');
                return response.data.stores;
            } catch (error) {
                console.warn('API/Network error, falling back to seed data for Stores list.');
                return MOROCCO_STORES as unknown as StoreDetailDTO[];
            }
        },
    });
};

export const useStoreDetails = (storeId: string | number) => {
    return useQuery({
        queryKey: ['store', storeId],
        queryFn: async () => {
            try {
                // Adjust endpoint matching StoreController: GET /api/stores/:id
                const response = await apiClient.get<{ store: StoreDetailDTO }>(`/stores/${storeId}`);
                return response.data.store;
            } catch (error) {
                console.warn(`API/Network error, falling back to seed data for Store #${storeId}.`);
                const store = MOROCCO_STORES.find(s => String(s.id) === String(storeId));
                if (store) {
                    const products = MOROCCO_PRODUCTS.filter(p => String(p.storeId) === String(storeId));
                    return { ...store, products } as unknown as StoreDetailDTO;
                }
                throw error;
            }
        },
        enabled: !!storeId,
    });
};
