import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Standardize on useLocationStore
import { useLocationStore, Address } from "../store/location.store";

import { Text } from "../../ui/Text";

const PRIMARY_GREEN = "#10B981";
const DANGER_RED = "#EF4444";

const makeId = () => `addr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

export default function AddAddressScreen({ navigation, route }: any) {
    const insets = useSafeAreaInsets();
    // Now we have updateAddress properly typed in our mind (if not yet in TypeScript until file reload, but code will work)
    const { addAddress, removeAddress, updateAddress } = useLocationStore();

    const addressToEdit: Address | undefined = route.params?.addressToEdit;
    const isEditing = !!addressToEdit;

    const [label, setLabel] = useState<string>(addressToEdit?.label || "Home");
    const [fullAddress, setFullAddress] = useState(
        addressToEdit ? `${addressToEdit.street}, ${addressToEdit.city}` : "123 Rue Zerktouni, Casablanca"
    );

    // Support instructions
    const [instructions, setInstructions] = useState(addressToEdit?.instructions || "");

    const chips = ["Home", "Work", "Other"];

    const handleSave = () => {
        // Parse basic address from string (naive)
        const parts = fullAddress.split(',');
        const city = parts.length > 1 ? parts[parts.length - 1].trim() : "Casablanca";
        const street = parts[0].trim();

        const commonData = {
            street,
            city,
            zip: "00000",
            label,
            instructions: instructions.trim(),
        };

        if (isEditing && addressToEdit) {
            updateAddress({
                ...addressToEdit,
                ...commonData,
            });
        } else {
            addAddress({
                id: makeId(),
                isCurrent: false, // Don't auto-switch unless logic changes (store auto-switches on add currently)
                ...commonData,
            });
        }

        navigation.goBack();
    };

    const handleDelete = () => {
        if (!addressToEdit) return;
        Alert.alert("Delete Address", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    removeAddress(addressToEdit.id);
                    navigation.goBack();
                }
            }
        ]);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
                </Pressable>
                <Text weight="700" style={styles.headerTitle}>{isEditing ? "Edit Address" : "Add Address"}</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Address Display (Read Only / Button style) */}
                    <Text style={styles.labelTitle}>Address</Text>
                    <View style={styles.addressBox}>
                        <MaterialCommunityIcons name="map-marker-outline" size={24} color="#6B7280" style={{ marginTop: 2 }} />
                        <Text style={styles.addressText}>{fullAddress}</Text>
                    </View>

                    {/* Label Selection */}
                    <Text style={styles.labelTitle}>Label</Text>
                    <View style={styles.chipsRow}>
                        {chips.map((c) => {
                            const isSelected = c === label;
                            // Icon mapping
                            let iconName: any = "map-marker-outline";
                            if (c === "Home") iconName = "home-outline";
                            if (c === "Work") iconName = "briefcase-outline";

                            return (
                                <Pressable
                                    key={c}
                                    onPress={() => setLabel(c)}
                                    style={[
                                        styles.chip,
                                        isSelected ? styles.chipActive : styles.chipInactive
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name={iconName}
                                        size={18}
                                        color={isSelected ? "#FFFFFF" : "#6B7280"}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text weight="600" style={[styles.chipText, isSelected && { color: "#FFFFFF" }]}>
                                        {c}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Instructions */}
                    <Text style={styles.labelTitle}>Delivery Instructions</Text>
                    <TextInput
                        style={styles.inputArea}
                        placeholder="E.g., Ring the bell, leave at door..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        value={instructions}
                        onChangeText={setInstructions}
                    />

                </ScrollView>

                {/* Footer Buttons */}
                <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20 }]}>
                    <Pressable
                        style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
                        onPress={handleSave}
                    >
                        <Text weight="700" style={styles.primaryBtnText}>
                            {isEditing ? "Update Address" : "Save Address"}
                        </Text>
                    </Pressable>

                    {isEditing && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.deleteBtn,
                                pressed && { backgroundColor: "#FEF2F2" }
                            ]}
                            onPress={handleDelete}
                        >
                            <Text weight="700" style={styles.deleteBtnText}>Delete Address</Text>
                        </Pressable>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#F9FAFB",
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 20,
        color: "#111827",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    labelTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 8,
        marginTop: 16,
    },
    // Address Box
    addressBox: {
        flexDirection: 'row',
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        minHeight: 80,
        alignItems: 'flex-start',
    },
    addressText: {
        fontSize: 16,
        color: "#111827",
        marginLeft: 10,
        lineHeight: 24,
        flex: 1,
        fontWeight: "500",
    },
    // Chips
    chipsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderWidth: 1,
        backgroundColor: "#FFFFFF",
    },
    chipInactive: {
        borderColor: "#E5E7EB",
    },
    chipActive: {
        backgroundColor: PRIMARY_GREEN,
        borderColor: PRIMARY_GREEN,
    },
    chipText: {
        fontSize: 14,
        color: "#6B7280",
    },
    // Input
    inputArea: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 16,
        fontSize: 15,
        color: "#111827",
        minHeight: 80,
        textAlignVertical: 'top',
    },
    // Footer
    footer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: "#F9FAFB",
    },
    primaryBtn: {
        backgroundColor: PRIMARY_GREEN,
        borderRadius: 30, // Pill
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: PRIMARY_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
        marginBottom: 12,
    },
    primaryBtnText: {
        color: "#FFFFFF",
        fontSize: 18,
    },
    deleteBtn: {
        height: 56,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: DANGER_RED,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "transparent",
    },
    deleteBtnText: {
        color: DANGER_RED,
        fontSize: 18,
    },
});
