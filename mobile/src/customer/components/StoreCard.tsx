import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';
import { radius } from '../../shared/theme/radius';

const { width } = Dimensions.get("window");
const CARD_GAP = 14;
const H_PADDING = 18;
const CARD_WIDTH = (width - H_PADDING * 2 - CARD_GAP) / 2;

export type StoreProps = {
    id: string;
    title: string;
    category: string;
    rating: number;
    eta: string;
    fee: string;
    image: any;
};

type Props = {
    store: StoreProps;
    onPress: (id: string) => void;
};

export const StoreCard = ({ store, onPress }: Props) => {
    return (
        <Pressable
            onPress={() => onPress(store.id)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
            <Image source={store.image} style={styles.cardImage} resizeMode="cover" />

            <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {store.title}
                </Text>

                <View style={styles.pill}>
                    <Text style={styles.pillText}>{store.category}</Text>
                </View>

                <View style={styles.cardMetaRow}>
                    <View style={styles.ratingWrap}>
                        <Text style={styles.ratingText}>{(store.rating || 0).toFixed(1)}</Text>
                        <MaterialCommunityIcons name="star" size={14} color={colors.primary} />
                    </View>

                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{store.eta}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{store.fee}</Text>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        borderRadius: radius.m,
        backgroundColor: colors.white,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        marginBottom: spacing.s,
    },
    cardPressed: {
        transform: [{ scale: 0.98 }], // Micro-interaction
        opacity: 0.9,
    },
    cardImage: {
        width: "100%",
        height: 120, // Fixed height per specs
        backgroundColor: colors.gray100,
    },
    cardBody: {
        padding: spacing.s,
        paddingBottom: spacing.m
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: 4,
    },
    pill: {
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: colors.primaryLight, // Ensure this exists or use hex
        marginBottom: 8,
    },
    pillText: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.primary
    },
    cardMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: 'wrap',
    },
    ratingWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        backgroundColor: colors.surface,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.textPrimary
    },
    metaText: {
        fontSize: 12,
        fontWeight: "500",
        color: colors.textSecondary
    },
    metaDot: {
        marginHorizontal: 4,
        color: colors.gray300,
        fontSize: 10,
    }
});
