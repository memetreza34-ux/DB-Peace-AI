# Änderungsprotokoll

Alle wesentlichen Änderungen werden in dieser Datei dokumentiert.

## Unveröffentlicht

### Stabilisiert

- Produkt-, Sicherheits- und DB-Behauptungen an den tatsächlich implementierten Funktionsumfang angepasst
- Gemini-Proxy mit Größenlimits, Rate Limiting, 20-Sekunden-Upstream-Timeout, lokalem AbortSignal und kontrolliertem Shutdown gehärtet
- Browser-Origin-/Cross-Site-Schutz für den lokalen API-Proxy ergänzt und POST-Routen auf echtes `application/json` begrenzt
- KI-Status trennt „API-Key konfiguriert“ von einer tatsächlich erfolgreichen Gemini-Antwort
- KI-Quiz auf `POST /api/quiz` umgestellt und auf allgemeine Sicherheits- und Orientierungsfragen begrenzt; keine generierten konkreten Rechtsauslegungen
- Meldungsentwurf, Quiz-Fallback und Sitzungsdaten klar abgegrenzt
- React-StrictMode-Lifecycle der KI-Meldungsanalyse korrigiert
- lokalen PIN-Sichtschutz ohne In-App-Reset umgesetzt, Fehlversuchs-Drosselung gegen Reload- und Tab-Umgehung abgesichert und Entsperrstatus aus Browser-Speicher entfernt
- PIN-Sperrbildschirm an die Betriebssystemoption für reduzierte Bewegung angepasst
- lokale Gefahreneinschätzung korrigiert: historische Gefahrbegriffe können eine ausdrückliche Auswahl „Keine akute Gefahr“ nicht mehr zu „akut“ hochstufen
- Gedächtnisprotokolle auf App-Ebene gehoben, damit sie während interner Navigation im Arbeitsspeicher erhalten bleiben, ohne Browser-Persistenz einzuführen
- Demo-Postfach löscht einen angefangenen Antworttext beim Wechsel des ausgewählten Falls
- Notfall-, Kontakt-, Lern-, HR-, Projekt- und Analytics-Bereiche als Prototyp abgesichert
- Rechtsdaten vollständig auf kuratierte Paraphrasen mit amtlichen Einzelnorm-Links umgestellt; problematischen Generator entfernt
- großen synthetischen Kurskatalog durch neun vollständig fiktive Demo-Einträge ersetzt
- statisches Training von Punkt-/Prozentwertung bereinigt
- Service-Worker-Cachebereinigung auf eigene `db-peace-ai-*`-Caches begrenzt und statische Assets auf echtes Network-first mit Offline-Fallback umgestellt
- Produktions-CSP verschärft; Inline-Skripte bleiben nur im lokalen Vite-Serve-Modus für React Refresh erlaubt
- reduzierte Bewegung, Dialogfokus, Umschalter-Semantik und Produktionsfehleranzeige gehärtet
- Schnell-Verlassen-Schaltfläche über die Dialogebene gehoben
- Protokoll-PDF-Export gegen Fehler abgesichert und Fehler sichtbar gemacht
- historische Backups und bestätigten unreferenzierten JavaScript-Altcode entfernt
- Repository-Verifier, Importgraph-Test und Node-Regressionstests erweitert
- GitHub-Actions-Workflow auf `actions/checkout@v7` und `actions/setup-node@v7` aktualisiert; persistente Checkout-Credentials deaktiviert
- Sicherheits-, Release-, Architektur-, Audit- und Abnahmedokumentation ergänzt

### Weiterhin offen

- erfolgreicher CI- oder gleichwertiger lokaler `npm ci && npm run check`-Lauf für exakt denselben finalen Head
- manuelle Browser-, Mobil-, PDF- und Barrierefreiheitsabnahme
- reproduzierbare Bereinigung möglicherweise ungenutzter npm-Abhängigkeiten mit anschließend neu erzeugtem Lockfile
- produktive Authentifizierung, Autorisierung, Datenhaltung und organisatorische Freigaben
