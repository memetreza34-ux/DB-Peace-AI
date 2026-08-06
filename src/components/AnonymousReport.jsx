import React, { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clipboard,
  Download,
  EyeOff,
  FileText,
  LockKeyhole,
  Scale,
  ShieldAlert,
  UserX,
  UsersRound,
} from "lucide-react";

const incidentOptions = [
  ["Mobbing", "Wiederholtes Herabsetzen, Bloßstellen oder Schikanieren.", UserX],
  ["Beleidigung", "Abwertende Sprache oder persönliche Angriffe.", AlertTriangle],
  ["Diskriminierung", "Benachteiligung wegen eines persönlichen Merkmals.", Scale],
  ["Bedrohung oder Gewalt", "Drohung, Einschüchterung oder körperliche Eskalation.", ShieldAlert],
  ["Ausgrenzung", "Systematisches Ignorieren oder Ausschließen.", EyeOff],
  ["Konflikt im Team", "Wiederkehrender Streit oder belastete Zusammenarbeit.", UsersRound],
  ["Aggressiver Kundenkontakt", "Aggression, Beleidigung oder Bedrohung im Kundenkontakt.", ShieldAlert],
  ["Sonstiges", "Ein anderer Vorfall, der sachlich strukturiert werden soll.", FileText],
];

const repetitionOptions = ["Einmalig", "Mehrfach", "Regelmäßig", "Schon länger", "Unklar"];
const dangerOptions = ["Keine akute Gefahr", "Unsicher", "Eskalation möglich", "Direkte Gefahr"];
const perspectiveOptions = ["Direkt betroffen", "Beobachtet", "Für andere Person", "Unsicher"];
const recipientOptions = [
  "Noch offen",
  "Ausbildungsbetreuung",
  "JAV oder Betriebsrat",
  "Vertrauensperson",
  "Führungskraft",
  "Compliance- oder Beschwerdestelle",
];

const initialForm = {
  type: "Mobbing",
  context: "",
  date: "",
  time: "",
  repetition: "Einmalig",
  description: "",
  perspective: "Direkt betroffen",
  danger: "Keine akute Gefahr",
  stress: 3,
  recipient: "Noch offen",
  anonymousDraft: true,
};

