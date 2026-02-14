import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLivreur } from '../../../context/LivreurContext';
import { Timeframe } from '../../../types/livreur';
import { colors } from '../../../theme/colors';

const options: { label: string; value: Timeframe }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
];

const TimeframeSelector: React.FC = () => {
    const { selectedTimeframe, setTimeframe } = useLivreur();

    return (
        <View style={styles.container}>
            {options.map((option) => {
                const isSelected = selectedTimeframe === option.value;
                return (
                    <TouchableOpacity
                        key={option.value}
                        style={[styles.button, isSelected && styles.selectedButton]}
                        onPress={() => setTimeframe(option.value)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.text, isSelected && styles.selectedText]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.border,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    selectedButton: {
        backgroundColor: colors.primary,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    selectedText: {
        color: colors.cardBackground,
    },
});

export default TimeframeSelector;
