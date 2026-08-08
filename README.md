# DB Peace AI

DB Peace AI ist ein lokaler Innovations- und Demonstrationsprototyp für Auszubildende. Die Anwendung ist **keine offizielle Deutsche-Bahn-Anwendung** und darf ohne fachliche, rechtliche und technische Freigabe nicht mit echten Fall-, Gesundheits- oder Personendaten betrieben werden.

Aktueller Stabilisierungsstand: Branch `agent/mvp-stabilization`, Draft Pull Request #1. Die Roadmap für einen möglichen sicheren Pilotbetrieb wird in GitHub Issue #2 gepflegt. Der Funktionsumfang dieses Branches ist für die technische Abnahme eingefroren; weitere Produktfunktionen gehören in getrennte Änderungen.

Der technische Auditstand wird in [`docs/AUDIT-RESULTS.md`](docs/AUDIT-RESULTS.md) dokumentiert. Dieses Dokument ersetzt keinen erfolgreichen Build- oder Abnahmenachweis.

## Voraussetzungen

- Node.js 22
- npm 10 oder 11
- optional ein Gemini-API-Schlüssel für die KI-Funktionen

Die in `package.json` festgelegten Engine-Bereiche dienen einer reproduzierbaren Entwicklungs- und CI-Umgebung. Andere Laufzeiten sind nicht getestet.

## Was der aktuelle MVP tatsächlich kann

- responsive React-Oberfläche mit Navigation, Suche und Dark Mode
- lokale vierstellige Sichtschutz-PIN ohne Speicherung des Klartext-PINs; Fehlversuche und kurze Sperrzeiten werden tabübergreifend im lokalen Browser-Speicher gedrosselt
- die PIN-Konfiguration wird zwischen Tabs synchronisiert; ein bereits geöffneter veralteter Einrichtungs-Tab kann eine inzwischen gespeicherte PIN nicht mehr normal überschreiben, und parallel veraltete PIN-Prüfungen werden verworfen
- Entsperrstatus wird nicht in Browser-Speicher geschrieben; Reload sowie ein neuer oder duplizierter Tab verlangen erneut die PIN
- KI-Begleiter über einen lokalen Gemini-Proxy mit klar gekennzeichnetem lokalem Fallback
- `/api/chat/status` zeigt nur, ob ein Gemini-Schlüssel konfiguriert ist; erst eine erfolgreiche Chatantwort bestätigt eine tatsächliche Verbindung
- das lokale Warten auf Gemini-Aufrufe wird nach 20 Sekunden begrenzt; der SDK-Request erhält dabei ein `AbortSignal`, ohne eine sofortige Beendigung bereits laufender externer Verarbeitung zu garantieren
- KI-gestützte Strukturierung eines Meldungsentwurfs über `/api/report/extract`
- validierter Meldungsentwurf mit Kopierfunktion und PDF-Export
- Gedächtnisprotokolle bleiben während der laufenden App-Nutzung über interne Navigation hinweg im React-Arbeitsspeicher erhalten und werden nicht dauerhaft im Browser gespeichert
- Stimmungseinträge verwenden nur den Browser-Sitzungsspeicher und werden nicht an eine Falldatenbank übertragen
- „Schnell verlassen“ leert temporäre App-Inhalte, setzt veränderte Demo-Tickets zurück und sperrt die Oberfläche erneut, bevor die externe Tarnseite geöffnet wird; der Schutz steht auch im HR-Demo-Modus zur Verfügung
- Quiz über `POST /api/quiz` mit transparentem lokalem Fragenset als Fallback; KI-Fragen sind auf allgemeine Sicherheits- und Orientierungsinhalte begrenzt
- lokale, statische Szenario-Übungen ohne KI, Punkte, Prozentwertung oder Zertifikat
- kuratierte Rechteorientierung mit vorsichtigen Paraphrasen und Links zu amtlichen Einzelnormen
- geprüfte externe Hilfsnummern und klare Wege zum Finden interner Kontakte
- vollständig fiktiver Lernkatalog mit erfundenen Anbietern und Angeboten ausschließlich für die UI-Demonstration
- HR-, Projekt- und Analytics-Ansichten ausschließlich mit fiktiven Demonstrationsdaten beziehungsweise Szenarioannahmen
- PWA-Grundstruktur; API-Antworten werden nicht offline gecacht, statische Assets werden online Network-first geladen und der Service Worker löscht nur eigene alte Caches
- lokaler API-Proxy blockiert fremde Browser-Origin-/Cross-Site-Anfragen und akzeptiert auf POST-Routen nur echtes `application/json`
- Produktions-CSP ohne Inline-Skripte oder Vite-HMR-WebSockets; nur der lokale Vite-Serve-Modus erhält die für React Refresh/HMR notwendigen eng begrenzten Ausnahmen, nicht `vite preview`

## Was der MVP ausdrücklich nicht kann

