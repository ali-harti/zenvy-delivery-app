import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
    mode: ThemeMode;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'light',
            toggleTheme: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
            setTheme: (mode) => set({ mode }),
        }),
        {
            name: 'zenvy-theme',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Hook to get dynamic colors based on current theme
export const useAppTheme = () => {
    const { mode, toggleTheme } = useThemeStore();
    const isDark = mode === 'dark';

    return {
        mode,
        toggleTheme,
        isDark,
        colors: {
            ...colors,
            bg: isDark ? "#111827" : "#F9FAFB", // Dark Gray vs Light Gray
            cardBg: isDark ? "#1F2937" : "#FFFFFF",
            text: isDark ? "#F9FAFB" : "#111827",
            textSecondary: isDark ? "#9CA3AF" : "#6B7280",
            border: isDark ? "#374151" : "#E5E7EB",
            inputBg: isDark ? "#374151" : "#F9FAFB",
        }
    };
};
