import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LivreurState, Order, OrderStatus, Timeframe } from '../types/livreur';
import { useAuthStore } from '../auth/store/auth.store';

// Helper to generate dates relative to today
const getPastDate = (daysAgo: number, hours: number = 12) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hours, 0, 0, 0);
    return date;
};

// Initial state with real data for Karim Benali
const initialState: LivreurState = {
    profile: {
        id: 'lb-001',
        name: 'Karim Benali',
        rating: 4.9,
        vehicle: 'Motorbike',
        memberSince: 2023,
    },
    // Home screen quick stats (matches 'today' earnings below)
    stats: {
        earnings: 450,
        completedDeliveries: 12,
    },
    isOnline: false,
    incomingOrders: [
        {
            id: 'ord-101',
            restaurant: 'Burger Joint Casa',
            restaurantAddress: '206 N Caga Tarnaira, Casablanca',
            customer: 'Karim B.',
            customerAddress: 'Ca Ad Fuigna, Casablanca',
            earnings: 85,
            status: 'pending',
        },
        {
            id: 'ord-102',
            restaurant: 'Pizza Hut Gauthier',
            restaurantAddress: 'Bd Moulay Youssef, Casablanca',
            customer: 'Sara L.',
            customerAddress: 'Rue Jean Jaurès, Casablanca',
            earnings: 65,
            status: 'pending',
        },
        {
            id: 'ord-103',
            restaurant: 'Sushi Ko',
            restaurantAddress: 'Maarif, Casablanca',
            customer: 'Omar K.',
            customerAddress: 'Twin Center, Casablanca',
            earnings: 120,
            status: 'pending',
        },
        {
            id: 'ord-104',
            restaurant: 'Tacos de Lyon',
            restaurantAddress: 'Ain Diab, Casablanca',
            customer: 'Yasmine B.',
            customerAddress: 'Anfa Supérieur, Casablanca',
            earnings: 55,
            status: 'pending',
        },
    ],
    activeOrder: null,
    isLoading: false,

    // --- NEW EARNINGS DATA ---
    selectedTimeframe: 'today',
    earningsData: {
        today: { total: 450, cashCollected: 150, appPayout: 300, deliveryCount: 12 },
        week: { total: 2850, cashCollected: 850, appPayout: 2000, deliveryCount: 78 },
        month: { total: 11200, cashCollected: 3200, appPayout: 8000, deliveryCount: 310 },
    },
    deliveryHistory: [
        // Today's deliveries
        { id: 'hist-1', restaurantName: 'Burger Joint Casa', timestamp: getPastDate(0, 14), earnings: 45 },
        { id: 'hist-2', restaurantName: 'Sushi House', timestamp: getPastDate(0, 13), earnings: 60 },
        { id: 'hist-3', restaurantName: 'Tacos de Lyon', timestamp: getPastDate(0, 12), earnings: 35 },
        // Yesterday
        { id: 'hist-4', restaurantName: 'Pizza Hut', timestamp: getPastDate(1, 19), earnings: 55 },
        { id: 'hist-5', restaurantName: 'KFC Maarif', timestamp: getPastDate(1, 18), earnings: 40 },
        // Older
        { id: 'hist-6', restaurantName: 'Wok to Walk', timestamp: getPastDate(3, 13), earnings: 50 },
        { id: 'hist-7', restaurantName: 'McDonalds', timestamp: getPastDate(5, 20), earnings: 30 },
        { id: 'hist-8', restaurantName: 'Burger Joint Casa', timestamp: getPastDate(6, 14), earnings: 45 },
        { id: 'hist-9', restaurantName: 'Sushi House', timestamp: getPastDate(7, 13), earnings: 60 },
        { id: 'hist-10', restaurantName: 'Tacos de Lyon', timestamp: getPastDate(8, 12), earnings: 35 },
    ],
};

