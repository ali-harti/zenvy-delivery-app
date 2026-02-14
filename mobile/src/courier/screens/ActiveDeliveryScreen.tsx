import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryApi } from '@api/endpoints/delivery';
import { ordersApi } from '@api/endpoints/orders';
import { OrderDTO, OrderStatus, UserRole } from '@api/types/dto';
import { AppHeader } from '@components/ui/AppHeader';
import { LoadingState } from '@components/ui/LoadingState';
import { EmptyState } from '@components/ui/EmptyState';
import { AppButton } from '@components/ui/AppButton';
import { AppCard } from '@components/ui/AppCard';
import { COLORS } from '@theme/colors';
import { getNextStatus } from '@config/orderLogic';

import { AppSafeScreen } from '@shared/components/AppSafeScreen';

export default function ActiveDeliveryScreen() {
    const queryClient = useQueryClient();

    // Fetch active order for courier
    const { data: activeOrders, isLoading, refetch } = useQuery({
        queryKey: ['active-delivery'],
        queryFn: () => ordersApi.list(UserRole.COURIER)
        // Logic: filtered by "my active orders" in backend
    });

    // Assume one active delivery at a time
    const activeOrder = activeOrders?.data?.find((o: OrderDTO) =>
        [OrderStatus.DRIVER_ASSIGNED, OrderStatus.READY, OrderStatus.IN_DELIVERY].includes(o.status)
    );

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: OrderStatus }) =>
            ordersApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['active-delivery'] });
            refetch();
        },
        onError: (err: any) => Alert.alert("Error", err.message)
    });

    if (isLoading) return <LoadingState />;

    if (!activeOrder) {
        return (
            <AppSafeScreen style={styles.container}>
                <AppHeader title="Active Delivery" />
                <EmptyState
                    title="No Active Delivery"
                    message="Accept an order from the Available tab to start."
                />
            </AppSafeScreen>
        );
    }

    const nextStatus = getNextStatus(activeOrder.status, UserRole.COURIER);
    const actionLabel = nextStatus === OrderStatus.IN_DELIVERY ? 'Confirm Pickup' :
        nextStatus === OrderStatus.DELIVERED ? 'Complete Delivery' :
            null;

    const items = activeOrder.items || [];
    // ...

    return (
        <AppSafeScreen style={styles.container}>
            <AppHeader title={`Delivery #${activeOrder.id}`} />
            {/* ... */}
            <ScrollView contentContainerStyle={styles.content}>
                {/* ... */}
            </ScrollView>

            {/* Action Footer */}
            {nextStatus && (
                <View style={styles.footer}>
                    <AppButton
                        onPress={() => updateStatusMutation.mutate({ id: activeOrder.id, status: nextStatus })}
                        loading={updateStatusMutation.isPending}
                        mode="contained"
                        style={{ paddingVertical: 8 }}
                    >
                        {actionLabel}
                    </AppButton>
                </View>
            )}
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: 16 },
    statusBanner: { alignItems: 'center', marginBottom: 20 },
    statusText: { color: COLORS.primary, fontWeight: 'bold' },
    sectionCard: { marginBottom: 16, padding: 16 },
    label: { color: COLORS.textSecondary, marginBottom: 4, textTransform: 'uppercase', fontSize: 12 },
    itemRow: { marginVertical: 2 },
    footer: { padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: COLORS.border },
});
