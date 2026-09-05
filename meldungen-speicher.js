/*
 * Ablage für abgeschickte Meldungen.
 *
 * SQLite kommt seit Node 22 mit der Laufzeit mit — kein zusätzliches Paket,
 * kein Dienst, der laufen muss. Die Datei liegt neben dem Projekt und
 * verlässt den Rechner nicht. Für einen Prototyp ist das die ehrlichste
 * Variante: Meldungen kommen wirklich an, aber niemand sonst kann sie lesen.
 *
 * Was hier bewusst NICHT passiert:
 * - keine Verschlüsselung. Wer Zugriff auf die Datei hat, liest sie im
 *   Klartext. Das muss die App auch so sagen und darf nichts anderes
 *   behaupten.
 * - keine Benutzerkonten. Wer welche Rolle hat, entscheidet der Browser.
 *   Für einen echten Betrieb wäre das der erste Punkt, der zu klären ist.
 */
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { ROLLEN, RECHTE } from "./src/config/rollen.js";

const DATEI = process.env.MELDUNGEN_DB || path.resolve(process.cwd(), "daten/meldungen.db");

let db = null;

function verbindung() {
  if (db) return db;
  fs.mkdirSync(path.dirname(DATEI), { recursive: true });
  db = new DatabaseSync(DATEI);
  db.exec(`
    CREATE TABLE IF NOT EXISTS meldungen (
      id           TEXT PRIMARY KEY,
      eingegangen  TEXT NOT NULL,
      empfaenger   TEXT NOT NULL,
      kategorie    TEXT NOT NULL,
      anonym       INTEGER NOT NULL DEFAULT 1,
      status       TEXT NOT NULL DEFAULT 'offen',
      inhalt       TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS meldungen_empfaenger
      ON meldungen (empfaenger, eingegangen DESC);
  `);
  return db;
}

/*
 * Wer eine Meldung bekommen kann, steht in src/config/rollen.js — dieselbe
 * Liste, aus der die App die Empfängerauswahl baut. Zwei getrennte Listen
 * laufen sonst auseinander, und eine Meldung landet in einem Postfach, das
 * niemand liest, während die meldende Person sie für angekommen hält.
 */
export const EMPFAENGER = ROLLEN.filter((rolle) => RECHTE[rolle.gruppe]?.postfach).map(
  (rolle) => rolle.id,
);

export function meldungAnlegen({ empfaenger, kategorie, anonym, inhalt }) {
  if (!EMPFAENGER.includes(empfaenger)) {
    const fehler = new Error("unbekannter_empfaenger");
    fehler.status = 400;
    throw fehler;
  }
  if (!kategorie || typeof kategorie !== "string") {
    const fehler = new Error("kategorie_fehlt");
    fehler.status = 400;
    throw fehler;
  }

  const eintrag = {
    id: `${empfaenger.toUpperCase()}-${crypto.randomInt(1000, 9999)}`,
    eingegangen: new Date().toISOString(),
    empfaenger,
    kategorie: String(kategorie).slice(0, 120),
    anonym: anonym === false ? 0 : 1,
    status: "offen",
    inhalt: JSON.stringify(inhalt ?? {}).slice(0, 20_000),
  };

  verbindung()
    .prepare(
      `INSERT INTO meldungen (id, eingegangen, empfaenger, kategorie, anonym, status, inhalt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      eintrag.id,
      eintrag.eingegangen,
      eintrag.empfaenger,
      eintrag.kategorie,
      eintrag.anonym,
      eintrag.status,
      eintrag.inhalt,
    );

  return { id: eintrag.id, eingegangen: eintrag.eingegangen };
}

export function meldungenFuer(empfaenger) {
  if (!EMPFAENGER.includes(empfaenger)) return [];
  const zeilen = verbindung()
    .prepare(
      `SELECT id, eingegangen, empfaenger, kategorie, anonym, status, inhalt
       FROM meldungen WHERE empfaenger = ? ORDER BY eingegangen DESC LIMIT 200`,
    )
    .all(empfaenger);

  return zeilen.map((z) => ({
    ...z,
    anonym: z.anonym === 1,
    inhalt: sicherLesen(z.inhalt),
  }));
}

/* Eine kaputte Zeile darf nicht das ganze Postfach leer machen. */
function sicherLesen(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { fehler: "Inhalt konnte nicht gelesen werden" };
  }
}

export function statusSetzen(id, status) {
  const erlaubt = ["offen", "in-bearbeitung", "abgeschlossen"];
  if (!erlaubt.includes(status)) {
    const fehler = new Error("unbekannter_status");
    fehler.status = 400;
    throw fehler;
  }
  const ergebnis = verbindung()
    .prepare(`UPDATE meldungen SET status = ? WHERE id = ?`)
    .run(status, id);
  return ergebnis.changes > 0;
}

/* Für die Tests: eigene Datei, sauberer Zustand. */
export function _zuruecksetzenFuerTests() {
  if (db) db.close();
  db = null;
}
