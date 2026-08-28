# DB Peace AI — Audit-Ergebnisse

Stand: 8. August 2026  
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
- lokales Warten auf externe KI-Aufrufe auf 20 Sekunden begrenzt; beim Timeout wird zusätzlich der lokale SDK-Request per `AbortSignal` abgebrochen und kontrolliert als 504 behandelt
- dokumentiert, dass der SDK-Abbruch keine Garantie für eine sofortige Beendigung bereits laufender externer Verarbeitung oder möglicher Nutzungskosten ist
- der Abort-Pfad erhält Systemanweisung, Temperatur und Tokenlimit explizit bei, statt die Chat-Konfiguration versehentlich zu verlieren
- KI-Status korrigiert: vorhandener API-Key bedeutet nur „konfiguriert“, erst eine erfolgreiche Antwort bestätigt die tatsächliche Erreichbarkeit
- KI-Quiz auf allgemeine Sicherheits-, Dokumentations- und Orientierungsfragen begrenzt; konkrete generierte Rechtsauslegungen sind ausgeschlossen
- Produktions-Error-Boundary zeigt keine rohe interne Exception mehr
- Produktions-CSP erlaubt keine Inline-Skripte, Vite-HMR-WebSockets oder ungenutzten Google-Font-Ursprünge; nur der lokale Vite-Serve-Modus erhält die eng begrenzten React-Refresh-/HMR-Ausnahmen, nicht `vite preview`
- lokale Gefahreneinschätzung korrigiert: `akut` entsteht nur durch die bewusste Auswahl `Direkte Gefahr`; historische Begriffe überschreiben `Keine akute Gefahr` nicht mehr
- fehlende KI-Kategorie bleibt `Nicht angegeben`; der KI-Report darf `akut` nur bei eindeutig gegenwärtiger unmittelbarer Gefahr verwenden
- Notruftexte für 110 korrigiert: Support-Seite und Notfallmodal nennen nur akute Bedrohung, Gewalt oder unmittelbar gefährliche Situationen und nicht pauschal jede Straftat
- lokaler Chat-Fallback behandelt eine historische Erwähnung von Suizid oder Selbstverletzung nicht mehr automatisch als aktuelle akute Krise
- Gemini-Systemprompt trennt gegenwärtige Gefahr, laufende Gewalt und aktuelle Selbstverletzungs-/Suizidgefahr ausdrücklich von vergangenen Schilderungen; bei unklarem Zeitbezug soll aktuelle Gefahr geklärt werden

### PIN und Sitzungszustand

- direkten PIN-Zurücksetzen-Knopf auf dem Sperrbildschirm entfernt, weil er den Sichtschutz ohne alte PIN umgehen konnte
- Fehlversuchs-Drosselung tabübergreifend in `localStorage` gehalten und per `storage`-Ereignis synchronisiert; ein Reload oder neuer Tab setzt die kurze Sperre nicht zurück
- aktueller Drosselungszustand wird vor der PIN-Prüfung erneut gelesen, damit ein anderer Tab eine aktive Sperre nicht leicht umgehen kann
- alte Teil-Fehlversuche verfallen nach einem begrenzten Fünf-Minuten-Fenster statt unbegrenzt im lokalen Speicher zu verbleiben
- Entsperrstatus vollständig aus Browser-Speicher entfernt; Reload oder neuer/duplizierter Tab erfordern erneut die PIN
- ein bereits vor der ersten PIN-Einrichtung geöffneter zweiter Tab beobachtet Änderungen der PIN-Konfiguration und wechselt bei paralleler Einrichtung aus dem Setup- in den Entsperrmodus
- die PIN-Ersteinrichtung prüft vor und nach der PBKDF2-Berechnung sowie nach dem Speichern erneut die aktuelle Konfiguration, damit ein veralteter Setup-Tab eine inzwischen eingerichtete PIN nicht normal überschreibt
- laufende PIN-Prüfungen vergleichen die vor und nach PBKDF2 gelesene Konfiguration und verwerfen das Ergebnis, wenn sich Salt oder Verifier parallel geändert haben
- PIN-Sperrbildschirm respektiert reduzierte Bewegung
- Chat-, Quiz- und Report-Requests gegen veraltete Antworten nach Löschen, Schließen oder Unmount abgesichert
- React-StrictMode-Lifecycle der KI-Meldungsanalyse korrigiert: `isMountedRef` wird bei jedem Effect-Setup erneut aktiviert und kann im Entwicklungsmodus nicht dauerhaft auf `false` hängen bleiben
- Gedächtnisprotokolle auf App-Ebene gehoben: Sie überstehen interne Navigation im React-Arbeitsspeicher, werden aber nicht dauerhaft in Browser-Speicher geschrieben
- Demo-Postfach löscht einen angefangenen Antworttext beim Wechsel des ausgewählten Falls und verhindert damit eine versehentliche Zuordnung zum falschen Demofall
- Meldungsassistent, Demo-Postfach, Kursfortschritt, Freistellungsanfrage und Ideenbereich zuverlässig zurücksetzbar gemacht
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
- statische Assets werden bei vorhandener Verbindung Network-first ausgeliefert; der Cache ist nur Offline-Fallback
- Entwicklungsmodus unregistriert nur die Root-Service-Worker-Registrierung der App statt pauschal alle Registrierungen derselben Origin; fremde Sub-Scope-Registrierungen bleiben unangetastet
- kritische Dialoge mit Escape, Fokusfalle, Fokus-Rückgabe und Scroll-Sperre ausgestattet; auch das Gedächtnisprotokoll-Detailfenster nutzt die gemeinsame Dialogsteuerung
- unvollständige ARIA-Tab-Widgets in Profil, HR-Demo und Kursdetail durch korrekt angekündigte Umschaltbuttons ersetzt
- Notrufsteuerung per Tastatur bedienbar gemacht
- Schnell-Verlassen-Schaltfläche über die Dialogebene gehoben, damit sie auch bei geöffneten Overlays per Zeiger erreichbar bleibt
- Schnell-Verlassen ist auch im HR-Demo-Modus verfügbar und leert Protokolle, Stimmung, veränderte Demo-Tickets und offene App-Zustände, bevor die Oberfläche erneut gesperrt und die externe Tarnseite geöffnet wird
- Schnellausstieg verlässt sich nicht mehr ausschließlich auf einen vollständigen Browser-Unload; damit bleibt der temporäre Zustand auch dann nicht offen sichtbar, wenn eine installierte PWA eine externe Out-of-scope-Seite separat darstellt
- Schnellausstieg wird über BroadcastChannel plus kurzlebiges `localStorage`-Signal an andere offene DB-Peace-Tabs weitergegeben; empfangende Tabs entfernen ihren eigenen Stimmungsspeicher, verwerfen React-Zustand und sperren sich ebenfalls
- globale Framer-Motion-Konfiguration, CSS-Regeln und gezielte Komponenten berücksichtigen die Betriebssystemoption für reduzierte Bewegung
- Fokusmarkierungen und Statusmeldungen ergänzt
- lange PDF-Ausgaben paginiert und Exportfehler in den gehärteten Exportpfaden sichtbar behandelt

