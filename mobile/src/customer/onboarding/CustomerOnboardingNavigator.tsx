import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CustomerOnboardingScreen from "./CustomerOnboardingScreen";

export type CustomerOnboardingStackParamList = {
    CustomerOnboarding: undefined;
};

const Stack = createStackNavigator<CustomerOnboardingStackParamList>();

export default function CustomerOnboardingNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="CustomerOnboarding"
                component={CustomerOnboardingScreen}
            />
        </Stack.Navigator>
    );
}
