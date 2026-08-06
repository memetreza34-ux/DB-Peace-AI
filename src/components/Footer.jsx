import React from "react";
import { BarChart3, FlaskConical, HeartHandshake, Info, ShieldCheck } from "lucide-react";

export function Footer({ onNavigate, onToggleHR }) {
  return (
    <footer className="mt-16 border-t border-db-dark/10 bg-white py-8 text-xs font-semibold text-db-rail dark:border-white/10 dark:bg-db-dark dark:text-white/60">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-db-red text-white">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <p className="font-black text-db-dark dark:text-white">DB Peace AI · lokaler Innovationsprototyp</p>
              <p className="mt-0.5 text-db-rail/70 dark:text-white/40">Keine offizielle Anwendung der Deutschen Bahn AG.</p>
            </div>
          </div>

          <div className="rounded-xl border border-db-dark/5 bg-db-warm px-4 py-2 text-center text-xs font-bold text-db-dark dark:border-white/5 dark:bg-white/5 dark:text-white">
            Menschen entscheiden, nicht die KI · keine Rechts-, Medizin- oder Krisenberatung
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-bold">
            <button type="button" onClick={() => onNavigate("analytics")} className="flex items-center gap-1.5 transition hover:text-db-red">
              <BarChart3 className="h-3.5 w-3.5" />
              Demo-Auswertung
            </button>
            <button type="button" onClick={() => onNavigate("project")} className="flex items-center gap-1.5 transition hover:text-db-red">
              <Info className="h-3.5 w-3.5" />
              Projekt
            </button>
            <button type="button" onClick={() => onNavigate("privacy")} className="flex items-center gap-1.5 transition hover:text-db-red">
              <ShieldCheck className="h-3.5 w-3.5" />
              Datenschutzkonzept
            </button>
            {onToggleHR && (
              <button type="button" onClick={onToggleHR} className="flex items-center gap-1.5 text-violet-700 transition hover:text-violet-900 dark:text-violet-300" title="Öffnet ausschließlich eine Ansicht mit erfundenen Beispieldaten">
                <FlaskConical className="h-3.5 w-3.5" />
                HR-Demo
              </button>
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}
