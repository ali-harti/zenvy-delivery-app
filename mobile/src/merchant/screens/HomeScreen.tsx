import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import { useAuthStore } from '@auth/store/auth.store';
import { COLORS } from '@theme/colors';

export default function MerchantHomeScreen() {
    const { logout, user } = useAuthStore();

    return (
        <View style={styles.container}>
            <Title>Merchant Dashboard</Title>
            <Text style={styles.subtitle}>Welcome, {user?.firstName}!</Text>

            <Button mode="contained" onPress={logout} style={styles.button} buttonColor={COLORS.secondary}>
                Logout
            </Button>
        </View>
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
