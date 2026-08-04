import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, ShieldAlert, GraduationCap, Users, FileText, PhoneCall, LayoutDashboard } from "lucide-react";

// The Search Index
const SEARCH_INDEX = [
  {
    id: "action-report",
    title: "Vorfall offiziell melden",
    description: "Dokumentiere und melde einen Vorfall sicher und vertraulich.",
    category: "Aktion",
    icon: <FileText className="w-5 h-5 text-db-red" />,
    keywords: ["melden", "vorfall", "report", "anzeigen", "beschwerde", "mobbing", "diskriminierung"],
    action: (navigate) => navigate("record-report")
  },
  {
    id: "action-chat",
    title: "KI-Konflikthelfer öffnen",
    description: "Hol dir schnellen, anonymen Rat in schwierigen Situationen.",
    category: "Aktion",
    icon: <ShieldAlert className="w-5 h-5 text-db-red" />,
    keywords: ["chat", "ki", "hilfe", "rat", "konflikt", "streit", "helfer"],
    action: (navigate) => navigate("home") // Currently on home page
  },
  {
    id: "nav-learning",
    title: "Trainings & Quiz",
    description: "Lerne, wie du in kritischen Situationen richtig reagierst.",
    category: "Lernen",
    icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
    keywords: ["lernen", "quiz", "kurs", "training", "weiterbildung", "üben"],
    action: (navigate) => navigate("learning")
  },
  {
    id: "nav-projects",
    title: "Initiativen & Projekte",
    description: "Engagiere dich gemeinsam mit Kollegen für ein besseres Klima.",
    category: "Projekte",
    icon: <Users className="w-5 h-5 text-blue-600" />,
    keywords: ["projekt", "initiative", "mitmachen", "zivilcourage", "kampagne", "event"],
    action: (navigate) => navigate("project")
  },
  {
    id: "contact-sos",
    title: "Notfall & Akute Hilfe (Polizei)",
    description: "Sofortige Hilfe bei Gewalt oder akuter Gefahr (110).",
    category: "Kontakte",
    icon: <PhoneCall className="w-5 h-5 text-red-600" />,
    keywords: ["polizei", "notfall", "110", "gefahr", "sos", "sicherheit", "db sicherheit"],
    action: (navigate) => navigate("contacts")
  },
  {
    id: "contact-internal",
    title: "Betriebsrat & JAV finden",
    description: "Deine Interessenvertretung im Betrieb.",
    category: "Kontakte",
    icon: <PhoneCall className="w-5 h-5 text-db-dark dark:text-white" />,
    keywords: ["betriebsrat", "br", "jav", "ausbildung", "afk", "ngk", "hr", "personal"],
    action: (navigate) => navigate("contacts")
  },
  {
    id: "contact-external",
    title: "Telefonseelsorge & Beratung",
    description: "Vertrauliche Gespräche bei Sorgen und Problemen.",
    category: "Kontakte",
    icon: <PhoneCall className="w-5 h-5 text-emerald-600" />,
    keywords: ["seelsorge", "kummer", "sorgen", "reden", "psychologe", "gewalt", "frauen"],
    action: (navigate) => navigate("contacts")
  },
  {
    id: "nav-dashboard",
    title: "Startseite (Dashboard)",
    description: "Zurück zur Hauptübersicht von DB Peace.",
    category: "Navigation",
    icon: <LayoutDashboard className="w-5 h-5 text-db-dark dark:text-white" />,
    keywords: ["home", "start", "übersicht", "dashboard", "hauptseite"],
    action: (navigate) => navigate("home")
  }
];

export function GlobalSearch({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
      setQuery("");
    }
    
    // Add escape key listener
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter logic
  const filteredResults = query.trim() === "" 
    ? []
    : SEARCH_INDEX.filter(item => {
        const searchStr = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(searchStr);
        const matchesDesc = item.description.toLowerCase().includes(searchStr);
        const matchesKeywords = item.keywords.some(kw => kw.toLowerCase().includes(searchStr));
        return matchesTitle || matchesDesc || matchesKeywords;
      });

  const displayResults = query.trim() === "" ? SEARCH_INDEX.slice(0, 4) : filteredResults;

  const handleSelect = (item) => {
    item.action(onNavigate);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-db-dark/40 dark:bg-black/60 backdrop-blur-sm"
        />
        
        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white dark:bg-db-dark rounded-lg shadow-lg border border-db-dark/10 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Input Area */}
          <div className="flex items-center px-4 py-4 border-b border-db-dark/10 dark:border-white/10 bg-db-dark/5 dark:bg-white/5">
            <Search className="w-6 h-6 text-db-rail dark:text-white/50 ml-2 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Wonach suchst du? (z.B. 'Mobbing', 'Betriebsrat', 'melden')"
              className="flex-grow bg-transparent border-none outline-none px-4 text-xl font-medium text-db-dark dark:text-white placeholder:text-db-rail dark:placeholder:text-white/40"
            />
            <button 
              onClick={onClose}
              className="p-2 text-db-rail hover:text-db-dark dark:text-white/50 dark:hover:text-white bg-db-dark/5 dark:bg-white/5 hover:bg-db-dark/10 dark:hover:bg-white/10 rounded-full transition shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results Area */}
          <div className="overflow-y-auto p-2 db-scrollbar">
            {query.trim() === "" && (
              <div className="px-4 py-3 text-xs font-bold text-db-rail dark:text-white/50 uppercase tracking-wider">
                Häufig gesucht
              </div>
            )}
            
            {query.trim() !== "" && displayResults.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Search className="w-12 h-12 text-db-rail dark:text-white/30 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-db-dark dark:text-white">Keine Ergebnisse gefunden</h3>
                <p className="text-db-rail dark:text-white/60 mt-1">Versuche andere Suchbegriffe wie "Hilfe" oder "Kontakt".</p>
              </div>
            )}

            <div className="space-y-1">
              {displayResults.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between p-4 rounded-md hover:bg-db-dark/5 dark:hover:bg-white/5 transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-db-dark border border-db-dark/10 dark:border-white/10 flex items-center justify-center shadow-sm shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-db-dark dark:text-white">{item.title}</h4>
                      <p className="text-sm font-medium text-db-rail dark:text-white/60">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-db-rail dark:text-white/30 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-3 bg-db-dark/5 dark:bg-white/5 border-t border-db-dark/10 dark:border-white/10 text-xs font-semibold text-db-rail dark:text-white/50 flex justify-between items-center">
            <span>Die Suche hilft dir, schneller zum Ziel zu kommen.</span>
            <span className="flex items-center gap-1"><kbd className="bg-white dark:bg-db-dark px-1.5 py-0.5 rounded border border-db-dark/20 dark:border-white/20 shadow-sm font-sans font-bold">ESC</kbd> zum Schließen</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
