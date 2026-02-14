import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, Keyboard } from 'react-native';
import { AppSafeScreen } from '../../shared/components/AppSafeScreen';
import { AppIcon } from '../../shared/ui/AppIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';
import { radius } from '../../shared/theme/radius';

// Mock data integration later
const SUGGESTIONS = ["Burger", "Pizza", "Sushi", "Flowers", "Pharmacy"];

export const CustomerSearchScreen = ({ navigation }: any) => {
    const [query, setQuery] = useState("");
    const [recent, setRecent] = useState<string[]>([]);

    useEffect(() => {
        loadRecent();
    }, []);

    const loadRecent = async () => {
        try {
            const saved = await AsyncStorage.getItem('zenvy_recent_search');
            if (saved) setRecent(JSON.parse(saved));
        } catch (e) { console.warn("Failed to load recents"); }
    };

    const saveRecent = async (term: string) => {
        if (!term.trim()) return;
        const newRecent = [term, ...recent.filter(r => r !== term)].slice(0, 5);
        setRecent(newRecent);
        await AsyncStorage.setItem('zenvy_recent_search', JSON.stringify(newRecent));
    };

    const clearRecent = async () => {
        setRecent([]);
        await AsyncStorage.removeItem('zenvy_recent_search');
    };

    const handleSearch = (term: string) => {
        setQuery(term);
        saveRecent(term);
        // Navigate or filter results
        // For now just log
        console.log("Searching for:", term);
    };

    return (
        <AppSafeScreen style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <AppIcon name="magnify" size={20} color={colors.gray500} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search stores or items"
                        placeholderTextColor={colors.gray400}
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                        returnKeyType="search"
                        onSubmitEditing={() => handleSearch(query)}
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery("")} hitSlop={8}>
                            <AppIcon name="close-circle" size={18} color={colors.gray400} />
                        </Pressable>
                    )}
                </View>
                <Pressable onPress={() => navigation.goBack()} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                {query.length === 0 ? (
                    <>
                        {recent.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                                    <Pressable onPress={clearRecent}>
                                        <Text style={styles.clearText}>Clear</Text>
                                    </Pressable>
                                </View>
                                <View style={styles.chips}>
                                    {recent.map((term, i) => (
                                        <Pressable key={i} style={styles.recentChip} onPress={() => handleSearch(term)}>
                                            <AppIcon name="history" size={16} color={colors.gray500} />
                                            <Text style={styles.recentText}>{term}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Suggestions</Text>
                            {SUGGESTIONS.map((s, i) => (
                                <Pressable key={i} style={styles.suggestionRow} onPress={() => handleSearch(s)}>
                                    <AppIcon name="trending-up" size={18} color={colors.primary} />
                                    <Text style={styles.suggestionText}>{s}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.results}>
                        <Text style={styles.emptyText}>Showing results for "{query}"</Text>
                        {/* List of results would go here */}
                    </View>
                )}
            </View>
        </AppSafeScreen>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        gap: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    searchBar: {
        flex: 1,
        height: 44,
        backgroundColor: colors.surface,
        borderRadius: radius.m,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        gap: 8,
    },
    input: { flex: 1, fontSize: 16, color: colors.textPrimary, height: '100%' },
    cancelBtn: {},
    cancelText: { color: colors.primary, fontSize: 16, fontWeight: '600' },

    content: { flex: 1, padding: spacing.m },
    section: { marginBottom: spacing.xl },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    clearText: { color: colors.error, fontSize: 14, fontWeight: '600' },

    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    recentChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.gray100,
        borderRadius: radius.sm,
    },
    recentText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },

    suggestionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    suggestionText: { fontSize: 16, color: colors.textPrimary },

    results: { marginTop: spacing.m },
    emptyText: { color: colors.gray500, fontSize: 16 },
});
