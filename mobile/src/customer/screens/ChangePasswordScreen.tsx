import React, { useState } from 'react';
import { StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from '../../ui/Text';
import { useAppTheme } from '../../shared/store/theme.store';
import { AppModal } from '../../shared/ui/AppModal';

import { colors as staticColors } from '../../shared/theme/colors';

const PRIMARY_GREEN = staticColors.primary;

// Reusing the Custom Input from EditProfile (Should ideally be a shared component now, but keeping local for speed and strict design match)
const PasswordInput = ({ label, value, onChangeText, placeholder, secureTextEntry = true, themeColors }: any) => (
    <View style={[styles.inputWrapper, { backgroundColor: themeColors.inputBg, borderColor: themeColors.border }]}>
        <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>{label}</Text>
        <TextInput
            style={[styles.inputField, { color: themeColors.text }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={themeColors.textSecondary}
            secureTextEntry={secureTextEntry}
        />
    </View>
);

export const ChangePasswordScreen = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ visible: boolean, type: 'success' | 'error', title: string, message: string } | null>(null);

    const handleUpdate = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setModalConfig({
                visible: true,
                type: 'error',
                title: 'Missing Fields',
                message: 'Please fill in all password fields.'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setModalConfig({
                visible: true,
                type: 'error',
                title: 'Mismatch',
                message: 'New passwords do not match.'
            });
            return;
        }

        if (newPassword.length < 6) {
            setModalConfig({
                visible: true,
                type: 'error',
                title: 'Weak Password',
                message: 'Password must be at least 6 characters long.'
            });
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setModalConfig({
                visible: true,
                type: 'success',
                title: 'Password Updated!',
                message: 'Your password has been changed successfully. Please login again with your new credentials.'
            });
        }, 1500);
    };

    const handleModalClose = () => {
        const wasSuccess = modalConfig?.type === 'success';
        setModalConfig(null);
        if (wasSuccess) {
            navigation.goBack();
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.bg }]}>
                <Pressable onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.cardBg }]} hitSlop={10}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </Pressable>
                <Text weight="700" style={[styles.headerTitle, { color: colors.text }]}>Change Password</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Text style={[styles.instructions, { color: colors.textSecondary }]}>
                        Your new password must be different from previous used passwords.
                    </Text>

                    <View style={styles.formContainer}>
                        <PasswordInput
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="••••••••"
                            themeColors={colors}
                        />
                        <View style={{ height: 16 }} />

                        <PasswordInput
                            label="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="••••••••"
                            themeColors={colors}
                        />
                        <View style={{ height: 16 }} />

                        <PasswordInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="••••••••"
                            themeColors={colors}
                        />
                    </View>

                </ScrollView>

                {/* Footer Action */}
                <View style={[styles.footer, { backgroundColor: colors.bg, paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20 }]}>
                    <Pressable
                        style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9 }]}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        <Text weight="700" style={styles.saveBtnText}>
                            {loading ? "Updating..." : "Update Password"}
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>

            {/* Global Styled Modal */}
            <AppModal
                visible={!!modalConfig}
                type={modalConfig?.type}
                title={modalConfig?.title || ''}
                message={modalConfig?.message || ''}
                onClose={handleModalClose}
                actionLabel={modalConfig?.type === 'success' ? 'Great' : 'Try Again'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
            },
            android: { elevation: 2 },
        }),
    },
    headerTitle: {
        fontSize: 18,
    },
    scrollContent: {
        paddingTop: 20,
        paddingHorizontal: 24,
    },
    instructions: {
        fontSize: 14,
        marginBottom: 32,
        lineHeight: 20,
    },
    formContainer: {
        marginBottom: 40,
    },
    inputWrapper: {
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
        height: 64,
        justifyContent: 'center',
    },
    inputLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    inputField: {
        fontSize: 16,
        fontWeight: "500",
        padding: 0,
    },
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
});
