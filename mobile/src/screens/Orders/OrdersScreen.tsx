import React, { useMemo, useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrdersStore } from "../../state/orders/ordersStore";
import { Order } from "../../types/order";
import { OrderCard } from "../../components/orders/OrderCard";
import { Text } from "../../ui/Text"; // Using Global Text

const BG = "#F6F6F4";
const GREEN = "#18A05E";

export default function OrdersScreen({ navigation }: any) {
    console.log("✅ NEW ORDERS SCREEN RENDERED");
    const orders = useOrdersStore((s) => s.orders);
    const hasHydrated = useOrdersStore((s) => s.hasHydrated);
    const [tab, setTab] = useState<"ACTIVE" | "PAST">("ACTIVE");

    const { active, past } = useMemo(() => {
        const activeStatuses = new Set(["ACCEPTED", "PREPARING", "PICKED_UP", "ON_THE_WAY"]);
        const a: Order[] = [];
        const p: Order[] = [];
        for (const o of orders) {
            if (activeStatuses.has(o.status)) a.push(o);
            else p.push(o);
        }
        return { active: a, past: p };
    }, [orders]);

    if (!hasHydrated) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "rgba(0,0,0,0.45)" }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    const data = tab === "ACTIVE" ? active : past;
    const isEmpty = orders.length === 0;

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text weight="900" style={styles.title}>My Orders</Text>

                    {/* Tabs */}
                    <View style={styles.tabsRow}>
                        <Pressable onPress={() => setTab("ACTIVE")} style={styles.tabBtn}>
                            <Text weight={tab === "ACTIVE" ? "800" : "600"} style={[styles.tabText, tab === "ACTIVE" && styles.tabTextActive]}>
                                Active
                            </Text>
                            {tab === "ACTIVE" && <View style={styles.underline} />}
                        </Pressable>

                        <Pressable onPress={() => setTab("PAST")} style={styles.tabBtn}>
                            <Text weight={tab === "PAST" ? "800" : "600"} style={[styles.tabText, tab === "PAST" && styles.tabTextActive]}>
                                Past
                            </Text>
                            {tab === "PAST" && <View style={styles.underline} />}
                        </Pressable>
                    </View>
                </View>

                {isEmpty ? (
                    <View style={styles.emptyWrap}>
                        <View style={styles.illustration} />
                        <Text weight="800" style={styles.emptyTitle}>No orders yet</Text>
                        <Text weight="600" style={styles.emptySubtitle}>
                            Looks like you haven't ordered anything yet.
                        </Text>

                        <Pressable
                            onPress={() => navigation.navigate("Home")}
                            style={styles.primaryBtn}
                        >
                            <Text weight="800" style={styles.primaryBtnText}>Start ordering</Text>
                        </Pressable>
                    </View>
                ) : (
                    <FlatList
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 }}
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <OrderCard
                                order={item}
                                onPress={() => navigation.navigate("OrderDetails", { orderId: item.id })}
                            />
                        )}
                        ListEmptyComponent={
                            <View style={{ paddingTop: 30 }}>
                                <Text style={{ color: "rgba(0,0,0,0.45)", textAlign: "center" }}>
                                    {tab === "ACTIVE" ? "No active orders." : "No past orders."}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: BG },
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 },
    title: { fontSize: 40, letterSpacing: -0.6, color: "#111" },
    tabsRow: { flexDirection: "row", gap: 22, marginTop: 14 },
    tabBtn: { paddingVertical: 6 },
    tabText: { fontSize: 16, color: "rgba(0,0,0,0.45)" },
    tabTextActive: { color: GREEN },
    underline: { height: 3, width: 28, borderRadius: 999, backgroundColor: GREEN, marginTop: 8 },

    emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
    illustration: { width: 84, height: 84, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.06)", marginBottom: 18 },
    emptyTitle: { fontSize: 22, marginBottom: 6, color: "#111" },
    emptySubtitle: { fontSize: 14, textAlign: "center", color: "rgba(0,0,0,0.55)", marginBottom: 18 },
    primaryBtn: { height: 56, paddingHorizontal: 22, borderRadius: 16, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", minWidth: 210 },
    primaryBtnText: { color: "white", fontSize: 16 },
});
