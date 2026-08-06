import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  HeartHandshake,
  Info,
  Scale,
  ShieldAlert,
} from "lucide-react";

const rights = [
  {
    id: "working-time",
    icon: Clock,
    title: "Arbeitszeit und zusätzliche Stunden",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    summary:
      "Für Minderjährige gelten grundsätzlich höchstens acht Stunden täglich und 40 Stunden wöchentlich; gesetzliche und tarifliche Ausnahmen sind möglich. Bei Auszubildenden muss Beschäftigung über die vereinbarte regelmäßige tägliche Ausbildungszeit hinaus besonders vergütet oder durch Freizeit ausgeglichen werden.",
    sources: [
      ["JArbSchG § 8", "https://www.gesetze-im-internet.de/jarbschg/__8.html"],
      ["BBiG § 17 Absatz 7", "https://www.gesetze-im-internet.de/bbig_2005/__17.html"],
    ],
    nextStep:
      "Arbeitszeiten, Pausen und zusätzliche Stunden notieren. Bei Unklarheiten Ausbildungsbetreuung, JAV/Betriebsrat oder eine fachkundige Beratungsstelle einbeziehen.",
  },
  {
    id: "tasks",
    icon: ShieldAlert,
    title: "Aufgaben müssen dem Ausbildungszweck dienen",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    summary:
      "Nach dem Berufsbildungsgesetz dürfen Auszubildenden nur Aufgaben übertragen werden, die dem Ausbildungszweck dienen und den körperlichen Kräften angemessen sind. Ob eine einzelne Tätigkeit dazugehört, hängt vom Ausbildungsplan und vom konkreten Zusammenhang ab.",
    sources: [["BBiG § 14 Absatz 3", "https://www.gesetze-im-internet.de/bbig_2005/__14.html"]],
    nextStep:
      "Zuerst nach dem Lernziel und dem Bezug zum Ausbildungsplan fragen. Wiederkehrende fachfremde Tätigkeiten sachlich dokumentieren und prüfen lassen, statt eine pauschale Ablehnung zu empfehlen.",
  },
  {
    id: "representation",
    icon: HeartHandshake,
    title: "Interessenvertretung und Unterstützung",
    color: "text-db-red",
    bg: "bg-db-red/10",
    summary:
      "JAV und Betriebsrat können bei Fragen zur Ausbildung, Benachteiligung oder Konflikten wichtige Ansprechstellen sein. Welche Stelle zuständig ist und wie vertraulich ein Vorgang behandelt werden kann, hängt vom Betrieb, der Rolle und dem Einzelfall ab.",
    sources: [],
    nextStep:
      "Die zuständige lokale Vertretung über bestätigte interne Wege ermitteln. Vor dem Teilen sensibler Details nach Zuständigkeit, Dokumentation und Umgang mit Vertraulichkeit fragen.",
  },
  {
    id: "school",
    icon: Scale,
    title: "Berufsschule und Freistellung",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    summary:
      "Auszubildende sind für den Berufsschulunterricht freizustellen. Ein Berufsschultag mit mehr als fünf Unterrichtsstunden von jeweils mindestens 45 Minuten wird einmal pro Woche mit der durchschnittlichen täglichen Ausbildungszeit angerechnet. Für Minderjährige gelten ergänzend die Regeln des Jugendarbeitsschutzgesetzes.",
    sources: [
      ["BBiG § 15", "https://www.gesetze-im-internet.de/bbig_2005/__15.html"],
      ["JArbSchG § 9", "https://www.gesetze-im-internet.de/jarbschg/__9.html"],
    ],
    nextStep:
      "Stundenplan und betriebliche Einsatzzeit vergleichen. Bei Abweichungen nicht nur auf eine pauschale Acht-Stunden-Regel verweisen, sondern die konkrete Wochenplanung prüfen lassen.",
  },
];

export function AzubiRightsCheck() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 rounded-full bg-db-red/10 p-3 text-db-red">
          <Scale className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-black text-db-dark dark:text-white">Azubi-Rechte: erste Orientierung</h2>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-db-rail dark:text-white/65">
          Die Hinweise fassen allgemeine gesetzliche Grundlagen verständlich zusammen. Sie sind keine Rechtsberatung
          und berücksichtigen nicht automatisch Tarifvertrag, Betriebsvereinbarung oder deinen Einzelfall.
        </p>
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/25 dark:text-amber-100">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>Gesetzeslinks geprüft am 6. August 2026. Vor wichtigen Entscheidungen den aktuellen Stand und die konkrete betriebliche Regelung prüfen.</p>
      </div>

      <div className="space-y-4">
        {rights.map((right) => {
          const Icon = right.icon;
          const isExpanded = expandedId === right.id;

          return (
            <motion.article
              layout
              key={right.id}
              className={`rounded-xl border transition-colors ${
                isExpanded
                  ? "border-db-dark/20 bg-white shadow-md dark:border-white/20 dark:bg-white/5"
                  : "border-db-dark/5 bg-white/70 hover:border-db-dark/15 dark:border-white/10 dark:bg-white/5"
              }`}
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setExpandedId(isExpanded ? null : right.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className={`shrink-0 rounded-xl p-2 ${right.bg} ${right.color}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-black text-db-dark dark:text-white">{right.title}</h3>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 shrink-0 text-db-rail dark:text-white/60" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0 text-db-rail dark:text-white/60" aria-hidden="true" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 border-t border-db-dark/5 px-5 pb-5 pt-4 dark:border-white/10 sm:pl-16">
                      <p className="text-sm font-medium leading-7 text-db-rail dark:text-white/70">{right.summary}</p>

                      <div className="rounded-lg bg-db-soft p-4 dark:bg-white/5">
                        <p className="text-xs font-black uppercase tracking-wide text-db-dark dark:text-white">Sinnvoller nächster Schritt</p>
                        <p className="mt-2 text-sm font-medium leading-6 text-db-rail dark:text-white/65">{right.nextStep}</p>
                      </div>

                      {right.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {right.sources.map(([label, href]) => (
                            <a
                              key={href}
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-db-dark/10 bg-white px-3 py-2 text-xs font-black text-db-dark hover:border-db-red hover:text-db-red dark:border-white/10 dark:bg-db-dark dark:text-white"
                            >
                              {label}
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
