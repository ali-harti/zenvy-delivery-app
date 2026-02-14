module.exports = {
    USER_ROLES: {
        CUSTOMER: 'customer',
        COURIER: 'courier',
        ADMIN: 'admin'
    },

    ORDER_STATUS: {
        PLACED: 'placed',
        CONFIRMED: 'confirmed',
        PREPARING: 'preparing',
        OUT_FOR_DELIVERY: 'out_for_delivery',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled'
    },

    PAYMENT_METHODS: {
        CASH: 'cash',
        CARD: 'card'
    },

    JWT_EXPIRY: '7d',

    DEFAULT_DELIVERY_FEE: 2.99,
    DEFAULT_COURIER_EARNINGS: 8.50
};
