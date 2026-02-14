import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View, Switch, Pressable, Platform, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../shared/store/theme.store";
import { AppModal } from "../../shared/ui/AppModal";

// --- Components (Locally scoped to inherit theme props conveniently or passed down) ---

const SectionTitle = ({ title, color }: { title: string, color: string }) => (
    <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
);

const ToggleRow = ({ icon, title, subtitle, value, onValueChange, isLast, colors }: any) => (
    <View style={[styles.row, isLast && styles.rowLast, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
        <View style={styles.iconBox}>
            <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.rowContent}>
            <View style={styles.textContainer}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
                {subtitle && <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
            </View>
            <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={"#FFFFFF"}
                ios_backgroundColor={colors.border}
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    </View>
);

const NavRow = ({ icon, title, subtitle, onPress, isLast, isDanger, colors }: any) => (
    <Pressable
        style={({ pressed }) => [
            styles.row,
            isLast && styles.rowLast,
            { backgroundColor: colors.cardBg, borderBottomColor: colors.border },
            pressed && { backgroundColor: colors.bg } // Slight visual feedback
        ]}
        onPress={onPress}
    >
        <View style={styles.iconBox}>
            <MaterialCommunityIcons
                name={icon}
                size={24}
                color={isDanger ? colors.danger : colors.primary}
            />
        </View>
        <View style={styles.rowContent}>
            <View style={styles.textContainer}>
                <Text style={[styles.rowTitle, { color: isDanger ? colors.danger : colors.text }]}>{title}</Text>
                {subtitle && <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </View>
    </Pressable>
);

export function SettingsScreen() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { colors, mode, toggleTheme } = useAppTheme();

    // Preferences State
    const [pushEnabled, setPushEnabled] = useState(true);
    const [promoEnabled, setPromoEnabled] = useState(false);

    // Language State (Mock for now, easy to extend)
    const [language, setLanguage] = useState('English');
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{ visible: boolean, type: 'success' | 'error' | 'confirm' | 'info', title: string, message: string, onAction?: () => void, actionLabel?: string } | null>(null);

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        setShowLanguageModal(false);
        // Here you would trigger actual i18n change
    };

    const handleDeleteAccount = () => {
        setModalConfig({
            visible: true,
            type: 'confirm',
            title: 'Delete Account?',
            message: 'Are you sure you want to delete your account? This action cannot be undone.',
            actionLabel: 'Delete',
            onAction: () => {
                setModalConfig({
                    visible: true,
                    type: 'success',
                    title: 'Account Deleted',
                    message: 'Your account has been permanently scheduled for deletion.',
                    onAction: () => setModalConfig(null)
                });
            }
        });
    };

    const showLegalModal = (title: string) => {
        setModalConfig({
            visible: true,
            type: 'info',
            title: title,
            message: 'This is a placeholder for the legal document content. In a real app, this would open a WebView or a detailed text screen.',
            actionLabel: 'Got it',
            onAction: () => setModalConfig(null)
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.bg }]}>
                <Pressable onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.cardBg }]} hitSlop={10}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. Preferences */}
                <View style={styles.sectionContainer}>
                    <SectionTitle title="Preferences" color={colors.text} />
                    <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                        <ToggleRow
                            icon="bell-outline"
                            title="Push notifications"
                            subtitle="Order updates"
                            value={pushEnabled}
                            onValueChange={setPushEnabled}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <ToggleRow
                            icon="bullhorn-outline"
                            title="Promotions"
                            subtitle="Special offers"
                            value={promoEnabled}
                            onValueChange={setPromoEnabled}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <ToggleRow
                            icon="weather-night"
                            title="Dark mode"
                            subtitle={mode === 'dark' ? "On" : "Off"}
                            value={mode === 'dark'}
                            onValueChange={toggleTheme}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <NavRow
                            icon="web"
                            title="Language"
                            subtitle={language}
                            onPress={() => setShowLanguageModal(true)}
                            colors={colors}
                            isLast
                        />
                    </View>
                </View>

                {/* 2. Account */}
                <View style={styles.sectionContainer}>
                    <SectionTitle title="Account" color={colors.text} />
                    <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                        <NavRow
                            icon="lock-outline"
                            title="Change password"
                            subtitle="Security"
                            onPress={() => navigation.navigate("ChangePassword")}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <NavRow
                            icon="account-off-outline"
                            title="Delete account"
                            subtitle="Permanent action"
                            onPress={handleDeleteAccount}
                            isLast
                            isDanger
                            colors={colors}
                        />
                    </View>
                </View>

                {/* 3. Legal */}
                <View style={styles.sectionContainer}>
                    <SectionTitle title="Legal" color={colors.text} />
                    <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                        <NavRow
                            icon="file-document-outline"
                            title="Terms"
                            subtitle="Service agreement"
                            onPress={() => showLegalModal("Terms of Service")}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <NavRow
                            icon="shield-check-outline"
                            title="Privacy"
                            subtitle="Data policy"
                            onPress={() => showLegalModal("Privacy Policy")}
                            isLast
                            colors={colors}
                        />
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* General App Modal */}
            <AppModal
                visible={!!modalConfig}
                type={modalConfig?.type}
                title={modalConfig?.title || ''}
                message={modalConfig?.message || ''}
                onClose={() => setModalConfig(null)}
                actionLabel={modalConfig?.actionLabel}
                onAction={modalConfig?.onAction}
                secondaryActionLabel={modalConfig?.type === 'confirm' ? 'Cancel' : undefined}
                onSecondaryAction={() => setModalConfig(null)}
            />

            {/* Language Selection Modal (Custom simple implementation) */}
            <AppModal
                visible={showLanguageModal}
                type="info"
                title="Select Language"
                message="Choose your preferred language for the interface."
                actionLabel="English"
                onAction={() => handleLanguageChange("English")}
                secondaryActionLabel="French"
                onSecondaryAction={() => handleLanguageChange("French")}
                onClose={() => setShowLanguageModal(false)}
            />
        </View>
    );
}

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
        fontSize: 20,
        fontWeight: "700",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        paddingVertical: 4,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 2 },
        }),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    rowLast: {
        borderBottomWidth: 0,
    },
    divider: {
        height: 1,
        marginLeft: 60,
    },
    iconBox: {
        width: 24,
        marginRight: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    rowContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    rowSubtitle: {
        fontSize: 13,
        fontWeight: "400",
    },
});