- keine Meldung automatisch an DB, HR, JAV, Betriebsrat oder eine andere Stelle senden
- keine echte SSO-/OIDC-Anmeldung oder Rollenverwaltung
- keine serverseitige Speicherung von Fällen, Profilen oder Anhängen
- keine Verschlüsselung gespeicherter Falldaten
- keine anonyme Rückkommunikation
- keine Standortübertragung oder Offline-Synchronisation
- keine offiziellen Zertifikate, Teilnahmebestätigungen oder Bildungszeit-Anerkennungen ausstellen
- keine echte Kursbuchung oder reale Anbieterangebote bereitstellen
- keine Rechts-, Medizin- oder Krisenberatung ersetzen
- nicht selbst entscheiden, ob ein Rechtsverstoß vorliegt

## Lokalen KI-Modus einrichten

1. `.env.example` als `.env` kopieren.
2. `GEMINI_API_KEY` eintragen.
3. Optional `GEMINI_MODEL` und `API_PORT` anpassen.
4. Abhängigkeiten exakt aus dem Lockfile installieren:

```bash
npm ci
```

5. Frontend und lokalen API-Proxy starten:

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Die App läuft anschließend unter `http://127.0.0.1:5173/`. Der API-Proxy bindet standardmäßig ausschließlich an `http://127.0.0.1:8787`.

Ohne `GEMINI_API_KEY` bleiben die statischen Bereiche nutzbar. Chat, Quiz und Meldeanalyse verwenden dann klar gekennzeichnete lokale Fallbacks oder melden, dass der KI-Dienst nicht eingerichtet ist. Ein vorhandener Schlüssel bedeutet noch nicht, dass der externe Dienst erreichbar oder der Schlüssel gültig ist.

Ein clientseitig abgebrochener Gemini-Request garantiert nicht, dass eine beim externen Dienst bereits laufende Operation dort sofort beendet wird. Der Timeout begrenzt vor allem das lokale Warten und lokale Ressourcen.

## Verfügbare Befehle

```bash
npm run dev         # API und Vite gemeinsam starten
npm run dev:app     # nur Vite
npm run dev:server  # nur lokalen API-Proxy
npm run verify      # Repository-Regeln und kritische Behauptungen prüfen
npm test            # statische Integritäts-, Import- und Regressionstests ausführen
npm run build       # Production-Build erstellen
npm run check       # Verify, Tests und Production-Build nacheinander ausführen
npm run preview     # gebauten Stand lokal anzeigen
```

## Prüfung vor dem Zusammenführen

```bash
npm ci
npm run check
```

Danach die Kernwege anhand von [`docs/MANUAL-TEST-CHECKLIST.md`](docs/MANUAL-TEST-CHECKLIST.md) ausschließlich mit synthetischen Daten manuell testen und das Ergebnis in [`docs/FINAL-ACCEPTANCE.md`](docs/FINAL-ACCEPTANCE.md) dokumentieren.

Der GitHub-Actions-Lauf muss für exakt denselben finalen Commit erfolgreich sein. Hinweise zu externen Actions-Blockern stehen in [`docs/CI-TROUBLESHOOTING.md`](docs/CI-TROUBLESHOOTING.md). Die bisherige Audit-Historie steht in [`docs/AUDIT-RESULTS.md`](docs/AUDIT-RESULTS.md).

## Sicherheitsregeln

- ausschließlich erfundene Beispieldaten verwenden
- `.env`, API-Schlüssel und interne Kontaktdaten niemals committen
- Notfall-, Rechts- und Hilfeinhalte vor jeder echten Veröffentlichung fachlich prüfen
- Rechtskarten immer gegen die verlinkte aktuelle amtliche Norm prüfen; die App enthält nur Paraphrasen
- Demo-Funktionen sichtbar als Demo kennzeichnen
- keine Anonymität, Vertraulichkeit, Verschlüsselung, Anerkennung oder offizielle Integration garantieren, solange sie nicht technisch und organisatorisch umgesetzt ist
- Pull Requests erst nach erfolgreichem `npm run check` und manueller Prüfung der Kernwege zusammenführen

## Produktiver Pilotbetrieb

Ein echter Pilot benötigt mindestens:

- verantwortliche Organisationseinheit und verbindliche Prozesse
- Datenschutz-Folgenabschätzung und Beteiligung der zuständigen Gremien
- echte Authentifizierung, serverseitige Autorisierung und Rollen
- sichere Datenbank, Verschlüsselung, Anhänge, Audit-Logs und Löschfristen
- bestätigte interne Kontakte und fachlich freigegebene Inhalte
- automatisierte Tests, Barrierefreiheitsprüfung, Monitoring und Incident Response
- IT-Sicherheitsprüfung und Penetrationstest

Weitere Details stehen in [`SECURITY.md`](SECURITY.md), [`docs/SECURITY-MODEL.md`](docs/SECURITY-MODEL.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/MVP-STATUS.md`](docs/MVP-STATUS.md), [`docs/AUDIT-RESULTS.md`](docs/AUDIT-RESULTS.md) und der Pilot-Roadmap in GitHub Issue #2.
