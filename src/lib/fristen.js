/**
 * Fristen, die in bearbeitenden Rollen mitlaufen.
 *
 * Wichtig zur Einordnung: Die Tageswerte stehen so im Gesetz, sie sind nicht
 * geschätzt. Trotzdem gilt hier dieselbe Regel wie bei den Kontaktdaten — vor
 * einem Pilotbetrieb gehört jede dieser Angaben juristisch bestätigt, bevor
 * sich jemand darauf verlässt. Deshalb trägt jede Frist ihre Quelle mit sich
 * und wird in der Oberfläche mit Grundlage angezeigt.
 *
 * Siehe docs/Pilot-Checkliste.md.
 */

export const FRISTEN = {
  eingangsbestaetigung: {
    id: "eingangsbestaetigung",
    bezeichnung: "Eingang bestätigen",
    tage: 7,
    grundlage: "§ 17 Abs. 1 HinSchG",
    gilt_fuer: ["compliance"],
    erklaerung:
      "Der Eingang einer Meldung ist der meldenden Person innerhalb von sieben Tagen zu bestätigen.",
  },
  rueckmeldung: {
    id: "rueckmeldung",
    bezeichnung: "Rückmeldung geben",
    tage: 90,
    grundlage: "§ 17 Abs. 2 HinSchG",
    gilt_fuer: ["compliance"],
    erklaerung:
      "Innerhalb von drei Monaten nach der Eingangsbestätigung ist eine Rückmeldung zu geben — welche Maßnahmen geplant oder ergriffen wurden.",
  },
  agg_geltendmachung: {
    id: "agg_geltendmachung",
    bezeichnung: "Frist für Ansprüche nach dem AGG",
    tage: 60,
    grundlage: "§ 15 Abs. 4 AGG",
    gilt_fuer: ["hr", "gleichstellung"],
    nurBeiMerkmal: ["diskriminierung", "belaestigung"],
    erklaerung:
      "Ansprüche nach § 15 AGG müssen innerhalb von zwei Monaten schriftlich geltend gemacht werden. Die Frist läuft unabhängig davon, ob intern noch beraten wird — deshalb gehört der Hinweis früh gegeben.",
  },
};

/**
 * Die Fristen, die für eine Rolle gelten. Wird ein Fall mitgegeben, bleiben
 * Fristen weg, die zu diesem Fall nicht passen — eine AGG-Frist bei einem
 * Arbeitszeitverstoß wäre nur Rauschen.
 */
export function fristenFuer(rolleId, fall = null) {
  return Object.values(FRISTEN).filter((frist) => {
    if (!frist.gilt_fuer.includes(rolleId)) return false;
    if (!frist.nurBeiMerkmal) return true;
    if (!fall) return true;
    return frist.nurBeiMerkmal.some((merkmal) => fall.merkmale?.includes(merkmal));
  });
}

/** Das Eingangsdatum eines Demo-Falls, gerechnet aus `tageHer`. */
export function eingangsDatum(fall, heute = new Date()) {
  if (typeof fall?.tageHer !== "number") return null;
  const datum = new Date(heute);
  datum.setDate(datum.getDate() - fall.tageHer);
  return datum;
}

/**
 * Wie viele Tage bleiben? Negativ heißt überfällig.
 * `eingegangenAm` und `heute` sind Date-Objekte.
 *
 * Gerechnet wird auf Tagesgrenzen. Ohne das schlägt die Uhrzeit durch, und eine
 * Dreimonatsfrist zeigt „noch 91 Tage" — was jeden misstrauisch macht, der
 * genau hinsieht.
 */
function aufTagesbeginn(datum) {
  const kopie = new Date(datum);
  kopie.setHours(0, 0, 0, 0);
  return kopie;
}

export function verbleibendeTage(frist, eingegangenAm, heute = new Date()) {
  if (!frist || !(eingegangenAm instanceof Date) || Number.isNaN(eingegangenAm.getTime())) {
    return null;
  }
  const ende = aufTagesbeginn(eingegangenAm);
  ende.setDate(ende.getDate() + frist.tage);
  const millisekundenProTag = 24 * 60 * 60 * 1000;
  return Math.round((ende.getTime() - aufTagesbeginn(heute).getTime()) / millisekundenProTag);
}

/** Zustand einer Frist, für Anzeige und Einfärbung. */
export function fristStand(frist, eingegangenAm, heute = new Date()) {
  const tage = verbleibendeTage(frist, eingegangenAm, heute);
  if (tage === null) return { stand: "unbekannt", tage: null, text: "kein Eingangsdatum" };
  if (tage < 0) {
    return { stand: "ueberfaellig", tage, text: `seit ${Math.abs(tage)} Tagen überfällig` };
  }
  if (tage <= 3) return { stand: "knapp", tage, text: tage === 0 ? "heute fällig" : `noch ${tage} Tage` };
  return { stand: "offen", tage, text: `noch ${tage} Tage` };
}
