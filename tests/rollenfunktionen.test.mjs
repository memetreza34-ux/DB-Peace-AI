import test from "node:test";
import assert from "node:assert/strict";
import { aktionenFuer, ROLLEN_AKTIONEN } from "../src/config/aktionen.js";
import { hinweiseFuer } from "../src/lib/hinweise.js";
import { musterErkennen, SCHWELLE, sperrBegruendung } from "../src/lib/muster.js";
import { fristenFuer, fristStand, verbleibendeTage, FRISTEN } from "../src/lib/fristen.js";
import { DEMO_FAELLE } from "../src/data/demoFaelle.js";
import { sichtbareFaelle } from "../src/lib/rolle.js";

test("die vier Demo-Rollen haben eigene Aktionen, die übrigen das Grundpostfach", () => {
  for (const rolle of ["jav", "afk", "hr", "compliance"]) {
    assert.ok(aktionenFuer(rolle).length > 0, `${rolle} braucht eigene Aktionen`);
  }
  assert.equal(aktionenFuer("vertrauensleute").length, 0, "Vertrauensleute lösen keinen Vorgang aus");
  assert.equal(aktionenFuer("azubi").length, 0);
  assert.equal(aktionenFuer("unbekannt").length, 0);
});

test("jede Aktion hat einen Vermerk für den Verlauf", () => {
  for (const rolleId of Object.keys(ROLLEN_AKTIONEN)) {
    for (const aktion of aktionenFuer(rolleId)) {
      assert.ok(aktion.label, "Aktion braucht eine Beschriftung");
      assert.ok(aktion.vermerk, `${aktion.id} braucht einen Vermerk`);
    }
  }
});

test("bei Minderjährigen erscheint der Hinweis auf das Jugendarbeitsschutzgesetz", () => {
  const fall = { merkmale: ["minderjaehrig"] };
  const hinweise = hinweiseFuer("jav", fall);
  assert.ok(hinweise.some((h) => h.grundlage === "JArbSchG"));

  const ohne = hinweiseFuer("jav", { merkmale: [] });
  assert.equal(ohne.some((h) => h.grundlage === "JArbSchG"), false);
});

test("bei Diskriminierung wird auf die laufende AGG-Frist hingewiesen", () => {
  const hinweise = hinweiseFuer("hr", { merkmale: ["diskriminierung"] });
  const frist = hinweise.find((h) => h.id === "agg-frist");
  assert.ok(frist, "der Fristhinweis fehlt");
  assert.match(frist.grundlage, /AGG/);
});

test("jeder Hinweis nennt seine Grundlage", () => {
  const faelle = [
    { merkmale: ["minderjaehrig"] },
    { merkmale: ["diskriminierung"] },
    { merkmale: ["belaestigung"] },
    { merkmale: [] },
  ];
  for (const rolle of ["jav", "betriebsrat", "sbv", "hr", "compliance", "afk"]) {
    for (const fall of faelle) {
      for (const hinweis of hinweiseFuer(rolle, fall)) {
        assert.ok(hinweis.grundlage, `${rolle}/${hinweis.id} ohne Grundlage`);
        assert.ok(hinweis.titel && hinweis.text);
      }
    }
  }
});

test("Auswertungen bleiben unter der Schwelle gesperrt", () => {
  const wenige = [
    { kategorie: "Arbeitszeit" },
    { kategorie: "Arbeitszeit" },
    { kategorie: "Umgangston" },
  ];
  const ergebnis = musterErkennen(wenige);
  assert.deepEqual(ergebnis.muster, [], "unter der Schwelle darf nichts erscheinen");
  assert.equal(ergebnis.gesperrt, 2, "beide Kategorien bleiben gesperrt");
  assert.match(sperrBegruendung(), /erkennbar/);
});

test("ab der Schwelle wird ein Muster sichtbar", () => {
  const viele = Array.from({ length: SCHWELLE }, () => ({ kategorie: "Arbeitszeit" }));
  const ergebnis = musterErkennen([...viele, { kategorie: "Umgangston" }]);
  assert.deepEqual(ergebnis.muster, [{ kategorie: "Arbeitszeit", anzahl: SCHWELLE }]);
  assert.equal(ergebnis.gesperrt, 1);
});

