import { Platform } from "react-native";

const fontData = Platform.select({
    ios: {
        fontFamily: "System",
        fontWeight: "600",
    },
    android: {
        fontFamily: "Roboto",
        fontWeight: "bold",
    },
    default: {
        fontFamily: "System",
        fontWeight: "bold",
    }
});

export const typography = {
    // Screen Titles
    titleXL: {
        fontSize: 38,
        fontWeight: "900" as const,
        letterSpacing: -0.5,
        lineHeight: 44,
        color: "#1B1B1B",
    },
    // Card Titles
    title: {
        fontSize: 22,
        fontWeight: "900" as const,
        lineHeight: 28,
        color: "#1B1B1B",
    },
    // Section Headers
    section: {
        fontSize: 18,
        fontWeight: "800" as const,
        color: "#1B1B1B",
    },
    // Body Text
    body: {
        fontSize: 16,
        fontWeight: "600" as const,
        lineHeight: 22,
        color: "#1B1B1B",
    },
    // Secondary / Subtitle
    caption: {
        fontSize: 14,
        fontWeight: "600" as const,
        color: "rgba(0,0,0,0.55)",
        lineHeight: 20,
    },
    // Button Text
    button: {
        fontSize: 18,
        fontWeight: "800" as const,
        color: "#FFFFFF",
    },
};
