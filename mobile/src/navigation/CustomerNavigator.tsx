import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../shared/theme/colors';
import { Typography } from '../shared/ui/Typography';
import { AppIcon } from '../shared/ui/AppIcon';

// Home Stack Screens
import CustomerHomeScreen from '../customer/screens/CustomerHomeScreen';
import StoreDetailScreen from '../customer/screens/StoreDetailScreen';
import ProductDetailScreen from '../customer/screens/ProductDetailScreen';
import { CategoryResultsScreen } from '../customer/screens/CategoryResultsScreen';
import NotificationsScreen from '../customer/screens/NotificationsScreen';

// Client Premium Screens
import ClientHomeScreen from '../client/screens/ClientHomeScreen';
import StoreScreen from '../client/screens/StoreScreen';

// Search Stack Screens
import { CustomerSearchScreen } from '../customer/screens/CustomerSearchScreen';

// Cart Stack Screens
import CartScreen from '../customer/screens/CartScreen';
import CheckoutScreen from '../customer/screens/CheckoutScreen';
import { OrderPlacedScreen } from '../customer/screens/OrderPlacedScreen';

// Orders Stack Screens
// import OrdersScreen from '../customer/screens/OrdersScreen'; // Legacy
// import OrderDetailScreen from '../customer/screens/OrderDetailScreen'; // Legacy
import OrdersScreen from '../screens/Orders/OrdersScreen';
import OrderDetailsScreen from '../screens/Orders/OrderDetailsScreen';
import OrderTrackingScreen from '../screens/Orders/OrderTrackingScreen';
import { RateOrderScreen } from '../customer/screens/RateOrderScreen';

// Profile Stack
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const OrdersStack = createNativeStackNavigator();

// --- 1. Home Stack ---
function HomeStackNavigator() {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="CustomerHome" component={CustomerHomeScreen} />
            <HomeStack.Screen name="ClientHome" component={ClientHomeScreen} />
            <HomeStack.Screen name="Store" component={StoreScreen} />
            <HomeStack.Screen name="CategoryResults" component={CategoryResultsScreen} />
            <HomeStack.Screen name="StoreDetail" component={StoreDetailScreen} />
            <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />
            {/* Cart could be accessed from here too if needed */}
            <HomeStack.Screen name="Cart" component={CartScreen} />
            <HomeStack.Screen name="Checkout" component={CheckoutScreen} />
            <HomeStack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
            <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
        </HomeStack.Navigator>
    );
}

// --- 2. Search Stack ---
function SearchStackNavigator() {
    return (
        <SearchStack.Navigator screenOptions={{ headerShown: false }}>
            <SearchStack.Screen name="SearchMain" component={CustomerSearchScreen} />
            <SearchStack.Screen name="StoreDetail" component={StoreDetailScreen} />
            <SearchStack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </SearchStack.Navigator>
    );
}

// --- 3. Orders Stack ---
function OrdersStackNavigator() {
    return (
        <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
            <OrdersStack.Screen name="OrdersList" component={OrdersScreen} />
            <OrdersStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
            <OrdersStack.Screen name="Tracking" component={OrderTrackingScreen} />
            <OrdersStack.Screen name="RateOrder" component={RateOrderScreen} />
        </OrdersStack.Navigator>
    );
}

// ... imports

// ... other code

export default function CustomerNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    backgroundColor: colors.white,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 5,
                    paddingTop: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                tabBarIcon: ({ focused, color }) => {
                    let icon = 'circle';
                    if (route.name === 'Home') icon = 'home';
                    else if (route.name === 'Search') icon = 'magnify';
                    else if (route.name === 'Orders') icon = 'file-document-outline';
                    else if (route.name === 'Profile') icon = 'account';
                    else if (route.name === 'Notifications') icon = focused ? 'bell' : 'bell-outline';

                    return <AppIcon name={icon} size={24} color={color} />;
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Search" component={SearchStackNavigator} />
            <Tab.Screen name="Orders" component={OrdersStackNavigator} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}
