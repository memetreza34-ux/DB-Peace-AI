import test from "node:test";
import assert from "node:assert/strict";
import { tagesbezeichnung } from "../src/lib/stimmung.js";

test("die Tagesbezeichnung nennt die letzten Tage beim Namen", () => {
  const heute = new Date("2026-08-26T15:00:00");
  assert.equal(tagesbezeichnung("2026-08-26", new Date(heute)), "Heute");
  assert.equal(tagesbezeichnung("2026-08-25", new Date(heute)), "Gestern");
  assert.equal(tagesbezeichnung("2026-08-24", new Date(heute)), "Vorgestern");
  assert.equal(tagesbezeichnung("2026-08-01", new Date(heute)), "01.08.2026");
});

test("die Uhrzeit verschiebt die Bezeichnung nicht", () => {
  // Ein Eintrag um 23:50 darf am selben Tag nicht plötzlich „Gestern" heißen.
  assert.equal(tagesbezeichnung("2026-08-26", new Date("2026-08-26T23:50:00")), "Heute");
  assert.equal(tagesbezeichnung("2026-08-26", new Date("2026-08-26T00:05:00")), "Heute");
});