export default function AnonymousReport() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const analysis = useMemo(() => createLocalAnalysis(form), [form]);
  const reportId = useMemo(() => createReportId(), []);
  const reportText = useMemo(() => createReportText(form, analysis, reportId), [form, analysis, reportId]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setCopied(false);
  }

  function next() {
    const validationError = validateStep(step, form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setStep((current) => Math.min(5, current + 1));
  }

  function back() {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
    } catch {
      setError("Der Text konnte nicht automatisch kopiert werden. Nutze stattdessen den PDF-Export.");
    }
  }

  function downloadPdf() {
    const doc = new jsPDF();
    const margin = 18;
    const width = 174;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(226, 0, 26);
    doc.text("DB Peace – Meldungsentwurf", margin, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text("Lokaler Demonstrationsentwurf – nicht automatisch übermittelt", margin, y);
    y += 10;

    const lines = doc.splitTextToSize(reportText, width);
    for (const line of lines) {
      if (y > 278) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 5.2;
    }

    doc.save(`DB-Peace-Meldungsentwurf-${reportId}.pdf`);
  }

  function reset() {
    setForm(initialForm);
    setStep(1);
    setError("");
    setCopied(false);
  }

  return (
    <section className="space-y-6">
      <header className="grid gap-5 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-db-red">Meldungsentwurf</p>
          <h1 className="mt-2 text-3xl font-black text-db-dark dark:text-white sm:text-4xl">Vorfall in fünf Schritten strukturieren</h1>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-db-rail dark:text-white/60">
            Erstelle einen sachlichen Entwurf für ein späteres Gespräch oder eine Meldung. Die App sendet nichts und stellt keine Verbindung zu einer internen Stelle her.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm font-semibold leading-6 text-violet-950 dark:border-violet-900/50 dark:bg-violet-950/25 dark:text-violet-200">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
          Keine Klarnamen, Personalnummern oder vertraulichen Anhänge eingeben. Dieser Entwurf bleibt nur im aktuellen React-Zustand.
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.5fr]">
        <aside className="space-y-4">
          <Progress step={step} />
          <SafetyCard analysis={analysis} />
          <div className="rounded-xl border border-db-dark/10 bg-white p-4 text-xs font-semibold leading-5 text-db-rail shadow-sm dark:border-white/10 dark:bg-db-dark/50 dark:text-white/60">
            <strong className="block text-db-dark dark:text-white">Wichtig</strong>
            Die lokale Einstufung ist nur eine technische Orientierung anhand deiner Auswahl und einzelner Schlüsselwörter. Menschen müssen den Sachverhalt prüfen.
          </div>
        </aside>

        <div className="overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-sm dark:border-white/10 dark:bg-db-dark/50">
          <div className="border-b border-db-dark/10 bg-db-soft px-5 py-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase tracking-wide text-db-red">Schritt {step} von 5</p>
            <h2 className="mt-1 text-xl font-black text-db-dark dark:text-white">{stepTitles[step - 1]}</h2>
          </div>

          <div className="p-5 sm:p-6">
            {step === 1 && <IncidentStep form={form} update={update} />}
            {step === 2 && <FactsStep form={form} update={update} />}
            {step === 3 && <RiskStep form={form} update={update} />}
            {step === 4 && <RoutingStep form={form} update={update} />}
            {step === 5 && <ReviewStep form={form} analysis={analysis} reportId={reportId} />}

            {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/25 dark:text-red-300">{error}</p>}

            <div className="mt-6 flex flex-col gap-3 border-t border-db-dark/10 pt-5 dark:border-white/10 sm:flex-row sm:justify-between">
              <button type="button" onClick={back} disabled={step === 1} className="inline-flex items-center justify-center gap-2 rounded-xl border border-db-dark/15 px-5 py-3 text-sm font-black text-db-dark disabled:opacity-30 dark:border-white/15 dark:text-white">
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </button>

              {step < 5 ? (
                <button type="button" onClick={next} className="inline-flex items-center justify-center gap-2 rounded-xl bg-db-red px-5 py-3 text-sm font-black text-white hover:bg-red-700">
                  Weiter
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  <button type="button" onClick={() => void copyReport()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-db-dark/15 px-4 py-3 text-xs font-black text-db-dark dark:border-white/15 dark:text-white">
                    {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Clipboard className="h-4 w-4" />}
                    {copied ? "Kopiert" : "Text kopieren"}
                  </button>
                  <button type="button" onClick={downloadPdf} className="inline-flex items-center justify-center gap-2 rounded-xl bg-db-dark px-4 py-3 text-xs font-black text-white dark:bg-white dark:text-db-dark">
                    <Download className="h-4 w-4" />
                    PDF exportieren
                  </button>
                  <button type="button" onClick={reset} className="rounded-xl bg-db-red px-4 py-3 text-xs font-black text-white hover:bg-red-700">Neu starten</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const stepTitles = [
  "Kategorie und Kontext",
  "Sachverhalt und Fakten",
  "Dringlichkeit und Belastung",
  "Geplanter nächster Schritt",
  "Entwurf prüfen und exportieren",
];

function Progress({ step }) {
  return (
    <div className="rounded-xl bg-db-dark p-5 text-white shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-red-200">Fortschritt</p>
      <div className="mt-4 space-y-3">
        {stepTitles.map((title, index) => {
          const number = index + 1;
          const done = number < step;
          const active = number === step;
          return (
            <div key={title} className="flex items-center gap-3">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${done ? "bg-emerald-500" : active ? "bg-db-red" : "bg-white/10"}`}>
                {done ? "✓" : number}
              </span>
              <span className={`text-xs font-bold ${active ? "text-white" : "text-white/60"}`}>{title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SafetyCard({ analysis }) {
  const tones = {
    niedrig: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/25 dark:text-emerald-200",
    mittel: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200",
    hoch: "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/25 dark:text-red-200",
    akut: "border-red-400 bg-red-100 text-red-950 dark:border-red-700 dark:bg-red-950/45 dark:text-red-100",
  };

  return (
    <div className={`rounded-xl border p-4 ${tones[analysis.urgency]}`}>
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5" />
        <p className="font-black">Lokale Orientierung: {analysis.urgency}</p>
      </div>
      <p className="mt-2 text-xs font-semibold leading-5">{analysis.nextStep}</p>
    </div>
  );
}

function IncidentStep({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {incidentOptions.map(([value, description, Icon]) => (
          <button key={value} type="button" onClick={() => update("type", value)} className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${form.type === value ? "border-db-red bg-db-red/5" : "border-db-dark/10 hover:border-db-red/40 dark:border-white/10"}`}>
            <Icon className={`h-5 w-5 ${form.type === value ? "text-db-red" : "text-db-rail dark:text-white/50"}`} />
            <span className="mt-3 block font-black text-db-dark dark:text-white">{value}</span>
            <span className="mt-1 block text-xs font-semibold leading-5 text-db-rail dark:text-white/60">{description}</span>
          </button>
        ))}
      </div>
      <Field label="Ort oder Kontext" hint="Keine Klarnamen verwenden.">
        <input value={form.context} onChange={(event) => update("context", event.target.value.slice(0, 180))} maxLength={180} placeholder="Werkstatt, Bahnhof, Büro, Gruppenchat …" className="field dark:border-white/15 dark:bg-db-dark/40 dark:text-white" />
      </Field>
    </div>
  );
}

function FactsStep({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Datum optional"><input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} className="field dark:border-white/15 dark:bg-db-dark/40 dark:text-white" /></Field>
        <Field label="Uhrzeit optional"><input type="time" value={form.time} onChange={(event) => update("time", event.target.value)} className="field dark:border-white/15 dark:bg-db-dark/40 dark:text-white" /></Field>
      </div>
      <Field label="Wie oft ist es passiert?">
        <ChoiceGrid options={repetitionOptions} value={form.repetition} onChange={(value) => update("repetition", value)} />
      </Field>
      <Field label="Was ist konkret passiert?" hint="Trenne Beobachtungen von Vermutungen. Möglichst genauer Wortlaut, Handlungen und anwesende Personen – ohne Klarnamen.">
        <textarea value={form.description} onChange={(event) => update("description", event.target.value.slice(0, 3_000))} maxLength={3_000} rows={8} placeholder="Sachliche Beschreibung …" className="field resize-y dark:border-white/15 dark:bg-db-dark/40 dark:text-white" />
        <p className="mt-1 text-right text-[10px] font-bold text-db-rail/60 dark:text-white/40">{form.description.length}/3000</p>
      </Field>
      <Field label="Deine Perspektive"><ChoiceGrid options={perspectiveOptions} value={form.perspective} onChange={(value) => update("perspective", value)} /></Field>
    </div>
  );
}

function RiskStep({ form, update }) {
  return (
    <div className="space-y-6">
      <Field label="Besteht gerade Gefahr?"><ChoiceGrid options={dangerOptions} value={form.danger} onChange={(value) => update("danger", value)} /></Field>
      <div className="rounded-xl border border-db-dark/10 bg-db-soft p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-black text-db-dark dark:text-white">Wie stark belastet dich die Situation?</p>
            <p className="mt-1 text-xs font-semibold text-db-rail dark:text-white/60">Nur zur Orientierung im Entwurf.</p>
          </div>
          <span className="rounded-lg bg-db-red px-3 py-1 text-sm font-black text-white">{form.stress}/5</span>
        </div>
        <input type="range" min="1" max="5" value={form.stress} onChange={(event) => update("stress", Number(event.target.value))} className="mt-5 w-full accent-db-red" />
      </div>
    </div>
  );
}

function RoutingStep({ form, update }) {
  return (
    <div className="space-y-5">
      <Field label="Für wen soll der Entwurf vorbereitet werden?" hint="Die Auswahl sendet nichts.">
        <ChoiceGrid options={recipientOptions} value={form.recipient} onChange={(value) => update("recipient", value)} />
      </Field>
      <label className="flex items-start gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 dark:border-white/10 dark:bg-white/5">
        <input type="checkbox" checked={form.anonymousDraft} onChange={(event) => update("anonymousDraft", event.target.checked)} className="mt-1 h-5 w-5 accent-db-red" />
        <span>
          <strong className="block text-db-dark dark:text-white">Entwurf ohne persönliche Angaben formulieren</strong>
          <span className="mt-1 block text-xs font-semibold leading-5 text-db-rail dark:text-white/60">Die App kennt ohnehin kein DB-Profil. Diese Einstellung kennzeichnet nur deine gewünschte Form des exportierten Textes.</span>
        </span>
      </label>
    </div>
  );
}

function ReviewStep({ form, analysis, reportId }) {
  const rows = [
    ["Entwurfsnummer", reportId],
    ["Kategorie", form.type],
    ["Ort / Kontext", form.context || "Nicht angegeben"],
    ["Datum und Uhrzeit", `${form.date || "Nicht angegeben"}${form.time ? `, ${form.time} Uhr` : ""}`],
    ["Wiederholung", form.repetition],
    ["Perspektive", form.perspective],
    ["Gefahr", form.danger],
    ["Belastung", `${form.stress}/5`],
    ["Geplanter Empfänger", form.recipient],
    ["Form", form.anonymousDraft ? "Ohne persönliche Angaben" : "Persönliche Angaben können später manuell ergänzt werden"],
    ["Lokale Dringlichkeit", analysis.urgency],
  ];

  return (
    <div className="space-y-5">
      {(analysis.urgency === "hoch" || analysis.urgency === "akut") && (
        <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-900 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
          {analysis.nextStep}
        </div>
      )}
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-db-soft p-4 dark:bg-white/5">
            <dt className="text-[10px] font-black uppercase tracking-wide text-db-red">{label}</dt>
            <dd className="mt-1 text-sm font-semibold leading-6 text-db-dark dark:text-white">{value}</dd>
          </div>
        ))}
        <div className="rounded-xl bg-db-soft p-4 sm:col-span-2 dark:bg-white/5">
          <dt className="text-[10px] font-black uppercase tracking-wide text-db-red">Sachverhalt</dt>
          <dd className="mt-1 whitespace-pre-wrap text-sm font-semibold leading-6 text-db-dark dark:text-white">{form.description}</dd>
        </div>
      </dl>
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold leading-5 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/25 dark:text-emerald-200">
        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />
        Prüfe alle Angaben vor dem Export. Eine zuständige Person muss entscheiden, ob und wie der Entwurf verwendet wird.
      </div>
    </div>
  );
}

function ChoiceGrid({ options, value, onChange }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <button key={option} type="button" onClick={() => onChange(option)} className={`rounded-xl border px-4 py-3 text-left text-sm font-black transition ${value === option ? "border-db-red bg-db-red/5 text-db-red" : "border-db-dark/10 text-db-dark hover:border-db-red/40 dark:border-white/10 dark:text-white"}`}>
          {option}
        </button>
      ))}
    </div>
  );
}

