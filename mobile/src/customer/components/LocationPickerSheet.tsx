import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocationStore, Address } from '../store/location.store';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function LocationPickerSheet({ visible, onClose }: Props) {
    const { savedAddresses, currentAddress, setCurrentAddress } = useLocationStore();

    const handleSelect = (addr: Address) => {
        setCurrentAddress(addr);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Location</Text>
                        <Pressable onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
                        </Pressable>
                    </View>

                    <FlatList
                        data={savedAddresses}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: spacing.m, gap: spacing.m }}
                        renderItem={({ item }) => {
                            const isSelected = currentAddress?.id === item.id;
                            return (
                                <Pressable
                                    onPress={() => handleSelect(item)}
                                    style={[styles.item, isSelected && styles.itemSelected]}
                                >
                                    <View style={styles.iconWrap}>
                                        <MaterialCommunityIcons
                                            name={item.label === "Home" ? "home" : "map-marker"}
                                            size={24}
                                            color={isSelected ? colors.primary : colors.gray500}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.label}>{item.label}</Text>
                                        <Text style={styles.address}>{item.street}, {item.city}</Text>
                                    </View>
                                    {isSelected && (
                                        <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                                    )}
                                </Pressable>
                            );
                        }}
                        ListFooterComponent={
                            <Pressable style={styles.addButton} onPress={() => console.log("Add new address")}>
                                <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
                                <Text style={styles.addText}>Add New Address</Text>
                            </Pressable>
                        }
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        maxHeight: '60%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.l,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.m,
    },
    itemSelected: {
        borderColor: colors.primary,
        backgroundColor: '#F0FDF4', // Light green
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    address: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.m,
        gap: 8,
        marginTop: spacing.s,
    },
    addText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
});
