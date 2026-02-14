import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ActiveDeliveryDTO, DeliveryRequestDTO, ActiveDeliveryStatus } from "../types/livreur";

type DeliveryState = {
    incomingRequests: DeliveryRequestDTO[];
    activeDelivery: ActiveDeliveryDTO | null;

    // actions
    setIncomingRequests: (list: DeliveryRequestDTO[]) => void;
    addRequest: (req: DeliveryRequestDTO) => void;
    removeRequest: (id: string) => void;

    setActiveDelivery: (delivery: ActiveDeliveryDTO) => void;
    clearActiveDelivery: () => void;

    updateActiveStatus: (status: ActiveDeliveryStatus) => void;
    updateStepIndex: (stepIndex: number) => void;
};

export const useDeliveryStore = create<DeliveryState>()(
    persist(
        (set, get) => ({
            incomingRequests: [],
            activeDelivery: null,

            setIncomingRequests: (list) => set({ incomingRequests: list }),

            addRequest: (req) => {
                const existing = get().incomingRequests.some((r) => r.id === req.id);
                if (existing) return;
                set({ incomingRequests: [req, ...get().incomingRequests] });
            },

            removeRequest: (id) =>
                set({ incomingRequests: get().incomingRequests.filter((r) => r.id !== id) }),

            setActiveDelivery: (delivery) => set({ activeDelivery: delivery }),
            clearActiveDelivery: () => set({ activeDelivery: null }),

            updateActiveStatus: (status) => {
                const current = get().activeDelivery;
                if (!current) return;
                set({ activeDelivery: { ...current, status } });
            },

            updateStepIndex: (stepIndex) => {
                const current = get().activeDelivery;
                if (!current) return;
                set({ activeDelivery: { ...current, stepIndex } });
            },
        }),
        {
            name: "zenvy_delivery_store",
            storage: createJSONStorage(() => AsyncStorage),

            // ✅ Persist only what must survive restart
            partialize: (state) => ({
                activeDelivery: state.activeDelivery,
            }),
        }
    )
);
