import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle, SafeAreaView } from 'react-native';
import { colors, spacing } from '../theme';

interface ScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
    backgroundColor?: string;
    unsafe?: boolean; // If true, ignores SafeAreaView (for custom headers etc)
}

import { AppSafeScreen } from '../components/AppSafeScreen';

export const Screen: React.FC<ScreenProps> = ({
    children,
    style,
    backgroundColor = colors.background,
    unsafe = false,
}) => {
    if (unsafe) {
        return (
            <View style={[styles.container, { backgroundColor }, style]}>
                <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
                <View style={styles.content}>{children}</View>
            </View>
        );
    }
    return (
        <AppSafeScreen style={[styles.container, style]} backgroundColor={backgroundColor}>
            <View style={styles.content}>{children}</View>
        </AppSafeScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
