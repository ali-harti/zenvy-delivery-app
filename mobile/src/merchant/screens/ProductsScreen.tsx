import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storesApi } from '@api/endpoints/stores';
import { ProductDTO } from '@api/types/dto';
import { AppHeader } from '@components/ui/AppHeader';
import { LoadingState } from '@components/ui/LoadingState';
import { AppCard } from '@components/ui/AppCard';
import { Text, Switch, FAB } from 'react-native-paper';
import { COLORS } from '@theme/colors';

// We need a way to get the merchant's store ID. 
// For MVP, we'll fetch the merchant's store first or assume a hardcoded one if API doesn't support "my-store".
// Assuming storesApi.getMyStore() exists or we pick the first one owned by user.
// Let's assume storesApi.list({ ownerId: 'me' }) or similar.
// For now, I'll mock "storeId = 1" or fetch valid list.

import { AppSafeScreen } from '@shared/components/AppSafeScreen';

export default function MerchantProductsScreen() {
    const [storeId] = useState(1); // Hardcoded for MVP or ideally from User Profile
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['products', storeId],
        queryFn: () => storesApi.getProducts(storeId)
    });

    const products = data?.data || [];

    const toggleMutation = useMutation({
        mutationFn: ({ id, isAvailable }: { id: number, isAvailable: boolean }) =>
            // Mock API call to update product
            // storesApi.updateProduct(id, { isAvailable })
            new Promise(resolve => setTimeout(resolve, 500)),
        onSuccess: () => {
            // queryClient.invalidateQueries(...)
            // Since we mocked the update, strictly we should refetch.
        }
    });

    const renderProduct = ({ item }: { item: ProductDTO }) => (
        <AppCard style={styles.card}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text variant="titleMedium">{item.name}</Text>
                    <Text variant="bodySmall">${item.price}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Switch
                        value={item.isAvailable}
                        onValueChange={() => toggleMutation.mutate({ id: item.id, isAvailable: !item.isAvailable })}
                        color={COLORS.primary}
                    />
                    <Text variant="labelSmall">{item.isAvailable ? 'Active' : 'Hidden'}</Text>
                </View>
            </View>
        </AppCard>
    );

    if (isLoading) return <LoadingState />;

    return (
        <AppSafeScreen style={styles.container}>
            <AppHeader title="Menu Management" />
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProduct}
                contentContainerStyle={{ padding: 10 }}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => console.log('Add Product')}
            />
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    card: { marginVertical: 6, padding: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: COLORS.primary },
});
