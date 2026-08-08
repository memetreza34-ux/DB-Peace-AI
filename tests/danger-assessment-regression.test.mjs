import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const report = fs.readFileSync(path.join(root, "src/components/AnonymousReport.jsx"), "utf8");

test("akute Orientierung erfordert die ausdrückliche Auswahl Direkte Gefahr", () => {
  assert.match(report, /const acute = form\.danger === "Direkte Gefahr";/);
  assert.doesNotMatch(report, /const acute = form\.danger === "Direkte Gefahr"\s*\|\|/);
});

test("Keine akute Gefahr wird nicht durch historische Gefahr-Schlüsselwörter auf hoch oder akut angehoben", () => {
  assert.match(report, /const explicitNoAcuteDanger = form\.danger === "Keine akute Gefahr";/);
  assert.match(report, /!explicitNoAcuteDanger && \["waffe", "messer", "schuss", "akute gefahr", "drohung", "bedroht", "gewalt", "schlagen"\]/);
});
