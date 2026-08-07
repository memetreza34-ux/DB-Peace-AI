import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/components/PrivacyCompliance.jsx"), "utf8");

test("Datenschutzansicht nennt den externen Gemini-Datenfluss ausdrücklich", () => {
  assert.match(source, /Externe KI-Verarbeitung/);
  assert.match(source, /an Google Gemini übertragen/);
  assert.match(source, /keine realen sensiblen Falldaten/);
  assert.doesNotMatch(source, /Gemini[^\n]*speichert keine/i);
});
