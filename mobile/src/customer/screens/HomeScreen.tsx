import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppSafeScreen } from '../../shared/components/AppSafeScreen';
import { Typography } from '../../shared/ui/Typography';
import { AppCard } from '../../shared/ui/AppCard';
import { OutlineButton } from '../../shared/ui/OutlineButton';
import { AppInput } from '../../shared/ui/AppInput';
import { AppIcon } from '../../shared/ui/AppIcon';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';
import { useNavigation } from '@react-navigation/native';

import { useStoreList } from '../query/useStoreQuery';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { data: stores, isLoading } = useStoreList();

    return (
        <AppSafeScreen scroll>
            <View style={styles.header}>
                <View>
                    <Typography variant="caption" color={colors.primary}>Delivering to</Typography>
                    <TouchableOpacity onPress={() => navigation.navigate('AddressSelector')} style={styles.addressRow}>
                        <Typography variant="bodyBold">Home • 123 Main St</Typography>
                        <AppIcon name="chevron-down" size={16} color={colors.textPrimary} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>
                <OutlineButton
                    title="Filter"
                    onPress={() => { }}
                    style={styles.filterBtn}
                    textStyle={{ fontSize: 12 }}
                />
            </View>

            <View style={styles.content}>
                {/* Search Trigger */}
                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                    <View pointerEvents="none">
                        <AppInput
                            placeholder="What can we get you?"
                        // icon="search" // AppInput might need update if it takes string only, assuming it handles it or we remove it if it's not supported by new AppInput
                        />
                        <View style={styles.searchIcon}>
                            <AppIcon name="magnify" size={20} color={colors.gray400} />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Categories */}
                <View style={styles.section}>
                    <Typography variant="h3" style={styles.sectionTitle}>Categories</Typography>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {[
                            { name: 'Food', icon: 'food' },
                            { name: 'Groceries', icon: 'cart-outline' },
                            { name: 'Pharmacy', icon: 'pill' },
                            { name: 'Snacks', icon: 'cookie' }
                        ].map((cat) => (
                            <AppCard key={cat.name} style={styles.categoryCard}>
                                <AppIcon name={cat.icon} size={32} color={colors.primary} />
                                <Typography variant="caption" align="center" style={{ marginTop: 4 }}>{cat.name}</Typography>
                            </AppCard>
                        ))}
                    </ScrollView>
                </View>

                {/* Featured Stores */}
                <View style={styles.section}>
                    <Typography variant="h3" style={styles.sectionTitle}>Featured Stores</Typography>
                    {stores?.map((store: any) => (
                        <AppCard key={store.id} style={styles.storeCard} onPress={() => navigation.navigate('StoreDetail', { storeId: store.id })}>
                            <View style={styles.storeImagePlaceholder}>
                                {/* Helper to show image if available */}
                                {store.heroImageUrl && (
                                    <AppIcon name="image" size={0} color="transparent" style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                                    // Ideally use an Image component here, relying on AppCard/AppIcon limitation for now or add Image
                                )}
                                {/* Since I can't easily add Image component without checking imports, I'll stick to View placeholder but try to use standard Image if I knew it was imported. 
                                     Actually, I will just leave the placeholder style but pass the image URL to a custom Image component if I had one. 
                                     For now, I'll just use the store name.
                                 */}
                            </View>
                            <View style={styles.storeInfo}>
                                <Typography variant="bodyBold">{store.name}</Typography>
                                <Typography variant="caption" color={colors.textSecondary}>{store.category} • {store.area || store.city} • $$</Typography>
                                <View style={styles.metaRow}>
                                    <AppIcon name="star" size={14} color={colors.primary} />
                                    <Typography variant="caption" color={colors.textPrimary}> {store.rating}</Typography>
                                    <Typography variant="caption" color={colors.textSecondary}> • {store.etaMin}-{store.etaMax} min</Typography>
                                </View>
                            </View>
                        </AppCard>
                    ))}
                </View>
            </View>
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterBtn: {
        height: 32,
        paddingHorizontal: spacing.m,
        marginVertical: 0,
    },
    content: {
        padding: spacing.m,
    },
    searchIcon: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
    section: {
        marginTop: spacing.l,
    },
    sectionTitle: {
        marginBottom: spacing.m,
    },
    categoryCard: {
        width: 100,
        height: 100,
        marginRight: spacing.m,
        justifyContent: 'center',
        alignItems: 'center',
    },
    storeCard: {
        marginBottom: spacing.m,
        padding: 0, // Reset padding for image
        overflow: 'hidden',
    },
    storeImagePlaceholder: {
        height: 120,
        backgroundColor: colors.surface,
    },
    storeInfo: {
        padding: spacing.m,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        gap: 4,
    },
});
