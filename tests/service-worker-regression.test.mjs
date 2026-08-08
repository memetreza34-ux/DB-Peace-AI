import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "public/sw.js"), "utf8");
const main = fs.readFileSync(path.join(root, "src/main.jsx"), "utf8");

test("Service Worker liefert bei erfolgreichem Netzwerkzugriff die frische statische Antwort", () => {
  assert.match(source, /async function handleStaticRequest/);
  assert.match(source, /return response;/);
  assert.match(source, /caches\.match\(request\)/);
  assert.doesNotMatch(source, /return cached \|\| response/);
});

test("Entwicklungsmodus entfernt nur die Root-Registrierung statt alle Service Worker derselben Origin", () => {
  assert.match(main, /navigator\.serviceWorker\.getRegistration\("\/"\)/);
  assert.match(main, /registration\?\.unregister\(\)/);
  assert.doesNotMatch(main, /navigator\.serviceWorker\.getRegistrations\(\)/);
  assert.match(main, /name\.startsWith\("db-peace-ai-"\)/);
});
