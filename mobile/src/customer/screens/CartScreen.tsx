import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    TextInput,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart, formatMAD } from "../../state/cart/CartContext";

export default function CartScreen() {
    const navigation = useNavigation<any>();
    const { state, inc, dec, removeItem, applyPromo, clearPromo, subtotalMAD, totalMAD } =
        useCart();

    const [promo, setPromo] = useState(state.promoCode ?? "");

    const isEmpty = state.items.length === 0;

    // Group items by store
    const itemsByStore = useMemo(() => {
        const groups: Record<string, typeof state.items> = {};
        state.items.forEach((item) => {
            if (!groups[item.storeId]) {
                groups[item.storeId] = [];
            }
            groups[item.storeId].push(item);
        });
        return groups;
    }, [state.items]);

    const onApplyPromo = () => {
        if (!promo.trim()) return;
        applyPromo(promo);
    };

    return (
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={10}>
                    <MaterialCommunityIcons name="chevron-left" size={22} color="#111" />
                </Pressable>
                <Text style={styles.headerTitle}>Cart</Text>
                <View style={{ width: 40 }} />
            </View>

            {isEmpty ? (
                // Empty state
                <View style={styles.emptyWrap}>
                    <View style={styles.emptyIcon}>
                        <MaterialCommunityIcons name="shopping-outline" size={34} color="#111" />
                    </View>
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySub}>Looks like you haven't added anything yet.</Text>

                    <Pressable
                        onPress={() => navigation.navigate("CustomerHome")}
                        style={styles.primaryBtn}
                    >
                        <Text style={styles.primaryBtnText}>Browse stores</Text>
                    </Pressable>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {/* Store cards - one per store */}
                    {Object.entries(itemsByStore).map(([storeId, items]) => {
                        const storeName = items[0]?.storeName || "Unknown Store";

                        return (
                            <View key={storeId} style={styles.card}>
                                <Text style={styles.storeName}>{storeName}</Text>
                                <Text style={styles.storeMeta}>
                                    <MaterialCommunityIcons name="bicycle" size={14} color="#6A6A6A" />{" "}
                                    Store details • 25–35 min
                                </Text>

                                <View style={styles.divider} />

                                {/* Items for this store */}
                                {items.map((item) => (
                                    <View key={item.id} style={styles.itemRow}>
                                        <Image source={{ uri: item.imageUrl }} style={styles.itemImg} />
                                        <View style={styles.itemInfo}>
                                            <View style={styles.itemTopRow}>
                                                <Text numberOfLines={1} style={styles.itemName}>
                                                    {item.name}
                                                </Text>

                                                <Pressable
                                                    onPress={() => removeItem(item.id)}
                                                    hitSlop={10}
                                                    style={styles.trashBtn}
                                                >
                                                    <MaterialCommunityIcons name="trash-can-outline" size={18} color="#6A6A6A" />
                                                </Pressable>
                                            </View>

                                            <Text style={styles.itemPrice}>{formatMAD(item.unitPrice)}</Text>

                                            <View style={styles.qtyRow}>
                                                <View style={styles.qtyPill}>
                                                    <Pressable onPress={() => dec(item.id)} style={styles.qtyBtn} hitSlop={10}>
                                                        <MaterialCommunityIcons name="minus" size={18} color="#111" />
                                                    </Pressable>

                                                    <Text style={styles.qtyValue}>{item.qty}</Text>

                                                    <Pressable
                                                        onPress={() => inc(item.id)}
                                                        style={[styles.qtyBtn, styles.qtyBtnPlus]}
                                                        hitSlop={10}
                                                    >
                                                        <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                                                    </Pressable>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        );
                    })}

                    {/* Promo */}
                    <View style={styles.promoCard}>
                        <Text style={styles.promoTitle}>Promo code</Text>
                        <View style={styles.promoRow}>
                            <View style={styles.promoInputWrap}>
                                <TextInput
                                    value={promo}
                                    onChangeText={setPromo}
                                    placeholder="Enter promo code"
                                    placeholderTextColor="#8A8A8A"
                                    autoCapitalize="characters"
                                    style={styles.promoInput}
                                />
                            </View>

                            <Pressable onPress={onApplyPromo} style={styles.applyBtn}>
                                <Text style={styles.applyBtnText}>Apply</Text>
                            </Pressable>
                        </View>

                        {!!state.promoCode && (
                            <View style={styles.promoAppliedRow}>
                                <Text style={styles.promoAppliedText}>
                                    Applied: <Text style={{ fontWeight: "900" }}>{state.promoCode}</Text>
                                </Text>
                                <Pressable onPress={clearPromo} hitSlop={10}>
                                    <Text style={styles.removePromo}>Remove</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>

                    {/* Totals */}
                    <View style={styles.totalCard}>
                        <Row label="Subtotal" value={formatMAD(subtotalMAD)} />
                        <Row label="Delivery fee" value={formatMAD(state.deliveryFeeMAD)} />
                        <Row label="Service fee" value={formatMAD(state.serviceFeeMAD)} />
                        {!!state.promoDiscountMAD && (
                            <Row label="Promo discount" value={`- ${formatMAD(state.promoDiscountMAD)}`} />
                        )}
                        <View style={styles.totalDivider} />
                        <Row label="Total" value={formatMAD(totalMAD)} strong />
                    </View>

                    {/* CTA */}
                    <Pressable
                        onPress={() => navigation.navigate("Checkout")}
                        style={styles.checkoutBtn}
                    >
                        <Text style={styles.checkoutText}>Checkout</Text>
                    </Pressable>

                    <Text style={styles.terms}>
                        By continuing you agree to Terms & Privacy Policy
                    </Text>

                    <View style={{ height: 24 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

function Row({
    label,
    value,
    strong,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <View style={styles.row}>
            <Text style={[styles.rowLabel, strong && styles.rowStrong]}>{label}</Text>
            <Text style={[styles.rowValue, strong && styles.rowStrong]}>{value}</Text>
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

    card: {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 22,
        padding: 14,
        marginBottom: 14,
        ...SHADOW,
    },
    storeName: { fontSize: 18, fontWeight: "900", color: "#111" },
    storeMeta: { marginTop: 4, fontSize: 12.5, color: "#6A6A6A" },
    divider: { height: 1, backgroundColor: "rgba(0,0,0,0.08)", marginVertical: 12 },

    itemRow: { flexDirection: "row", gap: 12, paddingVertical: 10 },
    itemImg: { width: 56, height: 56, borderRadius: 14, backgroundColor: "#EAEAEA" },
    itemInfo: { flex: 1 },
    itemTopRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    itemName: { flex: 1, fontSize: 16, fontWeight: "800", color: "#111" },
    trashBtn: { width: 34, height: 34, borderRadius: 999, alignItems: "center", justifyContent: "center" },
    itemPrice: { marginTop: 3, fontSize: 13, color: "#6A6A6A", fontWeight: "700" },

    qtyRow: { marginTop: 10, alignItems: "flex-end" },
    qtyPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.04)",
        borderRadius: 999,
        padding: 6,
        gap: 10,
    },
    qtyBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignItems: "center",
        justifyContent: "center",
    },
    qtyBtnPlus: { backgroundColor: "#0E9F6E" },
    qtyValue: { width: 22, textAlign: "center", fontSize: 16, fontWeight: "900", color: "#111" },

    promoCard: {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 22,
        padding: 14,
        marginBottom: 14,
        ...SHADOW,
    },
    promoTitle: { fontSize: 13.5, fontWeight: "900", color: "#111" },
    promoRow: { marginTop: 10, flexDirection: "row", gap: 10, alignItems: "center" },
    promoInputWrap: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.10)",
        backgroundColor: "rgba(255,255,255,0.75)",
        paddingHorizontal: 12,
        height: 48,
        justifyContent: "center",
    },
    promoInput: { fontSize: 14.5, color: "#111" },
    applyBtn: {
        height: 48,
        paddingHorizontal: 18,
        borderRadius: 14,
        backgroundColor: "#0E9F6E",
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW,
    },
    applyBtnText: { color: "#fff", fontWeight: "900" },
    promoAppliedRow: { marginTop: 10, flexDirection: "row", justifyContent: "space-between" },
    promoAppliedText: { color: "#4A4A4A", fontSize: 12.5 },
    removePromo: { color: "#0E9F6E", fontWeight: "900", fontSize: 12.5 },

    totalCard: {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 22,
        padding: 14,
        marginBottom: 14,
        ...SHADOW,
    },
    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
    rowLabel: { fontSize: 14, color: "#5A5A5A", fontWeight: "700" },
    rowValue: { fontSize: 14, color: "#111", fontWeight: "800" },
    rowStrong: { fontWeight: "900", fontSize: 16, color: "#111" },
    totalDivider: { height: 1, backgroundColor: "rgba(0,0,0,0.10)", marginVertical: 8 },

    checkoutBtn: {
        height: 56,
        borderRadius: 16,
        backgroundColor: "#0E9F6E",
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW,
    },
    checkoutText: { color: "#fff", fontSize: 16, fontWeight: "900" },
    terms: { marginTop: 10, textAlign: "center", fontSize: 11.5, color: "#7A7A7A" },

    emptyWrap: { flex: 1, padding: 18, alignItems: "center", justifyContent: "center" },
    emptyIcon: {
        width: 74,
        height: 74,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW,
    },
    emptyTitle: { marginTop: 14, fontSize: 18, fontWeight: "900", color: "#111" },
    emptySub: { marginTop: 6, fontSize: 13, color: "#6A6A6A", textAlign: "center" },

    primaryBtn: {
        marginTop: 16,
        height: 52,
        paddingHorizontal: 18,
        borderRadius: 16,
        backgroundColor: "#0E9F6E",
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW,
    },
    primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "900" },
});
