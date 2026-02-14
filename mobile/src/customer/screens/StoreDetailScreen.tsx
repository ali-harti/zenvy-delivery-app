import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCart } from "../../state/cart/CartContext";
import { AppSafeScreen } from "../../shared/components/AppSafeScreen";
import { MOROCCAN_STORES, STORE_PRODUCTS, Product } from "../seed/storeProductData";
import { formatMADDecimal } from "../../utils/currency";

type TabKey = "Popular" | "Menu" | "Offers";

const COLORS = {
    bg: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
    line: "#E5E7EB",
    primary: "#17A673",
    primaryDark: "#12835A",
};

export default function StoreDetailScreen({ navigation, route }: any) {
    const storeId = route?.params?.storeId ?? "s1";
    const [tab, setTab] = useState<TabKey>("Popular");


    const { state, addItem } = useCart();
    const totalQty = state.items.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = state.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

    // Get store data
    const store = MOROCCAN_STORES.find((s) => s.id === storeId) || MOROCCAN_STORES[0];

    // Get products for this store filtered by tab
    const data = useMemo(() => {
        const allProducts = STORE_PRODUCTS[storeId] || [];
        return allProducts.filter((p) => p.tabs.includes(tab));
    }, [storeId, tab]);

    const handleAddItem = (product: Product) => {
        addItem(
            {
                id: product.id,
                storeId: product.storeId,
                storeName: store.name,
                name: product.name,
                imageUrl: product.image,
                unitPrice: product.price,
            },
            1
        );
    };

    return (
        <AppSafeScreen style={styles.safe}>
            {/* Top header */}
            <View style={styles.topBar}>
                <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={10}>
                    <MaterialCommunityIcons name="chevron-left" size={26} color={COLORS.text} />
                </Pressable>

                <Text style={styles.topTitle} numberOfLines={1}>
                    {store.name}
                </Text>

                <View style={styles.rightIcons}>
                    <Pressable style={styles.iconBtn} onPress={() => { }} hitSlop={10}>
                        <MaterialCommunityIcons name="heart-outline" size={22} color={COLORS.text} />
                    </Pressable>
                    <Pressable style={styles.iconBtn} onPress={() => { }} hitSlop={10}>
                        <MaterialCommunityIcons name="share-variant-outline" size={22} color={COLORS.text} />
                    </Pressable>
                </View>
            </View>

            <FlatList
                data={data}
                keyExtractor={(x) => x.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                ListHeaderComponent={
                    <>
                        {/* Hero */}
                        <View style={styles.heroWrap}>
                            <Image source={{ uri: store.heroImage }} style={styles.hero} />
                            <View style={styles.heroOverlay}>
                                <View style={styles.heroStat}>
                                    <Text style={styles.heroStatMain}>{store.rating.toFixed(1)}</Text>
                                    <Text style={styles.heroStatLabel}>rating</Text>
                                </View>
                                <View style={styles.heroStat}>
                                    <Text style={styles.heroStatMain}>{store.eta}</Text>
                                    <Text style={styles.heroStatLabel}>ETA</Text>
                                </View>
                                <View style={styles.heroStat}>
                                    <Text style={styles.heroStatMain}>{formatMADDecimal(store.deliveryFee)}</Text>
                                    <Text style={styles.heroStatLabel}>delivery fee</Text>
                                </View>
                                <View style={styles.openPill}>
                                    <Text style={styles.openPillText}>Open</Text>
                                </View>
                            </View>
                        </View>

                        {/* Tabs */}
                        <View style={styles.tabsRow}>
                            {(["Popular", "Menu", "Offers"] as TabKey[]).map((t) => {
                                const isOn = t === tab;
                                return (
                                    <Pressable
                                        key={t}
                                        style={styles.tabBtn}
                                        onPress={() => setTab(t)}
                                    >
                                        <Text style={[styles.tabText, isOn && styles.tabTextOn]}>
                                            {t}
                                        </Text>
                                        {isOn ? <View style={styles.tabLine} /> : <View style={styles.tabLineOff} />}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.productCard}
                        onPress={() => navigation.navigate("ProductDetail", {
                            storeId: store.id,
                            storeName: store.name,
                            productId: item.id,
                        })}
                    >
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <Text style={styles.pTitle}>{item.name}</Text>
                            <Text style={styles.pDesc} numberOfLines={2}>
                                {item.desc}
                            </Text>
                            <Text style={styles.pPrice}>{formatMADDecimal(item.price)}</Text>
                        </View>

                        <View style={styles.pRight}>
                            <Image source={{ uri: item.image }} style={styles.pImg} />
                            <Pressable
                                style={styles.plusBtn}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleAddItem(item);
                                }}
                            >
                                <MaterialCommunityIcons name="plus" size={22} color="#FFF" />
                            </Pressable>
                        </View>
                    </Pressable>
                )}
            />

            {/* Sticky cart bar */}
            {totalQty > 0 ? (
                <Pressable style={styles.cartBar} onPress={() => navigation.navigate("Cart")}>
                    <View style={styles.cartLeft}>
                        <MaterialCommunityIcons name="cart-outline" size={22} color="#FFFFFF" />
                        <View>
                            <Text style={styles.cartTitle}>View Cart</Text>
                            <Text style={styles.cartSub}>
                                {totalQty} items — {formatMADDecimal(totalPrice)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cartRight}>
                        <MaterialCommunityIcons name="chevron-right" size={22} color="#FFFFFF" />
                    </View>
                </Pressable>
            ) : null}
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },

    topBar: {
        height: 54,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: COLORS.line,
        alignItems: "center",
        justifyContent: "center",
    },
    topTitle: { flex: 1, fontSize: 18, fontWeight: "900", color: COLORS.text },
    rightIcons: { flexDirection: "row", gap: 10 },

    heroWrap: { paddingHorizontal: 16, paddingTop: 6 },
    hero: {
        width: "100%",
        height: 190,
        borderRadius: 18,
    },
    heroOverlay: {
        position: "absolute",
        left: 26,
        right: 26,
        bottom: 14,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    heroStat: {
        backgroundColor: "rgba(0,0,0,0.42)",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: "center",
    },
    heroStatMain: { color: "#FFF", fontWeight: "900" },
    heroStatLabel: { color: "rgba(255,255,255,0.85)", fontSize: 11, marginTop: 2 },
    openPill: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
    },
    openPillText: { color: "#FFF", fontWeight: "900" },

    tabsRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginTop: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.line,
    },
    tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center" },
    tabText: { fontWeight: "800", color: COLORS.muted },
    tabTextOn: { color: COLORS.primaryDark },
    tabLine: {
        marginTop: 8,
        height: 3,
        width: "60%",
        backgroundColor: COLORS.primary,
        borderRadius: 999,
    },
    tabLineOff: { marginTop: 8, height: 3, width: "60%", backgroundColor: "transparent" },

    productCard: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 18,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: COLORS.line,
        padding: 14,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
    },
    pTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },
    pDesc: { marginTop: 4, color: COLORS.muted, fontWeight: "600" },
    pPrice: { marginTop: 10, fontWeight: "900", fontSize: 16, color: COLORS.text },

    pRight: { width: 96, height: 76 },
    pImg: { width: 96, height: 76, borderRadius: 14 },
    plusBtn: {
        position: "absolute",
        right: -6,
        bottom: -10,
        width: 38,
        height: 38,
        borderRadius: 999,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#FFF",
        shadowColor: "#000",
        shadowOpacity: 0.14,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 7,
    },

    cartBar: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 18,
        height: 64,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    cartLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    cartTitle: { color: "#FFF", fontWeight: "900", fontSize: 16 },
    cartSub: { color: "rgba(255,255,255,0.92)", fontWeight: "700", marginTop: 2 },
    cartRight: { width: 40, height: 40, borderRadius: 999, alignItems: "center", justifyContent: "center" },
});
