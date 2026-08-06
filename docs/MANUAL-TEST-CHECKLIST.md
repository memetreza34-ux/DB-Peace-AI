# Manuelle Abnahmecheckliste — DB Peace AI

Stand: 6. August 2026

Diese Checkliste ergänzt `npm run check`. Ausschließlich synthetische Testdaten verwenden. Ein erfolgreicher Durchlauf bedeutet **präsentationsreif**, nicht pilot- oder produktionsreif.

## 0. Installation und Entwicklungsstart

- [ ] Node.js 22 wird verwendet.
- [ ] npm 10 oder 11 wird verwendet.
- [ ] `npm ci` läuft ohne Fehler.
- [ ] `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` startet API und Vite gemeinsam.
- [ ] Die API meldet den lokalen Port und das konfigurierte Modell.
- [ ] Ein Port- oder Startfehler beendet beide Prozesse mit verständlicher Meldung.
- [ ] Strg+C beendet API und Vite ohne hängen gebliebenen Prozess.
- [ ] `npm run check` führt Repository-Prüfung und Production-Build aus.

## 1. Start und lokale Sperre

- [ ] App öffnet ohne weißen Bildschirm oder Error Boundary.
- [ ] Beim ersten Start kann eine vierstellige PIN angelegt und bestätigt werden.
- [ ] Eine falsche PIN zeigt eine verständliche Fehlermeldung.
- [ ] PIN wird beim Eingeben nicht im Klartext angezeigt.
- [ ] Die Oberfläche erklärt, dass die PIN nur ein lokaler Sichtschutz ist.
- [ ] Nach Schließen des Tabs wird die App erneut gesperrt.
- [ ] Zurücksetzen der PIN funktioniert und löscht keine angeblich serverseitigen Daten.

## 2. Navigation und Suche

- [ ] Desktop- und mobile Navigation öffnen alle vorhandenen Bereiche.
- [ ] Zurück-zur-Übersicht führt zuverlässig auf die Startseite.
- [ ] Globale Suche lässt sich per Escape schließen.
- [ ] Suchtreffer führen zum richtigen Bereich.
- [ ] Suche behauptet keine offizielle Meldung, Übermittlung oder Kontaktaufnahme.
- [ ] Fokus bleibt im geöffneten Suchdialog.

## 3. Notfall und Kontakte

- [ ] Notfallmodal zeigt 110 und 112 korrekt.
- [ ] Vor einem Anruf erfolgt eine klare Bestätigung.
- [ ] Oberfläche erklärt, dass kein Standort übertragen wird.
- [ ] Kontaktseite enthält keine erfundene interne DB-Telefonnummer.
- [ ] 116 123, 116 016 und 0800 546 546 5 werden korrekt angezeigt.
- [ ] Links zu offiziellen externen Anbieterseiten öffnen in einem neuen Tab.
- [ ] Interne Stellen werden nur als Suchwege beschrieben.

## 4. KI-Begleiter

### Mit `GEMINI_API_KEY`

- [ ] `/api/chat/status` meldet eine eingerichtete Verbindung.
- [ ] Chat sendet eine kurze synthetische Testnachricht erfolgreich.
- [ ] Antwort enthält keine angebliche offizielle DB-Entscheidung.
- [ ] Chat fordert keine Personalnummer oder unnötige Klarnamen an.
- [ ] Verlauf wird nach Neuladen nicht dauerhaft wiederhergestellt.

### Ohne `GEMINI_API_KEY`

- [ ] Chat bleibt bedienbar oder zeigt einen verständlichen lokalen Fallback.
- [ ] Fallback wird sichtbar als lokal gekennzeichnet.
- [ ] Keine Fehlermeldung behauptet eine erfolgreiche KI-Verbindung.

## 5. Meldungsentwurf

- [ ] Alle fünf Schritte sind per Tastatur und Maus bedienbar.
- [ ] Pflichtfelder verhindern einen leeren Abschluss.
- [ ] Es werden keine echten Namen, Personalnummern oder Anhänge verlangt.
- [ ] Lokale Dringlichkeit ist als Orientierung und nicht als Entscheidung gekennzeichnet.
- [ ] KI-Strukturierung funktioniert mit Key.
- [ ] Lokaler Fallback funktioniert ohne Key.
- [ ] Vorschau kann kopiert werden.
- [ ] PDF wird erzeugt und ist als Entwurf gekennzeichnet.
- [ ] Nirgends wird eine automatische Übermittlung behauptet.

