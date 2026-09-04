import { useMemo, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { MeldewegeKarte } from "./MeldewegeKarte.jsx";
import { POSTFACH_ROLLEN } from "../config/rollen.js";
import { empfehlungsGrund, empfohleneRollen } from "../lib/empfehlung.js";
import { rolleFinden } from "../lib/rolle.js";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  ClipboardList,
  Clock3,
  EyeOff,
  FileText,
  Handshake,
  HelpCircle,
  Download,
  LockKeyhole,
  MessageSquareText,
  Mic,
  MicOff,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  UserX,
  UsersRound,
  Upload,
} from "lucide-react";

const incidentOptions = [
  {
    value: "Mobbing",
    description: "Wiederholtes Herabsetzen, Bloßstellen oder Schikanieren.",
    icon: UserX,
  },
  {
    value: "Beleidigung",
    description: "Abwertende Sprache, Beschimpfung oder persönliche Angriffe.",
    icon: MessageSquareText,
  },
  {
    value: "Hassrede",
    description: "Feindselige Aussagen gegen Gruppen oder Identitäten.",
    icon: ShieldAlert,
  },
  {
    value: "Gewaltandrohung",
    description: "Drohungen, Einschüchterung oder körperliche Eskalationsgefahr.",
    icon: AlertTriangle,
  },
  {
    value: "Diskriminierung",
    description: "Benachteiligung wegen Herkunft, Religion, Geschlecht oder Identität.",
    icon: Scale,
  },
  {
    value: "Ausgrenzung",
    description: "Systematisches Ignorieren, Ausschließen oder Informationsentzug.",
    icon: EyeOff,
  },
  {
    value: "Konflikt im Team",
    description: "Wiederkehrender Streit, Druck oder belastete Zusammenarbeit.",
    icon: UsersRound,
  },
  {
    value: "Aggressiver Kunde/Fahrgast",
    description: "Aggression, Beleidigung oder Bedrohung im Kundenkontakt.",
    icon: ShieldCheck,
  },
  {
    value: "Sonstiges",
    description: "Ein anderer Vorfall, der strukturiert eingeordnet werden soll.",
    icon: HelpCircle,
  },
];

const repetitionOptions = ["Einmalig", "Mehrfach", "Regelmäßig", "Schon länger"];
const dangerOptions = ["Nein", "Unsicher", "Ja, es könnte eskalieren", "Ja, direkte Gefahr"];
const perspectiveChips = [
  "Ich wurde direkt betroffen",
  "Ich habe es beobachtet",
  "Ich melde für eine andere Person",
  "Ich bin unsicher",
];

const initialForm = {
  type: "Mobbing",
  context: "",
  time: "",
  repetition: "Einmalig",
  description: "",
  perspectives: [],
  danger: "Nein",
  stress: 3,
  anonymous: true,
  contact: "",
};

