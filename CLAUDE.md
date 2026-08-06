# DB Peace AI — Entwicklungs-Kontext

## Projekt

React- und Vite-Frontend mit lokalem Node.js-API-Proxy. Der KI-Begleiter nutzt die Gemini API. Das Projekt ist ein lokaler Innovations- und Demonstrationsprototyp und keine offizielle DB-Anwendung.

## Tech-Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 3, Framer Motion, Lucide
- **Backend:** Node.js `http`-Server in `server.js`
- **KI:** Gemini über `@google/genai`
- **Dokumente:** jsPDF
- **PWA:** Manifest und Service Worker

## Start

```bash
npm install
npm run dev
npm run check
```

## Umgebungsvariablen

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
API_PORT=8787
```

## Wichtige Regeln

- `.env` niemals committen.
- Keine echten personenbezogenen, medizinischen, psychologischen oder arbeitsrechtlichen Falldaten in Demo-Screenshots oder Tests verwenden.
- Simulierte Funktionen immer sichtbar als Demo kennzeichnen.
- Keine Sicherheitsbehauptung ohne technische Umsetzung: insbesondere Verschlüsselung, Anonymität, SSO, Standortübertragung und Offline-Synchronisation.
- Notfallnummern und interne Kontakte niemals erfinden.
- KI unterstützt nur; Menschen entscheiden.
- Rechtsinformationen sind allgemeine Orientierung und benötigen vor Veröffentlichung eine fachliche Prüfung.
- Kursdaten, Anerkennung, Freistellung, Zertifikate und Teilnahme niemals ohne verifizierte Quelle als offiziell darstellen.
- JavaScript beibehalten; kein TypeScript-Umbau ohne gesonderte Entscheidung.
- Neue Änderungen müssen `npm run check` bestehen.
- Vor dem Zusammenführen die Kernwege nach `docs/MANUAL-TEST-CHECKLIST.md` manuell mit synthetischen Daten prüfen.
- Draft-PR erst als prüfbereit markieren, wenn Buildstatus und manuelle Restblocker dokumentiert sind.

## Wichtige Dateien

- `src/` — React-Komponenten
- `server.js` — lokaler Gemini-Proxy
- `scripts/dev.js` — gemeinsamer Start von API und Vite
- `scripts/verify-repo.mjs` — Sicherheits- und Konsistenzprüfung
- `SECURITY.md` — Sicherheitsgrenzen
- `docs/MVP-STATUS.md` — echte, eingeschränkte und fehlende Funktionen
- `docs/MANUAL-TEST-CHECKLIST.md` — manuelle Abnahme
- `docs/Pitch-DB-Peace-AI.md` — belegbarer Innovationspitch
