# Release-Checkliste

## Technisch

- [ ] Finalen Commit-SHA eingetragen
- [ ] Node.js 22 und npm 10 oder 11 verwendet
- [ ] `npm ci` erfolgreich
- [ ] `npm run check` erfolgreich
- [ ] GitHub Actions für denselben Commit erfolgreich
- [ ] Keine offenen kritischen oder hohen Abhängigkeitswarnungen ungeprüft
- [ ] Keine Backup-, Build- oder Geheimnisdateien im Repository

## Manuell

- [ ] Checkliste in `docs/MANUAL-TEST-CHECKLIST.md` vollständig durchgeführt
- [ ] Kernwege bei 360, 768 und 1280 Pixel Breite geprüft
- [ ] Tastaturbedienung und sichtbarer Fokus geprüft
- [ ] Fehler- und Fallbackzustände geprüft
- [ ] PDFs und kopierte Texte mit synthetischen Daten geprüft
- [ ] Keine automatische Übertragung oder offizielle Integration suggeriert

## Inhalt und Sicherheit

- [ ] Externe Hilfsnummern und Rechtsquellen erneut verifiziert
- [ ] Keine echten Personen-, Fall- oder internen Kontaktdaten enthalten
- [ ] Prototyp-, Demo- und Nichtproduktionshinweise sichtbar
- [ ] Bekannte Grenzen in README, SECURITY und MVP-Status übereinstimmend
- [ ] Datenschutz-, Rechts- und IT-Sicherheitsfreigaben für den geplanten Einsatz geklärt

## Entscheidung

- [ ] Abschlussprotokoll ausgefüllt
- [ ] Restblocker akzeptiert oder behoben
- [ ] Merge-Methode festgelegt; bei diesem PR aufgrund der vielen Zwischencommits bevorzugt `squash`
