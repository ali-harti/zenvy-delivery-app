import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export function EmptyOrders({ onStartOrdering }: { onStartOrdering: () => void }) {
    return (
        <View style={styles.wrap}>
            <View style={styles.boxIcon} />
            <Text style={styles.title}>No orders yet</Text>
            <Text style={styles.subtitle}>Looks like you haven’t ordered anything yet.</Text>
            <Pressable onPress={onStartOrdering} style={styles.btn}>
                <Text style={styles.btnText}>Start ordering</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
    boxIcon: { width: 120, height: 90, borderRadius: 18, backgroundColor: "#EFEFEF", marginBottom: 18 },
    title: { fontSize: 18, fontWeight: "900", color: "#1B1B1B" },
    subtitle: { fontSize: 13, color: "#7A7A7A", marginTop: 8, textAlign: "center" },
    btn: {
        marginTop: 18,
        backgroundColor: "#148A4B",
        paddingVertical: 14,
        paddingHorizontal: 22,
        borderRadius: 14,
        minWidth: 220,
        alignItems: "center",
    },
    btnText: { color: "white", fontWeight: "900" },
});
