import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const reportWizard = read("src/components/AnonymousReport.jsx");
const smartReport = read("src/components/AISmartReport.jsx");
const protocol = read("src/components/RecordAndReportView.jsx");
const server = read("server.js");

test("Meldungsentwurf startet ohne erfundene sensible Fakten", () => {
  const initialForm = reportWizard.match(/function createInitialForm\(\) \{[\s\S]*?\n\}/)?.[0] || "";

  for (const field of ["type", "repetition", "perspective", "danger", "stress", "recipient", "draftStyle"]) {
    assert.match(initialForm, new RegExp(`${field}:\\s*""`));
  }

  assert.doesNotMatch(initialForm, /type:\s*"Mobbing"/);
  assert.doesNotMatch(initialForm, /danger:\s*"Keine akute Gefahr"/);
  assert.doesNotMatch(initialForm, /perspective:\s*"Direkt betroffen"/);
  assert.doesNotMatch(initialForm, /stress:\s*3/);
});

test("Meldungsentwurf verlangt bewusste Auswahl oder Nicht angegeben", () => {
  assert.match(reportWizard, /Wähle bewusst eine Kategorie/);
  assert.match(reportWizard, /Wähle bewusst eine Einschätzung zur aktuellen Gefahr/);
  assert.match(reportWizard, /Nicht angegeben/);
  assert.match(reportWizard, /valueOrNotProvided/);
  assert.match(reportWizard, /formatStress/);
  assert.match(reportWizard, /urgency:\s*"noch nicht bewertet"/);
});

test("fehlende Vorfallszeit wird weder im KI-Fallback noch im Protokoll mit jetzt ersetzt", () => {
  assert.match(smartReport, /date:\s*"Nicht angegeben"/);
  assert.match(smartReport, /time:\s*"Nicht angegeben"/);
  assert.doesNotMatch(smartReport, /dateFallback|timeFallback/);
  assert.match(protocol, /date:\s*draft\.date \|\| "Nicht angegeben"/);
  assert.match(protocol, /time:\s*draft\.time \|\| "Nicht angegeben"/);
  assert.doesNotMatch(protocol, /draft\.date \|\| now\.toISOString/);
});

test("lokaler KI-Fallback klassifiziert unbekannte Fakten nicht automatisch", () => {
  assert.match(smartReport, /category:\s*"Nicht angegeben"/);
  assert.match(smartReport, /urgency:\s*"Nicht automatisch bewertet"/);
  assert.match(smartReport, /location:\s*"Nicht angegeben"/);
  assert.match(smartReport, /witnesses:\s*"Nicht angegeben"/);
});

test("leere KI-Lückenliste wird nicht als Vollständigkeitsprüfung dargestellt", () => {
  assert.match(smartReport, /Keine Lücke von der KI gemeldet – bitte selbst prüfen/);
  assert.doesNotMatch(smartReport, /Keine offensichtlichen Lücken erkannt/);
});

test("fehlende KI-Kategorie bleibt server- und clientseitig Nicht angegeben", () => {
  assert.match(server, /category:\s*cleanString\(parsed\.category,\s*120,\s*"Nicht angegeben"\)/);
  assert.match(smartReport, /category:\s*valueOrNotProvided\(report\.category\)/);
  assert.doesNotMatch(server, /category:\s*cleanString\(parsed\.category,\s*120,\s*"Vorfall \/ Konflikt"\)/);
  assert.doesNotMatch(smartReport, /category:\s*valueOrNotProvided\(report\.category,\s*"Vorfall \/ Konflikt"\)/);
});

test("KI darf akut nur bei eindeutig aktueller unmittelbarer Gefahr verwenden", () => {
  assert.match(server, /Setze urgency nur dann auf akut, wenn der Text eindeutig eine gegenwärtige und unmittelbare Gefahr beschreibt/);
  assert.match(server, /Vergangene Drohungen oder Gewalt ohne klar aktuelle unmittelbare Gefahr dürfen höchstens hoch sein/);
  assert.match(server, /Wenn der zeitliche Gefahrenstatus unklar ist, verwende nicht akut/);
  assert.doesNotMatch(server, /Bei Drohung, Gewalt oder unmittelbarer Gefahr urgency auf hoch oder akut setzen/);
});

test("ungültige KI-Dringlichkeit fällt serverseitig nicht auf mittel zurück", () => {
  const normalizer = server.match(/function normalizeUrgency\(value\) \{[\s\S]*?\n\}/)?.[0] || "";
  assert.match(normalizer, /"Nicht angegeben"/);
  assert.doesNotMatch(normalizer, /:\s*"mittel"/);
});
