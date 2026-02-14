import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '@components/ui/AppHeader';
import { EmptyState } from '@components/ui/EmptyState';
import { COLORS } from '@theme/colors';

import { AppSafeScreen } from '@shared/components/AppSafeScreen';

export default function EarningsScreen() {
    return (
        <AppSafeScreen style={styles.container}>
            <AppHeader title="Earnings" />
            <EmptyState title="Total: $0.00" message="Complete deliveries to see earnings here." />
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
});
