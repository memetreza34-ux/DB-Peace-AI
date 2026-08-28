/**
 * Welcher Standort ist eingestellt — und wer steht dort hinter einer Rolle?
 *
 * Grundhaltung wie überall in dieser App: Was nicht hinterlegt ist, wird als
 * „noch nicht hinterlegt" gezeigt und nicht geraten. Ein leeres Ergebnis ist
 * hier ein gültiges Ergebnis.
 */

import { STANDORTE, STANDORT_ROLLEN } from "../config/standorte.js";

const SPEICHER_SCHLUESSEL = "db-peace-standort";

/** Der eingestellte Standort, oder null, solange keiner gewählt wurde. */
export function standortLaden() {
  try {
    const id = localStorage.getItem(SPEICHER_SCHLUESSEL);
    if (!id) return null;
    return STANDORTE.find((standort) => standort.id === id) ?? null;
  } catch {
    return null;
  }
}

/** Speichert die Auswahl. `null` setzt sie zurück. */
export function standortSpeichern(standortId) {
  try {
    if (!standortId) localStorage.removeItem(SPEICHER_SCHLUESSEL);
    else localStorage.setItem(SPEICHER_SCHLUESSEL, standortId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Die Personen hinter einer Rolle am gewählten Standort.
 * Leeres Array heißt: nicht hinterlegt — die App sagt das dann auch.
 */
export function besetzungFuer(standort, rolleId) {
  if (!standort || !STANDORT_ROLLEN.includes(rolleId)) return [];
  return standort.besetzung?.[rolleId] ?? [];
}

/** Ist für diese Rolle jemand hinterlegt? */
export function istBesetzt(standort, rolleId) {
  return besetzungFuer(standort, rolleId).length > 0;
}
