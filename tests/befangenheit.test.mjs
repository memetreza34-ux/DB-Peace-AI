import test from "node:test";
import assert from "node:assert/strict";
import {
  ausgeblendeteEigene,
  istBefangen,
  istMeineRolle,
  meineRollen,
  sichtbareFaelle,
} from "../src/lib/rolle.js";
import { DEMO_FAELLE } from "../src/data/demoFaelle.js";
import { MEINE_ROLLEN, ROLLEN } from "../src/config/rollen.js";

test("wer selbst in der JAV ist, sieht seinen eigenen Vorgang dort nicht", () => {
  const eigener = DEMO_FAELLE.find((fall) => fall.vonMir && fall.empfaenger === "jav");
  assert.ok(eigener, "für diesen Fall braucht es einen eigenen JAV-Vorgang in den Demo-Daten");

  const imPostfach = sichtbareFaelle("jav", DEMO_FAELLE);
  assert.equal(
    imPostfach.some((fall) => fall.id === eigener.id),
    false,
    "der eigene Vorgang darf nicht im eigenen Postfach liegen"
  );
});

test("ein Fall über die eigene Person verschwindet vollständig", () => {
  const gegenMich = DEMO_FAELLE.find((fall) => fall.betrifftMich);
  assert.ok(gegenMich, "für diesen Fall braucht es einen Vorgang gegen die eigene Person");

  const imPostfach = sichtbareFaelle(gegenMich.empfaenger, DEMO_FAELLE);
  assert.equal(imPostfach.some((fall) => fall.id === gegenMich.id), false);
});

test("die Zählung verrät keinen Fall über die eigene Person", () => {
  // Der Zähler steht in der Oberfläche. Zählte er Fälle gegen die eigene Person
  // mit, wüsste sie daraus, dass jemand sie gemeldet hat.
  const nurGegenMich = [
    { id: "X-1", empfaenger: "jav", betrifftMich: true },
    { id: "X-2", empfaenger: "jav", text: "normaler Fall" },
  ];
  assert.equal(ausgeblendeteEigene("jav", nurGegenMich), 0, "das darf sich nicht andeuten");

  const eigener = [{ id: "X-3", empfaenger: "jav", vonMir: true }];
  assert.equal(ausgeblendeteEigene("jav", eigener), 1, "den eigenen Vorgang darf man erklärt bekommen");
});

test("Befangenheit greift in jeder Rolle, nicht nur in der JAV", () => {
  for (const rolle of ROLLEN) {
    const faelle = [
      { id: "E", empfaenger: rolle.id, vonMir: true },
      { id: "G", empfaenger: rolle.id, betrifftMich: true },
    ];
    assert.equal(sichtbareFaelle(rolle.id, faelle).length, 0, `${rolle.id} zeigt einen befangenen Fall`);
  }
});

test("die eigene Sammlung zeigt den Vorgang weiterhin", async () => {
  const { eigeneFaelle } = await import("../src/lib/rolle.js");
  const eigener = DEMO_FAELLE.find((fall) => fall.vonMir && fall.empfaenger === "jav");

  assert.ok(
    eigeneFaelle(DEMO_FAELLE).some((fall) => fall.id === eigener.id),
    "ausgeblendet ist er nur in der Bearbeitungsrolle, nicht in der eigenen Übersicht"
  );
});

test("istBefangen erkennt beide Fälle und lässt normale durch", () => {
  assert.equal(istBefangen({ vonMir: true }), true);
  assert.equal(istBefangen({ betrifftMich: true }), true);
  assert.equal(istBefangen({ id: "normal" }), false);
  assert.equal(istBefangen(null), false);
});

test("eigene Rollen sind von Vorschau-Rollen unterscheidbar", () => {
  assert.deepEqual(meineRollen().map((rolle) => rolle.id), MEINE_ROLLEN);
  assert.equal(istMeineRolle("jav"), true, "die Demo-Person ist Azubi und JAV-Mitglied");
  assert.equal(istMeineRolle("azubi"), true);
  assert.equal(istMeineRolle("hr"), false);
});

test("die überörtliche Ausweichstufe ist erreichbar und hat eigene Fälle", () => {
  const ueberoertlich = ROLLEN.filter((rolle) => rolle.ueberoertlich);
  assert.ok(ueberoertlich.length >= 2, "Gesamt-JAV und Konzern-JAV fehlen");
  for (const rolle of ueberoertlich) {
    assert.ok(rolle.grundlage, `${rolle.id} braucht eine Rechtsgrundlage`);
  }
  assert.ok(
    sichtbareFaelle("gjav", DEMO_FAELLE).length > 0,
    "für die Vorführung braucht die Gesamt-JAV mindestens einen Fall"
  );
});
