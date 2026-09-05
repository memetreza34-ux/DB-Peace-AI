import test from "node:test";
import assert from "node:assert/strict";
import { ROLLEN, RECHTE, POSTFACH_ROLLEN } from "../src/config/rollen.js";
import { aktionenFuer } from "../src/config/aktionen.js";
import {
  darf,
  hatPostfach,
  rolleFinden,
  sichtbareFaelle,
  weiterleitungsRegel,
} from "../src/lib/rolle.js";

const faelle = [
  { id: "F-1", empfaenger: "jav", text: "Ärger in der Ausbildung" },
  { id: "F-2", empfaenger: "hr", text: "Formale Beschwerde" },
  { id: "F-3", empfaenger: "betriebsrat", text: "Konflikt mit Führungskraft" },
  { id: "F-4", empfaenger: "compliance", text: "Hinweis auf Regelverstoß" },
];

test("jede Rolle sieht ausschließlich die an sie gerichteten Fälle", () => {
  assert.deepEqual(sichtbareFaelle("jav", faelle).map((f) => f.id), ["F-1"]);
  assert.deepEqual(sichtbareFaelle("hr", faelle).map((f) => f.id), ["F-2"]);
  assert.deepEqual(sichtbareFaelle("betriebsrat", faelle).map((f) => f.id), ["F-3"]);
});

test("HR sieht keinen Fall, der an die JAV ging — der Kern der Trennung", () => {
  const beiHR = sichtbareFaelle("hr", faelle);
  assert.equal(beiHR.some((f) => f.empfaenger === "jav"), false);

  const beiJAV = sichtbareFaelle("jav", faelle);
  assert.equal(beiJAV.some((f) => f.empfaenger === "hr"), false);
});

test("Compliance und Beratung bleiben getrennt", () => {
  assert.deepEqual(sichtbareFaelle("compliance", faelle).map((f) => f.id), ["F-4"]);
  assert.equal(sichtbareFaelle("vertrauensleute", faelle).length, 0);
});

test("Rollen ohne Postfach sehen gar nichts", () => {
  assert.equal(sichtbareFaelle("azubi", faelle).length, 0);
  assert.equal(sichtbareFaelle("standortpflege", faelle).length, 0);
  assert.equal(hatPostfach("standortpflege"), false);
});

test("eine unbekannte Rolle bekommt nichts zu sehen", () => {
  assert.equal(sichtbareFaelle("erfundene-rolle", faelle).length, 0);
  assert.equal(darf("erfundene-rolle", "postfach"), false);
  assert.equal(rolleFinden("erfundene-rolle"), null);
});

test("ein Fall ohne Empfänger erreicht niemanden", () => {
  const ohne = [{ id: "F-5", text: "kein Empfänger gewählt" }];
  for (const rolle of ROLLEN) {
    assert.equal(sichtbareFaelle(rolle.id, ohne).length, 0, `${rolle.id} darf ihn nicht sehen`);
  }
});

test("nur formale Stellen dürfen Fristen setzen", () => {
  assert.equal(darf("compliance", "fristenSetzen"), true);
  assert.equal(darf("hr", "fristenSetzen"), true);
  assert.equal(darf("jav", "fristenSetzen"), false);
  assert.equal(darf("afk", "fristenSetzen"), false);
});

test("Weitergeben geht nur mit Zustimmung der betroffenen Person", () => {
  for (const rolle of POSTFACH_ROLLEN) {
    const regel = weiterleitungsRegel(rolle.id);
    assert.equal(regel.erlaubt, true, `${rolle.id} soll weitergeben dürfen`);
    assert.match(regel.bedingung, /Zustimmung/, `${rolle.id} braucht die Zustimmungsbedingung`);
  }
  assert.equal(weiterleitungsRegel("azubi").erlaubt, false);
});

test("keine Rolle darf fremde Fälle sehen", () => {
  for (const gruppe of Object.values(RECHTE)) {
    assert.equal(gruppe.fremdeFaelleSehen, false);
  }
});

test("jede Rolle gehört zu einer bekannten Gruppe", () => {
  for (const rolle of ROLLEN) {
    assert.ok(RECHTE[rolle.gruppe], `${rolle.id} hat keine gültige Gruppe`);
  }
});

test("die meldende Person sieht ihre eigenen Fälle, egal an wen sie gingen", async () => {
  const { eigeneFaelle } = await import("../src/lib/rolle.js");
  const { DEMO_FAELLE } = await import("../src/data/demoFaelle.js");

  const meine = eigeneFaelle(DEMO_FAELLE);
  assert.ok(meine.length > 0, "es sollte eigene Fälle geben");
  assert.ok(
    meine.every((fall) => fall.vonMir === true),
    "es dürfen nur eigene Fälle dabei sein"
  );

  // Gegenprobe: Ein eigener Fall an die JAV darf trotzdem nicht bei HR auftauchen.
  const eigenerJavFall = meine.find((fall) => fall.empfaenger === "jav");
  assert.ok(eigenerJavFall, "für die Vorführung braucht es einen eigenen JAV-Fall");
  const beiHR = sichtbareFaelle("hr", DEMO_FAELLE);
  assert.equal(beiHR.some((fall) => fall.id === eigenerJavFall.id), false);
});

test("jede Rolle mit Postfach hat eigene Aktionen — keine zwei sind gleich", () => {
  // Wenn zwei Rollen dieselben Knöpfe haben, ist eine davon nur ein anderes
  // Etikett. Gesamt-JAV und Konzern-JAV waren genau das, bis jede Ebene
  // bekam, wofür es sie gibt: die eine klärt ohne den Standort, die andere
  // schaut über Unternehmensgrenzen.
  const mitPostfach = ROLLEN.filter((rolle) => RECHTE[rolle.gruppe]?.postfach);
  const gesehen = new Map();

  for (const rolle of mitPostfach) {
    const aktionen = aktionenFuer(rolle.id).map((a) => a.id);
    if (aktionen.length === 0) continue; // Vertrauensleute: bewusst ohne
    const schluessel = aktionen.slice().sort().join("|");
    const schon = gesehen.get(schluessel);
    assert.ok(
      !schon,
      `"${rolle.kurz}" hat dieselben Aktionen wie "${schon}" — dann ist eine der beiden nur ein Etikett`,
    );
    gesehen.set(schluessel, rolle.kurz);
  }
});

test("jede Rolle mit Postfach hat entweder eigene Aktionen oder einen Grund dagegen", () => {
  const ohneAktionen = ROLLEN.filter(
    (rolle) => RECHTE[rolle.gruppe]?.postfach && aktionenFuer(rolle.id).length === 0,
  ).map((r) => r.id);

  // Nur die Vertrauensleute dürfen leer sein: wer dort meldet, will reden und
  // keinen Vorgang auslösen. Das steht so auch in aktionen.js.
  assert.deepEqual(
    ohneAktionen,
    ["vertrauensleute"],
    "Eine Rolle hat ein Postfach, aber nichts, was sie damit tun kann",
  );
});
