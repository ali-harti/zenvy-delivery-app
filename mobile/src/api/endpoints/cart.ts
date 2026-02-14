import { apiClient } from '../http';
import { ApiResponse, CartDTO } from '../types/dto';

export const cartApi = {
    get: () =>
        apiClient.get<any, ApiResponse<CartDTO>>('/cart'),

    addItem: (data: { productId: number; quantity: number }) =>
        apiClient.post<any, ApiResponse<CartDTO>>('/cart/items', data),

    removeItem: (itemId: number) =>
        apiClient.delete<any, ApiResponse<CartDTO>>(`/cart/items/${itemId}`),

    clear: () =>
        apiClient.post<any, ApiResponse<void>>('/cart/clear'),
};
