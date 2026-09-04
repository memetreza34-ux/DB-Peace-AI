import React from "react";
import {
  ChevronRight,
  FileText,
  GraduationCap,
  HelpCircle,
  PhoneCall,
  Scale,
  Siren,
} from "lucide-react";
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
 * 3. Die fünf Wege als Liste. Zeilen lesen sich schneller als Kacheln, wenn
 *    man aufgewühlt ist und nur einen Weg sucht.
 * 4. Stimmungsabfrage zuletzt — sie ist das Unwichtigste auf dieser Seite.
 */
export function DashboardHome({ onNavigate, onOpenEmergency }) {
  const wege = [
    {
      id: "support",
      title: "Was ist gerade los?",
      description: "Tippe an, was auf dich zutrifft. Ohne alles erzählen zu müssen.",
      icon: HelpCircle,
      action: () => onNavigate("support"),
    },
    {
      id: "record-report",
      title: "Festhalten & Melden",
      description: "Notiere einen Vorfall für dich. Melden geht später — auch anonym.",
      icon: FileText,
      action: () => onNavigate("record-report"),
    },
    {
      id: "contacts",
      title: "Ansprechpartner & Meldewege",
      description: "JAV, Betriebsrat, Vertrauensperson — wer wofür zuständig ist.",
      icon: PhoneCall,
      action: () => onNavigate("contacts"),
    },
    {
      id: "learning",
      title: "Kurse & Seminare",
      description: "Kurze Trainings zu Konflikten, Grenzen und Deeskalation.",
      icon: GraduationCap,
      action: () => onNavigate("learning"),
    },
    {
      id: "rights",
      title: "Rechte & Gesetze",
      description: "AGG, BBiG und DB-Richtlinien in einfacher Sprache.",
      icon: Scale,
      action: () => onNavigate("rights"),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="motion-card">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-ink">
          Du bist hier richtig.
        </h1>
        <div className="mt-3.5 h-1 w-11 bg-db-red" />
        <p className="mt-3.5 max-w-[46ch] text-base font-normal leading-relaxed text-ink-muted">
          Alles, was du hier machst, bleibt bei dir. Du entscheidest, ob und wann ein nächster
          Schritt kommt.
        </p>
      </section>

      {/* Der Notfall steht bewusst vor allem anderen. */}
      <button
        type="button"
        onClick={onOpenEmergency}
        style={einblendVerzoegerung(1)}
        className="motion-card flex w-full flex-wrap items-center justify-between gap-5 bg-db-red p-5 text-left text-white transition hover:bg-red-700"
      >
        <span className="flex min-w-[200px] flex-1 items-start gap-3.5">
          <Siren className="mt-0.5 h-6 w-6 shrink-0" />
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-white/85">
              Sofort Hilfe
            </span>
            <span className="mt-1 block text-lg font-bold">Wenn es jetzt nicht mehr geht</span>
            <span className="mt-0.5 block text-sm font-normal text-white/85">
              Notrufe, anonyme Hilfe, Vertrauenspersonen.
            </span>
          </span>
        </span>
        <span className="flex min-h-[52px] shrink-0 items-center gap-2 bg-white px-5 text-base font-bold text-db-redInk">
          Notfall öffnen
          <ChevronRight className="h-4 w-4" />
        </span>
      </button>

      <section className="motion-card" style={einblendVerzoegerung(2)}>
        <h2 className="px-1 pb-3 text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
          Wobei brauchst du Hilfe?
        </h2>
        <div className="border-y border-line/15 bg-surface shadow-panel">
          {wege.map((weg, index) => {
            const Icon = weg.icon;
            return (
              <button
                key={weg.id}
                type="button"
                onClick={weg.action}
                className={`group grid w-full grid-cols-[24px_1fr_18px] items-center gap-3.5 p-4 text-left transition hover:shadow-[inset_3px_0_0_theme(colors.db.red)] sm:px-5 ${
                  index > 0 ? "border-t border-line/15" : ""
                }`}
              >
                <Icon className="h-5.5 w-5.5 text-ink" />
                <span>
                  <span className="block text-base font-bold tracking-tight text-ink sm:text-[17px]">
                    {weg.title}
                  </span>
                  <span className="mt-0.5 block text-sm font-normal leading-snug text-ink-muted">
                    {weg.description}
                  </span>
                </span>
                <ChevronRight className="h-4.5 w-4.5 text-ink-muted transition group-hover:text-db-red" />
              </button>
            );
          })}
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