## 6. Protokolle und Stimmung

- [ ] Synthetischer Protokolleintrag kann angelegt werden.
- [ ] Eintrag kann exportiert und gelöscht werden.
- [ ] Nach Seitenneuladen ist der Sitzungsentwurf entfernt.
- [ ] Stimmungseintrag kann hinzugefügt und gelöscht werden.
- [ ] Oberfläche verspricht keine Verschlüsselung oder Cloud-Speicherung.

## 7. Rechte und Hilfeorientierung

- [ ] Gesetzeslinks öffnen die vorgesehenen offiziellen Seiten.
- [ ] Inhalte enthalten Hinweise auf Ausnahmen und Einzelfallprüfung.
- [ ] Keine absolute Vertraulichkeits- oder Rechtsgarantie wird angezeigt.
- [ ] Berufsschule, Arbeitszeit und Ausbildungsaufgaben werden nicht pauschal oder falsch dargestellt.

## 8. Lernen, Quiz und Szenario-Übung

- [ ] Kurskatalog ist sichtbar als ungeprüfter Demo-Datensatz gekennzeichnet.
- [ ] Details erzeugen kein offizielles Zertifikat.
- [ ] PDF-Lernnotiz nennt sich nicht Teilnahmebescheinigung.
- [ ] Freistellungsvorlage verlangt eine Prüfung von Anerkennung und Fristen.
- [ ] Quiz lädt mit Key Fragen über `/api/quiz`.
- [ ] Quiz nutzt ohne Key ein sichtbar gekennzeichnetes lokales Fragenset.
- [ ] Szenario-Training nennt sich nicht KI-Training.
- [ ] Szenario-Ergebnis erklärt die statische Bewertungslogik.
- [ ] Es werden keine Punkte, Badges oder Zertifikate vergeben.

## 9. Demo-Bereiche

- [ ] HR-Dashboard zeigt dauerhaft einen Mock-/Demo-Hinweis.
- [ ] Demo-Zugang wird nicht als Azure- oder DB-SSO bezeichnet.
- [ ] Postfach enthält nur erfundene Fälle.
- [ ] Analytics bezeichnet alle Werte als fiktiv oder frei veränderbar.
- [ ] Projektideen werden nicht als veröffentlicht oder versendet dargestellt.
- [ ] Eigene Projektidee verschwindet beim Neuladen.

## 10. PWA, Offline und Sicherheit

- [ ] Manifest und App-Icon werden ohne 404 geladen.
- [ ] Service Worker installiert sich ohne Fehler.
- [ ] Offline-Hinweis verspricht keine spätere Synchronisation.
- [ ] Requests unter `/api/` werden nicht im Cache gespeichert.
- [ ] Browser-Konsole enthält keine ungefangenen Fehler im Kernweg.
- [ ] `.env` und API-Schlüssel sind nicht im Repository oder Build enthalten.

## 11. Responsive und barrierearme Bedienung

Mindestens prüfen bei 360 px, 768 px und 1280 px Breite:

- [ ] keine horizontale Überlagerung im Kernweg
- [ ] Buttons und Formularfelder bleiben erreichbar
- [ ] Dialoge sind scrollbar und besitzen beschreibende Labels
- [ ] Tastaturfokus ist sichtbar
- [ ] Texte bleiben bei 200 % Browser-Zoom nutzbar
- [ ] Hell- und Dunkelmodus haben ausreichende Lesbarkeit

## 12. Abschlussprotokoll

- getesteter Commit: `[SHA]`
- Node/npm: `[Versionen]`
- Browser und Version: `[Angabe]`
- Betriebssystem: `[Angabe]`
- Testdatum: `[Datum]`
- testende Person: `[Name/Rolle]`
- `npm run check`: `[erfolgreich/fehlgeschlagen]`
- GitHub Actions: `[erfolgreich/fehlgeschlagen/ausstehend]`
- offene Blocker: `[Liste]`
- Entscheidung: `[Draft behalten / bereit zur Prüfung / nicht zusammenführen]`
