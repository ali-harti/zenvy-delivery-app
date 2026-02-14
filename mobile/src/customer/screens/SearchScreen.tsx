import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography, AppInput } from '../../shared/ui';
import { colors, spacing } from '../../shared/theme';
import { AppSafeScreen } from '../../shared/components/AppSafeScreen';

export const SearchScreen = () => {
    return (
        <AppSafeScreen>
            <View style={styles.container}>
                <Typography variant="h2" style={styles.title}>Search</Typography>
                <AppInput placeholder="Search stores or products..." icon="search" />
                <View style={styles.results}>
                    <Typography variant="body" color={colors.textSecondary} align="center">
                        Recent searches...
                    </Typography>
                </View>
            </View>
        </AppSafeScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
    },
    title: {
        marginBottom: spacing.m,
    },
    results: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
