import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { AppHeader } from '@components/ui/AppHeader';
import { AppCard } from '@components/ui/AppCard';
import { COLORS } from '@theme/colors';

import { AppSafeScreen } from '@shared/components/AppSafeScreen';

export default function MerchantDashboardScreen() {
    const [isStoreOpen, setIsStoreOpen] = React.useState(true); // Should fetch from API

    return (
        <AppSafeScreen style={styles.container}>
            <AppHeader title="Dashboard" />
            <ScrollView contentContainerStyle={styles.content}>
                <AppCard style={styles.statusCard}>
                    <View style={styles.row}>
                        <Text variant="titleMedium">Store Status</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginRight: 8 }}>{isStoreOpen ? 'Open' : 'Closed'}</Text>
                            <Switch value={isStoreOpen} onValueChange={setIsStoreOpen} color={COLORS.success} />
                        </View>
                    </View>
                </AppCard>

                <View style={styles.statsRow}>
                    <AppCard style={styles.statCard}>
                        <Text variant="headlineMedium" style={{ color: COLORS.primary }}>12</Text>
                        <Text variant="bodySmall">Active Orders</Text>
                    </AppCard>
                    <AppCard style={styles.statCard}>
                        <Text variant="headlineMedium" style={{ color: COLORS.primary }}>$450</Text>
                        <Text variant="bodySmall">Today's Sales</Text>
                    </AppCard>
                </View>
            </ScrollView>
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: 20 },
    statusCard: { marginBottom: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statCard: { flex: 1, alignItems: 'center', marginHorizontal: 4 },
});
