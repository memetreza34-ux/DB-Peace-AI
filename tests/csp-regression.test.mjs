import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const viteConfig = fs.readFileSync(path.join(root, "vite.config.js"), "utf8");

test("Produktions-CSP erlaubt keine Inline-Skripte, Dev-WebSockets oder ungenutzten Google-Font-Ursprünge", () => {
  assert.match(html, /script-src 'self'/);
  assert.doesNotMatch(html, /script-src[^;]*'unsafe-inline'/);
  assert.match(html, /connect-src 'self';/);
  assert.doesNotMatch(html, /ws:\/\/127\.0\.0\.1:5173|ws:\/\/localhost:5173/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.match(html, /meta name="referrer" content="no-referrer"/);
});

test("Vite lockert Script- und WebSocket-CSP nur für den lokalen Devserver", () => {
  assert.match(viteConfig, /name:\s*"db-peace-dev-csp"/);
  assert.match(viteConfig, /apply:\s*"serve"/);
  assert.match(viteConfig, /script-src 'self' 'unsafe-inline'/);
  assert.match(viteConfig, /connect-src 'self' ws:\/\/127\.0\.0\.1:5173 ws:\/\/localhost:5173/);
  assert.match(viteConfig, /relaxCspForDevelopment/);
});

test("Vite-Preview lädt den Dev-CSP-Relaxer ausdrücklich nicht", () => {
  assert.match(viteConfig, /defineConfig\(\(\{ mode, isPreview \}\) =>/);
  assert.match(viteConfig, /if \(isPreview !== true\) plugins\.unshift\(relaxCspForDevelopment\(\)\)/);
  assert.match(viteConfig, /preview:\s*\{[\s\S]*?port:\s*4173/);
});
