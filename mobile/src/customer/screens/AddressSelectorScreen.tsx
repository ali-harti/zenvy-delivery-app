import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, Pressable, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from '../../ui/Text';
import { useLocationStore, Address } from '../store/location.store';
import { colors } from '../../shared/theme/colors';

const PRIMARY_GREEN = "#10B981";
const BG_COLOR = "#F9FAFB";

export const AddressSelectorScreen = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { savedAddresses, currentAddress, setCurrentAddress, removeAddress } = useLocationStore();

    // Ensure we have a selection if possible
    useEffect(() => {
        if (!currentAddress && savedAddresses.length > 0) {
            setCurrentAddress(savedAddresses[0]);
        }
    }, [savedAddresses, currentAddress]);

    const handleSelect = (address: Address) => {
        setCurrentAddress(address);
    };

    const handleEdit = (address: Address) => {
        // Navigate to AddAddress with params for editing
        navigation.navigate('AddAddress', { addressToEdit: address });
    };

    const renderItem = ({ item }: { item: Address }) => {
        // Strict matching by ID
        const isSelected = currentAddress?.id === item.id;

        // Icon logic based on label
        let iconName: any = "map-marker-outline";
        if (item.label === "Home") iconName = "home-outline";
        if (item.label === "Work") iconName = "briefcase-outline";
        if (item.label === "Other") iconName = "map-marker-outline";

        return (
            <Pressable
                style={[
                    styles.card,
                    isSelected ? styles.selectedCard : styles.unselectedCard
                ]}
                onPress={() => handleSelect(item)}
            >
                {/* Left Icon (Optional, mockup shows one) */}
                <View style={[styles.typeIconContainer, isSelected && { backgroundColor: "#ECFDF5" }]}>
                    <MaterialCommunityIcons
                        name={iconName}
                        size={20}
                        color={isSelected ? PRIMARY_GREEN : "#111827"}
                    />
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    <Text weight="700" style={styles.addressLabel}>
                        {item.label}
                    </Text>
                    <Text style={styles.addressText} numberOfLines={2}>
                        {item.street}, {item.city}
                    </Text>
                </View>

                {/* Right Actions */}
                <View style={styles.rightActions}>
                    {isSelected && (
                        <View style={styles.checkIcon}>
                            <MaterialCommunityIcons name="check-circle" size={24} color={PRIMARY_GREEN} />
                        </View>
                    )}

                    <Pressable
                        style={({ pressed }) => [styles.editBtn, pressed && { backgroundColor: "#F3F4F6" }]}
                        onPress={() => handleEdit(item)}
                        hitSlop={10}
                    >
                        <MaterialCommunityIcons name="pencil-outline" size={20} color="#9CA3AF" />
                    </Pressable>
                </View>
            </Pressable>
        );
    };

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <MaterialCommunityIcons name="map-marker-radius" size={64} color={PRIMARY_GREEN} />
            </View>
            <Text weight="700" style={styles.emptyTitle}>No addresses yet</Text>
            <Text style={styles.emptySub}>Add your delivery addresses to get started.</Text>

            <Pressable
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('AddAddress')}
            >
                <Text weight="700" style={styles.emptyBtnText}>Add Address</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
                </Pressable>
                <Text weight="700" style={styles.headerTitle}>Addresses</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <FlatList
                    data={savedAddresses}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={[styles.list, savedAddresses.length === 0 && styles.listEmpty]}
                    ListEmptyComponent={EmptyState}
                />
            </View>

            {/* Footer Floating Button */}
            {savedAddresses.length > 0 && (
                <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20 }]}>
                    <Pressable
                        style={styles.footerBtn}
                        onPress={() => navigation.navigate('AddAddress')}
                    >
                        <Text weight="700" style={styles.footerBtnText}>Add new address</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF", // White bg
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 24,
        color: "#111827",
    },
    content: {
        flex: 1,
    },
    list: {
        padding: 20,
    },
    listEmpty: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    // Card Styles
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 2 },
            },
            android: { elevation: 2 },
        }),
    },
    unselectedCard: {
        borderColor: "#E5E7EB",
    },
    selectedCard: {
        borderColor: PRIMARY_GREEN,
        backgroundColor: "#FFFFFF",
    },
    typeIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F3F4F6",
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
        paddingRight: 10,
    },
    addressLabel: {
        fontSize: 16,
        color: "#111827",
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkIcon: {
        marginRight: 4,
    },
    editBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F9FAFB", // Subtle bg for pencil
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Empty State
    emptyContainer: {
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        marginBottom: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        color: "#111827",
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySub: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    emptyBtn: {
        backgroundColor: PRIMARY_GREEN,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    emptyBtnText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    // Footer
    footer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: "#FFFFFF",
    },
    footerBtn: {
        backgroundColor: PRIMARY_GREEN,
        borderRadius: 30, // Pill shape
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: PRIMARY_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    footerBtnText: {
        color: "#FFFFFF",
        fontSize: 18,
    }
});
