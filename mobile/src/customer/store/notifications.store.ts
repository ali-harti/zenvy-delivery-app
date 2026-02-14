import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Notification = {
    id: string;
    title: string;
    body: string;
    read: boolean;
    createdAt: string;
};

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (n: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [
                { id: '1', title: 'Welcome to Zenvy!', body: 'Start ordering now.', read: false, createdAt: new Date().toISOString() },
                { id: '2', title: '50% Off Promo', body: 'Use code WELCOME50', read: false, createdAt: new Date().toISOString() },
                { id: '3', title: 'Order Delivered', body: 'Your scooter arrived!', read: false, createdAt: new Date().toISOString() },
            ],
            unreadCount: 3,

            addNotification: (n) => set((state) => ({
                notifications: [n, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            })),

            markAsRead: (id) => set((state) => {
                const newNotifs = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
                return {
                    notifications: newNotifs,
                    unreadCount: newNotifs.filter(n => !n.read).length,
                };
            }),

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0,
            })),

            clearAll: () => set({ notifications: [], unreadCount: 0 }),
        }),
        {
            name: 'zenvy-notifications',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
