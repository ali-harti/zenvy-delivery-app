import React, { useMemo } from "react";
import { View, StyleSheet, Pressable, Image, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../ui/Text";
import { useOrdersStore } from "../../state/orders/ordersStore";
import { useOrderTracking } from "../../hooks/useOrderTracking";

const BG = "#FFFFFF";
const GREEN = "#18A05E";
const SHADOW = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 4 },
});

const STATUS_STEPS = [
    { key: "ORDER_PLACED", label: "Placed" },
    { key: "ACCEPTED", label: "Accepted" },
    { key: "PREPARING", label: "Preparing" },
    { key: "PICKED_UP", label: "Picked Up" },
    { key: "ON_THE_WAY", label: "On the Way" },
    { key: "DELIVERED", label: "Delivered" },
] as const;

function stepIndexFromStatus(status?: string) {
    if (!status) return 0;
    if (status === "ORDER_PLACED") return 0;
    if (status === "ACCEPTED") return 1;
    if (status === "PREPARING") return 2;
    if (status === "PICKED_UP") return 3;
    if (status === "ON_THE_WAY") return 4;
    if (status === "DELIVERED") return 5;
    return 1;
}

export default function OrderTrackingScreen({ navigation, route }: any) {
    const orderId = route?.params?.orderId;
    const orders = useOrdersStore((s) => s.orders);

    const initialOrder = useMemo(() => {
        if (!orders?.length) return undefined;
        if (orderId) return orders.find((o) => o.id === orderId);
        return orders[0]; // latest
    }, [orders, orderId]);

    // Use Real-Time Hook (Status Only)
    const { driver, orderStatus } = useOrderTracking(initialOrder);

    const activeStep = stepIndexFromStatus(orderStatus);
    const isDelivered = orderStatus === 'DELIVERED';
    const etaText = isDelivered ? "Order Delivered!" : "Arriving in 12 min";

    return (
        <SafeAreaView style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text weight="900" style={styles.backIcon}>‹</Text>
                </Pressable>
                <Text weight="800" style={styles.headerTitle}>Tracking</Text>
                <Pressable onPress={() => console.log("Support")}>
                    <Text weight="700" style={styles.supportText}>Help</Text>
                </Pressable>
            </View>

            <View style={styles.content}>

                {/* Main Status & ETA */}
                <View style={styles.statusHero}>
                    <Text weight="900" style={styles.etaTitle}>{etaText}</Text>
                    <Text style={styles.etaSubtitle}>
                        {isDelivered
                            ? "Enjoy your meal!"
                            : "Estimated delivery time"
                        }
                    </Text>
                </View>

                {/* Timeline */}
                <View style={styles.timelineCard}>
                    {STATUS_STEPS.map((s, idx) => {
                        const done = idx < activeStep;
                        const active = idx === activeStep;
                        const isLast = idx === STATUS_STEPS.length - 1;

                        return (
                            <View key={s.key} style={styles.stepRow}>
                                <View style={styles.stepLeft}>
                                    <View style={[
                                        styles.stepDot,
                                        (done || active) ? styles.dotActive : styles.dotIdle
                                    ]}>
                                        {(done || active) && <Text style={{ color: 'white', fontSize: 10 }}>✓</Text>}
                                    </View>
                                    {!isLast && <View style={[
                                        styles.stepLine,
                                        done ? styles.lineActive : styles.lineIdle
                                    ]} />}
                                </View>
                                <View style={styles.stepRight}>
                                    <Text
                                        weight={active ? "900" : "600"}
                                        style={[
                                            styles.stepLabel,
                                            (done || active) ? { color: "#111" } : { color: "#999" }
                                        ]}
                                    >
                                        {s.label}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Courier Info */}
                {!isDelivered && (
                    <View style={styles.courierCard}>
                        <View style={styles.courierRow}>
                            <Image
                                source={{ uri: driver?.avatar }}
                                style={styles.avatar}
                            />
                            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                                <Text weight="900" style={styles.courierName}>{driver?.name}</Text>
                                <Text weight="600" style={styles.courierRole}>Your Courier • ⭐ {driver?.rating}</Text>
                            </View>
                            <Pressable style={styles.callBtn}>
                                <Text style={{ fontSize: 20 }}>📞</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#FAFAFA" },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backBtn: { padding: 4 },
    backIcon: { fontSize: 28, marginTop: -4, color: "#111" },
    headerTitle: { fontSize: 16, color: "#111" },
    supportText: { fontSize: 14, color: GREEN },

    content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

    statusHero: { alignItems: 'center', marginBottom: 30 },
    etaTitle: { fontSize: 28, color: "#111", marginBottom: 6 },
    etaSubtitle: { fontSize: 15, color: "#777" },

    timelineCard: {
        backgroundColor: "white",
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        ...SHADOW,
    },
    stepRow: { flexDirection: 'row', minHeight: 44 },
    stepLeft: { alignItems: 'center', width: 24, marginRight: 16 },
    stepRight: { justifyContent: 'flex-start', paddingTop: 2 }, // Align text with dot top

    stepDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    dotActive: { backgroundColor: GREEN },
    dotIdle: { backgroundColor: "#E0E0E0" },

    stepLine: {
        width: 2,
        flex: 1,
        marginVertical: 4,
        borderRadius: 1,
    },
    lineActive: { backgroundColor: GREEN },
    lineIdle: { backgroundColor: "#E0E0E0" },

    stepLabel: { fontSize: 16 },

    courierCard: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 16,
        ...SHADOW,
    },
    courierRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#eee" },
    courierName: { fontSize: 18, color: "#111", marginBottom: 2 },
    courierRole: { fontSize: 13, color: "#777" },
    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F0F9F4",
        alignItems: 'center',
        justifyContent: 'center',
    },
});
