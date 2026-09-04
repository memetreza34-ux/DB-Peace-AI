import React, { useState, useMemo } from "react";
import { Scale, ArrowLeft, BookOpen, AlertCircle, ChevronDown, CheckCircle2, Info, Building2, BookText, Search, Activity } from "lucide-react";
import lawsData from "../data/lawsData.json";
import { QuizWidget } from "./QuizWidget";
import { AzubiRightsCheck } from "./AzubiRightsCheck.jsx";

const iconMap = {
  Scale, BookOpen, Building2, AlertCircle, CheckCircle2, BookText
};

/*
  Hier standen vierzehn Farbwelten für Gesetzeskarten. Die Farbe kodierte
  nichts — welches Gesetz wäre „pink"? Im DB-Erscheinungsbild trägt Rot den
  Akzent, alles andere ist Grau und Weiß.
*/

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
        className={`rounded-md border transition-all duration-300 overflow-hidden ${isOpen ? 'border-line/20  bg-surface  shadow-lg' : 'border-line/10 bg-surface hover:border-line/20  hover:shadow-md'}`}
      >
        {/* Card Header (Clickable) */}
        <button 
          onClick={() => toggleCard(law.id)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 pt-0.5">
              <Icon className="h-6 w-6 text-db-red" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-muted">{law.subtitle}</p>
              <h3 className="text-lg font-schild font-bold text-ink">{law.paragraph}</h3>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-db-dark/50 dark:text-white/50 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Card Content (Expandable) */}
        {isOpen && (
          <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-2 animate-fadeIn border-t border-line/5  mt-2">
            
            <div className="space-y-4 mt-4">
              {/* Official Text */}
              <div className="bg-line/5  rounded-xl p-4 border-l-4 border-db-rail">
                <p className="text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Offizieller Text
                </p>
                <p className="text-sm font-medium text-ink italic">"{law.officialText}"</p>
                {law.quelle && (
                  <p className="mt-2 text-sm font-normal text-ink-muted ">
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
              <div className="flex items-start gap-3 p-3 bg-surface-sunk  rounded-lg">
                <Info className="h-5 w-5 text-db-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-ink">Tipp für die Praxis:</p>
                  <p className="text-sm font-normal text-ink-muted">{law.actionTip}</p>
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
      <div className="border-l-4 border-db-red pl-4">
        <div className="space-y-2 max-w-2xl relative z-10">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/20 transition "
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Dashboard
          </button>
          
          <div className="flex items-center gap-2 font-schild text-sm font-semibold uppercase tracking-[0.18em] text-ink-muted">
            <Scale className="h-4 w-4 text-db-red" />
            <span>Deine Rechte</span>
          </div>
          <h1 className="mt-2 font-schild text-4xl font-bold leading-[0.98] tracking-tight text-ink">
            Deine Rechte & Gesetze
          </h1>
          {/* Kein Live-Abgleich: Die Texte liegen statisch in src/data/lawsData.json.
              Ein "Live Sync API"-Siegel hätte Aktualität vorgetäuscht, die es nicht gibt. */}
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-sm font-medium text-white/70 bg-white/10 px-2 py-0.5 rounded border border-white/20">
              <Activity className="w-3 h-3" />
              Orientierung, keine Rechtsberatung
            </span>
          </div>
          <p className="mt-3 max-w-[52ch] text-base font-normal leading-relaxed text-ink-muted">
            Lass dir nichts gefallen. Hier findest du übersetzt auf "gut Deutsch", welche Gesetze und internen DB-Richtlinien dich vor Ausbeutung und Diskriminierung schützen.
          </p>
        </div>
      </div>

      {/* Interactive Quiz Widget */}
      <div className="max-w-3xl mx-auto -mt-2 mb-8 relative z-20">
        <QuizWidget />
      </div>

      {/* Die häufigsten Alltagsfragen, bevor es zu den Paragrafen geht */}
      <div className="max-w-3xl mx-auto mb-10">
        <AzubiRightsCheck />
      </div>

      {/* Tabs */}
      <div className="flex bg-line/5  p-1 rounded-xl w-full max-w-md mx-auto">
        <button
          onClick={() => { setActiveTab("bundesgesetze"); setOpenCard(null); setSearchQuery(""); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${activeTab === 'bundesgesetze' ? 'bg-surface  text-ink shadow-sm' : 'text-ink-muted hover:text-ink '}`}
        >
          Bundesgesetze
        </button>
        <button
          onClick={() => { setActiveTab("dbRichtlinien"); setOpenCard(null); setSearchQuery(""); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${activeTab === 'dbRichtlinien' ? 'bg-surface  text-ink shadow-sm' : 'text-ink-muted hover:text-ink '}`}
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
          className="w-full bg-surface border border-line/10 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium text-ink placeholder:text-db-dark/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-db-red/20 focus:border-db-red shadow-sm transition-all"
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-sm font-medium text-db-dark/40 dark:text-white/40">
            {filteredLaws.length} Treffer
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-8 max-w-3xl mx-auto mt-8">
        {filteredLaws.length > 0 ? (
          Object.entries(groupedLaws).map(([title, laws]) => (
            <div key={title} className="space-y-4">
              <h2 className="text-xl font-schild font-bold text-ink pl-3 border-l-4 border-db-red/80">{title}</h2>
              <div className="space-y-4 pl-4 border-l-2 border-line/10 ml-3">
                {laws.map(renderCard)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-surface rounded-md border border-line/10">
            <Scale className="h-12 w-12 text-db-dark/10 dark:text-white/10 mx-auto mb-3" />
            <h3 className="text-lg font-schild font-bold text-ink">Keine Gesetze gefunden</h3>
            <p className="text-sm font-medium text-ink-muted mt-1">
              Wir konnten kein passendes Gesetz zu deiner Suche finden.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
