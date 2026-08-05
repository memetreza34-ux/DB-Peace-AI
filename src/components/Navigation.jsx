import React from "react";
import { Home, ShieldAlert, HeartHandshake, User, Search, Brain, Globe } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle.jsx";

export function Navigation({ activeTab, setActiveTab, onOpenEmergency, onOpenSearch }) {
  return (
    <header className="sticky top-0 z-40 border-b border-db-dark/10 dark:border-white/10 bg-white/95 dark:bg-db-dark/95 backdrop-blur-md shadow-sm transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Tagline */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab("home")}
        >
          <div className="flex h-10 items-center justify-center transition group-hover:scale-105 shadow-sm rounded-lg overflow-hidden">
            <svg viewBox="0 0 100 100" className="h-10 w-10">
               <rect width="100" height="100" fill="#e2001a" />
               <text x="50" y="70" fontSize="55" fontFamily="Arial, sans-serif" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="-2">DB</text>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-db-dark dark:text-white flex items-center gap-2">
                Peace <Brain className="h-5 w-5 text-db-red dark:text-red-400" />
              </span>
              <span className="hidden sm:inline rounded bg-db-red/10 dark:bg-db-red/20 px-2 py-0.5 text-xs font-black text-db-red dark:text-red-400">
                Prototyp
              </span>
            </div>
            <p className="hidden md:block text-xs font-medium text-db-rail/70 dark:text-white/60">
              Dein digitaler Begleiter für Respekt & Sicherheit
            </p>
          </div>
        </div>

        {/* Primary Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10 transition-all border border-transparent hover:border-db-dark/10 dark:hover:border-white/10"
            title="Sprache ändern (Simuliert)"
          >
            <Globe className="h-4 w-4" />
            <span>DE</span>
          </button>
          <ThemeToggle />
          
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10 hover:text-db-dark dark:hover:text-white transition-all bg-db-dark/5 dark:bg-white/5"
            title="Suchen (Cmd+K)"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              activeTab === "home"
                ? "bg-db-dark dark:bg-white text-white dark:text-db-dark shadow-sm"
                : "text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10 hover:text-db-dark dark:hover:text-white"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Startseite</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              activeTab === "profile"
                ? "bg-db-dark dark:bg-white text-white dark:text-db-dark shadow-sm"
                : "text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10 hover:text-db-dark dark:hover:text-white"
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Sammlung</span>
          </button>

          <div className="h-6 w-px bg-db-dark/10 dark:bg-white/10 hidden sm:block"></div>

          {/* Emergency Hotline Button */}
          <button
            type="button"
            onClick={onOpenEmergency}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-extrabold transition shadow-sm ${
              activeTab === "contacts"
                ? "bg-red-800 text-white dark:bg-red-900"
                : "bg-red-600 dark:bg-db-red text-white hover:bg-red-700 dark:hover:bg-red-600"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Notfall & Kontakte</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
