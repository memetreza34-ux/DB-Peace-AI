# DB Peace AI

Lokaler Innovationsprototyp. Keine offizielle DB-Anwendung.

Eine Anlaufstelle für Auszubildende bei Mobbing, Diskriminierung und Konflikten.
Seit dem 6.9.2026 ohne KI: Krisenerkennung, Meldungs-Auswertung und
Rollenempfehlung sind feste Regeln, die lokal laufen.

## Starten

```bash
npm install
npm run dev
```

Die App ist dann unter `http://127.0.0.1:5173/` erreichbar. Abgeschickte
Meldungen landen in `daten/meldungen.db` auf diesem Rechner — unverschlüsselt,
und sie verlassen den Rechner nicht.

## Prüfen

```bash
npm run verify
```

Was vor einem Pilotbetrieb zu klären ist, steht in
[`docs/Pilot-Checkliste.md`](docs/Pilot-Checkliste.md).
