import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../theme';

interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'text' | 'ghost';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isTextOrGhost = variant === 'text' || variant === 'ghost';

    const handlePress = () => {
        if (!loading && !disabled) {
            onPress();
        }
    };

    const content = (
        <>
            {loading ? (
                <ActivityIndicator color={isSecondary ? colors.primary : '#FFFFFF'} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        isSecondary && styles.textSecondary,
                        isTextOrGhost && styles.textLink,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </>
    );

    if (isPrimary && !disabled) {
        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={[styles.container, style]}>
                <LinearGradient
                    colors={colors.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            style={[
                styles.container,
                isSecondary && styles.secondaryButton,
                disabled && styles.disabledButton,
                isTextOrGhost && styles.textButton,
                style,
            ]}
            disabled={disabled || loading}
        >
            {content}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 25, // Pill shape
        overflow: 'hidden',
        height: 50, // Generous touch target
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: spacing.sm,
    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    textButton: {
        height: 'auto',
        backgroundColor: 'transparent',
        paddingVertical: spacing.xs,
    },
    disabledButton: {
        backgroundColor: colors.border,
        borderColor: colors.border,
    },
    text: {
        fontSize: typography.body,
        fontWeight: typography.weightBold,
        color: '#FFFFFF',
    },
    textSecondary: {
        color: colors.primary,
    },
    textLink: {
        color: colors.primary,
        textDecorationLine: 'underline',
    }
});
