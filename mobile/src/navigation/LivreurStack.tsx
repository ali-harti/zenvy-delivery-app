import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LivreurProvider } from '../context/LivreurContext';
import { LivreurTabs } from './LivreurTabs';
import ActiveDeliveryScreen from '../screens/livreur/activity/ActiveDeliveryScreen';

const Stack = createNativeStackNavigator();

export const LivreurStack = () => {
    return (
        <LivreurProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LivreurTabs" component={LivreurTabs} />
                <Stack.Screen
                    name="ActiveDelivery"
                    component={ActiveDeliveryScreen}
                    options={{ presentation: 'fullScreenModal' }}
                />
            </Stack.Navigator>
        </LivreurProvider>
    );
};
