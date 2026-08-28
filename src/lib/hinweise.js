/**
 * Rechtliche Hinweise, die im passenden Fall von selbst auftauchen.
 *
 * Der Zweck: Wer eine Meldung bearbeitet, soll nicht erst nachschlagen müssen,
 * dass bei Minderjährigen andere Regeln gelten oder dass für Ansprüche nach dem
 * AGG eine Frist läuft. Die Hinweise ersetzen keine Rechtsberatung und sagen
 * das auch — sie zeigen, wo nachzusehen ist.
 *
 * Jeder Hinweis nennt seine Grundlage. Vor einem Pilotbetrieb gehören sie
 * juristisch gegengelesen, siehe docs/Pilot-Checkliste.md.
 */

import { FRISTEN } from "./fristen.js";

function hat(fall, merkmal) {
  return Array.isArray(fall?.merkmale) && fall.merkmale.includes(merkmal);
}

export function hinweiseFuer(rolleId, fall) {
  const hinweise = [];

  if (hat(fall, "minderjaehrig")) {
    hinweise.push({
      id: "jarbschg",
      titel: "Minderjährige Person betroffen",
      text:
        "Für Jugendliche unter 18 gelten eigene Regeln zu Arbeitszeit, Pausen und Nachtruhe. " +
        "Eine erwachsene Vertrauensperson darf zu jedem Gespräch mitkommen — auch die Eltern.",
      grundlage: "JArbSchG",
    });
  }

  if (rolleId === "betriebsrat") {
    hinweise.push({
      id: "br-beschwerde",
      titel: "Formale Beschwerde möglich",
      text:
        "Beschäftigte können sich beim Betriebsrat beschweren. Hält er die Beschwerde für " +
        "berechtigt, wirkt er beim Arbeitgeber auf Abhilfe hin.",
      grundlage: "§ 85 BetrVG",
    });
  }

  if (rolleId === "sbv") {
    hinweise.push({
      id: "sbv-beteiligung",
      titel: "Beteiligungsrecht beachten",
      text:
        "Die Schwerbehindertenvertretung ist in Angelegenheiten, die schwerbehinderte Menschen " +
        "betreffen, rechtzeitig zu beteiligen — nicht erst, wenn entschieden ist.",
      grundlage: "§ 178 SGB IX",
    });
  }

  if (hat(fall, "diskriminierung") || hat(fall, "belaestigung")) {
    const frist = FRISTEN.agg_geltendmachung;
    hinweise.push({
      id: "agg-frist",
      titel: "Es läuft eine Frist",
      text:
        `${frist.erklaerung} Diese Frist läuft auch dann, wenn intern noch beraten wird. ` +
        "Die betroffene Person sollte das früh erfahren.",
      grundlage: frist.grundlage,
    });
  }

  if (rolleId === "compliance") {
    hinweise.push({
      id: "hinschg",
      titel: "Fristen nach dem Hinweisgeberschutzgesetz",
      text:
        `${FRISTEN.eingangsbestaetigung.erklaerung} ${FRISTEN.rueckmeldung.erklaerung}`,
      grundlage: `${FRISTEN.eingangsbestaetigung.grundlage} und ${FRISTEN.rueckmeldung.grundlage}`,
    });
  }

  return hinweise;
}
