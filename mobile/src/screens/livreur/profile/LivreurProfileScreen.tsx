import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLivreur } from '../../../context/LivreurContext';
import { colors } from '../../../theme/colors';
import { cardStyles } from '../../../components/livreur/OnlineToggleCard';
import EditProfileModal from '../../../components/livreur/EditProfileModal';
import DetailModal from '../../../components/livreur/DetailModal';
import LogoutConfirmationModal from '../../../components/livreur/LogoutConfirmationModal';

const ProfileScreen: React.FC = () => {
    const { profile, stats, updateProfile, logout } = useLivreur();

    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const [detailModal, setDetailModal] = useState<{ visible: boolean; title: string; items: any[] }>({
        visible: false,
        title: '',
        items: [],
    });

    // Guard against null profile
    if (!profile) return null;

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        logout();
    };

    const openDetail = (key: string) => {
        let title = '';
        let items: any[] = [];

        switch (key) {
            case 'documents':
                title = 'Documents';
                items = [
                    { label: 'Driving License', value: 'LICENSE-12345', status: 'verified' },
                    { label: 'Insurance Policy', value: 'INS-987654', status: 'verified' },
                    { label: 'Identity Card', value: 'ID-554433', status: 'verified' },
                ];
                break;
            case 'vehicle':
                title = 'Vehicle Settings';
                items = [
                    { label: 'Type', value: profile.vehicle },
                    { label: 'Plate Number', value: '1234-A-56' },
                    { label: 'Color', value: 'Black' },
                    { label: 'Model', value: 'Yamaha XMAX 300' },
                ];
                break;
            case 'payouts':
                title = 'Payouts';
                items = [
                    { label: 'Next Payout', value: '1,200 MAD', status: 'verified' },
                    { label: 'Date', value: 'Monday, Feb 16th' },
                    { label: 'Bank Account', value: '**** 1234' },
                ];
                break;
            case 'support':
                title = 'Support';
                items = [
                    { label: 'Help Center', value: 'Visit help.zenvy.com' },
                    { label: 'Support Hotline', value: '+212 600 000 000' },
                    { label: 'Email', value: 'support@zenvy.com' },
                ];
                break;
        }

        setDetailModal({ visible: true, title, items });
    };

    const StatCard = ({ label, value }: { label: string; value: string | number }) => (
        <View style={[cardStyles.card, styles.statCard]}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const MenuOption = ({ icon, label, onPress, isDanger = false }: any) => (
        <TouchableOpacity style={[cardStyles.card, styles.menuOption]} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name={icon} size={20} color={isDanger ? colors.danger : colors.textPrimary} style={styles.menuIcon} />
                <Text style={[styles.menuLabel, isDanger && styles.dangerLabel]}>{label}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>Profile</Text>

                <View style={[cardStyles.card, styles.profileCard]}>
                    <View style={styles.avatarPlaceholder}>
                        <Feather name="user" size={40} color={colors.textSecondary} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{profile.name}</Text>
                        <Text style={styles.profileRole}>Livreur</Text>
                        <View style={styles.badgesRow}>
                            <View style={styles.badge}>
                                <Feather name="star" size={14} color={colors.primary} />
                                <Text style={styles.badgeText}>{profile.rating.toFixed(1)} Rating</Text>
                            </View>
                            <View style={styles.badge}>
                                <MaterialCommunityIcons name="motorbike" size={16} color={colors.primary} />
                                <Text style={styles.badgeText}>{profile.vehicle}</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
                        <Feather name="edit-2" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                    <StatCard label="Deliveries" value={stats?.completedDeliveries || 0} />
                    <StatCard label="Member Since" value={profile.memberSince} />
                </View>

                <View style={styles.menuContainer}>
                    <MenuOption icon="file-text" label="Documents" onPress={() => openDetail('documents')} />
                    <MenuOption icon="settings" label="Vehicle Settings" onPress={() => openDetail('vehicle')} />
                    <MenuOption icon="credit-card" label="Payouts" onPress={() => openDetail('payouts')} />
                    <MenuOption icon="headphones" label="Support" onPress={() => openDetail('support')} />
                    <MenuOption icon="log-out" label="Logout" isDanger onPress={handleLogout} />
                </View>
            </ScrollView>

            <EditProfileModal
                visible={isEditModalVisible}
                onClose={() => setEditModalVisible(false)}
                initialName={profile.name}
                initialVehicle={profile.vehicle}
                onSave={(name, vehicle) => updateProfile(name, vehicle)}
            />

            <DetailModal
                visible={detailModal.visible}
                onClose={() => setDetailModal(prev => ({ ...prev, visible: false }))}
                title={detailModal.title}
                items={detailModal.items}
            />

            <LogoutConfirmationModal
                visible={isLogoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                onConfirm={confirmLogout}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 20, textAlign: 'center' },
    profileCard: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
    avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 20 },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
    profileRole: { fontSize: 16, color: colors.textSecondary, marginBottom: 8 },
    badgesRow: { flexDirection: 'row' },
    badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, marginRight: 8 },
    badgeText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, marginLeft: 4 },
    editButton: { padding: 10 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statCard: { flex: 1, alignItems: 'center', marginHorizontal: 5, marginBottom: 0 },
    statValue: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
    statLabel: { fontSize: 14, color: colors.textSecondary },
    menuContainer: { marginBottom: 20 },
    menuOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, marginBottom: 10 },
    menuIcon: { marginRight: 16 },
    menuLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    dangerLabel: { color: colors.danger },
});

export default ProfileScreen;
