# DB Peace AI — MVP-Status

Stand: 6. August 2026  
Branch: `agent/mvp-stabilization`  
Integration: Draft Pull Request #1

## Ziel des aktuellen MVP

Der MVP soll einen glaubwürdigen und vorführbaren Innovationsprototyp zeigen. Er unterstützt dabei, schwierige Situationen zu reflektieren, Beobachtungen strukturiert festzuhalten, Meldungsentwürfe vorzubereiten und reale Hilfewege zu finden. Er ist keine produktive Meldestelle und keine offizielle DB-Anwendung.

## Technisch umgesetzte Funktionen

- React-19-Frontend mit Vite und Tailwind CSS
- responsive Navigation, globale Suche und Dark Mode
- lokale vierstellige Sichtschutz-PIN mit PBKDF2-Prüfwert
- Node.js-API-Proxy auf `127.0.0.1`
- Gemini-Chat mit klar gekennzeichnetem lokalem Fallback
- Gemini-Endpunkt zur Strukturierung eines Meldungsentwurfs
- Gemini-Quiz mit validierter Ausgabe und lokalem Fragenset als Fallback
- Meldungsentwurf mit Formularvalidierung, Kopierfunktion und PDF-Export
- Gedächtnisprotokolle und Stimmungseinträge nur für die aktuelle Sitzung
- statische Szenario-Übung mit transparenter lokaler Bewertungslogik
- Rechteorientierung mit Links zu offiziellen Gesetzestexten
- geprüfte externe Hilfsnummern und interne Suchhinweise
- Service Worker ohne Caching von `/api/`-Antworten
- Repository-Verifikation und GitHub-Actions-Workflow

## Klar gekennzeichnete Demonstrationsbereiche

- HR-Dashboard und Postfach enthalten ausschließlich fiktive Fälle
- Analytics und Kostenrechner verwenden erfundene beziehungsweise frei veränderbare Werte
- Projektideen sind Beispiele oder Sitzungsentwürfe und werden nicht veröffentlicht
- Kurskatalog enthält synthetische oder ungeprüfte Einträge
- In-App-Training ist kein externer Kurs und erzeugt nur eine persönliche Lernnotiz
- Bildungszeit-Funktion erstellt nur eine neutrale Prüfanfrage
- lokale PIN ist ein Sichtschutz und keine Verschlüsselung sensibler Daten

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
- Monitoring, Incident Response und produktive Betriebsprozesse

## Nicht behaupten

Solange die jeweilige Technik oder Freigabe fehlt, darf die App nicht behaupten:

- Daten seien verschlüsselt gespeichert
- eine Meldung sei anonym oder offiziell übermittelt worden
- eine Anmeldung sei über DB Azure AD oder ein anderes SSO erfolgt
- GPS oder Standort seien versendet worden
- Offline-Eingaben würden später synchronisiert
- statische Daten seien live synchronisiert
- ein Kurs, Zertifikat oder Bildungszeit-Antrag sei anerkannt
- interne Kontakte seien vollständig oder offiziell bestätigt
- Demo-Werte seien geprüft, konform oder reale Unternehmenskennzahlen
- ein Gespräch sei unter allen Umständen absolut vertraulich

## Definition „präsentationsreif“

- `npm run check` ist erfolgreich
- GitHub-Actions-Check ist erfolgreich oder ein gleichwertiger lokaler Build wurde dokumentiert
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

Die vollständige Pilot-Roadmap befindet sich in GitHub Issue #2.
