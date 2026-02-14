import React, { useMemo } from "react";
import {
    View,
    StyleSheet,
    Pressable,
    FlatList,
    Platform,
} from "react-native";
import { Text } from "../../ui/Text";
import { useNotificationsStore } from "../../state/notifications/notifications.store";
import { AppIcon } from "../../shared/ui/AppIcon";

const BG = "#F6F6F4";
const GREEN = "#18A05E";

const SHADOW = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
    },
    android: { elevation: 6 },
});

function iconNameForType(type: string) {
    if (type === "ORDER") return "truck-delivery";
    if (type === "PROMO") return "ticket-percent";
    if (type === "RATING") return "star";
    return "bell";
}

export default function NotificationsScreen({ navigation }: any) {
    const { notifications, clearAll } = useNotificationsStore();

    const data = notifications;
    const isEmpty = data.length === 0;

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text weight="900" style={styles.backIcon}>‹</Text>
                </Pressable>

                <Text weight="900" style={styles.title}>Notifications</Text>

                {!isEmpty ? (
                    <Pressable onPress={clearAll} style={styles.clearBtn} hitSlop={10}>
                        <Text weight="700" style={styles.clearText}>Mark all read</Text>
                    </Pressable>
                ) : (
                    <View style={{ width: 44 }} />
                )}
            </View>

            {/* Content */}
            {isEmpty ? (
                <EmptyState />
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContent}
                    data={data}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                    renderItem={({ item }) => (
                        <NotificationCard item={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

function NotificationCard({ item }: any) {
    return (
        <View style={[styles.card, SHADOW]}>
            <View style={styles.iconWrap}>
                <View style={styles.iconCircle}>
                    <AppIcon
                        name={iconNameForType(item.type)}
                        size={24}
                        color={GREEN}
                    />
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                    <Text weight="900" style={styles.cardTitle}>
                        {item.title}
                    </Text>
                    <Text weight="700" style={styles.time}>
                        {item.timeLabel}
                    </Text>
                </View>

                <Text weight="600" style={styles.message}>
                    {item.message}
                </Text>
            </View>
        </View>
    );
}

function EmptyState() {
    return (
        <View style={styles.emptyWrap}>
            <View style={styles.emptyIconBox}>
                <AppIcon name="bell-off-outline" size={48} color="rgba(0,0,0,0.35)" />
            </View>

            <Text weight="900" style={styles.emptyTitle}>
                No notifications
            </Text>
            <Text weight="600" style={styles.emptySub}>
                You're all caught up!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: BG },

    header: {
        paddingTop: 44,
        paddingHorizontal: 16,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.92)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },
    backIcon: { fontSize: 28, marginTop: -2, color: "rgba(0,0,0,0.85)" },

    title: {
        fontSize: 24,
        letterSpacing: -0.8,
        color: "rgba(0,0,0,0.88)",
    },

    clearBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: "#EAEAEA",
        borderRadius: 8,
    },
    clearText: {
        fontSize: 12,
        color: "#555",
    },

    listContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 30,
    },

    card: {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        flexDirection: "row",
        gap: 12,
    },

    iconWrap: { justifyContent: "flex-start" },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "rgba(24,160,94,0.14)",
        alignItems: "center",
        justifyContent: "center",
    },

    cardBody: { flex: 1 },
    cardTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10,
    },
    cardTitle: { fontSize: 16, color: "rgba(0,0,0,0.9)" },
    time: { fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 2 },

    message: {
        marginTop: 6,
        fontSize: 14,
        color: "rgba(0,0,0,0.62)",
        lineHeight: 20,
    },

    emptyWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    emptyIconBox: {
        width: 110,
        height: 110,
        borderRadius: 26,
        backgroundColor: "rgba(255,255,255,0.7)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
        ...SHADOW,
    },
    emptyTitle: { fontSize: 22, color: "rgba(0,0,0,0.82)" },
    emptySub: { marginTop: 6, fontSize: 14, color: "rgba(0,0,0,0.55)" },
});