function AnonymousReport() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [analysis, setAnalysis] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [improved, setImproved] = useState(false);
  const [error, setError] = useState("");

  const progress = Math.round((step / 5) * 100);
  const draft = useMemo(() => createDraftReport(form, analysis, improved), [analysis, form, improved]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setAnalysis(null);
    setPreviewVisible(false);
    setImproved(false);
  }

  function togglePerspective(value) {
    setForm((current) => {
      const exists = current.perspectives.includes(value);
      return {
        ...current,
        perspectives: exists
          ? current.perspectives.filter((item) => item !== value)
          : [...current.perspectives, value],
      };
    });
    setAnalysis(null);
    setPreviewVisible(false);
    setImproved(false);
  }

  function analyze() {
    if (!form.type || !form.description.trim()) {
      setError("Bitte wähle eine Art des Vorfalls aus und gib eine Beschreibung an.");
      return;
    }
    setError("");
    setAnalysis(createLocalAnalysis(form, improved));
    setPreviewVisible(false);
  }

  function improveSummary() {
    setImproved(true);
    setAnalysis(createLocalAnalysis(form, true));
    setPreviewVisible(true);
  }

  function reset() {
    setStep(1);
    setForm(initialForm);
    setAnalysis(null);
    setPreviewVisible(false);
    setImproved(false);
  }

  return (
    <section id="meldung" className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <EntryHeader />
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.86fr_1.44fr_0.9fr]">
          <aside className="space-y-4">
            <SafetyNotice />
            <TimeSavingCard />
          </aside>

          <div className="space-y-4">
            <FormShell progress={progress} step={step}>
              {step === 1 && <IncidentStep form={form} update={update} />}
              {step === 2 && <ContextStep form={form} update={update} />}
              {step === 3 && (
                <DescriptionStep form={form} togglePerspective={togglePerspective} update={update} />
              )}
              {step === 4 && <RiskStep form={form} update={update} />}
              {step === 5 && <ContactStep form={form} update={update} />}
              <StepControls
                analysis={analysis}
                onAnalyze={analyze}
                onBack={() => setStep((current) => Math.max(1, current - 1))}
                onNext={() => setStep((current) => Math.min(5, current + 1))}
                step={step}
                error={error}
              />
            </FormShell>

            {analysis && (
              <AnalysisCard
                analysis={analysis}
                form={form}
                onImprove={improveSummary}
                onPreview={() => setPreviewVisible(true)}
                onReset={reset}
              />
            )}

            {previewVisible && analysis && (
              <>
                <ReportPreview draft={draft} />
                <MeldewegeKarte entwurf={draft} />
              </>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg bg-db-dark p-5 text-white shadow-panel">
              <MessageSquareText size={24} className="text-red-200" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-bold">Lieber erst reden?</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-white/80">
                Der Peace-Assistent unten rechts hört zu und hilft dir beim Sortieren – ohne dass
                daraus eine Meldung wird.
              </p>
            </div>

            <a
              href="https://www.bkms-system.net/deutschebahn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-lg border border-line/10 bg-surface p-5 font-bold text-ink shadow-sm transition hover:border-db-red hover:text-db-red"
            >
              <span>
                Direkt zum DB-Hinweisgebersystem
                <span className="mt-1 block text-sm font-normal text-ink-muted">
                  Anonym, in zwölf Sprachen
                </span>
              </span>
              <ArrowRight size={20} aria-hidden="true" className="shrink-0" />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

function EntryHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-db-red">Anonyme Meldung</p>
        <h2 className="mt-3 text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl">
          Vorfall anonym melden
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-muted">
          Strukturiert, vertraulich und vorbereitet für eine menschliche Prüfung.
        </p>
      </div>
      <div className="rounded-lg border border-line/10 bg-db-soft dark:bg-db-dark/50 p-4 shadow-sm">
        <p className="flex items-start gap-3 text-sm font-bold text-ink">
          <LockKeyhole className="mt-0.5 shrink-0 text-db-red" size={18} aria-hidden="true" />
          Diese Demo übermittelt keine echten Meldungen.
        </p>
      </div>
    </div>
  );
}

function SafetyNotice() {
  return (
    <div className="rounded-lg border border-danger-line bg-danger p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-1 shrink-0 text-db-red" size={24} aria-hidden="true" />
        <div>
          <h3 className="text-lg font-bold text-ink">Wichtiger Hinweis</h3>
          <p className="mt-2 text-sm font-normal leading-6 text-ink-muted">
            Bei akuter Gefahr bitte sofort reale Hilfe kontaktieren. Diese Demo speichert nichts und sendet nichts an ein Backend.
          </p>
        </div>
      </div>
    </div>
  );
}

function TimeSavingCard() {
  const points = [
    "Meldungen kommen strukturierter an",
    "weniger Rückfragen durch fehlende Details",
    "schnellere Priorisierung",
    "bessere Vorbereitung für menschliche Prüfung",
    "weniger manuelle Sortierung",
  ];

  return (
    <div className="rounded-lg bg-db-dark p-5 text-white shadow-panel">
      <Clock3 size={26} className="text-red-200" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-bold">Wie das DB-Zeit sparen könnte</h3>
      <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-white/80">
        {points.map((point) => (
          <p key={point} className="flex gap-2">
            <CheckCircle2 className="mt-1 shrink-0 text-red-200" size={16} aria-hidden="true" />
            {point}
          </p>
        ))}
      </div>
    </div>
  );
}

