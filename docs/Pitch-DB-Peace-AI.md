# DB Peace AI
### Der digitale Azubi-Begleiter gegen Mobbing, Hass und Gewalt

**Einreichung für:** Wettbewerb „Bahn-Azubis gegen Hass und Gewalt" – Deutsche Bahn & EVG
**Eingereicht von:** Mohammad Reza Rahimi · Elektroniker für Betriebstechnik (EBT) · 2. Lehrjahr · [Standort]
**Kontakt:** [E-Mail / Telefon]
**Status:** Funktionierender Prototyp – **keine reine Idee, sondern bereits gebaut und bedienbar.**

---

## 1. In einem Satz

**DB Peace AI ist eine App, die Azubis genau in dem Moment begleitet, in dem sie Mobbing, Hass, Gewalt oder Diskriminierung erleben – sie hilft beim Sortieren, beim sachlichen Festhalten von Vorfällen, beim Vorbereiten einer Meldung und führt direkt zu den echten Hilfe- und Meldestellen der DB. Niedrigschwellig, anonym und jederzeit auf dem Handy.**

> Das Versprechen der App: *„Die Meldung geht erst, wenn du sie abschickst. Menschen entscheiden, nicht die KI."*

---

## 2. Das Problem

Mobbing, Hass und Gewalt machen vor der Ausbildung nicht halt. Gerade Azubis sind besonders verletzlich:

