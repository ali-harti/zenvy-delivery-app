import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLivreur } from '../../../context/LivreurContext';
import { colors } from '../../../theme/colors';
import TimeframeSelector from '../../../components/livreur/Earnings/TimeframeSelector';
import EarningsSummaryCard from '../../../components/livreur/Earnings/EarningsSummaryCard';
import DeliveryHistoryCard from '../../../components/livreur/Earnings/DeliveryHistoryCard';

const EarningsScreen: React.FC = () => {
    // We only need the history list here, the other components get their own data from context
    const { deliveryHistory } = useLivreur();

    const renderHeader = () => (
        <View>
            <Text style={styles.headerTitle}>Earnings</Text>
            <TimeframeSelector />
            <EarningsSummaryCard />
            <Text style={styles.historyTitle}>Recent Deliveries</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <FlatList
                data={deliveryHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <DeliveryHistoryCard item={item} />}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: 10,
        marginBottom: 16,
    },
});

export default EarningsScreen;
