import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_STORAGE_KEY = "@zenvy_cart_v1";

export type MoneyMAD = number;

export type CartItem = {
    id: string; // productId
    storeId: string;
    storeName: string;
    name: string;
    imageUrl: string;
    unitPrice: MoneyMAD;
    qty: number;
};

type CartState = {
    items: CartItem[];
    promoCode?: string;
    promoDiscountMAD: MoneyMAD; // simple fixed/derived discount
    deliveryFeeMAD: MoneyMAD;
    serviceFeeMAD: MoneyMAD;
    isLoaded: boolean;
};

type CartAction =
    | { type: "LOAD_CART"; payload: Omit<CartState, "isLoaded"> }
    | { type: "ADD_ITEM"; payload: Omit<CartItem, "qty"> & { qty: number } }
    | { type: "REMOVE_ITEM"; payload: { id: string } }
    | { type: "INC"; payload: { id: string } }
    | { type: "DEC"; payload: { id: string } }
    | { type: "APPLY_PROMO"; payload: { code: string } }
    | { type: "CLEAR_PROMO" }
    | { type: "CLEAR_CART" };

const initialState: CartState = {
    items: [],
    promoCode: undefined,
    promoDiscountMAD: 0,
    deliveryFeeMAD: 15,
    serviceFeeMAD: 5,
    isLoaded: false,
};

function reducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "LOAD_CART":
            return { ...state, ...action.payload, isLoaded: true };
        case "ADD_ITEM": {
            const incoming = action.payload;
            const existing = state.items.find((x) => x.id === incoming.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((x) =>
                        x.id === incoming.id ? { ...x, qty: x.qty + incoming.qty } : x
                    ),
                };
            }
            return { ...state, items: [...state.items, { ...incoming }] };
        }
        case "REMOVE_ITEM":
            return { ...state, items: state.items.filter((x) => x.id !== action.payload.id) };
        case "INC":
            return {
                ...state,
                items: state.items.map((x) => (x.id === action.payload.id ? { ...x, qty: x.qty + 1 } : x)),
            };
        case "DEC":
            return {
                ...state,
                items: state.items
                    .map((x) => (x.id === action.payload.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
                    .filter((x) => x.qty > 0),
            };
        case "APPLY_PROMO": {
            const code = action.payload.code.trim().toUpperCase();
            // Example rule: ZENVY10 = 10 MAD off (swap with backend validation later)
            const discount = code === "ZENVY10" ? 10 : 0;
            return { ...state, promoCode: code, promoDiscountMAD: discount };
        }
        case "CLEAR_PROMO":
            return { ...state, promoCode: undefined, promoDiscountMAD: 0 };
        case "CLEAR_CART":
            return { ...initialState, isLoaded: true };
        default:
            return state;
    }
}

type CartContextValue = {
    state: CartState;
    addItem: (item: Omit<CartItem, "qty">, qty: number) => void;
    removeItem: (id: string) => void;
    inc: (id: string) => void;
    dec: (id: string) => void;
    applyPromo: (code: string) => void;
    clearPromo: () => void;
    clearCart: () => void; // Exposed for checkout success

    subtotalMAD: MoneyMAD;
    totalMAD: MoneyMAD;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // 1. Hydrate on mount
    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem(CART_STORAGE_KEY);
                if (json) {
                    const loaded = JSON.parse(json);
                    // Merge loaded with defaults to ensure all fields exist
                    dispatch({
                        type: "LOAD_CART",
                        payload: {
                            items: loaded.items || [],
                            promoCode: loaded.promoCode,
                            promoDiscountMAD: loaded.promoDiscountMAD || 0,
                            deliveryFeeMAD: loaded.deliveryFeeMAD || 15,
                            serviceFeeMAD: loaded.serviceFeeMAD || 5,
                        },
                    });
                } else {
                    dispatch({
                        type: "LOAD_CART",
                        payload: {
                            items: [],
                            promoCode: undefined,
                            promoDiscountMAD: 0,
                            deliveryFeeMAD: 15,
                            serviceFeeMAD: 5,
                        },
                    });
                }
            } catch (e) {
                console.error("Failed to load cart", e);
                // Fallback to empty
                dispatch({
                    type: "LOAD_CART",
                    payload: {
                        items: [],
                        promoCode: undefined,
                        promoDiscountMAD: 0,
                        deliveryFeeMAD: 15,
                        serviceFeeMAD: 5,
                    },
                });
            }
        })();
    }, []);

    // 2. Persist on change (only if loaded)
    useEffect(() => {
        if (!state.isLoaded) return;
        const saveState = {
            items: state.items,
            promoCode: state.promoCode,
            promoDiscountMAD: state.promoDiscountMAD,
            deliveryFeeMAD: state.deliveryFeeMAD,
            serviceFeeMAD: state.serviceFeeMAD,
        };
        AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(saveState)).catch((e) =>
            console.error("Failed to save cart", e)
        );
    }, [state]);

    const subtotalMAD = useMemo(() => {
        return state.items.reduce((sum, x) => sum + x.unitPrice * x.qty, 0);
    }, [state.items]);

    const totalMAD = useMemo(() => {
        const base = subtotalMAD + state.deliveryFeeMAD + state.serviceFeeMAD;
        return Math.max(0, base - state.promoDiscountMAD);
    }, [subtotalMAD, state.deliveryFeeMAD, state.serviceFeeMAD, state.promoDiscountMAD]);

    const value: CartContextValue = useMemo(
        () => ({
            state,
            addItem: (item, qty) => dispatch({ type: "ADD_ITEM", payload: { ...item, qty } }),
            removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
            inc: (id) => dispatch({ type: "INC", payload: { id } }),
            dec: (id) => dispatch({ type: "DEC", payload: { id } }),
            applyPromo: (code) => dispatch({ type: "APPLY_PROMO", payload: { code } }),
            clearPromo: () => dispatch({ type: "CLEAR_PROMO" }),
            clearCart: () => dispatch({ type: "CLEAR_CART" }),

            subtotalMAD,
            totalMAD,
        }),
        [state, subtotalMAD, totalMAD]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}

export function formatMAD(value: number) {
    // never allow NaN display
    const safe = Number.isFinite(value) ? value : 0;
    return `${safe.toFixed(0)} MAD`;
}
