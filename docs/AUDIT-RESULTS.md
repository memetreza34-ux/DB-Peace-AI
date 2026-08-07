# DB Peace AI — Audit-Ergebnisse

Stand: 7. August 2026  
Branch: `agent/mvp-stabilization`  
Integration: Draft Pull Request #1

Dieses Dokument fasst den technischen Langzeit-Audit des aktuellen Stabilisierungsbranches zusammen. Es ist **kein** Nachweis eines erfolgreichen Builds, einer fachlichen Rechtsprüfung oder einer produktiven Freigabe.

## Wesentliche behobene Probleme

### Datenwahrheit und Sicherheit

- irreführende Aussagen zu SSO, Verschlüsselung, Standortübertragung, automatischer Zustellung und Zertifikaten entfernt
- erfundene interne Telefonnummern und nicht belegte Vertraulichkeits-/Sicherheitsgarantien entfernt
- lokaler Gemini-Proxy mit Größenlimits, strenger Content-Type-Prüfung, Sicherheitsheadern, Rate Limiting und kontrolliertem Shutdown gehärtet
- fremde Browser-Origin- und Cross-Site-Anfragen an den lokalen API-Proxy werden abgewiesen
- kostenträchtiges KI-Quiz von einfachem GET auf `POST /api/quiz` mit JSON umgestellt
- externe KI-Aufrufe durch ein serverseitiges 20-Sekunden-Limit begrenzt; beim Timeout wird zusätzlich der lokale SDK-Request per `AbortSignal` abgebrochen und kontrolliert als 504 behandelt
- der Abort-Pfad erhält Systemanweisung, Temperatur und Tokenlimit explizit bei, statt die Chat-Konfiguration versehentlich zu verlieren
- KI-Status korrigiert: vorhandener API-Key bedeutet nur „konfiguriert“, erst eine erfolgreiche Antwort bestätigt die tatsächliche Erreichbarkeit
- KI-Quiz auf allgemeine Sicherheits-, Dokumentations- und Orientierungsfragen begrenzt; konkrete generierte Rechtsauslegungen sind ausgeschlossen
- Produktions-Error-Boundary zeigt keine rohe interne Exception mehr
- Produktions-CSP erlaubt keine Inline-Skripte und keine ungenutzten Google-Font-Ursprünge; nur der lokale Vite-Serve-Modus erhält für React Refresh eine eng begrenzte Inline-Script-Ausnahme

### PIN und Sitzungszustand

- direkten PIN-Zurücksetzen-Knopf auf dem Sperrbildschirm entfernt, weil er den Sichtschutz ohne alte PIN umgehen konnte
- Fehlversuchs-Drosselung in der Browser-Sitzung gespeichert, sodass ein Reload die kurze Sperrzeit nicht aufhebt
- Entsperrstatus vollständig aus Browser-Speicher entfernt; Reload oder neuer/duplizierter Tab erfordern erneut die PIN
- Chat-, Quiz- und Report-Requests gegen veraltete Antworten nach Löschen, Schließen oder Unmount abgesichert
- React-StrictMode-Lifecycle der KI-Meldungsanalyse korrigiert: `isMountedRef` wird bei jedem Effect-Setup erneut aktiviert und kann im Entwicklungsmodus nicht dauerhaft auf `false` hängen bleiben
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
- statische Assets werden bei vorhandener Verbindung jetzt wirklich Network-first ausgeliefert; der Cache ist nur Offline-Fallback und keine absichtlich veraltete erste Antwort mehr
- kritische Dialoge mit Escape, Fokusfalle, Fokus-Rückgabe und Scroll-Sperre ausgestattet; auch das Gedächtnisprotokoll-Detailfenster nutzt die gemeinsame Dialogsteuerung
- unvollständige ARIA-Tab-Widgets in Profil, HR-Demo und Kursdetail durch korrekt angekündigte Umschaltbuttons ersetzt
- Notrufsteuerung per Tastatur bedienbar gemacht
- Schnell-Verlassen-Schaltfläche über die Dialogebene gehoben, damit sie auch bei geöffneten Overlays per Zeiger erreichbar bleibt
- reduzierte Bewegung auf Startseite, Chat und App-Seitenwechsel ausgeweitet
- Fokusmarkierungen und Statusmeldungen ergänzt
- lange PDF-Ausgaben paginiert und Exportfehler in den gehärteten Exportpfaden sichtbar behandelt

### Repository- und CI-Qualität

