/**
 * Wer in dieser App eine eigene Sicht hat — und was diese Sicht darf.
 *
 * Der wichtigste Satz zuerst: Vertrauensrollen und formale Stellen sehen
 * einander nicht. Wer sich an die JAV wendet, taucht in keiner HR-Ansicht auf,
 * auch nicht als Zahl. Ohne diese Trennung ist die App wertlos, weil genau das
 * die Angst ist, die Azubis vom Melden abhält.
 *
 * Zu den Rechtsgrundlagen: Sie sind hier als Orientierung angegeben, damit in
 * der App nachvollziehbar ist, warum eine Rolle existiert. Vor einem Pilot
 * gehören sie juristisch gegengelesen — siehe docs/Pilot-Checkliste.md.
 */

/** Die fünf Gruppen. Die Rechte hängen an der Gruppe, nicht an der Einzelrolle. */
export const GRUPPEN = {
  betroffene: {
    id: "betroffene",
    name: "Betroffene",
    zweck: "erleben, festhalten, sich wenden an",
  },
  vertrauen: {
    id: "vertrauen",
    name: "Vertrauensrollen",
    zweck: "zuhören, beraten, begleiten",
  },
  ausbildung: {
    id: "ausbildung",
    name: "Ausbildung",
    zweck: "im Alltag lösen",
  },
  formal: {
    id: "formal",
    name: "Formale Stellen",
    zweck: "formal bearbeiten, Fristen einhalten",
  },
  pflege: {
    id: "pflege",
    name: "Pflege",
    zweck: "Kontaktdaten aktuell halten",
  },
};

/**
 * Was eine Gruppe darf. Bewusst als Daten und nicht als if-Ketten in den
 * Komponenten — sonst verteilt sich die Trennungsregel über die halbe App und
 * niemand kann sie mehr nachlesen.
 */
export const RECHTE = {
  betroffene: {
    eigenesProtokoll: true,
    meldungVerfassen: true,
    postfach: false,
    fremdeFaelleSehen: false,
    weiterleiten: false,
    fristenSetzen: false,
    statistik: false,
    kontaktePflegen: false,
  },
  vertrauen: {
    eigenesProtokoll: false,
    meldungVerfassen: false,
    postfach: true,
    fremdeFaelleSehen: false,
    weiterleiten: "nur-mit-zustimmung",
    fristenSetzen: false,
    statistik: true,
    kontaktePflegen: false,
  },
  ausbildung: {
    eigenesProtokoll: false,
    meldungVerfassen: false,
    postfach: true,
    fremdeFaelleSehen: false,
    weiterleiten: "nur-mit-zustimmung",
    fristenSetzen: false,
    statistik: true,
    kontaktePflegen: false,
  },
  formal: {
    eigenesProtokoll: false,
    meldungVerfassen: false,
    postfach: true,
    fremdeFaelleSehen: false,
    weiterleiten: "nur-mit-zustimmung",
    fristenSetzen: true,
    statistik: true,
    kontaktePflegen: false,
  },
  pflege: {
    eigenesProtokoll: false,
    meldungVerfassen: false,
    postfach: false,
    fremdeFaelleSehen: false,
    weiterleiten: false,
    fristenSetzen: false,
    statistik: false,
    kontaktePflegen: true,
  },
};

/**
 * Die Rollen selbst.
 *
 * `themen` sagt, was in diesem Postfach üblicherweise landet — es steuert keine
 * Zuteilung, sondern erklärt der Rolle ihren eigenen Zuständigkeitsbereich.
 */
