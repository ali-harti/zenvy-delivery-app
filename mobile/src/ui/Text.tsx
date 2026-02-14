import React from "react";
import { Text as RNText, TextProps, Platform } from "react-native";

const FONT = Platform.select({
    ios: "System",
    android: "Inter", // if you installed Inter; otherwise "Roboto"
    default: "System",
});

export function Text(props: TextProps & { weight?: "400" | "500" | "600" | "700" | "800" | "900" }) {
    const { style, weight = "600", ...rest } = props;
    return (
        <RNText
            {...rest}
            style={[
                { fontFamily: FONT, fontWeight: weight, color: "#111" },
                style,
            ]}
        />
    );
}
