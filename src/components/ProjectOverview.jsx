import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  Info,
  Lightbulb,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

const exampleIdeas = [
  {
    id: "example-1",
    title: "Workshop-Idee: Respektvoll eingreifen",
    description: "Ein moderiertes Training könnte zeigen, wie Beobachtende Grenzen setzen, Betroffene unterstützen und bei Gefahr reale Hilfe organisieren.",
    category: "Workshop",
    status: "Beispiel",
    isExample: true,
  },
  {
    id: "example-2",
    title: "Austauschformat für Auszubildende",
    description: "Eine fachlich begleitete Sprechstunde könnte Raum für Fragen zur Ausbildung und zu Konflikten bieten. Zuständigkeit und Vertraulichkeit müssten vorher verbindlich geklärt werden.",
    category: "Austausch",
    status: "Beispiel",
    isExample: true,
  },
  {
    id: "example-3",
    title: "Informationskampagne zu Hilfewegen",
    description: "Geprüfte interne und externe Ansprechwege könnten an einem Standort verständlich und barrierearm bekannt gemacht werden.",
    category: "Information",
    status: "Beispiel",
    isExample: true,
  },
];

const categories = ["Workshop", "Austausch", "Information", "Sonstiges"];

export default function ProjectOverview() {
  const [ideas, setIdeas] = useState(exampleIdeas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", category: "Workshop" });
  const [markedIdeas, setMarkedIdeas] = useState([]);

  function toggleInterest(id) {
    setMarkedIdeas((current) => (
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    ));
  }

  function submitIdea(event) {
    event.preventDefault();
    const title = newIdea.title.trim();
    const description = newIdea.description.trim();
    if (!title || !description) return;

    const idea = {
      id: `session-${Date.now()}`,
      title: title.slice(0, 120),
      description: description.slice(0, 800),
      category: categories.includes(newIdea.category) ? newIdea.category : "Sonstiges",
      status: "Sitzungsentwurf",
      isExample: false,
    };

    setIdeas((current) => [idea, ...current]);
    setNewIdea({ title: "", description: "", category: "Workshop" });
    setIsModalOpen(false);
  }

  function removeIdea(id) {
    setIdeas((current) => current.filter((idea) => idea.id !== id));
    setMarkedIdeas((current) => current.filter((entry) => entry !== id));
  }

  function resetSession() {
    setIdeas(exampleIdeas);
    setMarkedIdeas([]);
    setNewIdea({ title: "", description: "", category: "Workshop" });
    setIsModalOpen(false);
  }

  return (
    <div className="w-full space-y-7">
      <header className="relative overflow-hidden rounded-xl border border-db-dark/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <HeartHandshake className="pointer-events-none absolute -right-12 -top-16 h-72 w-72 text-db-dark opacity-[0.035] dark:text-white" aria-hidden="true" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-wider text-db-red">Ideenwerkstatt</p>
            <h1 className="mt-2 text-3xl font-black text-db-dark dark:text-white">Projektideen als lokale Demonstration</h1>
            <p className="mt-3 text-base font-medium leading-7 text-db-rail dark:text-white/65">
              Hier werden keine Projekte veröffentlicht, Anmeldungen versendet oder DB-Profile verwendet. Neue Ideen und Markierungen
              existieren nur im Arbeitsspeicher der aktuellen Seite und verschwinden beim Neuladen.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetSession}
              className="inline-flex items-center gap-2 rounded-xl border border-db-dark/10 bg-white px-4 py-3 text-sm font-black text-db-dark transition hover:border-db-red hover:text-db-red dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Sitzung zurücksetzen
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-db-red px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              Ideenentwurf hinzufügen
            </button>
          </div>
        </div>
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-xs font-semibold leading-5 text-violet-950 dark:border-violet-800/50 dark:bg-violet-950/25 dark:text-violet-100">
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          Alle angezeigten Beispiele sind erfunden. „Merken“ ist nur eine lokale UI-Markierung und keine Teilnahme-, Kontakt- oder Unterstützungsanfrage.
          Für reale Initiativen müssen Zuständigkeit, Moderation, Datenschutz, Arbeitsschutz und betriebliche Freigabe separat geklärt werden.
        </p>
      </div>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-db-dark dark:text-white">Ideen in dieser Sitzung</h2>
            <p className="mt-1 text-sm font-semibold text-db-rail dark:text-white/55">
              {ideas.length} Einträge · {ideas.filter((idea) => !idea.isExample).length} eigene Sitzungsentwürfe
            </p>
          </div>
          <span className="rounded-full bg-db-soft px-3 py-1.5 text-xs font-black text-db-rail dark:bg-white/10 dark:text-white/55">
            {markedIdeas.length} lokal gemerkt
          </span>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {ideas.map((idea) => {
              const isMarked = markedIdeas.includes(idea.id);
              return (
                <motion.article
                  layout
                  key={idea.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="flex min-h-72 flex-col justify-between rounded-xl border border-db-dark/10 bg-white p-6 shadow-sm transition hover:border-db-red/30 hover:shadow-md dark:border-white/10 dark:bg-white/5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-db-soft px-3 py-1 text-[10px] font-black uppercase tracking-wide text-db-dark dark:bg-white/10 dark:text-white/65">
                          {idea.category}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${
                          idea.isExample
                            ? "bg-violet-100 text-violet-800"
                            : "bg-amber-100 text-amber-900"
                        }`}>
                          {idea.status}
                        </span>
                      </div>
                      {!idea.isExample && (
                        <button
                          type="button"
                          onClick={() => removeIdea(idea.id)}
                          className="rounded-lg p-2 text-db-rail transition hover:bg-red-50 hover:text-red-700 dark:text-white/45 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                          aria-label={`Idee ${idea.title} löschen`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    <h3 className="mt-4 text-xl font-black leading-tight text-db-dark dark:text-white">{idea.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-7 text-db-rail dark:text-white/65">{idea.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleInterest(idea.id)}
                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-black transition ${
                      isMarked
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/50 dark:bg-emerald-950/25 dark:text-emerald-200"
                        : "border-db-dark/10 bg-db-soft text-db-dark hover:border-db-red hover:text-db-red dark:border-white/10 dark:bg-white/5 dark:text-white"
                    }`}
                  >
                    {isMarked ? (
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Lightbulb className="h-5 w-5" aria-hidden="true" />
                    )}
                    {isMarked ? "Lokal gemerkt" : "Für diese Sitzung merken"}
                  </button>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label="Ideenformular schließen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-db-dark/65 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="idea-dialog-title"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-lg rounded-2xl border border-db-dark/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-db-dark sm:p-8"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-db-rail transition hover:bg-db-dark/5 hover:text-db-dark dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Ideenformular schließen"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-3 pr-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-db-red/10 text-db-red">
                  <ClipboardList className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-db-red">Nur aktuelle Sitzung</p>
                  <h2 id="idea-dialog-title" className="text-2xl font-black text-db-dark dark:text-white">Ideenentwurf ergänzen</h2>
                </div>
              </div>

              <form onSubmit={submitIdea} className="mt-6 space-y-5">
                <Field label="Titel">
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={newIdea.title}
                    onChange={(event) => setNewIdea((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Kurzer, sachlicher Arbeitstitel"
                    className="w-full rounded-xl border border-db-dark/15 bg-white px-4 py-3 font-semibold text-db-dark outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/15 dark:border-white/15 dark:bg-white/5 dark:text-white"
                  />
                </Field>

                <Field label="Kategorie">
                  <select
                    value={newIdea.category}
                    onChange={(event) => setNewIdea((current) => ({ ...current, category: event.target.value }))}
                    className="w-full rounded-xl border border-db-dark/15 bg-white px-4 py-3 font-semibold text-db-dark outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/15 dark:border-white/15 dark:bg-db-dark dark:text-white"
                  >
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </Field>

                <Field label="Beschreibung">
                  <textarea
                    required
                    rows={5}
                    maxLength={800}
                    value={newIdea.description}
                    onChange={(event) => setNewIdea((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Ziel, mögliche Zielgruppe und offene Prüfpunkt beschreiben. Keine echten Namen oder Falldaten eingeben."
                    className="w-full resize-none rounded-xl border border-db-dark/15 bg-white px-4 py-3 font-semibold text-db-dark outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/15 dark:border-white/15 dark:bg-white/5 dark:text-white"
                  />
                </Field>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-950">
                  Der Entwurf wird nicht veröffentlicht oder gespeichert. Nach einem Neuladen ist er gelöscht.
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-db-red py-3.5 text-sm font-black text-white transition hover:bg-red-700"
                >
                  Sitzungsentwurf hinzufügen
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ children, label }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-db-dark dark:text-white">{label}</span>
      {children}
    </label>
  );
}
