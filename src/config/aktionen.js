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
  beschwerde_aufnehmen: {
    id: "beschwerde_aufnehmen",
    label: "Beschwerde formal aufnehmen",
    beschreibung:
      "Hält der Betriebsrat die Beschwerde für berechtigt, wirkt er beim Arbeitgeber auf Abhilfe hin. Das ist der Weg, den sonst niemand hat.",
    vermerk: "Beschwerde formal aufgenommen. Der Betriebsrat prüft, ob er sie für berechtigt hält.",
    grundlage: "§ 85 BetrVG",
  },
  monatsgespraech: {
    id: "monatsgespraech",
    label: "Für das Monatsgespräch vormerken",
    beschreibung:
      "Das Thema im regelmäßigen Gespräch mit dem Arbeitgeber ansprechen — ohne den Einzelfall preiszugeben.",
    vermerk: "Für das Monatsgespräch vorgemerkt, ohne Angaben zur meldenden Person.",
    grundlage: "§ 74 BetrVG",
  },
  nachteilsausgleich: {
    id: "nachteilsausgleich",
    label: "Nachteilsausgleich prüfen",
    beschreibung:
      "Prüfen, ob ein Nachteilsausgleich in Frage kommt — bei Prüfungen, Arbeitszeit oder Ausstattung.",
    vermerk: "Nachteilsausgleich wird geprüft.",
  },
  beteiligung_einfordern: {
    id: "beteiligung_einfordern",
    label: "Beteiligung einfordern",
    beschreibung:
      "Die Schwerbehindertenvertretung ist rechtzeitig zu beteiligen. Wurde sie übergangen, ist die Durchführung auszusetzen.",
    vermerk: "Beteiligung der Schwerbehindertenvertretung eingefordert.",
    grundlage: "§ 178 SGB IX",
  },
  weg_waehlen: {
    id: "weg_waehlen",
    label: "Weg gemeinsam wählen",
    beschreibung:
      "Vertrauliches Gespräch oder formale Beschwerde — die betroffene Person entscheidet, und zwar bevor Fristen ablaufen.",
    vermerk:
      "Vorgehen gemeinsam besprochen: vertrauliches Gespräch oder formale Beschwerde. Die Entscheidung liegt bei der betroffenen Person.",
  },
  frist_erklaeren: {
    id: "frist_erklaeren",
    label: "Über die Frist informieren",
    beschreibung:
      "Die betroffene Person soll früh wissen, dass für Ansprüche nach dem AGG eine Frist von zwei Monaten läuft — auch während intern noch beraten wird.",
    vermerk: "Über die laufende Frist nach dem AGG informiert.",
    grundlage: "§ 15 Abs. 4 AGG",
  },
  beratung_vermitteln: {
    id: "beratung_vermitteln",
    label: "Beratung vermitteln",
    beschreibung:
      "Den Kontakt zur Mitarbeitendenunterstützung herstellen — anonym und außerhalb des Betriebs.",
    vermerk: "Kontakt zur Beratung vermittelt. Die Nutzung bleibt freiwillig und anonym.",
  },
  wiedervorlage: {
    id: "wiedervorlage",
    label: "In zwei Wochen nachfragen",
    beschreibung:
      "Dranbleiben statt abhaken. Persönliche Anliegen brauchen keinen Vorgang, aber jemanden, der sich wieder meldet.",
    vermerk: "Wiedervorlage in zwei Wochen notiert.",
  },
  standortgespraech: {
    id: "standortgespraech",
    label: "Gespräch am Standort ansetzen",
    beschreibung: "Beide Seiten getrennt vorbereiten, bevor sie zusammen an einen Tisch gehen.",
    vermerk: "Gespräch am Standort angesetzt, mit getrennten Vorgesprächen.",
  },
  massnahme_standort: {
    id: "massnahme_standort",
    label: "Maßnahme für den Standort veranlassen",
    beschreibung:
      "Wenn mehrere ähnliche Fälle auftreten, hilft keine Einzelfallklärung — dann muss sich etwas am Standort ändern.",
    vermerk: "Maßnahme für den Standort veranlasst.",
  },
  oertliche_jav_einbeziehen: {
    id: "oertliche_jav_einbeziehen",
    label: "Örtliche JAV einbeziehen",
    beschreibung:
      "Achtung: Wer sich hierher gewendet hat, wollte die Leute vor Ort meist bewusst heraushalten. Ohne ausdrückliche Zustimmung ist das ein Vertrauensbruch.",
    vermerk: "Örtliche JAV mit Zustimmung der meldenden Person einbezogen.",
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
  gjav: ["sprechstunde", "oertliche_jav_einbeziehen"],
  kjav: ["sprechstunde", "oertliche_jav_einbeziehen"],
  betriebsrat: ["beschwerde_aufnehmen", "monatsgespraech"],
  sbv: ["nachteilsausgleich", "beteiligung_einfordern"],
  gleichstellung: ["weg_waehlen", "frist_erklaeren"],
  afk: ["vier_augen", "ausbildungsplan"],
  ngk: ["beratung_vermitteln", "wiedervorlage"],
  ausbildungsleitung: ["standortgespraech", "massnahme_standort"],
  hr: ["eingang_bestaetigen", "massnahme"],
  compliance: ["eingang_bestaetigen", "anonyme_rueckfrage"],
  // vertrauensleute: bewusst leer — wer nur reden will, löst keinen Vorgang aus.
};

/** Die Aktionen einer Rolle, als vollständige Objekte. */
export function aktionenFuer(rolleId) {
  return (ROLLEN_AKTIONEN[rolleId] ?? []).map((id) => AKTIONEN[id]).filter(Boolean);
}
