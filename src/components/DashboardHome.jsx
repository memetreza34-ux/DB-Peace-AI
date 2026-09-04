import React from "react";
import { Siren } from "lucide-react";
import { MoodTracker } from "./MoodTracker";

/*
 * Das Einblenden läuft bewusst über CSS (.motion-card in styles.css) und nicht
 * über framer-motion-Varianten. Grund: Wird die Seite in einem Tab im
 * Hintergrund aufgebaut, pausiert der Browser die JS-Animationen — die Karten
 * blieben dann mit opacity 0 stehen und die Startseite war dauerhaft leer.
 * Eine CSS-Animation mit `both` endet auch dann im sichtbaren Zustand.
 */
const einblendVerzoegerung = (index) => ({ animationDelay: `${Math.min(index, 6) * 55}ms` });

/*
 * Reihenfolge der Seite, und warum sie so ist:
 *
 * 1. Begrüßung — kurz, ohne Namen. Die App hat keine Anmeldung und kennt
 *    niemanden; „Hallo Lea" wäre eine Zusage, die sie nicht einlöst.
 * 2. Notfall — direkt darunter. Vorher stand er ganz unten, hinter fünf
 *    Kacheln. Wer ihn braucht, soll nicht scrollen müssen.
 * 3. Die fünf Wege als Tafel. Zeilen lesen sich schneller als Kacheln, wenn
 *    man aufgewühlt ist und nur einen Weg sucht.
 * 4. Stimmungsabfrage zuletzt — sie ist das Unwichtigste auf dieser Seite.
 *
 * Warum die Seite aussieht wie eine Abfahrtstafel:
 *
 * Wer aufgewühlt ist, braucht dasselbe wie jemand am Bahnsteig — wohin kann
 * ich, und was passiert dann. Deshalb steht links keine Bildmarke, sondern die
 * Antwort auf die Frage, die vor dem Antippen kommt: Muss ich reden? Erfährt
 * das jemand? „Ohne Worte", „Bleibt hier", „Menschen" sind keine Etiketten,
 * sondern der Unterschied zwischen den Wegen.
 */
export function DashboardHome({ onNavigate, onOpenEmergency }) {
  const wege = [
    {
      id: "support",
      marker: "Ohne Worte",
      title: "Was ist gerade los?",
      description: "Tippe an, was auf dich zutrifft. Ohne alles erzählen zu müssen.",
      action: () => onNavigate("support"),
    },
    {
      id: "record-report",
      marker: "Bleibt hier",
      title: "Festhalten & Melden",
      description: "Notiere einen Vorfall für dich. Melden geht später — auch anonym.",
      action: () => onNavigate("record-report"),
    },
    {
      id: "contacts",
      marker: "Menschen",
      title: "Ansprechpartner & Meldewege",
      description: "JAV, Betriebsrat, Vertrauensperson — wer wofür zuständig ist.",
      action: () => onNavigate("contacts"),
    },
    {
      id: "learning",
      marker: "In Ruhe",
      title: "Kurse & Seminare",
      description: "Kurze Trainings zu Konflikten, Grenzen und Deeskalation.",
      action: () => onNavigate("learning"),
    },
    {
      id: "rights",
      marker: "Nachlesen",
      title: "Rechte & Gesetze",
      description: "AGG, BBiG und DB-Richtlinien in einfacher Sprache.",
      action: () => onNavigate("rights"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Die rote Kante links ist das DB-Erscheinungsbild, nicht Zierrat: sie
          trägt den Titel, statt ihn zu unterstreichen. */}
      <section className="motion-card border-l-4 border-db-red pl-4">
        <h1 className="font-schild text-4xl font-bold leading-[0.98] tracking-tight text-ink sm:text-5xl">
          Du bist
          <br />
          hier richtig.
        </h1>
        <p className="mt-4 max-w-[46ch] text-base font-normal leading-relaxed text-ink-muted">
          Alles, was du hier machst, bleibt bei dir. Du entscheidest, ob und wann ein nächster
          Schritt kommt.
        </p>
      </section>

      {/* Der Notfall steht bewusst vor allem anderen. */}
      <button
        type="button"
        onClick={onOpenEmergency}
        style={einblendVerzoegerung(1)}
        className="motion-card group block w-full rounded-none bg-db-red p-5 text-left text-white transition hover:bg-db-redInk"
      >
        <span className="flex items-center gap-2.5">
          <Siren className="h-5 w-5 shrink-0" />
          <span className="font-schild text-sm font-semibold uppercase tracking-[0.18em]">
            Sofort Hilfe
          </span>
        </span>
        <span className="mt-3 block font-schild text-2xl font-bold leading-tight">
          Wenn es jetzt nicht mehr geht
        </span>
        <span className="mt-1.5 block text-base font-normal leading-snug text-white/85">
          Notrufe, anonyme Hilfe, Vertrauenspersonen.
        </span>
        <span className="mt-4 inline-flex min-h-[52px] items-center gap-3 bg-white px-5 font-schild text-lg font-bold text-db-redInk">
          Notfall öffnen
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </button>

      <section className="motion-card" style={einblendVerzoegerung(2)}>
        <h2 className="border-b-2 border-ink pb-2 font-schild text-sm font-semibold uppercase tracking-[0.18em] text-ink">
          Wobei brauchst du Hilfe?
        </h2>
        <div>
          {wege.map((weg) => (
            <button
              key={weg.id}
              type="button"
              onClick={weg.action}
              className="group grid w-full grid-cols-[92px_1fr_16px] items-baseline gap-x-3 border-b border-line/15 py-4 text-left transition hover:bg-line/5 sm:grid-cols-[104px_1fr_16px] sm:gap-x-4"
            >
              {/* Die Marker-Spalte beantwortet, was das Antippen kostet. */}
              <span className="font-schild text-xs font-semibold uppercase leading-tight tracking-[0.12em] text-ink-muted transition-colors group-hover:text-db-red">
                {weg.marker}
              </span>
              <span>
                <span className="block font-schild text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">
                  {weg.title}
                </span>
                <span className="mt-1 block text-sm font-normal leading-snug text-ink-muted">
                  {weg.description}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="self-center text-lg text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-db-red"
              >
                →
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="motion-card" style={einblendVerzoegerung(3)}>
        <MoodTracker />
      </div>

      <p className="text-sm font-normal leading-relaxed text-ink-muted">
        Prototyp für die Ausbildung. Keine Rechtsberatung. Menschen entscheiden, nicht die App.
      </p>
    </div>
  );
}
