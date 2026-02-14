import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function EmptyState({
    title,
    subtitle,
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <View style={styles.wrap}>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}>📍</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        alignItems: "center",
        paddingTop: 48,
        paddingHorizontal: 24,
    },
    iconCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "rgba(0,0,0,0.04)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    icon: { fontSize: 44 },
    title: {
        fontSize: 22,
        fontWeight: "900",
        color: "#1B1B1B",
        marginTop: 6,
    },
    subtitle: {
        marginTop: 8,
        textAlign: "center",
        fontSize: 14,
        color: "rgba(0,0,0,0.55)",
        fontWeight: "600",
        lineHeight: 20,
    },
});
