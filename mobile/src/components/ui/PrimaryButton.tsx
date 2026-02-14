import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export function PrimaryButton({
    label,
    onPress,
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon
}: PrimaryButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
                disabled && styles.disabled,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={colors.white} />
            ) : (
                <>
                    <Text style={[styles.text, textStyle]}>{label}</Text>
                    {icon}
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 58,
        backgroundColor: colors.primary,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.s8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    pressed: {
        backgroundColor: colors.primaryPress,
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        backgroundColor: "#E5E7EB", // gray200
        shadowOpacity: 0,
        elevation: 0,
    },
    text: {
        ...typography.button,
    },
});
