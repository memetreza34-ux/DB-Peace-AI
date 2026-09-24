import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { erkenneKrise, krisenKontakte, NOTRUF } from "../src/lib/crisis.js";

// Diese Tests schützen eine sicherheitskritische Zusage: Wer in der App eine
// Krise äußert, bekommt sofort echte Hilfenummern.

const KRISEN = [
  ["Ich halte das nicht mehr aus und will nicht mehr leben", "suizid"],
  ["ich will sterben", "suizid"],
  ["Ich denke daran mich umzubringen", "suizid"],
  ["habe suizidgedanken", "suizid"],
  ["Ich wäre lieber tot", "suizid"],
  ["ich ritze mich seit wochen", "selbstverletzung"],
  ["Ich tue mir weh wenn es zu viel wird", "selbstverletzung"],
  ["Mein Kollege schlägt mich", "gewalt"],
  ["Er hat mich geschlagen gestern", "gewalt"],
  ["Der hat ein Messer dabei", "gewalt"],
  ["ich habe angst um mein leben", "gewalt"]
];

const KEINE_KRISEN = [
  "Ein Kollege beleidigt mich seit Wochen vor allen anderen",
  "Ich fühle mich ausgeschlossen im Team",
  "Wie melde ich einen Vorfall?",
  "hallo",
  "Mir geht es heute nicht so gut",
  "Der Ausbilder ist unfair zu mir"
];

test("erkennt Krisenäußerungen und ordnet sie richtig ein", () => {
  for (const [text, art] of KRISEN) {
    const treffer = erkenneKrise(text);
    assert.ok(treffer, `nicht erkannt: "${text}"`);
    assert.equal(treffer.art, art, `falsche Einordnung bei: "${text}"`);
  }
});

test("schlägt bei normalen Konfliktschilderungen nicht an", () => {
  for (const text of KEINE_KRISEN) {
    assert.equal(erkenneKrise(text), null, `falscher Treffer bei: "${text}"`);
  }
});

test("jede Krisenantwort nennt mindestens eine echte Hilfenummer", () => {
  for (const [text] of KRISEN) {
    const { text: antwort } = erkenneKrise(text);
    const nummern = Object.values(NOTRUF);
    assert.ok(
      nummern.some((n) => antwort.includes(n)),
      `keine Hilfenummer in der Antwort auf: "${text}"`
    );
  }
});

test("verträgt leere und ungültige Eingaben", () => {
  assert.equal(erkenneKrise(""), null);
  assert.equal(erkenneKrise(null), null);
  assert.equal(erkenneKrise(undefined), null);
  assert.equal(erkenneKrise(42), null);
});

test("zu jeder Krisenart gibt es anrufbare Stellen aus kontakte.js", () => {
  for (const art of ["suizid", "selbstverletzung", "gewalt"]) {
    const kontakte = krisenKontakte(art);
    assert.ok(kontakte.length > 0, `keine Kontakte für ${art}`);
    for (const kontakt of kontakte) {
      assert.match(kontakt.telefon, /^[\d ]+$/, `${kontakt.id} hat keine wählbare Nummer`);
    }
  }
  const nummern = (art) => krisenKontakte(art).map((k) => k.telefon);
  assert.ok(nummern("suizid").includes(NOTRUF.telefonseelsorge1));
  assert.ok(nummern("suizid").includes(NOTRUF.rettung));
  assert.ok(nummern("gewalt").includes(NOTRUF.polizei));
  assert.deepEqual(krisenKontakte("unbekannt"), []);
});

/*
 * Bis zum 6.9.2026 lief die Prüfung im Chat. Als der Chat entfernt wurde, rief
 * sie niemand mehr auf — und alle Tests blieben grün, weil sie nur die Funktion
 * prüften. Dieser Test prüft deshalb, dass jedes Freitextfeld sie auch benutzt.
 */
const FREITEXTFELDER = [
  "components/AnonymousReport.jsx",
  "components/RecordAndReportView.jsx",
  "components/GespraechAnfragen.jsx",
  "components/GlobalSearch.jsx",
  "components/ProfileView.jsx"
];

test("jedes Freitextfeld für Betroffene zeigt den Krisenhinweis", () => {
  const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
  for (const datei of FREITEXTFELDER) {
    const quelltext = fs.readFileSync(path.join(src, datei), "utf8");
    assert.match(quelltext, /<KrisenHinweis\s+text=/, `${datei} zeigt keinen Krisenhinweis`);
  }
});
