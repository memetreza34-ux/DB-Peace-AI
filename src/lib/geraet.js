/**
 * Teilt sich jemand dieses Gerät?
 *
 * Der Anlass: Die App soll auf Dienstgeräten laufen — Handy, Tablet, Laptop.
 * Auf einem Werkstatt-Tablet, das sich fünf Auszubildende teilen, wäre
 * dauerhaftes Speichern eine Falle: Die nächste Person läse, was die vorherige
 * geschrieben hat.
 *
 * Eine Sperre löst das nicht — sie gehört zum Gerät, nicht zur Person, und
 * verschlüsselt nichts. Also speichert die App auf einem geteilten Gerät
 * nichts dauerhaft, und sie sagt das auch.
 */

const SPEICHER_SCHLUESSEL = "db-peace-geraet";

export const PERSOENLICH = "persoenlich";
export const GETEILT = "geteilt";

/** Der eingestellte Modus, oder null, solange nicht gewählt wurde. */
export function geraetemodus() {
  try {
    const wert = localStorage.getItem(SPEICHER_SCHLUESSEL);
    return wert === PERSOENLICH || wert === GETEILT ? wert : null;
  } catch {
    // Ohne Speicherzugriff ist die vorsichtigere Annahme die richtige.
    return GETEILT;
  }
}

/** Setzt den Modus. Der Modus selbst ist keine persönliche Angabe. */
export function geraetemodusSetzen(modus) {
  try {
    localStorage.setItem(SPEICHER_SCHLUESSEL, modus);
    return true;
  } catch {
    return false;
  }
}

/** Teilen sich mehrere dieses Gerät? Im Zweifel: ja. */
export function istGeteilt() {
  return geraetemodus() !== PERSOENLICH;
}

/** Ist der Modus schon gewählt worden? */
export function modusGewaehlt() {
  return geraetemodus() !== null;
}