export const ROLLEN = [
  {
    id: "azubi",
    name: "Azubi / Nachwuchskraft",
    kurz: "Azubi",
    gruppe: "betroffene",
    beschreibung:
      "Die Standardansicht der App. Festhalten, sortieren, eine Meldung vorbereiten — anonym und ohne Konto.",
    grundlage: "",
    themen: [],
  },
  {
    id: "jav",
    name: "Jugend- und Auszubildendenvertretung",
    kurz: "JAV",
    gruppe: "vertrauen",
    beschreibung:
      "Die gewählte Interessenvertretung der Auszubildenden und jungen Beschäftigten. Erste Adresse bei Ärger in der Ausbildung.",
    grundlage: "§§ 60–73 BetrVG",
    themen: ["Ausbildungsqualität", "Arbeitszeit", "Übernahme", "Umgangston"],
  },
  {
    id: "gjav",
    name: "Gesamt-Jugend- und Auszubildendenvertretung",
    kurz: "Gesamt-JAV",
    gruppe: "vertrauen",
    beschreibung:
      "Die JAV-Ebene über dem einzelnen Standort. Für alle, die die Leute vor Ort nicht einbeziehen wollen — an kleinen Standorten oft der Unterschied zwischen melden und schweigen.",
    grundlage: "§ 72 BetrVG",
    themen: ["standortübergreifend", "Konflikt mit der örtlichen JAV"],
    ueberoertlich: true,
  },
  {
    id: "kjav",
    name: "Konzern-Jugend- und Auszubildendenvertretung",
    kurz: "Konzern-JAV",
    gruppe: "vertrauen",
    beschreibung:
      "Die oberste JAV-Ebene im Konzern. Zuständig, wenn ein Thema mehrere Unternehmen betrifft oder auf keiner Ebene darunter gelöst wird.",
    grundlage: "§ 73a BetrVG",
    themen: ["konzernweit", "grundsätzliche Fragen"],
    ueberoertlich: true,
  },
  {
    id: "betriebsrat",
    name: "Betriebsrat",
    kurz: "Betriebsrat",
    gruppe: "vertrauen",
    beschreibung:
      "Vertretung aller Beschäftigten im Betrieb. Nimmt Beschwerden entgegen und kann sie gegenüber dem Arbeitgeber vertreten.",
    grundlage: "§ 80 und § 85 BetrVG",
    themen: ["Arbeitsbedingungen", "Konflikt mit Führungskraft", "Mitbestimmung"],
  },
  {
    id: "sbv",
    name: "Schwerbehindertenvertretung",
    kurz: "SBV",
    gruppe: "vertrauen",
    beschreibung:
      "Vertritt die Interessen schwerbehinderter und gleichgestellter Beschäftigter und wird bei sie betreffenden Entscheidungen beteiligt.",
    grundlage: "§ 177 SGB IX",
    themen: ["Nachteilsausgleich", "Barrierefreiheit", "Benachteiligung wegen Behinderung"],
  },
  {
    id: "gleichstellung",
    name: "Gleichstellungsbeauftragte",
    kurz: "Gleichstellung",
    gruppe: "vertrauen",
    beschreibung:
      "Ansprechstelle bei Benachteiligung und Belästigung. Wie die Rolle im Bereich genau zugeschnitten ist, unterscheidet sich — das gehört vor einem Pilot geklärt.",
    grundlage: "",
    grundlageOffen: "Beschwerderecht Beschäftigter: § 13 AGG. Zuschnitt der Rolle je Bereich zu klären.",
    themen: ["Diskriminierung", "sexuelle Belästigung", "Benachteiligung"],
  },
  {
    id: "vertrauensleute",
    name: "Vertrauensleute",
    kurz: "Vertrauensleute",
    gruppe: "vertrauen",
    beschreibung:
      "Gewerkschaftliche Ansprechpersonen im Betrieb. Niedrigschwelliges Gespräch, kein Fallmanagement — sie hören zu und verweisen weiter.",
    grundlage: "",
    grundlageOffen: "Gewerkschaftliche Struktur, keine Aufgabe nach BetrVG.",
    themen: ["erstes Gespräch", "Weiterverweis"],
  },
  {
    id: "afk",
    name: "Ausbildungsfachkraft (AFK)",
    kurz: "AFK",
    gruppe: "ausbildung",
    beschreibung:
      "Begleitet die Ausbildung fachlich und ist im Alltag am nächsten dran.",
    grundlage: "§ 14 und § 28 BBiG",
    themen: ["Ausbildungsinhalte", "Konflikt im Team", "Berichtsheft"],
  },
  {
    id: "ngk",
    name: "Nachwuchskräfte-Betreuung (NGK)",
    kurz: "NGK",
    gruppe: "ausbildung",
    beschreibung: "Betreut Nachwuchskräfte über die fachliche Ausbildung hinaus.",
    grundlage: "§ 14 BBiG",
    themen: ["Betreuung", "persönliche Anliegen", "Einsatzplanung"],
  },
  {
    id: "ausbildungsleitung",
    name: "Ausbildungsleitung",
    kurz: "Ausbildungsleitung",
    gruppe: "ausbildung",
    beschreibung:
      "Verantwortet die Ausbildung am Standort. Zuständig, wenn ein Fall im Team nicht gelöst wird.",
    grundlage: "§ 14 BBiG",
    themen: ["eskalierter Ausbildungsfall", "Standortübersicht"],
  },
  {
    id: "hr",
    name: "HR-Partner",
    kurz: "HR",
    gruppe: "formal",
    beschreibung:
      "Bearbeitet personalrelevante Vorgänge formal, mit Status und Frist.",
    grundlage: "",
    grundlageOffen: "Beschwerdestelle nach § 13 AGG, Zuständigkeit je Bereich zu klären.",
    themen: ["formale Beschwerde", "arbeitsrechtliche Folgen"],
  },
  {
    id: "compliance",
    name: "Compliance / Meldestelle",
    kurz: "Compliance",
    gruppe: "formal",
    beschreibung:
      "Nimmt Hinweise auf Regelverstöße entgegen. Arbeitet mit festen Fristen und ist von der Beratung strikt getrennt.",
    grundlage: "HinSchG (interne Meldestelle)",
    themen: ["Regelverstoß", "Hinweis nach HinSchG"],
  },
  {
    id: "standortpflege",
    name: "Standort-Betreuung",
    kurz: "Pflege",
    gruppe: "pflege",
    beschreibung:
      "Hält die Kontaktdaten am Standort aktuell. Sieht ausdrücklich keine Fälle — diese Rolle braucht sie nicht.",
    grundlage: "",
    themen: [],
  },
];

/**
 * Die Rollen der Person, die die App gerade nutzt.
 *
 * Der Fall, der dieses Modell nötig macht: JAV-Mitglieder sind selbst
 * Auszubildende. Dieselbe Person führt morgens ihr eigenes Protokoll und
 * bearbeitet nachmittags Fälle — das sind zwei Hüte, keine zwei Menschen.
 *
 * Im Prototyp fest hinterlegt, weil es keine Anmeldung gibt. Ein Pilotbetrieb
 * müsste das aus der tatsächlichen Gremienzugehörigkeit ableiten.
 */
export const MEINE_ROLLEN = ["azubi", "jav"];

/** Alle Rollen mit eigenem Postfach, in der Reihenfolge der Rollenauswahl. */
export const POSTFACH_ROLLEN = ROLLEN.filter((rolle) => RECHTE[rolle.gruppe].postfach);
