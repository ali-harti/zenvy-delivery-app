import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { COLORS } from '../../theme/colors';

interface AppCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

export const AppCard = ({ children, style, onPress, elevation = 1 }: AppCardProps) => {
    const Content = (
        <Surface style={[styles.card, style]} elevation={elevation}>
            {children}
        </Surface>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                {Content}
            </TouchableOpacity>
        );
    }

    return Content;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 16,
    },
});
