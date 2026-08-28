import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Info,
  Scale,
  Search,
} from "lucide-react";
import lawsData from "../data/lawsData.json";
import { QuizWidget } from "./QuizWidget.jsx";

const iconMap = { Scale, BookOpen, Building2, AlertCircle, CheckCircle2, Clock };

export function RightsAndLawsView({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const laws = Array.isArray(lawsData.bundesgesetze) ? lawsData.bundesgesetze : [];
  const filteredLaws = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("de-DE");
    if (!query) return laws;

    return laws.filter((law) => [law.title, law.subtitle, law.paragraph, law.officialText, law.translation, law.actionTip]
      .some((value) => String(value || "").toLocaleLowerCase("de-DE").includes(query)));
  }, [laws, searchQuery]);

  const groupedLaws = useMemo(() => filteredLaws.reduce((groups, law) => {
    const title = law.title || "Weitere Informationen";
    if (!groups[title]) groups[title] = [];
    groups[title].push(law);
    return groups;
  }, {}), [filteredLaws]);

  return (
    <div className="space-y-7 pb-24">
      <header className="relative overflow-hidden rounded-xl bg-gradient-to-r from-db-dark to-db-rail p-6 text-white shadow-md">
        <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Zurück
        </button>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-db-warm">
          <Scale className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          Orientierung zu gesetzlichen Grundlagen
        </div>
        <h1 className="mt-3 text-3xl font-black">Rechte verständlich einordnen</h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/75">
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
          Kuratierter Datensatz · zuletzt geprüft am {formatCheckDate(lawsData.lastChecked)}
        </div>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-white/75">
          Die Karten paraphrasieren ausgewählte Bundesgesetze und verlinken die amtliche Einzelnorm. Sie ersetzen keine Rechtsberatung und keine Prüfung des konkreten Arbeits-, Tarif- oder Ausbildungskontexts.
        </p>
      </header>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200">
        <span className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Die App reicht keine Beschwerde ein und entscheidet nicht, ob ein Rechtsverstoß vorliegt. Vor wichtigen Schritten die verlinkte aktuelle Norm und bei Bedarf JAV, Betriebsrat, Gewerkschaft oder fachkundige Rechtsberatung einbeziehen.
        </span>
      </div>

      <div className="mx-auto max-w-3xl">
        <QuizWidget />
      </div>

      <label className="group relative mx-auto block max-w-3xl">
        <span className="sr-only">Gesetzliche Grundlagen durchsuchen</span>
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-db-dark/35 group-focus-within:text-db-red dark:text-white/35" aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          maxLength={120}
          onChange={(event) => setSearchQuery(event.target.value.slice(0, 120))}
          placeholder="Suche nach Berufsschule, Arbeitszeit, Beschwerde …"
          className="w-full rounded-xl border border-db-dark/10 bg-white py-3.5 pl-11 pr-20 text-sm font-semibold text-db-dark shadow-sm outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/20 dark:border-white/10 dark:bg-db-dark/50 dark:text-white"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-db-rail/60 dark:text-white/40" aria-hidden="true">{filteredLaws.length}</span>
      </label>

      <div className="mx-auto max-w-3xl space-y-9">
        {filteredLaws.length > 0 ? Object.entries(groupedLaws).map(([groupTitle, groupLaws]) => (
          <section key={groupTitle}>
            <h2 className="border-l-4 border-db-red pl-3 text-xl font-black text-db-dark dark:text-white">{groupTitle}</h2>
            <div className="mt-4 space-y-3">
              {groupLaws.map((law) => (
                <LawCard
                  key={law.id}
                  law={law}
                  isOpen={openCard === law.id}
                  onToggle={() => setOpenCard((current) => current === law.id ? null : law.id)}
                />
              ))}
            </div>
          </section>
        )) : (
          <div className="rounded-xl border border-db-dark/10 bg-white py-12 text-center dark:border-white/10 dark:bg-db-dark/50">
            <Scale className="mx-auto h-11 w-11 text-db-dark/10 dark:text-white/10" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-black text-db-dark dark:text-white">Keine Inhalte gefunden</h2>
            <p className="mt-1 text-sm font-semibold text-db-rail dark:text-white/60">Versuche einen allgemeineren Suchbegriff.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LawCard({ law, isOpen, onToggle }) {
  const Icon = iconMap[law.icon] || Scale;
  const panelId = `law-panel-${law.id}`;

  return (
    <article className={`overflow-hidden rounded-xl border bg-white transition dark:bg-db-dark/50 ${isOpen ? "border-db-red/40 shadow-lg" : "border-db-dark/10 hover:border-db-dark/20 dark:border-white/10 dark:hover:border-white/20"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 p-4 text-left outline-none focus:ring-2 focus:ring-inset focus:ring-db-red/30 sm:p-5"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-db-red/10 text-db-red"><Icon className="h-5 w-5" aria-hidden="true" /></div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-db-rail dark:text-white/60">{law.subtitle}</p>
            <h3 className="mt-1 font-black text-db-dark dark:text-white">{law.paragraph}</h3>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-db-rail transition-transform dark:text-white/50 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div id={panelId} className="space-y-4 border-t border-db-dark/5 px-4 pb-5 pt-4 dark:border-white/5 sm:px-5">
          <div className="rounded-xl border-l-4 border-db-rail bg-db-dark/5 p-4 dark:bg-white/5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-db-dark dark:text-white"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Kernaussage · paraphrasiert</p>
            <p className="mt-2 text-sm font-medium leading-6 text-db-dark dark:text-white">{law.officialText}</p>
          </div>

          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 dark:border-teal-900/60 dark:bg-teal-950/25">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-teal-800 dark:text-teal-300"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> Vereinfacht eingeordnet</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-teal-950 dark:text-teal-200">{law.translation}</p>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-db-soft p-4 dark:bg-white/5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-db-red" aria-hidden="true" />
            <div>
              <p className="text-xs font-black text-db-dark dark:text-white">Allgemeiner nächster Schritt</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-db-rail dark:text-white/60">{law.actionTip}</p>
            </div>
          </div>

          <a
            href={law.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-db-dark/10 bg-white px-4 py-2.5 text-xs font-black text-db-dark transition hover:border-db-red hover:text-db-red focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/10 dark:bg-db-dark dark:text-white"
          >
            Amtliche Einzelnorm öffnen
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      )}
    </article>
  );
}

function formatCheckDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return "nicht dokumentiert";
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}
