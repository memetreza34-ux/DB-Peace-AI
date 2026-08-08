# Manuelle Abnahmecheckliste — DB Peace AI

Stand: 8. August 2026

Diese Checkliste ergänzt `npm run check`. Ausschließlich synthetische Testdaten verwenden. Ein erfolgreicher Durchlauf bedeutet **präsentationsreif**, nicht pilot- oder produktionsreif.

## 0. Installation und Entwicklungsstart

- [ ] Node.js 22 wird verwendet.
- [ ] npm 10 oder 11 wird verwendet.
- [ ] `npm ci` läuft ohne Fehler.
- [ ] `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` startet API und Vite gemeinsam.
- [ ] React Refresh funktioniert im lokalen Vite-Devserver ohne CSP-Blank-Screen.
- [ ] `npm run preview` startet den Production-Build über Vites Preview-Port 4173, ohne dass der lokale API-Origin-Schutz legitime Requests blockiert.
- [ ] Die API meldet den lokalen Port und das konfigurierte Modell.
- [ ] Ein Port- oder Startfehler beendet beide Prozesse mit verständlicher Meldung.
- [ ] Strg+C beendet API und Vite ohne hängen gebliebenen Prozess.
- [ ] `npm run check` führt Verifier, Node-Regressionstests und Production-Build nacheinander aus.

## 1. Start und lokale Sperre

- [ ] App öffnet ohne weißen Bildschirm oder Error Boundary.
- [ ] Beim ersten Start kann eine vierstellige PIN angelegt und bestätigt werden.
- [ ] Eine falsche PIN zeigt eine verständliche Fehlermeldung.
- [ ] PIN wird beim Eingeben nicht im Klartext angezeigt.
- [ ] Die Oberfläche erklärt, dass die PIN nur ein lokaler Sichtschutz ist.
- [ ] Nach einem Seitenneuladen wird die App erneut gesperrt.
- [ ] Ein neu geöffneter oder duplizierter Tab übernimmt keinen gespeicherten Entsperrstatus.
- [ ] Nach Schließen und erneutem Öffnen wird die App erneut gesperrt.
- [ ] Nach fünf Fehlversuchen wird die Eingabe kurz gesperrt.
- [ ] Ein Neuladen während der Sperrzeit hebt die Fehlversuchs-Pause nicht auf.
- [ ] Während einer aktiven Fehlversuchs-Pause zeigt auch ein weiterer Tab derselben App die Sperre; ein neuer Tab setzt Versuchszähler oder Sperrzeit nicht zurück.
- [ ] Fehlversuche in zwei parallel geöffneten Tabs werden auf denselben tabübergreifenden Drosselungszustand angerechnet.
- [ ] Mit aktivierter Betriebssystemoption „Bewegung reduzieren“ erscheint der PIN-Sperrbildschirm ohne Einblend-/Verschiebungsanimation.
- [ ] Auf dem Sperrbildschirm existiert kein Knopf, der die eingerichtete PIN ohne Kenntnis der alten PIN löscht.
- [ ] Bei vergessener PIN verweist die Oberfläche nur auf das manuelle Löschen der Website-Daten im Browser.

## 2. Navigation und Suche

- [ ] Desktop- und mobile Navigation öffnen alle vorhandenen Bereiche.
- [ ] Zurück-zur-Übersicht führt zuverlässig auf die Startseite.
- [ ] Globale Suche lässt sich per Escape schließen.
- [ ] Suchtreffer führen zum richtigen Bereich.
- [ ] Suche behauptet keine offizielle Meldung, Übermittlung oder Kontaktaufnahme.
- [ ] Fokus bleibt im geöffneten Suchdialog und kehrt nach Schließen zum Auslöser zurück.

## 3. Notfall und Kontakte

