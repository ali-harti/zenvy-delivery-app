import React, { useMemo } from "react";
import { View, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../../ui/Text";
import { useOrdersStore } from "../../state/orders/ordersStore";
import { StatusPill } from "../../components/orders/StatusPill";
import { useOrderTracking } from "../../hooks/useOrderTracking";

export default function OrderDetailsScreen({ route, navigation }: any) {
    const { orderId } = route.params;
    const orders = useOrdersStore((s) => s.orders);
    const insets = useSafeAreaInsets();

    const order = useMemo(() => orders.find((o) => o.id === orderId), [orders, orderId]);

    // Activate tracking simulation when viewing details
    useOrderTracking(order);

    if (!order) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.container}>
                    <Text style={styles.title}>Order Details</Text>
                    <Text style={{ color: "#7A7A7A" }}>Order not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.headerRow, { marginTop: insets.top + 10 }]}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>‹</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120 }}
            >
                <View style={styles.topCard}>
                    <Text style={styles.storeName}>{order.storeName}</Text>
                    <Text style={styles.dateText}>
                        {new Date(order.createdAtISO).toLocaleString(undefined, {
                            weekday: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            month: "short",
                            day: "numeric",
                        })}
                    </Text>
                    <View style={{ height: 10 }} />
                    <StatusPill status={order.status} />
                </View>

                <Text style={styles.sectionTitle}>Items list</Text>

                <View style={styles.list}>
                    {order.items.map((it) => (
                        <View key={it.productId} style={styles.itemRow}>
                            <Text style={styles.itemLeft}>{it.qty}x  {it.name}</Text>
                            <Text style={styles.itemRight}>{it.qty * it.unitPrice} MAD</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Summary card</Text>

                <View style={styles.summary}>
                    <Row label="Subtotal" value={`${order.money.subtotal} MAD`} />
                    <Row label="Delivery fee" value={`${order.money.deliveryFee} MAD`} />
                    <Row label="Service fee" value={`${order.money.serviceFee} MAD`} />
                    <View style={{ height: 10 }} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>{order.money.total} MAD</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={styles.trackBtn}
                    onPress={() => navigation.navigate("Tracking", { orderId: order.id })}
                >
                    <Text style={styles.trackBtnText}>Track Order</Text>
                </Pressable>
            </View>
        </View>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F6F6F3" },
    mainContainer: { flex: 1, backgroundColor: "#F6F6F3" },
    container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        paddingHorizontal: 18,
    },
    backBtn: { width: 40, height: 40, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.06)", alignItems: "center", justifyContent: "center" },
    backText: { fontSize: 26, color: "#1B1B1B", marginTop: -2 },
    headerTitle: { fontSize: 20, fontWeight: "900", color: "#1B1B1B" },
    title: { fontSize: 32, fontWeight: "900", color: "#1B1B1B", marginBottom: 12 },

    topCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    storeName: { fontSize: 22, fontWeight: "900", color: "#1B1B1B" },
    dateText: { fontSize: 14, color: "#7A7A7A", marginTop: 6 },

    sectionTitle: { fontSize: 18, fontWeight: "900", color: "#1B1B1B", marginTop: 18, marginBottom: 10 },

    list: { backgroundColor: "transparent" },
    itemRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
    itemLeft: { fontSize: 16, color: "#1B1B1B", fontWeight: "600" },
    itemRight: { fontSize: 16, color: "#1B1B1B", fontWeight: "800" },

    divider: { height: 1, backgroundColor: "rgba(0,0,0,0.08)", marginVertical: 12 },

    summary: { paddingTop: 2 },
    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
    rowLabel: { fontSize: 15, color: "#7A7A7A", fontWeight: "600" },
    rowValue: { fontSize: 15, color: "#1B1B1B", fontWeight: "800" },
    totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
    totalLabel: { fontSize: 20, fontWeight: "900", color: "#1B1B1B" },
    totalValue: { fontSize: 22, fontWeight: "900", color: "#1B1B1B" },

    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#F6F6F3",
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.05)",
        paddingHorizontal: 18,
        paddingTop: 16,
    },
    trackBtn: {
        backgroundColor: "#148A4B",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },
    trackBtnText: { color: "white", fontWeight: "900", fontSize: 16 },
});
