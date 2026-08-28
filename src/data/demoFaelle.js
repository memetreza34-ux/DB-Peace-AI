/**
 * Erfundene Beispielfälle für die Rollen-Postfächer.
 *
 * Alle Fälle, Personen und Standorte sind ausgedacht. Sie sind angelehnt an
 * typische Situationen in einer gewerblich-technischen Ausbildung, damit die
 * Ansicht nicht wie eine leere Hülle wirkt — aber sie sind ausdrücklich keine
 * echten Meldungen. Jede Ansicht, die sie zeigt, sagt das auch dazu.
 *
 * `empfaenger` ist die Rollen-Id aus src/config/rollen.js. Nur die
 * Empfängerrolle sieht den Fall; siehe src/lib/rolle.js.
 *
 * `tageHer` sagt, wie viele Tage der Fall zurückliegt. Daraus rechnet die App
 * den Fristenlauf, damit die Vorführung nicht mit festen Daten veraltet.
 *
 * `vonMir` markiert die Fälle, die der Demo-Azubi selbst eingereicht hat. Sie
 * erscheinen in seiner Sammlung — und im Postfach genau der Stelle, an die er
 * sie geschickt hat. In keinem anderen.
 */

export const DEMO_FAELLE = [
  // --- JAV ---
  {
    id: "JAV-2431",
    merkmale: ["minderjaehrig"],
    empfaenger: "jav",
    vonMir: true,
    status: "in-bearbeitung",
    eingegangen: "Heute, 07:40",
    kategorie: "Arbeitszeit & Berufsschule",
    anonym: true,
    zusammenfassung:
      "Wird seit drei Wochen für Spätschichten eingeteilt, obwohl am Folgetag Berufsschule ist. Zweimal deshalb im Unterricht eingeschlafen.",
    verlauf: [
      { id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "07:40" },
      {
        id: 2,
        von: "rolle",
        text: "Danke, dass du dich meldest. Die Einteilung vor einem Berufsschultag ist genau unser Thema. Kannst du mir sagen, in welchen Kalenderwochen das war? Namen brauche ich nicht.",
        zeit: "09:15",
      },
      { id: 3, von: "melder", text: "KW 32, 33 und diese Woche.", zeit: "09:52" },
    ],
  },
  {
    id: "JAV-2428",
    empfaenger: "jav",
    status: "offen",
    eingegangen: "Gestern, 16:05",
    kategorie: "Berichtsheft",
    anonym: true,
    zusammenfassung:
      "Das Berichtsheft wird seit zwei Monaten nicht abgezeichnet. Soll es in der Freizeit nachschreiben.",
    verlauf: [{ id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "16:05" }],
  },
  {
    id: "JAV-2419",
    empfaenger: "jav",
    status: "abgeschlossen",
    eingegangen: "vor 2 Wochen",
    kategorie: "Übernahme",
    anonym: false,
    zusammenfassung:
      "Unklare Aussagen zur Übernahme nach der Ausbildung, dadurch starke Verunsicherung im ganzen Lehrjahr.",
    verlauf: [
      { id: 1, von: "system", text: "Eingereicht über DB Peace.", zeit: "10:12" },
      {
        id: 2,
        von: "rolle",
        text: "Wir haben das in der JAV-Sitzung aufgenommen und um eine verbindliche Auskunft gebeten. Ergebnis kommt in die nächste Azubi-Versammlung.",
        zeit: "vor 9 Tagen",
      },
      { id: 3, von: "system", text: "Fall abgeschlossen.", zeit: "vor 3 Tagen" },
    ],
  },

  {
    id: "JAV-2436",
    empfaenger: "jav",
    betrifftMich: true,
    status: "offen",
    eingegangen: "Heute, 06:20",
    kategorie: "Umgang in der Gruppe",
    anonym: true,
    zusammenfassung:
      "Beschwerde über den Umgangston eines JAV-Mitglieds gegenüber jüngeren Auszubildenden.",
    verlauf: [{ id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "06:20" }],
  },

  // --- Gesamt-JAV: die Ausweichstufe, wenn man die Leute vor Ort heraushalten will ---
  {
    id: "GJAV-0148",
    empfaenger: "gjav",
    status: "in-bearbeitung",
    eingegangen: "Gestern, 11:05",
    kategorie: "Konflikt mit der örtlichen JAV",
    anonym: true,
    zusammenfassung:
      "Möchte sich bewusst nicht an die JAV am Standort wenden, weil dort jemand aus dem eigenen Lehrjahr sitzt.",
    verlauf: [
      { id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "11:05" },
      {
        id: 2,
        von: "rolle",
        text: "Das ist völlig in Ordnung und ein guter Grund. Wir bearbeiten das von hier aus, ohne die JAV vor Ort einzubeziehen.",
        zeit: "14:30",
      },
    ],
  },

  // --- Betriebsrat ---
  {
    id: "BR-1187",
    empfaenger: "betriebsrat",
    status: "in-bearbeitung",
    eingegangen: "Heute, 11:20",
    kategorie: "Umgang durch Führungskraft",
    anonym: true,
    zusammenfassung:
      "Abwertende Bemerkungen über Leistung vor versammelter Mannschaft, mehrfach in den letzten Wochen.",
    verlauf: [
      { id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "11:20" },
      {
        id: 2,
        von: "rolle",
        text: "Das nehmen wir ernst. Für ein Gespräch mit der Führungskraft bräuchten wir deine Zustimmung — ohne die gehen wir damit nicht raus.",
        zeit: "13:05",
      },
    ],
  },
  {
    id: "BR-1180",
    empfaenger: "betriebsrat",
    status: "offen",
    eingegangen: "vor 4 Tagen",
    kategorie: "Pausen",
    anonym: true,
    zusammenfassung:
      "Pausen werden regelmäßig unterbrochen oder fallen ganz aus, wenn Personal fehlt.",
    verlauf: [{ id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "08:30" }],
  },

  // --- Schwerbehindertenvertretung ---
  {
    id: "SBV-0342",
    merkmale: ["behinderung"],
    empfaenger: "sbv",
    status: "in-bearbeitung",
    eingegangen: "Gestern, 09:10",
    kategorie: "Nachteilsausgleich",
    anonym: false,
    zusammenfassung:
      "Unterweisungen finden ohne Rücksicht auf eine Hörbeeinträchtigung statt. Für die Zwischenprüfung wurde kein Nachteilsausgleich beantragt.",
    verlauf: [
      { id: 1, von: "system", text: "Eingereicht über DB Peace.", zeit: "09:10" },
      {
        id: 2,
        von: "rolle",
        text: "Den Nachteilsausgleich für die Prüfung können wir noch rechtzeitig auf den Weg bringen. Ich melde mich mit einem Terminvorschlag.",
        zeit: "11:45",
      },
    ],
  },

  // --- Gleichstellungsbeauftragte ---
  {
    id: "GLS-0771",
    merkmale: ["belaestigung"],
    empfaenger: "gleichstellung",
    status: "offen",
    eingegangen: "Heute, 06:55",
    kategorie: "Sexuelle Belästigung",
    anonym: true,
    zusammenfassung:
      "Anzügliche Sprüche in der Werkstatt, mehrfach, auch nach deutlicher Bitte damit aufzuhören.",
    verlauf: [{ id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "06:55" }],
  },
  {
    id: "GLS-0768",
    merkmale: ["diskriminierung"],
    empfaenger: "gleichstellung",
    status: "in-bearbeitung",
    eingegangen: "vor 5 Tagen",
    kategorie: "Diskriminierung",
    anonym: true,
    zusammenfassung:
      "Wird wegen der Herkunft mit einem Spitznamen gerufen. Wird als Spaß dargestellt, ist aber täglich.",
    verlauf: [
      { id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "14:22" },
      {
        id: 2,
        von: "rolle",
        text: "Auch wenn es als Spaß gemeint ist, fällt so etwas unter das AGG. Möchtest du erst ein vertrauliches Gespräch, oder sollen wir es formal aufnehmen?",
        zeit: "vor 4 Tagen",
      },
    ],
  },

  // --- Vertrauensleute ---
  {
    id: "VL-0219",
    empfaenger: "vertrauensleute",
    status: "offen",
    eingegangen: "Heute, 12:35",
    kategorie: "Erstes Gespräch",
    anonym: true,
    zusammenfassung:
      "Unsicher, ob sich eine Meldung überhaupt lohnt. Möchte erst mit jemandem reden, ohne dass etwas ins Rollen kommt.",
    verlauf: [
      { id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "12:35" },
      {
        id: 2,
        von: "rolle",
        text: "Reden kostet nichts und verpflichtet zu nichts. Sag einfach Bescheid, wann es dir passt — es passiert nur das, was du willst.",
        zeit: "12:58",
      },
    ],
  },

  // --- Ausbildungsfachkraft ---
  {
    id: "AFK-3390",
    empfaenger: "afk",
    status: "in-bearbeitung",
    eingegangen: "Heute, 08:05",
    kategorie: "Konflikt im Team",
    anonym: false,
    zusammenfassung:
      "Wird bei anspruchsvolleren Aufgaben übergangen und stattdessen zum Aufräumen eingeteilt.",
    verlauf: [
      { id: 1, von: "system", text: "Eingereicht über DB Peace.", zeit: "08:05" },
      {
        id: 2,
        von: "rolle",
        text: "Das sollten wir kurz zu dritt besprechen. Ich schlage Donnerstag nach der Frühschicht vor — du entscheidest, wer dabei ist.",
        zeit: "08:40",
      },
    ],
  },
  {
    id: "AFK-3385",
    empfaenger: "afk",
    status: "offen",
    eingegangen: "Gestern, 15:30",
    kategorie: "Überforderung",
    anonym: true,
    zusammenfassung:
      "Kommt beim neuen Prüfgerät nicht mit und traut sich nicht mehr zu fragen, weil beim letzten Mal genervt reagiert wurde.",
    verlauf: [{ id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "15:30" }],
  },

  // --- Nachwuchskräfte-Betreuung ---
  {
    id: "NGK-1502",
    empfaenger: "ngk",
    vonMir: true,
    status: "in-bearbeitung",
    eingegangen: "Heute, 10:10",
    kategorie: "Persönliche Belastung",
    anonym: false,
    zusammenfassung:
      "Starke Prüfungsangst vor der Zwischenprüfung, schläft schlecht, denkt über Abbruch nach.",
    verlauf: [
      { id: 1, von: "system", text: "Eingereicht über DB Peace.", zeit: "10:10" },
      {
        id: 2,
        von: "rolle",
        text: "Danke, dass du das ansprichst. Ans Abbrechen musst du jetzt nicht denken. Es gibt Prüfungsvorbereitung und auf Wunsch auch eine Beratung außerhalb des Betriebs.",
        zeit: "10:55",
      },
    ],
  },
  {
    id: "NGK-1498",
    empfaenger: "ngk",
    status: "offen",
    eingegangen: "vor 3 Tagen",
    kategorie: "Einsatzort",
    anonym: true,
    zusammenfassung:
      "Neuer Einsatzort ist mit dem ÖPNV kaum zur Frühschicht erreichbar. Kommt regelmäßig zu spät und bekommt dafür Ärger.",
    verlauf: [{ id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "06:20" }],
  },

  // --- Ausbildungsleitung ---
  {
    id: "AL-0904",
    empfaenger: "ausbildungsleitung",
    status: "in-bearbeitung",
    eingegangen: "Gestern, 13:00",
    kategorie: "Eskalierter Ausbildungsfall",
    anonym: false,
    zusammenfassung:
      "Konflikt zwischen Azubi und Ausbilder konnte im Team nicht gelöst werden. Beide Seiten wünschen eine dritte Person.",
    verlauf: [
      { id: 1, von: "system", text: "Weitergegeben mit Zustimmung der betroffenen Person.", zeit: "13:00" },
      {
        id: 2,
        von: "rolle",
        text: "Ich lade beide getrennt zu einem Vorgespräch ein, bevor wir zusammen an einen Tisch gehen.",
        zeit: "16:30",
      },
    ],
  },
  {
    id: "AL-0898",
    empfaenger: "ausbildungsleitung",
    status: "offen",
    eingegangen: "vor 6 Tagen",
    kategorie: "Wiederholtes Muster",
    anonym: true,
    zusammenfassung:
      "Mehrere Auszubildende beschreiben unabhängig voneinander denselben rauen Umgangston in einer Werkstatt.",
    verlauf: [{ id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "09:45" }],
  },

  // --- HR ---
  {
    id: "HR-5521",
    tageHer: 0,
    merkmale: ["diskriminierung"],
    empfaenger: "hr",
    status: "in-bearbeitung",
    eingegangen: "Heute, 08:50",
    kategorie: "Formale Beschwerde (AGG)",
    anonym: false,
    frist: "Rückmeldung offen",
    zusammenfassung:
      "Formale Beschwerde wegen wiederholter Benachteiligung bei der Aufgabenverteilung.",
    verlauf: [
      { id: 1, von: "system", text: "Eingereicht über DB Peace.", zeit: "08:50" },
      {
        id: 2,
        von: "rolle",
        text: "Ihre Beschwerde ist eingegangen und wird geprüft. Sie erhalten eine Rückmeldung; bis dahin behandeln wir den Vorgang vertraulich.",
        zeit: "09:30",
      },
    ],
  },
  {
    id: "HR-5514",
    tageHer: 1,
    merkmale: ["minderjaehrig"],
    empfaenger: "hr",
    status: "offen",
    eingegangen: "Gestern, 17:45",
    kategorie: "Arbeitszeit bei Minderjährigen",
    anonym: true,
    frist: "Rückmeldung offen",
    zusammenfassung:
      "Hinweis auf mehrere Zehn-Stunden-Schichten in Folge bei einer minderjährigen Auszubildenden.",
    verlauf: [{ id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "17:45" }],
  },

  // --- Compliance ---
  {
    id: "COM-0663",
    tageHer: 0,
    vonMir: true,
    empfaenger: "compliance",
    status: "in-bearbeitung",
    eingegangen: "Heute, 07:15",
    kategorie: "Hinweis auf Regelverstoß",
    anonym: true,
    frist: "Rückmeldung offen",
    zusammenfassung:
      "Anwesenheitslisten sollen nachträglich geändert worden sein, damit Überschreitungen nicht auffallen.",
    verlauf: [
      { id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "07:15" },
      {
        id: 2,
        von: "rolle",
        text: "Eingang bestätigt. Der Hinweis wird vertraulich geprüft. Über die anonyme Rückfragefunktion können wir Rückfragen stellen, ohne dass Sie Ihre Identität preisgeben.",
        zeit: "08:00",
      },
    ],
  },
  {
    id: "COM-0659",
    tageHer: 9,
    empfaenger: "compliance",
    status: "offen",
    eingegangen: "vor 9 Tagen",
    kategorie: "Sicherheitsrelevanter Vorfall",
    anonym: true,
    frist: "Rückmeldung offen",
    zusammenfassung:
      "Ein Beinaheunfall in der Halle soll nicht gemeldet worden sein, um die Statistik nicht zu belasten.",
    verlauf: [{ id: 1, von: "system", text: "Anonym eingereicht über DB Peace.", zeit: "12:05" }],
  },
];
