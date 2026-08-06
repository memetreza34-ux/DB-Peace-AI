# DB Peace AI

Lokaler Innovations- und Demonstrationsprototyp für Auszubildende. Die Anwendung ist **keine offizielle Deutsche-Bahn-Anwendung** und darf ohne fachliche, rechtliche und technische Freigabe nicht mit echten Fall- oder Personendaten betrieben werden.

## Aktueller MVP-Umfang

- Hilfe- und Orientierungshilfen
- privates Gedächtnisprotokoll als Demo
- strukturierter Meldungsentwurf
- PDF-Export
- KI-Begleiter über einen lokalen Gemini-Proxy
- Lern-, Rechte- und Projektbereiche

Simulierte Funktionen sind in der Oberfläche als Demo zu kennzeichnen. Aussagen wie „verschlüsselt“, „anonym übermittelt“, „SSO“ oder „Standort gesendet“ dürfen nur verwendet werden, wenn sie technisch tatsächlich umgesetzt sind.

## Lokalen KI-Modus aktivieren

1. `.env.example` kopieren und als `.env` speichern.
2. `GEMINI_API_KEY` in `.env` eintragen.
3. Optional `GEMINI_MODEL` anpassen.
4. Abhängigkeiten installieren:

```bash
npm install
```

5. Frontend und lokalen API-Proxy starten:

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Die App ist anschließend unter `http://127.0.0.1:5173/` erreichbar. Der API-Proxy läuft standardmäßig unter `http://127.0.0.1:8787`.

Ohne `GEMINI_API_KEY` bleibt die App bedienbar. Der Chat verwendet dann ausschließlich klar gekennzeichnete lokale Orientierungstexte.

## Qualitätsprüfung

```bash
npm run check
```

Der Check prüft kritische Platzhalter und erstellt anschließend den Production-Build.

## Sicherheitsgrenzen

- Keine echten Meldungen oder personenbezogenen Daten für Präsentationen verwenden.
- `.env` niemals committen.
- Interne Kontaktdaten und Rechtsinformationen vor Veröffentlichung fachlich prüfen.
- Eine produktive Einführung benötigt mindestens Authentifizierung, Rollen, sichere Datenhaltung, Verschlüsselung, Audit-Logs, Löschfristen, Datenschutzprüfung, IT-Sicherheitsprüfung und Beteiligung der zuständigen Gremien.

Weitere Details stehen in `SECURITY.md` und `docs/MVP-STATUS.md`.
