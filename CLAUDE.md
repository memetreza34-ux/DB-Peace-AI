# DB Peace AI — Claude Context

## Was ist das Projekt?
React + Vite Frontend mit Node.js Backend-Proxy. KI-Assistent (Azubi-Begleiter) der Deutsche Bahn, nutzt OpenAI API. Lokaler Innovationsprototyp.

## Tech Stack
- **Frontend:** React 19, Vite 7, Tailwind CSS 3, Lucide Icons
- **Backend:** Node.js Express Server (`server.js`) als API-Proxy
- **KI:** OpenAI API (GPT), Fallback auf Demo-Antworten wenn kein Key
- **Build:** Vite

## Starten
```bash
npm run dev          # startet Frontend + Backend gleichzeitig
npm run dev:app      # nur Frontend (Port 5173)
npm run dev:server   # nur Backend
npm run build        # Production Build → dist/
```

## Wichtige Dateien
- `src/` — React Komponenten
- `server.js` — Express Proxy für OpenAI
- `scripts/dev.js` — startet beide Server parallel
- `.env` — OPENAI_API_KEY (nicht committen!)

## Regeln
- `.env` niemals committen
- Kein TypeScript — bleibt JavaScript
- Tailwind für alle Styles
