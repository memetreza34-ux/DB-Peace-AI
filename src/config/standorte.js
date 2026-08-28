/**
 * Wer an einem Standort hinter den Rollen steht.
 *
 * Das ist die Lücke, die der Prototyp bisher offen ließ: JAV, Betriebsrat, AFK
 * und NGK sind je Standort andere Menschen, und zentral recherchieren lässt
 * sich das nicht. Bis ein Pilotbetrieb echte Daten liefert, zeigt die App
 * ehrlich „noch nicht hinterlegt" statt einer erfundenen Angabe.
 *
 * Der eine hier hinterlegte Standort ist ausdrücklich ein Beispiel, damit in
 * einer Vorführung ein vollständiger Weg zu sehen ist. Deshalb bewusst:
 *
 * - `beispiel: true` an jedem erfundenen Standort, und die App schreibt das
 *   überall dazu, wo er auftaucht.
 * - **Keine Rufnummern und keine E-Mail-Adressen.** Eine erfundene Nummer, die
 *   jemand in einer Notlage anruft, wäre schlimmer als gar keine Angabe. Was
 *   hier steht, sind Namen und Sprechzeiten — mehr nicht.
 *
 * Echte Standortdaten gehören in dieselbe Struktur, dann ohne `beispiel`.
 */

export const STANDORTE = [
  {
    id: "beispiel-werk",
    name: "Ausbildungswerk Musterstadt",
    beispiel: true,
    besetzung: {
      jav: [
        { name: "Merve Kaya", funktion: "JAV-Vorsitz", erreichbar: "Sprechstunde donnerstags 13–15 Uhr, Raum 2.14" },
        { name: "Jonas Lindner", funktion: "JAV", erreichbar: "nach Absprache" },
      ],
      betriebsrat: [
        { name: "Petra Hoffmann", funktion: "Betriebsrat", erreichbar: "Sprechstunde dienstags 10–12 Uhr, Raum 1.03" },
      ],
      sbv: [
        { name: "Ali Demir", funktion: "Schwerbehindertenvertretung", erreichbar: "nach Absprache" },
      ],
      afk: [
        { name: "Sandra Weiß", funktion: "Ausbildungsfachkraft Elektrotechnik", erreichbar: "täglich in der Werkstatt" },
      ],
      ngk: [
        { name: "Kevin Roth", funktion: "Nachwuchskräfte-Betreuung", erreichbar: "montags und mittwochs vor Ort" },
      ],
      ausbildungsleitung: [
        { name: "Dr. Claudia Reinhardt", funktion: "Ausbildungsleitung", erreichbar: "Termin über das Sekretariat" },
      ],
    },
  },
];

/** Die Rollen, für die ein Standort überhaupt Personen benennt. */
export const STANDORT_ROLLEN = ["jav", "betriebsrat", "sbv", "afk", "ngk", "ausbildungsleitung"];
