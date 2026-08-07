import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "public/sw.js"), "utf8");

test("Service Worker liefert bei erfolgreichem Netzwerkzugriff die frische statische Antwort", () => {
  assert.match(source, /async function handleStaticRequest/);
  assert.match(source, /return response;/);
  assert.match(source, /caches\.match\(request\)/);
  assert.doesNotMatch(source, /return cached \|\| response/);
});
