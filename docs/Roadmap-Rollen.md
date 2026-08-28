# Plan bis zur Vorführung — Rollen und fehlende Funktionen

Arbeitsgrundlage, kein Verkaufsdokument. Erstellt am 26.08.2026.

Ziel: ein vollständig durchklickbarer Prototyp, in dem jede beteiligte Rolle ihre
eigene Sicht hat. Ohne Server, ohne echte Zustellung, ohne erfundene Zusagen —
so wie der Rest der App es schon hält.

Zeitrahmen: 8 bis 10 Wochen.

---

## 1. Die drei Grundregeln

Alles Weitere folgt daraus. Wer eine davon bricht, macht die App wertlos.

**1.1 Getrennte Postfächer.** JAV, Betriebsrat und HR sehen einander nicht. Wer
sich an die JAV wendet, taucht in keiner HR-Ansicht auf — auch nicht als Zahl.
Genau davor haben Azubis Angst, und genau daran scheitert die App sonst im
Gespräch mit dem Betriebsrat.

**1.2 Weiterleiten nur mit Zustimmung.** Keine Rolle darf einen Fall an eine
andere Stelle weitergeben, ohne dass die betroffene Person zustimmt. Die App
fragt das aktiv ab und protokolliert die Antwort sichtbar für beide Seiten.
Ausnahme: akute Gefahr — dann zeigt die App, dass sie den Notruf empfiehlt, und
handelt trotzdem nicht selbst.

**1.3 Anonymität hat eine Untergrenze.** Statistiken erst ab fünf Fällen je
Auswertung. „2 Meldungen im Werk Cottbus" ist keine Statistik, das ist ein Name.

---

## 2. Rollenmodell

Vierzehn Rollen in fünf Gruppen. Eine Person kann mehrere davon haben. Die Gruppe entscheidet über die Rechte, nicht die
einzelne Rolle — das hält die Logik klein.

| Gruppe | Rollen | Zweck |
|---|---|---|
| **Betroffene** | Azubi / Nachwuchskraft | erleben, festhalten, sich wenden an |
| **Vertrauensrollen** | JAV, Betriebsrat, SBV, Gleichstellungsbeauftragte, Vertrauensleute | zuhören, beraten, begleiten |
| **Ausbildung** | AFK (Ausbildungsfachkraft), NGK (Nachwuchskräfte-Betreuung), Ausbildungsleitung | im Alltag lösen |
| **Formale Stellen** | HR-Partner, Compliance / Meldestelle | formal bearbeiten, Fristen einhalten |
| **Pflege** | Standort-Betreuung | Kontaktdaten aktuell halten |

### Rechte-Matrix

| | Betroffene | Vertrauensrollen | Ausbildung | Formale Stellen | Pflege |
|---|---|---|---|---|---|
| Eigenes Protokoll führen | ja | – | – | – | – |
| Meldung verfassen | ja | – | – | – | – |
| Empfänger wählen | ja | – | – | – | – |
| An sie gerichtete Fälle sehen | eigene | ja | ja | ja | **nein** |
| Fälle anderer Rollen sehen | nein | **nein** | **nein** | **nein** | nein |
| Anonym zurückschreiben | ja | ja | ja | ja | – |
| Fall weiterleiten | – | nur mit Zustimmung | nur mit Zustimmung | nur mit Zustimmung | – |
| Klarnamen sehen | – | nur wenn freigegeben | nur wenn freigegeben | nur wenn freigegeben | – |
| Statistik (ab 5 Fällen) | – | eigener Bereich | eigener Bereich | eigener Bereich | – |
| Fristen und Status setzen | – | nein | nein | **ja** | – |
| Kontaktdaten pflegen | – | – | – | – | **ja** |

### Was jede Rolle in ihrem Postfach sieht

- **JAV** — Fälle von Azubis, Schwerpunkt Ausbildungsqualität, Arbeitszeit,
  Übernahme, Umgangston. Hinweis auf JArbSchG bei Minderjährigen.
- **Betriebsrat** — Fälle aller Beschäftigten, Schwerpunkt Mitbestimmung,
  Arbeitsbedingungen, Konflikte mit Führungskräften.
