import { apiClient } from '../http';
import { ApiResponse } from '../types/response';

export const permissionsApi = {
    updatePermissions: (data: { location?: boolean; notification?: boolean }) =>
        apiClient.post<never, ApiResponse<void>>('/permissions/update', data),
};
