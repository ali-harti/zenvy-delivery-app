import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, Checkbox, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { OnlineToggle } from '../../components/OnlineToggle';
import { VehicleSelector } from '../../components/VehicleSelector';
import { useUpdateVehicle } from '../../hooks/useLivreur';

export default function GoOnlineScreen() {
    const navigation = useNavigation<any>();
    const [isOnline, setIsOnline] = useState(false);
    const [vehicle, setVehicle] = useState('scooter');
    const [batteryReady, setBatteryReady] = useState(false);

    const updateVehicleMutation = useUpdateVehicle();

    const handleVehicleSelect = (v: string) => {
        setVehicle(v);
        updateVehicleMutation.mutate(v);
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

                <Text variant="headlineMedium" style={styles.title}>Go Online</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                    Confirm your status and vehicle to start.
                </Text>

                <Card style={styles.toggleCard}>
                    <OnlineToggle value={isOnline} onChange={setIsOnline} />
                    <Text style={styles.toggleDesc}>
                        {isOnline ? 'You are now visible to receive orders.' : 'Go online to start.'}
                    </Text>
                </Card>

                <Text variant="titleMedium" style={styles.sectionLabel}>Select vehicle type</Text>
                <VehicleSelector selected={vehicle} onSelect={handleVehicleSelect} />

                <Card style={styles.checkCard} onPress={() => setBatteryReady(!batteryReady)}>
                    <View style={styles.checkRow}>
                        <Checkbox.Android
                            status={batteryReady ? 'checked' : 'unchecked'}
                            onPress={() => setBatteryReady(!batteryReady)}
                            color="#00b894"
                        />
                        <Text style={styles.checkText}>Battery & internet ready</Text>
                    </View>
                </Card>

                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('ConfirmZone', { isOnline, vehicle })}
                    disabled={!isOnline || !batteryReady}
                    style={styles.button}
                    contentStyle={{ height: 56 }}
                    buttonColor="#00b894"
                >
                    Start Delivering
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
    toggleCard: {
        padding: 24,
        borderRadius: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        marginBottom: 32,
    },
    toggleDesc: {
        textAlign: 'center',
        color: '#6c757d',
        marginTop: 8,
    },
    sectionLabel: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    checkCard: {
        borderRadius: 16,
        backgroundColor: 'white',
        marginBottom: 32,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    checkText: {
        fontSize: 16,
        fontWeight: '500',
    },
    button: {
        borderRadius: 12,
    },
});
