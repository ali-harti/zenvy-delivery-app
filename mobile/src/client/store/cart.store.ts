import { create } from "zustand";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    qty: number;
    image?: string;
    storeId: string;
};

type CartState = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "qty">) => void;
    removeItem: (id: string) => void;
    clear: () => void;
    totalQty: number;
    totalPrice: number;
};

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (item) =>
        set((state) => {
            const existing = state.items.find((x) => x.id === item.id);
            const items = existing
                ? state.items.map((x) =>
                    x.id === item.id ? { ...x, qty: x.qty + 1 } : x
                )
                : [...state.items, { ...item, qty: 1 }];

            const totalQty = items.reduce((a, x) => a + x.qty, 0);
            const totalPrice = items.reduce((a, x) => a + x.qty * x.price, 0);

            return { items, totalQty, totalPrice };
        }),
    removeItem: (id) =>
        set((state) => {
            const items = state.items
                .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
                .filter((x) => x.qty > 0);

            const totalQty = items.reduce((a, x) => a + x.qty, 0);
            const totalPrice = items.reduce((a, x) => a + x.qty * x.price, 0);

            return { items, totalQty, totalPrice };
        }),
    clear: () => set({ items: [], totalQty: 0, totalPrice: 0 }),
    totalQty: 0,
    totalPrice: 0,
}));
