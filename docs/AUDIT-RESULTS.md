# DB Peace AI — Audit-Ergebnisse

Stand: 7. August 2026  
Branch: `agent/mvp-stabilization`  
Integration: Draft Pull Request #1

Dieses Dokument fasst den technischen Langzeit-Audit des aktuellen Stabilisierungsbranches zusammen. Es ist **kein** Nachweis eines erfolgreichen Builds, einer fachlichen Rechtsprüfung oder einer produktiven Freigabe.

## Wesentliche behobene Probleme

### Datenwahrheit und Sicherheit

- irreführende Aussagen zu SSO, Verschlüsselung, Standortübertragung, automatischer Zustellung und Zertifikaten entfernt
- erfundene interne Telefonnummern und nicht belegte Vertraulichkeits-/Sicherheitsgarantien entfernt
- lokaler Gemini-Proxy mit Größenlimits, Content-Type-Prüfung, Sicherheitsheadern, Rate Limiting und kontrolliertem Shutdown gehärtet
- externe KI-Aufrufe durch ein serverseitiges 20-Sekunden-Limit begrenzt; Timeout wird kontrolliert als Upstream-Fehler behandelt
- KI-Status korrigiert: vorhandener API-Key bedeutet nur „konfiguriert“, erst eine erfolgreiche Antwort bestätigt die tatsächliche Erreichbarkeit
- KI-Quiz auf allgemeine Sicherheits-, Dokumentations- und Orientierungsfragen begrenzt; konkrete generierte Rechtsauslegungen sind ausgeschlossen
- Produktions-Error-Boundary zeigt keine rohe interne Exception mehr

### PIN und Sitzungszustand

- direkten PIN-Zurücksetzen-Knopf auf dem Sperrbildschirm entfernt, weil er den Sichtschutz ohne alte PIN umgehen konnte
- Fehlversuchs-Drosselung in der Browser-Sitzung gespeichert, sodass ein Reload die kurze Sperrzeit nicht aufhebt
- Chat-, Quiz- und Report-Requests gegen veraltete Antworten nach Löschen, Schließen oder Unmount abgesichert
- Meldungsassistent, Gedächtnisprotokolle, Demo-Postfach, Kursfortschritt, Freistellungsanfrage und Ideenbereich zuverlässig zurücksetzbar gemacht
- stabilere Sitzungs- und Nachrichten-IDs eingeführt

### Rechts- und Lerninhalte

- problematischen Rechtsdatensatz vollständig ersetzt
- erfundene interne DB-Richtlinien aus dem Rechtsbereich entfernt
- absolute beziehungsweise falsche Aussagen zu Sanktionen, Beschwerdesicherheit, Arbeitszeit und der angeblichen offiziellen Wirkung dieser App entfernt
- Rechtsbereich auf eine kleine kuratierte Sammlung aus AGG, BBiG, JArbSchG und BetrVG reduziert
- jede Rechtskarte enthält eine vorsichtige Paraphrase und einen Link zur amtlichen Einzelnorm auf `gesetze-im-internet.de`
- alten Generator der problematischen Rechtsdaten gelöscht
- großen synthetischen Kurskatalog entfernt, der reale Organisationen mit erfundenen Angeboten und zukünftigen Editionsangaben verknüpfte
- Lernkatalog auf neun vollständig fiktive Demo-Einträge mit fiktiven Anbietern reduziert
- leere Präsenzkategorie durch Korrektur des Datenschlüssels `partner` → `praesenz` behoben
- In-App-Training von Punkt- und Prozentbewertung bereinigt; keine Kompetenzmessung oder Zertifikatswirkung

### PWA, Bedienung und Barrierefreiheit

