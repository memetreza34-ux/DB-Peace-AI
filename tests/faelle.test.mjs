import test from "node:test";
import assert from "node:assert/strict";
import { alleFaelle, fallWeitergeben, verlaufErgaenzen, zuruecksetzen } from "../src/lib/faelle.js";
import { sichtbareFaelle } from "../src/lib/rolle.js";

test("ein weitergegebener Fall wechselt das Postfach", (t) => {
  t.after(zuruecksetzen);

  const vorher = sichtbareFaelle("betriebsrat", alleFaelle());
  const fall = sichtbareFaelle("jav", alleFaelle())[0];
  assert.ok(fall, "für den Test braucht es einen JAV-Fall");

  fallWeitergeben(fall.id, "JAV", "betriebsrat", "Betriebsrat", "10:00");

  assert.equal(
    sichtbareFaelle("jav", alleFaelle()).some((eintrag) => eintrag.id === fall.id),
    false,
    "beim Absender darf er nicht liegen bleiben"
  );
  assert.equal(sichtbareFaelle("betriebsrat", alleFaelle()).length, vorher.length + 1);
});

test("die Weitergabe steht für beide Seiten im Verlauf", (t) => {
  t.after(zuruecksetzen);

  const fall = sichtbareFaelle("jav", alleFaelle())[0];
  fallWeitergeben(fall.id, "JAV", "sbv", "SBV", "11:30");

  const beiSBV = sichtbareFaelle("sbv", alleFaelle()).find((eintrag) => eintrag.id === fall.id);
  const letzter = beiSBV.verlauf.at(-1);
  assert.match(letzter.text, /Zustimmung/, "die Zustimmung muss nachvollziehbar sein");
  assert.match(letzter.text, /JAV/);
  assert.match(letzter.text, /SBV/);
});

test("zurücksetzen stellt den Ausgangszustand her", () => {
  const vorher = sichtbareFaelle("jav", alleFaelle()).length;
  const fall = sichtbareFaelle("jav", alleFaelle())[0];

  fallWeitergeben(fall.id, "JAV", "hr", "HR", "12:00");
  assert.equal(sichtbareFaelle("jav", alleFaelle()).length, vorher - 1);

  zuruecksetzen();
  assert.equal(sichtbareFaelle("jav", alleFaelle()).length, vorher);
});

test("ein Verlaufseintrag verändert keinen anderen Fall", (t) => {
  t.after(zuruecksetzen);

  const [erster, zweiter] = alleFaelle();
  const laengeVorher = zweiter.verlauf.length;
  verlaufErgaenzen(erster.id, { id: 1, von: "rolle", text: "Notiz", zeit: "09:00" });

  const zweiterDanach = alleFaelle().find((fall) => fall.id === zweiter.id);
  assert.equal(zweiterDanach.verlauf.length, laengeVorher);
});
