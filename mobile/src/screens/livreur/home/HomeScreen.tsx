import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLivreur } from '../../../context/LivreurContext';
import { colors } from '../../../theme/colors';

import HomeHeader from '../../../components/livreur/HomeHeader';
import OnlineToggleCard from '../../../components/livreur/OnlineToggleCard';
import QuickStatsCard from '../../../components/livreur/QuickStatsCard';
import IncomingRequestCard from '../../../components/livreur/IncomingRequestCard';
import ActiveDeliveryBanner from '../../../components/livreur/ActiveDeliveryBanner';

const HomeScreen: React.FC = () => {
    const { isOnline, incomingOrders, activeOrder } = useLivreur();

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <HomeHeader />
                    <OnlineToggleCard />
                    <View style={styles.section}>
                        <QuickStatsCard />
                    </View>

                    {isOnline && !activeOrder && incomingOrders.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Incoming Requests</Text>
                            {incomingOrders.map(order => (
                                <IncomingRequestCard key={order.id} order={order} />
                            ))}
                        </View>
                    )}

                    {isOnline && !activeOrder && incomingOrders.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>Waiting for new requests...</Text>
                        </View>
                    )}
                </ScrollView>
                {/* Banner is here. If absolute in component, it will overlay correctly */}
                <ActiveDeliveryBanner />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 100 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
    emptyState: { padding: 40, alignItems: 'center' },
    emptyStateText: { fontSize: 18, color: colors.textSecondary, fontWeight: '500' }
});

export default HomeScreen;
