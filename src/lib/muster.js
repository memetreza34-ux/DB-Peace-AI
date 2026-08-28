/**
 * Häufungen sichtbar machen — ohne Einzelne preiszugeben.
 *
 * „Zwei Meldungen im Werk X" ist keine Statistik, das ist ein Name. Deshalb
 * zeigt diese Auswertung erst ab einer Mindestzahl gleichartiger Fälle etwas
 * an. Darunter gibt sie nicht etwa null zurück, sondern die Begründung — die
 * Sperre soll sichtbar sein, nicht nur wirksam.
 */

export const SCHWELLE = 5;

/**
 * Gruppiert Fälle nach Kategorie und gibt nur die Gruppen zurück, die die
 * Schwelle erreichen.
 */
export function musterErkennen(faelle, schwelle = SCHWELLE) {
  if (!Array.isArray(faelle) || faelle.length === 0) {
    return { muster: [], gesperrt: 0, schwelle };
  }

  const gezaehlt = new Map();
  for (const fall of faelle) {
    const schluessel = fall?.kategorie ?? "ohne Kategorie";
    gezaehlt.set(schluessel, (gezaehlt.get(schluessel) ?? 0) + 1);
  }

  const muster = [];
  let gesperrt = 0;
  for (const [kategorie, anzahl] of gezaehlt) {
    if (anzahl >= schwelle) muster.push({ kategorie, anzahl });
    else gesperrt += 1;
  }

  muster.sort((a, b) => b.anzahl - a.anzahl);
  return { muster, gesperrt, schwelle };
}

/** Der Satz, der erklärt, warum unterhalb der Schwelle nichts steht. */
export function sperrBegruendung(schwelle = SCHWELLE) {
  return (
    `Auswertungen erscheinen erst ab ${schwelle} gleichartigen Fällen. Bei weniger ` +
    "wäre aus der Zahl erkennbar, um wen es geht — deshalb zeigt die App hier bewusst nichts an."
  );
}
