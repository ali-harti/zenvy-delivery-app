import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CartItem = {
    id: string;
    storeId: string;
    title: string;
    price: number;
    quantity: number;
    image?: any;
};

interface CartState {
    items: CartItem[];
    count: number;
    total: number;
    storeId: string | null;

    addItem: (item: CartItem) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [
                { id: '1', storeId: 'burger', title: 'Cheeseburger', price: 12.50, quantity: 2 },
                { id: '2', storeId: 'burger', title: 'Fries', price: 4.50, quantity: 1 },
            ],
            count: 3,
            total: 29.50, // 12.5*2 + 4.5
            storeId: 'burger',

            addItem: (item) => set((state) => {
                // If adding from a different store, reset cart (optional rule, but good for simple apps)
                if (state.storeId && state.storeId !== item.storeId) {
                    // Logic to confirm overwrite could go here, for now we overwrite or just append if we want multi-store support (unlikely for delivery apps)
                    // Let's enforce single store for now
                    const items = [{ ...item }];
                    return {
                        items,
                        count: item.quantity,
                        total: item.price * item.quantity,
                        storeId: item.storeId
                    };
                }

                const existingIndex = state.items.findIndex(i => i.id === item.id);
                let newItems;

                if (existingIndex > -1) {
                    newItems = [...state.items];
                    newItems[existingIndex].quantity += item.quantity;
                } else {
                    newItems = [...state.items, item];
                }

                const newCount = newItems.reduce((acc, curr) => acc + curr.quantity, 0);
                const newTotal = newItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

                return {
                    items: newItems,
                    count: newCount,
                    total: newTotal,
                    storeId: item.storeId
                };
            }),

            updateQuantity: (itemId: string, quantity: number) => set((state) => {
                let newItems = [...state.items];
                if (quantity <= 0) {
                    newItems = newItems.filter(i => i.id !== itemId);
                } else {
                    newItems = newItems.map(i => i.id === itemId ? { ...i, quantity } : i);
                }

                const newCount = newItems.reduce((acc, curr) => acc + curr.quantity, 0);
                const newTotal = newItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

                return {
                    items: newItems,
                    count: newCount,
                    total: newTotal,
                    storeId: newItems.length === 0 ? null : state.storeId
                };
            }),

            removeItem: (itemId) => set((state) => {
                const newItems = state.items.filter(i => i.id !== itemId);
                const newCount = newItems.reduce((acc, curr) => acc + curr.quantity, 0);
                const newTotal = newItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
                return { items: newItems, count: newCount, total: newTotal, storeId: newItems.length === 0 ? null : state.storeId };
            }),

            clearCart: () => set({ items: [], count: 0, total: 0, storeId: null }),
        }),
        {
            name: 'zenvy-cart',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
