export type OrderStatus = "ORDER_PLACED" | "ACCEPTED" | "PREPARING" | "PICKED_UP" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";

export type OrderItemSnapshot = {
    productId: string;
    name: string;
    image?: string; // uri
    qty: number;
    unitPrice: number; // in MAD
};

export type MoneyBreakdown = {
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
};

export type Order = {
    id: string;
    storeId: string;
    storeName: string;
    createdAtISO: string; // ISO date
    status: OrderStatus;

    items: OrderItemSnapshot[];
    money: MoneyBreakdown;

    // Optional real-time fields
    driver?: {
        id: string;
        name: string;
        avatar?: string;
        rating?: number;
        phone?: string;
        location?: {
            latitude: number;
            longitude: number;
        };
    };
};
