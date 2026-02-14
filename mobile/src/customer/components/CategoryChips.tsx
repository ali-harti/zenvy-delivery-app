import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';

export type Category = "All" | "Restaurants" | "Groceries" | "Pharmacy" | "Flowers";
const CATEGORIES: Category[] = ["All", "Restaurants", "Groceries", "Pharmacy", "Flowers"];

type Props = {
    active: Category;
    onSelect: (c: Category) => void;
};

export const CategoryChips = ({ active, onSelect }: Props) => {
    return (
        <View style={styles.chipsRow}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {CATEGORIES.map((c) => {
                    const isActive = c === active;
                    return (
                        <Pressable
                            key={c}
                            onPress={() => onSelect(c)}
                            style={({ pressed }) => [
                                styles.chip,
                                isActive ? styles.chipActive : styles.chipOutline,
                                pressed && styles.chipPressed // Micro-interaction
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                isActive ? styles.chipTextActive : styles.chipTextOutline
                            ]}>
                                {c}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    chipsRow: {
        marginTop: spacing.m,
        marginBottom: spacing.m
    },
    scrollContent: {
        paddingHorizontal: spacing.l,
        gap: 10,
    },
    chip: {
        height: 36, // Fixed height per specs
        paddingHorizontal: 16,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    chipPressed: {
        transform: [{ scale: 0.96 }],
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    chipOutline: {
        borderColor: colors.primary,
        backgroundColor: colors.white
    },
    chipText: {
        fontSize: 14,
        fontWeight: "700"
    },
    chipTextActive: {
        color: colors.white
    },
    chipTextOutline: {
        color: colors.primary
    },
});