- **SBV** — Fälle mit Bezug zu Behinderung, Nachteilsausgleich, Barrierefreiheit.
- **Gleichstellungsbeauftragte** — Diskriminierung nach AGG-Merkmalen, sexuelle
  Belästigung, Benachteiligung.
- **Vertrauensleute** — niedrigschwellige Ansprache, kein Fallmanagement, nur
  Gespräch und Weiterverweis.
- **AFK / NGK** — Alltagskonflikte in der Ausbildung, Terminvorschlag,
  Vier-Augen-Gespräch anbieten.
- **Ausbildungsleitung** — eskalierte Ausbildungsfälle, Standortübersicht
  (nur aggregiert, ab fünf Fällen).
- **HR-Partner** — formale Vorgänge mit Status und Frist.
- **Compliance** — Verdacht auf Regelverstoß, Fristenlauf nach HinSchG,
  strikte Trennung von den Beratungsfällen.

---

## 3. Was heute fehlt — Phase für Phase

### Phase 0 — erledigt am 26.08.2026

- [x] **Falsches Versprechen entfernt.** Der Melde-Assistent behauptete, Daten
      kämen „automatisch aus deinem DB-Profil". Es gibt kein DB-Profil. Die drei
      Stellen sagen jetzt, was wirklich passiert: Die App bereitet einen Entwurf
      vor, weitergegeben wird er von Hand.
- [x] **Schritt 5 hat jetzt Wirkung.** Gewählter Empfänger und die Entscheidung
      für oder gegen Anonymität landeten bisher nirgends — weder im Entwurf noch
      im PDF. Beides steht jetzt drin.
- [x] **Protokoll bleibt erhalten.** Einträge liegen in `src/lib/protokoll.js`
      im Gerätespeicher. Fotos werden verkleinert und überstehen den Neustart;
      andere Dateien behalten nur ihren Namen, und die App sagt das auch.
- [x] **Löschen ist möglich.** Einzeln und alles auf einmal — Voraussetzung
      dafür, überhaupt dauerhaft speichern zu dürfen.
- [x] **Ehrliche Kennzeichnung.** Statt „Anonym gesichert" steht dort jetzt
      „Nur auf diesem Gerät", mit Hinweis, dass der Speicher nicht
      verschlüsselt ist.
- [x] **Toter Code aufgelöst.** `AzubiRightsCheck.jsx` war nirgends eingebunden.
      Statt zu löschen: überarbeitet (Dark Mode, Paragrafenangaben, kein
      `AnimatePresence`) und der Rechte-Ansicht vorangestellt.
- [x] **Leere Startseite behoben.** Wurde die Startseite aufgebaut, während der
      Tab im Hintergrund lag, blieben alle Kacheln unsichtbar — der Browser
      pausiert JS-Animationen, und framer-motion ließ `opacity: 0` stehen. Genau
      der Fall, wenn man die App vor einer Vorführung öffnet und erst später
      hinschaltet. Das Einblenden läuft jetzt über CSS.
- [x] Tests ergänzt (`tests/protokoll.test.mjs`), `npm run verify` grün.

### Phase 1 — erledigt am 26.08.2026

- [x] `src/config/rollen.js` — zwölf Rollen in fünf Gruppen, mit Beschreibung,
      Rechtsgrundlage und Zuständigkeitsthemen. Wo die Grundlage nicht belegt
      ist (Gleichstellung, Vertrauensleute, HR), steht das ausdrücklich als
      offener Punkt statt einer erfundenen Angabe.
- [x] `src/lib/rolle.js` — die eine Stelle, die entscheidet, wer was sieht.
      Grundhaltung: im Zweifel nichts. Unbekannte Rolle sieht nichts, ein Fall
      ohne Empfänger erreicht niemanden.
- [x] **Die Trennung ist getestet, nicht behauptet** (`tests/rollen.test.mjs`):
      HR sieht keinen JAV-Fall, Compliance und Beratung bleiben getrennt, nur
      formale Stellen dürfen Fristen setzen, Weitergeben nur mit Zustimmung.
