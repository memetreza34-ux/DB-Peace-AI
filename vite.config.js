import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

function relaxCspForDevelopment() {
  return {
    name: "db-peace-dev-csp",
    apply: "serve",
    enforce: "pre",
    transformIndexHtml(html) {
      return html
        .replace(
          "script-src 'self';",
          "script-src 'self' 'unsafe-inline';",
        )
        .replace(
          "connect-src 'self';",
          "connect-src 'self' ws://127.0.0.1:5173 ws://localhost:5173;",
        );
    },
  };
}

function parsePort(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 65_535 ? parsed : fallback;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = parsePort(process.env.API_PORT || env.API_PORT, 8787);
  const apiTarget = `http://127.0.0.1:${apiPort}`;
  const proxy = { "/api": apiTarget };

  return {
    plugins: [relaxCspForDevelopment(), react()],
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      proxy,
    },
    preview: {
      host: "127.0.0.1",
      port: 4173,
      strictPort: true,
      proxy,
    },
  };
});
