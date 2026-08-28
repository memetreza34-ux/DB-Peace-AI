/**
 * Wohin die App schreibt — abhängig davon, ob das Gerät geteilt wird.
 *
 * Persönliches Gerät: localStorage, die Einträge bleiben.
 * Geteiltes Gerät: sessionStorage. Das überlebt ein Neuladen, damit niemand
 * beim versehentlichen Aktualisieren seine Notizen verliert — aber nicht das
 * Schließen des Fensters und nicht den Quick Exit. Die nächste Person am selben
 * Gerät findet nichts vor.
 *
 * Alles, was persönliche Inhalte speichert, geht über diese Stelle. Wer
 * localStorage direkt anspricht, umgeht den Gerätemodus.
 */

import { istGeteilt } from "./geraet.js";

function speicher() {
  return istGeteilt() ? sessionStorage : localStorage;
}

export function lesen(schluessel) {
  try {
    return speicher().getItem(schluessel);
  } catch {
    return null;
  }
}

export function schreiben(schluessel, wert) {
  try {
    speicher().setItem(schluessel, wert);
    return { ok: true, fehler: "" };
  } catch {
    return {
      ok: false,
      fehler:
        "Der Speicher dieses Geräts ist voll. Der Eintrag ist noch auf dem Bildschirm, aber " +
        "noch nicht gesichert. Lösche ältere Einträge oder Fotos und versuche es erneut.",
    };
  }
}

export function entfernen(schluessel) {
  try {
    speicher().removeItem(schluessel);
  } catch {
    /* Kein Speicherzugriff — dann ist auch nichts zu entfernen. */
  }
}