- [x] **Rollenwechsel ohne vorgetäuschte Anmeldung.** `RollenWechsel.jsx` sagt
      offen, dass nicht geprüft wird, sondern die Perspektive wechselt.
      Erreichbar unten im Footer und aus jedem Postfach heraus.
- [x] **`RollenPostfach.jsx` ersetzt das HR-Dashboard.** Eine Ansicht für alle
      Rollen. Die Fälle kommen ausschließlich über `sichtbareFaelle()` — die
      Komponente bekommt nie eine Gesamtliste zu sehen.
- [x] **19 erfundene Beispielfälle** (`src/data/demoFaelle.js`) für alle zehn
      Postfach-Rollen, angelehnt an eine gewerblich-technische Ausbildung.
- [x] **Die Sammlung des Azubis zeigt dieselben Fälle von der anderen Seite** —
      mit der Angabe, an welche Stelle sie gingen.
- [x] Alter Code entfernt: `HRDashboard.jsx`, `SSOLoginModal.jsx`,
      `mockTickets.js`.

### Rollenspezifische Funktionen — erledigt am 26.08.2026

Vier Rollen haben ein eigenes Profil bekommen, die übrigen behalten das
Grundpostfach. Was eine Rolle kann, steht in `src/config/aktionen.js`.

| Rolle | Eigene Funktionen |
|---|---|
| JAV | Sprechstunde anbieten, Begleitung anbieten, beim Betriebsrat einbringen |
| Gesamt-/Konzern-JAV | Sprechstunde anbieten, örtliche JAV einbeziehen (nur mit Zustimmung) |
| Betriebsrat | Beschwerde formal aufnehmen (§ 85), fürs Monatsgespräch vormerken (§ 74) |
| SBV | Nachteilsausgleich prüfen, Beteiligung einfordern (§ 178 SGB IX) |
| Gleichstellung | Weg gemeinsam wählen, über die AGG-Frist informieren |
| AFK | Vier-Augen-Gespräch vorschlagen, Bezug zum Ausbildungsplan |
| NGK | Beratung vermitteln, in zwei Wochen nachfragen |
| Ausbildungsleitung | Gespräch am Standort ansetzen, Maßnahme für den Standort |
| HR | Eingang bestätigen, Maßnahme vermerken |
| Compliance | Eingang bestätigen, anonyme Rückfrage |
| Vertrauensleute | **bewusst keine** — wer nur reden will, löst keinen Vorgang aus |

**Zur JAV im Besonderen:** Sie kann gegenüber dem Arbeitgeber nichts selbst
durchsetzen, sondern beantragt Maßnahmen beim Betriebsrat (§ 70 Abs. 1 Nr. 1
BetrVG). Ohne diesen Weg sähe die App so aus, als hätte die JAV Rechte, die sie
nicht hat — das fällt jedem JAV-Mitglied sofort auf. Die Aktion „Beim
Betriebsrat einbringen" braucht die Zustimmung der betroffenen Person, und ein
Hinweis im Postfach erklärt den Weg.

Dazu quer über alle Rollen:

- [x] **Rechtshinweise, die von selbst auftauchen** (`src/lib/hinweise.js`):
      JArbSchG bei Minderjährigen, § 85 BetrVG beim Betriebsrat, § 178 SGB IX
      bei der SBV, AGG-Frist bei Diskriminierung und Belästigung. Jeder Hinweis
      nennt seine Grundlage und sagt dazu, dass er keine Rechtsberatung ist.
- [x] **Fristenlauf** (`src/lib/fristen.js`) für HR und Compliance, mit
      Paragraf an jeder Frist. Überfällige Fristen sind rot. Die Werte gehören
      vor dem Pilot bestätigt — steht in der Pilot-Checkliste.
- [x] **Musterkennung mit Anonymitätsschwelle** (`src/lib/muster.js`): Erst ab
      fünf gleichartigen Fällen erscheint eine Auswertung. Darunter zeigt die
      App die Begründung statt der Zahl — in der Demo ist genau das zu sehen.
- [x] Fristen, die nicht zum Fall passen, bleiben weg (keine AGG-Frist bei
      einem Arbeitszeitverstoß).
