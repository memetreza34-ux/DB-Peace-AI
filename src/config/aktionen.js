/**
 * Was eine Rolle in ihrem Postfach tun kann.
 *
 * Bewusst nah an dem, was die Rolle im Betrieb wirklich anbietet: Die JAV
 * begleitet zum Gespräch, die AFK löst im Alltag, HR und Compliance bearbeiten
 * formal. Umgekehrt bekommen die Vertrauensleute absichtlich keine Aktionen —
 * wer nur reden will, soll keinen Vorgang auslösen.
 *
 * Wichtig bei der JAV: Sie kann gegenüber dem Arbeitgeber nichts selbst
 * durchsetzen. Was sie erreichen will, beantragt sie beim Betriebsrat
 * (§ 70 Abs. 1 Nr. 1 BetrVG). Ohne diesen Weg sähe die App so aus, als hätte
 * die JAV Rechte, die sie nicht hat — das fällt jedem JAV-Mitglied sofort auf.
 *
 * Jede Aktion schreibt einen Vermerk in den Verlauf, den beide Seiten sehen.
 * Versendet wird nichts; die Vorschau sagt das an jeder Stelle dazu.
 */

export const AKTIONEN = {
  sprechstunde: {
    id: "sprechstunde",
    label: "Sprechstunde anbieten",
    beschreibung: "Termin in der nächsten JAV-Sprechstunde vorschlagen.",
    vermerk: "Sprechstunde angeboten. Die meldende Person kann den Termin annehmen oder ablehnen.",
  },
  begleitung: {
    id: "begleitung",
    label: "Begleitung anbieten",
    beschreibung:
      "Anbieten, zum Gespräch mit Ausbildung oder Führungskraft mitzukommen. Niemand muss allein hingehen.",
    vermerk: "Begleitung zum Gespräch angeboten.",
  },
  br_einbringen: {
    id: "br_einbringen",
    label: "Beim Betriebsrat einbringen",
    beschreibung:
      "Die JAV kann Maßnahmen nicht selbst gegenüber dem Arbeitgeber durchsetzen — sie beantragt sie beim Betriebsrat. Das ist kein Umweg, sondern der vorgesehene Weg.",
    vermerk:
      "Zur Beratung beim Betriebsrat eingebracht. Die JAV bleibt beteiligt und begleitet weiter.",
    grundlage: "§ 70 Abs. 1 Nr. 1 BetrVG",
    brauchtZustimmung: true,
  },
  vier_augen: {
    id: "vier_augen",
    label: "Vier-Augen-Gespräch vorschlagen",
    beschreibung: "Ein ruhiges Gespräch abseits der Werkstatt vorschlagen.",
    vermerk: "Vier-Augen-Gespräch vorgeschlagen.",
  },
  ausbildungsplan: {
    id: "ausbildungsplan",
    label: "Bezug zum Ausbildungsplan prüfen",
    beschreibung:
      "Festhalten, welche Ausbildungsinhalte betroffen sind — etwa wenn jemand von Aufgaben ferngehalten wird, die zur Ausbildung gehören.",
    vermerk: "Bezug zum Ausbildungsplan vermerkt: betroffene Inhalte werden geprüft.",
  },
  eingang_bestaetigen: {
    id: "eingang_bestaetigen",
    label: "Eingang bestätigen",
    beschreibung: "Der meldenden Person bestätigen, dass die Meldung angekommen ist.",
    vermerk: "Eingang der Meldung bestätigt.",
    startetFrist: "rueckmeldung",
  },
  massnahme: {
    id: "massnahme",
    label: "Maßnahme vermerken",
    beschreibung: "Festhalten, was veranlasst wurde — nachvollziehbar für beide Seiten.",
    vermerk: "Maßnahme vermerkt und dokumentiert.",
  },
  anonyme_rueckfrage: {
    id: "anonyme_rueckfrage",
    label: "Anonyme Rückfrage stellen",
    beschreibung:
      "Nachfragen, ohne dass die meldende Person ihre Identität preisgeben muss — der einzige Weg, bei dem das geht.",
    vermerk: "Anonyme Rückfrage gestellt. Die Antwort bleibt anonym.",
  },
};

/** Welche Aktionen hat welche Rolle? Rollen ohne Eintrag behalten das Grundpostfach. */
export const ROLLEN_AKTIONEN = {
  jav: ["sprechstunde", "begleitung", "br_einbringen"],
  afk: ["vier_augen", "ausbildungsplan"],
  hr: ["eingang_bestaetigen", "massnahme"],
  compliance: ["eingang_bestaetigen", "anonyme_rueckfrage"],
};

/** Die Aktionen einer Rolle, als vollständige Objekte. */
export function aktionenFuer(rolleId) {
  return (ROLLEN_AKTIONEN[rolleId] ?? []).map((id) => AKTIONEN[id]).filter(Boolean);
}
