# Beitragen zu DB Peace AI

## Projektgrenze

DB Peace AI ist ein nicht produktionsreifer Innovationsprototyp. Für Entwicklung, Tests, Screenshots und Reviews dürfen ausschließlich synthetische Daten verwendet werden.

## Lokale Prüfung

```bash
npm ci
npm run check
```

Unterstützt werden Node.js 22 und npm 10 oder 11. Abweichende Laufzeiten gelten als nicht geprüft.

## Änderungsregeln

- Änderungen über einen separaten Branch und Pull Request einreichen.
- Keine `.env`-Dateien, Schlüssel, realen Kontaktdaten oder internen Informationen committen.
- Keine Anonymität, Verschlüsselung, SSO-, DB-, Rechts-, Krisen- oder Anerkennungsfunktion behaupten, die nicht nachweisbar umgesetzt ist.
- Neue Funktionen benötigen mindestens einen reproduzierbaren Test oder eine dokumentierte manuelle Abnahme.
- Vor dem Merge `docs/RELEASE-CHECKLIST.md` und `docs/FINAL-ACCEPTANCE.md` verwenden.

## Commit-Stil

Kurze, sachliche Präfixe verwenden, zum Beispiel `fix:`, `test:`, `docs:`, `security:` oder `chore:`.
