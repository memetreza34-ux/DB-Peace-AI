import React, { useState, useMemo } from "react";
import { Scale, ArrowLeft, BookOpen, AlertCircle, ChevronDown, CheckCircle2, Info, Building2, BookText, Search, Activity } from "lucide-react";
import lawsData from "../data/lawsData.json";
import { QuizWidget } from "./QuizWidget";
import { AzubiRightsCheck } from "./AzubiRightsCheck.jsx";

const iconMap = {
  Scale, BookOpen, Building2, AlertCircle, CheckCircle2, BookText
};

const colorMap = {
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  lime: { bg: 'bg-lime-50', text: 'text-lime-600', border: 'border-lime-200' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
};

export function RightsAndLawsView({ onBack }) {
  const [activeTab, setActiveTab] = useState("bundesgesetze"); // bundesgesetze | dbRichtlinien
  const [openCard, setOpenCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCard = (id) => {
    if (openCard === id) {
      setOpenCard(null);
    } else {
      setOpenCard(id);
    }
  };

  // Filter laws based on search query
  const filteredLaws = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const lawsToFilter = lawsData[activeTab] || [];
    
    if (!query) return lawsToFilter;

    return lawsToFilter.filter(law => 
      law.title.toLowerCase().includes(query) ||
      law.subtitle.toLowerCase().includes(query) ||
      law.officialText.toLowerCase().includes(query) ||
      law.translation.toLowerCase().includes(query)
    );
  }, [activeTab, searchQuery]);

  // Group laws by title
  const groupedLaws = useMemo(() => {
    const groups = {};
    filteredLaws.forEach(law => {
      if (!groups[law.title]) {
        groups[law.title] = [];
      }
      groups[law.title].push(law);
    });
    return groups;
  }, [filteredLaws]);

  const renderCard = (law) => {
    const Icon = iconMap[law.icon] || Scale;
    const isOpen = openCard === law.id;

    return (
      <div 
        key={law.id} 
        className={`rounded-md border transition-all duration-300 overflow-hidden ${isOpen ? 'border-db-dark/20 dark:border-white/20 bg-white dark:bg-db-dark shadow-lg' : 'border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50 hover:border-db-dark/20 dark:hover:border-white/20 hover:shadow-md'}`}
      >
        {/* Card Header (Clickable) */}
        <button 
          onClick={() => toggleCard(law.id)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${colorMap[law.color]?.bg || 'bg-gray-50 dark:bg-db-dark/50'} shrink-0`}>
              <Icon className={`h-6 w-6 ${colorMap[law.color]?.text || 'text-gray-600 dark:text-white/60'}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-db-rail dark:text-white/60">{law.subtitle}</p>
              <h3 className="text-lg font-black text-db-dark dark:text-white">{law.paragraph}</h3>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-db-dark/50 dark:text-white/50 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Card Content (Expandable) */}
        {isOpen && (
          <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-2 animate-fadeIn border-t border-db-dark/5 dark:border-white/5 mt-2">
            
            <div className="space-y-5 mt-4">
              {/* Official Text */}
              <div className="bg-db-dark/5 dark:bg-white/5 rounded-xl p-4 border-l-4 border-db-rail">
                <p className="text-xs font-bold text-db-dark dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Offizieller Text
                </p>
                <p className="text-sm font-medium text-db-dark dark:text-white italic">"{law.officialText}"</p>
                {law.quelle && (
                  <p className="mt-2 text-[11px] font-semibold text-db-rail dark:text-white/50">
                    Quelle:{" "}
                    {law.quelleUrl ? (
                      <a
                        href={law.quelleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-db-red"
                      >
                        {law.quelle}
                      </a>
                    ) : (
                      law.quelle
                    )}
                  </p>
                )}
              </div>

              {/* Translation */}
              <div className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-4 border border-teal-100 dark:border-teal-800">
                <p className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Auf gut Deutsch
                </p>
                <p className="text-sm font-semibold text-teal-900 dark:text-teal-300">{law.translation}</p>
              </div>

              {/* Action Tip */}
              <div className="flex items-start gap-3 p-3 bg-db-soft dark:bg-db-dark/30 rounded-lg">
                <Info className="h-5 w-5 text-db-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-db-dark dark:text-white">Tipp für die Praxis:</p>
                  <p className="text-xs font-semibold text-db-rail dark:text-white/60">{law.actionTip}</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="rounded-md bg-gradient-to-r from-db-dark via-db-dark/90 to-db-rail p-6 text-white shadow-md relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Dashboard
          </button>
          
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-db-warm backdrop-blur-md">
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            <span>Deine Rechte</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Deine Rechte & Gesetze
          </h1>
          {/* Kein Live-Abgleich: Die Texte liegen statisch in src/data/lawsData.json.
              Ein "Live Sync API"-Siegel hätte Aktualität vorgetäuscht, die es nicht gibt. */}
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded border border-white/20">
              <Activity className="w-3 h-3" />
              Orientierung, keine Rechtsberatung
            </span>
          </div>
          <p className="text-sm font-medium text-white/80 leading-relaxed">
            Lass dir nichts gefallen. Hier findest du übersetzt auf "gut Deutsch", welche Gesetze und internen DB-Richtlinien dich vor Ausbeutung und Diskriminierung schützen.
          </p>
        </div>
      </div>

      {/* Die häufigsten Alltagsfragen, bevor es zu den Paragrafen geht */}
      <div className="max-w-3xl mx-auto mb-10">
        <AzubiRightsCheck />
      </div>

      {/* Tabs */}
      <div className="flex bg-db-dark/5 dark:bg-white/5 p-1 rounded-xl w-full max-w-md mx-auto">
        <button
          onClick={() => { setActiveTab("bundesgesetze"); setOpenCard(null); setSearchQuery(""); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition ${activeTab === 'bundesgesetze' ? 'bg-white dark:bg-db-dark text-db-dark dark:text-white shadow-sm' : 'text-db-rail dark:text-white/60 hover:text-db-dark dark:hover:text-white'}`}
        >
          Bundesgesetze
        </button>
        <button
          onClick={() => { setActiveTab("dbRichtlinien"); setOpenCard(null); setSearchQuery(""); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition ${activeTab === 'dbRichtlinien' ? 'bg-white dark:bg-db-dark text-db-dark dark:text-white shadow-sm' : 'text-db-rail dark:text-white/60 hover:text-db-dark dark:hover:text-white'}`}
        >
          DB Richtlinien
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-db-dark/40 dark:text-white/40 group-focus-within:text-db-red transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Suche nach Rechten (z.B. Urlaub, Überstunden, Mobbing)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-db-dark/50 border border-db-dark/10 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium text-db-dark dark:text-white placeholder:text-db-dark/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-db-red/20 focus:border-db-red shadow-sm transition-all"
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-bold text-db-dark/40 dark:text-white/40">
            {filteredLaws.length} Treffer
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-10 max-w-3xl mx-auto mt-8">
        {filteredLaws.length > 0 ? (
          Object.entries(groupedLaws).map(([title, laws]) => (
            <div key={title} className="space-y-4">
              <h2 className="text-xl font-black text-db-dark dark:text-white pl-3 border-l-4 border-db-red/80">{title}</h2>
              <div className="space-y-4 pl-4 border-l-2 border-db-dark/10 dark:border-white/10 ml-3">
                {laws.map(renderCard)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-db-dark/50 rounded-md border border-db-dark/10 dark:border-white/10">
            <Scale className="h-12 w-12 text-db-dark/10 dark:text-white/10 mx-auto mb-3" />
            <h3 className="text-lg font-black text-db-dark dark:text-white">Keine Gesetze gefunden</h3>
            <p className="text-sm font-medium text-db-rail dark:text-white/60 mt-1">
              Wir konnten kein passendes Gesetz zu deiner Suche finden.
            </p>
          </div>
        )}
      </div>

      {/* Das Quiz steht am Ende: erst die Antwort auf die eigene Frage, dann
          das Angebot, mehr zu wissen. */}
      <div className="max-w-3xl mx-auto mt-10">
        <QuizWidget />
      </div>
    </div>
  );
}
