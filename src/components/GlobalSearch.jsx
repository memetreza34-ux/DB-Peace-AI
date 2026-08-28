import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  FileText,
  GraduationCap,
  HeartHandshake,
  Info,
  LayoutDashboard,
  PhoneCall,
  Scale,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import { useModalDialog } from "../hooks/useModalDialog.js";

const searchIndex = [
  {
    id: "report-draft",
    title: "Meldungsentwurf vorbereiten",
    description: "Einen Vorfall strukturiert festhalten, kopieren oder als PDF exportieren. Es wird nichts automatisch versendet.",
    category: "Vorbereiten",
    icon: FileText,
    iconClass: "text-db-red",
    keywords: ["melden", "vorfall", "entwurf", "beschwerde", "mobbing", "diskriminierung", "pdf"],
    target: "record-report",
  },
  {
    id: "ai-guide",
    title: "Startseite mit KI-Begleiter",
    description: "Der KI-Begleiter unten rechts gibt unverbindliche Orientierung und kann einen lokalen Fallback verwenden.",
    category: "Orientierung",
    icon: ShieldAlert,
    iconClass: "text-violet-600",
    keywords: ["chat", "ki", "hilfe", "orientierung", "konflikt", "begleiter"],
    target: "home",
  },
  {
    id: "learning",
    title: "Demo-Training und Wissens-Quiz",
    description: "Lokale Szenarien üben oder KI-/Fallback-Fragen beantworten. Kein offizieller Abschluss.",
    category: "Lernen",
    icon: GraduationCap,
    iconClass: "text-emerald-600",
    keywords: ["lernen", "quiz", "kurs", "training", "üben", "szenario"],
    target: "learning",
  },
  {
    id: "rights",
    title: "Rechte und Gesetze zur Orientierung",
    description: "Allgemeine Hinweise mit Quellen öffnen. Keine Rechtsberatung und keine Einzelfallentscheidung.",
    category: "Orientierung",
    icon: Scale,
    iconClass: "text-blue-600",
    keywords: ["recht", "gesetz", "arbeitszeit", "berufsschule", "jav", "bbig", "jarbschg"],
    target: "rights",
  },
  {
    id: "contacts",
    title: "Geprüfte externe Hilfe und interne Suchwege",
    description: "110, 112 und externe Beratung sowie Hinweise zum Finden bestätigter interner Kontakte.",
    category: "Hilfe",
    icon: PhoneCall,
    iconClass: "text-red-600",
    keywords: ["polizei", "notfall", "110", "112", "telefonseelsorge", "beratung", "kontakt", "jav", "betriebsrat"],
    target: "contacts",
  },
  {
    id: "ideas",
    title: "Projektideen als Demo verwalten",
    description: "Fiktive Ideen ansehen und eigene Entwürfe nur für die aktuelle Sitzung ergänzen.",
    category: "Demo",
    icon: HeartHandshake,
    iconClass: "text-amber-600",
    keywords: ["projekt", "idee", "initiative", "workshop", "kampagne", "entwurf"],
    target: "project",
  },
  {
    id: "privacy",
    title: "Datenschutz- und Sicherheitsstatus",
    description: "Nachlesen, welche Schutzmaßnahmen umgesetzt sind und welche vor einem Pilotbetrieb fehlen.",
    category: "Transparenz",
    icon: Info,
    iconClass: "text-slate-600",
    keywords: ["datenschutz", "sicherheit", "dsgvo", "speicherung", "verschlüsselung", "compliance"],
    target: "privacy",
  },
  {
    id: "analytics",
    title: "Szenario-Rechner",
    description: "Ausschließlich fiktive Annahmen und eine transparente Rechenhilfe anzeigen.",
    category: "Demo",
    icon: BarChart3,
    iconClass: "text-purple-600",
    keywords: ["analytics", "kennzahl", "kpi", "kosten", "dashboard", "szenario", "demo"],
    target: "analytics",
  },
  {
    id: "home",
    title: "Zur Übersicht",
    description: "Die Hauptübersicht des Innovationsprototyps öffnen.",
    category: "Navigation",
    icon: LayoutDashboard,
    iconClass: "text-db-dark dark:text-white",
    keywords: ["home", "start", "übersicht", "dashboard", "hauptseite"],
    target: "home",
  },
];

