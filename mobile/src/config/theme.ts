// src/config/theme.ts
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const ZENVY_COLORS = {
    // Primary Brands
    primary: '#16B37A', // Requested Zenvy Green
    primaryDark: '#0D9261',
    primaryLight: '#43CD96',
    gradientPrimary: ['#16B37A', '#0D9261'] as [string, string],

    // UI Colors
    background: '#F7F9F8', // Off-white background from spec
    surface: '#FFFFFF',
    textPrimary: '#1D1F22', // Dark Charcoal from spec
    textSecondary: '#6B7280', // Muted Gray from spec
    textMuted: '#9B9B9B',
    border: '#E5E7EB',
    borderFocus: '#16B37A',
    error: '#EF4444',

    // Role Colors
    customer: '#16B37A',
    merchant: '#FF6B00',
    courier: '#F7B500',
};

export const ZENVY_THEME = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: ZENVY_COLORS.primary,
        background: ZENVY_COLORS.background,
        elevation: { level1: '#ffffff' }
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 40,
    },
    radii: {
        s: 8,
        m: 12,
        l: 16,
        xl: 24,
        pill: 100,
    },
    typography: {
        fontFamily: 'System', // Fallback to system for MVP robustness
        weights: {
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
        sizes: {
            display: 32,
            title: 24,
            subtitle: 18,
            body: 16,
            label: 14,
            caption: 12,
        }
    },
    shadows: {
        soft: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        }
    }
};
