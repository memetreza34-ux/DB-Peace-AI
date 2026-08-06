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

## Aktuell umgesetzte Schutzmaßnahmen

- API-Schlüssel verbleiben im lokalen Node.js-Proxy und werden nicht an das Frontend ausgeliefert.
- Der API-Server bindet standardmäßig ausschließlich an `127.0.0.1`.
- Request-Größe, Nachrichtenlänge, Verlauf und Anfragerate sind begrenzt.
- API-Antworten erhalten `Cache-Control: no-store` und weitere Sicherheitsheader.
- Der Service Worker schließt `/api/` ausdrücklich vom Cache aus.
- Chatverläufe werden nicht dauerhaft im Browser gespeichert.
- Meldungs-, Projekt-, Stimmungs- und Protokollentwürfe sind als temporär oder Demo gekennzeichnet.
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
