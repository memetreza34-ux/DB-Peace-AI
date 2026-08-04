import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Clock, ShieldAlert, HeartHandshake, ChevronDown, ChevronUp } from "lucide-react";

export function AzubiRightsCheck() {
  const [expandedId, setExpandedId] = useState(null);

  const rights = [
    {
      id: "overtime",
      icon: Clock,
      title: "Überstunden als Azubi",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      content: "Als Azubi (unter 18) machst du prinzipiell keine Überstunden (Jugendarbeitsschutzgesetz). Wenn du über 18 bist, darfst du Überstunden machen, sie müssen aber zwingend bezahlt oder in Freizeit ausgeglichen werden. Die Ausbildung steht immer im Vordergrund, nicht die Arbeitsleistung!"
    },
    {
      id: "tasks",
      icon: ShieldAlert,
      title: "Ausbildungsfremde Aufgaben",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      content: "Kaffee kochen, Halle fegen (wenn es nichts mit der Lehre zu tun hat) oder private Autos der Meister waschen? Das ist verboten! Du bist zum Lernen da, nicht als billige Hilfskraft. Ausbildungsfremde Tätigkeiten darfst du höflich aber bestimmt ablehnen."
    },
    {
      id: "jav",
      icon: HeartHandshake,
      title: "Die JAV ist dein Backup",
      color: "text-db-red",
      bg: "bg-db-red/10",
      content: "Die Jugend- und Auszubildendenvertretung (JAV) ist quasi dein eigener kleiner Betriebsrat. Wenn du Stress mit dem Ausbilder hast oder dich ungerecht behandelt fühlst, geh zur JAV. Die Gespräche sind absolut vertraulich!"
    },
    {
      id: "school",
      icon: Scale,
      title: "Berufsschule & Freistellung",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      content: "Für den Berufsschulunterricht musst du freigestellt werden. Wenn du einen vollen Schultag (mehr als 5 Schulstunden) hast, darfst du danach nicht mehr in den Betrieb gerufen werden. Das gilt als voller Arbeitstag (8 Stunden)."
    }
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="rounded-full bg-db-red/10 p-3 text-db-red mb-3">
          <Scale className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black text-db-dark">Azubi-Rechte Quick-Check</h2>
        <p className="text-sm font-medium text-db-rail max-w-lg mt-2">
          Dein Wissen ist dein bester Schutz. Hier sind die wichtigsten Basics, die du als DB-Azubi kennen musst, verständlich erklärt.
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
                isExpanded ? "bg-white border-db-dark/20 shadow-md" : "bg-white/60 border-db-dark/5 hover:border-db-dark/10 hover:bg-white"
              }`}
            >
              <button
                onClick={() => toggleExpand(right.id)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-2 ${right.bg} ${right.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-db-dark">{right.title}</h3>
                </div>
                <div className="text-db-rail">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 text-sm font-medium leading-relaxed text-db-rail pl-16">
                      {right.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
