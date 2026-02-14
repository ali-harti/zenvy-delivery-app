import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useLivreur } from '../../context/LivreurContext';
import { colors } from '../../theme/colors';
import { cardStyles } from './OnlineToggleCard'; // Reuse styles

const QuickStatsCard: React.FC = () => {
    const { stats, profile } = useLivreur();

    if (!stats || !profile) return null;

    const StatItem = ({ icon, label, value, valueStyle = {} }: any) => (
        <View style={styles.statItem}>
            <View style={styles.iconContainer}>{icon}</View>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={[styles.statValue, valueStyle]}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={[cardStyles.card, styles.card]}>
                <StatItem
                    icon={<Feather name="credit-card" size={24} color={colors.primary} />}
                    label="Today earnings"
                    value={`${stats.earnings} ${stats.currency}`}
                    valueStyle={{ color: colors.primary }}
                />
            </View>
            <View style={[cardStyles.card, styles.card]}>
                <StatItem
                    icon={<Feather name="check-circle" size={24} color={colors.primary} />}
                    label="Completed"
                    value={stats.completedDeliveries.toString()}
                />
            </View>
            <View style={[cardStyles.card, styles.card]}>
                <StatItem
                    icon={<FontAwesome name="star" size={24} color={colors.primary} />}
                    label="Rating"
                    value={`${profile.rating.toFixed(1)} ★`}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 8,
        marginHorizontal: 6,
        marginBottom: 0,
    },
    statItem: {
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 6,
        textAlign: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
    },
});

export default QuickStatsCard;
