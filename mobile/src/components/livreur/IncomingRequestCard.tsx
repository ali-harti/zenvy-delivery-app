import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Order } from '../../types/livreur';
import { useLivreur } from '../../context/LivreurContext';
import { colors } from '../../theme/colors';
import { cardStyles } from './OnlineToggleCard';

interface Props {
    order: Order;
}

const IncomingRequestCard: React.FC<Props> = ({ order }) => {
    const { acceptOrder, rejectOrder } = useLivreur();

    return (
        <View style={[cardStyles.card, styles.container]}>
            <View style={styles.header}>
                <Text style={styles.title}>New Request!</Text>
                <Text style={styles.earnings}>{order.earnings} MAD</Text>
            </View>

            <Text style={styles.restaurant}>{order.restaurant}</Text>

            <View style={styles.locationRow}>
                <Feather name="map-pin" size={16} color={colors.textSecondary} />
                <Text style={styles.address}>Pickup: {order.restaurantAddress}</Text>
            </View>
            <View style={styles.locationRow}>
                <Feather name="navigation" size={16} color={colors.textSecondary} />
                <Text style={styles.address}>Dropoff: {order.customerAddress}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => rejectOrder(order.id)}
                >
                    <Text style={styles.rejectText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => acceptOrder(order.id)}
                >
                    <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { borderLeftWidth: 4, borderLeftColor: colors.primary },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    earnings: { fontSize: 18, fontWeight: '700', color: colors.primary },
    restaurant: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    address: { fontSize: 14, color: colors.textSecondary, marginLeft: 8 },
    buttonContainer: { flexDirection: 'row', marginTop: 20 },
    button: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    rejectButton: { backgroundColor: colors.border, marginRight: 10 },
    acceptButton: { backgroundColor: colors.primary, marginLeft: 10 },
    rejectText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    acceptText: { fontSize: 16, fontWeight: '600', color: colors.cardBackground },
});

export default IncomingRequestCard;
