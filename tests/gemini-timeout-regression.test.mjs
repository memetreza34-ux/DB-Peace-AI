import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "server.js"), "utf8");

test("Gemini-Timeout bricht den lokalen SDK-Request ab und erhält die Request-Konfiguration", () => {
  assert.match(source, /const controller = new AbortController\(\)/);
  assert.match(source, /controller\.abort\(\)/);
  assert.match(source, /abortSignal:\s*controller\.signal/);
  assert.match(source, /config:\s*\{\s*\.\.\.config,\s*abortSignal:/s);
  assert.match(source, /timedOut/);
  assert.match(source, /timeoutError\.status = 504/);
});
