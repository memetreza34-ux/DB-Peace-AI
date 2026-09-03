import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  HelpCircle,
  PhoneCall,
  GraduationCap,
  Siren,
  ArrowRight,
  Scale
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

export function DashboardHome({ onNavigate, onOpenEmergency }) {
  // Bewusst kurz gehalten: Wer diese App öffnet, weil es ihm schlecht geht,
  // soll fünf Wege sehen und nicht sieben. Analytics und Projekte sind
  // Nebenschauplätze und stehen im Fußbereich.
  const dashboardItems = [
    {
      // Steht bewusst an erster Stelle: Wer die App im Ernstfall öffnet, weiss
      // meist noch nicht, was er braucht — sondern nur, dass etwas passiert ist.
      id: "support",
      title: "Was ist gerade los?",
      description: "Beschreib die Situation – die App zeigt dir, was du jetzt tun kannst.",
      icon: HelpCircle,
      action: () => onNavigate("support")
    },
    {
      id: "record-report",
      title: "Festhalten & Melden",
      description: "Privates Gedächtnisprotokoll oder offizielle, anonyme Meldung.",
      icon: FileText,
      action: () => onNavigate("record-report")
    },
    {
      id: "contacts",
      title: "Ansprechpartner & Meldewege",
      description: "Offizielle Meldestellen der DB, Beratung und externe Hilfe – mit echten Kontaktdaten.",
      icon: PhoneCall,
      action: () => onNavigate("contacts")
    },
    {
      id: "learning",
      title: "Kurse & Seminare",
      description: "Wissen, Trainings und Präventions-Seminare zu Mobbing & Konflikten.",
      icon: GraduationCap,
      action: () => onNavigate("learning")
    },
    {
      id: "rights",
      title: "Rechte & Gesetze",
      description: "AGG, BBiG und DB-Richtlinien auf gut Deutsch erklärt.",
      icon: Scale,
      action: () => onNavigate("rights")
    },
  ];

  return (
    <div className="space-y-10">
      
      {/*
        Kopfbereich im DB-Erscheinungsbild: eine ruhige Fläche, links gesetzter
        Text, darunter der rote Balken. Vorher standen hier ein Farbverlauf, ein
        weicher roter Schein, ein fahrender Zug und blinkende Sterne — hübsch,
        aber nach nichts, was die Bahn je gedruckt hätte.
      */}
      <div className="motion-card bg-surface-inverse px-6 py-10 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink-inverse leading-tight">
            Willkommen bei DB Peace
          </h1>
          <p className="mt-3 max-w-xl text-base sm:text-lg font-normal text-ink-inverse/75 leading-relaxed">
            Dein digitaler Raum für ein respektvolles Miteinander. Wähle aus, was du gerade brauchst.
          </p>
          <div className="mt-6 h-1 w-24 bg-db-red" />
        </div>
      </div>

      <div className="motion-card w-full" style={einblendVerzoegerung(1)}>
        <MoodTracker />
      </div>

      {/* Grid Menu */}
      {/* Eigene Überschrift statt Sprung von h1 direkt auf h3 — hilft beim
          Vorlesen mit Screenreader und gibt der Kartenwand einen Sinn. */}
      <h2 className="text-xl font-bold text-ink mt-2">
        Was brauchst du gerade?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-20">
        {dashboardItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              style={einblendVerzoegerung(index)}
              className="motion-card group flex flex-col items-start border border-line/10 bg-surface p-6 text-left transition-colors hover:border-db-red"
            >
              <Icon className="h-6 w-6 text-ink group-hover:text-db-red transition-colors" />
              <h3 className="mt-4 text-lg font-bold text-ink group-hover:text-db-red transition-colors">
                {item.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm font-normal leading-relaxed text-ink-muted">
                {item.description}
              </p>
              <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-db-red">
                Öffnen
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Actions / Footer of Dashboard */}
      <div className="motion-card" style={einblendVerzoegerung(6)}>
        <button
          type="button"
          onClick={onOpenEmergency}
          className="flex w-full items-center gap-4 bg-db-red p-5 text-left text-white transition hover:bg-red-700"
        >
          <Siren className="h-7 w-7 shrink-0" />
          <span>
            <span className="block text-lg font-bold">Akuter Notfall</span>
            <span className="mt-0.5 block text-sm font-normal text-white/85">
              Sofortige Hilfe und alle Notrufnummern
            </span>
          </span>
        </button>

      </div>

    </div>
  );
}
