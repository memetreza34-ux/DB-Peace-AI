# DB Peace AI — Design-System

Erhoben aus dem laufenden Code, nicht ausgedacht. Zahlen in Klammern sind
Vorkommen im Quellcode (Stand 6. September 2026).

Diese Datei ist dafür gedacht, einem Coding-Agenten (Codex, Claude Code) als
Kontext mitgegeben zu werden, damit neue Oberfläche zum Bestehenden passt.

---

## 1. Farben

Definiert in `tailwind.config.js`, nicht ändern ohne Grund:

| Token | Hex | Wofür |
|---|---|---|
| `db-red` | `#E2001A` | Offizielles DB-Rot. Flächen und Text **ab 18px** |
| `db-redInk` | `#A40013` | Abgedunkelt für **kleinen** Text auf hellem Grund (Kontrast) |
| `db-dark` | `#282D37` | DB Cool Gray Dark — Text, dunkle Flächen |
| `db-rail` | `#646973` | DB Cool Gray Mid — Nebentext |
| `db-soft` | `#F0F3F5` | DB Cool Gray Light — Seitenhintergrund |
| `db-warm` | `#ECEEF1` | Zweiter Hintergrund, für Abhebung |

### Die eine Farbregel

**Rot heisst „dringend".** Es steht beim Notfall, beim Panik-Knopf und in
Hover-Zuständen (dort heisst es „hier kannst du klicken"). Sonst nirgends.

Bis zum 6.9.2026 hatte jeder der fünf Wege auf der Startseite eine eigene Farbe
— Rot, Blau, Emerald, Lila, Petrol. Das war Zufall, kein System: „Kurse" war
lila, weil lila noch frei war. Lila und Petrol kommen im DB-Erscheinungsbild
überhaupt nicht vor.

**Wenn du eine neue Farbe einführen willst, brauchst du einen Grund, der sich in
einem Satz sagen lässt.** „Sieht besser aus" ist keiner.

Erlaubte Ausnahmen, die es heute schon gibt:
- **Emerald** — Erfolg, Bestätigung („Meldung ist angekommen")
- **Amber** — Warnung, Frist läuft, Unter-18-Hinweise
- **Rot (red-500/600)** — Gefahr, Notfall

---

## 2. Schrift

```
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
"Segoe UI", sans-serif
```

Definiert in `src/styles.css`. DB nutzt hausintern „DB Screen Sans" — die ist
nicht frei lizenziert und deshalb **nicht** eingebunden. Nicht einfach
hinzufügen, das wäre eine Lizenzfrage.

### Grössen im Einsatz

| Klasse | Vorkommen | |
|---|---|---|
| `text-sm` | 196 | Standard-Fliesstext |
| `text-xs` | 146 | Nebentext, Metadaten |
| `text-2xl` | 36 | Dialog-Überschriften |
| `text-lg` | 34 | Kartentitel |
| `text-xl` | 19 | Abschnittstitel |
| `text-3xl` | 11 | Seitentitel |
| `text-4xl` | 7 | Startseiten-Titel |
| **`text-[11px]`** | **27** | ⚠️ ausserhalb der Skala |
| **`text-[10px]`** | **12** | ⚠️ ausserhalb der Skala |

**Baustelle:** 39 Stellen benutzen feste Pixelwerte statt der Skala. 10px ist
für Fliesstext zu klein — auf einem Bahnsteig, bei Sonne, mit zitternden
Händen ist das nicht lesbar. Wer hier aufräumt, ersetzt sie durch `text-xs`.

### Stärken

| Klasse | Vorkommen |
|---|---|
| `font-black` | 220 |
| `font-bold` | 133 |
| `font-semibold` | 120 |
| `font-medium` | 57 |
| `font-extrabold` | 15 |

**Baustelle:** `font-black` 220-mal ist zu viel. Wenn fast alles fett ist, hebt
sich nichts mehr ab. Faustregel: `font-black` für Überschriften,
`font-semibold` für Fliesstext, `font-medium` für Nebentext.

---

## 3. Ecken und Schatten

| Klasse | Vorkommen |
|---|---|
| `rounded-xl` | 113 |
| `rounded-lg` | 109 |
| `rounded-full` | 45 |
| `rounded-md` | 28 |
| `rounded-2xl` | 5 |

**Baustelle:** `rounded-xl` und `rounded-lg` werden fast gleich oft benutzt,
ohne dass klar wäre wofür welches. Eine Regel wäre: `rounded-lg` für Karten und
Flächen, `rounded-xl` für Knöpfe und Icon-Kacheln, `rounded-full` nur für
Runde Dinge (Avatare, schwebende Knöpfe).

| Schatten | Vorkommen | |
|---|---|---|
| `shadow-sm` | 75 | Standard für Karten |
| `shadow-md` | 23 | Hover |
| `shadow-panel` | 21 | eigener Token: `0 2px 8px rgba(40,45,55,0.08)` |
| `shadow-lg` | 19 | Dialoge, schwebende Elemente |

---

## 4. Was diese App von einer normalen App unterscheidet

Wer hier Design macht, muss das wissen — sonst wird es hübsch und falsch.

**Die Zielgruppe ist in einer Belastungssituation.** Azubis zwischen 16 und 21,
die gemobbt werden, diskriminiert oder überfordert sind. Manche öffnen die App
in einer Toilettenkabine, manche nachts, manche mit dem Daumen einer Hand.

Daraus folgt:

- **Keine Deko-Animation.** Wer in Not ist, will die Nummer, nicht einen
  Ladebalken mit Charakter. Was sich bewegt, muss einen Grund haben.
- **Nichts verstecken, was dringend ist.** Der Notfall steht auf der Startseite
  bei 364px — ohne Scrollen sichtbar. Das darf keine Design-Änderung kaputt
  machen.
- **Kein Text unter 12px.** Siehe oben.
- **Tastatur und Screenreader müssen funktionieren.** Dialoge nutzen
  `src/lib/useDialog.js` (Escape, Fokusfalle, Scroll-Sperre). Aufklappbares
  nutzt `<details>`/`<summary>`, damit der Browser das Verhalten mitbringt.
- **Klickflächen mindestens 44px** (`min-h-11`).
- **Der „Schnell verlassen"-Knopf bleibt immer sichtbar.** Er ist eine
  Sicherheitsfunktion, keine Navigation. Er darf nicht wegscrollen, nicht
  ausblenden, nicht in ein Menü.

---

## 5. Was gerade unfertig ist

Ehrliche Liste, Stand 6.9.2026:

1. **Der Willkommensblock hat vier Endlosanimationen** — pulsierender Glow, ein
   Zug alle 12 Sekunden, zwei blinkende Funkel-Sterne. Für zwei Sätze Text.
   Das ist die auffälligste Stelle, an der die App „generiert" wirkt.
2. **39 Stellen mit festen Pixelgrössen** statt der Typo-Skala.
3. **`font-black` 220-mal** — keine Hierarchie mehr.
4. **`rounded-lg` vs `rounded-xl`** ohne Regel.
5. **Kein Dark-Mode-Test.** Die Klassen sind da (`dark:`), aber niemand hat
   systematisch durchgesehen, ob alle Kontraste stimmen.

---

## 6. Wie man hier Design ändert

Eine Sache pro Schritt, mit einem Grund, dann anschauen.

Am 5.9.2026 wurde die halbe App auf einmal auf ein neues Design umgestellt
(„Abfahrtstafel"). Das Ergebnis war schlechter als vorher und wurde komplett
zurückgenommen — sieben Commits. Der Fehler war nicht die Idee, sondern die
Menge auf einmal: Niemand konnte sagen, welcher Teil davon stört.

Vor jedem Commit: `npm run verify` (Tests + Build).
