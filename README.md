# DB Peace AI

DB Peace AI ist ein lokaler Innovations- und Demonstrationsprototyp für Auszubildende. Die Anwendung ist **keine offizielle Deutsche-Bahn-Anwendung** und darf ohne fachliche, rechtliche und technische Freigabe nicht mit echten Fall-, Gesundheits- oder Personendaten betrieben werden.

Aktueller Stabilisierungsstand: Branch `agent/mvp-stabilization`, Draft Pull Request #1. Die Roadmap für einen möglichen sicheren Pilotbetrieb wird in GitHub Issue #2 gepflegt. Der Funktionsumfang dieses Branches ist für die technische Abnahme eingefroren; weitere Produktfunktionen gehören in getrennte Änderungen.

## Voraussetzungen

- Node.js 22
- npm 10 oder 11
- optional ein Gemini-API-Schlüssel für die KI-Funktionen

Die in `package.json` festgelegten Engine-Bereiche dienen einer reproduzierbaren Entwicklungs- und CI-Umgebung. Andere Laufzeiten sind nicht getestet.

## Was der aktuelle MVP tatsächlich kann

- responsive React-Oberfläche mit Navigation, Suche und Dark Mode
- lokale vierstellige Sichtschutz-PIN ohne Speicherung des Klartext-PINs
- KI-Begleiter über einen lokalen Gemini-Proxy mit gekennzeichnetem lokalem Fallback
- KI-gestützte Strukturierung eines Meldungsentwurfs über `/api/report/extract`
- validierter Meldungsentwurf mit Kopierfunktion und PDF-Export
- Gedächtnisprotokolle und Stimmungseinträge nur im Zustand der aktuellen Sitzung
- Quiz über `/api/quiz` mit transparentem lokalem Fragenset als Fallback
- lokale, statische Szenario-Übungen ohne KI, Punkte oder Zertifikat
- allgemeine Rechteorientierung mit Links zu gesetzlichen Primärquellen
- geprüfte externe Hilfsnummern und klare Wege zum Finden interner Kontakte
- ungeprüfter Kurskatalog, der sichtbar als synthetischer Demo-Datensatz gekennzeichnet ist
- HR-, Projekt- und Analytics-Ansichten ausschließlich mit fiktiven Demonstrationsdaten
- PWA-Grundstruktur; API-Antworten werden nicht offline gecacht

## Was der MVP ausdrücklich nicht kann

- keine Meldung automatisch an DB, HR, JAV, Betriebsrat oder eine andere Stelle senden
- keine echte SSO-/OIDC-Anmeldung oder Rollenverwaltung
- keine serverseitige Speicherung von Fällen, Profilen oder Anhängen
- keine Verschlüsselung gespeicherter Falldaten
- keine anonyme Rückkommunikation
- keine Standortübertragung oder Offline-Synchronisation
- keine offiziellen Zertifikate, Teilnahmebestätigungen oder Bildungszeit-Anerkennungen ausstellen
- keine Rechts-, Medizin- oder Krisenberatung ersetzen

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

Ohne `GEMINI_API_KEY` bleiben die statischen Bereiche nutzbar. Chat, Quiz und Meldeanalyse verwenden dann klar gekennzeichnete lokale Fallbacks oder melden, dass der KI-Dienst nicht eingerichtet ist.

## Verfügbare Befehle

```bash
npm run dev         # API und Vite gemeinsam starten
npm run dev:app     # nur Vite
npm run dev:server  # nur lokalen API-Proxy
npm run verify      # Repository-Regeln und kritische Behauptungen prüfen
npm test            # statische Integritäts- und Importtests ausführen
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

Der GitHub-Actions-Lauf muss für exakt denselben finalen Commit erfolgreich sein. Hinweise zu externen Actions-Blockern stehen in [`docs/CI-TROUBLESHOOTING.md`](docs/CI-TROUBLESHOOTING.md).

## Sicherheitsregeln

- ausschließlich erfundene Beispieldaten verwenden
- `.env`, API-Schlüssel und interne Kontaktdaten niemals committen
- Notfall-, Rechts- und Hilfeinhalte vor jeder echten Veröffentlichung fachlich prüfen
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

Weitere Details stehen in [`SECURITY.md`](SECURITY.md), [`docs/SECURITY-MODEL.md`](docs/SECURITY-MODEL.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/MVP-STATUS.md`](docs/MVP-STATUS.md) und der Pilot-Roadmap in GitHub Issue #2.
