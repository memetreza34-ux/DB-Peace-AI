# GitHub Actions — Troubleshooting für DB Peace AI

## Erwarteter Workflow

Der Workflow `.github/workflows/ci.yml` läuft bei Pull Requests, Pushes auf `main` und manuell über `workflow_dispatch`.

Ein normal gestarteter Job muss mindestens diese Schritte enthalten:

1. Checkout
2. Setup Node 22
3. `npm ci`
4. `npm run verify`
5. `npm test`
6. `npm run build`

## Aktuell beobachtetes Fehlerbild

Beim Audit am 7. August 2026 wurden Actions-Läufe beobachtet, bei denen der Job innerhalb weniger Sekunden als fehlgeschlagen endete, ohne einen Runner zu erhalten:

- `steps: []`
- `runner_id: 0`
- leerer Runner-Name

Damit wurde **kein Repository-Code ausgeführt**. Insbesondere liefen weder Checkout noch `npm ci`, Verifier, Tests oder Build.

Ein solcher Status darf nicht als Buildfehler interpretiert werden. Er ist aber ebenso wenig ein erfolgreicher Check.

## Zu prüfen in GitHub

Bei diesem Muster zuerst außerhalb des Codes prüfen:

- Repository → **Actions**: Sind Actions für das Repository erlaubt?
- Repository/Organisation → **Actions settings**: Darf GitHub-hosted `ubuntu-latest` verwendet werden?
- Konto/Organisation → **Billing & plans**: Gibt es ein Spending-Limit, Zahlungsproblem oder eine Actions-Sperre?
- Falls eine Organisation beteiligt ist: Richtlinien für Workflows und Third-Party-Actions prüfen.
- Prüfen, ob eine manuelle Workflow-Ausführung überhaupt einen Runner erhält.

## Nach Behebung des externen Blockers

Für den dann aktuellen finalen Branch-Head einen neuen Lauf starten und verifizieren:

- der Job besitzt einen `runner_id` ungleich `0`,
- die einzelnen Steps sind sichtbar,
- `npm ci` ist erfolgreich,
- `npm run verify` ist erfolgreich,
- `npm test` ist erfolgreich,
- `npm run build` ist erfolgreich.

Nur ein Lauf für exakt denselben finalen Commit zählt als CI-Nachweis.

## Lokale Ersatzprüfung

Bis Actions tatsächlich einen Runner startet, kann eine lokale Node-22-Umgebung die technische Prüfung ausführen:

```bash
npm ci
npm run check
```

Das Ergebnis zusammen mit Node-/npm-Version, Betriebssystem und getestetem Commit in `docs/FINAL-ACCEPTANCE.md` dokumentieren.

Ein lokaler erfolgreicher Lauf ersetzt nicht automatisch organisatorische Freigaben oder die manuelle Browser-/Barrierefreiheitsabnahme.
