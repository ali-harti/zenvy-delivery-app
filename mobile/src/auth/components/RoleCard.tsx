import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

type Role = "customer" | "courier" | "merchant";

const roleMeta: Record<
    Role,
    { label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
    customer: { label: "Customer", icon: "shopping-outline" },
    courier: { label: "Courier", icon: "moped" }, // 'moped' for delivery scooter
    merchant: { label: "Merchant", icon: "storefront-outline" },
};

export function RoleCard({
    role,
    selected,
    onPress,
}: {
    role: Role;
    selected: boolean;
    onPress: () => void;
}) {
    const meta = roleMeta[role];

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                selected ? styles.cardSelected : styles.cardUnselected,
                pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Select role ${meta.label}`}
        >
            <View style={styles.iconWrap}>
                <MaterialCommunityIcons
                    name={meta.icon}
                    size={42}
                    color={selected ? colors.primary : colors.mutedText}
                />
            </View>

            <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
                {meta.label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 140,
        borderRadius: radius.l,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.m,
    },
    cardSelected: {
        borderColor: colors.primary,
        backgroundColor: "rgba(20, 184, 138, 0.10)",
    },
    cardUnselected: {
        borderColor: colors.softBorder,
        backgroundColor: "rgba(0,0,0,0.02)",
    },
    pressed: {
        transform: [{ scale: 0.985 }],
        opacity: 0.95,
    },
    iconWrap: {
        marginBottom: spacing.s,
    },
    label: {
        fontSize: 16, // Adjusted slightly for fit
        fontWeight: "700",
        textAlign: "center",
    },
    labelSelected: {
        color: colors.primary,
    },
    labelUnselected: {
        color: colors.mutedText,
    },
});
