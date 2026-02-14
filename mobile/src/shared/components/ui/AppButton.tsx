import React from 'react';
import { Button } from 'react-native-paper';
import { COLORS } from '../../theme/colors';
import { ViewStyle, StyleProp } from 'react-native';

interface AppButtonProps {
    mode?: 'text' | 'outlined' | 'contained' | 'elevated';
    onPress: () => void;
    children: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    color?: string;
}

export const AppButton = ({
    mode = 'contained',
    onPress,
    children,
    loading = false,
    disabled = false,
    style,
    color
}: AppButtonProps) => {
    const buttonColor = color || (mode === 'contained' ? COLORS.primary : undefined);
    const textColor = mode === 'contained' ? COLORS.white : COLORS.primary;

    return (
        <Button
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled || loading}
            buttonColor={buttonColor}
            textColor={textColor}
            style={style}
            labelStyle={{ fontWeight: '600' }}
        >
            {children}
        </Button>
    );
};
