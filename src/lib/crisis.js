/**
 * Krisenerkennung für den Peace-Assistenten.
 *
 * Bewusst deterministisch und ohne KI: Wenn jemand Suizidgedanken, Selbstverletzung
 * oder akute Gewalt äußert, darf die Antwort nicht davon abhängen, ob ein API-Key
 * konfiguriert ist oder was ein Sprachmodell gerade generiert. Diese Prüfung läuft
 * deshalb VOR jedem Modellaufruf und liefert immer geprüfte, echte Hilfenummern.
 *
 * Alle Nummern sind öffentlich bekannte, bundesweit gültige Anlaufstellen.
 */

export const NOTRUF = {
  polizei: "110",
  rettung: "112",
  telefonseelsorge1: "0800 111 0 111",
  telefonseelsorge2: "0800 111 0 222",
  telefonseelsorgeEU: "116 123",
  nummerGegenKummer: "116 111"
};

const SUIZID_MUSTER = [
  "nicht mehr leben",
  "nicht mehr weiterleben",
  "will sterben",
  "sterben will",
  "möchte sterben",
  "lieber tot",
  "besser tot",
  "umbringen",
  "umzubringen",
  "bringe mich um",
  "bring mich um",
  "selbstmord",
  "suizid",
  "mich töten",
  "leben nehmen",
  "aus dem leben scheiden",
  "keinen sinn mehr im leben",
  "alles beenden",
  "schluss machen mit allem",
  "es beenden"
];

const SELBSTVERLETZUNG_MUSTER = [
  "ritze mich",
  "geritzt",
  "ritzen",
  "selbstverletz",
  "verletze mich selbst",
  "tue mir weh",
  "füge mir schmerzen"
];

const AKUTE_GEWALT_MUSTER = [
  "schlägt mich gerade",
  "schlägt mich",
  "hat mich geschlagen",
  "wurde geschlagen",
  "verprügelt",
  "würgt",
  "gewürgt",
  "messer",
  "waffe",
  "bedroht mich gerade",
  "angst um mein leben",
  "bringt mich um",
  "verfolgt mich gerade"
];

function trifft(text, muster) {
  return muster.some((m) => text.includes(m));
}

/**
 * Prüft eine Nutzereingabe auf Krisensignale.
 * @param {string} eingabe
 * @returns {{art: "suizid"|"selbstverletzung"|"gewalt", text: string}|null}
 */
export function erkenneKrise(eingabe) {
  if (!eingabe || typeof eingabe !== "string") return null;
  const text = eingabe.toLowerCase();

  if (trifft(text, SUIZID_MUSTER)) {
    return {
      art: "suizid",
      text:
        "Das klingt danach, dass es dir gerade sehr schlecht geht. Das nehme ich ernst, und du solltest damit nicht allein bleiben.\n\n" +
        `Bitte sprich jetzt mit einem Menschen — die Telefonseelsorge ist rund um die Uhr erreichbar, kostenlos und anonym:\n` +
        `• ${NOTRUF.telefonseelsorge1}\n` +
        `• ${NOTRUF.telefonseelsorge2}\n` +
        `• ${NOTRUF.nummerGegenKummer} (Nummer gegen Kummer, bis 25 Jahre)\n\n` +
        `Wenn du in akuter Gefahr bist oder dir etwas antun möchtest, ruf sofort den Notruf ${NOTRUF.rettung} an.\n\n` +
        "Ich bin nur eine App und kann dir hier nicht wirklich helfen — die Menschen an diesen Nummern können es."
    };
  }

  if (trifft(text, SELBSTVERLETZUNG_MUSTER)) {
    return {
      art: "selbstverletzung",
      text:
        "Danke, dass du mir das sagst. Wenn du dir selbst wehtust, ist das ein Zeichen dafür, dass die Belastung gerade zu groß ist — und dafür gibt es echte Hilfe.\n\n" +
        `• Telefonseelsorge: ${NOTRUF.telefonseelsorge1} (24/7, kostenlos, anonym)\n` +
        `• Nummer gegen Kummer: ${NOTRUF.nummerGegenKummer} (bis 25 Jahre)\n\n` +
        `Bei akuten Verletzungen: Notruf ${NOTRUF.rettung}.\n\n` +
        "Bitte such dir zusätzlich jemanden im echten Leben, dem du vertraust."
    };
  }

  if (trifft(text, AKUTE_GEWALT_MUSTER)) {
    return {
      art: "gewalt",
      text:
        "Wenn dir gerade körperlich etwas passiert oder du in Gefahr bist, hat deine Sicherheit Vorrang vor allem anderen.\n\n" +
        `• Polizei: ${NOTRUF.polizei}\n` +
        `• Rettungsdienst: ${NOTRUF.rettung}\n\n` +
        "Geh an einen Ort, an dem andere Menschen sind, und hol dir Hilfe. Dokumentieren und melden kannst du später — jetzt zählt nur, dass du sicher bist."
    };
  }

  return null;
}
