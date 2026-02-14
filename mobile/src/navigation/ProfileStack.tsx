import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import ProfileScreen from "../customer/screens/ProfileScreen";
import { SettingsScreen } from "../customer/screens/SettingsScreen";
import NotificationsScreen from "../customer/screens/NotificationsScreen";
import { AddressSelectorScreen } from "../customer/screens/AddressSelectorScreen";

import { EditProfileScreen } from "../customer/screens/EditProfileScreen";
import { ChangePasswordScreen } from "../customer/screens/ChangePasswordScreen";

// Define the param list for accurate typing
export type ProfileStackParamList = {
    ProfileHome: undefined;
    Settings: undefined;
    Notifications: undefined;
    AddressSelector: undefined;
    EditProfile: undefined;
    ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileHome" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="AddressSelector" component={AddressSelectorScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </Stack.Navigator>
    );
}
