# Was vor einem Pilotbetrieb zu klären ist

Diese Liste sagt ehrlich, was der Prototyp heute leistet und was er nicht leistet.
Sie ist als Arbeitsgrundlage für ein Gespräch mit Ausbildung, JAV, Compliance und
Datenschutz gedacht — nicht als Verkaufsdokument.

Stand: 13.08.2026

---

## 1. Was heute echt ist

Diese Angaben sind recherchiert und an der Quelle geprüft. Sie stehen in
[`src/config/kontakte.js`](../src/config/kontakte.js), jeweils mit Quelle und Prüfdatum.

| Anlaufstelle | Kanal | Quelle |
|---|---|---|
| Hinweisgebersystem BKMS | bkms-system.net/deutschebahn | deutschebahn.com → Compliance → Hinweise geben |
| Meldestelle Beschäftigungsbedingungen | Meldestelle-Beschaeftigung@deutschebahn.com | ebenda |
| Meldestelle Konzernsicherheit | Meldestelle-Konzernsicherheit@deutschebahn.com | ebenda |
| Compliance Hinweismanagement | +49 30 297 62710 (Mo–Fr 10–15 Uhr) | ebenda |
| Compliance per Post | Potsdamer Platz 2, 10785 Berlin | ebenda |
| MUT – Mitarbeitendenunterstützung | lyra-mut.de, intern db.de/mut-hotline | railbow.deutschebahn.com |
| Polizei / Rettungsdienst | 110 / 112 | allgemein gültig |
| Telefonseelsorge | 0800 111 0 111, 0800 111 0 222 | allgemein bekannt |
| Nummer gegen Kummer | 116 111 | allgemein bekannt |
| Antidiskriminierungsstelle des Bundes | 0800 546 546 5 | antidiskriminierungsstelle.de |
| Hilfetelefon Gewalt gegen Frauen | 116 016 | allgemein bekannt |
| WEISSER RING | 116 006 | weisser-ring.de |

**Zur MUT-Rufnummer:** In Drittquellen kursiert `0800 100 99 66`. Auf DB-eigenen
Seiten ist sie nicht hinterlegt — dort wird auf Intranet und lyra-mut.de verwiesen.
Sie ist deshalb **nicht** als wählbare Nummer eingebaut. Wenn die Ausbildung die
aktuelle Nummer bestätigt, gehört sie in `DB_BERATUNG` in der Konfigurationsdatei.

---

## 2. Was vor dem Pilot hinterlegt werden muss

Diese Stellen sind standort- oder bereichsabhängig und lassen sich nicht zentral
recherchieren. Sie stehen in der Konfiguration unter `OFFEN_FUER_PILOT` und werden
in der App sichtbar als „noch nicht hinterlegt" ausgewiesen — die App erfindet
dafür bewusst keine Daten.

- [ ] **Jugend- und Auszubildendenvertretung (JAV)** je Standort
- [ ] **Betriebsrat** je Standort
- [ ] **Ausbildungsleitung / AFK / NGK** je Ausbildungsbereich
- [ ] **DB Sicherheit** — interne Rufnummer
- [ ] **Gleichstellungsbeauftragte** je Bereich

Offene Frage dazu: Soll die App den Standort abfragen, oder wird je Standort eine
eigene Konfiguration ausgeliefert?

---

## 3. Was der Prototyp bewusst nicht tut

- **Er versendet keine Meldungen.** Der Melde-Assistent bereitet einen Text auf und
  übergibt ihn an einen offiziellen Meldeweg. Abgeschickt wird er von einem
  Menschen, der vorher draufschaut.
- **Er speichert nichts auf einem Server.** Alle Eingaben bleiben im Browser des
  Geräts. Es gibt keine Datenbank, kein Konto, keine Übertragung an die DB.
- **Er verschlüsselt keine Inhalte.** Die PIN sperrt die Oberfläche auf dem Gerät,
  sie schützt die gespeicherten Inhalte nicht. Bei vier Ziffern wäre Verschlüsselung
  Sicherheitstheater. Die App behauptet das an keiner Stelle.
- **Er ersetzt keine Beratung.** Bei Krisenäußerungen tritt der Assistent zurück und
  nennt echte Hilfenummern.

---

## 4. Zu klären mit Datenschutz und IT

- [ ] **KI-Anbindung.** Ohne API-Key läuft der Assistent im Demo-Modus mit fest
      hinterlegten Antworten. Mit Key gehen Chatinhalte an einen externen Anbieter.
      Für einen Pilot ist zu klären: EU-Hosting, Auftragsverarbeitung, welche Inhalte
      das Gerät überhaupt verlassen dürfen. **Empfehlung: im Pilot ohne KI-Anbindung
      starten.** Die Krisenerkennung läuft bewusst lokal und ist davon unabhängig.
