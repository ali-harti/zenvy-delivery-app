import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, IconButton, Badge } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ZoneMap } from '../../components/ZoneMap';
import { useCompleteOnboarding, useAvailableZones } from '../../hooks/useLivreur';
import { useLivreurStore } from '../../stores/livreur.store';

export default function ConfirmZoneScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { isOnline, vehicle } = route.params || {};

    const completeMutation = useCompleteOnboarding();
    const { data: zones } = useAvailableZones();
    const startShift = useLivreurStore((s) => s.startShift);

    // Mock zone for now if API not ready
    const currentZone = zones?.data?.[0] || {
        id: '1',
        name: 'Casablanca',
        latitude: 33.5731,
        longitude: -7.5898,
        radiusKm: 5,
    };

    const handleConfirm = () => {
        completeMutation.mutate({
            preferredVehicle: vehicle || 'scooter',
            currentZone: currentZone.id,
            locationPermission: true,
            notificationPermission: true,
            isOnline: !!isOnline,
        }, {
            onSuccess: () => {
                // Update local store to trigger RootWrapper switch
                startShift();
            }
        });
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

                <Text variant="headlineMedium" style={styles.title}>Confirm your zone</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                    Ensure you are in the correct area to receive orders.
                </Text>

                <Card style={styles.zoneCard}>
                    <View style={styles.zoneHeader}>
                        <View style={styles.iconBox}>
                            <MaterialCommunityIcons name="map-marker" size={24} color="#00b894" />
                        </View>
                        <View style={styles.zoneInfo}>
                            <Text variant="titleMedium" style={styles.zoneName}>{currentZone.name}</Text>
                            <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>Detected</Text>
                            </View>
                        </View>
                        <Button mode="outlined" onPress={() => { }} textColor="#00b894" style={{ borderColor: '#00b894' }}>
                            Change
                        </Button>
                    </View>

                    <ZoneMap
                        latitude={currentZone.latitude}
                        longitude={currentZone.longitude}
                        radius={currentZone.radiusKm}
                    />
                </Card>

                <Button
                    mode="contained"
                    onPress={handleConfirm}
                    loading={completeMutation.isPending}
                    style={styles.button}
                    contentStyle={{ height: 56 }}
                    buttonColor="#00b894"
                >
                    Confirm Zone
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
        marginBottom: 8,
    },
    subtitle: {
        color: '#6c757d',
        marginBottom: 32,
    },
    zoneCard: {
        padding: 0,
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 32,
        overflow: 'hidden',
    },
    zoneHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#d1f4e0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    zoneInfo: {
        flex: 1,
        marginLeft: 12,
    },
    zoneName: {
        fontWeight: 'bold',
    },
    badgeContainer: {
        backgroundColor: '#d1f4e0',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginTop: 4,
    },
    badgeText: {
        color: '#0f5132',
        fontSize: 10,
        fontWeight: 'bold',
    },
    button: {
        borderRadius: 12,
        marginTop: 'auto',
    },
});
