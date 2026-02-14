import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<Props> = ({ visible, onClose, onConfirm }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <Feather name="log-out" size={32} color={colors.danger} />
                    </View>
                    <Text style={styles.title}>Log Out</Text>
                    <Text style={styles.message}>
                        Are you sure you want to log out? You won't receive any delivery requests while offline.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmButtonText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    container: { backgroundColor: colors.cardBackground, borderRadius: 24, padding: 24, width: '100%', maxWidth: 340, alignItems: 'center' },
    iconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
    message: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
    buttonContainer: { flexDirection: 'row', gap: 12, width: '100%' },
    cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center' },
    cancelButtonText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    confirmButton: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: colors.danger, alignItems: 'center' },
    confirmButtonText: { fontSize: 16, fontWeight: '700', color: 'white' },
});

export default LogoutConfirmationModal;
