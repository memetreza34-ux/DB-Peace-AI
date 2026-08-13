# DB Peace AI — Codex Context

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
npm test             # Tests (node:test)
npm run verify       # Tests + Build — vor jedem Commit
```

Beim ersten Start legt man eine eigene PIN fest. Es gibt keine Standard-PIN.

## Wichtige Dateien
- `src/` — React Komponenten
- `src/config/kontakte.js` — **alle Anlaufstellen zentral**, mit Quelle und Prüfdatum
- `src/lib/crisis.js` — Krisenerkennung, läuft vor jedem Modellaufruf
- `src/lib/lock.js` — Gerätesperre (PBKDF2-Hash, keine Inhaltsverschlüsselung)
- `src/lib/useDialog.js` — Escape, Fokus-Falle und Scroll-Sperre für Dialoge
- `server.js` — Express Proxy für OpenAI
- `docs/Pilot-Checkliste.md` — was vor einem Pilotbetrieb zu klären ist
- `.env` — OPENAI_API_KEY (nicht committen!)

## Regeln
- `.env` niemals committen
- Kein TypeScript — bleibt JavaScript
- Tailwind für alle Styles

### Inhaltliche Regeln (die App ist für Menschen in Belastungssituationen)
- **Keine erfundenen Kontaktdaten.** Jede Rufnummer, E-Mail und URL gehört nach
  `src/config/kontakte.js` — mit Quelle. Was nicht belegt ist, kommt unter
  `OFFEN_FUER_PILOT` und wird in der App als „noch nicht hinterlegt" gezeigt.
- **Keine Zusagen, die die App nicht einlöst.** Nichts „verschlüsselt" nennen,
  solange nicht verschlüsselt wird; keine Zertifikate ausstellen, keine Meldung
  automatisch versenden.
- **Krisenerkennung läuft lokal und vor der KI.** Sie darf nicht davon abhängen,
  ob ein API-Key gesetzt ist. Änderungen an `src/lib/crisis.js` brauchen Tests.
- **Demo-Daten sichtbar kennzeichnen** (HR-Dashboard, Analytics, Profil).

### Technische Fallstricke in diesem Projekt
- **`AnimatePresence` nicht für Overlays und Ansichtswechsel verwenden.** Elemente
  blieben unsichtbar im DOM liegen und fingen Klicks ab; mit `mode="wait"` hing der
  Wechsel ganz. Konditional rendern, Einblend-Animation über `initial`/`animate`.
- **Der Build fängt fehlende Imports nicht** — ein nicht importiertes Icon legt die
  App zur Laufzeit lahm. Dafür gibt es `tests/imports.test.mjs`.
