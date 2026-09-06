# Spickzettel fürs JAV-Gespräch

Ziel des Gesprächs ist **nicht**, die App gut aussehen zu lassen. Ziel ist eine
Antwort auf eine einzige Frage: *Würdet ihr das ausprobieren — und wer liest
die Meldungen?* Alles andere hängt daran.

---

## Vorher, fünf Minuten

```bash
npm run dev
```

Startet beides: die App auf `localhost:5173` und die Meldungs-Ablage. Einmal
selbst durchspielen, damit im Gespräch nichts hakt:

1. Startseite → **Festhalten & Melden** → **Meldung verfassen**
2. Fünf Schritte durchklicken, JAV als Empfängerin wählen
3. **Meldung abschicken** — es kommt ein Kennzeichen
4. Fußzeile → **Für die Vorführung** → **Andere Perspektive ansehen** → **JAV**
5. Die eigene Meldung liegt oben im Posteingang

Wenn Schritt 5 klappt, funktioniert die Vorführung.

**Ohne Internet** geht alles ausser den externen Links zu Kursanbietern.

---

## Was zeigen — in dieser Reihenfolge

Nicht alles zeigen. Drei Sachen reichen, und zwar diese:

**1. Der Notfall (30 Sekunden)**
Startseite → er steht ganz oben, ohne Scrollen. Ein Klick, echte Nummern:
110, 112, Telefonseelsorge, Nummer gegen Kummer.

*Der Punkt:* Wer die App in Not öffnet, muss nicht suchen.

**2. Der Weg einer Meldung (2 Minuten)**
Meldung verfassen, JAV wählen, abschicken — Kennzeichen zeigen. Dann in die
JAV-Ansicht wechseln und die Meldung dort liegen sehen. Dort auch zeigen, was
die JAV tun kann: Sprechstunde, Begleitung, **Beim Betriebsrat einbringen**.

*Der Punkt:* Die App weiss, dass die JAV nach § 70 BetrVG kein eigenes
Beschwerderecht hat und über den Betriebsrat gehen muss. Das fällt jedem
JAV-Mitglied sofort auf — und zeigt, dass hier jemand nachgedacht hat.

**3. Gespräch statt Meldung (1 Minute)**
Ansprechpartner & Meldewege → Standort wählen → **Gespräch anfragen**.
Zwei Felder, kein Vorgang.

*Der Punkt:* Nicht jeder will melden. Manche wollen erst fragen, ob sie sich
das einbilden.

---

## Was ehrlich dazusagen

Diese Sätze gehören ins Gespräch, nicht ans Ende:

- **„Die Fälle im Postfach sind erfunden."** Nur die Meldung, die ich gerade
  abgeschickt habe, ist echt.
- **„Die Meldung landet auf meinem Laptop, nicht bei der DB."** Es gibt keinen
  Server, keine Anbindung, keine Datenbank im Konzern.
- **„Die Kontaktdaten für unseren Standort fehlen."** Die App sagt selbst
  „noch nicht hinterlegt", statt etwas zu erfinden. Genau da könntet ihr
  helfen.
- **„Die Paragrafen sind nicht juristisch geprüft."** Sie sind sorgfältig
  zugeordnet, aber von mir, nicht von einem Anwalt.
- **„Es ist nichts verschlüsselt."** Wer das Gerät hat, liest mit.

Das klingt nach Schwächen. Es ist das Gegenteil: Eine Hilfe-App, die zugibt,
was sie nicht kann, ist glaubwürdiger als eine, die alles verspricht.

---

## Die vier Fragen

Aus der Pilot-Checkliste. Keine davon ist technisch — deshalb kann sie nur die
JAV beantworten:

1. **Wer liest eine Meldung, wenn sie eingeht?** Und wie schnell?
2. **Wie wird sichergestellt, dass eine Meldung niemandem schadet?**
   (§ 16 AGG verbietet Benachteiligung wegen einer Beschwerde — aber wer
   achtet darauf?)
3. **Wer pflegt die Kontaktdaten je Standort?** Namen und Sprechzeiten ändern
   sich.
4. **Wer schaut sich die Krisen-Texte fachlich an?** Was die App sagt, wenn
   jemand schreibt, dass er nicht mehr leben will.

---

## Was du nicht tun solltest

- **Nicht mehr bauen, bevor du die Antworten hast.** Jede weitere Funktion ist
  geraten, solange niemand gesagt hat, ob und wie das genutzt würde.
- **Nicht versprechen, dass es „bald läuft".** Zwischen Prototyp und Pilot
  liegen Datenschutzprüfung, Betriebsrat und IT-Sicherheit — das entscheidest
  nicht du.
- **Nicht die KI erwähnen.** Sie ist raus. Falls jemand fragt: bewusst
  weggelassen, damit es im Pilot weniger zu prüfen gibt.

---

## Wenn sie Ja sagen

Dann brauchst du als Erstes:

1. Echte Kontaktdaten für einen Standort (Namen, Sprechzeiten, Erreichbarkeit)
2. Eine Zusage, wer die Meldungen bearbeitet
3. Einen Termin mit Datenschutz und Betriebsrat

Erst dann lohnt sich weitere Arbeit an der App.

## Wenn sie Nein sagen

Frag nach dem Grund. „Zu früh", „falsche Stelle", „gibt es schon" und „zu
riskant" führen zu völlig verschiedenen nächsten Schritten — und nach einem
Gespräch weisst du mehr als nach drei Wochen Programmieren.
