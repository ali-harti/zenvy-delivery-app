import { apiClient } from '../http';
import { ApiResponse, OrderDTO, OrderStatus } from '../types/dto';

export const deliveryApi = {
    listReady: (params?: { lat: number; lng: number; radius?: number }) =>
        apiClient.get<any, ApiResponse<OrderDTO[]>>('/delivery/available', { params }),

    accept: (orderId: number) =>
        apiClient.post<any, ApiResponse<OrderDTO>>(`/delivery/orders/${orderId}/accept`),

    pickUp: (orderId: number) =>
        apiClient.patch<any, ApiResponse<OrderDTO>>(`/delivery/orders/${orderId}/pickup`),

    deliver: (orderId: number) =>
        apiClient.patch<any, ApiResponse<OrderDTO>>(`/delivery/orders/${orderId}/deliver`),

    getHistory: () =>
        apiClient.get<any, ApiResponse<OrderDTO[]>>('/delivery/history'),
};
