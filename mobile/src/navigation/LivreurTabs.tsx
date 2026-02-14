import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../shared/store/theme.store';
import { LivreurProvider } from '../context/LivreurContext';

import HomeScreen from '../screens/livreur/home/HomeScreen';
import LivreurProfileScreen from '../screens/livreur/profile/LivreurProfileScreen';

const Tab = createBottomTabNavigator();

import EarningsScreen from '../screens/livreur/earnings/EarningsScreen';

// Placeholder Screens
// const EarningsScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Has Earnings</Text></View>;


export const LivreurTabs = () => {
    const { colors } = useAppTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.cardBg,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary, // Green
                tabBarInactiveTintColor: colors.textSecondary,
            }}
        >
            <Tab.Screen
                name="LivreurHome"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="moped" size={size} color={color} />
                }}
            />
            <Tab.Screen
                name="LivreurEarnings"
                component={EarningsScreen}
                options={{
                    tabBarLabel: 'Earnings',
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="finance" size={size} color={color} />
                }}
            />
            <Tab.Screen
                name="LivreurProfile"
                component={LivreurProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" size={size} color={color} />
                }}
            />
        </Tab.Navigator>
    );
};