- [ ] Notfallmodal zeigt 110 und 112 korrekt.
- [ ] Vor einem Anruf erfolgt eine klare Bestätigung.
- [ ] Notrufsteuerung ist auch per Tastatur bedienbar.
- [ ] Oberfläche erklärt, dass kein Standort übertragen wird.
- [ ] „Schnell verlassen“ bleibt auch über geöffneten Dialogen sichtbar und per Zeiger anklickbar.
- [ ] Kontaktseite enthält keine erfundene interne DB-Telefonnummer.
- [ ] 116 123, 116 016 und 0800 546 546 5 werden korrekt angezeigt.
- [ ] Links zu offiziellen externen Anbieterseiten öffnen in einem neuen Tab.
- [ ] Interne Stellen werden nur als Suchwege beschrieben.

## 4. KI-Begleiter

### Mit `GEMINI_API_KEY`

- [ ] `/api/chat/status` meldet nur `configured: true` und behauptet noch keine erfolgreiche Verbindung.
- [ ] Chat zeigt zunächst sinngemäß „Gemini konfiguriert · Verbindung noch nicht geprüft“.
- [ ] Chat sendet eine kurze synthetische Testnachricht erfolgreich.
- [ ] Erst nach einer erfolgreichen Modellantwort zeigt der Chat sinngemäß „Gemini-Antwort erhalten“.
- [ ] Antwort enthält keine angebliche offizielle DB-Entscheidung.
- [ ] Chat fordert keine Personalnummer oder unnötige Klarnamen an.
- [ ] Verlauf wird nach Neuladen nicht dauerhaft wiederhergestellt.
- [ ] Ein künstlich nicht erreichbarer Upstream endet kontrolliert statt unbegrenzt zu warten.
- [ ] Der lokale Gemini-SDK-Request erhält beim Timeout ein AbortSignal; ein Client-Abbruch wird als kontrollierter 504-Upstream-Timeout behandelt.
- [ ] Oberfläche und Dokumentation behaupten nicht, dass der lokale Abort eine bereits laufende Verarbeitung beim externen Dienst garantiert beendet.

### Ohne `GEMINI_API_KEY`

- [ ] `/api/chat/status` meldet `configured: false`.
- [ ] Chat bleibt bedienbar oder zeigt einen verständlichen lokalen Fallback.
- [ ] Fallback wird sichtbar als lokal gekennzeichnet.
- [ ] Keine Fehlermeldung behauptet eine erfolgreiche KI-Verbindung.

## 5. Meldungsentwurf

- [ ] Alle fünf Schritte sind per Tastatur und Maus bedienbar.
- [ ] Pflichtfelder verhindern einen leeren Abschluss.
- [ ] Es werden keine echten Namen, Personalnummern oder Anhänge verlangt.
- [ ] Lokale Dringlichkeit ist als Orientierung und nicht als Entscheidung gekennzeichnet.
- [ ] Bei bewusst ausgewählter „Keine akute Gefahr“ führt ein historischer Begriff wie „Messer“ oder „Gewalt“ im Sachverhalt nicht zu „akut“.
- [ ] Nur die bewusste Auswahl „Direkte Gefahr“ erzeugt die akute Orientierung mit sofortigem Hilfehinweis.
- [ ] KI-Strukturierung funktioniert mit Key.
- [ ] KI-Strukturierung funktioniert im Vite-Entwicklungsmodus mit React StrictMode und bleibt nicht dauerhaft im Ladezustand hängen.
- [ ] Lokaler Fallback funktioniert ohne Key.
- [ ] Gemini-Entwurf und lokaler Fallback sind im Protokoll korrekt unterscheidbar.
- [ ] „Neu starten“ erzeugt eine neue Entwurfsnummer und einen neuen Erstellzeitpunkt.
- [ ] Vorschau kann kopiert werden.
- [ ] PDF wird erzeugt und ist als Entwurf gekennzeichnet.
- [ ] Nirgends wird eine automatische Übermittlung behauptet.

## 6. Protokolle und Stimmung

