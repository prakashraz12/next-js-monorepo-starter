export type ThemeMode = "light" | "dark";

export type ThemeTokens = {
  primary: string;
  primaryForeground: string;
  ring: string;
  accent: string;
  accentForeground: string;
  sidebarPrimary: string;
};

export type ColorPalette = {
  id: string;
  name: string;
  swatch: string;
  light: ThemeTokens;
  dark: ThemeTokens;
};

export type RadiusPreset = {
  id: string;
  name: string;
  value: string;
  description: string;
};

export const colorPalettes: ColorPalette[] = [
  {
    id: "blue",
    name: "Blue",
    swatch: "#0966ff",
    light: {
      primary: "#0966ff",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#0966ff",
      accent: "oklch(0.95 0.02 250)",
      accentForeground: "#0966ff",
      sidebarPrimary: "#0966ff",
    },
    dark: {
      primary: "#3b82f6",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#60a5fa",
      accent: "oklch(0.28 0.04 250)",
      accentForeground: "#93c5fd",
      sidebarPrimary: "#3b82f6",
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    swatch: "#059669",
    light: {
      primary: "#059669",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#059669",
      accent: "oklch(0.95 0.03 160)",
      accentForeground: "#047857",
      sidebarPrimary: "#059669",
    },
    dark: {
      primary: "#10b981",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#34d399",
      accent: "oklch(0.28 0.04 160)",
      accentForeground: "#6ee7b7",
      sidebarPrimary: "#10b981",
    },
  },
  {
    id: "violet",
    name: "Violet",
    swatch: "#7c3aed",
    light: {
      primary: "#7c3aed",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#7c3aed",
      accent: "oklch(0.95 0.03 300)",
      accentForeground: "#6d28d9",
      sidebarPrimary: "#7c3aed",
    },
    dark: {
      primary: "#8b5cf6",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#a78bfa",
      accent: "oklch(0.28 0.05 300)",
      accentForeground: "#c4b5fd",
      sidebarPrimary: "#8b5cf6",
    },
  },
  {
    id: "orange",
    name: "Orange",
    swatch: "#ea580c",
    light: {
      primary: "#ea580c",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#ea580c",
      accent: "oklch(0.95 0.04 50)",
      accentForeground: "#c2410c",
      sidebarPrimary: "#ea580c",
    },
    dark: {
      primary: "#f97316",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#fb923c",
      accent: "oklch(0.28 0.05 50)",
      accentForeground: "#fdba74",
      sidebarPrimary: "#f97316",
    },
  },
  {
    id: "rose",
    name: "Rose",
    swatch: "#e11d48",
    light: {
      primary: "#e11d48",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#e11d48",
      accent: "oklch(0.95 0.03 10)",
      accentForeground: "#be123c",
      sidebarPrimary: "#e11d48",
    },
    dark: {
      primary: "#f43f5e",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#fb7185",
      accent: "oklch(0.28 0.05 10)",
      accentForeground: "#fda4af",
      sidebarPrimary: "#f43f5e",
    },
  },
  {
    id: "slate",
    name: "Slate",
    swatch: "#475569",
    light: {
      primary: "#334155",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "#64748b",
      accent: "oklch(0.96 0 0)",
      accentForeground: "#334155",
      sidebarPrimary: "#334155",
    },
    dark: {
      primary: "#94a3b8",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "#cbd5e1",
      accent: "oklch(0.28 0 0)",
      accentForeground: "#e2e8f0",
      sidebarPrimary: "#94a3b8",
    },
  },
];

export const radiusPresets: RadiusPreset[] = [
  { id: "none", name: "None", value: "0rem", description: "Sharp corners" },
  { id: "sm", name: "Small", value: "0.25rem", description: "Subtle rounding" },
  { id: "md", name: "Medium", value: "0.625rem", description: "Default" },
  { id: "lg", name: "Large", value: "0.875rem", description: "Softer edges" },
  {
    id: "xl",
    name: "Extra Large",
    value: "1.25rem",
    description: "Very round",
  },
  {
    id: "full",
    name: "Pill",
    value: "1.5rem",
    description: "Maximum rounding",
  },
];

export function getThemeCssVariables(
  palette: ColorPalette,
  mode: ThemeMode,
  radius: RadiusPreset,
): Record<string, string> {
  const tokens = mode === "dark" ? palette.dark : palette.light;

  return {
    "--primary": tokens.primary,
    "--primary-foreground": tokens.primaryForeground,
    "--ring": tokens.ring,
    "--accent": tokens.accent,
    "--accent-foreground": tokens.accentForeground,
    "--sidebar-primary": tokens.sidebarPrimary,
    "--radius": radius.value,
  };
}

export function generateThemeCss(
  palette: ColorPalette,
  mode: ThemeMode,
  radius: RadiusPreset,
): string {
  const selector = mode === "dark" ? ".dark" : ":root";
  const vars = getThemeCssVariables(palette, mode, radius);

  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `${selector} {\n${lines}\n}`;
}