interface LivreurContextType extends LivreurState {
    toggleOnline: () => void;
    acceptOrder: (orderId: string) => void;
    rejectOrder: (orderId: string) => void;
    updateOrderStatus: (status: OrderStatus) => void;
    updateProfile: (name: string, vehicle: string) => void;
    logout: () => void;
    setTimeframe: (timeframe: Timeframe) => void;
}

const LivreurContext = createContext<LivreurContextType | undefined>(undefined);

export const LivreurProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<LivreurState>(() => ({
        ...initialState,
        isLoading: true, // Start loading
    }));

    // Load state from storage on mount
    useEffect(() => {
        const loadState = async () => {
            try {
                const storedState = await AsyncStorage.getItem('@zenvy_livreur_state');
                if (storedState) {
                    const parsedState = JSON.parse(storedState);
                    // Merge stored state with initial state to ensure new properties (earningsData) exist
                    // if they weren't in the stored version
                    setState(prev => ({
                        ...initialState,
                        ...parsedState,
                        isLoading: false
                    }));
                } else {
                    // If no stored state, set isLoading to false
                    setState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error('Failed to load livreur state', error);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };
        loadState();
    }, []);

    // Save state to storage whenever it changes (debounced slightly or direct)
    useEffect(() => {
        if (state.isLoading) return; // Don't save while loading

        const saveState = async () => {
            try {
                await AsyncStorage.setItem('@zenvy_livreur_state', JSON.stringify(state));
            } catch (error) {
                console.error('Failed to save livreur state', error);
            }
        };
        saveState();
    }, [state]);

    const toggleOnline = useCallback(() => {
        setState(prev => ({ ...prev, isOnline: !prev.isOnline }));
    }, []);

    const acceptOrder = useCallback((orderId: string) => {
        setState(prev => {
            const orderToAccept = prev.incomingOrders.find(o => o.id === orderId);
            if (!orderToAccept) return prev;

            return {
                ...prev,
                incomingOrders: prev.incomingOrders.filter(o => o.id !== orderId),
                activeOrder: { ...orderToAccept, status: 'accepted' },
            };
        });
    }, []);

    const rejectOrder = useCallback((orderId: string) => {
        setState(prev => ({
            ...prev,
            incomingOrders: prev.incomingOrders.filter(o => o.id !== orderId),
        }));
    }, []);

    const updateOrderStatus = useCallback((status: OrderStatus) => {
        setState(prev => {
            if (!prev.activeOrder) return prev;

            if (status === 'delivered') {
                const earnings = Number(prev.stats?.earnings || 0) + Number(prev.activeOrder.earnings);
                const deliveries = Number(prev.stats?.completedDeliveries || 0) + 1;

                // Order complete: update stats and clear active order
                return {
                    ...prev,
                    stats: {
                        ...prev.stats!,
                        earnings,
                        completedDeliveries: deliveries,
                    },
                    activeOrder: null,
                };
            }

            // Update status of the active order
            return {
                ...prev,
                activeOrder: { ...prev.activeOrder, status },
            };
        });
    }, []);

    const updateProfile = useCallback((name: string, vehicle: string) => {
        setState(prev => {
            if (!prev.profile) return prev;
            return {
                ...prev,
                profile: { ...prev.profile, name, vehicle },
            };
        });
    }, []);

    const logout = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('@zenvy_livreur_state');
            setState(initialState);
            // Trigger global logout
            useAuthStore.getState().logout();
        } catch (error) {
            console.error('Logout failed', error);
        }
    }, []);

    const setTimeframe = useCallback((timeframe: Timeframe) => {
        setState(prev => ({ ...prev, selectedTimeframe: timeframe }));
    }, []);

    return (
        <LivreurContext.Provider
            value={{ ...state, toggleOnline, acceptOrder, rejectOrder, updateOrderStatus, updateProfile, logout, setTimeframe }}
        >
            {children}
        </LivreurContext.Provider>
    );
};

export const useLivreur = () => {
    const context = useContext(LivreurContext);
    if (context === undefined) {
        throw new Error('useLivreur must be used within a LivreurProvider');
    }
    return context;
};