### Repository- und CI-Qualität

- historische Backup-Verzeichnisse entfernt
- bestätigten unreferenzierten JavaScript-Altcode entfernt
- Importgraph-Test ergänzt: jede JavaScript-Laufzeitdatei unter `src/` muss vom Einstiegspunkt `src/main.jsx` erreichbar sein
- Repository-Verifier und Node-Regressionstests um PIN-, PWA-, KI-, StrictMode-, CSP-, Rechts-, Kurs-, Dialog-, CI-, Gefahren-, Navigationszustands- und Datenwahrheitsregeln erweitert
- zusätzliche Regressionstests sichern die tabübergreifende PIN-Konfiguration, das Verwerfen parallel veralteter PIN-Prüfungen sowie das Leeren und erneute Sperren vor dem PWA-Schnellausstieg
- neuer Notfall-/Krisen-Regressionstest sichert die enge 110-Formulierung sowie die zeitbewusste lokale und Gemini-gestützte Krisenorientierung
- Quick-Exit-Regressionstest sichert BroadcastChannel, Storage-Fallback und die Zustandsbereinigung anderer offener Tabs
- Service-Worker-Regressionstest verhindert, dass der Entwicklungsmodus wieder alle Registrierungen derselben Origin pauschal unregistriert
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
- PWA-Manifest, Cache-Namensraum, Network-first-Auslieferung und begrenzte Dev-Unregistrierung
- Produktions-CSP und die ausschließlich lokale Vite-Dev-Ausnahme
- Dialogsteuerung, Umschalter-Semantik und Request-Abbruch
- PIN-Bypass, nicht persistierten Entsperrstatus, tabübergreifende Fehlversuchs-Drosselung, veraltete Setup-Tabs, parallel geänderte PIN-Konfiguration und reduzierte Bewegung
- kuratierten Rechtsdatensatz und amtliche Quellen-URLs
- ausschließlich fiktiven Lernkatalog
- enge 110-Notfallhinweise und zeitbewusste Krisenorientierung in lokalem sowie Gemini-Chat
- Gefahreneinstufung, Demo-Antwort-Fallwechsel, Protokollzustand über interne Navigation, Demo-Reset, tabübergreifende Quick-Exit-Zustandsbereinigung, Schnell-Verlassen-Layering, CI-Konfiguration und Prozess-Shutdown

## Noch nicht nachgewiesen

- erfolgreicher `npm ci`-Lauf für den finalen Head
- erfolgreicher `npm run verify`-Lauf für den finalen Head
- erfolgreicher `npm test`-Lauf für den finalen Head
- erfolgreicher Vite-Produktionsbuild für den finalen Head
- vollständige manuelle Browser-, Mobil-, PWA-, PDF- und Tastaturabnahme

## GitHub-Actions-Status

Bei den im Audit geprüften Branch-Ständen wurden GitHub-Actions-Läufe erzeugt, deren Jobs keinen Runner starteten: Es gab keine ausgeführten Steps und `runner_id` blieb `0`. Damit wurden weder Checkout noch `npm ci`, Verifier, Tests oder Build ausgeführt. Die Check-Annotations nannten ausdrücklich fehlgeschlagene Kontozahlungen beziehungsweise ein zu niedriges Spending-Limit als Ursache.

Dieses Dokument nennt bewusst keine „finale“ Commit-SHA: Jede Aktualisierung dieser Datei erzeugt selbst einen neuen Commit. Der exakte aktuelle Head und sein zugehöriger Actions-Lauf werden deshalb in Draft PR #1 dokumentiert und müssen unmittelbar vor einer Freigabe erneut geprüft werden.

Ein vor Runner-Start blockierter Lauf ist kein bestandener Test, aber auch kein nachgewiesener Code- oder Buildfehler.

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
