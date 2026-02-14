export enum AppErrorCode {
    INVALID_INPUT = 'INVALID_INPUT',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    INVALID_TRANSITION = 'INVALID_TRANSITION',
    INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
    SERVER_ERROR = 'SERVER_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface NormalizedError {
    code: AppErrorCode;
    message: string;
    originalError?: any;
    validationErrors?: Record<string, string[]>;
}

export function normalizeError(status: number, data?: any): NormalizedError {
    let code = AppErrorCode.UNKNOWN_ERROR;
    const backendCode = data?.code; // e.g. "INVALID_TRANSITION" from backend

    switch (status) {
        case 400:
            code = AppErrorCode.INVALID_INPUT;
            break;
        case 401:
            code = AppErrorCode.UNAUTHORIZED;
            break;
        case 403:
            code = AppErrorCode.FORBIDDEN;
            break;
        case 404:
            code = AppErrorCode.NOT_FOUND;
            break;
        case 409:
            // Pass through strict backend codes if they match known logic
            if (backendCode === 'INVALID_TRANSITION') code = AppErrorCode.INVALID_TRANSITION;
            else if (backendCode === 'INSUFFICIENT_STOCK') code = AppErrorCode.INSUFFICIENT_STOCK;
            else code = AppErrorCode.INVALID_INPUT; // Default conflict fallback
            break;
        case 500:
        case 502:
        case 503:
            code = AppErrorCode.SERVER_ERROR;
            break;
        case 0:
            code = AppErrorCode.NETWORK_ERROR;
            break;
    }

    return {
        code,
        message: data?.message || 'Something went wrong',
        validationErrors: data?.errors,
        originalError: data
    };
}
