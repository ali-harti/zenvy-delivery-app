import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '@theme/colors';

import OrdersScreen from '../courier/screens/OrdersScreen';
import ActiveDeliveryScreen from '../courier/screens/ActiveDeliveryScreen';
import EarningsScreen from '../courier/screens/EarningsScreen';
import ProfileScreen from '../courier/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function CourierNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarIcon: ({ color }) => {
                    let icon = '•';
                    if (route.name === 'Available') icon = '📦';
                    if (route.name === 'Active') icon = '🚚';
                    if (route.name === 'Earnings') icon = '💰';
                    if (route.name === 'Profile') icon = '👤';
                    return <Text style={{ color, fontSize: 18 }}>{icon}</Text>
                }
            })}
        >
            <Tab.Screen name="Available" component={OrdersScreen} />
            <Tab.Screen name="Active" component={ActiveDeliveryScreen} />
            <Tab.Screen name="Earnings" component={EarningsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen as any} />
        </Tab.Navigator>
    );
}
