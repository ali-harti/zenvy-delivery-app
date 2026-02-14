import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { AppSafeScreen } from '../../shared/components/AppSafeScreen';
import { Typography } from '../../shared/ui/Typography';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { AppInput } from '../../shared/ui/AppInput';
import { AppIcon } from '../../shared/ui/AppIcon';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';

export const RateOrderScreen = () => {
    const [rating, setRating] = useState(5);

    return (
        <AppSafeScreen>
            <View style={styles.container}>
                <Typography variant="h2" align="center" style={styles.title}>Rate Your Order</Typography>

                <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}>
                            <AppIcon
                                name="star"
                                size={40}
                                color={star <= rating ? colors.primary : colors.gray300}
                            />
                        </Pressable>
                    ))}
                </View>

                <AppInput placeholder="Leave feedback (optional)" />
                <PrimaryButton title="Submit" onPress={() => { }} style={styles.button} />
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
        marginBottom: spacing.l,
    },
    starRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.s,
        marginBottom: spacing.l,
    },
    button: {
        marginTop: spacing.l,
    },
});
