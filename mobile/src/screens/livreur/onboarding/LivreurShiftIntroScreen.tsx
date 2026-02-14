import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import AppSafeScreen from "../../../ui/AppSafeScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LivreurShiftStackParamList } from "../../../navigation/LivreurShiftNavigator";
import { useLivreurStore } from "../../../stores/livreur.store"; // Fixed import

type Props = NativeStackScreenProps<LivreurShiftStackParamList, "LivreurShiftIntro">;

import { useAuthStore } from "../../../auth/store/auth.store";
import { ZENVY_COLORS } from "../../../config/theme";

export default function LivreurShiftIntroScreen({ navigation }: Props) {
    const { vehicleType } = useLivreurStore();
    const user = useAuthStore((s) => s.user);

    const displayName = user ? `${user.firstName} ${user.lastName}` : "Courier";
    const rating = 5.0; // Default for new couriers

    return (
        <AppSafeScreen>
            <View style={styles.container}>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.title}>Start your shift</Text>
                    <Text style={styles.subtitle}>
                        Confirm your status and go online to receive deliveries.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Image
                        source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                        style={styles.avatar}
                    />

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={styles.name}>{displayName}</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.star}>★</Text>
                            <Text style={styles.metaText}>{rating.toFixed(1)} Rating</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.vehicleIcon}>{vehicleType === "scooter" ? "🛵" : vehicleType === "bike" ? "🚲" : "🚗"}</Text>
                            <Text style={styles.metaText}>Vehicle: {vehicleType === "scooter" ? "Motorbike" : vehicleType}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1 }} />

                <Pressable
                    onPress={() => navigation.navigate("LivreurGoOnline")}
                    style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
                >
                    <Text style={styles.primaryText}>Continue</Text>
                </Pressable>
            </View>
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, paddingBottom: 12 },
    title: { fontSize: 32, fontWeight: "800", color: "#111", textAlign: "center" },
    subtitle: {
        marginTop: 12,
        fontSize: 15,
        color: "#6B6B6B",
        lineHeight: 22,
        textAlign: "center",
        paddingHorizontal: 20,
    },

    card: {
        marginTop: 40,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        backgroundColor: "#F0F0F0"
    },
    name: { fontSize: 17, fontWeight: "800", color: "#1A1A1A", marginBottom: 4 },
    metaRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
    star: { fontSize: 12, color: "#1A1A1A", marginRight: 4 },
    vehicleIcon: { fontSize: 12, marginRight: 4, color: "#1A1A1A" },
    metaText: { fontSize: 13, color: "#555", fontWeight: "500" },

    primaryBtn: {
        height: 54,
        borderRadius: 100, // Fully rounded
        backgroundColor: ZENVY_COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        shadowColor: ZENVY_COLORS.primary,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    primaryText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
