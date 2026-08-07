# DB Peace AI — Audit-Ergebnisse

Stand: 7. August 2026
Branch: `agent/mvp-stabilization`

Dieses Dokument fasst den technischen Langzeit-Audit des aktuellen Stabilisierungsbranches zusammen. Es ist kein Nachweis eines erfolgreichen Builds oder einer produktiven Freigabe.

## Behoben

- irreführende Aussagen zu SSO, Verschlüsselung, Standortübertragung, automatischer Zustellung und Zertifikaten entfernt
- lokaler Gemini-Proxy mit Größenlimits, Content-Type-Prüfung, Sicherheitsheadern, Rate Limiting, Zeitlimits und kontrolliertem Shutdown gehärtet
- Service Worker auf Produktionsbetrieb begrenzt; `/api/` wird nicht gecacht
- Chat-, Quiz- und Report-Requests gegen veraltete Antworten nach Löschen, Schließen oder Unmount abgesichert
- Sichtschutz-PIN gegen blockierte Browser-APIs und wiederholte Fehlversuche gehärtet
- Meldungsassistent, Gedächtnisprotokolle, Demo-Postfach, Kursfortschritt, Freistellungsanfrage und Ideenbereich zuverlässig zurücksetzbar gemacht
- KI- und lokale Fallback-Ergebnisse sichtbar getrennt
- PDF-Ausgaben bei längeren Inhalten paginiert und Exportfehler sichtbar behandelt
- HR-, Projekt-, Kurs- und Analytics-Bereiche als Demo beziehungsweise Szenarioannahmen gekennzeichnet
- Dialoge mit Escape, Fokusfalle, Fokus-Rückgabe und Scroll-Sperre ausgestattet
- Notrufsteuerung per Tastatur bedienbar gemacht
- reduzierte Bewegung berücksichtigt
- historische Backup-Verzeichnisse entfernt
- Repository-Verifier und Node-Regressionstests erweitert

## Automatisierte Prüflogik im Repository

`npm run check` führt aus:

1. `npm run verify`
2. `npm test`
3. `npm run build`

Die Node-Tests prüfen unter anderem Package-/Lockfile-Abgleich, lokale Importauflösung, API-Routen, PWA-Regeln, Demo-Reset, Dialogsteuerung, Request-Abbruch und Prozess-Shutdown.

## Noch nicht nachgewiesen

- erfolgreicher `npm ci`-Lauf
- erfolgreicher `npm run check`-Lauf
- erfolgreicher Vite-Produktionsbuild
- vollständige manuelle Browser-, Mobil-, PDF- und Tastaturabnahme

## GitHub-Actions-Status

Für den beim Audit geprüften Branch-Stand wurde ein GitHub-Actions-Lauf erzeugt, der jedoch keinen Runner startete: der Job enthielt keine Steps und `runner_id` blieb `0`. Damit wurde weder `npm ci` noch `npm run check` ausgeführt.

Ein solcher Lauf ist kein bestandener Test, aber auch kein nachgewiesener Code- oder Buildfehler. Vor einer Freigabe muss für den dann aktuellen Head ein echter Runner-Lauf erfolgreich abgeschlossen werden.

## Bewusst offen

Möglicherweise ungenutzte Pakete werden nicht ohne reproduzierbaren Lockfile-Neubau entfernt. `package.json` und `package-lock.json` sollen synchron bleiben, bis eine funktionierende Node-22-/npm-10-oder-11-Umgebung `npm ci`, kontrollierte Deinstallation und `npm run check` ausführen kann.

## Freigaberegel

Der PR bleibt Draft. Keine Freigabe und kein Merge, bevor für exakt denselben finalen Head:

- `npm ci` erfolgreich war,
- `npm run check` erfolgreich war,
- die manuelle Checkliste ausgefüllt wurde,
- die Ergebnisse in `docs/FINAL-ACCEPTANCE.md` dokumentiert wurden.
