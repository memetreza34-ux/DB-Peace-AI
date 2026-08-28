/**
 * Das Stimmungs-Tagebuch.
 *
 * Die App nennt es „dein privates Stimmungs-Tagebuch" — dann muss sie es auch
 * führen. Vorher landete jeder Eintrag in der Browser-Konsole und war weg; die
 * Sammlung zeigte dafür erfundene Beispieltage. Das war genau die Art Zusage,
 * die dieses Projekt sonst vermeidet.
 *
 * Wohin gespeichert wird, entscheidet der Gerätemodus (src/lib/speicher.js):
 * Auf einem geteilten Gerät überlebt auch das Tagebuch das Schließen nicht.
 */

import { lesen, schreiben } from "./speicher.js";

const SPEICHER_SCHLUESSEL = "db-peace-stimmung";
const MAX_EINTRAEGE = 30;

export function stimmungLaden() {
  try {
    const roh = lesen(SPEICHER_SCHLUESSEL);
    if (!roh) return [];
    const daten = JSON.parse(roh);
    return Array.isArray(daten) ? daten : [];
  } catch {
    return [];
  }
}

/**
 * Legt einen Eintrag an. Pro Tag zählt der letzte — wer sich am Nachmittag
 * anders fühlt als morgens, soll das ändern können, ohne zwei Zeilen zu
 * erzeugen.
 */
export function stimmungSpeichern(eintrag) {
  const heute = new Date().toISOString().slice(0, 10);
  const neuer = {
    datum: heute,
    stimmung: eintrag.stimmung,
    grund: eintrag.grund ?? null,
    notiz: eintrag.notiz ?? "",
  };

  const bisher = stimmungLaden().filter((vorhanden) => vorhanden.datum !== heute);
  const alle = [neuer, ...bisher].slice(0, MAX_EINTRAEGE);
  return schreiben(SPEICHER_SCHLUESSEL, JSON.stringify(alle));
}

/** Für die Anzeige: „Heute", „Gestern", sonst das Datum. */
export function tagesbezeichnung(datum, heute = new Date()) {
  const tag = new Date(`${datum}T00:00:00`);
  const differenz = Math.round((heute.setHours(0, 0, 0, 0) - tag.getTime()) / 86400000);
  if (differenz === 0) return "Heute";
  if (differenz === 1) return "Gestern";
  if (differenz === 2) return "Vorgestern";
  return tag.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}
