import React, { useState } from "react";
import { stimmungSpeichern } from "../lib/stimmung.js";
import { motion, AnimatePresence } from "framer-motion";
import { Frown, Meh, Smile, Send, CheckCircle2 } from "lucide-react";

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null); // 'bad' | 'neutral' | 'good'
  const [reason, setReason] = useState(null); // Added for ESG tracking
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { id: "bad", icon: Frown, label: "Gestresst", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", activeBg: "bg-red-500", activeText: "text-white" },
    { id: "neutral", icon: Meh, label: "Okay", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", activeBg: "bg-amber-500", activeText: "text-white" },
    { id: "good", icon: Smile, label: "Gut", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", activeBg: "bg-emerald-500", activeText: "text-white" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) return;
    
    // Die App nennt das ein Tagebuch — also wird es auch geführt.
    stimmungSpeichern({
      stimmung: selectedMood,
      notiz: note,
      grund: selectedMood === "bad" ? reason : null,
    });

    setSubmitted(true);
    setTimeout(() => {
      // Reset after a while or leave as submitted for the day
      setSubmitted(false);
      setSelectedMood(null);
      setReason(null);
      setNote("");
    }, 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border border-line/10 bg-surface p-6"
    >
      {/* Ohne AnimatePresence mode="wait": Das wartet auf die Exit-Animation des
          alten Zustands. Läuft die nicht zu Ende, erscheint die Bestätigung nie. */}
      {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div>
              <h2 className="text-lg font-bold text-ink">Wie war deine Schicht heute?</h2>
              <p className="text-sm font-medium text-ink-muted">Dein privates Stimmungs-Tagebuch. Niemand außer dir sieht das.</p>
            </div>

            <div className="flex gap-4 mt-2">
              {moods.map((mood) => {
                const Icon = mood.icon;
                const isActive = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-md border p-4 transition-all duration-300 ${
                      isActive 
                        ? `${mood.activeBg} ${mood.border} shadow-lg scale-105` 
                        : `bg-white dark:bg-white/5 ${mood.border} hover:bg-db-warm/50 dark:hover:bg-white/10`
                    }`}
                  >
                    <Icon className={`h-8 w-8 ${isActive ? 'text-white' : mood.color}`} />
                    <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-ink/80'}`}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedMood && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 overflow-hidden"
                >
                  {selectedMood === "bad" && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="mt-2"
                    >
                      <p className="text-xs font-bold text-ink-muted mb-2 uppercase tracking-wide">
                        Woran liegt es? (Optional)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Stress", "Kollegen", "Führung", "Kunden", "Sonstiges"].map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setReason(r)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              reason === r 
                                ? "bg-red-500 text-white" 
                                : "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional: Ein kurzes Stichwort (z.B. 'Ärger mit Meister', 'Gute Fahrt')"
                    className="w-full rounded-xl border border-db-dark/20 dark:border-white/20 bg-surface dark:text-white px-4 py-3 text-sm focus:border-db-red focus:outline-none focus:ring-1 focus:ring-db-red transition placeholder:text-db-rail/50 dark:placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-db-dark dark:bg-db-red px-4 py-3 text-sm font-bold text-white transition hover:bg-black dark:hover:bg-db-red/80"
                  >
                    <Send className="h-4 w-4" />
                    <span>Eintrag speichern</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="rounded-full bg-emerald-100 dark:bg-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400 mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-ink">Gespeichert!</h2>
            <p className="text-sm font-medium text-ink-muted max-w-xs">
              Dein Eintrag wurde in dein privates Tagebuch aufgenommen. Gute Erholung!
            </p>
          </motion.div>
        )}
    </motion.div>
  );
}
