import React, { useState, useMemo } from "react";
import { Scale, ArrowLeft, BookOpen, AlertCircle, ChevronDown, CheckCircle2, Info, Building2, BookText, Search } from "lucide-react";
import lawsData from "../data/lawsData.json";
import { QuizWidget } from "./QuizWidget";

const iconMap = {
  Scale, BookOpen, Building2, AlertCircle, CheckCircle2, BookText
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
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-db-dark/20 bg-white shadow-lg' : 'border-db-dark/10 bg-white hover:border-db-dark/20 hover:shadow-md'}`}
      >
        {/* Card Header (Clickable) */}
        <button 
          onClick={() => toggleCard(law.id)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-${law.color}-50 shrink-0`}>
              <Icon className={`h-6 w-6 text-${law.color}-600`} />
            </div>
            <div>
              <p className="text-sm font-bold text-db-rail">{law.subtitle}</p>
              <h3 className="text-lg font-black text-db-dark">{law.paragraph}</h3>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-db-dark/50 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Card Content (Expandable) */}
        {isOpen && (
          <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-2 animate-fadeIn border-t border-db-dark/5 mt-2">
            
            <div className="space-y-5 mt-4">
              {/* Official Text */}
              <div className="bg-db-dark/5 rounded-xl p-4 border-l-4 border-db-rail">
                <p className="text-xs font-bold text-db-dark uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Offizieller Text
                </p>
                <p className="text-sm font-medium text-db-dark italic">"{law.officialText}"</p>
              </div>

              {/* Translation */}
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                <p className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Auf gut Deutsch
                </p>
                <p className="text-sm font-semibold text-teal-900">{law.translation}</p>
              </div>

              {/* Action Tip */}
              <div className="flex items-start gap-3 p-3 bg-db-warm/30 rounded-lg">
                <Info className="h-5 w-5 text-db-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-db-dark">Tipp für die Praxis:</p>
                  <p className="text-xs font-semibold text-db-rail">{law.actionTip}</p>
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
      <div className="rounded-2xl bg-gradient-to-r from-db-dark via-db-dark/90 to-db-rail p-6 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Dashboard
          </button>
          
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-db-warm backdrop-blur-md">
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            <span>Säule 4: Transparenz & Rechte</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Deine Rechte & Gesetze
          </h1>
          <p className="text-sm font-medium text-white/80 leading-relaxed">
            Lass dir nichts gefallen. Hier findest du übersetzt auf "gut Deutsch", welche Gesetze und internen DB-Richtlinien dich vor Ausbeutung und Diskriminierung schützen.
          </p>
        </div>
      </div>

      {/* Interactive Quiz Widget */}
      <div className="max-w-3xl mx-auto -mt-2 mb-8 relative z-20">
        <QuizWidget />
      </div>

      {/* Tabs */}
      <div className="flex bg-db-dark/5 p-1 rounded-xl w-full max-w-md mx-auto">
        <button
          onClick={() => { setActiveTab("bundesgesetze"); setOpenCard(null); setSearchQuery(""); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition ${activeTab === 'bundesgesetze' ? 'bg-white text-db-dark shadow-sm' : 'text-db-rail hover:text-db-dark'}`}
        >
          Bundesgesetze
        </button>
        <button
          onClick={() => { setActiveTab("dbRichtlinien"); setOpenCard(null); setSearchQuery(""); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition ${activeTab === 'dbRichtlinien' ? 'bg-white text-db-dark shadow-sm' : 'text-db-rail hover:text-db-dark'}`}
        >
          DB Richtlinien
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-db-dark/40 group-focus-within:text-db-red transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Suche nach Rechten (z.B. Urlaub, Überstunden, Mobbing)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-db-dark/10 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium text-db-dark placeholder:text-db-dark/40 focus:outline-none focus:ring-2 focus:ring-db-red/20 focus:border-db-red shadow-sm transition-all"
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-bold text-db-dark/40">
            {filteredLaws.length} Treffer
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-10 max-w-3xl mx-auto mt-8">
        {filteredLaws.length > 0 ? (
          Object.entries(groupedLaws).map(([title, laws]) => (
            <div key={title} className="space-y-4">
              <h2 className="text-xl font-black text-db-dark pl-3 border-l-4 border-db-red/80">{title}</h2>
              <div className="space-y-4 pl-4 border-l-2 border-db-dark/10 ml-3">
                {laws.map(renderCard)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-db-dark/10">
            <Scale className="h-12 w-12 text-db-dark/10 mx-auto mb-3" />
            <h3 className="text-lg font-black text-db-dark">Keine Gesetze gefunden</h3>
            <p className="text-sm font-medium text-db-rail mt-1">
              Wir konnten kein passendes Gesetz zu deiner Suche finden.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
