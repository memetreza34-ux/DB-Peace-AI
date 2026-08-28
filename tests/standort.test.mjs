import test from "node:test";
import assert from "node:assert/strict";
import { STANDORTE, STANDORT_ROLLEN } from "../src/config/standorte.js";
import { besetzungFuer, istBesetzt } from "../src/lib/standort.js";
import { rolleFinden } from "../src/lib/rolle.js";

test("jeder hinterlegte Standort nennt Rollen, die es wirklich gibt", () => {
  for (const standort of STANDORTE) {
    for (const rolleId of Object.keys(standort.besetzung)) {
      assert.ok(rolleFinden(rolleId), `${standort.id} nennt die unbekannte Rolle ${rolleId}`);
      assert.ok(STANDORT_ROLLEN.includes(rolleId), `${rolleId} gehört nicht zu den Standort-Rollen`);
    }
  }
});

test("erfundene Standorte sind als Beispiel gekennzeichnet", () => {
  // Ohne diese Kennzeichnung sähe eine Vorführung aus wie echte Daten.
  for (const standort of STANDORTE) {
    assert.equal(standort.beispiel, true, `${standort.id} ist nicht als Beispiel markiert`);
  }
});

test("kein Standort erfindet Rufnummern oder E-Mail-Adressen", () => {
  // Eine erfundene Nummer, die jemand in einer Notlage anruft, wäre schlimmer
  // als gar keine Angabe. Belegte Kontaktwege stehen in config/kontakte.js.
  const roh = JSON.stringify(STANDORTE);
  assert.equal(/\+?\d[\d\s/()-]{6,}/.test(roh), false, "sieht nach einer Rufnummer aus");
  assert.equal(/@/.test(roh), false, "sieht nach einer E-Mail-Adresse aus");
});

test("jede benannte Person hat Funktion und Erreichbarkeit", () => {
  for (const standort of STANDORTE) {
    for (const personen of Object.values(standort.besetzung)) {
      for (const person of personen) {
        assert.ok(person.name && person.funktion && person.erreichbar, "unvollständiger Eintrag");
      }
    }
  }
});

test("ohne Standort gibt es keine Besetzung — und das ist ein gültiges Ergebnis", () => {
  assert.deepEqual(besetzungFuer(null, "jav"), []);
  assert.equal(istBesetzt(null, "jav"), false);
});

test("Rollen ohne Standortbezug liefern nichts", () => {
  const standort = STANDORTE[0];
  assert.deepEqual(besetzungFuer(standort, "compliance"), [], "Compliance ist nicht standortgebunden");
  assert.deepEqual(besetzungFuer(standort, "erfunden"), []);
  assert.ok(istBesetzt(standort, "jav"));
});
