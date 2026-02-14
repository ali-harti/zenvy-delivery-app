import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingNavigator } from "./OnboardingNavigator";

export type LivreurShiftStackParamList = {
    Onboarding: undefined;
};

const Stack = createNativeStackNavigator<LivreurShiftStackParamList>();

export default function LivreurShiftNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}
        >
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        </Stack.Navigator>
    );
}
