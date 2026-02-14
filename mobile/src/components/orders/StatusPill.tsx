import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { OrderStatus } from "../../types/order";

const statusMap: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
    ON_THE_WAY: { label: "On the Way", bg: "#E6F7EE", fg: "#148A4B" },
    DELIVERED: { label: "Delivered", bg: "#E6F7EE", fg: "#148A4B" },
    CANCELLED: { label: "Cancelled", bg: "#FDECEC", fg: "#C03A2B" },
    PREPARING: { label: "Preparing", bg: "#FFF6E6", fg: "#9A6B00" },
};

export function StatusPill({ status }: { status: OrderStatus }) {
    const s = statusMap[status];
    return (
        <View style={[styles.pill, { backgroundColor: s.bg }]}>
            <Text style={[styles.text, { color: s.fg }]}>{s.label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    text: {
        fontSize: 12,
        fontWeight: "700",
    },
});
