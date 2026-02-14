import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLivreur } from '../../../context/LivreurContext';
import { colors } from '../../../theme/colors';
import { cardStyles } from '../OnlineToggleCard';

const EarningsSummaryCard: React.FC = () => {
    const { selectedTimeframe, earningsData } = useLivreur();
    // Get data corresponding to currently selected timeframe
    const data = earningsData[selectedTimeframe];

    const BreakdownRow = ({ label, value }: { label: string; value: string }) => (
        <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{label}</Text>
            <Text style={styles.breakdownValue}>{value}</Text>
        </View>
    );

    return (
        <View style={cardStyles.card}>
            <Text style={styles.title}>Total Earnings</Text>
            <Text style={styles.totalAmount}>{data.total} MAD</Text>

            <View style={styles.divider} />

            <BreakdownRow label="Cash collected:" value={`${data.cashCollected} MAD`} />
            <BreakdownRow label="App payout:" value={`${data.appPayout} MAD`} />
            <View style={{ height: 12 }} />
            <BreakdownRow label="Deliveries:" value={data.deliveryCount.toString()} />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    totalAmount: {
        fontSize: 36,
        fontWeight: '800',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: 16,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    breakdownLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    breakdownValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
});

export default EarningsSummaryCard;
