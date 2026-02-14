import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLivreurProfile } from '../../hooks/useLivreur';
// import Animated, { FadeInDown } from 'react-native-reanimated';

export default function StartShiftScreen() {
    const navigation = useNavigation<any>();
    const { data: livreur, isLoading } = useLivreurProfile();

    if (isLoading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#00b894" />
            </SafeAreaView>
        );
    }

    // Fallback if no data (for development/mock)
    const profile = livreur?.data || {
        name: 'Karim Benali',
        rating: 4.9,
        preferredVehicle: 'scooter',
        // photoUrl removed
    };

    return (
        <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View>
                    <Text variant="displaySmall" style={styles.title}>Start your shift</Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        Confirm your status and go online to receive deliveries.
                    </Text>

                    <Card style={styles.driverCard}>
                        <View style={styles.cardContent}>
                            <View>
                                <Avatar.Icon
                                    size={72}
                                    icon="account"
                                    style={{ backgroundColor: '#e9ecef' }}
                                    color="#adb5bd"
                                />
                                <View style={styles.onlineBadge} />
                            </View>

                            <View style={styles.info}>
                                <Text variant="titleLarge" style={styles.name}>{profile.name}</Text>
                                <View style={styles.row}>
                                    <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.detail}>{profile.rating} Rating</Text>
                                </View>
                                <View style={styles.row}>
                                    <MaterialCommunityIcons
                                        name={profile.preferredVehicle === 'bike' ? 'bicycle' : profile.preferredVehicle === 'scooter' ? 'moped' : 'car'}
                                        size={16}
                                        color="#6c757d"
                                    />
                                    <Text style={styles.detail}>
                                        Vehicle: {profile.preferredVehicle}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Permissions')}
                        style={styles.button}
                        contentStyle={{ height: 56 }}
                        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        buttonColor="#00b894"
                    >
                        Continue
                    </Button>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 8,
    },
    subtitle: {
        color: '#6c757d',
        marginBottom: 32,
    },
    driverCard: {
        padding: 16,
        marginBottom: 32,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 4,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#00b894',
        borderWidth: 2,
        borderColor: 'white',
    },
    info: {
        marginLeft: 20,
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    detail: {
        marginLeft: 6,
        color: '#6c757d',
    },
    button: {
        borderRadius: 12,
    },
});
