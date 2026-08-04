/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        db: {
          red: "#E2001A", // Official DB Red
          dark: "#282D37", // DB Cool Gray Dark (Text)
          rail: "#646973", // DB Cool Gray Mid
          soft: "#F0F3F5", // DB Cool Gray Light (Background)
          warm: "#ECEEF1", // DB Secondary Background
        },
      },
      boxShadow: {
        panel: "0 2px 8px rgba(40, 45, 55, 0.08)", // Sharper, standard corporate shadow
      },
    },
  },
  plugins: [],
};
