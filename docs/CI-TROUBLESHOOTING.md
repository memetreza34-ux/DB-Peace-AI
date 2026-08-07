# CI-Fehlerdiagnose

## Standardablauf

1. Den exakten PR-Head notieren.
2. Prüfen, ob ein Workflow-Lauf genau für diesen Commit existiert.
3. Jobschritte und Annotationen lesen.
4. Nur bei tatsächlich gestarteten Schritten Code- oder Buildfehler diagnostizieren.
5. Nach jeder Korrektur den neuen Head erneut prüfen.

## Aktueller externer Blocker

GitHub Actions startet den Job derzeit nicht. Die Annotation meldet fehlgeschlagene Kontozahlungen oder ein zu niedriges Spending-Limit. Dadurch wurden weder Checkout noch `npm ci`, Tests oder Build ausgeführt.

Zu prüfen:

- GitHub-Kontoeinstellungen unter **Billing & plans**
- offene oder fehlgeschlagene Zahlungen
- Actions-Spending-Limit und verfügbares Budget
- ob Actions für das private Repository aktiviert sind

Nach der Behebung den fehlgeschlagenen Lauf erneut starten oder einen neuen Commit beziehungsweise `workflow_dispatch` auslösen. Ein roter Status ohne gestartete Jobschritte ist kein nachgewiesener Codefehler.

## Erwarteter erfolgreicher Ablauf

- Checkout
- Node.js 22 einrichten
- `npm ci`
- `npm run verify`
- `npm test`
- `npm run build`

Erst ein erfolgreicher Lauf für den unveränderten finalen Head kann als CI-Nachweis gelten.
