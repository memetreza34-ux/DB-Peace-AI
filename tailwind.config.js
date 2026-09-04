/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Beschilderung schmal, Lesetext normal — die Aufteilung vom Bahnsteig.
        schild: ['"Fira Sans Condensed"', '"Fira Sans"', "system-ui", "sans-serif"],
      },
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
        warn: "rgb(var(--warn) / <alpha-value>)",
        "warn-line": "rgb(var(--warn-line) / <alpha-value>)",
        "warn-ink": "rgb(var(--warn-ink) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        "danger-line": "rgb(var(--danger-line) / <alpha-value>)",
        "danger-ink": "rgb(var(--danger-ink) / <alpha-value>)",
        ok: "rgb(var(--ok) / <alpha-value>)",
        "ok-line": "rgb(var(--ok-line) / <alpha-value>)",
        "ok-ink": "rgb(var(--ok-ink) / <alpha-value>)",
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
        // Das DB-Erscheinungsbild kennt keine abgerundeten Kacheln. Die
        // Klassen bleiben in Gebrauch, laufen aber alle auf dieselbe Kante
        // hinaus — so muss niemand 400 Stellen anfassen. `full` bleibt echt
        // rund, das sind Punkte und Zustandsanzeigen, keine Flächen.
        none: "0",
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
      },
      boxShadow: {
        // Flächen setzen sich durch ihre Farbe ab, nicht durch einen Schlagschatten
        // — weiss auf hellgrau, im Dunkelmodus umgekehrt. Ein schwebender Knopf
        // darf sich abheben, alles andere liegt flach auf.
        panel: "none",
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        schwebend: "0 2px 12px rgba(40, 45, 55, 0.22)",
      },
    },
  },
  plugins: [],
};
