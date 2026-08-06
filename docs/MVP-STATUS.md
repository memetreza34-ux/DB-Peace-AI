# DB Peace AI — MVP-Status

Stand: 6. August 2026

## Ziel des aktuellen MVP

Der MVP soll einen glaubwürdigen, stabilen Innovationsprototyp zeigen. Er soll Orientierung geben, Vorfälle strukturiert festhalten, Meldungsentwürfe erzeugen und auf reale Hilfe verweisen. Er ist keine produktive Meldestelle.

## Echte Funktionen

- React-Navigation und responsive Oberfläche
- Dark Mode
- lokaler Gemini-Chat über den Node.js-Proxy
- strukturierter Meldungsentwurf
- lokale regelbasierte Orientierung zur Dringlichkeit
- PDF-Export
- statische Lern-, Kurs- und Rechtsinhalte
- PWA-Grundstruktur
- Production-Build mit Vite

## Demo- oder eingeschränkte Funktionen

- Gedächtnisprotokolle bestehen derzeit nur im Frontend-Zustand
- Anhänge werden nicht an ein Backend übertragen
- KI-Datenextraktion im Meldeassistenten ist teilweise simuliert
- HR-Dashboard verwendet ausschließlich Mock-Daten
- Analytics sind Beispieldaten
- SSO ist keine echte Unternehmensanmeldung
- interne Kontakte benötigen eine fachliche Bestätigung
- Rechtsinhalte sind statisch und keine Live-Rechtsdatenbank

## Nicht behaupten

Solange die jeweilige Technik fehlt, darf die App nicht behaupten:

- Daten seien verschlüsselt gespeichert
- eine Meldung sei anonym übermittelt worden
- GPS oder Standort seien versendet worden
- eine Anmeldung sei über DB Azure AD erfolgt
- Offline-Eingaben würden später synchronisiert
- statische Daten seien live synchronisiert
- Beispielwerte seien geprüft, konform oder offiziell freigegeben

## Definition „präsentationsreif“

- `npm run check` ist erfolgreich
- keine erfundenen Telefonnummern oder E-Mail-Adressen
- jeder Demo-Bereich ist sichtbar gekennzeichnet
- keine echten personenbezogenen Daten
- Chat und Notfallbereich enthalten klare Grenzen
- wesentliche Wege funktionieren auf Mobilgerät und Desktop

## Definition „pilotfähig“

Zusätzlich zur Präsentationsreife:

- echte Authentifizierung und Rollen
- sichere serverseitige Datenhaltung
- verschlüsselte Anhänge
- Lösch- und Aufbewahrungskonzept
- fachlich geprüfte Kontakte und Rechtstexte
- Datenschutz- und IT-Sicherheitsfreigabe
- Audit-Logs und Incident Response
- dokumentierte Tests und Monitoring
