import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Die App ist keine offizielle Anwendung der Deutschen Bahn. Ein rotes Feld
 * mit „DB" darin behauptet genau das — bis zum 25.9.2026 stand so eines im
 * Menü, obwohl das App-Symbol das Konzernlogo bewusst vermied.
 */
const WURZEL = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function dateien(verzeichnis, endungen) {
  const gefunden = [];
  for (const eintrag of fs.readdirSync(verzeichnis, { withFileTypes: true })) {
    const p = path.join(verzeichnis, eintrag.name);
    if (eintrag.isDirectory()) gefunden.push(...dateien(p, endungen));
    else if (endungen.some((e) => p.endsWith(e))) gefunden.push(p);
  }
  return gefunden;
}

test("kein nachgebautes DB-Logo in App und Symbolen", () => {
  const verdaechtig = [
    ...dateien(path.join(WURZEL, "src"), [".jsx"]),
    ...dateien(path.join(WURZEL, "public"), [".svg"]),
  ].filter((datei) => /<text[^>]*>\s*DB\s*<\/text>/.test(fs.readFileSync(datei, "utf8")));

  assert.deepEqual(verdaechtig.map((d) => path.relative(WURZEL, d)), []);
});
