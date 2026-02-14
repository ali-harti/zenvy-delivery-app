import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { colors, typography } from "../theme";

type Variant = "title" | "h1" | "h2" | "body" | "small" | "link" | "muted";

export function AppText({
    variant = "body",
    style,
    ...props
}: TextProps & { variant?: Variant }) {
    return <Text {...props} style={[styles.base, styles[variant], style]} />;
}

const styles = StyleSheet.create({
    base: {
        color: colors.text,
    },
    title: {
        fontSize: typography.title,
        fontWeight: typography.weightBold,
        letterSpacing: -0.5,
    },
    h1: {
        fontSize: typography.h1,
        fontWeight: typography.weightBold,
        letterSpacing: -0.4,
    },
    h2: {
        fontSize: typography.h2,
        fontWeight: typography.weightSemibold,
    },
    body: {
        fontSize: typography.body,
        fontWeight: typography.weightRegular,
    },
    small: {
        fontSize: typography.small,
        fontWeight: typography.weightRegular,
    },
    link: {
        fontSize: typography.body,
        fontWeight: typography.weightSemibold,
        color: colors.link,
    },
    muted: {
        fontSize: typography.body,
        fontWeight: typography.weightRegular,
        color: colors.mutedText,
    },
});
