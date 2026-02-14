import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
// import * as Notifications from 'expo-notifications';
import { PermissionCard } from '../../components/PermissionCard';
import { apiClient } from '../../api/http';

export default function PermissionsScreen() {
    const navigation = useNavigation<any>();
    const [permissions, setPermissions] = useState({
        location: false,
        notification: false,
    });

    const handleLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            setPermissions(prev => ({ ...prev, location: true }));
            // Sync with DB
            apiClient.post('/permissions/update', { location: true }).catch(console.error);
        }
    };

    const handleNotification = async () => {
        // Mock for Expo Go since Notifications are removed
        console.log('Notification permission mocked for Expo Go');
        setPermissions(prev => ({ ...prev, notification: true }));
        apiClient.post('/permissions/update', { notification: true }).catch(console.error);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
                    style={{ marginLeft: -12 }}
                />

                <Text variant="headlineMedium" style={styles.title}>Permissions Check</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                    To ensure a smooth delivery experience, please allow the following permissions.
                </Text>

                <View style={styles.cards}>
                    <PermissionCard
                        index={0}
                        icon="map-marker"
                        iconBg="#d1f4e0"
                        title="Location Access"
                        description="Required for navigation and to find nearby orders."
                        status={permissions.location}
                        onEnable={handleLocation}
                    />

                    <PermissionCard
                        index={1}
                        icon="bell"
                        iconBg="#dfe6f5"
                        title="Notifications"
                        description="Get instant alerts for new delivery requests and updates."
                        status={permissions.notification}
                        onEnable={handleNotification}
                    />
                </View>

                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('GoOnline')}
                    disabled={!permissions.location || !permissions.notification}
                    style={styles.button}
                    contentStyle={{ height: 56 }}
                    buttonColor="#00b894"
                >
                    Next
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 8,
    },
    subtitle: {
        color: '#6c757d',
        marginBottom: 32,
    },
    cards: {
        marginBottom: 40,
    },
    button: {
        borderRadius: 12,
        marginTop: 'auto',
    },
});
