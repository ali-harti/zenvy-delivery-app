import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '@theme/colors';

import DashboardScreen from '../merchant/screens/DashboardScreen';
import OrdersScreen from '../merchant/screens/OrdersScreen';
import ProductsScreen from '../merchant/screens/ProductsScreen';
import ProfileScreen from '../merchant/screens/ProfileScreen'; // Check extension

const Tab = createBottomTabNavigator();

export default function MerchantNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarIcon: ({ color }) => {
                    let icon = '•';
                    if (route.name === 'Dashboard') icon = '📊';
                    if (route.name === 'ActiveOrders') icon = '🛎️';
                    if (route.name === 'Menu') icon = '🍔';
                    if (route.name === 'Profile') icon = '👤';
                    return <Text style={{ color, fontSize: 18 }}>{icon}</Text>
                }
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="ActiveOrders" component={OrdersScreen} />
            <Tab.Screen name="Menu" component={ProductsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen as any} />
        </Tab.Navigator>
    );
}
