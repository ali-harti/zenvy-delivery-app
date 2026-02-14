import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Platform,
    ScrollView,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart, formatMAD } from "../../state/cart/CartContext";
// import { useOrders } from "../../state/orders/OrdersContext"; // Context likely not needed if using store directly
import { useAddressStore } from "../../state/address/addressStore";
import { useOrdersStore } from "../../state/orders/ordersStore";
import { useNotificationsStore } from "../../state/notifications/notifications.store";

type PaymentMethod = "COD" | "CARD";

export default function CheckoutScreen() {
    const navigation = useNavigation<any>();
    const { state, subtotalMAD, totalMAD, clearCart } = useCart();
    // const { addOrder } = useOrders(); // Removed in favor of direct store usage
    const { addresses, selectedAddressId } = useAddressStore();

    // Payment
    const [payment, setPayment] = useState<PaymentMethod>("COD");

    // Error state
    const [hasError, setHasError] = useState(false);

    // Success Modal
    const [showSuccess, setShowSuccess] = useState(false);

    const selectedAddress = useMemo(() => {
        return addresses.find(a => a.id === selectedAddressId);
    }, [addresses, selectedAddressId]);

    const addressLabel = selectedAddress?.title ?? "Choose an address";
    const addressValue = selectedAddress?.subtitle ?? "Tap change to select delivery location";

    const placeOrder = async () => {
        // UI-only for now (wire to backend later)
        if (payment === "CARD") {
            setHasError(true);
            return;
        }

        setHasError(false);

        const deliveryFee = state.deliveryFeeMAD;
        const serviceFee = state.serviceFeeMAD;

        // IMPORTANT: build immutable snapshot items
        const itemsSnapshot = state.items.map((it) => ({
            productId: it.id,
            name: it.name,
            image: it.imageUrl,
            qty: it.qty,
            unitPrice: it.unitPrice,
        }));

        const subtotal = itemsSnapshot.reduce((s, it) => s + (it.qty * it.unitPrice), 0);
        const total = subtotal + deliveryFee + serviceFee;

        // Create Order Object
        const newOrder: any = {
            id: `ord_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
            storeId: state.items[0]?.storeId || "store_1",
            storeName: state.items[0]?.storeName || "Store Name",
            createdAtISO: new Date().toISOString(),
            status: "ON_THE_WAY",
            items: itemsSnapshot,
            money: {
                subtotal,
                deliveryFee,
                serviceFee,
                total,
            }
        };

        console.log("PLACING ORDER:", newOrder);

        // 1. Add to Order History (Persistence - using getState for reliability)
        useOrdersStore.getState().addOrder(newOrder);

        // 1b. Trigger Notification
        useNotificationsStore.getState().addNotification({
            id: `not_placed_${newOrder.id}`,
            type: "ORDER",
            title: "Order Placed Successfully",
            message: `Your order from ${newOrder.storeName} has been placed.`,
            timeLabel: "Just now",
            createdAtISO: new Date().toISOString(),
            meta: { orderId: newOrder.id },
        });

        console.log("ORDER ADDED. Checking store length...", useOrdersStore.getState().orders.length);

        // 2. Clear Cart (Persistent)
        clearCart();

        // 3. Show Success Modal
        setShowSuccess(true);
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        // Navigate to Orders tab
        navigation.navigate("Orders", { screen: "OrdersList" });
    };

    return (
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={10}>
                    <MaterialCommunityIcons name="chevron-left" size={22} color="#111" />
                </Pressable>

                <Text style={styles.headerTitle}>Checkout</Text>

                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Error banner */}
                {hasError && (
                    <View style={styles.errorBanner}>
                        <MaterialCommunityIcons name="alert-circle" size={18} color="#fff" />
                        <Text style={styles.errorText}>Payment failed. Please try again.</Text>
                    </View>
                )}

                {/* Delivery Address */}
                <View style={[styles.card, hasError && styles.cardSoft]}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Delivery Address</Text>
                        <Pressable
                            onPress={() => navigation.navigate('Addresses')}
                            hitSlop={10}
                        >
                            <Text style={styles.link}>Change</Text>
                        </Pressable>
                    </View>

                    <View style={styles.addressRow}>
                        <MaterialCommunityIcons name="map-marker-outline" size={18} color="#6A6A6A" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.addressName}>{addressLabel}</Text>
                            <Text style={styles.addressValue}>{addressValue}</Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Time (Simplified) */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Delivery Time</Text>
                    <View style={styles.stdDeliveryRow}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#0E9F6E" />
                        <Text style={styles.stdDeliveryText}>Standard Delivery (20–30 min)</Text>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={[styles.card, hasError && payment === "CARD" ? styles.cardError : null]}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Payment Method</Text>
                        {hasError && payment === "CARD" && (
                            <MaterialCommunityIcons name="alert-circle" size={18} color="#E02424" />
                        )}
                    </View>

                    <RadioRow
                        label="Cash on Delivery"
                        selected={payment === "COD"}
                        onPress={() => {
                            setPayment("COD");
                            setHasError(false);
                        }}
                    />

                    <RadioRow
                        label="Credit or Debit Card"
                        selected={payment === "CARD"}
                        onPress={() => setPayment("CARD")}
                    />

                    <Pressable onPress={() => null}>
                        <Text style={styles.addNew}>＋ Add new card</Text>
                    </Pressable>
                </View>

                {/* Order Summary */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Order Summary</Text>

                    <View style={{ marginTop: 10 }}>
                        {state.items.map((it) => (
                            <View key={it.id} style={styles.summaryRow}>
                                <Text style={styles.summaryLeft}>
                                    {it.qty}x {it.name}
                                </Text>
                                <Text style={styles.summaryRight}>
                                    {formatMAD(it.unitPrice * it.qty)}
                                </Text>
                            </View>
                        ))}

                        <View style={styles.hr} />

                        <SummaryLine label="Delivery fee" value={formatMAD(state.deliveryFeeMAD)} />
                        <SummaryLine label="Service fee" value={formatMAD(state.serviceFeeMAD)} />

                        {!!state.promoDiscountMAD && (
                            <SummaryLine
                                label="Promo discount"
                                value={`- ${formatMAD(state.promoDiscountMAD)}`}
                            />
                        )}

                        <View style={styles.hr} />

                        <SummaryLine label="Total" value={formatMAD(totalMAD)} strong />
                    </View>
                </View>

                {/* Place Order */}
                <Pressable onPress={placeOrder} style={styles.cta}>
                    <Text style={styles.ctaText}>Place Order</Text>
                </Pressable>

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* Premium Success Modal */}
            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.successCard}>
                        <View style={styles.successIconOuter}>
                            <View style={styles.successIconInner}>
                                <MaterialCommunityIcons name="check" size={32} color="#fff" />
                            </View>
                        </View>

                        <Text style={styles.successTitle}>Order Placed!</Text>
                        <Text style={styles.successSub}>
                            Your order has been accepted and is being prepared.
                        </Text>

                        <Pressable onPress={handleCloseSuccess} style={styles.successBtn}>
                            <Text style={styles.successBtnText}>Track Order</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

function RadioRow({
    label,
    selected,
    onPress,
}: {
    label: string;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress} style={styles.radioRow}>
            <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
                {selected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{label}</Text>
        </Pressable>
    );
}

function SummaryLine({
    label,
    value,
    strong,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, strong && styles.summaryStrong]}>{label}</Text>
            <Text style={[styles.summaryValue, strong && styles.summaryStrong]}>{value}</Text>
        </View>
    );
}

const SHADOW = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
    },
    android: { elevation: 6 },
});

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F6F6F6" },

    header: {
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 6,
        flexDirection: "row",
        alignItems: "center",
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.85)",
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW,
    },
    headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "900", color: "#111" },

    scroll: { padding: 16, paddingBottom: 22 },

    errorBanner: {
        backgroundColor: "#E02424",
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        ...SHADOW,
    },
    errorText: { color: "#fff", fontWeight: "800", fontSize: 13 },

    card: {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 22,
        padding: 14,
        marginBottom: 14,
        ...SHADOW,
    },
    cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    cardTitle: { fontSize: 14.5, fontWeight: "900", color: "#111" },
    link: { fontSize: 13.5, fontWeight: "900", color: "#0E9F6E" },

    addressRow: { marginTop: 10, flexDirection: "row", gap: 10, alignItems: "center" },
    addressName: { fontWeight: "900", color: "#111" },
    addressValue: { marginTop: 2, color: "#6A6A6A", fontWeight: "700", fontSize: 12.5 },

    stdDeliveryRow: {
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(14, 159, 110, 0.08)",
        padding: 12,
        borderRadius: 12,
    },
    stdDeliveryText: { color: "#0E9F6E", fontWeight: "800", fontSize: 13.5 },

    radioRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.20)",
        alignItems: "center",
        justifyContent: "center",
    },
    radioOuterActive: { borderColor: "#0E9F6E" },
    radioInner: { width: 10, height: 10, borderRadius: 999, backgroundColor: "#0E9F6E" },
    radioLabel: { fontSize: 14, fontWeight: "800", color: "#111" },

    addNew: { marginTop: 4, fontWeight: "900", color: "#0E9F6E" },

    summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
    summaryLeft: { color: "#111", fontWeight: "800" },
    summaryRight: { color: "#111", fontWeight: "900" },
    summaryLabel: { color: "#6A6A6A", fontWeight: "800" },
    summaryValue: { color: "#111", fontWeight: "900" },
    summaryStrong: { fontSize: 16, fontWeight: "900", color: "#111" },
    hr: { height: 1, backgroundColor: "rgba(0,0,0,0.10)", marginVertical: 10 },

    cta: {
        height: 56,
        borderRadius: 16,
        backgroundColor: "#0E9F6E",
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW,
    },
    ctaText: { color: "#fff", fontSize: 16, fontWeight: "900" },

    cardError: { borderWidth: 1.5, borderColor: "rgba(224,36,36,0.55)" },
    cardSoft: {},

    // Modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    successCard: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        ...SHADOW,
    },
    successIconOuter: {
        width: 72,
        height: 72,
        borderRadius: 999,
        backgroundColor: "#DEF7EC",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    successIconInner: {
        width: 52,
        height: 52,
        borderRadius: 999,
        backgroundColor: "#0E9F6E",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0E9F6E",
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    successTitle: { fontSize: 20, fontWeight: "900", color: "#111", marginBottom: 8 },
    successSub: { fontSize: 14, color: "#6A6A6A", textAlign: "center", marginBottom: 24 },
    successBtn: {
        width: "100%",
        height: 50,
        borderRadius: 14,
        backgroundColor: "#0E9F6E",
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW,
    },
    successBtnText: { color: "#fff", fontWeight: "900", fontSize: 15 },
});
