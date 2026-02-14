import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '@auth/store/auth.store';
import { UserRole } from '@api/types/dto';
import { View, ActivityIndicator, Button } from 'react-native';

// Auth Navigator
import { AuthNavigator } from './AuthNavigator';

// Feature Navigators
import CustomerNavigator from './CustomerNavigator';
import MerchantNavigator from './MerchantNavigator';
import CourierNavigator from './CourierNavigator';
import CustomerOnboardingNavigator from '../customer/onboarding/CustomerOnboardingNavigator';
import { AddressSelectorScreen } from '../customer/screens/AddressSelectorScreen';
import AddAddressScreen from '../customer/screens/AddAddressScreen';

import { LivreurTabs } from './LivreurTabs';
import LivreurShiftNavigator from './LivreurShiftNavigator';
import { useLivreurStore } from '../stores/livreur.store';
import { CourierRootWrapper } from './CourierRootWrapper';

const Stack = createStackNavigator();

export default function RootNavigator() {
    // Fix 2: Add isHydrated
    const isHydrated = useAuthStore((s: any) => s.isHydrated);
    const isAuthenticated = useAuthStore((s: any) => s.isAuthenticated);
    const user = useAuthStore((s: any) => s.user);
    const needsCustomerOnboarding = useAuthStore((s: any) => s.needsCustomerOnboarding);
    const checkAuth = useAuthStore((s: any) => s.checkAuth);

    // Livreur State
    const { shiftReady, resetShift } = useLivreurStore();

    console.log("[RootNavigator] State:", { isHydrated, isAuthenticated, role: user?.role, needsOnboarding: needsCustomerOnboarding });

    useEffect(() => {
        checkAuth();
    }, []);

    // FORCE: onboarding every session/login for livreur
    useEffect(() => {
        if (isAuthenticated && user?.role === UserRole.COURIER) {
            resetShift(); // <-- critical
        }
    }, [isAuthenticated, user?.role, resetShift]);

    // Important: don't render anything until persisted auth is loaded
    if (!isHydrated) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isAuthenticated) return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthNavigator} />
        </Stack.Navigator>
    );

    const role = user?.role;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* App Stack based on Role */}
            <Stack.Group>
                {/* <Stack.Screen name="Placeholder" component={PlaceholderScreen} /> */}
                {role === UserRole.CUSTOMER && (
                    <>
                        {needsCustomerOnboarding ? (
                            <Stack.Screen name="CustomerOnboardingRoot" component={CustomerOnboardingNavigator} />
                        ) : (
                            <Stack.Screen name="CustomerRoot" component={CustomerNavigator} />
                        )}
                        <Stack.Screen name="Addresses" component={AddressSelectorScreen} />
                        <Stack.Screen name="AddAddress" component={AddAddressScreen} />
                    </>
                )}
                {role === UserRole.MERCHANT && (
                    <Stack.Screen name="MerchantRoot" component={MerchantNavigator} />
                )}
                {role === UserRole.COURIER && (
                    <Stack.Screen name="CourierRoot" component={CourierRootWrapper} />
                )}
            </Stack.Group>
        </Stack.Navigator>
    );
}

function PlaceholderScreen() {
    const logout = useAuthStore((s) => s.logout);
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <ActivityIndicator size="large" color="#12B981" />
            <Button title="Logout (Dev)" onPress={logout} color="#FF5252" />
        </View>
    );
}
