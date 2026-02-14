import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors, spacing } from '../theme';

interface AppCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({ children, style, onPress }) => {
    const Container = onPress ? Pressable : View;

    return (
        <Container
            style={({ pressed }: { pressed: boolean }) => [
                styles.card,
                style,
                pressed && onPress && { opacity: 0.8, transform: [{ scale: 0.98 }] }
            ]}
            onPress={onPress}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cardBg,
        borderRadius: 12,
        padding: spacing.md,
        marginVertical: spacing.sm,
        // Soft shadow
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android
        borderWidth: 1,
        borderColor: colors.surface,
    },
});
