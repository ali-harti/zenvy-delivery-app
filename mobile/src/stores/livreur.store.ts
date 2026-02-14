import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type VehicleType = "bike" | "scooter" | "car";

export type ActiveRequest = {
    id: string;
    shopName: string;
    shopAddress: string;
    customerAddress: string;
    earnings: number;
    distance: number;
};


type LivreurState = {
    // IMPORTANT: shiftReady is session-only (NOT persisted)
    shiftReady: boolean;

    // persisted preferences
    isOnline: boolean;
    vehicleType: VehicleType;
    zoneName: string;

    // driver profile (can come from auth user later)
    // driver profile
    driverName: string;
    rating: number;

    // Active Request (Simulated)
    activeRequest: ActiveRequest | null;

    // actions
    resetShift: () => void;
    completeShiftGate: () => void;

    // Alias for "completeShiftGate + setOnline(true)"
    startShift: () => void;
    // Alias for reset
    resetSession: () => void;

    setOnline: (value: boolean) => void;
    setVehicleType: (v: VehicleType) => void;
    setZoneName: (zone: string) => void;

    setDriverProfile: (name: string, rating: number) => void;
    setActiveRequest: (req: any | null) => void;
};

export const useLivreurStore = create<LivreurState>()(
    persist(
        (set) => ({
            shiftReady: false,

            isOnline: false,
            vehicleType: "scooter",
            zoneName: "Casablanca",

            driverName: "Karim Benali",
            rating: 4.9,
            activeRequest: null,

            resetShift: () => set({ shiftReady: false, isOnline: false, activeRequest: null }),
            completeShiftGate: () => set({ shiftReady: true }),

            startShift: () => set({ shiftReady: true, isOnline: true }),
            resetSession: () => set({ shiftReady: false, isOnline: false }),

            setOnline: (value) => set({ isOnline: value }),
            setVehicleType: (v) => set({ vehicleType: v }),
            setZoneName: (zone) => set({ zoneName: zone }),

            setDriverProfile: (name, rating) => set({ driverName: name, rating }),
            setActiveRequest: (req) => set({ activeRequest: req }),
        }),
        {
            name: "zenvy_livreur_prefs",
            storage: createJSONStorage(() => AsyncStorage),
            // persist ONLY these fields
            partialize: (state) => ({
                isOnline: state.isOnline,
                vehicleType: state.vehicleType,
                zoneName: state.zoneName,
                driverName: state.driverName,
                rating: state.rating,
            }),
        }
    )
);
