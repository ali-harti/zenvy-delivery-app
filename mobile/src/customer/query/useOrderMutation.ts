import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/http';

export interface OrderPayload {
    storeId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
        options?: any; // For now
    }>;
    totalAmount: number;
    deliveryAddressId: string; // or full address object if backend expects
    paymentMethod: string;
    deliveryInstructions?: string;
}

export const useOrderMutation = () => {
    return useMutation({
        mutationFn: async (payload: OrderPayload) => {
            // Adjust endpoint matching OrderController: POST /api/orders
            // We might need to send just IDs or full objects depending on backend. 
            // Assuming simplified payload for now.
            const response = await apiClient.post('/orders', payload);
            return response.data;
        }
    });
};
