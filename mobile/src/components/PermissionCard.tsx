import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface PermissionCardProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    iconBg: string;
    title: string;
    description: string;
    status: boolean;
    onEnable: () => void;
    index?: number;
}

export function PermissionCard({ icon, iconBg, title, description, status, onEnable, index = 0 }: PermissionCardProps) {
    const theme = useTheme();

    return (
        <View>
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.content}>
                    <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                        <MaterialCommunityIcons name={icon} size={24} color={theme.colors.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text variant="titleMedium" style={styles.title}>{title}</Text>
                        <Text variant="bodySmall" style={styles.description}>{description}</Text>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    {status ? (
                        <View style={styles.badgeSuccess}>
                            <MaterialCommunityIcons name="check" size={14} color="#0f5132" />
                            <Text style={styles.badgeText}>Enabled</Text>
                        </View>
                    ) : (
                        <TouchableRipple onPress={onEnable} style={[styles.button, { borderColor: theme.colors.primary }]}>
                            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Enable Access</Text>
                        </TouchableRipple>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        color: '#6c757d',
        lineHeight: 18,
    },
    actionRow: {
        marginTop: 16,
        alignItems: 'flex-end',
    },
    badgeSuccess: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d1f4e0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#0f5132',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 4,
    },
    button: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
});
