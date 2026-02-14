import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface DetailItem {
    label: string;
    value: string;
    status?: 'verified' | 'pending' | 'action_needed';
}

interface Props {
    visible: boolean;
    onClose: () => void;
    title: string;
    items: DetailItem[];
    actionLabel?: string;
    onAction?: () => void;
}

const DetailModal: React.FC<Props> = ({ visible, onClose, title, items, actionLabel, onAction }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {items.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <View>
                                    <Text style={styles.itemLabel}>{item.label}</Text>
                                    <Text style={styles.itemValue}>{item.value}</Text>
                                </View>
                                {item.status && (
                                    <View style={[styles.badge, item.status === 'verified' ? styles.badgeSuccess : styles.badgeWarning]}>
                                        <Text style={styles.badgeText}>{item.status === 'verified' ? 'Verified' : 'Pending'}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>

                    {actionLabel && onAction && (
                        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
                            <Text style={styles.actionButtonText}>{actionLabel}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    container: { backgroundColor: colors.cardBackground, borderRadius: 20, padding: 20, maxHeight: '80%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
    content: { marginBottom: 20 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    itemLabel: { fontSize: 14, color: colors.textSecondary },
    itemValue: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginTop: 4 },
    badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
    badgeSuccess: { backgroundColor: '#d1f4e0' },
    badgeWarning: { backgroundColor: '#fff3cd' },
    badgeText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
    actionButton: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
    actionButtonText: { fontSize: 16, fontWeight: '700', color: 'white' },
});

export default DetailModal;
