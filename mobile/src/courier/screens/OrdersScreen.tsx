import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryApi } from '@api/endpoints/delivery';
import { OrderDTO } from '@api/types/dto';
import { AppHeader } from '@components/ui/AppHeader';
import { LoadingState } from '@components/ui/LoadingState';
import { EmptyState } from '@components/ui/EmptyState';
import { AppCard } from '@components/ui/AppCard';
import { AppButton } from '@components/ui/AppButton';
import { COLORS } from '@theme/colors';
import { useNavigation } from '@react-navigation/native';

import { AppSafeScreen } from '@shared/components/AppSafeScreen';

export default function CourierOrdersScreen() {
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const [isOnline, setIsOnline] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['available-deliveries'],
        queryFn: () => deliveryApi.listReady({ lat: 0, lng: 0 }), // Mock location
        enabled: isOnline
    });

    const acceptMutation = useMutation({
        mutationFn: (orderId: number) => deliveryApi.accept(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['available-deliveries'] });
            navigation.navigate('Active'); // Switch tab
        }
    });

    const renderOrder = ({ item }: { item: OrderDTO }) => (
        <AppCard style={styles.card}>
            <View style={styles.header}>
                <Text variant="titleMedium">Delivery #{item.id}</Text>
                <Text style={{ color: COLORS.success, fontWeight: 'bold' }}>${(item.totalPrice * 0.15).toFixed(2)} Earnings</Text>
            </View>
            <Text style={{ marginBottom: 8 }}>Pickup: Store #{item.storeId}</Text>
            <Text style={{ marginBottom: 16 }}>Dropoff: {item.deliveryAddress}</Text>

            <AppButton
                onPress={() => acceptMutation.mutate(item.id)}
                loading={acceptMutation.isPending}
            >
                Accept Delivery
            </AppButton>
        </AppCard>
    );

    return (
        <AppSafeScreen style={styles.container}>
            <AppHeader
                title="Available Orders"
                rightAction={
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                        <Text style={{ marginRight: 8 }}>{isOnline ? 'Online' : 'Offline'}</Text>
                        <Switch value={isOnline} onValueChange={setIsOnline} color={COLORS.primary} />
                    </View>
                }
            />

            {!isOnline ? (
                <EmptyState title="You are Offline" message="Go online to start receiving orders." />
            ) : isLoading ? (
                <LoadingState />
            ) : (
                <FlatList
                    data={data?.data || []}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderOrder}
                    contentContainerStyle={{ padding: 10 }}
                    ListEmptyComponent={<EmptyState title="No orders nearby" />}
                    onRefresh={refetch}
                    refreshing={isLoading}
                />
            )}
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    card: { marginVertical: 8, padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
});
