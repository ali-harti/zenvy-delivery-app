import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartShiftScreen from '../screens/onboarding/StartShiftScreen';
import PermissionsScreen from '../screens/onboarding/PermissionsScreen';
import GoOnlineScreen from '../screens/onboarding/GoOnlineScreen';
import ConfirmZoneScreen from '../screens/onboarding/ConfirmZoneScreen';

export type OnboardingStackParamList = {
    StartShift: undefined;
    Permissions: undefined;
    GoOnline: undefined;
    ConfirmZone: { isOnline: boolean; vehicle: string };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="StartShift" component={StartShiftScreen} />
            <Stack.Screen name="Permissions" component={PermissionsScreen} />
            <Stack.Screen name="GoOnline" component={GoOnlineScreen} />
            <Stack.Screen name="ConfirmZone" component={ConfirmZoneScreen} />
        </Stack.Navigator>
    );
}
