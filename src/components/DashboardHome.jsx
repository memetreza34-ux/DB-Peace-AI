import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  FileText,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  PhoneCall,
  Scale,
  ShieldCheck,
  Siren,
  Sparkles,
  TrainFront,
} from "lucide-react";
import { MoodTracker } from "./MoodTracker";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

export function DashboardHome({ onNavigate, onOpenEmergency }) {
  const items = [
    {
      id: "record-report",
      title: "Festhalten und vorbereiten",
      description: "Sitzungsprotokoll, Meldungsentwurf und PDF-Export ohne automatische Übermittlung.",
      icon: FileText,
      accent: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    },
    {
      id: "support",
      title: "Hilfe und Orientierung",
      description: "Situationsbezogene nächste Schritte und verifizierte öffentliche Notrufwege.",
      icon: PhoneCall,
      accent: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
    {
      id: "learning",
      title: "Lern- und Demo-Inhalte",
      description: "Kurse, Übungen und Präventionsmaterialien aus dem statischen Projektdatensatz.",
      icon: GraduationCap,
      accent: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    },
    {
      id: "rights",
      title: "Rechte verständlich erklärt",
      description: "Allgemeine Orientierung anhand statischer Daten, keine Rechtsberatung oder Live-Datenbank.",
      icon: Scale,
      accent: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
    },
    {
      id: "project",
      title: "Projekt und Ideen",
      description: "Konzept, Nutzenannahmen und mögliche Weiterentwicklung des Innovationsprototyps.",
      icon: Lightbulb,
      accent: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    },
    {
      id: "analytics",
      title: "Demo-Auswertung",
      description: "Fiktive Kennzahlen und ein frei einstellbarer Wirtschaftlichkeitsrechner.",
      icon: BarChart3,
      accent: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-9">
      <motion.header variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-db-dark px-6 py-10 text-center text-white shadow-xl sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-db-red/30 blur-[120px]" />
        <motion.div
          initial={{ x: "-120%", opacity: 0 }}
          animate={{ x: "220%", opacity: [0, 0.14, 0.14, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 1 }}
          className="pointer-events-none absolute left-0 top-1/2 flex -translate-y-1/2 items-center text-white"
        >
          <TrainFront className="h-24 w-24" />
          <div className="ml-2 h-14 w-28 rounded-xl border-2 border-current" />
          <div className="ml-2 h-14 w-28 rounded-xl border-2 border-current" />
        </motion.div>

        <Sparkles className="pointer-events-none absolute left-8 top-8 h-6 w-6 text-db-red" />
        <Sparkles className="pointer-events-none absolute bottom-8 right-8 h-7 w-7 text-db-red" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-white/75">
            <FlaskConical className="h-3.5 w-3.5 text-violet-300" />
            Stabilisiertes Demonstrations-MVP
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">Orientierung und strukturierte Hilfe für Azubis</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/70 sm:text-base">
            DB Peace AI demonstriert, wie belastende Situationen sachlich dokumentiert, verständlich eingeordnet und für ein Gespräch mit realen Ansprechpersonen vorbereitet werden könnten.
          </p>
          <p className="mx-auto mt-4 max-w-2xl rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold leading-5 text-white/60">
            Keine offizielle DB-Anwendung · keine automatische Meldung · keine echten Personen- oder Falldaten eingeben
          </p>
        </div>
      </motion.header>

      <motion.div variants={itemVariants} className="mx-auto max-w-lg">
        <MoodTracker />
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ id, title, description, icon: Icon, accent }) => (
          <motion.button
            key={id}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={() => onNavigate(id)}
            className="group flex min-h-56 flex-col items-start rounded-xl border border-db-dark/10 bg-white p-6 text-left shadow-sm transition hover:border-db-red/35 hover:shadow-lg dark:border-white/10 dark:bg-db-dark/50"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-black text-db-dark transition group-hover:text-db-red dark:text-white">{title}</h2>
            <p className="mt-2 flex-1 text-sm font-semibold leading-6 text-db-rail dark:text-white/60">{description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-db-red">
              Öffnen <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        ))}
      </div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        <button type="button" onClick={onOpenEmergency} className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-5 text-left transition hover:border-red-400 hover:shadow-md dark:border-red-900/50 dark:bg-red-950/25">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"><Siren className="h-6 w-6" /></div>
          <div><h2 className="font-black text-red-950 dark:text-red-200">Akute Hilfe</h2><p className="mt-1 text-xs font-semibold text-red-800/75 dark:text-red-300/70">110, 112 und TelefonSeelsorge mit klarer Anrufbestätigung.</p></div>
        </button>

        <button type="button" onClick={() => onNavigate("privacy")} className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-left transition hover:border-emerald-400 hover:shadow-md dark:border-emerald-900/50 dark:bg-emerald-950/25">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"><ShieldCheck className="h-6 w-6" /></div>
          <div><h2 className="font-black text-emerald-950 dark:text-emerald-200">Datenschutzkonzept</h2><p className="mt-1 text-xs font-semibold text-emerald-800/75 dark:text-emerald-300/70">Offene Grenzen, erforderliche Prüfungen und Voraussetzungen für einen Pilotbetrieb.</p></div>
        </button>
      </motion.div>
    </motion.div>
  );
}
