import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DeliveryHistoryItem } from '../../../types/livreur';
import { colors } from '../../../theme/colors';
import { cardStyles } from '../OnlineToggleCard';

// Helper to format date neatly
const formatDate = (date: Date) => {
    const now = new Date();
    const d = new Date(date); // Ensure it's a Date object
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();

    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) {
        return `Today, ${timeStr}`;
    }

    const dayStr = d.toLocaleDateString([], { weekday: 'short' });
    return `${dayStr}, ${timeStr}`;
};

interface Props {
    item: DeliveryHistoryItem;
}

const DeliveryHistoryCard: React.FC<Props> = ({ item }) => {
    return (
        <View style={[cardStyles.card, styles.container]}>
            <View style={styles.iconBox}>
                <Feather name="shopping-bag" size={20} color={colors.textPrimary} />
            </View>
            <View style={styles.info}>
                <Text style={styles.restaurant}>{item.restaurantName}</Text>
                <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
                <View style={styles.statusRow}>
                    <Feather name="check-circle" size={14} color={colors.success} style={{ marginRight: 4 }} />
                    <Text style={styles.statusText}>Completed</Text>
                </View>
            </View>
            <Text style={styles.earnings}>{item.earnings} MAD</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    restaurant: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textPrimary
    },
    earnings: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
    },
});

export default DeliveryHistoryCard;