- [ ] Synthetischer Protokolleintrag kann angelegt werden.
- [ ] Nach dem Anlegen zu Startseite, Sammlung oder einem anderen App-Bereich wechseln und anschließend zurückkehren: Der Protokolleintrag ist weiterhin vorhanden.
- [ ] Eintrag kann exportiert und gelöscht werden.
- [ ] Protokoll-Detaildialog hält den Tastaturfokus im Dialog und gibt ihn nach dem Schließen an den Auslöser zurück.
- [ ] Nach Seitenneuladen ist der Sitzungsentwurf entfernt.
- [ ] Protokolle werden nicht in `localStorage`, `sessionStorage` oder IndexedDB wiederhergestellt.
- [ ] Stimmungseintrag kann hinzugefügt und gelöscht werden.
- [ ] Blockierter Sitzungsspeicher lässt die Stimmungskomponente nicht abstürzen.
- [ ] Oberfläche verspricht keine Verschlüsselung oder Cloud-Speicherung.

## 7. Rechte und Hilfeorientierung

- [ ] Rechtsbereich enthält keine angeblichen internen DB-Richtlinien.
- [ ] Jede Rechtskarte besitzt einen Link zu einer amtlichen Einzelnorm auf `gesetze-im-internet.de`.
- [ ] Karten bezeichnen die dargestellte Kernaussage als Paraphrase und nicht als amtliches Vollzitat.
- [ ] Inhalte enthalten Hinweise auf Ausnahmen und Einzelfallprüfung.
- [ ] Keine bestimmte Sanktion wird als automatisch oder gesetzlich zwingend dargestellt.
- [ ] Die App behauptet nicht, selbst eine AGG- oder andere offizielle Beschwerde einzureichen.
- [ ] Keine absolute Vertraulichkeits- oder Rechtsgarantie wird angezeigt.
- [ ] Berufsschule, Arbeitszeit und Ausbildungsaufgaben werden nicht pauschal oder falsch dargestellt.

## 8. Lernen, Quiz und Szenario-Übung

- [ ] Lernkatalog enthält genau die vorgesehenen kleinen fiktiven Demo-Kategorien.
- [ ] Jeder Kataloganbieter ist sichtbar fiktiv; kein erfundener Kurs wird einer realen Organisation zugeordnet.
- [ ] Präsenz-Demo-Kategorie zeigt ihre Einträge und ist nicht wegen eines falschen Datenschlüssels leer.
- [ ] Details erzeugen kein offizielles Zertifikat.
- [ ] PDF-Lernnotiz nennt sich nicht Teilnahmebescheinigung.
- [ ] Freistellungsvorlage verlangt eine Prüfung von Anerkennung und Fristen.
- [ ] Quiz lädt mit Key Fragen per `POST /api/quiz` mit `application/json`.
- [ ] KI-Quiz erzeugt nur allgemeine Sicherheits-/Orientierungsfragen und keine konkrete Rechtsauslegung.
- [ ] Quiz nutzt ohne Key ein sichtbar gekennzeichnetes lokales Fragenset.
- [ ] Kursdetail-Umschalter werden als gedrückte Umschaltbuttons und nicht als unvollständiges ARIA-Tab-Widget angekündigt.
- [ ] Szenario-Training nennt sich nicht KI-Training.
- [ ] Szenario-Ergebnis erklärt die statische Bewertungslogik.
- [ ] Es werden keine Punkte, Prozentwerte, Badges oder Zertifikate vergeben.

## 9. Demo-Bereiche

- [ ] HR-Dashboard zeigt dauerhaft einen Mock-/Demo-Hinweis.
- [ ] Demo-Zugang wird nicht als Azure- oder DB-SSO bezeichnet.
- [ ] Postfach enthält nur erfundene Fälle.
- [ ] Im Profil-Demo-Postfach einen Antworttext für Fall A beginnen und vor dem Senden zu Fall B wechseln: Das Eingabefeld wird geleert und der Text kann nicht versehentlich Fall B zugeordnet werden.
- [ ] Demo-Postfach lässt sich wirklich auf den ursprünglichen Beispieldatensatz zurücksetzen.
- [ ] Profil- und HR-Ansichtsumschalter werden als Umschaltbuttons und nicht als unvollständige ARIA-Tabs angekündigt.
- [ ] Analytics bezeichnet alle Werte als fiktive Szenarioannahmen oder frei veränderbar.
- [ ] Projektideen werden nicht als veröffentlicht oder versendet dargestellt.
- [ ] Eigene Projektidee verschwindet beim Neuladen.

