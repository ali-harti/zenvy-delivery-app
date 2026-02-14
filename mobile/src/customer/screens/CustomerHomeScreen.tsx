import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCart, formatMAD } from "../../state/cart/CartContext";
import { AppSafeScreen } from "../../shared/components/AppSafeScreen";
import { MOROCCAN_STORES, Store } from "../seed/storeProductData";
import { formatMADDecimal } from "../../utils/currency";
import { useNotificationsStore } from "../../state/notifications/notifications.store";

type Category = "All" | "Restaurants" | "Groceries" | "Pharmacy" | "Flowers";

const CATEGORIES: Category[] = [
    "All",
    "Restaurants",
    "Groceries",
    "Pharmacy",
    "Flowers",
];

const LOCATIONS = [
    "Home, Maarif, Casablanca",
    "Ain Diab, Casablanca",
    "Agdal, Rabat",
    "Gueliz, Marrakech",
    "Centre, Tanger",
];

const COLORS = {
    bg: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
    line: "#E5E7EB",
    chip: "#F3F4F6",
    primary: "#17A673",
    primaryDark: "#12835A",
    card: "#FFFFFF",
};

export default function CustomerHomeScreen({ navigation }: any) {

    const [active, setActive] = useState<Category>("All");
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState(LOCATIONS[0]);
    const [locOpen, setLocOpen] = useState(false);

    const notifications = useNotificationsStore((s) => s.notifications);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const { state, totalMAD } = useCart();
    const totalQty = state.items.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = totalMAD;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return MOROCCAN_STORES.filter((s) => {
            const byCat = active === "All" ? true : s.category === active;
            const byQ =
                !q ||
                s.name.toLowerCase().includes(q) ||
                s.category.toLowerCase().includes(q) ||
                s.city.toLowerCase().includes(q);
            return byCat && byQ;
        });
    }, [active, query]);

    return (
        <AppSafeScreen style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    style={styles.locationRow}
                    onPress={() => setLocOpen(true)}
                    hitSlop={10}
                >
                    <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={22}
                        color={COLORS.text}
                    />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {location}
                    </Text>
                    <MaterialCommunityIcons
                        name="chevron-down"
                        size={22}
                        color={COLORS.muted}
                    />
                </Pressable>


                <Pressable
                    style={styles.bell}
                    onPress={() => navigation.navigate("Notifications")}
                    hitSlop={12}
                >
                    <MaterialCommunityIcons
                        name="bell-outline"
                        size={22}
                        color={COLORS.text}
                    />
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                        </View>
                    )}
                </Pressable>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <MaterialCommunityIcons
                    name="magnify"
                    size={22}
                    color={COLORS.muted}
                />
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search for stores or items"
                    placeholderTextColor={COLORS.muted}
                    style={styles.searchInput}
                />
            </View>

            {/* Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
            >
                {CATEGORIES.map((c) => {
                    const isOn = c === active;
                    return (
                        <Pressable
                            key={c}
                            onPress={() => setActive(c)}
                            style={[
                                styles.chip,
                                isOn ? styles.chipOn : styles.chipOff,
                            ]}
                        >
                            <Text style={[styles.chipText, isOn && styles.chipTextOn]}>
                                {c}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Store grid */}
            <FlatList
                data={filtered}
                keyExtractor={(x) => x.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.gridRow}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.card}
                        onPress={() => navigation.navigate("StoreDetail", { storeId: item.id })}
                    >
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle} numberOfLines={1}>
                                {item.name}
                            </Text>

                            <View style={styles.metaRow}>
                                <View style={styles.pill}>
                                    <Text style={styles.pillText}>{item.category}</Text>
                                </View>
                                <View style={styles.starRow}>
                                    <MaterialCommunityIcons
                                        name="star"
                                        size={16}
                                        color="#F59E0B"
                                    />
                                    <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                                </View>
                            </View>

                            <View style={styles.statsRow}>
                                <View style={styles.stat}>
                                    <Text style={styles.statMain}>{item.eta}</Text>
                                    <Text style={styles.statLabel}>ETA</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.stat}>
                                    <Text style={styles.statMain}>{formatMADDecimal(item.deliveryFee)}</Text>
                                    <Text style={styles.statLabel}>delivery fee</Text>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                )}
            />

            {/* Floating cart bar */}
            {totalQty > 0 ? (
                <Pressable
                    style={styles.cartBar}
                    onPress={() => navigation.navigate("Cart")}
                >
                    <View style={styles.cartLeft}>
                        <MaterialCommunityIcons
                            name="cart-outline"
                            size={22}
                            color="#FFFFFF"
                        />
                        <Text style={styles.cartText}>
                            {totalQty} items — {formatMADDecimal(totalPrice)}
                        </Text>
                    </View>
                    <View style={styles.cartBtn}>
                        <Text style={styles.cartBtnText}>View Cart</Text>
                    </View>
                </Pressable>
            ) : null}

            {/* Location modal */}
            <Modal visible={locOpen} transparent animationType="fade">
                <Pressable style={styles.modalBackdrop} onPress={() => setLocOpen(false)}>
                    <Pressable style={styles.modalCard} onPress={() => null}>
                        <Text style={styles.modalTitle}>Choose location</Text>
                        {LOCATIONS.map((l) => (
                            <Pressable
                                key={l}
                                style={styles.modalItem}
                                onPress={() => {
                                    setLocation(l);
                                    setLocOpen(false);
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="map-marker-outline"
                                    size={20}
                                    color={COLORS.muted}
                                />
                                <Text style={styles.modalItemText} numberOfLines={1}>
                                    {l}
                                </Text>
                            </Pressable>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    header: {
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
        paddingRight: 10,
    },
    locationText: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
        maxWidth: "78%",
    },
    bell: {
        width: 40,
        height: 40,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    badge: {
        position: "absolute",
        right: 6,
        top: 6,
        minWidth: 18,
        height: 18,
        borderRadius: 999,
        backgroundColor: "#EF4444",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
    },
    badgeText: { color: "#FFF", fontWeight: "900", fontSize: 11 },

    searchWrap: {
        marginHorizontal: 16,
        height: 50,
        borderRadius: 14,
        backgroundColor: "#F3F4F6",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        gap: 10,
        borderWidth: 1,
        borderColor: COLORS.line,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },

    chipsRow: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 6,
        flexDirection: "row",
        gap: 10,
    },
    chip: {
        height: 36,
        paddingHorizontal: 16,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
    chipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    chipOff: { backgroundColor: "#FFF", borderColor: COLORS.line },
    chipText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
    chipTextOn: { color: "#FFF" },

    listContent: { paddingHorizontal: 16, paddingBottom: 110, paddingTop: 8 },
    gridRow: { gap: 12, marginBottom: 12 },
    card: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.line,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 4,
    },
    cardImage: { width: "100%", height: 108 },
    cardBody: { padding: 12 },
    cardTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: COLORS.text,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    pill: {
        backgroundColor: "#EAF7F1",
        paddingHorizontal: 10,
        height: 26,
        borderRadius: 999,
        justifyContent: "center",
    },
    pillText: { color: COLORS.primaryDark, fontWeight: "800", fontSize: 12 },
    starRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    rating: { fontWeight: "900", color: COLORS.text },

    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.line,
    },
    stat: { flex: 1 },
    statMain: { fontWeight: "900", color: COLORS.text },
    statLabel: { marginTop: 2, color: COLORS.muted, fontSize: 12 },
    divider: { width: 1, height: 34, backgroundColor: COLORS.line },

    cartBar: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 18,
        height: 58,
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
    cartLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    cartText: { color: "#FFF", fontWeight: "900", fontSize: 16 },
    cartBtn: {
        backgroundColor: "#FFF",
        height: 40,
        paddingHorizontal: 14,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    cartBtnText: { color: COLORS.primaryDark, fontWeight: "900" },

    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
    },
    modalCard: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 16,
    },
    modalTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text, marginBottom: 10 },
    modalItem: {
        height: 48,
        borderRadius: 14,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: COLORS.line,
        marginBottom: 10,
    },
    modalItemText: { flex: 1, color: COLORS.text, fontWeight: "700" },
});
