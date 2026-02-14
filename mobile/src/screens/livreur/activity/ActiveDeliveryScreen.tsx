import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLivreur } from '../../../context/LivreurContext';
import { colors } from '../../../theme/colors';
import { OrderStatus } from '../../../types/livreur';
import { cardStyles } from '../../../components/livreur/OnlineToggleCard';

const statusSteps: { key: OrderStatus; label: string; icon: string }[] = [
    { key: 'accepted', label: 'Accepted', icon: 'check' },
    { key: 'arrived_at_store', label: 'At Store', icon: 'map-pin' },
    { key: 'picked_up', label: 'Picked Up', icon: 'package' },
    { key: 'on_the_way', label: 'On the Way', icon: 'navigation' },
    { key: 'delivered', label: 'Delivered', icon: 'home' },
];

const ActiveDeliveryScreen: React.FC = () => {
    const navigation = useNavigation();
    const { activeOrder, updateOrderStatus } = useLivreur();

    if (!activeOrder) {
        navigation.goBack();
        return null;
    }

    const currentStepIndex = statusSteps.findIndex(s => s.key === activeOrder.status);

    const nextAction = useMemo(() => {
        switch (activeOrder.status) {
            case 'accepted': return { label: 'Arrived at Store', nextStatus: 'arrived_at_store' as OrderStatus };
            case 'arrived_at_store': return { label: 'Confirm Pickup', nextStatus: 'picked_up' as OrderStatus };
            case 'picked_up': return { label: 'Start Delivery', nextStatus: 'on_the_way' as OrderStatus };
            case 'on_the_way': return { label: 'Confirm Delivery', nextStatus: 'delivered' as OrderStatus };
            default: return null;
        }
    }, [activeOrder.status]);

    const handleNextAction = () => {
        if (nextAction) {
            updateOrderStatus(nextAction.nextStatus);
            if (nextAction.nextStatus === 'delivered') {
                navigation.goBack();
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Active Delivery</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Stepper */}
                <View style={[cardStyles.card, styles.stepperCard]}>
                    <View style={styles.stepperContainer}>
                        {statusSteps.map((step, index) => {
                            const isActive = index <= currentStepIndex;
                            return (
                                <React.Fragment key={step.key}>
                                    <View style={styles.stepItem}>
                                        <View style={[styles.stepIcon, isActive && styles.activeStepIcon]}>
                                            <Feather name={step.icon as any} size={16} color={isActive ? colors.cardBackground : colors.textSecondary} />
                                        </View>
                                        <Text style={[styles.stepLabel, isActive && styles.activeStepLabel]}>{step.label}</Text>
                                    </View>
                                    {index < statusSteps.length - 1 && (
                                        <View style={[styles.stepLine, index < currentStepIndex && styles.activeStepLine]} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </View>
                </View>

                {/* Order Details */}
                <View style={cardStyles.card}>
                    <Text style={styles.sectionTitle}>Order Details</Text>
                    <View style={styles.detailRow}>
                        <FontAwesome5 name="store" size={18} color={colors.textSecondary} style={styles.detailIcon} />
                        <View>
                            <Text style={styles.detailLabel}>Restaurant</Text>
                            <Text style={styles.detailValue}>{activeOrder.restaurant}</Text>
                            <Text style={styles.detailAddress}>{activeOrder.restaurantAddress}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <FontAwesome5 name="user-alt" size={18} color={colors.textSecondary} style={styles.detailIcon} />
                        <View>
                            <Text style={styles.detailLabel}>Customer</Text>
                            <Text style={styles.detailValue}>{activeOrder.customer}</Text>
                            <Text style={styles.detailAddress}>{activeOrder.customerAddress}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Button */}
            {nextAction && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleNextAction}>
                        <Text style={styles.actionButtonText}>{nextAction.label}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
    content: { padding: 20 },
    stepperCard: { paddingVertical: 24 },
    stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    stepItem: { alignItems: 'center', zIndex: 1 },
    stepIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    activeStepIcon: { backgroundColor: colors.primary },
    stepLabel: { fontSize: 12, color: colors.textSecondary },
    activeStepLabel: { color: colors.primary, fontWeight: '600' },
    stepLine: { flex: 1, height: 2, backgroundColor: colors.border, position: 'relative', top: -14, marginHorizontal: -4 },
    activeStepLine: { backgroundColor: colors.primary },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
    detailIcon: { marginRight: 16, marginTop: 4 },
    detailLabel: { fontSize: 14, color: colors.textSecondary },
    detailValue: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    detailAddress: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 16, marginLeft: 34 },
    footer: { padding: 20, backgroundColor: colors.cardBackground, borderTopWidth: 1, borderTopColor: colors.border },
    actionButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    actionButtonText: { fontSize: 18, fontWeight: '700', color: colors.cardBackground },
});

export default ActiveDeliveryScreen;
