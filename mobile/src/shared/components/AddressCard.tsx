import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    title: string;
    subtitle: string;
    selected?: boolean;
    onPress?: () => void;
};

export default function AddressCard({ title, subtitle, selected, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={[styles.card, selected && styles.cardSelected]}>
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            {selected ? (
                <View style={styles.checkWrap}>
                    <Text style={styles.check}>✓</Text>
                </View>
            ) : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.08)",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
    },
    cardSelected: {
        borderColor: "#18A05E",
        borderWidth: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1B1B1B",
    },
    subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: "rgba(0,0,0,0.55)",
        fontWeight: "600",
    },
    checkWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#18A05E",
        alignItems: "center",
        justifyContent: "center",
    },
    check: {
        color: "white",
        fontSize: 18,
        fontWeight: "900",
        marginTop: -1,
    },
});
