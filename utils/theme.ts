export const colors = {
  bg: {
    primary: "#0c1220",
    secondary: "#162032",
    tertiary: "#1a2744",
    card: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(255,255,255,0.05)",
  },
  text: {
    primary: "#f1f5f9",
    secondary: "#94a3b8",
    muted: "#64748b",
    dimmed: "#475569",
  },
  accent: {
    green: "#4abb87",
    greenLight: "#64dca0",
    greenBg: "rgba(74,187,135,0.2)",
    greenBorder: "rgba(74,187,135,0.3)",
    red: "#f87171",
    redBg: "rgba(248,113,113,0.08)",
    redBgHover: "rgba(248,113,113,0.15)",
    redBorder: "rgba(248,113,113,0.15)",
    yellow: "#fbbf24",
  },
  mountain: {
    base: "#2d3748",
    mid: "#4a5568",
    peak: "#5a6e7f",
    snow: "#f0f4f8",
    snowShadow: "#cbd5e0",
  },
} as const;

export const fonts = {
  display: "System", // Replace with custom font if you add one via expo-font
  body: "System",
} as const;