function FormShell({ children, progress, step }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line/10 bg-db-soft dark:bg-db-dark/50 shadow-panel">
      <div className="border-b border-line/10 bg-surface  p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-db-red">Schritt {step} von 5</p>
            <h3 className="mt-1 text-2xl font-bold dark:text-white">Meldung strukturieren</h3>
          </div>
          <p className="text-sm font-medium text-ink-muted">{progress}%</p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded bg-surface-sunk ">
          <div className="h-full bg-db-red transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function IncidentStep({ form, update }) {
  return (
    <StepPanel title="Art des Vorfalls" text="Wähle die Kategorie, die am besten passt. Du kannst später weiter präzisieren.">
      <div className="grid gap-3 md:grid-cols-2">
        {incidentOptions.map(({ value, description, icon: Icon }) => {
          const active = form.type === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => update("type", value)}
              className={`group rounded-lg border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                active
                  ? "border-db-red bg-surface text-db-red"
                  : "border-line/10 bg-surface text-ink hover:border-db-red"
              }`}
            >
              <Icon size={23} className={active ? "text-db-red" : "text-ink-muted group-hover:text-db-red"} />
              <span className="mt-3 block font-bold">{value}</span>
              <span className="mt-1 block text-sm font-normal leading-6 text-ink-muted">{description}</span>
            </button>
          );
        })}
      </div>
    </StepPanel>
  );
}

function ContextStep({ form, update }) {
  return (
    <StepPanel title="Kontext" text="Beschreibe den Rahmen ohne echte Namen oder sensible Details.">
      <Field label="Bereich / Ort / Kontext">
        <input
          value={form.context}
          onChange={(event) => update("context", event.target.value)}
          className="field dark:bg-db-dark/30 dark:text-white dark:border-white/10"
          placeholder="Werkstatt, Bahnhof, Büro, Gruppenchat, Ausbildungssituation"
        />
      </Field>
      <Field label="Zeitpunkt optional">
        <input
          value={form.time}
          onChange={(event) => update("time", event.target.value)}
          className="field dark:bg-db-dark/30 dark:text-white dark:border-white/10"
          placeholder="z. B. heute Morgen, letzte Woche, wiederholt seit März"
        />
      </Field>
      <div>
        <p className="mb-3 font-bold text-ink">Wiederholung</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {repetitionOptions.map((option) => (
            <ChoiceButton
              key={option}
              active={form.repetition === option}
              onClick={() => update("repetition", option)}
            >
              {option}
            </ChoiceButton>
          ))}
        </div>
      </div>
    </StepPanel>
  );
}

