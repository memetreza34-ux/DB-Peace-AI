/**
 * Zentrale Anlaufstellen für DB Peace AI.
 *
 * Grundregel: Was hier steht, wird Betroffenen in einer Belastungssituation als
 * Hilfe angeboten. Deshalb steht an jedem Eintrag, woher er stammt und wann er
 * zuletzt geprüft wurde. Nichts wird geschätzt oder aus dem Zusammenhang
 * abgeleitet — was nicht belegt ist, gehört unter OFFEN_FUER_PILOT.
 *
 * Vor einem Pilotbetrieb: alle Einträge erneut prüfen (siehe docs/Pilot-Checkliste.md).
 */

/** Datum der letzten Quellenprüfung — bei jeder Aktualisierung mitziehen. */
export const GEPRUEFT_AM = "2026-08-12";

/**
 * Öffentlich belegte Meldewege der Deutschen Bahn.
 * Quelle: deutschebahn.com → Konzern → Compliance → „Hinweise geben"
 * https://www.deutschebahn.com/de/konzern/konzernprofil/compliance/hinweise_geben-6878688
 */
export const DB_MELDEWEGE = [
  {
    id: "bkms",
    name: "Hinweisgebersystem der DB (BKMS)",
    beschreibung:
      "Das offizielle Meldesystem des DB-Konzerns. Anonyme Nutzung möglich, in zwölf Sprachen verfügbar. Du kannst darüber auch anonym Rückfragen beantworten.",
    art: "online",
    url: "https://www.bkms-system.net/deutschebahn",
    empfohlenBei: ["mobbing", "diskriminierung", "belästigung", "fehlverhalten"],
    quelle: "deutschebahn.com/compliance/hinweise_geben"
  },
  {
    id: "meldestelle-beschaeftigung",
    name: "Meldestelle Beschäftigungsbedingungen",
    beschreibung:
      "Der thematisch passende Kanal für Missstände rund um Arbeits- und Beschäftigungsbedingungen — dazu zählen Mobbing, Diskriminierung und Belästigung am Arbeitsplatz.",
    art: "email",
    email: "Meldestelle-Beschaeftigung@deutschebahn.com",
    empfohlenBei: ["mobbing", "diskriminierung", "belästigung"],
    quelle: "deutschebahn.com/compliance/hinweise_geben"
  },
  {
    id: "compliance-telefon",
    name: "Compliance Hinweismanagement (Telefon)",
    beschreibung: "Persönliche Ansprache beim Hinweismanagement der DB.",
    art: "telefon",
    telefon: "+49 30 297 62710",
    erreichbarkeit: "Montag bis Freitag, 10:00–15:00 Uhr",
    empfohlenBei: ["fehlverhalten", "unsicher"],
    quelle: "deutschebahn.com/compliance/hinweise_geben"
  },
  {
    id: "konzernsicherheit",
    name: "Meldestelle Konzernsicherheit",
    beschreibung: "Für sicherheitsrelevante Vorfälle und Bedrohungslagen im Konzern.",
    art: "email",
    email: "Meldestelle-Konzernsicherheit@deutschebahn.com",
    empfohlenBei: ["bedrohung", "gewalt"],
    quelle: "deutschebahn.com/compliance/hinweise_geben"
  },
  {
    id: "compliance-post",
    name: "Compliance Hinweismanagement (Post)",
    beschreibung: "Schriftlich, wenn dir das lieber ist als digital.",
    art: "post",
    adresse: "Deutsche Bahn AG – Compliance Hinweismanagement, Potsdamer Platz 2, 10785 Berlin",
    empfohlenBei: ["fehlverhalten"],
    quelle: "deutschebahn.com/compliance/hinweise_geben"
  }
];

/**
 * Beratung innerhalb der DB, die keine Meldung ist — zum Reden und Sortieren.
 * Quelle: railbow.deutschebahn.com/railbow/anlaufstellen
 *
 * Hinweis zur Rufnummer: Für die MUT-Hotline kursiert die Nummer 0800 100 99 66
 * in Drittquellen. Auf den DB-eigenen Seiten ist sie nicht hinterlegt, dort wird
 * auf das Intranet (db.de/mut-hotline) und lyra-mut.de verwiesen. Sie wird hier
 * deshalb bewusst NICHT als wählbare Nummer angeboten — eine veraltete Nummer in
 * einer Notfallsituation wäre schlimmer als ein Klick mehr.
 */
export const DB_BERATUNG = [
  {
    id: "mut",
    name: "MUT – Mitarbeitendenunterstützung",
    beschreibung:
      "Anonyme Beratung für alle Beschäftigten des DB-Konzerns bei persönlichen, familiären, gesundheitlichen, sozialen und beruflichen Fragen. Auch für Auszubildende.",
    art: "intern",
    url: "https://www.lyra-mut.de",
    intranet: "db.de/mut-hotline",
    quelle: "railbow.deutschebahn.com/railbow/anlaufstellen"
  },
  {
    id: "bedrohungsmanagement",
    name: "Bedrohungsmanagement der DB",
    beschreibung: "Meldung bedrohlicher Situationen, rund um die Uhr erreichbar.",
    art: "intern",
    intranet: "db-planet.deutschebahn.com → Bedrohungsmanagement",
    quelle: "railbow.deutschebahn.com/railbow/anlaufstellen"
  }
];

