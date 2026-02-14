import React from 'react';
import { Text, View } from 'react-native';
import { useDeliveryStore } from '../stores/delivery.store';
import { useLivreurStore } from '../stores/livreur.store';
import LivreurShiftNavigator from './LivreurShiftNavigator';
import { LivreurStack } from './LivreurStack';

export function CourierRootWrapper() {
    // ✅ Livreur Gating Logic
    // 1. Check for Active Delivery (Highest Priority - Persistence)
    const activeDelivery = useDeliveryStore((s) => s.activeDelivery);

    // 2. Check for Shift Start (Session Based)
    const shiftReady = useLivreurStore((s) => s.shiftReady);

    if (activeDelivery) {
        // TODO: Replace with proper ActiveDeliveryStack logic if needed, 
        // but now LivreurStack handles active delivery internally via Context.
        // We might want to unify this entry point. 
        // For now, let's trust LivreurStack.
        return <LivreurStack />;
    }

    if (!shiftReady) {
        return <LivreurShiftNavigator />;
    }

    // 3. Default: Home Stack (Tabs + Active Delivery)
    return <LivreurStack />;
}
