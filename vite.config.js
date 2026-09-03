import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    // 5173 bleibt die Vorgabe. Ist der Port belegt, weicht der Server aus,
    // statt mit einem Fehler abzubrechen.
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    proxy: {
      "/api": "http://127.0.0.1:8787",
    },
  },
});
