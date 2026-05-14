# DB Peace AI

Lokaler Innovationsprototyp. Keine offizielle DB-Anwendung.

## Echten KI-Modus aktivieren

1. `.env.example` kopieren und als `.env` speichern.
2. `OPENAI_API_KEY` in `.env` eintragen.
3. Optional `OPENAI_MODEL` anpassen.
4. Abhängigkeiten installieren:

```bash
npm install
```

5. Frontend und lokalen API-Proxy starten:

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Die App ist dann unter `http://127.0.0.1:5173/` erreichbar.

Wenn kein `OPENAI_API_KEY` gesetzt ist oder die API nicht erreichbar ist, nutzt der Azubi-Begleiter automatisch lokale Demo-Antworten.
