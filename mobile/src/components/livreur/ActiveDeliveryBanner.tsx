import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLivreur } from '../../context/LivreurContext';
import { colors } from '../../theme/colors';

const ActiveDeliveryBanner: React.FC = () => {
    const { activeOrder } = useLivreur();
    const navigation = useNavigation<any>();

    if (!activeOrder) return null;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('ActiveDelivery')}
            activeOpacity={0.9}
        >
            <View>
                <Text style={styles.title}>Active Delivery</Text>
                <Text style={styles.subtitle}>Pickup at {activeOrder.restaurant}</Text>
            </View>
            <View style={styles.button}>
                <Text style={styles.buttonText}>View</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 16,
        margin: 20,
        marginBottom: 90, // Adjusted to avoid overlap with tabs if absolute
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    title: { fontSize: 16, fontWeight: '700', color: colors.cardBackground },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
    button: { backgroundColor: colors.cardBackground, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    buttonText: { fontSize: 14, fontWeight: '700', color: colors.primary },
});

export default ActiveDeliveryBanner;
