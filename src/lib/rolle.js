/**
 * Die eine Stelle, die beantwortet: Was darf die gerade gewählte Rolle sehen?
 *
 * Absichtlich klein und ohne React, damit sie testbar bleibt. Die Regel, dass
 * Rollen einander nicht in die Postfächer schauen, ist der Kern dieser App —
 * sie darf nicht in Komponenten verstreut liegen, wo sie beim nächsten Umbau
 * versehentlich aufgeweicht wird.
 *
 * Grundhaltung: im Zweifel nichts zeigen. Eine unbekannte Rolle sieht nichts,
 * ein Fall ohne Empfänger erreicht niemanden.
 */

import { ROLLEN, RECHTE, GRUPPEN, MEINE_ROLLEN } from "../config/rollen.js";

/** Liefert die Rolle zu einer Id, oder null. */
export function rolleFinden(rolleId) {
  return ROLLEN.find((rolle) => rolle.id === rolleId) ?? null;
}

/** Die Rechte der Gruppe, zu der die Rolle gehört. Unbekannte Rolle: keine Rechte. */
export function rechteVon(rolleId) {
  const rolle = rolleFinden(rolleId);
  if (!rolle) return null;
  return RECHTE[rolle.gruppe] ?? null;
}

/** Darf diese Rolle das? Unbekanntes Recht oder unbekannte Rolle: nein. */
export function darf(rolleId, recht) {
  const rechte = rechteVon(rolleId);
  if (!rechte) return false;
  return Boolean(rechte[recht]);
}

/** Hat die Rolle ein eigenes Postfach? */
export function hatPostfach(rolleId) {
  return darf(rolleId, "postfach");
}

/**
 * Befangenheit.
 *
 * JAV-Mitglieder sind selbst Auszubildende. Damit passiert zwangsläufig beides:
 * Man schickt selbst eine Meldung an das eigene Gremium, und irgendwann liegt
 * eine Meldung über einen selbst im eigenen Postfach. Beides darf man nicht
 * bearbeiten.
 *
 * Die zwei Fälle werden bewusst unterschiedlich behandelt:
 *
 * - Den eigenen Vorgang darf man erklärt bekommen — man weiß ohnehin, dass man
 *   ihn geschrieben hat.
 * - Ein Fall, der sich gegen einen richtet, verschwindet spurlos. Ein Hinweis
 *   wie „ein Vorgang wird dir nicht angezeigt" würde der betroffenen Person
 *   verraten, dass jemand sie gemeldet hat — und damit die Meldung selbst.
 */
export function istBefangen(fall) {
  return Boolean(fall?.vonMir) || Boolean(fall?.betrifftMich);
}

/**
 * Die Fälle, die diese Rolle sehen darf: ausschließlich die, die an sie selbst
 * gerichtet sind — und keine, bei denen die nutzende Person befangen ist. Es
 * gibt bewusst keinen Weg, das zu erweitern: keine Vorgesetztensicht, keine
 * Sammelansicht, kein „nur die Statistik".
 */
export function sichtbareFaelle(rolleId, faelle) {
  if (!Array.isArray(faelle)) return [];
  if (!hatPostfach(rolleId)) return [];
  return faelle.filter((fall) => fall?.empfaenger === rolleId && !istBefangen(fall));
}

/**
 * Wie viele eigene Vorgänge in dieser Rolle ausgeblendet wurden.
 *
 * Zählt ausschließlich selbst gemeldete Fälle. Fälle über die eigene Person
 * bleiben absichtlich ungezählt — sonst verriete die Zahl ihre Existenz.
 */
export function ausgeblendeteEigene(rolleId, faelle) {
  if (!Array.isArray(faelle) || !hatPostfach(rolleId)) return 0;
  return faelle.filter((fall) => fall?.empfaenger === rolleId && fall?.vonMir).length;
}

/** Die Rollen, die der nutzenden Person selbst gehören. */
export function meineRollen() {
  return MEINE_ROLLEN.map(rolleFinden).filter(Boolean);
}

/** Ist das eine eigene Rolle — oder nur eine Vorschau auf eine fremde? */
export function istMeineRolle(rolleId) {
  return MEINE_ROLLEN.includes(rolleId);
}

/**
 * Die Fälle, die die meldende Person selbst eingereicht hat. Sie sieht ihren
 * eigenen Vorgang immer — unabhängig davon, an welche Stelle er ging.
 */
export function eigeneFaelle(faelle) {
  if (!Array.isArray(faelle)) return [];
  return faelle.filter((fall) => fall?.vonMir);
}

/** Darf diese Rolle einen Fall weitergeben — und unter welcher Bedingung? */
export function weiterleitungsRegel(rolleId) {
  const rechte = rechteVon(rolleId);
  if (!rechte || !rechte.weiterleiten) return { erlaubt: false, bedingung: "" };
  return {
    erlaubt: true,
    bedingung:
      rechte.weiterleiten === "nur-mit-zustimmung"
        ? "Nur mit ausdrücklicher Zustimmung der betroffenen Person."
        : "",
  };
}

/** Name der Gruppe, für Beschriftungen in der Oberfläche. */
export function gruppeVon(rolleId) {
  const rolle = rolleFinden(rolleId);
  if (!rolle) return null;
  return GRUPPEN[rolle.gruppe] ?? null;
}
