import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: {
      // Derselbe Port wie in server.js — sonst läuft die App ins Leere, sobald
      // 8787 belegt ist und der Server auf einen anderen ausweicht.
      "/api": `http://127.0.0.1:${process.env.API_PORT || 8787}`,
    },
  },
});
