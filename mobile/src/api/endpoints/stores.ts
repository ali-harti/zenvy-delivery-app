import { apiClient } from '../http';
import { ApiResponse, StoreDTO, ProductDTO } from '../types/dto';

export const storesApi = {
    list: (params?: { lat?: number; lng?: number; radius?: number }) =>
        apiClient.get<any, ApiResponse<StoreDTO[]>>('/stores', { params }),

    getById: (id: number) =>
        apiClient.get<any, ApiResponse<StoreDTO>>(`/stores/${id}`),

    getProducts: (storeId: number) =>
        apiClient.get<any, ApiResponse<ProductDTO[]>>(`/stores/${storeId}/products`),
};
