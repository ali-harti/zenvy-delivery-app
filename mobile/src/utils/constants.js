export const API_URL = __DEV__
    ? 'http://localhost:5012/api/v1'  // Development (your production-ready backend)
    : 'https://your-domain.com/api/v1'; // Production

export const SOCKET_URL = __DEV__
    ? 'http://localhost:5012'
    : 'https://your-domain.com';

export const ROLES = {
    CUSTOMER: 'customer',
    MERCHANT: 'merchant',
    COURIER: 'courier',
    ADMIN: 'admin'
};

export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    DRIVER_ASSIGNED: 'driver_assigned',
    IN_DELIVERY: 'in_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};// App Constants

export const COLORS = {
    // Primary colors from Stitch theme
    primary: '#1db97d', // Stitch green
    secondary: '#4ECDC4', // Teal
    accent: '#FFE66D', // Yellow

    // Status colors
    success: '#51CF66',
    warning: '#FFA94D',
    error: '#FF6B6B',
    info: '#4ECDC4',

    // Neutral colors
    background: '#FFFFFF',
    backgroundGray: '#F8F9FA',
    surface: '#FFFFFF',

    // Text colors
    text: '#212529',
    textLight: '#6C757D',
    textDisabled: '#ADB5BD',

    // UI colors
    border: '#E9ECEF',
    white: '#FFFFFF',
    black: '#000000'
};
