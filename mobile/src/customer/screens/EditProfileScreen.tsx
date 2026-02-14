import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from '../../ui/Text';
import { useAuthStore } from '../../auth/store/auth.store';
import { colors } from '../../shared/theme/colors';

const PRIMARY_GREEN = "#10B981";
const BG_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";
const LABEL_COLOR = "#9CA3AF";

// Custom Input Component
const ProfileInput = ({ label, value, onChangeText, editable = true, keyboardType = 'default' }: any) => (
    <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={[styles.inputField, !editable && { color: "#6B7280" }]}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            keyboardType={keyboardType}
        />
    </View>
);

export const EditProfileScreen = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { user, updateProfile } = useAuthStore();

    const [fullName, setFullName] = useState(`${user?.firstName || ''} ${user?.lastName || ''}`.trim());
    const [phone, setPhone] = useState(user?.phone || '');
    const [email] = useState(user?.email || '');

    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const parts = fullName.trim().split(' ');
            const newFirst = parts[0] || '';
            const newLast = parts.slice(1).join(' ') || '';

            await updateProfile({
                firstName: newFirst,
                lastName: newLast,
                phone
            });

            setLoading(false);
            // Show Premium Success Modal instead of Alert
            setShowSuccess(true);
        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Failed to update profile");
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
                </Pressable>
                <Text weight="700" style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarPlaceholder}>
                                <MaterialCommunityIcons name="account" size={64} color="#9CA3AF" />
                            </View>
                            <View style={styles.cameraBadge}>
                                <MaterialCommunityIcons name="camera" size={14} color="#FFFFFF" />
                            </View>
                        </View>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </View>

                    {/* Inputs */}
                    <View style={styles.formContainer}>
                        <ProfileInput
                            label="Full Name"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        <View style={{ height: 16 }} />

                        <ProfileInput
                            label="Email"
                            value={email}
                            editable={false}
                        />
                        <View style={{ height: 16 }} />

                        <ProfileInput
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                </ScrollView>

                {/* Footer Action */}
                <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20 }]}>
                    <Pressable
                        style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9 }]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text weight="700" style={styles.saveBtnText}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>

            {/* Premium Success Modal */}
            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.successCard}>
                        <View style={styles.successIconOuter}>
                            <View style={styles.successIconInner}>
                                <MaterialCommunityIcons name="check" size={32} color="#fff" />
                            </View>
                        </View>

                        <Text weight="800" style={styles.successTitle}>Profile Updated!</Text>
                        <Text style={styles.successSub}>
                            Your profile changes have been saved successfully.
                        </Text>

                        <Pressable onPress={handleCloseSuccess} style={styles.successModalBtn}>
                            <Text weight="700" style={styles.successBtnTextAttr}>Awesome</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 20,
        color: TEXT_COLOR,
    },
    scrollContent: {
        paddingTop: 20,
        paddingHorizontal: 24,
    },
    // Avatar
    avatarSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#E5E7EB",
        justifyContent: "center",
        alignItems: "center",
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: PRIMARY_GREEN,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    changePhotoText: {
        fontSize: 16,
        color: PRIMARY_GREEN,
        fontWeight: "600",
    },
    // Form
    formContainer: {
        marginBottom: 40,
    },
    inputWrapper: {
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 16,
        paddingVertical: 10,
        height: 64,
        justifyContent: 'center',
    },
    inputLabel: {
        fontSize: 12,
        color: LABEL_COLOR,
        marginBottom: 2,
    },
    inputField: {
        fontSize: 16,
        color: TEXT_COLOR,
        fontWeight: "500",
        padding: 0,
    },
    // Footer
    footer: {
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    saveBtn: {
        backgroundColor: PRIMARY_GREEN,
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: PRIMARY_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    saveBtnText: {
        color: "#FFFFFF",
        fontSize: 18,
    },
    // Modal Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    successCard: {
        backgroundColor: "#fff",
        width: "100%",
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
    successIconOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#ECFDF5", // Light Green
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    successIconInner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: PRIMARY_GREEN,
        justifyContent: "center",
        alignItems: "center",
    },
    successTitle: {
        fontSize: 22,
        color: "#111827",
        textAlign: "center",
        marginBottom: 8,
    },
    successSub: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 22,
    },
    successModalBtn: {
        backgroundColor: PRIMARY_GREEN,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: "100%",
        alignItems: "center",
    },
    successBtnTextAttr: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    }
});
