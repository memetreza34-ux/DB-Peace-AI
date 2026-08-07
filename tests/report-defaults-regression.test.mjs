import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/components/AnonymousReport.jsx"), "utf8");

test("Meldungsentwurf startet ohne erfundene sensible Fakten", () => {
  const initialForm = source.match(/function createInitialForm\(\) \{[\s\S]*?\n\}/)?.[0] || "";

  for (const field of ["type", "repetition", "perspective", "danger", "stress", "recipient", "draftStyle"]) {
    assert.match(initialForm, new RegExp(`${field}:\\s*""`));
  }

  assert.doesNotMatch(initialForm, /type:\s*"Mobbing"/);
  assert.doesNotMatch(initialForm, /danger:\s*"Keine akute Gefahr"/);
  assert.doesNotMatch(initialForm, /perspective:\s*"Direkt betroffen"/);
  assert.doesNotMatch(initialForm, /stress:\s*3/);
});

test("Meldungsentwurf verlangt bewusste Auswahl oder Nicht angegeben", () => {
  assert.match(source, /Wähle bewusst eine Kategorie/);
  assert.match(source, /Wähle bewusst eine Einschätzung zur aktuellen Gefahr/);
  assert.match(source, /Nicht angegeben/);
  assert.match(source, /valueOrNotProvided/);
  assert.match(source, /formatStress/);
});
