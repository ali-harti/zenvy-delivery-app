import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@api/endpoints/orders';
import { UserRole, OrderDTO, OrderStatus } from '@api/types/dto';
import { AppHeader } from '@components/ui/AppHeader';
import { LoadingState } from '@components/ui/LoadingState';
import { EmptyState } from '@components/ui/EmptyState';
import { AppCard } from '@components/ui/AppCard';
import { AppButton } from '@components/ui/AppButton';
import { Text, Chip } from 'react-native-paper';
import { COLORS } from '@theme/colors';
import { socketService } from '@realtime/socket';
import { SOCKET_EVENTS } from '@realtime/events';
import { getNextStatus } from '@config/orderLogic';

import { AppSafeScreen } from '@shared/components/AppSafeScreen';

export default function MerchantOrdersScreen() {
    const queryClient = useQueryClient();
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['orders', UserRole.MERCHANT],
        queryFn: () => ordersApi.list(UserRole.MERCHANT)
    });

    useEffect(() => {
        const handleNewOrder = () => refetch();
        socketService.on(SOCKET_EVENTS.ORDER.CREATED, handleNewOrder);
        socketService.on(SOCKET_EVENTS.ORDER.STATUS_UPDATED, handleNewOrder);
        return () => {
            socketService.off(SOCKET_EVENTS.ORDER.CREATED, handleNewOrder);
            socketService.off(SOCKET_EVENTS.ORDER.STATUS_UPDATED, handleNewOrder);
        };
    }, [refetch]);

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
            ordersApi.updateStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
    });

    const renderOrder = ({ item }: { item: OrderDTO }) => {
        const nextStatus = getNextStatus(item.status, UserRole.MERCHANT);

        return (
            <AppCard style={styles.card}>
                <View style={styles.header}>
                    <Text variant="titleMedium">#{item.id}</Text>
                    <Chip compact>{item.status}</Chip>
                </View>
                <Text style={{ marginVertical: 8 }}>{item.items?.length} Items</Text>

                {nextStatus && (
                    <AppButton
                        onPress={() => updateStatusMutation.mutate({ id: item.id, status: nextStatus })}
                        loading={updateStatusMutation.isPending}
                    >
                        Mark as {nextStatus.replace('_', ' ')}
                    </AppButton>
                )}
            </AppCard>
        );
    };

    if (isLoading) return <LoadingState />;

    return (
        <AppSafeScreen style={styles.container}>
            <AppHeader title="Incoming Orders" />
            <FlatList
                data={data?.data || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrder}
                contentContainerStyle={{ padding: 10 }}
                ListEmptyComponent={<EmptyState title="No Active Orders" />}
            />
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    card: { marginVertical: 8, padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
