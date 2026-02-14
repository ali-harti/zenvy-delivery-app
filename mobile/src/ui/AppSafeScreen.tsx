import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppSafeScreen({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: ViewStyle;
}) {
    return (
        <SafeAreaView style={[styles.safe, style]} edges={["top", "bottom"]}>
            <View style={styles.inner}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#FFFFFF" },
    inner: { flex: 1 },
});
