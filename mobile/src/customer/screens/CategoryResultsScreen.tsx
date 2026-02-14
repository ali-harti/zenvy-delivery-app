import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppSafeScreen } from '../../shared/components/AppSafeScreen';
import { Typography } from '../../shared/ui/Typography';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';

export const CategoryResultsScreen = () => {
    return (
        <AppSafeScreen>
            <View style={styles.container}>
                <Typography variant="h2" align="center" style={styles.title}>Category Results</Typography>
                <Typography variant="body" align="center" color={colors.textSecondary}>
                    Stores for category will appear here
                </Typography>
            </View>
        </AppSafeScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginBottom: spacing.m,
    },
});
