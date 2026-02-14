import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Order } from "../../types/order";

type OrdersState = {
    orders: Order[];
    addOrder: (order: Order) => void;
    clearOrders: () => void;
    updateOrderStatus: (id: string, status: Order["status"]) => void;

    hasHydrated: boolean;
    setHasHydrated: (v: boolean) => void;
};

// Helper to get past dates
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

export const useOrdersStore = create<OrdersState>()(
    persist(
        (set, get) => ({
            orders: [
                // --- ACTIVE ORDERS ---
                {
                    id: 'active-1',
                    storeId: 's1',
                    storeName: 'Burger Joint',
                    createdAtISO: new Date().toISOString(),
                    status: 'ON_THE_WAY',
                    items: [
                        { productId: 'p1', name: 'Double Cheeseburger', qty: 1, unitPrice: 55 },
                        { productId: 'p2', name: 'Coke Zero', qty: 1, unitPrice: 15 }
                    ],
                    money: { subtotal: 70, deliveryFee: 15, serviceFee: 5, total: 90 },
                    driver: { id: 'd1', name: 'Karim Benali', rating: 4.9, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
                },
                {
                    id: 'active-2',
                    storeId: 's2',
                    storeName: 'Sushi House',
                    createdAtISO: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    status: 'PREPARING',
                    items: [
                        { productId: 's1', name: 'Salmon Roll', qty: 2, unitPrice: 40 },
                        { productId: 's2', name: 'Miso Soup', qty: 1, unitPrice: 25 }
                    ],
                    money: { subtotal: 105, deliveryFee: 20, serviceFee: 5, total: 130 },
                },

                // --- PAST DELIVERED ORDERS (Last 5) ---
                {
                    id: 'past-1',
                    storeId: 's3',
                    storeName: 'Pizza Hut',
                    createdAtISO: daysAgo(1),
                    status: 'DELIVERED',
                    items: [{ productId: 'pz1', name: 'Pepperoni Pizza', qty: 1, unitPrice: 80 }],
                    money: { subtotal: 80, deliveryFee: 15, serviceFee: 5, total: 100 },
                    driver: { id: 'd2', name: 'Omar K.', rating: 4.7 }
                },
                {
                    id: 'past-2',
                    storeId: 's4',
                    storeName: 'KFC Maarif',
                    createdAtISO: daysAgo(2),
                    status: 'DELIVERED',
                    items: [{ productId: 'k1', name: 'Bucket 12pc', qty: 1, unitPrice: 150 }],
                    money: { subtotal: 150, deliveryFee: 10, serviceFee: 5, total: 165 },
                    driver: { id: 'd3', name: 'Youssef B.', rating: 4.8 }
                },
                {
                    id: 'past-3',
                    storeId: 's1',
                    storeName: 'Burger Joint',
                    createdAtISO: daysAgo(5),
                    status: 'DELIVERED',
                    items: [{ productId: 'b1', name: 'Classic Burger', qty: 2, unitPrice: 40 }],
                    money: { subtotal: 80, deliveryFee: 15, serviceFee: 5, total: 100 },
                    driver: { id: 'd1', name: 'Karim Benali', rating: 4.9 }
                },
                {
                    id: 'past-4',
                    storeId: 's5',
                    storeName: 'Tacos de Lyon',
                    createdAtISO: daysAgo(7),
                    status: 'DELIVERED',
                    items: [{ productId: 't1', name: 'Tacos Viande Hachée', qty: 1, unitPrice: 35 }],
                    money: { subtotal: 35, deliveryFee: 10, serviceFee: 2, total: 47 },
                    driver: { id: 'd4', name: 'Ahmed S.', rating: 4.6 }
                },
                {
                    id: 'past-5',
                    storeId: 's2',
                    storeName: 'Sushi House',
                    createdAtISO: daysAgo(10),
                    status: 'DELIVERED',
                    items: [{ productId: 's3', name: 'California Roll', qty: 3, unitPrice: 35 }],
                    money: { subtotal: 105, deliveryFee: 20, serviceFee: 5, total: 130 },
                    driver: { id: 'd2', name: 'Omar K.', rating: 4.7 }
                }
            ],
            addOrder: (order) => set({ orders: [order, ...get().orders] }),
            clearOrders: () => set({ orders: [] }),
            updateOrderStatus: (id, status) =>
                set((state) => ({
                    orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
                })),

            hasHydrated: false,
            setHasHydrated: (v) => set({ hasHydrated: v }),
        }),
        {
            name: "zenvy_orders_store_v3", // Bump version to force refresh
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