function DescriptionStep({ form, togglePerspective, update }) {
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate appending transcribed text
      const currentText = form.description ? form.description + " " : "";
      update("description", currentText + "[Spracheingabe: 'Der Kollege hat mich gestern wieder vor versammelter Mannschaft angeschrien.']");
    } else {
      setIsRecording(true);
    }
  };

  return (
    <StepPanel
      title="Beschreibung"
      text="Beschreibe kurz, was passiert ist. Keine Namen nötig, wenn du anonym bleiben möchtest."
    >
      <div className="relative">
        <textarea
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          className="field min-h-44 resize-y py-3 pr-12 dark:bg-db-dark/30 dark:text-white dark:border-white/10"
          placeholder="Beschreibe kurz, was passiert ist."
        />
        <button
          type="button"
          onClick={toggleRecording}
          className={`absolute bottom-4 right-4 p-2 rounded-full transition-all shadow-sm ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-surface-sunk  text-ink hover:bg-db-dark/10 dark:hover:bg-white/10'
          }`}
          title="Diktierfunktion (Speech-to-Text)"
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Evidence Upload Simulation */}
      <div className="mt-4">
        <p className="mb-2 font-bold text-ink text-sm">Beweise hochladen (Optional)</p>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-line/20  bg-surface p-5 flex flex-col items-center justify-center text-center hover:border-db-red hover:bg-db-soft dark:hover:bg-white/5 transition-all cursor-pointer group"
        >
          <input type="file" ref={fileInputRef} className="hidden" />
          <div className="w-12 h-12 bg-line/5  rounded-full flex items-center justify-center mb-3 group-hover:bg-db-red/10 transition-colors">
            <Upload className="w-5 h-5 text-db-dark/60 dark:text-white/60 group-hover:text-db-red" />
          </div>
          <p className="font-bold text-sm text-ink">Screenshots, Chat-Verläufe oder Bilder</p>
          <p className="text-sm text-ink-muted font-medium mt-1">Bleibt auf diesem Gerät (max. 50 MB)</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 font-bold text-ink">Optionale Einordnung</p>
        <div className="flex flex-wrap gap-2">
          {perspectiveChips.map((chip) => {
            const active = form.perspectives.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => togglePerspective(chip)}
                className={`rounded px-3 py-2 text-sm font-bold transition ${
                  active ? "bg-db-red text-white" : "bg-surface text-ink hover:text-db-red"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>
    </StepPanel>
  );
}

function RiskStep({ form, update }) {
  return (
    <StepPanel title="Risiko / Dringlichkeit" text="Diese Angaben helfen bei der Priorisierung für eine menschliche Prüfung.">
      <div>
        <p className="mb-3 font-bold text-ink">Gibt es aktuell eine akute Gefahr?</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {dangerOptions.map((option) => (
            <ChoiceButton key={option} active={form.danger === option} onClick={() => update("danger", option)}>
              {option}
            </ChoiceButton>
          ))}
        </div>
      </div>
      <div className="rounded-lg bg-surface p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="font-bold text-ink">Wie belastend ist die Situation für dich?</p>
          <span className="rounded bg-db-red px-3 py-1 text-sm font-bold text-white">{form.stress}/5</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={form.stress}
          onChange={(event) => update("stress", Number(event.target.value))}
          className="mt-5 w-full accent-db-red"
        />
        <div className="mt-2 flex justify-between text-sm font-medium text-ink-muted">
          <span>gering</span>
          <span>sehr belastend</span>
        </div>
      </div>
    </StepPanel>
  );
}

function ContactStep({ form, update }) {
  const [alleZeigen, setAlleZeigen] = useState(false);

  const empfohlen = empfohleneRollen(form.type)
    .map((id) => POSTFACH_ROLLEN.find((rolle) => rolle.id === id))
    .filter(Boolean);
  const uebrige = POSTFACH_ROLLEN.filter(
    (rolle) => !empfohlen.some((eintrag) => eintrag.id === rolle.id)
  );
  const gewaehltAusUebrigen = uebrige.some((rolle) => rolle.id === form.contact);

  return (
    <StepPanel
      title="An wen soll die Meldung gehen?"
      text="Die App verschickt nichts von selbst — sie bereitet einen Entwurf vor, den du danach selbst weitergibst."
    >
      <p className="text-sm font-normal leading-6 text-ink-muted">
        {empfehlungsGrund(form.type)}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {empfohlen.map((rolle) => (
          <ChoiceButton
            key={rolle.id}
            active={form.contact === rolle.id}
            onClick={() => update("contact", rolle.id)}
          >
            {rolle.kurz}
            <span className="mt-1 block text-sm font-normal leading-6 text-ink-muted">
              {rolle.beschreibung.split(".")[0]}.
            </span>
          </ChoiceButton>
        ))}
      </div>

      {(alleZeigen || gewaehltAusUebrigen) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {uebrige.map((rolle) => (
            <ChoiceButton
              key={rolle.id}
              active={form.contact === rolle.id}
              onClick={() => update("contact", rolle.id)}
            >
              {rolle.kurz}
              <span className="mt-1 block text-sm font-normal leading-6 text-ink-muted">
                {rolle.ueberoertlich ? "Nicht an deinem Standort" : rolle.beschreibung.split(".")[0] + "."}
              </span>
            </ChoiceButton>
          ))}
        </div>
      )}

      {!alleZeigen && !gewaehltAusUebrigen && (
        <button
          type="button"
          onClick={() => setAlleZeigen(true)}
          className="mt-4 min-h-11 text-sm font-bold text-db-red underline underline-offset-4"
        >
          Andere Stelle wählen — auch außerhalb deines Standorts
        </button>
      )}

      <label className="flex items-start gap-3 rounded-lg bg-surface p-4 font-bold text-ink border border-line/10 mt-6">
        <input
          type="checkbox"
          checked={form.anonymous}
          onChange={(event) => update("anonymous", event.target.checked)}
          className="mt-1 h-5 w-5 accent-db-red cursor-pointer"
        />
        <span>
          Ich möchte komplett anonym bleiben
          <span className="block text-sm font-normal leading-6 text-ink-muted mt-1">
            Dein Entwurf bekommt dann keine Absenderzeile. Achte auch im Text darauf, keine Angaben zu nennen, an denen man dich erkennt.
          </span>
        </span>
      </label>

      {!form.anonymous && (
        <div className="rounded-lg border border-emerald-500/20 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4 text-sm font-bold leading-6 text-ok-ink flex items-start sm:items-center gap-3 mt-4">
          <BadgeCheck className="w-5 h-5 text-ok-ink shrink-0 mt-0.5 sm:mt-0" />
          <span>Dein Entwurf bekommt eine Absenderzeile zum Ausfüllen. Die App kennt deinen Namen nicht — du trägst ihn selbst ein, bevor du die Meldung weitergibst.</span>
        </div>
      )}
    </StepPanel>
  );
}

function StepPanel({ children, text, title }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-2xl font-bold text-ink">{title}</h4>
        <p className="mt-2 font-normal leading-7 text-ink-muted">{text}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ children, label }) {
  return (
    <label className="block">
      <span className="mb-2 block font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}

function ChoiceButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left font-bold transition hover:-translate-y-0.5 hover:shadow-sm ${
        active ? "border-db-red bg-surface text-db-red" : "border-line/10 bg-surface text-ink hover:border-db-red"
      }`}
    >
      {children}
    </button>
  );
}

