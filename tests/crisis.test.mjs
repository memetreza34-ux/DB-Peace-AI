import test from "node:test";
import assert from "node:assert/strict";
import { erkenneKrise, NOTRUF } from "../src/lib/crisis.js";

// Diese Tests schützen eine sicherheitskritische Zusage: Wer im Chat eine Krise
// äußert, bekommt immer echte Hilfenummern — unabhängig von API-Key oder Modell.

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
