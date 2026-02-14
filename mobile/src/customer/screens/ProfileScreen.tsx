import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from '../../ui/Text';
import { useAuthStore } from '../../auth/store/auth.store';
import { useOrdersStore } from '../../state/orders/ordersStore';
import { colors } from '../../shared/theme/colors';

const PRIMARY_GREEN = "#10B981"; // Vibrant Green
const DANGER_RED = "#EF4444";
const BG_COLOR = "#F9FAFB"; // Light Gray Background

// Helper Components
const StatsItem = ({ icon, value, label }: { icon: any, value: string | number, label: string }) => (
    <View style={styles.statItem}>
        <MaterialCommunityIcons name={icon} size={28} color={PRIMARY_GREEN} style={{ marginBottom: 4 }} />
        <Text weight="800" style={styles.statValue}>{value}</Text>
        <Text weight="500" style={styles.statLabel}>{label}</Text>
    </View>
);

const MenuItem = ({ icon, title, subtitle, onPress, isLast }: any) => (
    <Pressable
        style={({ pressed }) => [
            styles.menuItem,
            isLast && styles.menuItemLast,
            pressed && { backgroundColor: "#F3F4F6" }
        ]}
        onPress={onPress}
    >
        <View style={styles.menuIconBox}>
            <MaterialCommunityIcons name={icon} size={22} color="#4B5563" />
        </View>
        <View style={styles.menuContent}>
            <Text weight="600" style={styles.menuTitle}>{title}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
    </Pressable>
);

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { logout, user } = useAuthStore();
    const orders = useOrdersStore((s) => s.orders);

    const orderCount = orders.length;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. Header is minimal/invisible in design, just spacing */}
                <View style={{ height: 20 }} />

                {/* 2. User Card */}
                <View style={styles.card}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder Avatar */}
                        <View style={styles.avatarPlaceholder}>
                            <MaterialCommunityIcons name="account" size={48} color="#9CA3AF" />
                        </View>
                    </View>

                    <Text weight="800" style={styles.userName}>
                        {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
                    </Text>
                    <Text weight="500" style={styles.userEmail}>
                        {user?.email || "guest@zenvy.com"}
                    </Text>

                    <View style={{ height: 16 }} />

                    <Pressable
                        style={({ pressed }) => [styles.editBtn, pressed && { backgroundColor: "#ECFDF5" }]}
                        onPress={() => navigation.navigate("EditProfile")}
                    >
                        <Text weight="700" style={styles.editBtnText}>Edit Profile</Text>
                    </Pressable>
                </View>

                {/* 3. Stats Row */}
                <View style={styles.statsCard}>
                    <StatsItem
                        icon="package-variant-closed"
                        value={orderCount}
                        label="Orders"
                    />
                    <View style={styles.statVerticalDivider} />
                    <StatsItem
                        icon="star-outline"
                        value="4.9"
                        label="Rating"
                    />
                    <View style={styles.statVerticalDivider} />
                    <StatsItem
                        icon="heart-outline"
                        value="15"
                        label="Saved"
                    />
                </View>

                {/* 4. Menu List */}
                <View style={[styles.menuCard, { overflow: 'hidden' }]}>
                    <MenuItem
                        icon="shopping-outline"
                        title="My Orders"
                        onPress={() => navigation.navigate('Orders')}
                    />
                    <View style={styles.menuDivider} />
                    <MenuItem
                        icon="map-marker-outline"
                        title="Addresses"
                        onPress={() => navigation.navigate('AddressSelector')}
                    />
                    <View style={styles.menuDivider} />
                    <MenuItem
                        icon="bell-outline"
                        title="Notifications"
                        onPress={() => navigation.navigate('Notifications')}
                    />
                    <View style={styles.menuDivider} />
                    <MenuItem
                        icon="cog-outline"
                        title="Settings"
                        onPress={() => navigation.navigate('Settings')}
                        isLast
                    />
                </View>

                {/* 5. Logout */}
                <Pressable
                    onPress={logout}
                    style={({ pressed }) => [styles.logoutBtn, pressed && { backgroundColor: "#FEF2F2" }]}
                >
                    <Text weight="700" style={styles.logoutText}>Log Out</Text>
                </Pressable>

                {/* 6. Version */}
                <Text style={styles.versionText}>Version 1.0.2 (Build 145)</Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_COLOR,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    // Card Common Style
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 3 },
        }),
    },
    statsCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 3 },
        }),
    },
    menuCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        paddingVertical: 4,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 3 },
        }),
    },
    // User Card
    avatarContainer: {
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    userName: {
        fontSize: 20,
        color: "#111827", // Gray 900
        textAlign: "center",
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: "#6B7280", // Gray 500
        textAlign: "center",
    },
    editBtn: {
        width: "100%",
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: PRIMARY_GREEN,
        justifyContent: "center",
        alignItems: "center",
    },
    editBtnText: {
        color: PRIMARY_GREEN,
        fontSize: 15,
    },
    // Stats
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 18,
        color: "#111827",
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    statVerticalDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#E5E7EB",
    },
    // Menu
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    menuItemLast: {
        // no bottom border
    },
    menuIconBox: {
        width: 32,
        marginRight: 8,
        alignItems: 'center',
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        color: "#374151",
    },
    menuDivider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginLeft: 56, // Indent to align with text
    },
    // Logout
    logoutBtn: {
        backgroundColor: "#FFFFFF", // White bg
        height: 52,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: DANGER_RED, // Red Border
        marginBottom: 24,
    },
    logoutText: {
        color: DANGER_RED,
        fontSize: 16,
    },
    versionText: {
        textAlign: "center",
        color: "#9CA3AF",
        fontSize: 12,
        fontWeight: "500",
    }
});
