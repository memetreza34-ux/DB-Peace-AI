import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function allowReactRefreshPreambleInDevelopment() {
  return {
    name: "db-peace-dev-csp",
    apply: "serve",
    enforce: "pre",
    transformIndexHtml(html) {
      return html.replace(
        "script-src 'self';",
        "script-src 'self' 'unsafe-inline';",
      );
    },
  };
}

export default defineConfig({
  plugins: [allowReactRefreshPreambleInDevelopment(), react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": "http://127.0.0.1:8787",
    },
  },
});
