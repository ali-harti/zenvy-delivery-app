import React from "react";
import { View, Text, StyleSheet, Pressable, Switch } from "react-native";
import AppSafeScreen from "../../../ui/AppSafeScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LivreurShiftStackParamList } from "../../../navigation/LivreurShiftNavigator";
import { useLivreurStore, VehicleType } from "../../../stores/livreur.store";

type Props = NativeStackScreenProps<LivreurShiftStackParamList, "LivreurGoOnline">;

export default function LivreurGoOnlineScreen({ navigation }: Props) {
    const { isOnline, setOnline, vehicleType, setVehicleType, startShift } = useLivreurStore();

    const VehiclePill = ({ label, value, icon }: { label: string; value: VehicleType; icon: string }) => {
        const active = vehicleType === value;
        return (
            <Pressable onPress={() => setVehicleType(value)} style={[styles.pill, active && styles.pillActive]}>
                <Text style={[styles.pillIcon, active && { color: "#FFF" }]}>{icon}</Text>
                <Text style={[styles.pillText, active && { color: "#FFF" }]}>{label}</Text>
            </Pressable>
        );
    };

    const handleStart = () => {
        // 1. In a real app, API call to backend
        // 2. Update store -> RootNavigator sees shiftReady=true and switches to Tabs
        startShift();
    };

    return (
        <AppSafeScreen>
            <View style={styles.container}>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.title}>Go Online</Text>
                    <Text style={styles.subtitle}>Confirm your status and vehicle to start.</Text>
                </View>

                <View style={styles.statusCard}>
                    <View style={styles.statusRow}>
                        <Text style={[styles.statusLabel, !isOnline && styles.statusMuted]}>Offline</Text>
                        <Switch
                            value={isOnline}
                            onValueChange={setOnline}
                            trackColor={{ false: "#E0E0E0", true: GREEN }}
                            thumbColor={"#FFFFFF"}
                            ios_backgroundColor="#E0E0E0"
                            style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }} // Slightly larger
                        />
                        <Text style={[styles.statusLabel, isOnline && styles.statusOnline]}>Online</Text>
                    </View>
                    <Text style={styles.statusHint}>You are now visible to receive orders.</Text>
                </View>

                <Text style={styles.sectionTitle}>Select vehicle type</Text>

                <View style={styles.pillsRow}>
                    <VehiclePill label="Bike" value="bike" icon="🚲" />
                    <VehiclePill label="Scooter" value="scooter" icon="🛵" />
                    <VehiclePill label="Car" value="car" icon="🚗" />
                </View>

                <View style={styles.checkCard}>
                    <View style={styles.checkCircle}>
                        <Text style={{ fontSize: 12, color: "#FFF" }}>✓</Text>
                    </View>
                    <Text style={styles.checkText}>Battery & internet ready</Text>
                </View>

                <View style={{ flex: 1 }} />

                <Pressable
                    onPress={handleStart}
                    style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
                >
                    <Text style={styles.primaryText}>Start Delivering</Text>
                </Pressable>
            </View>
        </AppSafeScreen>
    );
}

const GREEN = "#1E9E5A";

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, paddingBottom: 12 },
    title: { fontSize: 28, fontWeight: "800", color: "#111", textAlign: "center" },
    subtitle: { marginTop: 8, fontSize: 15, color: "#6B6B6B", lineHeight: 22, textAlign: "center", paddingHorizontal: 20 },

    statusCard: {
        marginTop: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        alignItems: "center",
    },
    statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 16 },
    statusLabel: { fontSize: 16, fontWeight: "800", color: "#1A1A1A" },
    statusMuted: { color: "#9B9B9B" },
    statusOnline: { color: GREEN },
    statusHint: { marginTop: 12, textAlign: "center", color: "#6B6B6B", fontSize: 13 },

    sectionTitle: { marginTop: 24, fontSize: 15, fontWeight: "800", color: "#1A1A1A" },

    pillsRow: { marginTop: 12, flexDirection: "row", gap: 10 },
    pill: {
        flex: 1,
        height: 46,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#FFF",
    },
    pillActive: { backgroundColor: GREEN, borderColor: GREEN },
    pillIcon: { fontSize: 16 },
    pillText: { fontSize: 14, fontWeight: "700", color: "#666" },

    checkCard: {
        marginTop: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 1,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: GREEN,
        alignItems: "center",
        justifyContent: "center",
    },
    checkText: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },

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
