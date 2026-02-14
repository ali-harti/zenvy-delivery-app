import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';
import { radius } from '../../shared/theme/radius';
import { useCartStore } from '../../cart/store/cart.store';
import { formatMADDecimal } from '../../utils/currency';

type Props = {
    onPress: () => void;
};

export const FloatingCartBar = ({ onPress }: Props) => {
    const { count, total } = useCartStore();

    if (count === 0) return null;

    return (
        <Pressable
            style={({ pressed }) => [styles.cartBar, pressed && styles.pressed]}
            onPress={onPress}
        >
            <View style={styles.cartLeft}>
                <View style={styles.iconBadge}>
                    <MaterialCommunityIcons name="cart-outline" size={24} color={colors.white} />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{count}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.cartInfoText}>{count} items</Text>
                    <Text style={styles.cartTotalText}>{formatMADDecimal(total)}</Text>
                </View>
            </View>

            <View style={styles.rightWrap}>
                <Text style={styles.cartCTA}>View Cart</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.white} />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cartBar: {
        position: "absolute",
        left: spacing.l,
        right: spacing.l,
        bottom: Platform.OS === "ios" ? 20 : 16,
        height: 60, // Fixed height
        borderRadius: radius.l,
        backgroundColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.m,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    pressed: {
        transform: [{ scale: 0.98 }],
    },
    cartLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    iconBadge: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'red',
        borderRadius: 999,
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    badgeText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
    cartInfoText: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        fontWeight: "500"
    },
    cartTotalText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "800"
    },
    rightWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cartCTA: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "700"
    },
});
