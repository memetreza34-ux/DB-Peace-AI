/**
 * Das Gedächtnisprotokoll auf dem Gerät.
 *
 * Einordnung, damit hier niemand mehr hineinliest als drinsteht: Die Einträge
 * bleiben auf diesem Gerät und werden nirgendwohin übertragen — aber sie sind
 * nicht verschlüsselt. Wer das Gerät entsperrt hat, kann sie lesen. Die PIN
 * sperrt die Oberfläche, nicht den Speicher.
 *
 * Wohin genau geschrieben wird, entscheidet der Gerätemodus (src/lib/geraet.js):
 * Auf einem geteilten Gerät überlebt nichts das Schließen des Fensters.
 *
 * Fotos werden vor dem Speichern verkleinert und als Data-URL abgelegt, sonst
 * wären sie nach dem nächsten Neuladen weg (Blob-URLs überleben das nicht) und
 * der Speicher wäre nach drei Handyfotos voll. Andere Dateien — PDF, Word,
 * Video — werden bewusst nicht mitgespeichert; dafür ist der Platz zu knapp.
 * Von ihnen bleibt nur der Name, und die App sagt das auch.
 */

import { lesen, schreiben } from "./speicher.js";
import { istGeteilt } from "./geraet.js";

const SPEICHER_SCHLUESSEL = "db-peace-protokoll";
const MAX_BILDKANTE = 1400;
const JPEG_QUALITAET = 0.72;

/**
 * Ein Beispiel, damit die Ansicht beim allerersten Öffnen nicht leer ist.
 * Als Beispiel gekennzeichnet und löschbar wie jeder andere Eintrag — einmal
 * gelöscht, kommt es nicht wieder.
 */
export const BEISPIEL_EINTRAG = {
  id: 1,
  date: "2026-07-20",
  time: "14:15",
  location: "Werkstatt / Pausenraum",
  category: "Beleidigung & Ausgrenzung",
  description: "Wiederholte abwertende Sprüche während der Teambesprechung.",
  witnesses: "2 Kolleg:innen anwesend",
  files: [],
  beispiel: true,
};

/**
 * Was tatsächlich in den Speicher geht. Anhänge ohne Inhalt behalten nur ihren
 * Namen — so weiß die Person später, dass da eine Datei war, und die App
 * behauptet nicht, sie noch zu haben.
 */
export function eintraegeFuerSpeicher(eintraege) {
  return eintraege.map((eintrag) => ({
    ...eintrag,
    files: (eintrag.files || []).map((datei) => ({
      name: datei.name,
      type: datei.type,
      url: datei.gespeichert ? datei.url : null,
      gespeichert: Boolean(datei.gespeichert),
    })),
  }));
}

/** Lädt das Protokoll. `ersterStart` ist true, solange nie gespeichert wurde. */
export function protokollLaden() {
  try {
    const roh = lesen(SPEICHER_SCHLUESSEL);
    if (roh === null) return { eintraege: [BEISPIEL_EINTRAG], ersterStart: true };
    const daten = JSON.parse(roh);
    if (!Array.isArray(daten)) return { eintraege: [], ersterStart: false };
    return { eintraege: daten, ersterStart: false };
  } catch {
    // Kaputter oder gesperrter Speicher darf die App nicht lahmlegen.
    return { eintraege: [], ersterStart: false };
  }
}

/** Sagt der Oberfläche, wie lange die Einträge bleiben. */
export function speicherHinweis() {
  return istGeteilt()
    ? "Dieses Gerät ist als geteiltes Gerät eingestellt: Deine Einträge verschwinden, sobald du das Fenster schließt. Nichts bleibt für die nächste Person zurück."
    : "Deine Einträge bleiben auf diesem Gerät und werden nirgendwohin gesendet. Sie sind dort aber nicht verschlüsselt — wer das Gerät entsperrt hat, kann sie lesen.";
}

/** Speichert das Protokoll. Gibt bei vollem Speicher einen Klartext-Hinweis zurück. */
export function protokollSpeichern(eintraege) {
  return schreiben(SPEICHER_SCHLUESSEL, JSON.stringify(eintraegeFuerSpeicher(eintraege)));
}

/**
 * Liest eine ausgewählte Datei so ein, dass sie einen Neustart übersteht.
 * Bilder werden verkleinert; alles andere behält nur seinen Namen.
 */
export async function dateiEinlesen(file) {
  const grundlage = { name: file.name, type: file.type };

  if (!file.type.startsWith("image/")) {
    return { ...grundlage, url: null, gespeichert: false };
  }

  try {
    const bitmap = await createImageBitmap(file);
    const faktor = Math.min(1, MAX_BILDKANTE / Math.max(bitmap.width, bitmap.height));
    const breite = Math.max(1, Math.round(bitmap.width * faktor));
    const hoehe = Math.max(1, Math.round(bitmap.height * faktor));

    const canvas = document.createElement("canvas");
    canvas.width = breite;
    canvas.height = hoehe;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, breite, hoehe);
    bitmap.close?.();

    return { ...grundlage, url: canvas.toDataURL("image/jpeg", JPEG_QUALITAET), gespeichert: true };
  } catch {
    // Lieber ein Anhang ohne Vorschau als ein Absturz beim Anhängen.
    return { ...grundlage, url: null, gespeichert: false };
  }
}
