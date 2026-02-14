import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from "react-native";
import { useLivreurStore } from "../../../stores/livreur.store";
import { ZENVY_COLORS } from "../../../config/theme";
import AppSafeScreen from "../../../ui/AppSafeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LivreurHomeScreen() {
    const { isOnline, setOnline, driverName, rating, vehicleType, activeRequest, setActiveRequest } = useLivreurStore();

    // Dev Simulation
    const simulateRequest = () => {
        if (activeRequest) {
            setActiveRequest(null);
        } else {
            setActiveRequest({
                id: "REQ-" + Math.floor(Math.random() * 1000),
                shopName: "Burger King - Maarif",
                shopAddress: "Bd Al Massira Al Khadra",
                customerAddress: "Rue des Papillons, Anfa",
                earnings: 25.50,
                distance: 2.4,
            });
        }
    };

    return (
        <AppSafeScreen>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {driverName.split(" ")[0]}</Text>
                    <Text style={styles.statusText}>
                        You are currently <Text style={{ color: isOnline ? ZENVY_COLORS.primary : "#999" }}>{isOnline ? "Online" : "Offline"}</Text>
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={[styles.onlineBadge, { backgroundColor: isOnline ? "#E8F6EF" : "#F5F5F5" }]}>
                        <View style={[styles.dot, { backgroundColor: isOnline ? ZENVY_COLORS.primary : "#999" }]} />
                        <Switch
                            value={isOnline}
                            onValueChange={setOnline}
                            trackColor={{ false: "#E0E0E0", true: ZENVY_COLORS.primary }}
                            thumbColor={"#FFFFFF"}
                            ios_backgroundColor="#E0E0E0"
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Today</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>4.5h</Text>
                        <Text style={styles.statLabel}>Hours</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{rating}★</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Active Request Card */}
                {activeRequest && (
                    <View style={styles.requestCard}>
                        <View style={styles.reqHeader}>
                            <View style={styles.reqBadge}>
                                <Text style={styles.reqBadgeText}>NEW REQUEST</Text>
                            </View>
                            <Text style={styles.reqPrice}>{activeRequest.earnings.toFixed(2)} DH</Text>
                        </View>

                        <Text style={styles.shopName}>{activeRequest.shopName}</Text>
                        <Text style={styles.reqAddress}>{activeRequest.shopAddress}</Text>

                        <View style={styles.divider} />

                        <View style={styles.reqRow}>
                            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                            <Text style={styles.reqDistance}>{activeRequest.distance} km total distance</Text>
                        </View>

                        <View style={styles.reqButtons}>
                            <Pressable
                                style={styles.declineBtn}
                                onPress={() => setActiveRequest(null)}
                            >
                                <Text style={styles.declineText}>Decline</Text>
                            </Pressable>
                            <Pressable style={styles.acceptBtn}>
                                <Text style={styles.acceptText}>Accept Order</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                {/* Incoming Request Placeholder */}
                {!activeRequest && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>New Requests</Text>

                        {isOnline ? (
                            <Pressable onPress={simulateRequest} style={styles.emptyState}>
                                <MaterialCommunityIcons name="radar" size={48} color={ZENVY_COLORS.primary} style={{ opacity: 0.5 }} />
                                <Text style={styles.emptyText}>Searching for orders...</Text>
                                <Text style={styles.emptySub}>Tap here to simulate incoming request (Dev)</Text>
                            </Pressable>
                        ) : (
                            <View style={styles.offlineState}>
                                <MaterialCommunityIcons name="sleep" size={48} color="#CCC" />
                                <Text style={styles.emptyText}>You are Offline</Text>
                                <Text style={styles.emptySub}>Go online to start receiving orders.</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    greeting: { fontSize: 20, fontWeight: "800", color: "#1A1A1A" },
    statusText: { fontSize: 13, color: "#666", marginTop: 2 },

    headerRight: { flexDirection: "row", alignItems: "center" },
    onlineBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 6
    },
    dot: { width: 8, height: 8, borderRadius: 4 },

    content: { padding: 20 },

    statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
    statCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    statValue: { fontSize: 20, fontWeight: "800", color: "#1A1A1A" },
    statLabel: { fontSize: 12, color: "#999", marginTop: 4, fontWeight: "600" },

    section: { marginTop: 0 },
    sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A1A", marginBottom: 12 },

    // Request Card
    requestCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: ZENVY_COLORS.primary,
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: ZENVY_COLORS.primary,
    },
    reqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    reqBadge: { backgroundColor: ZENVY_COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    reqBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "800" },
    reqPrice: { fontSize: 18, fontWeight: "800", color: "#1A1A1A" },
    shopName: { fontSize: 18, fontWeight: "800", color: "#1A1A1A", marginTop: 4 },
    reqAddress: { fontSize: 13, color: "#666", marginTop: 2 },
    divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 12 },
    reqRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
    reqDistance: { fontSize: 13, color: "#666", fontWeight: "500" },
    reqButtons: { flexDirection: "row", gap: 12 },
    declineBtn: {
        flex: 1,
        height: 48,
        borderRadius: 100,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center"
    },
    declineText: { fontWeight: "700", color: "#666" },
    acceptBtn: {
        flex: 1,
        height: 48,
        borderRadius: 100,
        backgroundColor: ZENVY_COLORS.primary,
        alignItems: "center",
        justifyContent: "center"
    },
    acceptText: { fontWeight: "700", color: "#FFF" },

    emptyState: {
        backgroundColor: "#E8F6EF",
        borderRadius: 16,
        padding: 32,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(30, 158, 90, 0.1)",
        borderStyle: "dashed",
    },
    offlineState: {
        backgroundColor: "#F5F5F5",
        borderRadius: 16,
        padding: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: { marginTop: 16, fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
    emptySub: { marginTop: 4, fontSize: 13, color: "#666", textAlign: "center" },
});
