import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AddressLabel = "Home" | "Work" | "Other";

export type Address = {
    id: string;
    label: AddressLabel;
    title: string; // e.g. "Home"
    subtitle: string; // e.g. "123 Rue Zerktouni, Casablanca"
    instructions?: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
};

type AddressState = {
    addresses: Address[];
    selectedAddressId?: string;

    addAddress: (address: Address) => void;
    removeAddress: (id: string) => void;
    updateAddress: (address: Address) => void;
    selectAddress: (id: string) => void;
    setDefaultAddress: (id: string) => void;

    seedIfEmpty: () => void; // optional (handy for dev)
};

export const useAddressStore = create<AddressState>()(
    persist(
        (set, get) => ({
            addresses: [],
            selectedAddressId: undefined,

            addAddress: (address) =>
                set((state) => {
                    const next = [...state.addresses, address];

                    // if it's the first address, auto-select + default it
                    const isFirst = next.length === 1;
                    const selectedAddressId = isFirst ? address.id : state.selectedAddressId;

                    const withDefault = isFirst
                        ? next.map((a) => ({ ...a, isDefault: a.id === address.id }))
                        : next;

                    return { addresses: withDefault, selectedAddressId };
                }),

            removeAddress: (id) =>
                set((state) => {
                    const next = state.addresses.filter((a) => a.id !== id);

                    // if removed selected, select default or first
                    let selected = state.selectedAddressId;
                    if (selected === id) {
                        const def = next.find((a) => a.isDefault);
                        selected = def?.id ?? next[0]?.id;
                    }

                    return { addresses: next, selectedAddressId: selected };
                }),

            selectAddress: (id) => set({ selectedAddressId: id }),

            updateAddress: (updated) =>
                set((state) => ({
                    addresses: state.addresses.map((a) => (a.id === updated.id ? updated : a)),
                })),

            setDefaultAddress: (id) =>
                set((state) => ({
                    addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
                    selectedAddressId: id,
                })),

            seedIfEmpty: () => {
                const { addresses } = get();
                if (addresses.length > 0) return;

                const home: Address = {
                    id: "addr_home",
                    label: "Home",
                    title: "Home",
                    subtitle: "123 Rue Zerktouni, Casablanca",
                    instructions: "Ring the bell, leave at door.",
                    latitude: 33.5731,
                    longitude: -7.5898,
                    isDefault: true,
                };

                const work: Address = {
                    id: "addr_work",
                    label: "Work",
                    title: "Work",
                    subtitle: "45 Avenue Mohammed V, Rabat",
                    latitude: 34.0209,
                    longitude: -6.8416,
                    isDefault: false,
                };

                set({ addresses: [home, work], selectedAddressId: home.id });
            },
        }),
        {
            name: "zenvy-addresses",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
