// Role Definitions
export enum UserRole {
    CUSTOMER = 'customer',
    MERCHANT = 'merchant',
    COURIER = 'courier',
    ADMIN = 'admin',
}

// Order Status Enum (Strictly matching backend)
export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    READY = 'ready',
    DRIVER_ASSIGNED = 'driver_assigned',
    IN_DELIVERY = 'in_delivery',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

// Common API Response Wrapper
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors?: string | object | any[];
}

// --- Domain Models ---

export interface UserDTO {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    isActive: boolean;
    createdAt: string;
}

export interface StoreDTO {
    id: number;
    name: string;
    ownerId: number;
    address: string;
    phone?: string;
    isActive: boolean; // Mapped from is_active in backend
    isOpen: boolean;
    createdAt: string;
}

export interface ProductDTO {
    id: number;
    storeId: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    isAvailable: boolean;
    imageUrl?: string;
    category?: string;
}

export interface CartItemDTO {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    price: number; // Snapshot price
    product?: ProductDTO;
}

export interface CartDTO {
    id: number;
    userId: number;
    items: CartItemDTO[];
    totalPrice: number;
    updatedAt: string;
}

export interface OrderItemDTO {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product?: ProductDTO;
}

export interface OrderDTO {
    id: number;
    userId: number;
    storeId: number;
    deliveryPersonId?: number;
    totalPrice: number;
    deliveryFee: number;
    status: OrderStatus;
    deliveryAddress: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    deliveredAt?: string;
    items: OrderItemDTO[];
    store?: StoreDTO;
    deliveryPerson?: UserDTO;
    customer?: UserDTO;
}

// --- Auth Payloads ---

export interface LoginResponse {
    token: string;
    user: UserDTO;
}

export interface RegisterResponse {
    token: string;
    user: UserDTO;
}
