import { apiClient } from '../http';
import { ApiResponse, OrderDTO, OrderStatus, UserRole } from '../types/dto';

export const ordersApi = {
    create: (data: { storeId: number; items: any[]; deliveryAddress: string }) =>
        apiClient.post<any, ApiResponse<OrderDTO>>('/orders', data),

    list: (role: UserRole) =>
        apiClient.get<any, ApiResponse<OrderDTO[]>>('/orders', { params: { role } }),

    getById: (id: number) =>
        apiClient.get<any, ApiResponse<OrderDTO>>(`/orders/${id}`),

    updateStatus: (id: number, status: OrderStatus) =>
        apiClient.patch<any, ApiResponse<OrderDTO>>(`/orders/${id}/status`, { status }),
};
