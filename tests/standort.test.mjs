import test from "node:test";
import assert from "node:assert/strict";
import { STANDORTE, STANDORT_ROLLEN, STELLEN } from "../src/config/standorte.js";
import { besetzungFuer, istBesetzt } from "../src/lib/standort.js";
import { rolleFinden } from "../src/lib/rolle.js";

test("jeder Standort-Eintrag ist entweder eine bekannte Rolle oder eine benannte Stelle", () => {
  // Nicht alles am Standort ist eine Rolle im Sinne von rollen.js: DB Sicherheit
  // ist eine Stelle ohne Postfach. Beides muss aber benannt sein, sonst steht in
  // der Kontaktansicht eine Karte ohne Überschrift.
  for (const standort of STANDORTE) {
    for (const eintragId of Object.keys(standort.besetzung)) {
      const bekannt = Boolean(rolleFinden(eintragId)) || Boolean(STELLEN[eintragId]);
      assert.ok(bekannt, `${standort.id} nennt ${eintragId}, das weder Rolle noch Stelle ist`);
      assert.ok(STANDORT_ROLLEN.includes(eintragId), `${eintragId} fehlt in STANDORT_ROLLEN`);
    }
  }
});

test("jeder Eintrag in STANDORT_ROLLEN lässt sich beschriften", () => {
  for (const eintragId of STANDORT_ROLLEN) {
    const bezeichnung = rolleFinden(eintragId)?.kurz ?? STELLEN[eintragId]?.kurz;
    assert.ok(bezeichnung, `${eintragId} hat keine Bezeichnung für die Anzeige`);
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