- **Sie sind neu** – kennen die Strukturen, Ansprechpartner und Meldewege oft noch nicht.
- **Sie sind abhängig** – aus Angst um die Übernahme oder das Verhältnis zum Team trauen sich viele nicht, etwas zu sagen.
- **Sie stehen unter Druck** – Scham und Selbstzweifel („Bilde ich mir das nur ein?") führen dazu, dass Vorfälle verschwiegen werden.
- **Sie kennen ihre Rechte nicht** – kaum ein Azubi weiß, dass eine Beschwerde ihm gesetzlich *keinen* Nachteil bringen darf (§ 16 AGG). Genau diese Angst hält viele vom Reden ab.
- **Beweise fehlen** – wenn doch jemand reden will, sind Datum, Uhrzeit und Verlauf längst verschwommen. Ohne sachliche Doku verläuft eine Beschwerde oft im Sand.

**Die Folge:** Vorfälle bleiben unsichtbar, Betroffene bleiben allein, manche brechen die Ausbildung ab – und das Unternehmen erfährt erst spät oder gar nicht von einem Problem.

> 💡 *Für die Einreichung:* Hier 1–2 belegbare Zahlen ergänzen (z. B. DGB-Ausbildungsreport zu Konflikten in der Ausbildung). Keine erfundenen Zahlen verwenden.

---

## 3. Die Idee

Eine App, die nicht belehrt, sondern **begleitet** – in der Sprache der Azubis, auf dem Handy, sofort. Sie beantwortet die vier Fragen, die in so einem Moment wirklich zählen:

| Frage der/des Betroffenen | Antwort der App |
|---|---|
| „Was ist hier los und was kann ich tun?" | **Hilfe** – reden, sortieren, schnelle Orientierung + echte Notfallnummern |
| „Wie halte ich fest, was passiert ist?" | **Festhalten** – Datum, Uhrzeit, Ort, Verlauf – sachlich, anonym, als **PDF** exportierbar |
| „Wie melde ich das – und an wen?" | **Melden** – sachlicher Entwurf + direkte Wege zu MUT-Team, Compliance & JAV |
| „Welche Rechte habe ich überhaupt?" | **Regeln & Rechte** – DB-Vereinbarungen + Gesetze in einfacher Sprache |

Im Zentrum steht der **KI-Azubi-Begleiter**: ein einfacher Chat, dem man schreiben kann, was los ist – er hört zu, ordnet ein und schlägt den nächsten Schritt vor.

---

## 4. Wie es funktioniert (Features – alles bereits gebaut)

**🆘 Hilfe – „Was ist los?"**
Leitet über konkrete Situationen (*beleidigt, gemobbt, bedroht, diskriminiert*) in Sekunden zum nächsten Schritt – mit dauerhaft sichtbaren **echten Notfallnummern**.

**📞 Echte Anlaufstellen (der entscheidende Unterschied)**
Die App erfindet keine Hilfe, sondern **führt zu den echten Stellen** – jede Angabe an der Quelle geprüft und im Code mit Quellenverweis hinterlegt:
- **Polizei 110 / Rettungsdienst 112** bei akuter Gefahr
- **Hinweisgebersystem der DB (BKMS)** – anonym, in zwölf Sprachen
- **Meldestelle Beschäftigungsbedingungen** – der DB-Kanal für Mobbing, Diskriminierung und Belästigung
- **Compliance Hinweismanagement** – 030 297 62710, Mo–Fr 10–15 Uhr
- **MUT – Mitarbeitendenunterstützung**, anonym, auch für Azubis
- **Telefonseelsorge** (0800 111 0 111), **Nummer gegen Kummer** (116 111)

Was standortabhängig ist – JAV, Betriebsrat, Ausbildungsleitung –, zeigt die App ehrlich als „im Pilotbetrieb zu hinterlegen" an, statt eine Nummer zu erfinden.

**📝 Festhalten – Vorfälle sachlich dokumentieren**
Strukturierte Einträge (Datum, Uhrzeit, Ort, Verlauf) – **ohne echte Namen.** **Als PDF speichern** → ausdrucken oder abgeben. Aus einer Notiz wird ein echtes, datiertes Dokument.

**📣 Melden – „Wohin mit deiner Meldung?"**
Geführter Entwurf in fünf Schritten, als PDF exportierbar – und der Schritt, der sonst fehlt: **„Wohin damit?"** Die App öffnet das DB-Hinweisgebersystem oder eine E-Mail an die echte Meldestelle, **vorbefüllt mit dem Entwurf**. Abgeschickt wird nur, was der Mensch abschickt. **Es wird nichts automatisch versendet.**

**🤖 KI-Azubi-Begleiter (das Herzstück)**
Hört zu, ordnet ein und schlägt den nächsten Schritt vor. Entscheidend ist, was er *nicht* der KI überlässt: Äußert jemand Suizidgedanken, Selbstverletzung oder akute Gewalt, greift eine **feste Krisenerkennung, die vor jedem KI-Aufruf läuft** – die Antwort mit Telefonseelsorge und Notruf kommt also auch ohne Internet, ohne API-Schlüssel und unabhängig davon, was ein Sprachmodell gerade generiert. Abgesichert durch automatische Tests. Der Begleiter gibt keine Rechts- oder Medizinberatung. **Sofort vorführbar, auch ganz ohne KI-Anbindung.**

**🎓 Lernen – geprüfte Präventionsangebote**
Angebote von Bundeszentrale für politische Bildung, klicksafe, HateAid, Amadeu Antonio Stiftung, Schule ohne Rassismus, Antidiskriminierungsstelle des Bundes, DGB-Bildungswerk, EVA Akademie, Gesicht Zeigen! und WEISSER RING – **jeder Link vor der Aufnahme abgerufen und geprüft.** Zertifikatslehrgänge führt der Prototyp bewusst nicht auf, solange sie nicht mit der DB abgestimmt sind.

**⚖️ Regeln & deine Rechte**
Zitate aus dem **Verhaltenskodex des DB-Konzerns – mit Quellenangabe und Link**, darunter der Satz, der beim Melden am meisten zählt: *„Wir dulden keine Repressalien gegen Personen, die solche Verstöße melden."* Dazu deine **gesetzlichen Rechte** mit Links zum Gesetzestext: § 13 AGG (Beschwerderecht), § 12 AGG (Schutzpflicht der DB), **§ 16 AGG (kein Nachteil fürs Beschweren)**, § 4 ArbSchG, § 75 BetrVG, JArbSchG (Schutz unter 18).

**🔒 Datenschutz & Verantwortung**
Alle Eingaben bleiben auf dem Gerät – es gibt keine Datenbank, kein Konto, keine Übertragung an die DB. Die App sperrt sich mit einer selbst gesetzten PIN, die nur als Prüfsumme gespeichert wird. Und sie verspricht bewusst nicht mehr, als sie hält: Sie nennt sich an keiner Stelle „verschlüsselt", weil sie Inhalte nicht verschlüsselt. Demo-Bereiche wie die HR-Ansicht sind sichtbar als Beispieldaten gekennzeichnet.

---

## 5. Was DB Peace AI besonders macht

- **Brücke statt Konkurrenz:** Die DB hat bereits Anlaufstellen (MUT, Compliance, Hinweisgebersystem, JAV). Das Problem ist nicht fehlende Hilfe – sondern dass Azubis sie **nicht kennen oder sich nicht trauen.** Diese App ist der einfachste erste Schritt dorthin und führt in die bestehenden Strukturen hinein, nicht daran vorbei.
- **Niedrigschwellig & im richtigen Moment:** 24/7 auf dem Handy, genau dann, wenn es passiert.
- **Sicherheit hängt nicht an der KI:** Die Krisenerkennung läuft fest im Programm, vor jedem KI-Aufruf. Sie funktioniert auch offline, ohne API-Schlüssel und selbst dann, wenn ein Sprachmodell etwas Falsches antworten würde. Das ist eine bewusste Architekturentscheidung – bei diesem Thema darf die Hilfe nicht davon abhängen, ob gerade ein Dienst erreichbar ist.
- **Ehrlich in beide Richtungen:** Die App sagt, was sie kann – und was nicht. Keine erfundenen Rufnummern, keine Zertifikate ohne Teilnahme, kein „verschlüsselt", wo nichts verschlüsselt wird. Was standortabhängig ist, steht als offener Punkt drin. Genau diese Ehrlichkeit ist die Voraussetzung dafür, dass ein Unternehmen so etwas einsetzen kann.
- **Aus Azubi-Sicht gebaut:** in der richtigen Sprache, von jemandem, der die Perspektive kennt.
- **Sofort erlebbar:** kein Setup nötig, läuft ohne KI-Anbindung.

---

## 6. Der Nutzen für die Deutsche Bahn

| Für … | Nutzen |
|---|---|
| **Azubis** | Fühlen sich gesehen, kennen ihre Rechte und werden handlungsfähig – statt allein. |
| **Vertrauenspersonen / JAV / Ausbilder:innen** | Bekommen sachlich dokumentierte Vorfälle (PDF) statt vager Schilderungen – schneller und fairer klärbar. |
| **Die DB als Arbeitgeber** | Macht „Gegen Hass und Gewalt" vom Slogan zum gelebten Werkzeug, schützt junge Menschen, beugt Eskalation und Abbrüchen vor – ein echtes Plus für die Arbeitgebermarke. |
| **Prävention** | Anonyme, aggregierte Muster können (datenschutzkonform) als Frühwarnsignal dienen – nicht zur Überwachung. |

---

## 7. Business Case – was die App der DB sparen kann

*Konservativ gerechnet, nur im Azubi-Bereich (~11.000 Azubis & dual Studierende). Annahmen aus BIBB-/DGB-Studien und der KPMG-Konfliktkostenstudie – vor Einreichung mit Quelle belegen.*

Drei Hebel: **(1) verhinderte Ausbildungsabbrüche** (ein Abbruch kostet den Betrieb ~8.000–15.000 €), **(2) weniger Fehltage** (Mobbing macht messbar krank, ~250–350 €/Tag), **(3) vermiedene Eskalationskosten** (HR-Zeit, Mediation, Rechtsfälle).

| Szenario | Einsparung pro Jahr |
|---|---|
| 🔻 **Minimum (sehr konservativ)** | **~125.000 €** |
| ⚖️ **Realistisch** | **~600.000 – 1.000.000 €** |
| 🔺 **Optimistisch** | **~2.000.000 €** |

> **Pitch-Satz:** *„Selbst wenn die App nur rund 10 Abbrüche und ein paar hundert Fehltage im Jahr verhindert, spart sie über 100.000 € jährlich – realistisch eher das Fünffache. Und sie kostet fast nichts, weil sie schon existiert."*

**Vision (Konzern):** Ausgeweitet auf alle ~220.000 Beschäftigten wären die Hebel ein Vielfaches – Konfliktkosten binden in Großunternehmen laut KPMG 10–15 % der Führungszeit. Dazu nicht bezifferbar: Arbeitgebermarke, Übernahmequote, vermiedene Negativschlagzeilen.

---

## 8. Umsetzung & Machbarkeit

**Was es schon gibt (heute):**
- Voll funktionsfähiger Prototyp (React + Vite, Node.js-Backend als KI-Proxy), Code auf GitHub.
- Alle Funktionen gebaut und bedienbar – inkl. KI-Begleiter (Demo-Modus), PDF-Export, echte Kontakte & Kurse.
- Mobile-first Design im echten DB-Look (Verkehrsrot, klare Typo, Icons).

**Schritte zur echten Einführung:**
1. **Pilot** mit einer Ausbildungsgruppe / einem Standort.
2. **Anbindung der echten Meldewege** (MUT, Compliance, JAV) statt Demo-Vorschau.
3. **Datenschutz & Security** nach DB-Standard (DSGVO, EU-Hosting der KI, Rollen-/Rechtekonzept).
4. **Begleitung durch Profis** – Vertrauenspersonen und Beratungsstellen einbinden.
5. **Rollout & Schulung** in der Ausbildung.

**Ehrlich:** Die App ersetzt keine Menschen und keine professionelle Hilfe. Sie ist die **Brücke** dorthin – sie senkt die Hürde, den ersten Schritt zu gehen.

---

## 9. Warum ich

**Mohammad Reza Rahimi**, Elektroniker für Betriebstechnik (EBT) im 2. Lehrjahr bei der Deutschen Bahn.

Ich wollte schon immer einmal ein großes Projekt von **null** aufbauen – etwas anfangen und wirklich zu Ende bringen, statt nur mitzulaufen. Diese App habe ich **komplett allein** entwickelt, neben einer Ausbildung, die viel Zeit und Kraft kostet. Für mich war das auch ein Test: Wie viel schaffe ich, wenn ich mich einer echten Herausforderung stelle und sie als „Ein-Mann-Armee" durchziehe?

Dass am Ende etwas herauskommt, das anderen Azubis in schweren Momenten wirklich helfen kann, macht es für mich doppelt wertvoll. Ich habe bewusst kein einfaches Thema gewählt, sondern eines, das zählt: dass niemand mit Hass, Gewalt oder Mobbing allein bleibt.

Ich reiche keine Idee auf Papier ein, sondern etwas, das **läuft – allein gebaut.** Das zeigt: Ich meine es ernst, und ich kann umsetzen.

*Einzeleinreichung (kein Team).*

---

## 10. Vision

DB Peace AI als fester Bestandteil der DB-Ausbildung: Jede:r Azubi weiß vom ersten Tag an, dass es eine App gibt, die im Notfall da ist und die Rechte kennt. Aus „Gegen Hass und Gewalt" als Haltung wird ein Werkzeug, das man in der Tasche hat. Langfristig: Ausweitung über die Ausbildung hinaus, Integration in bestehende DB-Strukturen, mehrsprachig.

---

## 11. Der Wunsch an die Jury

Gebt DB Peace AI die Chance auf einen **Pilot.** Lasst uns gemeinsam testen, ob diese App Azubis wirklich hilft – mit echten Meldewegen und der Begleitung von Profis. Das Fundament steht. Jetzt geht es darum, es in die Hände der zu bringen, für die es gebaut ist.

> **DB Peace AI – damit kein Azubi mit Hass und Gewalt allein bleibt.**

---

### Anhang / To-dos vor dem Einreichen

**Nur du kannst das ergänzen:**
- [ ] **Standort** im Header eintragen
- [ ] **Kontakt** (E-Mail / Telefon) im Header eintragen
- [ ] **Einreichungstermin und -weg klären** – zeitkritisch. Über die Ausbildung oder die
      [DB-Wettbewerbsseite](https://www.deutschebahn.com/de/nachhaltigkeit/verantwortung_gesellschaft/BAgHG).
      Teilnahmeberechtigt sind Azubis im 1. und 2. Lehrjahr.
- [ ] **Screenshots** einfügen: Startseite, Krisenchat mit sichtbaren Notfallnummern,
      „Wohin mit deiner Meldung?", Regeln & Rechte mit Quellenangabe, Ansicht auf dem Handy
- [ ] **1–2 belegbare Zahlen** zu Mobbing in der Ausbildung mit Quelle (Abschnitt 2)
- [ ] **Business-Case-Annahmen** mit Quelle hinterlegen (Abschnitt 7) – die Zahlen sind bisher
      geschätzt und als solche gekennzeichnet; ohne Beleg vor einer Jury angreifbar
- [ ] **Format wählen:** PDF / Präsentation / Onepager

**Bereits erledigt:**
- [x] Name, Ausbildungsberuf, Lehrjahr, persönlicher Grund eingetragen
- [x] Alle Anlaufstellen in der App auf geprüfte Quellen umgestellt, erfundene Rufnummern entfernt
- [x] Krisenerkennung eingebaut, die unabhängig von der KI funktioniert – mit Tests abgesichert
- [x] DB-Zitate mit Quellenangabe belegt, unbelegte Regelwerks-Texte entfernt
- [x] Bildungsangebote auf geprüfte Organisationen reduziert, jeder Link abgerufen
- [x] Demo-Inhalte (HR-Ansicht, Analytics, Sammlung) sichtbar gekennzeichnet

**Wenn die Jury nachfragt:** [docs/Pilot-Checkliste.md](Pilot-Checkliste.md) beantwortet, was vor
einem echten Pilotbetrieb zu klären ist – Datenschutz, KI-Hosting, standortabhängige Kontakte.
