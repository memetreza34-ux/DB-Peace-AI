import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, FileText, Loader2, Send, ShieldAlert } from "lucide-react";

export function AISmartReport({ onReportGenerated }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [mode, setMode] = useState(null);
  const [error, setError] = useState("");
  const activeControllerRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      activeControllerRef.current?.abort();
      activeControllerRef.current = null;
    };
  }, []);

  async function handleGenerate(event) {
    event.preventDefault();
    const text = input.trim();
    if (text.length < 20 || isLoading) {
      setError("Beschreibe den Vorfall bitte mit mindestens 20 Zeichen.");
      return;
    }

    activeControllerRef.current?.abort();
    const controller = new AbortController();
    activeControllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 25_000);

    setIsLoading(true);
    setError("");
    setGeneratedReport(null);
    setMode(null);

    try {
      const response = await fetch("/api/report/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.report) throw new Error(data.error || "extract_failed");
      if (!isMountedRef.current || controller.signal.aborted) return;

      setGeneratedReport(normalizeReport(data.report, text));
      setMode("ai");
    } catch (requestError) {
      if (!isMountedRef.current || activeControllerRef.current !== controller) return;
      if (requestError?.name === "AbortError" && controller.signal.aborted) {
        setError("Der KI-Dienst hat nicht rechtzeitig geantwortet. Es wurde ein lokaler Fallback-Entwurf erstellt.");
      }
      setGeneratedReport(createLocalDraft(text));
      setMode("local");
    } finally {
      window.clearTimeout(timeout);
      if (activeControllerRef.current === controller) activeControllerRef.current = null;
      if (isMountedRef.current) setIsLoading(false);
    }
  }

  function acceptReport() {
    if (!generatedReport || !mode) return;
    onReportGenerated({ ...generatedReport, sourceMode: mode });
    setGeneratedReport(null);
    setInput("");
    setMode(null);
    setError("");
  }

  function editText() {
    setGeneratedReport(null);
    setMode(null);
    setError("");
  }

  return (
    <section className="overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-sm dark:border-white/10 dark:bg-db-dark/50">
      <header className="bg-gradient-to-r from-db-dark to-db-rail p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Bot className="h-5 w-5 text-db-red" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-black">KI-gestützter Meldungsentwurf</h2>
            <p className="mt-1 text-xs font-semibold text-white/65">Soll Angaben aus deinem Text strukturieren. Prüfe jedes Feld vor der Übernahme, weil KI-Ausgaben fehlerhaft sein können.</p>
          </div>
        </div>
      </header>

      <div className="space-y-5 p-5">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
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
              disabled={isLoading}
              placeholder="Beispiel: Am Dienstag wurde ich während der Teambesprechung mehrfach vor anderen abgewertet. Zwei Kolleg:innen waren anwesend …"
              className="mt-2 w-full resize-y rounded-xl border border-db-dark/15 bg-white p-4 text-sm font-medium leading-6 text-db-dark outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/20 disabled:cursor-wait disabled:opacity-70 dark:border-white/15 dark:bg-db-dark/40 dark:text-white"
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold text-db-rail/60 dark:text-white/40">{input.length}/4000</span>
            <button type="submit" disabled={input.trim().length < 20 || isLoading} className="inline-flex items-center gap-2 rounded-xl bg-db-red px-5 py-3 text-sm font-black text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-db-red/30 disabled:cursor-not-allowed disabled:opacity-40">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
              {isLoading ? "Strukturiert …" : "Entwurf erstellen"}
            </button>
          </div>
        </form>

        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/25 dark:text-red-300">{error}</p>}

        {generatedReport && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/25">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <h3 className="font-black">Strukturierter Entwurf</h3>
              </div>
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-800 dark:bg-black/20 dark:text-emerald-300">
                {mode === "ai" ? "Gemini" : "Lokaler Fallback"}
              </span>
            </div>

            {mode === "local" ? (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-100/80 p-3 text-xs font-semibold leading-5 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Die KI war nicht erreichbar. Der lokale Basisentwurf übernimmt nur deinen Originaltext; Kategorie, Zeit, Ort, Zeug:innen und Dringlichkeit bleiben offen.
              </p>
            ) : (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-100/80 p-3 text-xs font-semibold leading-5 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                KI-Ausgaben können Angaben falsch zuordnen oder ergänzen. Vergleiche alle Felder mit deinem Originaltext, bevor du den Entwurf übernimmst.
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
              <ReportField label="Noch zu ergänzen" value={generatedReport.missingFields.length ? generatedReport.missingFields.join(", ") : "Keine Lücke von der KI gemeldet – bitte selbst prüfen"} wide />
            </dl>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={editText} className="rounded-xl border border-emerald-300 px-4 py-3 text-sm font-black text-emerald-900 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-emerald-800 dark:text-emerald-200">
                Text weiter bearbeiten
              </button>
              <button type="button" onClick={acceptReport} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30">
                <FileText className="h-4 w-4" aria-hidden="true" />
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
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-emerald-950 dark:text-emerald-200">{value}</dd>
    </div>
  );
}

function normalizeReport(report, sourceText) {
  return {
    category: valueOrNotProvided(report.category),
    description: valueOrNotProvided(report.description, sourceText),
    date: valueOrNotProvided(report.date),
    time: valueOrNotProvided(report.time),
    location: valueOrNotProvided(report.location),
    witnesses: valueOrNotProvided(report.witnesses),
    urgency: valueOrNotProvided(report.urgency),
    missingFields: Array.isArray(report.missingFields) ? report.missingFields : [],
  };
}

function createLocalDraft(sourceText) {
  return {
    category: "Nicht angegeben",
    description: sourceText,
    date: "Nicht angegeben",
    time: "Nicht angegeben",
    location: "Nicht angegeben",
    witnesses: "Nicht angegeben",
    urgency: "Nicht automatisch bewertet",
    missingFields: ["Kategorie prüfen", "Datum prüfen", "Uhrzeit prüfen", "Ort prüfen", "mögliche Zeug:innen ergänzen", "Dringlichkeit durch eine Person prüfen"],
  };
}

function valueOrNotProvided(value, fallback = "Nicht angegeben") {
  const text = String(value ?? "").trim();
  return text || fallback;
}
