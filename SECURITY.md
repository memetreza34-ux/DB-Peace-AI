# Sicherheitsrichtlinie

## Projektstatus

DB Peace AI ist ein Innovations- und Demonstrationsprototyp. Das Repository ist nicht für den produktiven Umgang mit echten Meldungen, Gesundheitsdaten, psychischen Belastungen, Beschäftigtendaten oder anderen sensiblen Informationen freigegeben.

## Datenregel für Entwicklung und Präsentation

Ausschließlich erfundene Beispieldaten verwenden. Nicht eingeben oder hochladen:

- Klarnamen, Personalnummern oder Kontaktdaten realer Personen
- echte Vorfälle, Chatverläufe oder Gesundheitsinformationen
- interne Standorte, Telefonnummern, E-Mail-Adressen oder Dokumente
- Fotos, Audioaufnahmen oder Anhänge mit Personenbezug
- Zugangsdaten, API-Schlüssel oder interne Systeminformationen

## Datenfluss bei aktivierter KI

Ist `GEMINI_API_KEY` konfiguriert, werden Texte aus dem KI-Chat und der KI-gestützten Meldungsanalyse vom Browser an den lokalen Node.js-Proxy und von dort zur Modellverarbeitung an Google Gemini übertragen. Der Prototyp besitzt dafür keine eigene produktive Falldatenbank.

Daraus folgt:

- keine realen sensiblen Fall-, Gesundheits- oder Beschäftigtendaten eingeben
- ein lokaler Proxy bedeutet nicht, dass der Inhalt den Rechner nicht verlässt
- vor einem Pilotbetrieb müssen Anbieter, Vertrag, Rechtsgrundlage, Datenflüsse, Speicher-/Löschbedingungen und technische Schutzmaßnahmen geprüft werden
- ein clientseitig abgebrochener SDK-Request garantiert nicht, dass eine bereits beim externen Dienst laufende Operation sofort beendet wird

## Aktuell umgesetzte Schutzmaßnahmen

- API-Schlüssel verbleiben im lokalen Node.js-Proxy und werden nicht an das Frontend ausgeliefert.
- Der API-Server bindet standardmäßig ausschließlich an `127.0.0.1`.
- Fremde Browser-Origin- und `Sec-Fetch-Site: cross-site`-Anfragen an den lokalen Proxy werden abgewiesen.
- POST-Endpunkte akzeptieren nur echtes `application/json`; das KI-Quiz ist kein einfacher GET-Endpunkt mehr.
- Request-Größe, Nachrichtenlänge, Verlauf und Anfragerate sind begrenzt.
- Das lokale Warten auf Gemini-Aufrufe ist auf 20 Sekunden begrenzt; der SDK-Request erhält beim Timeout ein `AbortSignal`, ohne eine sofortige Beendigung bereits laufender externer Verarbeitung zu garantieren.
- API-Antworten erhalten `Cache-Control: no-store` und weitere Sicherheitsheader.
- Der Service Worker schließt `/api/` ausdrücklich vom Cache aus und nutzt statische Caches nur als Offline-Fallback.
- Chatverläufe werden nicht dauerhaft im Browser gespeichert.
- Gedächtnisprotokolle bleiben während der laufenden App-Nutzung über interne Navigation hinweg im React-Arbeitsspeicher erhalten, werden aber nicht in `localStorage`, `sessionStorage` oder IndexedDB gespeichert.
- Meldungs-, Projekt-, Stimmungs- und sonstige Entwürfe sind als temporär oder Demo gekennzeichnet; Stimmungseinträge verwenden nur den Browser-Sitzungsspeicher.
- Der Entsperrstatus der lokalen PIN wird nicht in Browser-Speicher persistiert; Reload oder neuer/duplizierter Tab sperren erneut.
- PIN-Fehlversuche und kurze Sperrzeiten werden tabübergreifend im lokalen Browser-Speicher gehalten und vor einer Prüfung erneut gelesen, damit ein weiterer Tab die Drosselung nicht zurücksetzt.
- Die lokale PIN wird nicht im Klartext gespeichert; sie bleibt dennoch nur ein Sichtschutz.
- Notfallfunktionen übertragen keinen Standort und verwenden keine erfundenen internen Telefonnummern.
- PDF-Ausgaben sind als Entwurf, Vorlage oder persönliche Lernnotiz gekennzeichnet.
- Kritische Platzhalter und irreführende Produktbehauptungen werden durch `npm run verify` blockiert.
- Pull Requests sollen mit `npm run check` gebaut werden.

## Verbleibende Risiken

Der aktuelle Stand besitzt insbesondere **nicht**:

- echte SSO-/OIDC-Authentifizierung
- serverseitige Rollen, Autorisierung oder Sitzungsverwaltung
- produktive Datenbank
- Verschlüsselung gespeicherter Falldaten
- Ende-zu-Ende-Verschlüsselung
- sichere Anhänge, Typprüfung oder Schadsoftwareprüfung
- anonyme oder pseudonyme Rückkommunikation
- Audit-Logs und manipulationsgeschützte Ereignisprotokolle
- Lösch-, Aufbewahrungs- und Wiederherstellungsprozesse
- Monitoring, Alarmierung und Incident Response
- echte Offline-Synchronisation
- Standortübertragung
- offizielle DB-Systemintegration
- fachlich freigegebene interne Kontakt- und Eskalationswege

## KI-Risiken

Gemini-Ausgaben können falsch, unvollständig oder unangemessen sein. Deshalb gilt:

- keine KI-Ausgabe als Rechts-, Medizin-, Krisen- oder Personalentscheidung verwenden
- keine unnötigen Identifikationsdaten an den KI-Endpunkt senden
- strukturierte Antworten validieren und begrenzen
- lokale Fallbacks sichtbar kennzeichnen
- bei Gewalt, akuter Gefahr oder Krise reale Hilfe priorisieren
- vor einem Pilotbetrieb Prompt-Injection, Datenabfluss, Halluzinationen und Missbrauch testen
- Anbieter- und Datenverarbeitungsbedingungen unabhängig vom Anwendungscode prüfen

## Schwachstellen melden

Keine Sicherheitsdetails in öffentlichen Issues veröffentlichen. Bei diesem privaten Repository die Verantwortlichen direkt und vertraulich informieren. Eine Meldung sollte enthalten:

1. betroffene Datei oder Funktion
2. reproduzierbare Schritte
3. mögliche Auswirkung
4. verwendete Umgebung
5. vorgeschlagene Abhilfe, falls bekannt

Keine realen Falldaten als Beweis anhängen.

## Voraussetzungen für einen produktiven Pilotbetrieb

Vor einem Pilotbetrieb sind mindestens erforderlich:

- klarer Verantwortungs- und Eskalationsprozess
- Datenschutz-Folgenabschätzung
- Beteiligung von Datenschutz, Compliance, Betriebsrat und JAV
- IT-Sicherheitsprüfung und Bedrohungsmodell
- echte Authentifizierung und serverseitiges Rollenmodell
- sichere, dokumentierte Datenhaltung und Verschlüsselung
- Löschkonzept, Berechtigungsaudit und Betroffenenrechte
- geprüfte interne Kontakte sowie fachlich freigegebene Rechts- und Kriseninhalte
- automatisierte Tests, Barrierefreiheitsprüfung und Penetrationstest
- Monitoring, Incident Response, Backups und Wiederherstellungstest

Die operative Roadmap befindet sich in GitHub Issue #2.
