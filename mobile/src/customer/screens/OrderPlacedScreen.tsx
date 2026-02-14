import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Typography } from '../../shared/ui';
import { AppSafeScreen } from '../../shared/components/AppSafeScreen';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { OutlineButton } from '../../shared/ui/OutlineButton';
import { AppIcon } from '../../shared/ui/AppIcon';
import { colors, spacing } from '../../shared/theme';
import { useNavigation } from '@react-navigation/native';

export const OrderPlacedScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <AppSafeScreen>
            <View style={styles.container}>
                <View style={styles.iconCircle}>
                    <AppIcon name="check" size={64} color={colors.white} />
                </View>

                <Typography variant="h1" align="center" style={styles.title}>
                    Order Placed!
                </Typography>

                <Typography variant="body" align="center" style={styles.message} color={colors.textSecondary}>
                    Your order has been successfully placed and is being processed by the store.
                </Typography>

                <View style={styles.actions}>
                    <PrimaryButton
                        title="Track Order"
                        onPress={() => navigation.navigate('Orders')} // Navigate to Orders Tab
                        style={styles.button}
                    />
                    <OutlineButton
                        title="Back to Home"
                        onPress={() => navigation.navigate('CustomerHome')}
                        style={styles.button}
                    />
                </View>
            </View>
        </AppSafeScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.l,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        marginBottom: spacing.m,
        fontSize: 28,
    },
    message: {
        marginBottom: spacing.xl * 2,
        paddingHorizontal: spacing.l,
        lineHeight: 22,
    },
    actions: {
        width: '100%',
        gap: spacing.m,
    },
    button: {
        width: '100%',
    },
});
