import React from 'react';
import { AppProviders } from './AppProviders';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '../navigation/RootNavigator';
import { View, Text } from 'react-native';

export default function Root() {
    console.log("[Root] Rendered");
    return (
        <AppProviders>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </AppProviders>
    );
}
