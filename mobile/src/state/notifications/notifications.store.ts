import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type NotificationType = "ORDER" | "PROMO" | "RATING" | "SYSTEM";

export type AppNotification = {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timeLabel: string; // "10:30 AM" or "Yesterday" or "Feb 8"
    createdAtISO: string;
    isRead?: boolean;
    meta?: {
        orderId?: string;
        storeId?: string;
    };
};

type NotificationsState = {
    notifications: AppNotification[];
    addNotification: (n: AppNotification) => void;
    markAllRead: () => void;
    clearAll: () => void;
};

export const useNotificationsStore = create<NotificationsState>()(
    persist(
        (set, get) => ({
            notifications: [
                {
                    id: "welcome_1",
                    type: "PROMO",
                    title: "Welcome to Zenvy! 🚀",
                    message: "We're glad to have you. Use code ZENVYSTART for free delivery on your first order.",
                    timeLabel: "Just now",
                    createdAtISO: new Date().toISOString(),
                },
                {
                    id: "welcome_2",
                    type: "SYSTEM",
                    title: "Account Verified",
                    message: "Your profile is all set. You can now browse stores and place orders.",
                    timeLabel: "Just now",
                    createdAtISO: new Date().toISOString(),
                },
            ],

            addNotification: (n) =>
                set((s) => ({
                    notifications: [n, ...s.notifications],
                })),

            markAllRead: () =>
                set((s) => ({
                    notifications: s.notifications.map((x) => ({ ...x, isRead: true })),
                })),

            clearAll: () => set({ notifications: [] }),
        }),
        {
            name: "zenvy_notifications_v2",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
