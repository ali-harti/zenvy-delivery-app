export const colors = {
    bg: "#FFFFFF",
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
    text: "#111827",
    mutedText: "#6B7280",
    border: "#D1D5DB",
    softBorder: "rgba(17,24,39,0.12)",

    // Gray Palette (for pixel-perfect compatibility)
    gray100: "#F3F4F6",
    gray200: "#E5E7EB",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray500: "#6B7280",
    gray600: "#4B5563",
    gray700: "#374151",
    gray900: "#111827",
    green: "#12B981",
    greenDark: "#0E8F6A",
    greenSoft: "rgba(18,185,129,0.12)",

    // Cards
    cardBg: "#FFFFFF",
    cardMutedBg: "#F3F4F6",

    // Shadow tint
    shadow: "rgba(17,24,39,0.12)",

    // Links
    link: "#12B981",

    // Error
    danger: "#EF4444",
    success: "#12B981",
    warning: "#F59E0B",
    info: "#3B82F6",

    // Legacy/Compatibility aliases (mapped to new palette)
    primaryLight: "rgba(18,185,129,0.12)", // Mapped to greenSoft
    primary: "#12B981", // Mapped to green
    secondary: "#0E8F6A", // Mapped to greenDark for gradient/accents
    background: "#FFFFFF",
    surface: "#FFFFFF",
    error: "#EF4444",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    gradient: ['#12B981', '#0E8F6A'] as const,
    overlay: 'rgba(0,0,0,0.5)',
};

export const COLORS = colors;
