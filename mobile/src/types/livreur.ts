export type OrderStatus = 'pending' | 'accepted' | 'arrived_at_store' | 'picked_up' | 'on_the_way' | 'delivered';

export interface LivreurProfile {
    id: string;
    name: string;
    rating: number;
    vehicle: string;
    memberSince: number;
    avatarUrl?: string; // KEEPing for compatibility
}

export interface DailyStats {
    earnings: number;
    completedDeliveries: number;
}

export interface Order {
    id: string;
    restaurant: string;
    restaurantAddress: string;
    customer: string;
    customerAddress: string;
    earnings: number;
    status: OrderStatus;
}

export type Timeframe = 'today' | 'week' | 'month';

export interface EarningsSummary {
    total: number;
    cashCollected: number;
    appPayout: number;
    deliveryCount: number;
}

export interface DeliveryHistoryItem {
    id: string;
    restaurantName: string;
    timestamp: Date;
    earnings: number;
}

export interface LivreurState {
    profile: LivreurProfile | null;
    stats: DailyStats | null;
    isOnline: boolean;
    incomingOrders: Order[];
    activeOrder: Order | null;
    isLoading: boolean;
    // NEW STATE
    selectedTimeframe: Timeframe;
    earningsData: Record<Timeframe, EarningsSummary>;
    deliveryHistory: DeliveryHistoryItem[];
}
