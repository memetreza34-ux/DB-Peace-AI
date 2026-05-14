/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        db: {
          red: "#E2001A",
          dark: "#1F2328",
          rail: "#3A3F45",
          soft: "#F5F5F3",
        },
      },
      boxShadow: {
        panel: "0 18px 50px rgba(31, 35, 40, 0.12)",
      },
    },
  },
  plugins: [],
};
