import React, { useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Pressable,
    FlatList,
} from "react-native";
import AddressCard from "../../shared/components/AddressCard";
import EmptyState from "../../shared/components/EmptyState";
import { useAddressStore } from "../../state/address/addressStore";

export default function AddressesScreen({ navigation }: any) {
    const { addresses, selectedAddressId, selectAddress, seedIfEmpty } =
        useAddressStore();

    // optional: seed demo data during dev
    useEffect(() => {
        seedIfEmpty();
    }, [seedIfEmpty]);

    const hasAddresses = addresses.length > 0;

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.title}>Addresses</Text>
            </View>

            {hasAddresses ? (
                <FlatList
                    contentContainerStyle={styles.list}
                    data={addresses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AddressCard
                            title={item.title}
                            subtitle={item.subtitle}
                            selected={item.id === selectedAddressId}
                            onPress={() => selectAddress(item.id)}
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                />
            ) : (
                <View style={{ flex: 1 }}>
                    <EmptyState
                        title="No addresses yet"
                        subtitle="Add your delivery addresses to get started."
                    />
                </View>
            )}

            <View style={styles.bottom}>
                <Pressable
                    onPress={() => navigation.navigate("AddAddress")}
                    style={styles.primaryBtn}
                >
                    <Text style={styles.primaryText}>Add new address</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F6F6F4" },
    header: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },
    backIcon: { fontSize: 18, fontWeight: "900" },
    title: {
        fontSize: 40,
        fontWeight: "900",
        color: "#1B1B1B",
        letterSpacing: -0.5,
    },
    list: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 120,
    },
    bottom: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        backgroundColor: "transparent",
    },
    primaryBtn: {
        height: 58,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#18A05E",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 3,
    },
    primaryText: {
        color: "white",
        fontSize: 18,
        fontWeight: "900",
    },
});
