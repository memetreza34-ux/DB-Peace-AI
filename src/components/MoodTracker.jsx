import React, { useMemo, useState } from "react";
import { Frown, Meh, Smile, Trash2 } from "lucide-react";

const STORAGE_KEY = "db-peace-mood-session";

const moods = [
  { id: "bad", icon: Frown, label: "Gestresst", active: "bg-red-500 text-white", idle: "border-red-500/30 text-red-600 bg-red-500/5 dark:text-red-400" },
  { id: "neutral", icon: Meh, label: "Okay", active: "bg-amber-500 text-white", idle: "border-amber-500/30 text-amber-600 bg-amber-500/5 dark:text-amber-400" },
  { id: "good", icon: Smile, label: "Gut", active: "bg-emerald-500 text-white", idle: "border-emerald-500/30 text-emerald-600 bg-emerald-500/5 dark:text-emerald-400" },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState(() => readEntries());
  const latestEntries = useMemo(() => entries.slice(0, 3), [entries]);

  function submit(event) {
    event.preventDefault();
    if (!selectedMood) return;

    const entry = {
      id: Date.now(),
      mood: selectedMood,
      reason: selectedMood === "bad" ? reason : null,
      note: note.trim().slice(0, 300),
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...entries].slice(0, 14);
    setEntries(next);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSelectedMood(null);
    setReason(null);
    setNote("");
  }

  function clearEntries() {
    sessionStorage.removeItem(STORAGE_KEY);
    setEntries([]);
  }

  return (
    <section className="w-full rounded-xl border border-db-dark/10 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-db-dark/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-db-dark dark:text-white">Wie war deine Schicht?</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-db-rail dark:text-white/60">
            Temporäres Stimmungsprotokoll nur für diesen Browser-Tab. Nicht verschlüsselt und nicht an Analytics oder DB übertragen.
          </p>
        </div>
        {entries.length > 0 && (
          <button type="button" onClick={clearEntries} className="rounded-lg border border-db-dark/10 p-2 text-db-rail hover:border-red-300 hover:text-red-600 dark:border-white/10" title="Sitzungseinträge löschen">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const active = selectedMood === mood.id;
            return (
              <button key={mood.id} type="button" onClick={() => { setSelectedMood(mood.id); if (mood.id !== "bad") setReason(null); }} className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-black transition hover:-translate-y-0.5 ${active ? mood.active : mood.idle}`}>
                <Icon className="h-7 w-7" />
                {mood.label}
              </button>
            );
          })}
        </div>

        {selectedMood === "bad" && (
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-db-rail dark:text-white/60">Optionaler Grund</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Stress", "Team", "Führung", "Kundenkontakt", "Sonstiges"].map((item) => (
                <button key={item} type="button" onClick={() => setReason(item)} className={`rounded-lg px-3 py-1.5 text-xs font-black ${reason === item ? "bg-red-500 text-white" : "border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedMood && (
          <>
            <input value={note} onChange={(event) => setNote(event.target.value.slice(0, 300))} maxLength={300} placeholder="Optionales Stichwort ohne Klarnamen" className="w-full rounded-xl border border-db-dark/15 bg-white px-4 py-3 text-sm font-semibold text-db-dark outline-none focus:border-db-red dark:border-white/15 dark:bg-db-dark/40 dark:text-white" />
            <button type="submit" className="w-full rounded-xl bg-db-dark px-4 py-3 text-sm font-black text-white dark:bg-db-red">Für diese Sitzung übernehmen</button>
          </>
        )}
      </form>

      {latestEntries.length > 0 && (
        <div className="mt-5 border-t border-db-dark/10 pt-4 dark:border-white/10">
          <p className="text-xs font-black uppercase tracking-wide text-db-rail dark:text-white/60">Letzte Sitzungseinträge</p>
          <div className="mt-3 space-y-2">
            {latestEntries.map((entry) => {
              const mood = moods.find((item) => item.id === entry.mood);
              const Icon = mood?.icon || Meh;
              return (
                <div key={entry.id} className="flex items-start gap-3 rounded-xl bg-db-soft p-3 dark:bg-white/5">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${mood?.idle.split(" ")[1] || "text-db-rail"}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-db-dark dark:text-white">{mood?.label || "Eintrag"}{entry.reason ? ` · ${entry.reason}` : ""}</p>
                    {entry.note && <p className="mt-1 truncate text-xs font-semibold text-db-rail dark:text-white/60">{entry.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function readEntries() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.slice(0, 14) : [];
  } catch {
    return [];
  }
}
