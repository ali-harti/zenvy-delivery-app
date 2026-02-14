import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../shared/theme/colors";
import { spacing } from "../shared/theme/spacing";
import { typography } from "../shared/theme/typography";

type Props = {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
};

export function ListRow({ icon, title, subtitle, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}>
            <View style={styles.left}>
                <View style={styles.iconBubble}>{icon}</View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{title}</Text>
                    {!!subtitle && <Text style={styles.sub}>{subtitle}</Text>}
                </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" color={colors.mutedText} size={20} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },
    left: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
    iconBubble: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
    },
    title: { fontSize: typography.body, fontWeight: "700", color: colors.text },
    sub: { marginTop: 2, fontSize: typography.small, color: colors.mutedText },
});
