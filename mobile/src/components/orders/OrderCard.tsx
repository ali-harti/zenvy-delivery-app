import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Order } from "../../types/order";
import { StatusPill } from "./StatusPill";

function formatNiceDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function OrderCard({
    order,
    onPress,
}: {
    order: Order;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress} style={styles.card}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.storeName}>{order.storeName}</Text>
                    <Text style={styles.subText}>{formatNiceDate(order.createdAtISO)}</Text>
                    <View style={{ height: 10 }} />
                    <StatusPill status={order.status} />
                    <View style={{ height: 10 }} />
                    <Text style={styles.totalText}>Total: {order.money.total} MAD</Text>
                </View>

                <Text style={styles.chevron}>›</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    row: { flexDirection: "row", alignItems: "center" },
    storeName: { fontSize: 18, fontWeight: "800", color: "#1B1B1B" },
    subText: { fontSize: 13, color: "#7A7A7A", marginTop: 4 },
    totalText: { fontSize: 15, fontWeight: "800", color: "#1B1B1B" },
    chevron: { fontSize: 28, color: "#7A7A7A", paddingLeft: 10 },
});
