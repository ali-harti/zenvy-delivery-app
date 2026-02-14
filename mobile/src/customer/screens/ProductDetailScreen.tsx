import React, { useMemo, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Pressable,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCart, formatMAD } from "../../state/cart/CartContext";
import { STORE_PRODUCTS, Product as SeedProduct } from "../seed/storeProductData";
import { MOROCCO_PRODUCTS } from "../seed/moroccoProducts";

type Product = {
    id: string;
    name: string;
    description: string;
    priceMAD: number;
    imageUrl: string;
};

/**
 * Fetch product details by productId from seed data
 * Replace this with actual backend API call: GET /products/:productId
 */
async function fetchProductById(productId: string, storeId?: string): Promise<Product> {
    // Simulate async fetch
    await new Promise(resolve => setTimeout(resolve, 100));

    // Try to find in STORE_PRODUCTS first (more detailed data)
    if (storeId && STORE_PRODUCTS[storeId]) {
        const product = STORE_PRODUCTS[storeId].find(p => p.id === productId);
        if (product) {
            return {
                id: product.id,
                name: product.name,
                description: product.desc,
                priceMAD: product.price,
                imageUrl: product.image,
            };
        }
    }

    // Try MOROCCO_PRODUCTS
    const moroccoProduct = MOROCCO_PRODUCTS.find(p => p.id.toString() === productId);
    if (moroccoProduct) {
        return {
            id: moroccoProduct.id.toString(),
            name: moroccoProduct.name,
            description: moroccoProduct.description,
            priceMAD: moroccoProduct.price,
            imageUrl: moroccoProduct.imageUrl,
        };
    }

    // Fallback - product not found, return placeholder
    console.warn(`Product ${productId} not found in seed data`);
    return {
        id: productId,
        name: `Product ${productId}`,
        description: "No description available.",
        priceMAD: 0,
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    };
}

export default function ProductDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { storeId, storeName, productId } = route.params || {};

    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState(1);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productId) {
            setLoading(true);
            fetchProductById(productId, storeId)
                .then(setProduct)
                .finally(() => setLoading(false));
        }
    }, [productId, storeId]);

    const totalLine = useMemo(() => {
        const unit = product?.priceMAD ?? 0;
        return unit * qty;
    }, [product?.priceMAD, qty]);

    const onAdd = () => {
        if (!product) return;
        addItem(
            {
                id: product.id,
                storeId: storeId || "",
                storeName: storeName || "Unknown Store",
                name: product.name,
                imageUrl: product.imageUrl,
                unitPrice: product.priceMAD,
            },
            qty
        );
        navigation.navigate("Cart");
    };

    return (
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={10}>
                    <MaterialCommunityIcons name="chevron-left" size={22} color="#111" />
                </Pressable>
                <View style={{ flex: 1 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.heroWrap}>
                    <Image
                        source={{ uri: product?.imageUrl }}
                        style={styles.hero}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.sheet}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>
                            {loading ? "Loading..." : product?.name ?? "Product"}
                        </Text>
                        <Text style={styles.price}>{formatMAD(product?.priceMAD ?? 0)}</Text>
                    </View>

                    <Text style={styles.desc}>
                        {loading ? " " : product?.description ?? "No description available."}
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Quantity</Text>

                    <View style={styles.qtyRow}>
                        <View style={styles.qtyPill}>
                            <Pressable
                                onPress={() => setQty((q) => Math.max(1, q - 1))}
                                style={styles.qtyBtn}
                                hitSlop={10}
                            >
                                <MaterialCommunityIcons name="minus" size={18} color="#111" />
                            </Pressable>

                            <Text style={styles.qtyValue}>{qty}</Text>

                            <Pressable
                                onPress={() => setQty((q) => q + 1)}
                                style={[styles.qtyBtn, styles.qtyBtnPlus]}
                                hitSlop={10}
                            >
                                <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                            </Pressable>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Special instructions</Text>
                    <View style={styles.inputWrap}>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="E.g., No onions, extra sauce..."
                            placeholderTextColor="#8A8A8A"
                            style={styles.input}
                            multiline
                        />
                    </View>

                    <Pressable onPress={onAdd} style={styles.primaryBtn} disabled={loading || !product}>
                        <Text style={styles.primaryBtnText}>
                            {loading ? "Loading..." : `Add to Cart — ${formatMAD(totalLine)}`}
                        </Text>
                    </Pressable>

                    <View style={{ height: 12 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
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
    scroll: { paddingBottom: 18 },
    heroWrap: { paddingHorizontal: 16, paddingTop: 6 },
    hero: { width: "100%", height: 360, borderRadius: 22, backgroundColor: "#EAEAEA", ...SHADOW },
    sheet: {
        marginTop: -26,
        marginHorizontal: 16,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 24,
        padding: 16,
        ...SHADOW,
    },
    titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    title: { flex: 1, fontSize: 26, fontWeight: "800", color: "#111" },
    price: { fontSize: 18, fontWeight: "800", color: "#111", paddingTop: 6 },
    desc: { marginTop: 8, fontSize: 14.5, lineHeight: 20, color: "#5A5A5A" },
    divider: { height: 1, backgroundColor: "rgba(0,0,0,0.08)", marginVertical: 14 },
    sectionTitle: { fontSize: 14, fontWeight: "800", color: "#111" },
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
        width: 42,
        height: 42,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignItems: "center",
        justifyContent: "center",
    },
    qtyBtnPlus: { backgroundColor: "#0E9F6E" },
    qtyValue: { width: 22, textAlign: "center", fontSize: 16, fontWeight: "800", color: "#111" },
    inputWrap: {
        marginTop: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.10)",
        backgroundColor: "rgba(255,255,255,0.75)",
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    input: { minHeight: 46, fontSize: 14.5, color: "#111" },
    primaryBtn: {
        marginTop: 16,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#0E9F6E",
        alignItems: "center",
        justifyContent: "center",
        ...SHADOW,
    },
    primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
