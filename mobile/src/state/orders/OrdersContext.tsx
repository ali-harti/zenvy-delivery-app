import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { CartItem, MoneyMAD } from "../cart/CartContext";

const ORDERS_STORAGE_KEY = "@zenvy_orders_v1";

export type OrderStatus = "On the Way" | "Delivered" | "Cancelled";

export type Order = {
    id: string; // uuid
    createdAt: string; // ISO string
    storeName: string;
    status: OrderStatus;
    items: CartItem[];
    subtotalMAD: MoneyMAD;
    deliveryFeeMAD: MoneyMAD;
    serviceFeeMAD: MoneyMAD;
    totalMAD: MoneyMAD;
};

type OrdersState = {
    orders: Order[];
    isLoading: boolean;
};

type OrdersAction =
    | { type: "LOAD_ORDERS"; payload: Order[] }
    | { type: "ADD_ORDER"; payload: Order }
    | { type: "UPDATE_STATUS"; payload: { id: string; status: OrderStatus } };

const initialState: OrdersState = {
    orders: [],
    isLoading: true,
};

function reducer(state: OrdersState, action: OrdersAction): OrdersState {
    switch (action.type) {
        case "LOAD_ORDERS":
            return { ...state, orders: action.payload, isLoading: false };
        case "ADD_ORDER":
            return { ...state, orders: [action.payload, ...state.orders] };
        case "UPDATE_STATUS":
            return {
                ...state,
                orders: state.orders.map((o) =>
                    o.id === action.payload.id ? { ...o, status: action.payload.status } : o
                ),
            };
        default:
            return state;
    }
}

type OrdersContextValue = {
    orders: Order[];
    isLoading: boolean;
    addOrder: (order: Order) => Promise<void>;
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Hydrate on mount
    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
                if (json) {
                    const loaded = JSON.parse(json);
                    dispatch({ type: "LOAD_ORDERS", payload: loaded });
                } else {
                    dispatch({ type: "LOAD_ORDERS", payload: [] });
                }
            } catch (e) {
                console.error("Failed to load orders", e);
                dispatch({ type: "LOAD_ORDERS", payload: [] });
            }
        })();
    }, []);

    // Persistence helper
    const saveOrders = async (orders: Order[]) => {
        try {
            await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        } catch (e) {
            console.error("Failed to save orders", e);
        }
    };

    const addOrder = async (order: Order) => {
        const newOrders = [order, ...state.orders];
        dispatch({ type: "ADD_ORDER", payload: order });
        await saveOrders(newOrders);
    };

    const updateOrderStatus = async (id: string, status: OrderStatus) => {
        const newOrders = state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
        );
        dispatch({ type: "UPDATE_STATUS", payload: { id, status } });
        await saveOrders(newOrders);
    };

    const value = useMemo(
        () => ({
            orders: state.orders,
            isLoading: state.isLoading,
            addOrder,
            updateOrderStatus,
        }),
        [state.orders, state.isLoading]
    );

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
    const ctx = useContext(OrdersContext);
    if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
    return ctx;
}
