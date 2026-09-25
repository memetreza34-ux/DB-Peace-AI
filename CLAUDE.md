# DB Peace AI — Claude Context

## Was ist das Projekt?
React + Vite Frontend mit kleinem Node-Server für abgeschickte Meldungen (SQLite, nur 127.0.0.1). Anlaufstelle für Azubis der Deutschen Bahn bei Mobbing, Diskriminierung und Konflikten. Lokaler Innovationsprototyp.

Seit dem 6.9.2026 **ohne KI**: Der Chat-Assistent ist entfernt. Was nach KI aussieht — Krisenerkennung, Meldungs-Analyse, Rollenempfehlung — sind lokale Regeln in `src/lib/`, ohne Modellaufruf.

## Tech Stack
- **Frontend:** React 19, Vite 7, Tailwind CSS 3, Lucide Icons
- **Backend:** kleiner Node-Server (`server.js`), speichert Meldungen in SQLite
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

Ist Port 8787 belegt: `API_PORT=8788 npm run dev` — Server und Vite-Proxy lesen beide `API_PORT`.

Beim ersten Start wird nur gefragt, ob das Gerät geteilt wird. Eine PIN gibt es seit dem 6.9.2026 nicht mehr — sie verstellte den Zugang, ohne etwas zu verschlüsseln.

## Wichtige Dateien
- `src/` — React Komponenten
- `src/config/kontakte.js` — **alle Anlaufstellen zentral**, mit Quelle und Prüfdatum
- `src/lib/crisis.js` — Krisenerkennung; `src/components/KrisenHinweis.jsx` zeigt sie unter jedem Freitextfeld
- `src/lib/useDialog.js` — Escape, Fokus-Falle und Scroll-Sperre für Dialoge
- `server.js` — Meldungs-Ablage
- `meldungen-speicher.js` — SQLite-Zugriff, Empfänger aus `rollen.js`
- `docs/Pilot-Checkliste.md` — was vor einem Pilotbetrieb zu klären ist
- `daten/meldungen.db` — abgeschickte Meldungen (nicht im Git)

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
- **Krisenerkennung läuft lokal.** Änderungen an `src/lib/crisis.js` brauchen Tests.
  Jedes neue Freitextfeld für Betroffene bekommt `<KrisenHinweis text={…} />` und
  einen Eintrag in `FREITEXTFELDER` in `tests/crisis.test.mjs`. Mit dem Chat fiel
  die Prüfung schon einmal unbemerkt weg.
- **Demo-Daten sichtbar kennzeichnen** (HR-Dashboard, Analytics, Profil).

### Technische Fallstricke in diesem Projekt
- **`AnimatePresence` nicht für Overlays und Ansichtswechsel verwenden.** Elemente
  blieben unsichtbar im DOM liegen und fingen Klicks ab; mit `mode="wait"` hing der
  Wechsel ganz. Konditional rendern, Einblend-Animation über `initial`/`animate`.
- **Der Service Worker (`public/sw.js`) legt nie `/api`-Antworten ab.** Sonst
  bleiben Meldungen im Browser-Cache liegen. Bei Änderungen `CACHE_NAME` hochzählen.
- **Der Build fängt fehlende Imports nicht** — ein nicht importiertes Icon legt die
  App zur Laufzeit lahm. Dafür gibt es `tests/imports.test.mjs`.