test("kein Demo-Postfach erreicht heute die Schwelle — die Sperre ist sichtbar", () => {
  for (const rolleId of ["jav", "hr", "compliance", "ausbildungsleitung"]) {
    const ergebnis = musterErkennen(sichtbareFaelle(rolleId, DEMO_FAELLE));
    assert.deepEqual(ergebnis.muster, [], `${rolleId} zeigt ein Muster, obwohl es zu wenige Fälle sind`);
  }
});

test("Fristen gelten nur für die Rollen, die sie führen", () => {
  assert.ok(fristenFuer("compliance").length > 0);
  assert.ok(fristenFuer("hr").length > 0);
  assert.equal(fristenFuer("jav").length, 0, "die JAV führt keine gesetzlichen Bearbeitungsfristen");
  assert.equal(fristenFuer("afk").length, 0);
});

test("der Fristenlauf rechnet vorwärts und rückwärts", () => {
  const frist = FRISTEN.eingangsbestaetigung;
  const heute = new Date("2026-08-26T10:00:00");

  const gestern = new Date("2026-08-25T10:00:00");
  assert.equal(verbleibendeTage(frist, gestern, heute), frist.tage - 1);
  assert.equal(fristStand(frist, gestern, heute).stand, "offen");

  const langeHer = new Date("2026-08-01T10:00:00");
  const ueberfaellig = fristStand(frist, langeHer, heute);
  assert.equal(ueberfaellig.stand, "ueberfaellig");
  assert.match(ueberfaellig.text, /überfällig/);

  assert.equal(verbleibendeTage(frist, null, heute), null);
});

test("jede Frist nennt ihre Rechtsgrundlage", () => {
  for (const frist of Object.values(FRISTEN)) {
    assert.ok(frist.grundlage, `${frist.id} ohne Grundlage`);
    assert.ok(frist.tage > 0);
    assert.ok(frist.erklaerung);
  }
});

test("Fristen, die nicht zum Fall passen, bleiben weg", async () => {
  const { eingangsDatum } = await import("../src/lib/fristen.js");

  const diskriminierung = { merkmale: ["diskriminierung"], tageHer: 0 };
  const arbeitszeit = { merkmale: ["minderjaehrig"], tageHer: 0 };

  assert.ok(
    fristenFuer("hr", diskriminierung).some((f) => f.id === "agg_geltendmachung"),
    "bei Diskriminierung gehört die AGG-Frist angezeigt"
  );
  assert.equal(
    fristenFuer("hr", arbeitszeit).some((f) => f.id === "agg_geltendmachung"),
    false,
    "bei einem Arbeitszeitverstoß ist die AGG-Frist nur Rauschen"
  );

  // Compliance führt seine Fristen unabhängig vom Merkmal.
  assert.equal(fristenFuer("compliance", arbeitszeit).length, 2);

  const heute = new Date("2026-08-26T10:00:00");
  assert.equal(eingangsDatum({ tageHer: 3 }, heute).getDate(), 23);
  assert.equal(eingangsDatum({}, heute), null);
});

test("die Fristenrechnung ignoriert die Uhrzeit", () => {
  const frist = FRISTEN.rueckmeldung; // 90 Tage
  const heuteFrueh = new Date("2026-08-26T07:15:00");
  const heuteSpaet = new Date("2026-08-26T23:50:00");

  // Heute eingegangen heißt: die volle Frist steht noch zur Verfügung — nicht 91 Tage.
  assert.equal(verbleibendeTage(frist, heuteFrueh, heuteFrueh), frist.tage);
  assert.equal(verbleibendeTage(frist, heuteFrueh, heuteSpaet), frist.tage);
  assert.equal(verbleibendeTage(frist, heuteSpaet, heuteFrueh), frist.tage);
});

test("aggregierte Zahlen folgen derselben Schwelle", async () => {
  const { ausweisbar } = await import("../src/lib/muster.js");

  assert.equal(ausweisbar(SCHWELLE), true);
  assert.equal(ausweisbar(SCHWELLE - 1), false);
  assert.equal(ausweisbar(0), false);
  assert.equal(ausweisbar(undefined), false);
});