- historische Backup-Verzeichnisse entfernt
- bestätigten unreferenzierten JavaScript-Altcode entfernt
- Importgraph-Test ergänzt: jede JavaScript-Laufzeitdatei unter `src/` muss vom Einstiegspunkt `src/main.jsx` erreichbar sein
- Repository-Verifier und Node-Regressionstests um PIN-, PWA-, KI-, StrictMode-, CSP-, Rechts-, Kurs-, Dialog-, CI- und Datenwahrheitsregeln erweitert
- GitHub-Actions-Workflow in getrennte Schritte für Installation, Verifier, Tests und Production-Build aufgeteilt
- Workflow verwendet aktuelle `actions/checkout@v7`- und `actions/setup-node@v7`-Majors; Checkout-Credentials werden nicht persistent gespeichert
- Workflow arbeitet mit minimaler `contents: read`-Berechtigung, Concurrency-Abbruch und 10-Minuten-Joblimit
- README, MVP-Status, Changelog und manuelle Abnahmecheckliste werden auf denselben Auditstand gebracht

## Automatisierte Prüflogik im Repository

`npm run check` führt lokal nacheinander aus:

1. `npm run verify`
2. `npm test`
3. `npm run build`

Die Node-Tests prüfen unter anderem:

- Package-/Lockfile-Abgleich
- API-Routen, localhost-Isolation, Content-Type- und API-Härtung
- Gemini-Timeout/Abort und Erhalt der Modellkonfiguration
- KI-Status und begrenzten Quiz-Themenraum
- lokale Importauflösung und Erreichbarkeit des Runtime-Importgraphs
- React-StrictMode-Lifecycle der Meldungsanalyse
- PWA-Manifest, Cache-Namensraum und Network-first-Auslieferung
- Produktions-CSP und die ausschließlich lokale Vite-Dev-Ausnahme
- Dialogsteuerung, Umschalter-Semantik und Request-Abbruch
- PIN-Bypass, nicht persistierten Entsperrstatus und Fehlversuchs-Drosselung
- kuratierten Rechtsdatensatz und amtliche Quellen-URLs
- ausschließlich fiktiven Lernkatalog
- Demo-Reset, Schnell-Verlassen-Layering, CI-Konfiguration und Prozess-Shutdown

## Noch nicht nachgewiesen

- erfolgreicher `npm ci`-Lauf für den finalen Head
- erfolgreicher `npm run verify`-Lauf für den finalen Head
- erfolgreicher `npm test`-Lauf für den finalen Head
- erfolgreicher Vite-Produktionsbuild für den finalen Head
- vollständige manuelle Browser-, Mobil-, PDF- und Tastaturabnahme

## GitHub-Actions-Status

Bei im Audit geprüften Branch-Ständen wurden GitHub-Actions-Läufe erzeugt, deren Jobs keinen Runner starteten: Es gab keine ausgeführten Steps und `runner_id` blieb `0`. Damit wurden weder Checkout noch `npm ci`, Verifier, Tests oder Build ausgeführt.

Für den zuletzt vor dieser Dokumentationsaktualisierung geprüften Head `e5cac95957c40fb8869ad13db3f48cb706960214` lief Actions Run `31207792315`; auch dort blieb `steps: []` und `runner_id: 0`. Frühere Check-Annotations nannten ausdrücklich fehlgeschlagene Kontozahlungen beziehungsweise ein zu niedriges Spending-Limit als Ursache.

Ein solcher Lauf ist kein bestandener Test, aber auch kein nachgewiesener Code- oder Buildfehler. Nach Abschluss aller Änderungen muss der Actions-Status für den **dann exakten finalen Head** erneut geprüft werden.

## Bewusst offen

Möglicherweise ungenutzte npm-Pakete wie `openai`, `@radix-ui/react-slot`, `clsx` und `tailwind-merge` werden nicht ohne reproduzierbaren Lockfile-Neubau entfernt. `package.json` und `package-lock.json` sollen synchron bleiben, bis eine funktionierende Node-22-/npm-10-oder-11-Umgebung `npm ci`, kontrollierte Deinstallation und `npm run check` ausführen kann.

Ein clientseitig abgebrochener Gemini-Request garantiert außerdem nicht, dass eine bereits beim externen Dienst laufende Operation dort sofort beendet wird. Der Abort begrenzt primär das lokale Warten und lokale Ressourcen.

Ein produktiver Betrieb bleibt ausgeschlossen, solange echte Authentifizierung, Autorisierung, sichere Datenhaltung, organisatorische Prozesse, fachliche Freigaben, Datenschutzprüfung, Monitoring und Incident Response fehlen.

## Freigaberegel

Der PR bleibt Draft. Keine Freigabe und kein Merge, bevor für exakt denselben finalen Head:

- `npm ci` erfolgreich war,
- `npm run check` erfolgreich war,
- die manuelle Checkliste ausgefüllt wurde,
- die Ergebnisse in `docs/FINAL-ACCEPTANCE.md` dokumentiert wurden.