function Field({ children, label, hint }) {
  return (
    <label className="block">
      <span className="font-black text-db-dark dark:text-white">{label}</span>
      {hint && <span className="mt-1 block text-xs font-semibold leading-5 text-db-rail dark:text-white/60">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function validateStep(step, form) {
  if (step === 1 && !form.type) return "Wähle eine Kategorie.";
  if (step === 2 && form.description.trim().length < 20) return "Beschreibe den Sachverhalt mit mindestens 20 Zeichen.";
  if (step === 3 && !form.danger) return "Wähle eine Einschätzung zur aktuellen Gefahr.";
  if (step === 4 && !form.recipient) return "Wähle einen geplanten nächsten Schritt oder „Noch offen“.";
  return "";
}

function createLocalAnalysis(form) {
  const text = `${form.type} ${form.context} ${form.description} ${form.danger}`.toLowerCase();
  const acute = form.danger === "Direkte Gefahr" || ["waffe", "messer", "schuss", "akute gefahr"].some((word) => text.includes(word));
  const high = form.danger === "Eskalation möglich" || ["drohung", "bedroht", "gewalt", "schlagen", "angst"].some((word) => text.includes(word));
  const medium = form.stress >= 4 || form.repetition === "Regelmäßig" || form.repetition === "Schon länger" || ["mobbing", "diskrimin", "rassistisch", "ausgeschlossen"].some((word) => text.includes(word));
  const urgency = acute ? "akut" : high ? "hoch" : medium ? "mittel" : "niedrig";
  const nextStep = urgency === "akut"
    ? "Sicherheit zuerst: Verlasse wenn möglich die Gefahrenzone und hole sofort reale Hilfe über 110 oder 112. Erstelle den Entwurf erst, wenn du sicher bist."
    : urgency === "hoch"
      ? "Beziehe zeitnah eine reale Vertrauens- oder Sicherheitsstelle ein und kläre die Situation nicht allein."
      : urgency === "mittel"
        ? "Dokumentiere konkrete Beispiele und vereinbare zeitnah ein Gespräch mit einer zuständigen Person."
        : "Vervollständige die Fakten und beobachte die Entwicklung. Hole bei Wiederholung frühzeitig Unterstützung.";
  return { urgency, nextStep };
}

function createReportText(form, analysis, reportId) {
  return [
    "DB PEACE – LOKALER MELDUNGSENTWURF",
    "Keine automatische Übermittlung · keine offizielle DB-Meldung",
    "",
    `Entwurfsnummer: ${reportId}`,
    `Erstellt: ${new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date())}`,
    `Kategorie: ${form.type}`,
    `Ort / Kontext: ${form.context || "Nicht angegeben"}`,
    `Datum: ${form.date || "Nicht angegeben"}`,
    `Uhrzeit: ${form.time || "Nicht angegeben"}`,
    `Wiederholung: ${form.repetition}`,
    `Perspektive: ${form.perspective}`,
    `Aktuelle Gefahr: ${form.danger}`,
    `Belastung: ${form.stress}/5`,
    `Geplanter Empfänger: ${form.recipient}`,
    `Gewünschte Form: ${form.anonymousDraft ? "ohne persönliche Angaben" : "persönliche Angaben später manuell ergänzen"}`,
    `Lokale Orientierung zur Dringlichkeit: ${analysis.urgency}`,
    "",
    "SACHVERHALT",
    form.description,
    "",
    "NÄCHSTER SCHRITT",
    analysis.nextStep,
    "",
    "Hinweis: Angaben und Einordnung vor Verwendung durch eine zuständige menschliche Stelle prüfen.",
  ].join("\n");
}

function createReportId() {
  const suffix = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8).toUpperCase()
    : Math.random().toString(36).slice(2, 10).toUpperCase();
  return `DEMO-${suffix}`;
}
