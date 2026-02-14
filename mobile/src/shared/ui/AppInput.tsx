import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { AppIcon, IconProvider } from './AppIcon';
import { colors, spacing, typography } from '../theme';

interface AppInputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: string;
    iconProvider?: IconProvider;
}

export const AppInput: React.FC<AppInputProps> = ({
    label,
    error,
    icon,
    iconProvider,
    style,
    ...props
}) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error ? styles.inputError : null]}>
                {icon && (
                    <AppIcon name={icon} provider={iconProvider} size={20} color={colors.textSecondary} style={styles.icon} />
                )}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={colors.textSecondary}
                    selectionColor={colors.primary}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: typography.small,
        color: colors.text,
        marginBottom: spacing.xs,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12, // Rounded corners
        borderWidth: 1,
        borderColor: colors.border,
        height: 50,
        paddingHorizontal: spacing.md,
    },
    inputError: {
        borderColor: colors.error,
    },
    icon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: typography.body,
        color: colors.text,
    },
    errorText: {
        fontSize: typography.small,
        color: colors.error,
        marginTop: spacing.xs,
    },
});
