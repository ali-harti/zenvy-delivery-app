export interface ApiError {
    message: string;
    code?: string;
    status: number;
    errors?: Record<string, string[]>;
}

export class AppError extends Error {
    public code?: string;
    public status: number;
    public errors?: Record<string, string[]>;

    constructor(data: ApiError) {
        super(data.message);
        this.name = 'AppError';
        this.code = data.code;
        this.status = data.status;
        this.errors = data.errors;
    }
}
