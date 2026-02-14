import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS } from '../../theme/colors';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
    style?: ViewStyle;
}

export const ErrorState = ({ message = 'Something went wrong', onRetry, style }: ErrorStateProps) => (
    <View style={[styles.container, style]}>
        <Text style={styles.text}>{message}</Text>
        {onRetry && (
            <Button mode="contained" onPress={onRetry} style={styles.button} buttonColor={COLORS.primary}>
                Try Again
            </Button>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        color: COLORS.error,
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        marginTop: 8,
    },
});
