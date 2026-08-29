import test from "node:test";
import assert from "node:assert/strict";
import { empfehlungsGrund, empfohleneRollen } from "../src/lib/empfehlung.js";
import { POSTFACH_ROLLEN } from "../src/config/rollen.js";
import { rolleFinden } from "../src/lib/rolle.js";

test("jede Empfehlung nennt Rollen, die es wirklich gibt", () => {
  const arten = [
    "Mobbing",
    "Beleidigung",
    "Hassrede",
    "Gewaltandrohung",
    "Diskriminierung",
    "Ausgrenzung",
    "Konflikt im Team",
    "Aggressiver Kunde/Fahrgast",
    "Sonstiges",
  ];

  for (const art of arten) {
    const empfohlen = empfohleneRollen(art);
    assert.ok(empfohlen.length >= 2 && empfohlen.length <= 3, `${art}: zwei bis drei Vorschläge`);
    for (const id of empfohlen) {
      assert.ok(rolleFinden(id), `${art} schlägt die unbekannte Rolle ${id} vor`);
      assert.ok(
        POSTFACH_ROLLEN.some((rolle) => rolle.id === id),
        `${art} schlägt ${id} vor, die gar kein Postfach hat`
      );
    }
  }
});

test("bei Diskriminierung steht die Gleichstellungsbeauftragte vorn", () => {
  assert.equal(empfohleneRollen("Diskriminierung")[0], "gleichstellung");
});

test("eine unbekannte Vorfallart führt nicht ins Leere", () => {
  const empfohlen = empfohleneRollen("etwas ganz anderes");
  assert.ok(empfohlen.length > 0);
  assert.match(empfehlungsGrund("etwas ganz anderes"), /unsicher/);
});

test("der Grund macht deutlich, dass es ein Vorschlag ist", () => {
  assert.match(empfehlungsGrund("Mobbing"), /jede andere wählen/);
});
