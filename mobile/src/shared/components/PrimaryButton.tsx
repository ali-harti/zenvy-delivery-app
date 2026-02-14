import React, { useMemo, useRef } from "react";
import { Pressable, Animated, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "./AppText";
import { colors, radius, spacing } from "../theme";

export function PrimaryButton({
    title,
    onPress,
    disabled,
    style,
}: {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
}) {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useMemo(() => (disabled ? 0.6 : 1), [disabled]);

    const onIn = () => Animated.spring(scale, { toValue: 0.985, useNativeDriver: true }).start();
    const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

    return (
        <Animated.View style={[{ transform: [{ scale }], opacity }, style]}>
            <Pressable disabled={disabled} onPress={onPress} onPressIn={onIn} onPressOut={onOut}>
                <LinearGradient
                    colors={[colors.green, colors.greenDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.btn}
                >
                    <AppText variant="h2" style={styles.text}>
                        {title}
                    </AppText>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    btn: {
        height: 60,
        borderRadius: radius.pill,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing["2xl"],
        shadowColor: colors.shadow,
        shadowOpacity: 1,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
    },
    text: {
        color: "#FFFFFF",
        fontWeight: "800",
    },
});
