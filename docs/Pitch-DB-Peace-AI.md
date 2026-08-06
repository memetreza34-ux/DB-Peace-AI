# DB Peace AI
## Ein digitaler Prototyp zur Vorbereitung sicherer nächster Schritte

**Mögliche Einreichung für:** „Azubis gegen Hass und Gewalt“  
**Eingereicht von:** `[Name] · [Ausbildungsberuf] · [Standort / Ausbildungsjahr]`  
**Status:** lokal lauffähiger Innovations- und Demonstrationsprototyp; keine offizielle DB-Anwendung

---

## 1. Die Idee in einem Satz

**DB Peace AI hilft Auszubildenden, belastende Situationen zu sortieren, Beobachtungen sachlich festzuhalten, einen Meldungsentwurf vorzubereiten und passende reale Hilfewege zu finden – ohne selbst eine Meldestelle oder menschliche Beratung zu ersetzen.**

> Leitprinzip: **Die App bereitet vor. Menschen prüfen und entscheiden.**

---

## 2. Welches Problem soll der Prototyp lösen?

Wer neu in der Ausbildung ist, kennt Zuständigkeiten und interne Wege häufig noch nicht. In einer belastenden Situation kommen weitere Hürden hinzu:

- Der Ablauf ist emotional und später schwer exakt zu erinnern.
- Beobachtungen, Gefühle und Vermutungen vermischen sich.
- Betroffene wissen nicht, welche Angaben für ein Gespräch hilfreich sind.
- Es ist unklar, welche Stelle zuständig ist und wie mit Vertraulichkeit umgegangen wird.
- Bei akuter Gefahr darf eine digitale Dokumentation nicht vom Eigenschutz oder von realer Hilfe ablenken.

Der Prototyp setzt deshalb **vor** einer möglichen Meldung an: Er unterstützt beim Strukturieren und beim Vorbereiten eines selbstbestimmten nächsten Schritts.

Für eine Einreichung sollten hier höchstens belegbare Zahlen aus einer aktuellen, zitierfähigen Quelle ergänzt werden. Keine Schätzungen oder erfundenen Unternehmensdaten verwenden.

---

## 3. Der aktuelle Kernweg

### Schritt 1: Situation einordnen

Ein KI-Begleiter kann eine kurze Orientierung geben. Er soll keine Rechts-, Personal-, Medizin- oder Krisenentscheidung treffen. Ist Gemini nicht eingerichtet oder nicht erreichbar, zeigt die App einen gekennzeichneten lokalen Fallback.

### Schritt 2: Beobachtungen festhalten

Ein privater Sitzungsentwurf hilft, Datum, Zeit, Kontext, beobachtbare Aussagen und mögliche Zeugen zu ordnen. Der aktuelle MVP speichert daraus keinen produktiven Fall und überträgt keine Anhänge.

### Schritt 3: Meldungsentwurf vorbereiten

Ein geführtes Formular erzeugt eine Vorschau, die kopiert oder als PDF exportiert werden kann. **Es wird nichts automatisch an DB, HR, JAV, Betriebsrat oder andere Stellen versendet.**

### Schritt 4: Reale Hilfe finden

Der Kontaktbereich enthält geprüfte externe Hilfsnummern und erklärt, wie bestätigte interne Ansprechstellen über Intranet, Telefonbuch oder bekannte betriebliche Wege gefunden werden können. Interne Kontakte werden nicht erfunden.

---

## 4. Was bereits gebaut ist

- responsive React-Oberfläche für Desktop und Mobilgeräte
- lokale Sichtschutz-PIN ohne Speicherung des Klartext-PINs
- Gemini-Chat über einen lokalen Node.js-Proxy
- KI-gestützte Strukturierung eines Meldungsentwurfs
- Fünf-Schritte-Formular mit Validierung, Kopierfunktion und PDF-Export
- temporäre Gedächtnisprotokolle und Stimmungseinträge für die aktuelle Sitzung
- Quiz mit Gemini-Ausgabe und transparentem lokalen Fragenset als Fallback
- lokale Szenario-Übung mit statischer, erklärter Bewertungslogik
- Rechteorientierung mit Links zu gesetzlichen Primärquellen
- geprüfte externe Hilfewege
- klar gekennzeichnete Demo-Ansichten für HR, Analytics, Projektideen und Kurse
- automatische Repository-Prüfung gegen irreführende Produktbehauptungen
- GitHub-Actions-Workflow für Repository-Check und Production-Build

---

## 5. Was bewusst nicht vorgetäuscht wird

Der aktuelle Prototyp behauptet nicht:

- eine Meldung sei offiziell oder anonym übermittelt worden
- Daten seien produktiv verschlüsselt gespeichert
- eine Anmeldung erfolge über echtes DB-SSO
- ein Standort werde übertragen
- Offline-Eingaben würden später synchronisiert
- ein Kurs oder eine Bildungszeit-Freistellung sei anerkannt
- ein PDF sei ein offizielles Zertifikat oder Personalnachweis
- Demo-Fälle und Kennzahlen seien reale Unternehmensdaten

Diese Ehrlichkeit ist ein Teil des Produktkonzepts: Gerade bei einem sensiblen Thema muss die Oberfläche klar zwischen **Orientierung**, **Entwurf**, **Demonstration** und **echtem Prozess** unterscheiden.

---

## 6. Nutzen des Konzepts

### Für Auszubildende

- niedrigere Hürde, Beobachtungen strukturiert aufzuschreiben
- klarere Trennung zwischen Tatsache, Gefühl und Vermutung
- verständliche Vorbereitung auf ein Gespräch
- schneller Hinweis auf Eigenschutz und reale Hilfe bei Gefahr

