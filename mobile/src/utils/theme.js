import { useColorScheme } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Dark mode color palette based on Create platform documentation
export const colors = {
  light: {
    // Backgrounds
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceElevated: "#F8F9FB",
    surfaceCard: "#FFFFFF",
    surfaceHighest: "#F5F5F5",

    // Text & Icons
    text: "#1B2034",
    textSecondary: "#6A6F81",
    textTertiary: "#9CA3AF",

    // Brand & Accent
    primary: "#6B5BFF",
    primaryMuted: "#F4F5F7",
    accent: "#1ECC45",

    // Semantic Colors
    success: "#22C55E",
    warning: "#FFCE6A",
    danger: "#FF6B6B",

    // UI Elements
    border: "#E5E7EB",
    borderMuted: "#D7DAE0",

    // Status Bar
    statusBarStyle: "dark",
  },
  dark: {
    // Backgrounds - starting with charcoal, not pitch-black
    background: "#121212",
    surface: "#1E1E1E",
    surfaceElevated: "#2A2A2A",
    surfaceCard: "#262626",
    surfaceHighest: "#333333",

    // Text & Icons - off-white with controlled opacity
    text: "#FFFFFF",
    textSecondary: "#B3B3B3", // ~70% white
    textTertiary: "#8A8A8A", // ~54% white

    // Brand & Accent - slightly desaturated and brightened
    primary: "#8B7AFF", // Brightened from #6B5BFF
    primaryMuted: "#2A2A2A",
    accent: "#34D058", // Slightly brighter green

    // Semantic Colors - adjusted for dark mode
    success: "#34D058",
    warning: "#FFD666", // Slightly brightened
    danger: "#FF7B7B", // Slightly brightened

    // UI Elements
    border: "#404040",
    borderMuted: "#333333",

    // Status Bar
    statusBarStyle: "light",
  },
};

// Theme preference store
export const useThemeStore = create(
  persist(
    (set, get) => ({
      themePreference: "system", // 'light' | 'dark' | 'system'
      setThemePreference: (preference) => set({ themePreference: preference }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { themePreference } = useThemeStore();

  // Determine effective theme based on preference
  const effectiveTheme =
    themePreference === "system" ? systemColorScheme : themePreference;

  const theme = colors[effectiveTheme] || colors.light;

  return {
    colors: theme,
    isDark: effectiveTheme === "dark",
    themePreference,
    setThemePreference: useThemeStore.getState().setThemePreference,
  };
}
