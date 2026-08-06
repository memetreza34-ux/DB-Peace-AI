import React, { useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, FileText, Loader2, Send, ShieldAlert } from "lucide-react";

export function AISmartReport({ onReportGenerated }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [mode, setMode] = useState(null);
  const [error, setError] = useState("");

  async function handleGenerate(event) {
    event.preventDefault();
    const text = input.trim();
    if (text.length < 20 || isLoading) {
      setError("Beschreibe den Vorfall bitte mit mindestens 20 Zeichen.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25_000);
      const response = await fetch("/api/report/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.report) throw new Error(data.error || "extract_failed");

      setGeneratedReport(normalizeReport(data.report, text));
      setMode("ai");
    } catch {
      setGeneratedReport(createLocalDraft(text));
      setMode("local");
    } finally {
      setIsLoading(false);
    }
  }

  function acceptReport() {
    if (!generatedReport) return;
    onReportGenerated(generatedReport);
    setGeneratedReport(null);
    setInput("");
    setMode(null);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-sm dark:border-white/10 dark:bg-db-dark/50">
      <header className="bg-gradient-to-r from-db-dark to-db-rail p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Bot className="h-5 w-5 text-db-red" />
          </div>
          <div>
            <h2 className="font-black">KI-gestützter Meldungsentwurf</h2>
            <p className="mt-1 text-xs font-semibold text-white/65">Extrahiert nur Angaben aus deinem Text und erfindet keine Fakten.</p>
          </div>
        </div>
      </header>

      <div className="space-y-5 p-5">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          Keine Klarnamen, Personalnummern, Telefonnummern oder vertraulichen Dokumentinhalte eingeben. Der Entwurf wird nicht automatisch versendet.
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <label className="block">
            <span className="text-sm font-black text-db-dark dark:text-white">Was ist passiert?</span>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, 4_000))}
              maxLength={4_000}
              rows={7}
              placeholder="Beispiel: Am Dienstag wurde ich während der Teambesprechung mehrfach vor anderen abgewertet. Zwei Kolleg:innen waren anwesend …"
              className="mt-2 w-full resize-y rounded-xl border border-db-dark/15 bg-white p-4 text-sm font-medium leading-6 text-db-dark outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/20 dark:border-white/15 dark:bg-db-dark/40 dark:text-white"
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold text-db-rail/60 dark:text-white/40">{input.length}/4000</span>
            <button type="submit" disabled={input.trim().length < 20 || isLoading} className="inline-flex items-center gap-2 rounded-xl bg-db-red px-5 py-3 text-sm font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isLoading ? "Strukturiert …" : "Entwurf erstellen"}
            </button>
          </div>
        </form>

        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

        {generatedReport && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/25">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="font-black">Strukturierter Entwurf</h3>
              </div>
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-800 dark:bg-black/20 dark:text-emerald-300">
                {mode === "ai" ? "Gemini" : "Lokaler Fallback"}
              </span>
            </div>

            {mode === "local" && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-100/80 p-3 text-xs font-semibold leading-5 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                Die KI war nicht erreichbar. Der Entwurf wurde nur mit einfacher lokaler Schlüsselwortlogik erstellt.
              </p>
            )}

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <ReportField label="Kategorie" value={generatedReport.category} />
              <ReportField label="Dringlichkeit" value={generatedReport.urgency} />
              <ReportField label="Datum" value={generatedReport.date} />
              <ReportField label="Uhrzeit" value={generatedReport.time} />
              <ReportField label="Ort / Kontext" value={generatedReport.location} />
              <ReportField label="Zeug:innen" value={generatedReport.witnesses} />
              <ReportField label="Sachliche Beschreibung" value={generatedReport.description} wide />
              <ReportField label="Noch zu ergänzen" value={generatedReport.missingFields.length ? generatedReport.missingFields.join(", ") : "Keine offensichtlichen Lücken erkannt"} wide />
            </dl>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setGeneratedReport(null)} className="rounded-xl border border-emerald-300 px-4 py-3 text-sm font-black text-emerald-900 hover:bg-white/50 dark:border-emerald-800 dark:text-emerald-200">
                Text weiter bearbeiten
              </button>
              <button type="button" onClick={acceptReport} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white hover:bg-emerald-800">
                <FileText className="h-4 w-4" />
                In Demo-Protokoll übernehmen
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ReportField({ label, value, wide = false }) {
  return (
    <div className={`rounded-xl bg-white/70 p-3 dark:bg-black/15 ${wide ? "sm:col-span-2" : ""}`}>
      <dt className="text-[10px] font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm font-semibold leading-6 text-emerald-950 dark:text-emerald-200">{value}</dd>
    </div>
  );
}

function normalizeReport(report, sourceText) {
  const now = new Date();
  const dateFallback = now.toISOString().split("T")[0];
  const timeFallback = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  return {
    category: report.category || "Vorfall / Konflikt",
    description: report.description || sourceText,
    date: report.date === "Nicht angegeben" ? dateFallback : report.date || dateFallback,
    time: report.time === "Nicht angegeben" ? timeFallback : report.time || timeFallback,
    location: report.location || "Nicht angegeben",
    witnesses: report.witnesses || "Nicht angegeben",
    urgency: report.urgency || "mittel",
    missingFields: Array.isArray(report.missingFields) ? report.missingFields : [],
  };
}

function createLocalDraft(sourceText) {
  const lower = sourceText.toLowerCase();
  const urgency = ["waffe", "messer", "schlagen", "akute gefahr"].some((word) => lower.includes(word))
    ? "akut"
    : ["drohung", "bedroht", "gewalt", "angst"].some((word) => lower.includes(word))
      ? "hoch"
      : ["mobbing", "diskrimin", "beleidigt", "ausgeschlossen"].some((word) => lower.includes(word))
        ? "mittel"
        : "niedrig";

  const category = lower.includes("diskrimin") || lower.includes("rassistisch")
    ? "Diskriminierung"
    : lower.includes("droh") || lower.includes("gewalt")
      ? "Bedrohung / Gewalt"
      : lower.includes("mobbing") || lower.includes("ausgeschlossen")
        ? "Mobbing / Ausgrenzung"
        : "Vorfall / Konflikt";

  const now = new Date();
  return {
    category,
    description: sourceText,
    date: now.toISOString().split("T")[0],
    time: now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    location: lower.includes("bahnhof") ? "Bahnhof" : lower.includes("zug") ? "Zug" : "Nicht angegeben",
    witnesses: "Nicht angegeben",
    urgency,
    missingFields: ["Datum und Uhrzeit prüfen", "Ort prüfen", "mögliche Zeug:innen ergänzen"],
  };
}