- [x] 13 zusätzliche Tests (`tests/rollenfunktionen.test.mjs`).

### Mehrfachrollen und Befangenheit — erledigt am 26.08.2026

Der Einwand, der das nötig machte: **JAV-Mitglieder sind selbst Auszubildende.**
Das Modell behandelte „Azubi" und „JAV" bis dahin, als wären das verschiedene
Menschen.

- [x] **Eine Person, mehrere Rollen** (`MEINE_ROLLEN` in `rollen.js`). Der
      Wechsel heißt jetzt „Meine Rollen" und zeigt, welcher Hut gerade aufliegt.
      Fremde Rollen bleiben ausdrücklich als Vorschau gekennzeichnet.
- [x] **Der eigene Vorgang wird ausgeblendet, mit Erklärung.** Wer selbst an
      sein Gremium meldet, findet den Fall dort nicht — die App sagt, dass einer
      fehlt und warum.
- [x] **Ein Fall über die eigene Person verschwindet spurlos.** Kein Hinweis,
      keine Zahl, kein Zähler. Ein „ein Vorgang wird dir nicht angezeigt" würde
      der betroffenen Person verraten, dass jemand sie gemeldet hat — und damit
      die Meldung selbst. Dafür gibt es einen eigenen Test.
- [x] **Ausweichstufe über dem Standort**: Gesamt-JAV (§ 72 BetrVG) und
      Konzern-JAV (§ 73a BetrVG) sind im Melde-Assistenten wählbar, mit dem
      Hinweis, dass das keine Eskalation ist. An kleinen Standorten der
      Unterschied zwischen melden und schweigen.
- [x] Die Empfängerliste im Melde-Assistenten kommt jetzt aus `rollen.js`
      statt aus einer fest verdrahteten Liste, die davon abwich.
- [x] 8 zusätzliche Tests (`tests/befangenheit.test.mjs`).

Offen geblieben: Die App benennt nicht, **wer** einen befangenen Fall
stattdessen bearbeitet. Dafür bräuchte sie mehrere Personen je Gremium.

### Phase 2 — Postfächer je Rolle — weitgehend erledigt am 26.08.2026

- [x] `src/data/demoFaelle.js` ersetzt `mockTickets.js`.
- [x] Die Trennung technisch erzwungen: Das Postfach bekommt nie eine
      Gesamtliste, nur das Ergebnis von `sichtbareFaelle()`.
- [x] Rückkanal: anonym antworten.
- [x] Tests dafür, dass keine Rolle fremde Fälle sieht.
- [x] **Weitergabe an eine andere Stelle** — mit Zielauswahl, Rückfrage nach der
      Zustimmung und einem Vermerk, den beide Seiten sehen. Der Fall verlässt
      das eine Postfach und liegt danach im anderen (`src/lib/faelle.js`).

### Phase 3 — Standort — erledigt am 26.08.2026

- [x] `src/config/standorte.js` mit der Struktur für JAV, BR, SBV, AFK, NGK und
      Ausbildungsleitung je Standort.
- [x] Standortauswahl unter „Ansprechpartner & Meldewege", bleibt gespeichert.
- [x] `OFFEN_FUER_PILOT` bleibt der Fallback, solange kein Standort gewählt ist.
- [x] Ein Beispielstandort ausgefüllt — **ohne Rufnummern und E-Mail-Adressen**.
      Eine erfundene Nummer, die jemand in einer Notlage anruft, wäre schlimmer
      als gar keine Angabe. Ein Test hält das fest.
- [x] Der Melde-Assistent zeigt unter „Wohin mit deiner Meldung?" die Personen
      des eingestellten Standorts.
- [ ] **Offen:** echte Standortdaten. Die Struktur steht, gefüllt ist nur das
      Beispiel.

### Phase 4 — Fristen und Status — weitgehend erledigt am 26.08.2026

- [x] `src/lib/fristen.js` mit Paragraf an jeder Frist; die Werte gehören vor
      dem Pilot bestätigt (siehe Pilot-Checkliste).
