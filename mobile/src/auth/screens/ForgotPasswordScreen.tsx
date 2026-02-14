import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography, PrimaryButton, AppInput } from '../../shared/ui';
import { AppSafeScreen } from '../../shared/components/AppSafeScreen';
import { colors, spacing } from '../../shared/theme';

export const ForgotPasswordScreen = () => {
    return (
        <AppSafeScreen style={styles.container}>
            <View>
                <Typography variant="h2" align="center" style={styles.title}>Forgot Password</Typography>
                <Typography variant="body" align="center" style={styles.subtitle}>
                    Enter your email to receive a recovery link.
                </Typography>
                <AppInput label="Email" placeholder="Enter your email" />
                <PrimaryButton title="Send Link" onPress={() => { }} style={styles.button} />
            </View>
        </AppSafeScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
        justifyContent: 'center',
    },
    title: {
        marginBottom: spacing.s,
    },
    subtitle: {
        marginBottom: spacing.l,
        color: colors.textSecondary,
    },
    button: {
        marginTop: spacing.l,
    },
});
