# DB Peace AI — MVP-Status

Stand: 8. August 2026  
Branch: `agent/mvp-stabilization`  
Integration: Draft Pull Request #1  
Pilot-Roadmap: GitHub Issue #2  
Unterstützte Entwicklungsumgebung: Node.js 22, npm 10 oder 11

Der Funktionsumfang dieses Stabilisierungsbranches ist für die technische Abnahme eingefroren. Nach dem Scope-Freeze sind nur konkrete Build-, Sicherheits-, Datenwahrheits- oder Abnahmefehler zulässig. Weitere Produktfunktionen sollen in getrennten Änderungen erfolgen.

## Ziel des aktuellen MVP

Der MVP soll einen glaubwürdigen und vorführbaren Innovationsprototyp zeigen. Er unterstützt dabei, schwierige Situationen zu reflektieren, Beobachtungen sachlich festzuhalten, Meldungsentwürfe vorzubereiten und reale Hilfewege zu finden. Er ist keine produktive Meldestelle und keine offizielle DB-Anwendung.

## Technisch umgesetzte Funktionen

- React-19-Frontend mit Vite und Tailwind CSS
- responsive Navigation, globale Suche und Dark Mode
- reduzierte Bewegung wird global für Framer Motion und zusätzlich über CSS/gezielte Komponenten berücksichtigt
- lokale vierstellige Sichtschutz-PIN mit PBKDF2-Prüfwert; kein In-App-Bypass, Fehlversuche und kurze Sperrzeiten werden tabübergreifend gedrosselt
- PIN-Konfigurationsänderungen werden zwischen Tabs beobachtet; veraltete Setup-Tabs und parallel veraltete PIN-Prüfungen werden verworfen statt eine neuere Konfiguration normal zu überschreiben oder mit einem alten Ergebnis zu entsperren
- Node.js-API-Proxy auf `127.0.0.1`
- Gemini-Chat mit klar gekennzeichnetem lokalem Fallback
- KI-Status unterscheidet einen konfigurierten Schlüssel von einer tatsächlich erfolgreichen Gemini-Antwort
- lokales Warten auf Gemini-Aufrufe wird nach 20 Sekunden begrenzt; ein SDK-Abort garantiert keine sofortige Beendigung externer Verarbeitung
- Gemini-Endpunkt zur Strukturierung eines Meldungsentwurfs
- KI-Quiz mit validierter Ausgabe, begrenztem Themenumfang und lokalem Fragenset als Fallback
- Meldungsentwurf mit Formularvalidierung, Kopierfunktion und PDF-Export
- Gedächtnisprotokolle bleiben während der laufenden App-Nutzung über interne Navigation hinweg im React-Arbeitsspeicher erhalten und werden nicht dauerhaft im Browser gespeichert
- Stimmungseinträge bleiben im Browser-Sitzungsspeicher
- Schnell-Verlassen leert temporäre App-Inhalte, setzt veränderte Demo-Tickets zurück und sperrt die Oberfläche vor der externen Navigation; die Funktion ist auch im HR-Demo-Modus verfügbar
- statische Szenario-Übung ohne KI, Punktzahl, Prozentwert oder Zertifikat
- kuratierte Rechteorientierung mit vorsichtigen Paraphrasen und amtlichen Einzelnorm-Links
- geprüfte externe Hilfsnummern und interne Suchhinweise
- vollständig fiktiver Lernkatalog ohne Zuordnung erfundener Angebote zu realen Organisationen
- Service Worker ohne Caching von `/api/`-Antworten und mit auf `db-peace-ai-*` begrenzter Cache-Bereinigung
- Production-CSP ohne Inline-Skripte oder Vite-HMR-WebSockets; eng begrenzte React-Refresh-/HMR-Ausnahmen gelten nur im lokalen Vite-Serve-Modus und nicht in `vite preview`
- Repository-Verifikation, Node-Regressionstests und GitHub-Actions-Workflow
- Importgraph-Test gegen unreferenzierten JavaScript-Altcode
- manuelle Abnahmecheckliste unter `docs/MANUAL-TEST-CHECKLIST.md`
- Auditprotokoll unter `docs/AUDIT-RESULTS.md`

## Klar gekennzeichnete Demonstrationsbereiche

- HR-Dashboard und Postfach enthalten ausschließlich fiktive Fälle
- Analytics und Kostenrechner verwenden erfundene beziehungsweise frei veränderbare Szenarioannahmen
- Projektideen sind Beispiele oder lokale Bereichsentwürfe und werden nicht veröffentlicht
- der Lernkatalog enthält ausschließlich fiktive Anbieter und fiktive Angebote
- In-App-Training ist kein externer Kurs und erzeugt nur eine persönliche Lernnotiz
- Bildungszeit-Funktion erstellt nur eine neutrale Prüfanfrage
- lokale PIN ist ein Sichtschutz und keine echte Authentifizierung oder Verschlüsselung sensibler Daten
- Rechtskarten sind Paraphrasen zur Orientierung und keine amtlichen Volltexte oder Einzelfallbewertung

## Im Audit zusätzlich entfernt oder korrigiert

