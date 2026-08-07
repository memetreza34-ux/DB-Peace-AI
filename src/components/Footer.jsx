import React from "react";
import { BarChart3, FlaskConical, HeartHandshake, Info, ShieldCheck } from "lucide-react";

export function Footer({ onNavigate, onToggleHR }) {
  return (
    <footer className="mt-16 border-t border-db-dark/10 bg-white py-8 text-xs font-semibold text-db-rail dark:border-white/10 dark:bg-db-dark dark:text-white/60">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-db-red text-white"><HeartHandshake className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <p className="font-black text-db-dark dark:text-white">DB Peace AI · lokaler Innovationsprototyp</p>
              <p className="mt-0.5 text-db-rail/70 dark:text-white/40">Keine offizielle Anwendung der Deutschen Bahn AG.</p>
            </div>
          </div>

          <div className="rounded-xl border border-db-dark/5 bg-db-warm px-4 py-2 text-center text-xs font-bold text-db-dark dark:border-white/5 dark:bg-white/5 dark:text-white">Menschen entscheiden, nicht die KI · keine Rechts-, Medizin- oder Krisenberatung</div>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-bold" aria-label="Weitere Bereiche">
            <FooterButton onClick={() => onNavigate("analytics")} icon={BarChart3}>Szenario-Rechner</FooterButton>
            <FooterButton onClick={() => onNavigate("project")} icon={Info}>Projekt</FooterButton>
            <FooterButton onClick={() => onNavigate("privacy")} icon={ShieldCheck}>Datenschutzstatus</FooterButton>
            {onToggleHR && <FooterButton onClick={onToggleHR} icon={FlaskConical} className="text-violet-700 dark:text-violet-300" title="Öffnet ausschließlich eine Ansicht mit erfundenen Beispieldaten">HR-Demo</FooterButton>}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterButton({ children, className = "", icon: Icon, onClick, title }) {
  return (
    <button type="button" onClick={onClick} title={title} className={`flex items-center gap-1.5 rounded px-1 py-1 transition hover:text-db-red focus:outline-none focus:ring-2 focus:ring-db-red/30 ${className}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {children}
    </button>
  );
}
