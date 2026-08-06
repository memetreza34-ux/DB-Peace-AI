# Sicherheitsrichtlinie

## Projektstatus

DB Peace AI ist ein Innovations- und Demonstrationsprototyp. Das Repository ist aktuell nicht für den produktiven Umgang mit echten Meldungen, Gesundheitsdaten, psychischen Belastungen, Beschäftigtendaten oder anderen sensiblen Informationen freigegeben.

## Keine echten Daten verwenden

Für Entwicklung, Tests, Präsentationen und Screenshots ausschließlich erfundene Beispieldaten verwenden. Keine Klarnamen, Personalnummern, echten Standorte, internen Kontaktdaten, Chatverläufe, Fotos oder Dokumente hochladen.

## Aktuelle Schutzmaßnahmen

- API-Schlüssel bleiben im lokalen Node.js-Proxy.
- Anfragen werden in Größe und Verlauf begrenzt.
- Die App weist auf ihren Prototyp-Status hin.
- Kritische Placeholder und falsche Sicherheitsbehauptungen werden durch `npm run verify` geprüft.
- Pull Requests werden per GitHub Actions gebaut.

## Bekannte Grenzen

Noch nicht produktiv umgesetzt sind insbesondere:

- echte SSO-/OIDC-Authentifizierung
- belastbare Rollen- und Rechteverwaltung
- serverseitige Datenbank
- Ende-zu-Ende- oder Datenspeicher-Verschlüsselung
- sichere Anhangsspeicherung
- anonyme Rückkommunikation
- Audit-Logs
- Lösch- und Aufbewahrungsfristen
- echte Offline-Synchronisation
- Standortübertragung
- offizielle DB-Systemintegration

## Meldung einer Schwachstelle

Keine Sicherheitsdetails in öffentlichen Issues veröffentlichen. Bei privatem Repository eine private Nachricht an die Repository-Verantwortlichen senden und folgende Informationen angeben:

1. betroffene Datei oder Funktion
2. reproduzierbare Schritte
3. mögliche Auswirkung
4. vorgeschlagene Abhilfe, falls bekannt

## Voraussetzungen für einen produktiven Pilotbetrieb

Vor einem Pilotbetrieb sind mindestens erforderlich:

- Datenschutz-Folgenabschätzung
- IT-Sicherheitsprüfung und Bedrohungsmodell
- fachliche Freigabe aller Hilfs-, Notfall- und Rechtsinhalte
- Beteiligung von Datenschutz, Compliance, Betriebsrat und JAV
- verifizierte interne Kontakte
- Authentifizierung und Rollenmodell
- sichere, dokumentierte Datenhaltung
- Löschkonzept und Berechtigungsaudit
- Incident-Response-Prozess
