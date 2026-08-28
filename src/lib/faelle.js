/**
 * Die Fälle der laufenden Sitzung.
 *
 * Bis hierher las jede Ansicht die Demo-Fälle frisch aus der Datei. Damit war
 * jede Änderung nach dem Ansichtswechsel wieder weg — und eine Weitergabe an
 * eine andere Stelle hätte nichts bewirkt. Genau die will die App aber zeigen:
 * Ein Fall verlässt das eine Postfach und taucht im anderen auf.
 *
 * Bewusst nur im Arbeitsspeicher: Diese Fälle sind erfunden, sie gehören
 * niemandem und sollen kein Gerät überdauern. Beim Neuladen steht wieder der
 * Ausgangszustand da — für eine Vorführung ist das die richtige Eigenschaft.
 */

import { DEMO_FAELLE } from "../data/demoFaelle.js";

let faelle = DEMO_FAELLE.map((fall) => ({ ...fall, verlauf: [...fall.verlauf] }));
const zuhoerer = new Set();

export function alleFaelle() {
  return faelle;
}

/** Meldet Änderungen. Rückgabe: Funktion zum Abmelden. */
export function abonnieren(rueckruf) {
  zuhoerer.add(rueckruf);
  return () => zuhoerer.delete(rueckruf);
}

function melden() {
  faelle = [...faelle];
  for (const rueckruf of zuhoerer) rueckruf(faelle);
}

/** Hängt einen Eintrag an den Verlauf eines Falls. */
export function verlaufErgaenzen(fallId, eintrag) {
  faelle = faelle.map((fall) =>
    fall.id === fallId ? { ...fall, verlauf: [...fall.verlauf, eintrag] } : fall
  );
  melden();
}

/**
 * Gibt einen Fall an eine andere Stelle weiter.
 *
 * Der Verlauf hält beides fest: dass weitergegeben wurde und dass die betroffene
 * Person zugestimmt hat. Beide Seiten sehen denselben Eintrag — die Weitergabe
 * ist damit nicht rückgängig zu machen, ohne dass es auffällt.
 */
export function fallWeitergeben(fallId, vonKurz, zielRolleId, zielKurz, zeit) {
  faelle = faelle.map((fall) =>
    fall.id === fallId
      ? {
          ...fall,
          empfaenger: zielRolleId,
          verlauf: [
            ...fall.verlauf,
            {
              id: Date.now(),
              von: "system",
              text: `Mit Zustimmung der meldenden Person von ${vonKurz} an ${zielKurz} weitergegeben.`,
              zeit,
            },
          ],
        }
      : fall
  );
  melden();
}

/** Setzt den Ausgangszustand wieder her — für eine neue Vorführung. */
export function zuruecksetzen() {
  faelle = DEMO_FAELLE.map((fall) => ({ ...fall, verlauf: [...fall.verlauf] }));
  melden();
}
