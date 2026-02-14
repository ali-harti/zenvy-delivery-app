import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { colors } from "../shared/theme/colors";
import { spacing } from "../shared/theme/spacing";
import { typography } from "../shared/theme/typography";
import { radius } from "../shared/theme/radius";

type Props = {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    value: boolean;
    onToggle: (val: boolean) => void;
};

export function ToggleRow({ icon, title, subtitle, value, onToggle }: Props) {
    return (
        <View style={styles.row}>
            <View style={styles.left}>
                <View style={styles.iconBubble}>{icon}</View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{title}</Text>
                    {!!subtitle && <Text style={styles.sub}>{subtitle}</Text>}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
            />
        </View>
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
    left: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1, paddingRight: spacing.md },
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
