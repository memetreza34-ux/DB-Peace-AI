import React from "react";
import { Home, Search, ShieldAlert, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle.jsx";

export function Navigation({ activeTab, setActiveTab, onOpenEmergency, onOpenSearch }) {
  return (
    <header className="sticky top-0 z-40 border-b border-db-dark/10 bg-white/95 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-db-dark/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button type="button" onClick={() => setActiveTab("home")} className="group flex min-w-0 items-center gap-3 text-left" aria-label="DB Peace Startseite">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-db-red text-sm font-black text-white shadow-sm transition group-hover:scale-105">
            DP
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-lg font-black tracking-tight text-db-dark dark:text-white">DB Peace AI</span>
              <span className="hidden rounded bg-violet-100 px-2 py-0.5 text-[10px] font-black uppercase text-violet-800 dark:bg-violet-500/15 dark:text-violet-300 sm:inline">Prototyp</span>
            </div>
            <p className="hidden truncate text-[11px] font-semibold text-db-rail/70 dark:text-white/50 md:block">Orientierung und Meldungsentwürfe für Azubis</p>
          </div>
        </button>

        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label="Hauptnavigation">
          <ThemeToggle />
          <button type="button" onClick={onOpenSearch} className="flex h-10 w-10 items-center justify-center rounded-xl bg-db-dark/5 text-db-dark/70 transition hover:bg-db-dark/10 hover:text-db-dark dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white" title="Inhalte durchsuchen" aria-label="Suche öffnen">
            <Search className="h-5 w-5" />
          </button>
          <NavButton active={activeTab === "home"} onClick={() => setActiveTab("home")} icon={Home} label="Start" />
          <NavButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={User} label="Sammlung" hideLabelOnMobile />
          <button type="button" onClick={onOpenEmergency} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 text-xs font-black text-white shadow-sm transition hover:bg-red-700 sm:px-4 sm:text-sm">
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Akute Hilfe</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function NavButton({ active, hideLabelOnMobile = false, icon: Icon, label, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition sm:px-4 sm:text-sm ${active ? "bg-db-dark text-white shadow-sm dark:bg-white dark:text-db-dark" : "text-db-dark/70 hover:bg-db-dark/5 hover:text-db-dark dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"}`} aria-current={active ? "page" : undefined}>
      <Icon className="h-4 w-4" />
      <span className={hideLabelOnMobile ? "hidden sm:inline" : "hidden md:inline"}>{label}</span>
    </button>
  );
}
