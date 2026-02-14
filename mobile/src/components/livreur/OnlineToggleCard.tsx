import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useLivreur } from '../../context/LivreurContext';
import { colors } from '../../theme/colors';

// Simple card style abstraction
const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 5,
    },
});

export { cardStyles }; // Export for others

const OnlineToggleCard: React.FC = () => {
    const { isOnline, toggleOnline } = useLivreur();

    return (
        <View style={[cardStyles.card, styles.container]}>
            <View style={styles.toggleRow}>
                <Text style={[styles.label, !isOnline && styles.activeLabel]}>Offline</Text>
                <Switch
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.cardBackground}
                    ios_backgroundColor={colors.border}
                    onValueChange={toggleOnline}
                    value={isOnline}
                    style={styles.switch}
                />
                <Text style={[styles.label, isOnline && styles.activeLabel]}>Online</Text>
            </View>
            <Text style={styles.statusText}>
                {isOnline
                    ? "You're online. Waiting for delivery requests..."
                    : "You're offline. Go online to start receiving orders."}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    switch: {
        marginHorizontal: 12,
        transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    activeLabel: {
        color: colors.textPrimary,
    },
    statusText: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default OnlineToggleCard;
