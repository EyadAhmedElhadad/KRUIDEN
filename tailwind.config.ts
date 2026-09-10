import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#F4F6EA",
          100: "#E7ECD3",
          200: "#D2DCAD",
          300: "#B3C582",
          400: "#97AE5F",
          500: "#86974A",
          600: "#7E8B3A",
          700: "#5E6B28",
          800: "#48521F",
          900: "#333B16",
          950: "#1d230d",
        },
        cream: "#F8F5EE",
        sand: "#EFEAE0",
        ink: "#14140F",
        apos: {
          surface: "#f9faf1",
          surfaceContainerLow: "#f3f4ec",
          surfaceContainer: "#eeefe6",
          surfaceContainerHigh: "#e8e9e0",
          surfaceContainerHighest: "#e2e3db",
          onSurface: "#1a1c17",
          onSurfaceVariant: "#43493d",
          outline: "#73796c",
          outlineVariant: "#c3c9b9",
          primary: "#7E8B3A",
          onPrimary: "#1a1c17",
          primaryContainer: "#5E6B28",
          onPrimaryContainer: "#aed88e",
          inversePrimary: "#a9d389",
          secondary: "#546347",
          secondaryContainer: "#d4e5c2",
          onSecondaryContainer: "#58674b",
          error: "#ba1a1a",
        },
      },
      fontFamily: {
        serif: ["var(--font-noto-serif)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        noto: ["var(--font-noto-serif)", "serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      maxWidth: {
        container: "1360px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
