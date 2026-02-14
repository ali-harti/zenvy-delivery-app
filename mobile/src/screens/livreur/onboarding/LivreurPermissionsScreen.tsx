import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import AppSafeScreen from "../../../ui/AppSafeScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LivreurShiftStackParamList } from "../../../navigation/LivreurShiftNavigator";

type Props = NativeStackScreenProps<LivreurShiftStackParamList, "LivreurPermissions">;

export default function LivreurPermissionsScreen({ navigation }: Props) {
    // MVP: Fake "Checking" state or default off
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(false);
    // Auto-check effect (Simulation of "Checking permissions...")
    React.useEffect(() => {
        const t = setTimeout(() => {
            // Let's pretend Location is NOT enabled initially, so user must tap
            // But if you want to simulate "Already granted", set to true here
        }, 1000);
        return () => clearTimeout(t);
    }, []);

    const canContinue = useMemo(() => locationEnabled && notifEnabled, [locationEnabled, notifEnabled]);

    return (
        <AppSafeScreen>
            <View style={styles.container}>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.title}>Permissions Check</Text>
                    <Text style={styles.subtitle}>
                        To ensure a smooth delivery experience, please allow the following permissions.
                    </Text>
                </View>

                {/* Location card */}
                <View style={styles.card}>
                    <View style={styles.iconCircleGreen}>
                        <Text style={{ fontSize: 20 }}>📍</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>Location Access</Text>
                        <Text style={styles.cardDesc}>
                            Required for navigation and to find nearby orders.
                        </Text>

                        <View style={styles.rowBetween}>
                            <View style={[styles.badge, locationEnabled ? styles.badgeOn : styles.badgeOff]}>
                                <Text style={styles.badgeText}>
                                    {locationEnabled ? "Enabled" : "Checking..."}
                                </Text>
                            </View>

                            <Pressable
                                onPress={() => Linking.openSettings()}
                                style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.6 }]}
                            >
                                <Text style={styles.outlineText}>Open Settings</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Notifications card */}
                <View style={styles.card}>
                    <View style={styles.iconCircleBlue}>
                        <Text style={{ fontSize: 20 }}>🔔</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>Notifications</Text>
                        <Text style={styles.cardDesc}>
                            Get instant alerts for new delivery requests and updates.
                        </Text>

                        <View style={styles.rowBetween}>
                            <View style={[styles.badge, notifEnabled ? styles.badgeOn : styles.badgeOff]}>
                                <Text style={[styles.badgeText, notifEnabled ? { color: "#FFF" } : { color: "#6B6B6B" }]}>
                                    {notifEnabled ? "Enabled" : "Disabled"}
                                </Text>
                            </View>

                            {!notifEnabled ? (
                                <Pressable
                                    onPress={() => setNotifEnabled(true)}
                                    style={({ pressed }) => [styles.enableOutlineBtn, pressed && { opacity: 0.6 }]}
                                >
                                    <Text style={styles.enableOutlineText}>Enable</Text>
                                </Pressable>
                            ) : null}
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1 }} />

                <Pressable
                    onPress={() => navigation.navigate("LivreurConfirmZone")}
                    disabled={!canContinue}
                    style={({ pressed }) => [
                        styles.primaryBtn,
                        !canContinue && { opacity: 0.5, backgroundColor: "#CCC" },
                        pressed && canContinue && { opacity: 0.9 },
                    ]}
                >
                    <Text style={styles.primaryText}>Next</Text>
                </Pressable>

                {/* quick toggle for dev testing */}
                <Pressable onPress={() => setLocationEnabled((v) => !v)} style={{ paddingVertical: 10 }}>
                    <Text style={{ textAlign: "center", color: "#E0E0E0", fontSize: 10 }}>
                        (Dev: toggle location)
                    </Text>
                </Pressable>
            </View>
        </AppSafeScreen>
    );
}

const GREEN = "#1E9E5A";

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, paddingBottom: 12 },
    title: { fontSize: 28, fontWeight: "800", color: "#111" },
    subtitle: { marginTop: 8, fontSize: 15, color: "#6B6B6B", lineHeight: 22 },

    card: {
        marginTop: 20,
        flexDirection: "row",
        gap: 16,
        padding: 16,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },

    iconCircleGreen: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E8F6EF",
        alignItems: "center",
        justifyContent: "center",
    },
    iconCircleBlue: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#EAF1FF",
        alignItems: "center",
        justifyContent: "center",
    },

    cardTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A1A" },
    cardDesc: { marginTop: 4, fontSize: 13, color: "#6B6B6B", lineHeight: 18 },

    rowBetween: { marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
    badgeOn: { backgroundColor: GREEN },
    badgeOff: { backgroundColor: "#F0F0F0" },
    badgeText: { fontSize: 12, fontWeight: "700", color: "#FFF" }, // White text for enabled

    outlineBtn: {
        borderWidth: 1,
        borderColor: "#D5D5D5",
        paddingHorizontal: 16,
        height: 36,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    outlineText: { fontSize: 13, fontWeight: "600", color: "#555" },

    enableOutlineBtn: {
        borderWidth: 1,
        borderColor: GREEN,
        paddingHorizontal: 16,
        height: 36,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF",
    },
    enableOutlineText: { fontSize: 13, fontWeight: "700", color: GREEN },

    primaryBtn: {
        height: 54,
        borderRadius: 100,
        backgroundColor: GREEN,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        shadowColor: GREEN,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    primaryText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
});
