import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface AppModalProps {
    visible: boolean;
    type?: 'success' | 'error' | 'confirm' | 'info';
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    onClose?: () => void; // Optional generic close
}

export const AppModal: React.FC<AppModalProps> = ({
    visible,
    type = 'success',
    title,
    message,
    actionLabel = "Okay",
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    onClose
}) => {
    // Icon Configuration
    const getIconConfig = () => {
        switch (type) {
            case 'error': return { name: 'alert-circle', color: colors.danger, bg: "#FEF2F2", bgDark: "#7F1D1D" }; // Red-ish
            case 'confirm': return { name: 'help-circle', color: colors.info, bg: "#EFF6FF", bgDark: "#1E3A8A" }; // Blue-ish
            case 'info': return { name: 'information', color: colors.info, bg: "#EFF6FF", bgDark: "#1E3A8A" }; // Blue-ish
            default: return { name: 'check', color: colors.success, bg: "#ECFDF5", bgDark: "#064E3B" }; // Green-ish success
        }
    };

    const iconConfig = getIconConfig();

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    {/* Icon Circle */}
                    <View style={styles.iconOuter}>
                        <View style={[styles.iconInner, { backgroundColor: iconConfig.bg }]}>
                            <MaterialCommunityIcons
                                name={iconConfig.name as any}
                                size={32}
                                color={iconConfig.color}
                            />
                        </View>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        {secondaryActionLabel && (
                            <Pressable
                                style={[styles.btn, styles.secondaryBtn]}
                                onPress={onSecondaryAction}
                            >
                                <Text style={styles.secondaryBtnText}>{secondaryActionLabel}</Text>
                            </Pressable>
                        )}

                        <Pressable
                            style={[styles.btn, styles.primaryBtn, { backgroundColor: iconConfig.color }]}
                            onPress={onAction || onClose}
                        >
                            <Text style={styles.primaryBtnText}>{actionLabel}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    card: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        maxWidth: 400,
        borderRadius: 24,
        padding: 32,
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 5 },
        }),
    },
    iconOuter: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        textAlign: "center",
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 22,
    },
    actionRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        gap: 12,
    },
    btn: {
        flex: 1,
        height: 50,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    primaryBtn: {
        // bg color dynamic via style prop
    },
    primaryBtnText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    secondaryBtn: {
        backgroundColor: "#F3F4F6",
    },
    secondaryBtnText: {
        color: "#374151",
        fontSize: 16,
        fontWeight: "600",
    },
});
