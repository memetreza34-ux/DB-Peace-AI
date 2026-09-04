import React from "react";
import { HeartHandshake, BarChart3, Info, ShieldCheck, Eye } from "lucide-react";

export function Footer({ onNavigate, onRollenAnsehen }) {
  return (
    // pb-28 hält den Fußbereich frei von den schwebenden Schaltflächen (Quick Exit, Chat)
    <footer className="mt-16 border-t border-line/10 bg-white dark:bg-db-dark pt-8 pb-28 sm:pb-8 text-sm font-normal text-ink-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Brand & Disclaimer */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-db-red text-white">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-ink">DB Peace AI — Lokaler Innovationsprototyp</div>
              <div className="text-db-rail/70 dark:text-white/40">Nicht offizielle Anwendung der Deutsche Bahn AG.</div>
            </div>
          </div>

          {/* Core Safety Statement */}
          <div className="rounded-xl bg-db-warm dark:bg-db-dark/50 px-4 py-2 text-center text-sm font-bold text-ink border border-db-dark/5 dark:border-white/5">
            {/* redInk statt db-red: kleiner Text auf hellgrauem Grund erreicht mit
                der reinen Markenfarbe den Mindestkontrast nicht. */}
            <span className="text-db-redInk dark:text-red-400 font-bold">„Menschen entscheiden, nicht die KI.“</span> — Keine Rechts- oder Medizinberatung.
          </div>

          {/* Quick Access Links */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-ink-muted">
            <button
              type="button"
              onClick={() => onNavigate("analytics")}
              className="flex items-center gap-1.5 hover:text-db-red transition"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Analytics</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate("project")}
              className="flex items-center gap-1.5 hover:text-db-red transition"
            >
              <Info className="h-3.5 w-3.5" />
              <span>Projekt-Pitch</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate("privacy")}
              className="flex items-center gap-1.5 hover:text-db-red transition"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
              <span>Datenschutz & Compliance</span>
            </button>
            {onRollenAnsehen && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onRollenAnsehen}
                  className="flex items-center gap-1.5 hover:text-db-red transition"
                  title="Vorschau: So käme eine Meldung bei JAV, Betriebsrat, HR oder Compliance an"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Andere Perspektive ansehen</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
