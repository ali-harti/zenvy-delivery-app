import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../theme/colors';

interface LoadingStateProps {
    size?: 'small' | 'large';
    color?: string;
    style?: ViewStyle;
}

export const LoadingState = ({ size = 'large', color = COLORS.primary, style }: LoadingStateProps) => (
    <View style={[styles.container, style]}>
        <ActivityIndicator size={size} color={color} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
