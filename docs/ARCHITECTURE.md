# Architektur

## Komponenten

- **React/Vite-Frontend:** Navigation, lokale Formulare, Sitzungsentwürfe, Exporte und Demo-Ansichten
- **Lokaler Node.js-Proxy:** Health-, Status-, Chat-, Quiz- und Report-Endpunkte
- **Gemini API:** optionaler externer KI-Dienst; ohne Schlüssel greifen klar bezeichnete Fallbacks
- **Service Worker:** statische App-Shell und Assets; keine API-Antworten

## Datenfluss

1. Nutzende geben einen Text im Browser ein.
2. Nur bei einer KI-Funktion wird der notwendige Text an den lokalen Proxy gesendet.
3. Der Proxy begrenzt und bereinigt Eingaben und ruft optional Gemini auf.
4. Die Antwort wird mit `no-store` an den Browser zurückgegeben.
5. Entwürfe verbleiben im React-Sitzungszustand, bis sie kopiert oder als PDF exportiert werden.

Es existiert keine Datenbank, keine echte Unternehmensanmeldung und keine automatische Zustellung an interne Stellen.

## API

- `GET /api/health`
- `GET /api/chat/status`
- `POST /api/chat`
- `POST /api/report/extract`
- `GET /api/quiz`

## Build und Qualität

- Node.js 22
- npm 10 oder 11
- `npm run verify` für Repository-Regeln
- `npm test` für statische Integritätsprüfungen
- `npm run build` für den Vite-Produktionsbuild
- `npm run check` führt alle drei Schritte aus
