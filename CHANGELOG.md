# Änderungsprotokoll

Alle wesentlichen Änderungen werden in dieser Datei dokumentiert.

## Unveröffentlicht

### Stabilisiert

- Produkt-, Sicherheits- und DB-Behauptungen an den tatsächlich implementierten Funktionsumfang angepasst
- Gemini-Proxy mit Größenlimits, Rate Limiting, 20-Sekunden-Upstream-Timeout und kontrolliertem Shutdown gehärtet
- KI-Status trennt „API-Key konfiguriert“ von einer tatsächlich erfolgreichen Gemini-Antwort
- KI-Quiz auf allgemeine Sicherheits- und Orientierungsfragen begrenzt; keine generierten konkreten Rechtsauslegungen
- Meldungsentwurf, Quiz-Fallback und Sitzungsdaten klar abgegrenzt
- lokalen PIN-Sichtschutz ohne In-App-Reset umgesetzt und Fehlversuchs-Drosselung gegen Reload-Umgehung abgesichert
- Notfall-, Kontakt-, Lern-, HR-, Projekt- und Analytics-Bereiche als Prototyp abgesichert
- Rechtsdaten vollständig auf kuratierte Paraphrasen mit amtlichen Einzelnorm-Links umgestellt; problematischen Generator entfernt
- großen synthetischen Kurskatalog durch neun vollständig fiktive Demo-Einträge ersetzt
- statisches Training von Punkt-/Prozentwertung bereinigt
- Service-Worker-Cachebereinigung auf eigene `db-peace-ai-*`-Caches begrenzt
- reduzierte Bewegung, Dialogfokus und Produktionsfehleranzeige gehärtet
- historische Backups und bestätigten unreferenzierten JavaScript-Altcode entfernt
- Repository-Verifier, Importgraph-Test, Node-Regressionstests und diagnostisch getrennten GitHub-Actions-Workflow ergänzt
- Sicherheits-, Release-, Architektur-, Audit- und Abnahmedokumentation ergänzt

### Weiterhin offen

- erfolgreicher CI- oder gleichwertiger lokaler `npm ci && npm run check`-Lauf für exakt denselben finalen Head
- manuelle Browser-, Mobil-, PDF- und Barrierefreiheitsabnahme
- reproduzierbare Bereinigung möglicherweise ungenutzter npm-Abhängigkeiten mit anschließend neu erzeugtem Lockfile
- produktive Authentifizierung, Autorisierung, Datenhaltung und organisatorische Freigaben
