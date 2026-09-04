import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Clock, ShieldAlert, HeartHandshake, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Die vier Fragen, die Azubis im Alltag wirklich stellen — in einfacher Sprache,
 * vor den Gesetzestexten. Wer wissen will, wo das steht, findet die Paragrafen
 * darunter in der Gesetzesliste.
 *
 * Bewusst ohne AnimatePresence: In diesem Projekt blieben damit schon Elemente
 * unsichtbar im DOM liegen. Der aufgeklappte Text wird konditional gerendert.
 */
export function AzubiRightsCheck() {
  const [expandedId, setExpandedId] = useState(null);

  const rights = [
    {
      id: "overtime",
      icon: Clock,
      title: "Überstunden als Azubi",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      content:
        "Als Azubi unter 18 machst du grundsätzlich keine Überstunden (Jugendarbeitsschutzgesetz). Über 18 sind sie erlaubt, müssen aber bezahlt oder in Freizeit ausgeglichen werden. Die Ausbildung steht immer vor der Arbeitsleistung.",
      gesetz: "§ 8 und § 21 JArbSchG, § 17 BBiG",
    },
    {
      id: "tasks",
      icon: ShieldAlert,
      title: "Ausbildungsfremde Aufgaben",
      color: "text-warn-ink",
      bg: "bg-amber-500/10",
      content:
        "Aufgaben, die nichts mit deiner Ausbildung zu tun haben, musst du nicht übernehmen — das Privatauto der Meisterin waschen zum Beispiel. Du bist zum Lernen da. Du darfst das höflich, aber deutlich ablehnen.",
      gesetz: "§ 14 BBiG",
    },
    {
      id: "jav",
      icon: HeartHandshake,
      title: "Die JAV ist für dich da",
      color: "text-db-red",
      bg: "bg-db-red/10",
      content:
        "Die Jugend- und Auszubildendenvertretung ist deine eigene Interessenvertretung. Bei Ärger mit der Ausbildung oder wenn du dich ungerecht behandelt fühlst, kannst du dorthin gehen. Die Gespräche sind vertraulich.",
      gesetz: "§ 60 ff. BetrVG",
    },
    {
      id: "school",
      icon: Scale,
      title: "Berufsschule & Freistellung",
      color: "text-ok-ink",
      bg: "bg-emerald-500/10",
      content:
        "Für die Berufsschule musst du freigestellt werden. Nach einem Schultag mit mehr als fünf Unterrichtsstunden darf dich der Betrieb nicht mehr rufen — der Tag zählt als voller Arbeitstag.",
      gesetz: "§ 9 JArbSchG, § 15 BBiG",
    },
  ];

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="rounded-full bg-db-red/10 p-3 text-db-red mb-3">
          <Scale className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-schild font-bold text-ink">Azubi-Rechte auf einen Blick</h2>
        <p className="text-sm font-medium text-ink-muted max-w-lg mt-2">
          Die vier Fragen, die am häufigsten kommen — kurz beantwortet. Die vollständigen
          Gesetzestexte stehen darunter.
        </p>
      </div>

      <div className="space-y-4">
        {rights.map((right) => {
          const Icon = right.icon;
          const isExpanded = expandedId === right.id;
          return (
            <motion.div
              layout
              key={right.id}
              className={`rounded-md border transition-colors ${
                isExpanded
                  ? "bg-surface border-line/20  shadow-md"
                  : "bg-white/60 dark:bg-db-dark/30 border-line/5  hover:border-db-dark/10 dark:hover:border-white/20 hover:bg-white dark:hover:bg-db-dark/50"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleExpand(right.id)}
                aria-expanded={isExpanded}
                aria-controls={`recht-${right.id}`}
                className="flex w-full items-center justify-between gap-3 p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-2 ${right.bg} ${right.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-ink">{right.title}</h3>
                </div>
                <div className="text-ink-muted shrink-0">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {isExpanded && (
                <div id={`recht-${right.id}`} className="px-5 pb-5 pt-0 sm:pl-16">
                  <p className="text-sm font-medium leading-relaxed text-ink-muted">
                    {right.content}
                  </p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-db-rail/70 dark:text-white/50">
                    Nachzulesen in: {right.gesetz}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