- Service Worker auf Produktionsbetrieb begrenzt; `/api/` wird nicht gecacht
- Service Worker löscht beim Aktivieren nur eigene alte Caches mit Präfix `db-peace-ai-`
- Dialoge mit Escape, Fokusfalle, Fokus-Rückgabe und Scroll-Sperre ausgestattet
- Notrufsteuerung per Tastatur bedienbar gemacht
- reduzierte Bewegung auf Startseite, Chat und App-Seitenwechsel ausgeweitet
- Fokusmarkierungen und Statusmeldungen ergänzt
- lange PDF-Ausgaben paginiert und Exportfehler sichtbar behandelt

### Repository-Qualität

- historische Backup-Verzeichnisse entfernt
- bestätigten unreferenzierten JavaScript-Altcode entfernt
- Importgraph-Test ergänzt: jede JavaScript-Laufzeitdatei unter `src/` muss vom Einstiegspunkt `src/main.jsx` erreichbar sein
- Repository-Verifier und Node-Regressionstests um PIN-, PWA-, KI-, Rechts-, Kurs-, Dialog- und Datenwahrheitsregeln erweitert
- GitHub-Actions-Workflow in getrennte Schritte für Installation, Verifier, Tests und Production-Build aufgeteilt
- README, MVP-Status, Changelog und manuelle Abnahmecheckliste auf denselben Auditstand gebracht

## Automatisierte Prüflogik im Repository

`npm run check` führt lokal nacheinander aus:

1. `npm run verify`
2. `npm test`
3. `npm run build`

Die Node-Tests prüfen unter anderem:

- Package-/Lockfile-Abgleich
- API-Routen und API-Härtung
- KI-Status und begrenzten Quiz-Themenraum
- lokale Importauflösung und Erreichbarkeit des Runtime-Importgraphs
- PWA-Manifest und Cache-Namensraum
- Dialogsteuerung und Request-Abbruch
- PIN-Bypass und Fehlversuchs-Drosselung
- kuratierten Rechtsdatensatz und amtliche Quellen-URLs
- ausschließlich fiktiven Lernkatalog
- Demo-Reset und Prozess-Shutdown

## Noch nicht nachgewiesen

- erfolgreicher `npm ci`-Lauf für den finalen Head
- erfolgreicher `npm run verify`-Lauf für den finalen Head
- erfolgreicher `npm test`-Lauf für den finalen Head
- erfolgreicher Vite-Produktionsbuild für den finalen Head
- vollständige manuelle Browser-, Mobil-, PDF- und Tastaturabnahme

## GitHub-Actions-Status

Bei im Audit geprüften Branch-Ständen wurden GitHub-Actions-Läufe erzeugt, deren Jobs keinen Runner starteten: Es gab keine ausgeführten Steps und `runner_id` blieb `0`. Damit wurden weder Checkout noch `npm ci`, Verifier, Tests oder Build ausgeführt.

Ein solcher Lauf ist kein bestandener Test, aber auch kein nachgewiesener Code- oder Buildfehler. Nach Abschluss aller Änderungen muss der Actions-Status für den **dann exakten finalen Head** erneut geprüft werden.

## Bewusst offen

Möglicherweise ungenutzte npm-Pakete werden nicht ohne reproduzierbaren Lockfile-Neubau entfernt. `package.json` und `package-lock.json` sollen synchron bleiben, bis eine funktionierende Node-22-/npm-10-oder-11-Umgebung `npm ci`, kontrollierte Deinstallation und `npm run check` ausführen kann.

Ein produktiver Betrieb bleibt außerdem ausgeschlossen, solange echte Authentifizierung, Autorisierung, sichere Datenhaltung, organisatorische Prozesse, fachliche Freigaben, Datenschutzprüfung, Monitoring und Incident Response fehlen.

## Freigaberegel

Der PR bleibt Draft. Keine Freigabe und kein Merge, bevor für exakt denselben finalen Head:

- `npm ci` erfolgreich war,
- `npm run check` erfolgreich war,
- die manuelle Checkliste ausgefüllt wurde,
- die Ergebnisse in `docs/FINAL-ACCEPTANCE.md` dokumentiert wurden.