function StepControls({ analysis, onAnalyze, onBack, onNext, step, error }) {
  return (
    <div className="mt-6">
      {error && step === 5 && (
        <p className="mb-4 text-sm font-bold text-db-red bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        className="rounded border border-line/15 bg-surface px-5 py-3 font-bold text-ink disabled:opacity-40"
        disabled={step === 1}
      >
        Zurück
      </button>
      {step < 5 ? (
        <button
          type="button"
          onClick={onNext}
          className="rounded bg-db-red px-5 py-3 font-bold text-white transition hover:bg-red-700"
        >
          Weiter
        </button>
      ) : (
        <button
          type="button"
          onClick={onAnalyze}
          className="inline-flex items-center justify-center gap-2 rounded bg-db-red px-5 py-3 font-bold text-white transition hover:bg-red-700"
        >
          {analysis ? "Meldung erneut prüfen" : "Meldung prüfen"}
          <Bot size={18} aria-hidden="true" />
        </button>
      )}
      </div>
    </div>
  );
}



function AnalysisCard({ analysis, onImprove, onPreview, onReset, form }) {
  const risk = riskStyles[analysis.risk];

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(226, 0, 26); // DB Red
    doc.text("DB Peace - Vorfallprotokoll", 20, 20);
    
    // Meta
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    const date = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    }).format(new Date());
    doc.text(`Erstellt am: ${date}`, 20, 30);
    
    // Content
    let y = 45;
    const addSection = (title, content) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(title, 20, y);
      y += 7;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      
      const splitContent = doc.splitTextToSize(content || "Keine Angabe", 170);
      doc.text(splitContent, 20, y);
      y += (splitContent.length * 6) + 10;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    };

    addSection("Kategorie", analysis.category);
    addSection("Risiko-Einschätzung", risk.label);
    addSection("Zusammenfassung", analysis.summary);
    addSection("Wichtige Details", analysis.details);
    addSection("Kontext", form?.context || "nicht angegeben");
    addSection("Beschreibung (Original)", form?.description || "nicht angegeben");
    addSection("Empfohlene Stelle", analysis.route);
    addSection("Gewählter Empfänger", rolleFinden(form?.contact)?.name || "nicht angegeben");
    addSection(
      "Absender",
      form?.anonymous
        ? "anonym — keine Angaben zur Person"
        : "Name: ________________ (vor dem Weitergeben selbst eintragen)"
    );

    doc.save("DB_Peace_Vorfallprotokoll.pdf");
  };

  return (
    <div className="rounded-lg border border-line/10 bg-surface p-5 shadow-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-db-red">Lokale KI-Demo-Analyse</p>
          <h3 className="mt-1 text-2xl font-bold dark:text-white">Professionelle Zusammenfassung</h3>
        </div>
        <span className={`w-fit rounded px-3 py-1 text-sm font-bold ${risk.className}`}>{risk.label}</span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <SummaryBlock label="Kategorie" value={analysis.category} />
        <SummaryBlock label="Risiko-Einschätzung" value={risk.label} />
        <SummaryBlock label="Kurzbeschreibung" value={analysis.summary} wide />
        <SummaryBlock label="Wichtige Details" value={analysis.details} wide />
        <SummaryBlock label="Empfohlene nächste Schritte" value={analysis.nextSteps} wide />
        <SummaryBlock label="Mögliche zuständige Stelle" value={analysis.route} wide />
        <SummaryBlock label="Was noch fehlt" value={analysis.missing} wide />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="inline-flex items-center justify-center gap-2 rounded bg-db-red px-5 py-3 font-bold text-white transition hover:bg-red-700 shadow-sm"
        >
          Als PDF herunterladen
          <Download size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex items-center justify-center gap-2 rounded bg-db-dark px-5 py-3 font-bold text-white transition hover:bg-db-red"
        >
          Vorschau ansehen
          <FileText size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded border border-line/15 bg-surface px-5 py-3 font-bold text-ink transition hover:border-db-red hover:text-db-red"
        >
          Neu starten
          <RefreshCw size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function SummaryBlock({ label, value, wide = false }) {
  return (
    <div className={`rounded bg-surface-sunk  p-4 ${wide ? "md:col-span-2" : ""}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-db-red">{label}</p>
      <p className="mt-2 whitespace-pre-line font-semibold leading-7 text-ink">{value}</p>
    </div>
  );
}

function ReportPreview({ draft }) {
  return (
    <div className="rounded-lg border border-line/10 bg-surface p-5 shadow-panel">
      <div className="flex items-start gap-3">
        <FileText className="mt-1 shrink-0 text-db-red" size={28} aria-hidden="true" />
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-db-red">Meldungsvorschau</p>
          <h3 className="mt-1 text-2xl font-bold dark:text-white">Strukturierter interner Demo-Entwurf</h3>
          <p className="mt-2 text-sm font-medium text-ink-muted">Diese Meldung wurde nicht übermittelt.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {draft.map(({ label, value, wide }) => (
          <SummaryBlock key={label} label={label} value={value} wide={wide} />
        ))}
      </div>
    </div>
  );
}

function WorkflowCard() {
  const steps = [
    "Strukturieren",
    "Risiko lokal einschätzen",
    "Entwurf prüfen",
    "Menschliche Stelle entscheidet",
  ];

  return (
    <div className="rounded-lg border border-line/10 bg-surface-sunk  p-5 shadow-sm">
      <ClipboardList size={26} className="text-db-red" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-bold dark:text-white">Workflow in der Demo</h3>
      <div className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3 rounded bg-surface p-3">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-db-red text-sm font-bold text-white">
              {index + 1}
            </span>
            <span className="text-sm font-bold text-ink">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrinciplesCard() {
  const points = [
    "Keine automatische Bestrafung",
    "Keine Überwachung",
    "Nur lokale Demo-Logik",
    "Menschliche Prüfung bleibt entscheidend",
  ];

  return (
    <div className="rounded-lg bg-db-dark p-5 text-white shadow-panel">
      <Handshake size={26} className="text-red-200" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-bold">Verantwortungsprinzipien</h3>
      <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-white/80">
        {points.map((point) => (
          <p key={point} className="flex gap-2">
            <BadgeCheck className="mt-1 shrink-0 text-red-200" size={16} aria-hidden="true" />
            {point}
          </p>
        ))}
      </div>
    </div>
  );
}

function createLocalAnalysis(form, improved = false) {
  const text = `${form.type} ${form.context} ${form.description} ${form.danger} ${form.repetition}`.toLowerCase();
  const highRisk =
    form.danger === "Ja, direkte Gefahr" ||
    form.danger === "Ja, es könnte eskalieren" ||
    containsAny(text, ["droht", "drohung", "gewalt", "schlagen", "angst", "bedroht"]);
  const repeatedHarm =
    form.repetition === "Regelmäßig" ||
    form.repetition === "Schon länger" ||
    containsAny(text, ["beleidigt", "ausgelacht", "dumm", "erniedrigt", "ausgeschlossen", "ignoriert"]);
  const discrimination = containsAny(text, ["rassistisch", "religion", "herkunft", "geschlecht", "diskrimin"]);

  const risk = highRisk ? "high" : repeatedHarm || discrimination || form.stress >= 4 ? "medium" : "low";
  const summary = improved
    ? professionalSummary(form)
    : simpleSummary(form);

  return {
    category: form.type,
    risk,
    summary,
    details: [
      `Kontext: ${form.context || "nicht angegeben"}`,
      `Zeitpunkt: ${form.time || "nicht angegeben"}`,
      `Wiederholung: ${form.repetition}`,
      `Perspektive: ${form.perspectives.length ? form.perspectives.join(", ") : "nicht angegeben"}`,
      `Belastung: ${form.stress}/5`,
    ].join("\n"),
    nextSteps:
      risk === "high"
        ? "Sofort reale Hilfe kontaktieren, Distanz herstellen und den Vorfall nicht allein klären. Danach sachliche Dokumentation vorbereiten."
        : risk === "medium"
          ? "Menschliche Prüfung vorbereiten, konkrete Beispiele ergänzen und eine zuständige Vertrauens- oder Führungsstelle einbinden."
          : "Dokumentation vervollständigen, Entwicklung beobachten und bei Wiederholung frühzeitig Unterstützung suchen.",
    route:
      risk === "high"
        ? "Leitstelle, Sicherheitsdienst, zuständige Führungskraft oder reale Notfallhilfe."
        : form.type === "Diskriminierung" || form.type === "Hassrede"
          ? "Vertrauensperson, Betriebsrat/JAV, Antidiskriminierungs- oder Personalbereich."
          : "Führungskraft, Vertrauensperson, Betriebsrat/JAV oder psychosoziale Beratung.",
    missing: missingDetails(form),
  };
}

function createDraftReport(form, analysis, improved) {
  const effectiveAnalysis = analysis || createLocalAnalysis(form, improved);
  const date = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return [
    { label: "Datum", value: date },
    { label: "Kategorie", value: form.type },
    { label: "Risiko", value: riskStyles[effectiveAnalysis.risk].label },
    { label: "Kontext", value: form.context || "nicht angegeben", wide: true },
    { label: "Beschreibung", value: form.description || "nicht angegeben", wide: true },
    { label: "Wiederholung", value: form.repetition },
    { label: "Dringlichkeit", value: form.danger },
    { label: "KI-Zusammenfassung", value: effectiveAnalysis.summary, wide: true },
    { label: "Empfohlene Weiterleitung", value: effectiveAnalysis.route, wide: true },
    {
      label: "Gewählter Empfänger",
      value: rolleFinden(form.contact)?.name || "nicht angegeben",
      wide: true,
    },
    {
      label: "Absender",
      value: form.anonymous
        ? "anonym — keine Angaben zur Person"
        : "Name: ________________ (vor dem Weitergeben selbst eintragen)",
      wide: true,
    },
  ];
}

function simpleSummary(form) {
  const description = form.description || "Es wurde noch keine Beschreibung eingetragen.";
  return `Gemeldeter Demo-Vorfall der Kategorie ${form.type}. ${description}`;
}

function professionalSummary(form) {
  const context = form.context ? ` im Kontext "${form.context}"` : "";
  const repetition = form.repetition ? ` Die Wiederholung wurde mit "${form.repetition}" angegeben.` : "";
  const description = form.description || "Eine detaillierte Beschreibung sollte noch ergänzt werden.";
  return `Es liegt ein strukturierter Demo-Entwurf zur Kategorie ${form.type}${context} vor. ${description}${repetition} Die Angaben sollten durch eine zuständige menschliche Stelle vertraulich geprüft werden.`;
}

function missingDetails(form) {
  const missing = [];
  if (!form.context.trim()) missing.push("genauer Kontext oder Bereich");
  if (!form.time.trim()) missing.push("ungefährer Zeitpunkt");
  if (!form.description.trim()) missing.push("kurze sachliche Beschreibung");
  if (!form.perspectives.length) missing.push("Perspektive der meldenden Person");
  if (!missing.length) return "Die wichtigsten Demo-Felder sind ausgefüllt. Vor echter Nutzung wären Zuständigkeit und Rechtsgrundlage zu prüfen.";
  return `Noch hilfreich: ${missing.join(", ")}.`;
}

function containsAny(text, words) {
  return words.some((word) => text.includes(word));
}

const riskStyles = {
  low: {
    label: "Niedrig",
    className: "bg-emerald-100 text-emerald-800",
  },
  medium: {
    label: "Mittel",
    className: "bg-amber-100 text-amber-800",
  },
  high: {
    label: "Hoch",
    className: "bg-red-100 text-red-800",
  },
};

export default AnonymousReport;
