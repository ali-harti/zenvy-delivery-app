import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/http';
import { OrderDTO } from './useOrdersQuery';

export interface DeliveryLocation {
    latitude: number;
    longitude: number;
    heading: number;
}

export interface TrackingResponse {
    order: OrderDTO;
    courierLocation?: DeliveryLocation;
    eta?: number; // minutes
}

export const useOrderTracking = (orderId: string) => {
    return useQuery({
        queryKey: ['tracking', orderId],
        queryFn: async () => {
            // If backend has specific tracking endpoint:
            // const response = await apiClient.get<TrackingResponse>(`/orders/${orderId}/tracking`);
            // return response.data;

            // Fallback to order details for now, simulating location if needed
            const response = await apiClient.get<{ order: OrderDTO }>(`/orders/${orderId}`);

            // Simulate courier location for demo if status is 'picked_up'
            const mockLocation = response.data.order.status === 'picked_up' || response.data.order.status === 'preparing' ? {
                latitude: 40.7128 + (Math.random() * 0.01 - 0.005),
                longitude: -74.0060 + (Math.random() * 0.01 - 0.005),
                heading: 0
            } : undefined;

            return {
                order: response.data.order,
                courierLocation: mockLocation,
                eta: 15 // mock
            };
        },
        refetchInterval: 5000, // Poll every 5s
        enabled: !!orderId,
    });
};