### Für mögliche Ansprechstellen

- besser vorbereitete, sachlichere Schilderungen
- weniger Rückfragen zu Grunddaten wie Zeit, Ort und Ablauf
- klare Erwartung: Die App entscheidet nichts und ersetzt keine zuständige Stelle

### Für Prävention

- Szenarien können sichere Reaktionsprinzipien verständlich üben
- Hilfewege und Zuständigkeiten können sichtbarer gemacht werden
- ein späterer Pilot könnte prüfen, ob der Ansatz tatsächlich Hürden senkt

Diese Nutzenpunkte sind **Hypothesen für eine Evaluation**, keine bereits bewiesenen Unternehmensergebnisse.

---

## 7. Warum der Ansatz verantwortungsvoll ist

- **Sicherheit vor Dokumentation:** Bei akuter Gefahr stehen Abstand, Notruf und reale Hilfe an erster Stelle.
- **Keine automatische Entscheidung:** KI strukturiert und formuliert, Menschen bewerten.
- **Datenminimierung:** Der Prototyp fordert keine Personalnummer und keine unnötigen Klarnamen an.
- **Transparente Fallbacks:** Nutzende sehen, ob eine Antwort von Gemini oder aus lokaler Logik stammt.
- **Keine erfundenen Integrationen:** SSO, Datenbank, Übermittlung, GPS und interne Kontakte werden nicht simuliert, als wären sie real.
- **Technische Leitplanken:** API-Limits, Sicherheitsheader, kein API-Cache und automatische Prüfregeln sind eingebaut.

---

## 8. Technische Umsetzung

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
- **Lokaler API-Proxy:** Node.js-HTTP-Server
- **KI:** Gemini über `@google/genai`
- **Dokumente:** jsPDF
- **PWA:** Manifest und Service Worker; API-Antworten werden nicht gecacht
- **Qualität:** `npm run verify`, `npm run build`, kombinierter `npm run check` und GitHub Actions

Der API-Schlüssel bleibt im lokalen Serverprozess. Der Server bindet standardmäßig an `127.0.0.1`.

---

## 9. Was für einen echten Pilotbetrieb fehlt

Ein produktiver Pilot darf erst beginnen, wenn mindestens folgende Punkte geklärt und umgesetzt sind:

1. verantwortliche Organisationseinheit und menschliches Bearbeitungsteam
2. bestätigte interne Kontakte, Zuständigkeiten und Eskalationswege
3. Datenschutz-Folgenabschätzung und Beteiligung von Datenschutz, Compliance, Betriebsrat und JAV
4. echte Authentifizierung und serverseitige Rollen
5. sichere Datenbank, Verschlüsselung, Anhänge, Audit-Logs und Löschfristen
6. fachliche Prüfung aller Rechts-, Hilfe- und Kriseninhalte
7. automatisierte Tests, Barrierefreiheitsprüfung und Browser-/Mobiltests
8. Bedrohungsmodell, Penetrationstest, Monitoring und Incident Response
9. zunächst ein Test mit synthetischen Daten und klaren Abbruchkriterien

Die detaillierte Roadmap befindet sich in GitHub Issue #2.

---

## 10. Vorschlag für die nächste Entscheidung

Nicht sofort „ausrollen“, sondern einen **fachlich begleiteten Konzept- und Usability-Test mit ausschließlich synthetischen Daten** durchführen.

Dabei sollten insbesondere diese Fragen gemessen werden:

- Verstehen Nutzende, dass kein Fall automatisch versendet wird?
- Können sie Beobachtungen sachlicher strukturieren?
- Finden sie in einer Gefahrensituation schneller den richtigen realen Hilfeweg?
- Sind Demo, KI-Ausgabe und offizielle Prozesse klar voneinander getrennt?
- Welche Funktionen sind tatsächlich hilfreich und welche sollten entfernt werden?

Erst nach dieser Evaluation sollte entschieden werden, ob und in welcher Form ein sicherer Pilot sinnvoll ist.

---

## 11. Persönlicher Teil für die Einreichung

`[Name]`, Auszubildende:r als `[Ausbildungsberuf]` am Standort `[Standort]`.

`[In zwei bis vier eigenen Sätzen erklären: Warum ist das Thema wichtig? Welche konkrete Hürde soll die Idee senken? Keine realen Fälle oder Namen ohne Einwilligung nennen.]`

Der besondere Beitrag besteht nicht darin, bereits eine fertige Meldestelle zu behaupten. Der Beitrag ist ein funktionsfähiger Prototyp, der zeigt, **wie eine sensible digitale Hilfe klar, vorsichtig und menschenzentriert gestaltet werden könnte.**

---

## 12. Abschluss

> **DB Peace AI – Orientierung und Vorbereitung, damit der nächste reale Schritt leichter und sicherer wird.**

---

## Checkliste vor einer Einreichung

- [ ] Name, Ausbildungsberuf und Standort ergänzen
- [ ] persönlichen Beweggrund in eigenen Worten ergänzen
- [ ] nur belegbare aktuelle Zahlen mit Quelle verwenden
- [ ] Screenshots ausschließlich mit synthetischen Daten erstellen
- [ ] deutlich zeigen: Entwurf, Demo und keine automatische Übermittlung
- [ ] aktuellen CI- und Buildstatus dokumentieren
- [ ] Vorgaben des Wettbewerbs zu Format, Länge, Marken und Datenschutz prüfen
