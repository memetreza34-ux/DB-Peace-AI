import React from "react";
import { Home, ShieldAlert, User, Search, Brain } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle.jsx";

export function Navigation({ activeTab, setActiveTab, onOpenEmergency, onOpenSearch }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/10 bg-white/95 dark:bg-db-dark/95  shadow-sm transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
        {/* Brand Logo & Tagline */}
        <div
          className="flex min-w-0 items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={() => setActiveTab("home")}
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center transition group-hover:scale-105 shadow-sm rounded-lg overflow-hidden">
            <svg viewBox="0 0 100 100" className="h-full w-full">
               <rect width="100" height="100" fill="#e2001a" />
               <text x="50" y="70" fontSize="55" fontFamily="Arial, sans-serif" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="-2">DB</text>
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-ink flex items-center gap-1.5 sm:gap-2">
                Peace <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-db-red dark:text-red-400 shrink-0" />
              </span>
              <span className="hidden sm:inline rounded bg-db-red/10 dark:bg-db-red/20 px-2 py-0.5 text-sm font-bold text-db-red dark:text-red-400">
                Prototyp
              </span>
            </div>
            <p className="hidden md:block text-sm font-medium text-db-rail/70 dark:text-white/60">
              Dein digitaler Begleiter für Respekt & Sicherheit
            </p>
          </div>
        </div>

        {/* Primary Navigation Actions */}
        <nav className="flex shrink-0 items-center gap-1 sm:gap-4">
          <ThemeToggle />

          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 rounded-xl text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10 hover:text-db-dark dark:hover:text-white transition-all bg-db-dark/5 dark:bg-white/5"
            title="Suchen (Cmd+K)"
            aria-label="Suchen"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            aria-label="Startseite"
            className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-2.5 sm:px-4 py-2 text-sm font-bold transition-all ${
              activeTab === "home"
                ? "bg-db-dark dark:bg-white text-white dark:text-db-dark shadow-sm"
                : "text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10 hover:text-db-dark dark:hover:text-white"
            }`}
          >
            <Home className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Startseite</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            aria-label="Sammlung"
            className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-2.5 sm:px-4 py-2 text-sm font-bold transition-all ${
              activeTab === "profile"
                ? "bg-db-dark dark:bg-white text-white dark:text-db-dark shadow-sm"
                : "text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10 hover:text-db-dark dark:hover:text-white"
            }`}
          >
            <User className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Sammlung</span>
          </button>

          <div className="h-6 w-px bg-db-dark/10 dark:bg-white/10 hidden sm:block"></div>

          {/* Emergency Hotline Button */}
          <button
            type="button"
            onClick={onOpenEmergency}
            aria-label="Notfall und Kontakte"
            className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-2.5 sm:px-3.5 py-2 text-sm sm:text-sm font-bold transition shadow-sm ${
              activeTab === "contacts"
                ? "bg-red-800 text-white dark:bg-red-900"
                : "bg-red-600 dark:bg-db-red text-white hover:bg-red-700 dark:hover:bg-red-600"
            }`}
          >
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Notfall &amp; Kontakte</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
