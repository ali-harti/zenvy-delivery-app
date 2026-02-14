import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import SplashScreen from "../auth/screens/SplashScreen";
import WelcomeScreen from "../auth/screens/WelcomeScreen";
import LoginScreen from "../auth/screens/LoginScreen"; // Fixed default import
import RegisterScreen from "../auth/screens/RegisterScreen";
import { ForgotPasswordScreen } from "../auth/screens/ForgotPasswordScreen";

const Stack = createStackNavigator();

export function AuthNavigator() {
    console.log("[AuthNavigator] Rendered");
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
}
