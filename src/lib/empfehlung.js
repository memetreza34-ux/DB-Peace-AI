/**
 * Welche Stelle passt zu diesem Vorfall?
 *
 * Der Melde-Assistent bot zuletzt zwölf Empfänger zur Auswahl an. Wer die App
 * öffnet, weil es ihm schlecht geht, soll aber nicht erst eine Gremienstruktur
 * verstehen müssen. Die Art des Vorfalls steht in Schritt 1 längst fest —
 * daraus lassen sich zwei bis drei passende Stellen vorschlagen.
 *
 * Es bleibt ein Vorschlag: Alle übrigen Stellen sind weiter wählbar, nur einen
 * Klick entfernt. Die Entscheidung trifft die meldende Person.
 */

const NACH_VORFALL = {
  Mobbing: ["jav", "betriebsrat", "vertrauensleute"],
  Beleidigung: ["jav", "afk", "vertrauensleute"],
  Hassrede: ["compliance", "gleichstellung", "betriebsrat"],
  Gewaltandrohung: ["compliance", "betriebsrat", "jav"],
  Diskriminierung: ["gleichstellung", "compliance", "jav"],
  Ausgrenzung: ["jav", "afk", "vertrauensleute"],
  "Konflikt im Team": ["afk", "jav", "ngk"],
  "Aggressiver Kunde/Fahrgast": ["betriebsrat", "ngk", "afk"],
  Sonstiges: ["jav", "vertrauensleute", "afk"],
};

/** Die Rollen-Ids, die zu dieser Vorfallart passen. Unbekannt: der neutrale Satz. */
export function empfohleneRollen(vorfallArt) {
  return NACH_VORFALL[vorfallArt] ?? NACH_VORFALL.Sonstiges;
}

/** Warum gerade diese? Ein Satz, der die Auswahl erklärt statt sie zu behaupten. */
export function empfehlungsGrund(vorfallArt) {
  const bekannt = Boolean(NACH_VORFALL[vorfallArt]);
  return bekannt
    ? `Diese Stellen passen erfahrungsgemäß zu „${vorfallArt}". Du kannst aber jede andere wählen.`
    : "Wenn du unsicher bist: Diese Stellen hören erst einmal zu. Du kannst auch jede andere wählen.";
}
