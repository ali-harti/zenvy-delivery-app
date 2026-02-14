import React from "react";
import { View, StyleSheet, Pressable, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    selected?: boolean;
    style?: ViewStyle;
}

export function Card({ children, onPress, selected = false, style }: CardProps) {
    const Container = (onPress ? Pressable : View) as any;

    return (
        <Container
            onPress={onPress}
            style={({ pressed }: { pressed: boolean }) => [
                styles.card,
                selected && styles.selected,
                onPress && pressed && styles.pressed,
                style,
            ]}
        >
            {children}
        </Container>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.s16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 2,
        marginBottom: spacing.s12,
    },
    selected: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    pressed: {
        opacity: 0.96,
        transform: [{ scale: 0.995 }],
    },
});
