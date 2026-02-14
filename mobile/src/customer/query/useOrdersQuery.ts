import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/http';

export interface OrderItemDTO {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product?: {
        name: string;
    };
}

export interface OrderDTO {
    id: string;
    status: string; // 'pending' | 'preparing' | 'picked_up' | 'delivered' | 'cancelled'
    totalAmount: number;
    createdAt: string;
    store: {
        id: string;
        name: string;
        imageUrl?: string;
    };
    items: OrderItemDTO[];
}

export const useOrdersQuery = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await apiClient.get<{ orders: OrderDTO[] }>('/orders');
            return response.data.orders;
        },
    });
};

export const useOrderDetailQuery = (orderId: string) => {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const response = await apiClient.get<{ order: OrderDTO }>(`/orders/${orderId}`);
            return response.data.order;
        },
        enabled: !!orderId,
    });
};
