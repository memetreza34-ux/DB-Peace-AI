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

test("Datenschutzansicht unterscheidet React-Arbeitsspeicher und sessionStorage", () => {
  assert.match(source, /Chat und Gedächtnisprotokolle liegen nur im React-Arbeitsspeicher/);
  assert.match(source, /Protokolle überstehen interne Navigation/);
  assert.match(source, /Stimmungseinträge verwenden ausschließlich sessionStorage/);
  assert.match(source, /keiner dieser Inhalte wird in einer eigenen serverseitigen DB-Peace-Falldatenbank gespeichert/i);
});

test("Planungscheckliste verspricht keine browserweite Sitzungs-Persistenz", () => {
  assert.match(source, /React-Zustand dieser geöffneten Datenschutzansicht/);
  assert.match(source, /Ein Bereichswechsel oder Neuladen setzt sie zurück/);
});