- historischer Backup-Code und unreferenzierte Quellaltlasten
- direkter PIN-Zurücksetzen-Knopf auf dem Sperrbildschirm
- reload- und tab-umgehbare Fehlversuchspause der PIN
- veralteter PIN-Setup-Zustand in parallel geöffneten Tabs, der eine inzwischen eingerichtete PIN normal überschreiben konnte
- Verwendung eines veralteten PIN-Prüfergebnisses, wenn sich die Konfiguration während der Berechnung geändert hatte
- Antwortentwürfe im Demo-Postfach, die beim Fallwechsel dem falschen Fall zugeordnet werden konnten
- Gedächtnisprotokolle, die bereits bei normaler interner Navigation verloren gingen
- Schnellausstieg, der temporären React-Zustand nur durch erwartetes Verlassen der Seite verlor und deshalb bei PWA-Out-of-scope-Navigation nicht ausreichend robust war
- lokale Gefahrenlogik, die historische Gefahrbegriffe trotz ausdrücklicher Auswahl „Keine akute Gefahr“ als akut einstufen konnte
- Prozent-/Punktbewertung im statischen Training
- Service-Worker-Bereinigung fremder Origin-Caches
- ungeprüfter Rechtsdatensatz mit absoluten oder falschen Handlungs- und Sanktionsbehauptungen
- Generator für die alten problematischen Rechtsdaten
- großer synthetischer Kurskatalog, der reale Organisationen mit erfundenen Angeboten verknüpfte
- KI-Verbindungsanzeige, die einen vorhandenen API-Key fälschlich als erfolgreiche Verbindung bezeichnete
- KI-Quiz-Prompt, der ungeprüfte konkrete Rechtsfragen erzeugen konnte

## Nicht implementiert

- produktive Fall- oder Profildatenbank
- echte SSO-/OIDC-Anmeldung
- serverseitige Rollen und Autorisierung
- sichere Speicherung und Prüfung von Anhängen
- anonyme oder pseudonyme Rückkommunikation
- Audit-Logs, Löschfristen und Betroffenenrechte
- offizielle interne DB-Kontakte oder Systemintegration
- Standortübertragung und Offline-Synchronisation
- offizielle Zertifikate, Teilnahmebestätigungen oder Kursanerkennung
- reale Kursbuchung oder verifizierter Anbieterkatalog
- Monitoring, Incident Response und produktive Betriebsprozesse

## Nicht behaupten

Solange die jeweilige Technik oder Freigabe fehlt, darf die App nicht behaupten:

- Daten seien verschlüsselt gespeichert
- eine Meldung sei anonym oder offiziell übermittelt worden
- eine Anmeldung sei über DB Azure AD oder ein anderes SSO erfolgt
- ein konfigurierter API-Key beweise eine funktionierende Gemini-Verbindung
- GPS oder Standort seien versendet worden
- Offline-Eingaben würden später synchronisiert
- statische Daten seien live synchronisiert
- ein Kurs, Zertifikat oder Bildungszeit-Antrag sei anerkannt
- ein fiktiver Katalogeintrag stamme von einem realen Anbieter
- interne Kontakte seien vollständig oder offiziell bestätigt
- Demo-Werte seien geprüft, konform oder reale Unternehmenskennzahlen
- eine Rechtskarte entscheide den konkreten Einzelfall oder garantiere eine bestimmte Sanktion beziehungsweise Folge
- ein Gespräch sei unter allen Umständen absolut vertraulich

## Aktueller Validierungsstatus

Noch nicht nachgewiesen:

- erfolgreicher `npm ci`-Lauf
- erfolgreicher `npm run check`-Lauf
- erfolgreicher Vite-Produktionsbuild für den finalen Head
- vollständige manuelle Browser-, Mobil-, PDF- und Tastaturabnahme

Bisher beobachtete GitHub-Actions-Läufe erreichten keinen Runner und enthielten keine ausgeführten Steps. Deshalb liegt weder ein bestandener Check noch ein nachgewiesener Code-/Buildfehler aus diesen Läufen vor. Für den finalen Head muss erneut geprüft werden.

## Definition „präsentationsreif“

- `npm run check` ist erfolgreich
- GitHub-Actions-Check ist erfolgreich oder ein gleichwertiger lokaler Build wurde für exakt denselben Commit dokumentiert
- die manuelle Abnahmecheckliste wurde für den getesteten Commit ausgefüllt
- keine erfundenen Telefonnummern, E-Mail-Adressen oder offiziellen Nachweise
- alle Demonstrationsbereiche sind sichtbar gekennzeichnet
- keine echten personenbezogenen oder sensiblen Daten
- Chat, Meldung, Notfall, Kontakte, Suche und mobile Navigation wurden manuell geprüft
- PDF-Exporte sind als Entwurf oder private Lernnotiz gekennzeichnet

## Definition „pilotfähig“

Zusätzlich zur Präsentationsreife:

- verantwortliche Organisationseinheit und benanntes Bearbeitungsteam
- echte Authentifizierung, Rollen und serverseitige Berechtigungen
- sichere und dokumentierte Datenhaltung
- Verschlüsselung, Anhänge, Audit-Logs und Löschkonzept
- fachlich bestätigte Kontakte, Rechts- und Kriseninhalte
- Datenschutz-Folgenabschätzung und Beteiligung der zuständigen Gremien
- automatisierte Tests, Barrierefreiheitsprüfung und Browser-/Mobiltests
- Bedrohungsmodell, Penetrationstest, Monitoring und Incident Response

Die vollständige Pilot-Roadmap befindet sich in GitHub Issue #2. Der aktuelle Auditstand steht in `docs/AUDIT-RESULTS.md`.
