import React, { useMemo, useState } from "react";
import { View, TextInput, StyleSheet, ViewStyle, Pressable } from "react-native";
import { colors, radius, spacing } from "../theme";

export function AppInput({
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    leftIcon,
    rightIcon,
    onRightIconPress,
    keyboardType,
    autoCapitalize = "none",
    style,
}: {
    value: string;
    onChangeText: (t: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    keyboardType?: any;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    style?: ViewStyle;
}) {
    const [focused, setFocused] = useState(false);

    const borderColor = useMemo(() => {
        if (focused) return colors.green;
        return colors.softBorder;
    }, [focused]);

    return (
        <View style={[styles.wrap, { borderColor }, style]}>
            <View style={styles.left}>{leftIcon}</View>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={"rgba(17,24,39,0.35)"}
                secureTextEntry={!!secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize as any}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={styles.input}
            />

            <View style={styles.right}>
                {rightIcon ? (
                    <Pressable onPress={onRightIconPress} hitSlop={10}>
                        {rightIcon}
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        height: 58,
        borderRadius: radius.lg,
        borderWidth: 2,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    left: {
        width: 34,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.sm,
    },
    right: {
        width: 34,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        paddingVertical: 0,
    },
});