/**
 * Öffentliche Notrufe und externe Hilfe. Bundesweit gültig und allgemein bekannt.
 * Diese Nummern sind bewusst direkt wählbar hinterlegt.
 */
export const EXTERNE_HILFE = [
  {
    id: "polizei",
    name: "Polizei",
    telefon: "110",
    beschreibung: "Bei akuter Bedrohung, Gewalt oder Gefahr im Verzug.",
    dringend: true
  },
  {
    id: "rettung",
    name: "Rettungsdienst / Notruf",
    telefon: "112",
    beschreibung:
      "Bei Verletzungen, medizinischen Notfällen oder wenn du dir selbst etwas antun möchtest.",
    dringend: true
  },
  {
    id: "telefonseelsorge",
    name: "Telefonseelsorge",
    telefon: "0800 111 0 111",
    telefonAlternativ: "0800 111 0 222",
    beschreibung: "Rund um die Uhr, kostenfrei und anonym — auch einfach nur zum Reden.",
    dringend: true
  },
  {
    id: "nummer-gegen-kummer",
    name: "Nummer gegen Kummer",
    telefon: "116 111",
    beschreibung: "Beratung für junge Menschen bis 25 Jahre, kostenfrei und anonym.",
    dringend: true
  },
  {
    id: "antidiskriminierungsstelle",
    name: "Antidiskriminierungsstelle des Bundes",
    telefon: "0800 546 546 5",
    url: "https://www.antidiskriminierungsstelle.de",
    beschreibung: "Kostenfreie Erstberatung zu deinen Rechten nach dem AGG."
  },
  {
    id: "hilfetelefon-gewalt",
    name: "Hilfetelefon Gewalt gegen Frauen",
    telefon: "116 016",
    beschreibung: "Beratung für Frauen, die Gewalt erlebt haben."
  },
  {
    id: "weisser-ring",
    name: "WEISSER RING",
    telefon: "116 006",
    url: "https://weisser-ring.de",
    beschreibung: "Bundesweite Opferhilfe bei Gewalt und Straftaten."
  }
];

/**
 * Hinweise für Auszubildende unter 18.
 *
 * Ein großer Teil der Azubis im ersten Lehrjahr ist minderjährig. Für sie gelten
 * zusätzliche Schutzrechte, und sie dürfen Erwachsene ihres Vertrauens einbeziehen
 * — das ist kein Zeichen von Schwäche, sondern ihr gutes Recht.
 */
export const UNTER_18 = [
  {
    id: "jarbschg",
    titel: "Du bist zusätzlich geschützt",
    text: "Das Jugendarbeitsschutzgesetz gilt nur für dich: bei Arbeitszeit, Pausen, Nachtruhe und beim Schutz vor sexueller Belästigung (§ 22 JArbSchG)."
  },
  {
    id: "eltern",
    titel: "Deine Eltern dürfen mitkommen",
    text: "Zu einem Gespräch mit Ausbildungsleitung, JAV oder Betriebsrat darfst du eine erwachsene Vertrauensperson mitnehmen — auch deine Eltern oder Erziehungsberechtigten."
  },
  {
    id: "kummer",
    titel: "Beratung speziell für junge Menschen",
    text: "Die Nummer gegen Kummer (116 111) berät kostenfrei und anonym bis 25 Jahre — auch, wenn es um Ausbildung und Arbeit geht."
  }
];

/**
 * Was ein Pilotbetrieb ergänzen muss. Diese Stellen sind standort- oder
 * bereichsabhängig und lassen sich nicht zentral recherchieren.
 *
 * Solange `wert` leer ist, zeigt die App den Eintrag als „noch nicht hinterlegt"
 * an, statt eine Nummer zu erfinden.
 */
export const OFFEN_FUER_PILOT = [
  {
    id: "jav",
    name: "Jugend- und Auszubildendenvertretung (JAV)",
    beschreibung: "Deine gewählte Interessenvertretung als Azubi — standortabhängig.",
    wert: "",
    hinweis: "Aushang am Standort, Ausbildungsleitung oder DB-Intranet."
  },
  {
    id: "betriebsrat",
    name: "Betriebsrat",
    beschreibung: "Vertretung der Beschäftigten im Betrieb — standortabhängig.",
    wert: "",
    hinweis: "Aushang am Standort oder DB-Intranet."
  },
  {
    id: "ausbildungsleitung",
    name: "Ausbildungsleitung",
    beschreibung: "Erste Ansprechperson in der Ausbildung.",
    wert: "",
    hinweis: "Wird je Ausbildungsstandort hinterlegt."
  },
  {
    id: "db-sicherheit",
    name: "DB Sicherheit (Standort)",
    beschreibung: "Für Sicherheitsvorfälle an Bahnhöfen und in Zügen.",
    wert: "",
    hinweis: "Interne Rufnummer im Pilotbetrieb hinterlegen. Bis dahin bei akuter Gefahr 110."
  }
];

/** Liefert die Meldewege, die zu einer Situation passen. */
export function meldewegeFuer(situation) {
  if (!situation) return DB_MELDEWEGE;
  const treffer = DB_MELDEWEGE.filter((w) => w.empfohlenBei?.includes(situation));
  return treffer.length ? treffer : DB_MELDEWEGE;
}

/** Wandelt eine Rufnummer in ein wählbares tel:-Ziel. */
export function telLink(nummer) {
  return `tel:${String(nummer).replace(/[\s/-]/g, "")}`;
}