## 10. PWA, Offline und Sicherheit

- [ ] Manifest und App-Icon werden ohne 404 geladen.
- [ ] Service Worker installiert sich nur im Production-Build ohne Fehler.
- [ ] Offline-Hinweis verspricht keine spätere Synchronisation.
- [ ] Requests unter `/api/` werden nicht im Cache gespeichert.
- [ ] Beim Aktivieren werden nur alte Caches mit Präfix `db-peace-ai-` gelöscht.
- [ ] Mit Netzwerkverbindung liefert der Service Worker frische statische Assets sofort aus und nutzt den Cache nur als Offline-Fallback.
- [ ] Entwicklungsmodus entfernt alte DB-Peace-Service-Worker-/Cache-Reste, ohne fremde Cache-Namen zu löschen.
- [ ] Fremde Browser-Origin- oder `Sec-Fetch-Site: cross-site`-Anfragen an den lokalen API-Proxy werden mit 403 abgewiesen.
- [ ] `POST /api/chat`, `/api/report/extract` und `/api/quiz` akzeptieren nur echtes `application/json`; z. B. `application/jsonp` wird abgewiesen.
- [ ] Produktions-CSP erlaubt keine Inline-Skripte und keine ungenutzten Google-Font-Ursprünge.
- [ ] Nur der lokale Vite-Serve-Modus lockert `script-src` für den React-Refresh-Preamble; der Production-Build bleibt streng.
- [ ] Browser-Konsole enthält keine ungefangenen Fehler im Kernweg.
- [ ] Produktionsfehleransicht zeigt keine rohe interne Exception; technische Details erscheinen nur im Entwicklungsmodus.
- [ ] `.env` und API-Schlüssel sind nicht im Repository oder Build enthalten.

## 11. Responsive und barrierearme Bedienung

Mindestens prüfen bei 360 px, 768 px und 1280 px Breite:

- [ ] keine horizontale Überlagerung im Kernweg
- [ ] Buttons und Formularfelder bleiben erreichbar
- [ ] Dialoge sind scrollbar und besitzen beschreibende Labels
- [ ] Escape, Fokusfalle und Fokus-Rückgabe funktionieren in kritischen Dialogen
- [ ] Tastaturfokus ist sichtbar
- [ ] Texte bleiben bei 200 % Browser-Zoom nutzbar
- [ ] Hell- und Dunkelmodus haben ausreichende Lesbarkeit
- [ ] Mit aktivierter Betriebssystemoption „Bewegung reduzieren“ entfallen zentrale Seiten-/Chat-/PIN-Bewegungen.

## 12. CI- und Workflow-Prüfung

- [ ] Workflow verwendet `actions/checkout@v7` mit `persist-credentials: false`.
- [ ] Workflow verwendet `actions/setup-node@v7` und Node.js 22.
- [ ] Workflow besitzt minimale `contents: read`-Berechtigung, Concurrency-Abbruch und ein 10-Minuten-Joblimit.
- [ ] GitHub Actions startet tatsächlich einen Runner; ein Lauf mit `steps: []` und `runner_id: 0` zählt nicht als technischer Test.

## 13. Abschlussprotokoll

- getesteter Commit: `[SHA]`
- Node/npm: `[Versionen]`
- Browser und Version: `[Angabe]`
- Betriebssystem: `[Angabe]`
- Testdatum: `[Datum]`
- testende Person: `[Name/Rolle]`
- `npm run check`: `[erfolgreich/fehlgeschlagen]`
- GitHub Actions: `[erfolgreich/fehlgeschlagen/ausstehend/externer Runner-Blocker]`
- offene Blocker: `[Liste]`
- Entscheidung: `[Draft behalten / bereit zur Prüfung / nicht zusammenführen]`
