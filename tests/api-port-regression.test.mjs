import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "vite.config.js"), "utf8");

test("Vite verwendet denselben konfigurierbaren API_PORT für Dev und Preview", () => {
  assert.match(source, /defineConfig, loadEnv/);
  assert.match(source, /loadEnv\(mode, process\.cwd\(\), ""\)/);
  assert.match(source, /process\.env\.API_PORT \|\| env\.API_PORT/);
  assert.match(source, /apiTarget = `http:\/\/127\.0\.0\.1:\$\{apiPort\}`/);
  assert.match(source, /server:[\s\S]*?proxy,/);
  assert.match(source, /preview:[\s\S]*?port:\s*4173,[\s\S]*?proxy,/);
});
