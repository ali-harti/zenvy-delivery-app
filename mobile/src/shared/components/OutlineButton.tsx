import React, { useRef } from "react";
import { Pressable, Animated, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "./AppText";
import { colors, radius } from "../theme";

export function OutlineButton({
    title,
    onPress,
    style,
}: {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
}) {
    const scale = useRef(new Animated.Value(1)).current;
    const onIn = () => Animated.spring(scale, { toValue: 0.985, useNativeDriver: true }).start();
    const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

    return (
        <Animated.View style={[{ transform: [{ scale }] }, style]}>
            <Pressable onPress={onPress} onPressIn={onIn} onPressOut={onOut} style={styles.btn}>
                <AppText variant="h2" style={styles.text}>
                    {title}
                </AppText>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    btn: {
        height: 60,
        borderRadius: radius.pill,
        borderWidth: 2,
        borderColor: colors.green,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: colors.green,
        fontWeight: "800",
    },
});
