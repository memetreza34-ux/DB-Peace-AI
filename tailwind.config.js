/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Semantische Ebene — siehe src/styles/tokens.css. Diese Namen sagen,
        // wofür eine Farbe da ist; hell und dunkel klären die Tokens.
        ground: "rgb(var(--ground) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-sunk": "rgb(var(--surface-sunk) / <alpha-value>)",
        "surface-inverse": "rgb(var(--surface-inverse) / <alpha-value>)",
        "ink-inverse": "rgb(var(--ink-inverse) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--ink-muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-ink": "rgb(var(--accent-ink) / <alpha-value>)",
        contrast: "rgb(var(--contrast) / <alpha-value>)",
        "contrast-ink": "rgb(var(--contrast-ink) / <alpha-value>)",
        db: {
          red: "#E2001A", // Official DB Red — für Flächen und Text ab 18px
          redInk: "#A40013", // abgedunkelt für kleinen Text auf hellem Grund (Kontrast)
          dark: "#282D37", // DB Cool Gray Dark (Text)
          rail: "#646973", // DB Cool Gray Mid
          soft: "#F0F3F5", // DB Cool Gray Light (Background)
          warm: "#ECEEF1", // DB Secondary Background
        },
      },
      borderRadius: {
        // Das DB-Erscheinungsbild lebt von Flächen und Kanten, nicht von
        // abgerundeten Kacheln. Alle Klassen bleiben nutzbar, fallen aber
        // deutlich flacher aus als die Tailwind-Voreinstellung.
        DEFAULT: "2px",
        sm: "2px",
        md: "3px",
        lg: "3px",
        xl: "4px",
        "2xl": "4px",
        "3xl": "6px",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(40, 45, 55, 0.10)",
        sm: "0 1px 2px rgba(40, 45, 55, 0.08)",
        DEFAULT: "0 1px 2px rgba(40, 45, 55, 0.10)",
        md: "0 1px 3px rgba(40, 45, 55, 0.12)",
        lg: "0 2px 6px rgba(40, 45, 55, 0.12)",
        xl: "0 3px 10px rgba(40, 45, 55, 0.14)",
      },
    },
  },
  plugins: [],
};
