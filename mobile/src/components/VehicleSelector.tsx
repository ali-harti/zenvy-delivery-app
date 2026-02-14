import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface VehicleSelectorProps {
    selected: string;
    onSelect: (vehicle: string) => void;
}

const VEHICLES = [
    { id: 'bike', label: 'Bike', icon: 'bicycle' },
    { id: 'scooter', label: 'Scooter', icon: 'moped' },
    { id: 'car', label: 'Car', icon: 'car' },
] as const;

export function VehicleSelector({ selected, onSelect }: VehicleSelectorProps) {
    return (
        <View style={styles.container}>
            {VEHICLES.map((vehicle) => {
                const isSelected = selected === vehicle.id;
                return (
                    <TouchableOpacity
                        key={vehicle.id}
                        activeOpacity={0.7}
                        onPress={() => onSelect(vehicle.id)}
                        style={[
                            styles.card,
                            isSelected && styles.cardActive
                        ]}
                    >
                        <View>
                            <MaterialCommunityIcons
                                name={vehicle.icon as any}
                                size={32}
                                color={isSelected ? 'white' : '#212529'}
                            />
                            <Text style={[styles.label, isSelected && styles.labelActive]}>
                                {vehicle.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
    },
    cardActive: {
        backgroundColor: '#00b894',
        borderColor: '#00b894',
        elevation: 4,
    },
    label: {
        marginTop: 8,
        fontWeight: '600',
        color: '#212529',
    },
    labelActive: {
        color: 'white',
    },
});