export function GlobalSearch({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  useModalDialog({ isOpen, onClose, dialogRef: panelRef, initialFocusRef: inputRef });

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  const displayResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("de-DE");
    if (!normalized) return searchIndex.slice(0, 5);

    return searchIndex.filter((item) => {
      const searchable = [item.title, item.description, item.category, ...item.keywords]
        .join(" ")
        .toLocaleLowerCase("de-DE");
      return searchable.includes(normalized);
    });
  }, [query]);

  function selectResult(item) {
    onNavigate(item.target);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[8vh] sm:px-6">
          <motion.button
            type="button"
            aria-label="Suche schließen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-db-dark/55 backdrop-blur-sm focus:outline-none"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-search-title"
            initial={{ opacity: 0, scale: 0.97, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -16 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-db-dark/10 bg-white shadow-2xl outline-none dark:border-white/10 dark:bg-db-dark"
          >
            <div className="flex items-center border-b border-db-dark/10 bg-db-soft px-4 py-4 dark:border-white/10 dark:bg-white/5">
              <Search className="ml-1 h-6 w-6 shrink-0 text-db-rail dark:text-white/50" aria-hidden="true" />
              <label className="sr-only" htmlFor="global-search-input">Bereiche durchsuchen</label>
              <input
                id="global-search-input"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value.slice(0, 120))}
                maxLength={120}
                placeholder="Bereich oder Thema suchen"
                className="min-w-0 flex-1 bg-transparent px-4 text-lg font-bold text-db-dark outline-none placeholder:text-db-rail/70 dark:text-white dark:placeholder:text-white/35"
              />
              <button type="button" onClick={onClose} className="rounded-full p-2 text-db-rail transition hover:bg-db-dark/10 hover:text-db-dark focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Suche schließen">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto p-2" role="search">
              <div className="px-4 py-3 text-xs font-black uppercase tracking-wider text-db-rail dark:text-white/45" role="status" aria-live="polite">
                {query.trim() ? `${displayResults.length} Treffer` : "Wichtige Bereiche"}
              </div>

              {displayResults.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Search className="mx-auto h-10 w-10 text-db-rail/35 dark:text-white/25" aria-hidden="true" />
                  <h2 id="global-search-title" className="mt-4 text-lg font-black text-db-dark dark:text-white">Keine passenden Bereiche</h2>
                  <p className="mt-2 text-sm font-medium text-db-rail dark:text-white/55">Nutze Begriffe wie „Meldung“, „Notfall“, „Rechte“ oder „Datenschutz“.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h2 id="global-search-title" className="sr-only">App-Bereiche durchsuchen</h2>
                  {displayResults.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button type="button" key={item.id} onClick={() => selectResult(item)} className="group flex w-full items-center justify-between gap-4 rounded-xl p-4 text-left transition hover:bg-db-soft focus:outline-none focus:ring-2 focus:ring-inset focus:ring-db-red/30 dark:hover:bg-white/5">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-db-dark/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"><Icon className={`h-5 w-5 ${item.iconClass}`} aria-hidden="true" /></div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-black text-db-dark dark:text-white">{item.title}</h3>
                              <span className="rounded-full bg-db-dark/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-db-rail dark:bg-white/10 dark:text-white/45">{item.category}</span>
                            </div>
                            <p className="mt-1 text-sm font-medium leading-6 text-db-rail dark:text-white/55">{item.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 shrink-0 text-db-rail/40 transition group-hover:translate-x-1 group-hover:text-db-red dark:text-white/25" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-db-dark/10 bg-db-soft px-5 py-3 text-xs font-semibold text-db-rail dark:border-white/10 dark:bg-white/5 dark:text-white/45">
              <span>Die Suche öffnet nur vorhandene Bereiche und führt keine Aktion automatisch aus.</span>
              <span><kbd className="rounded border border-db-dark/15 bg-white px-1.5 py-0.5 font-sans font-black dark:border-white/15 dark:bg-db-dark">Esc</kbd> schließt</span>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