- [ ] **Speicherort.** Aktuell `localStorage` des Browsers. Bei geteilten Geräten
      (Schulungsraum, Diensthandy) ist zu klären, ob das tragbar ist.
- [ ] **Quick Exit.** Verlässt die App schnell. Zu prüfen, ob dabei alle sichtbaren
      Spuren verschwinden sollen.
- [ ] **Hosting** der Anwendung selbst (heute nur lokal lauffähig).
- [ ] **Barrierefreiheit nach BITV fachlich prüfen lassen.** Selbst geprüft und in
      Ordnung: alle Bedienelemente per Tabulator erreichbar und beschriftet,
      Überschriften ohne Ebenensprünge, `lang="de"`, Landmarks (header/nav/main/footer),
      sichtbarer Fokusrahmen, Tippziele ab 44 px, Dialoge mit Escape und Fokusfalle,
      Bewegungsreduzierung wird beachtet. **Nicht geprüft:** Test mit echtem Screenreader
      (NVDA/VoiceOver), vollständige Kontrastmessung mit Fachwerkzeug, Bedienung durch
      Menschen mit Behinderung. Eine automatisierte Messung ersetzt das nicht.

---

## 5. Zu klären mit Ausbildung und JAV

- [ ] Wer ist Ansprechpartner, wenn über die App eine Meldung eingeht?
- [ ] Wie wird sichergestellt, dass eine Meldung nicht zum Nachteil wird (§ 16 AGG)?
- [ ] Soll die App auf Azubis begrenzt bleiben oder allen Beschäftigten offenstehen?
- [ ] Wer pflegt die Kontaktdaten und in welchem Rhythmus?
- [ ] Begleitung durch Profis: Wer schaut sich die Krisen-Texte fachlich an?

---

## 6. Inhalte, die fachlich geprüft gehören

- [ ] **Rechtstexte** in `src/data/lawsData.json` — die Paragrafen sind korrekt
      zugeordnet, die Zusammenfassungen in einfacher Sprache sollten juristisch
      gegengelesen werden.
- [ ] **DB-interne Regelwerke** in derselben Datei (Konzernbetriebsvereinbarung,
      Verhaltenskodex, „Übernahmegarantie") sind als Zitate dargestellt, aber ohne
      Quellenangabe. Vor einem Pilot belegen oder entfernen.
- [ ] **Fristen** in `src/lib/fristen.js` — Eingangsbestätigung und Rückmeldung nach
      HinSchG, Geltendmachungsfrist nach AGG. Die Tageswerte stehen so im Gesetz und
      sind mit Paragraf hinterlegt, aber bevor sich in einem Pilot jemand darauf
      verlässt, gehören sie bestätigt. Dasselbe gilt für die Rechtshinweise in
      `src/lib/hinweise.js` (JArbSchG, § 85 BetrVG, § 178 SGB IX).
- [ ] **Anonymitätsschwelle** in `src/lib/muster.js` — aktuell fünf gleichartige Fälle.
      Mit Betriebsrat und Datenschutz abstimmen, ob das für kleine Standorte reicht.
- [ ] **Bildungsangebote** in `src/data/coursesData.json` — Organisationen und Links
      sind geprüft, die Angebote selbst sollten mit der Ausbildung abgestimmt werden.

---

## 7. Bekannte Demo-Inhalte

Diese Bereiche zeigen erfundene Daten und sind in der App als solche gekennzeichnet:

| Bereich | Inhalt |
|---|---|
| Rollen-Postfächer (JAV, BR, HR, Compliance …) | erfundene Fälle, Hinweisbanner in jeder Ansicht |
| Analytics | fiktive Kennzahlen, im Text als solche benannt |
| Sammlung / Profil | Beispieleinträge, Hinweis im Kopfbereich |
| Zertifikatslehrgänge | leer, mit Begründung |

---

## 8. Prüfen vor jeder Vorführung

```bash
npm run verify   # Tests und Produktionsbuild
npm run dev      # App starten
```

- [ ] Krisenerkennung: „Ich will nicht mehr leben" in den Chat eingeben — es müssen
      sofort Telefonseelsorge und 112 erscheinen.
- [ ] Notfall-Dialog öffnen, mit Escape schließen, danach weiterklicken können.
- [ ] Eine Meldung bis „Wohin mit deiner Meldung?" durchspielen.
- [ ] Auf einem Handy oder in schmalem Fenster öffnen — nichts darf abgeschnitten sein.
