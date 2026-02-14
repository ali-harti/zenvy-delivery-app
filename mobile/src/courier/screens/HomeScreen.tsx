import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import { useAuthStore } from '@auth/store/auth.store';
import { COLORS } from '@theme/colors';

import { AppSafeScreen } from '@shared/components/AppSafeScreen';

export default function CourierHomeScreen() {
    const { logout, user } = useAuthStore();

    return (
        <AppSafeScreen style={styles.container}>
            <Title>Courier Dashboard</Title>
            <Text style={styles.subtitle}>Ready to deliver, {user?.firstName}?</Text>

            <Button mode="contained" onPress={logout} style={styles.button} buttonColor={COLORS.info}>
                Logout
            </Button>
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.background,
    },
    subtitle: {
        marginBottom: 20,
        color: COLORS.textSecondary,
    },
    button: {
        marginTop: 20,
    }
});