- [x] Sichtbarer Fristenlauf im Postfach, überfällige Fristen rot.
- [x] **Für die meldende Person sichtbar**: In der Sammlung steht an jedem
      eigenen Vorgang, welche Frist läuft und wie lange noch. Ist sie abgelaufen,
      sagt die App, dass nachfragen erlaubt ist und man sich an eine andere
      Stelle wenden darf.
- [ ] **Offen:** Erinnerung an die zuständige Rolle, wenn die Frist knapp wird.

### Phase 5 — Anonymität schützen (Woche 7–8)

- [x] Schwellenwert fünf — steckt in `src/lib/muster.js`, im Postfach sichtbar.
- [ ] **Offen:** `DashboardAnalytics.jsx` daran anschließen. Die Analytics-Seite
      zeigt weiterhin frei erfundene Kennzahlen ohne Sperre — das passt nicht
      mehr zu dem, was die Postfächer tun.
- [ ] Löschkonzept: wie lange bleibt ein Fall im Postfach, wer löscht ihn.
- [ ] Quick Exit gegen die neuen Ansichten prüfen — nichts darf zurückbleiben.

### Phase 6 — Feinschliff (Woche 8–10)

- [ ] Rollen-Onboarding: eine Seite je Gruppe, die erklärt, was diese Rolle in
      der App darf und was nicht.
- [ ] Als Web-App erreichbar machen — heute läuft sie nur lokal.
- [ ] Auf dem Handy durchspielen, jede Rolle einzeln.
- [ ] `npm run verify` grün, `docs/Pilot-Checkliste.md` nachziehen.

---

## 4. Was bewusst nicht gebaut wird

Diese Liste gehört in die Vorführung. Sie zeigt, dass die Grenzen bekannt sind.

- **Keine echte Zustellung.** Ohne Server, ohne Datenschutzprüfung, ohne
  Zustimmung des Betriebsrats geht keine Meldung an eine echte Person.
- **Keine echte Anmeldung.** Rollen sind ein Perspektivwechsel zum Ansehen,
  keine Zugangskontrolle.
- **Keine Verschlüsselung von Inhalten.** Die PIN sperrt die Oberfläche. Das
  sagt die App an keiner Stelle anders.
- **Keine automatische Bewertung von Fällen.** Die KI formuliert einen Entwurf,
  sie entscheidet nichts.
- **Keine Übernahme in DB-Systeme.** Es gibt keine Schnittstelle.

---

## 5. Fragen, die vor dem Bauen zu klären sind

An die Ausbildung und die Interessenvertretungen:

- [ ] Wer bekommt eine Meldung, wenn keine Rolle ausgewählt wurde?
- [ ] Darf eine Rolle einen Fall abgeben, wenn sie sich nicht zuständig fühlt —
      und wie erfährt die betroffene Person davon?
- [ ] Wie lange bleibt ein abgeschlossener Fall sichtbar?
- [ ] Wer pflegt die Standortdaten und wie oft?
- [ ] Sollen Beschäftigte außerhalb der Ausbildung die App nutzen dürfen?

An Datenschutz und IT:

- [ ] Bleiben alle Daten auf dem Gerät, auch wenn es Postfächer gibt?
- [ ] Was passiert auf geteilten Geräten in Schulungsräumen?
- [ ] KI-Anbindung im Pilot: Empfehlung bleibt, ohne zu starten.

---

## 6. Reihenfolge für die Vorführung

1. Startseite als Azubi — der Einstieg für jemanden, dem es schlecht geht.
2. Einen Vorfall festhalten, ohne dass jemand mitliest.
3. Meldung in fünf Schritten verfassen, Empfängerrolle wählen.
4. „Wohin damit?" — die echten Meldewege der DB, mit Quelle.
5. Perspektive wechseln: derselbe Fall im JAV-Postfach.
6. Zeigen, dass HR denselben Fall **nicht** sieht. Das ist der Moment, der
   überzeugt.
7. Fristenlauf zeigen.
8. Analytics öffnen und die Sperre unter fünf Fällen zeigen.
9. Diese Roadmap und die Pilot-Checkliste als Abschluss: was fehlt, steht drin.
