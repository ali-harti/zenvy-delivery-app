import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Address = {
    id: string;
    street: string;
    city: string;
    zip: string;
    label: string; // e.g. "Home", "Work"
    isCurrent?: boolean;
    instructions?: string;
};

interface LocationState {
    currentAddress: Address | null;
    savedAddresses: Address[];
    setCurrentAddress: (address: Address) => void;
    addAddress: (address: Address) => void;
    updateAddress: (address: Address) => void;
    removeAddress: (id: string) => void;
}

const MOCK_ADDRESS: Address = {
    id: '1',
    street: '123 Main St',
    city: 'New York',
    zip: '10001',
    label: 'Home',
    isCurrent: true,
    instructions: 'Ring bell',
};

export const useLocationStore = create<LocationState>()(
    persist(
        (set, get) => ({
            currentAddress: MOCK_ADDRESS,
            savedAddresses: [MOCK_ADDRESS],

            setCurrentAddress: (address) => set({ currentAddress: address }),

            addAddress: (address) => set((state) => ({
                savedAddresses: [...state.savedAddresses, address],
                currentAddress: address, // auto-select new
            })),

            updateAddress: (updatedAddress) => set((state) => {
                const newAddresses = state.savedAddresses.map((addr) =>
                    addr.id === updatedAddress.id ? updatedAddress : addr
                );

                // If the updated address was the current one, update it too
                const current = state.currentAddress?.id === updatedAddress.id
                    ? updatedAddress
                    : state.currentAddress;

                return {
                    savedAddresses: newAddresses,
                    currentAddress: current,
                };
            }),

            removeAddress: (id) => set((state) => ({
                savedAddresses: state.savedAddresses.filter((a) => a.id !== id),
                // If removed current, maybe unset current? 
                currentAddress: state.currentAddress?.id === id ? null : state.currentAddress
            })),
        }),
        {
            name: 'zenvy-location',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
