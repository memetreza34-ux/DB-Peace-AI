import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

/*
 * Eigene Datenbankdatei je Testlauf. Sonst schreiben die Tests in die Ablage,
 * mit der jemand gerade arbeitet.
 */
const verzeichnis = fs.mkdtempSync(path.join(os.tmpdir(), "db-peace-test-"));
process.env.MELDUNGEN_DB = path.join(verzeichnis, "meldungen.db");

const { meldungAnlegen, meldungenFuer, statusSetzen, EMPFAENGER } = await import(
  "../meldungen-speicher.js"
);
const { ROLLEN, RECHTE } = await import("../src/config/rollen.js");

test("eine Meldung landet im Postfach der gewählten Stelle", () => {
  const angelegt = meldungAnlegen({
    empfaenger: "jav",
    kategorie: "Mobbing",
    anonym: true,
    inhalt: { text: "Testfall", ort: "Werkstatt" },
  });

  assert.match(angelegt.id, /^JAV-\d{4}$/);
  assert.ok(angelegt.eingegangen, "Eingangszeit fehlt");

  const posteingang = meldungenFuer("jav");
  const gefunden = posteingang.find((m) => m.id === angelegt.id);
  assert.ok(gefunden, "Meldung ist nicht im Postfach angekommen");
  assert.equal(gefunden.kategorie, "Mobbing");
  assert.equal(gefunden.status, "offen");
  assert.equal(gefunden.inhalt.ort, "Werkstatt");
});

test("eine Meldung taucht nicht im Postfach einer anderen Stelle auf", () => {
  meldungAnlegen({ empfaenger: "compliance", kategorie: "Diskriminierung", inhalt: {} });
  const beiDerJav = meldungenFuer("jav");
  assert.ok(
    beiDerJav.every((m) => m.empfaenger === "jav"),
    "fremde Meldung im JAV-Postfach",
  );
});

test("unbekannte Empfänger werden abgewiesen", () => {
  // Ein Tippfehler im Frontend darf keine Meldung in ein Postfach legen,
  // das niemand liest — die meldende Person hielte sie für angekommen.
  assert.throws(
    () => meldungAnlegen({ empfaenger: "vorstand", kategorie: "Mobbing", inhalt: {} }),
    /unbekannter_empfaenger/,
  );
  assert.deepEqual(meldungenFuer("vorstand"), []);
});

test("eine Meldung ohne Kategorie wird abgewiesen", () => {
  assert.throws(
    () => meldungAnlegen({ empfaenger: "jav", inhalt: {} }),
    /kategorie_fehlt/,
  );
});

test("anonym ist die Voreinstellung", () => {
  const ohneAngabe = meldungAnlegen({ empfaenger: "hr", kategorie: "Konflikt", inhalt: {} });
  const eintrag = meldungenFuer("hr").find((m) => m.id === ohneAngabe.id);
  assert.equal(eintrag.anonym, true, "eine Meldung ohne Angabe muss anonym bleiben");

  const mitNamen = meldungAnlegen({
    empfaenger: "hr",
    kategorie: "Konflikt",
    anonym: false,
    inhalt: {},
  });
  assert.equal(meldungenFuer("hr").find((m) => m.id === mitNamen.id).anonym, false);
});

test("der Status lässt sich setzen, aber nur auf bekannte Werte", () => {
  const { id } = meldungAnlegen({ empfaenger: "betriebsrat", kategorie: "Arbeitszeit", inhalt: {} });

  assert.equal(statusSetzen(id, "in-bearbeitung"), true);
  assert.equal(
    meldungenFuer("betriebsrat").find((m) => m.id === id).status,
    "in-bearbeitung",
  );

  assert.throws(() => statusSetzen(id, "erledigt-irgendwie"), /unbekannter_status/);
  assert.equal(statusSetzen("GIBT-9999", "abgeschlossen"), false);
});

test("jede Rolle mit Postfach ist als Empfänger bekannt", () => {
  // Sonst kann eine Rolle in der App gewählt werden, deren Meldungen ins Leere
  // laufen.
  const mitPostfach = ROLLEN.filter((r) => RECHTE[r.gruppe]?.postfach).map((r) => r.id);
  for (const id of mitPostfach) {
    assert.ok(
      EMPFAENGER.includes(id),
      `Rolle "${id}" hat ein Postfach, ist aber kein bekannter Empfänger`,
    );
  }
});

test.after(() => {
  fs.rmSync(verzeichnis, { recursive: true, force: true });
});

test("ein Gesprächswunsch ist keine Meldung", () => {
  // Wer nur reden will, löst keinen Vorgang mit Fristen aus. Die Rolle muss
  // auf den ersten Blick sehen, was von ihr erwartet wird.
  const gespraech = meldungAnlegen({
    empfaenger: "betriebsrat",
    kategorie: "Gespräch",
    art: "gespraech",
    inhalt: { anliegen: "Ich würde gern mit jemandem reden." },
  });

  assert.match(gespraech.id, /^GBETRIEBSRAT-\d{4}$/, "Gesprächswünsche brauchen ein eigenes Kennzeichen");
  assert.equal(gespraech.art, "gespraech");

  const eintrag = meldungenFuer("betriebsrat").find((m) => m.id === gespraech.id);
  assert.equal(eintrag.art, "gespraech");
});

test("ohne Angabe ist es eine Meldung, und erfundene Arten werden abgewiesen", () => {
  const ohne = meldungAnlegen({ empfaenger: "jav", kategorie: "Mobbing", inhalt: {} });
  assert.equal(meldungenFuer("jav").find((m) => m.id === ohne.id).art, "meldung");

  assert.throws(
    () => meldungAnlegen({ empfaenger: "jav", kategorie: "X", art: "beschwerde", inhalt: {} }),
    /unbekannte_art/,
  );
});
