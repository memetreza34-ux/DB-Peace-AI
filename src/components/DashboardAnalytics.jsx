import { useMemo, useState } from "react";
import {
  BadgeEuro,
  CheckCircle2,
  Clock3,
  ClipboardList,
  FlaskConical,
  Route,
  ShieldAlert,
} from "lucide-react";

const scenarioCategories = [
  ["Mobbing", 4],
  ["Diskriminierung", 3],
  ["Konflikt im Team", 6],
  ["Bedrohung oder Gewalt", 2],
  ["Aggressiver Kundenkontakt", 5],
  ["Sonstiges", 5],
];

const scenarioRisks = [
  ["Niedrig", 36, "bg-emerald-500", "text-emerald-700", "bg-emerald-50"],
  ["Mittel", 48, "bg-amber-500", "text-amber-700", "bg-amber-50"],
  ["Hoch", 16, "bg-red-600", "text-red-700", "bg-red-50"],
];

function DashboardAnalytics() {
  const [cases, setCases] = useState(25);
  const [minutes, setMinutes] = useState(60);
  const [hourlyCost, setHourlyCost] = useState(50);
  const [savingPercent, setSavingPercent] = useState(35);

  const savings = useMemo(() => {
    const totalHours = clampNumber((cases * minutes) / 60, 0, 1_000_000);
    const savedHours = clampNumber(totalHours * (savingPercent / 100), 0, totalHours);
    const monthly = clampNumber(savedHours * hourlyCost, 0, 100_000_000);
    return { totalHours, savedHours, monthly, yearly: monthly * 12 };
  }, [cases, hourlyCost, minutes, savingPercent]);

  const assumptions = [
    { title: "Erfundene Vorgänge pro Monat", value: formatNumber(cases), explanation: "Frei veränderbare Annahme, keine gemessene Fallzahl.", icon: ClipboardList },
    { title: "Minuten pro Vorgang", value: formatNumber(minutes), explanation: "Angenommene manuelle Bearbeitungszeit.", icon: Clock3 },
    { title: "Angenommene Zeitersparnis", value: `${formatNumber(savingPercent)} %`, explanation: "Hypothese für die Szenariorechnung, nicht validiert.", icon: Route },
    { title: "Interne Kostenannahme", value: formatCurrency(hourlyCost), explanation: "Frei gesetzter Rechenwert pro Arbeitsstunde.", icon: BadgeEuro },
  ];

  return (
    <section id="dashboard" className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <EntryHeader />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {assumptions.map(({ explanation, icon: Icon, title, value }) => (
            <article key={title} className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"><Icon size={22} aria-hidden="true" /></span>
              <p className="mt-4 text-3xl font-black text-db-dark dark:text-white">{value}</p>
              <h2 className="mt-2 text-sm font-black text-db-rail dark:text-white/70">{title}</h2>
              <p className="mt-2 text-xs font-semibold leading-5 text-db-rail dark:text-white/55">{explanation}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <CategoryBreakdown />
          <RiskOverview />
        </div>

        <Calculator
          cases={cases}
          hourlyCost={hourlyCost}
          minutes={minutes}
          savings={savings}
          savingPercent={savingPercent}
          setCases={setCases}
          setHourlyCost={setHourlyCost}
          setMinutes={setMinutes}
          setSavingPercent={setSavingPercent}
        />

        <SavingsExplanation />
      </div>
    </section>
  );
}

function EntryHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-db-red">Szenario-Rechner</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-db-dark dark:text-white sm:text-5xl">Erfundene Annahmen transparent durchrechnen</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-db-rail dark:text-white/65">
          Diese Seite verarbeitet keine echten Fälle und belegt keine Einsparung. Sie zeigt ausschließlich, wie ein späterer Business Case mit intern validierten Daten berechnet werden könnte.
        </p>
      </div>
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 shadow-sm dark:border-violet-900/50 dark:bg-violet-950/25">
        <p className="flex items-start gap-3 text-sm font-black text-violet-950 dark:text-violet-100">
          <FlaskConical className="mt-0.5 shrink-0 text-violet-700 dark:text-violet-300" size={18} aria-hidden="true" />
          Alle Zahlen, Verteilungen und Ergebnisse sind frei erfundene Szenariowerte.
        </p>
        <p className="mt-3 text-sm font-semibold leading-6 text-violet-900/75 dark:text-violet-100/70">
          Keine Prognose, keine Überwachung, keine Leistungsbewertung und keine Aussage über reale DB-Standorte oder Beschäftigte.
        </p>
      </div>
    </div>
  );
}

function CategoryBreakdown() {
  const max = Math.max(...scenarioCategories.map(([, value]) => value));
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h2 className="text-2xl font-black text-db-dark dark:text-white">Erfundene Kategorienverteilung</h2>
      <p className="mt-2 font-semibold leading-7 text-db-rail dark:text-white/60">Nur zur Darstellung eines möglichen Diagramms.</p>
      <div className="mt-6 space-y-4">
        {scenarioCategories.map(([label, value]) => (
          <div key={label}>
            <div className="mb-2 flex justify-between text-sm font-black text-db-rail dark:text-white/65"><span>{label}</span><span>{value}</span></div>
            <div className="h-3 overflow-hidden rounded bg-db-soft dark:bg-white/10" aria-hidden="true"><div className="h-full rounded bg-db-red" style={{ width: `${(value / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskOverview() {
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h2 className="text-2xl font-black text-db-dark dark:text-white">Erfundene Prioritätsverteilung</h2>
      <p className="mt-2 font-semibold leading-7 text-db-rail dark:text-white/60">Keine automatische Risikobewertung und keine reale Fallklassifikation.</p>
      <div className="mt-6 grid gap-3">
        {scenarioRisks.map(([label, value, bar, text, bg]) => (
          <div key={label} className={`rounded-xl p-4 ${bg}`}>
            <div className="flex items-center justify-between"><p className={`font-black ${text}`}>{label}</p><p className={`text-2xl font-black ${text}`}>{value} %</p></div>
            <div className="mt-3 h-2 overflow-hidden rounded bg-white" aria-hidden="true"><div className={`h-full rounded ${bar}`} style={{ width: `${value}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Calculator({ cases, hourlyCost, minutes, savings, savingPercent, setCases, setHourlyCost, setMinutes, setSavingPercent }) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.92fr]">
      <div className="rounded-xl border border-db-dark/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-2xl font-black text-db-dark dark:text-white">Hypothesen-Rechner</h2>
        <p className="mt-2 font-semibold leading-7 text-db-rail dark:text-white/60">Ändere die Annahmen. Das Ergebnis ist keine zugesagte oder nachgewiesene Einsparung.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <NumberInput label="Erfundene Vorgänge pro Monat" value={cases} onChange={setCases} suffix="Fälle" min={0} max={10_000} />
          <NumberInput label="Angenommene Minuten pro Vorgang" value={minutes} onChange={setMinutes} suffix="Min." min={0} max={1_440} />
          <NumberInput label="Kostenannahme pro Stunde" value={hourlyCost} onChange={setHourlyCost} suffix="EUR" min={0} max={1_000} />
          <NumberInput label="Angenommene Zeitersparnis" value={savingPercent} onChange={setSavingPercent} suffix="%" min={0} max={100} />
        </div>
      </div>
      <div className="rounded-xl bg-db-dark p-6 text-white shadow-sm">
        <BadgeEuro size={30} className="text-red-200" aria-hidden="true" />
        <p className="mt-5 text-sm font-black uppercase tracking-wide text-white/60">Rechnerisches Szenario</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2" aria-live="polite">
          <Output label="Gesamtzeit ohne Unterstützung" value={`${formatNumber(savings.totalHours)} Std.`} />
          <Output label="Rechnerisch eingesparte Zeit" value={`${formatNumber(savings.savedHours)} Std.`} />
          <Output label="Rechnerischer Monatswert" value={formatCurrency(savings.monthly)} />
          <Output label="Rechnerischer Jahreswert" value={formatCurrency(savings.yearly)} />
        </div>
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-xs font-semibold leading-5 text-amber-100">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Rechenwerte schließen Einführungs-, Betriebs-, Datenschutz-, Schulungs- und Sicherheitskosten vollständig aus.
        </div>
      </div>
    </div>
  );
}

function NumberInput({ label, max, min, onChange, suffix, value }) {
  function handleChange(event) {
    const parsed = event.target.value === "" ? 0 : Number(event.target.value);
    onChange(clampNumber(parsed, min, max));
  }

  return (
    <label className="block">
      <span className="mb-2 block font-black text-db-dark dark:text-white">{label}</span>
      <div className="flex overflow-hidden rounded-xl border border-db-dark/15 bg-white focus-within:border-db-red focus-within:ring-2 focus-within:ring-db-red/15 dark:border-white/15 dark:bg-db-dark/40">
        <input type="number" min={min} max={max} step="1" value={value} onChange={handleChange} className="min-h-12 w-full min-w-0 px-4 text-lg font-bold text-db-dark outline-none dark:bg-transparent dark:text-white" />
        <span className="flex min-w-20 items-center justify-center bg-db-soft px-3 text-sm font-black text-db-rail dark:bg-white/10 dark:text-white/60">{suffix}</span>
      </div>
      <span className="mt-1 block text-[10px] font-bold text-db-rail/60 dark:text-white/40">Zulässiger Bereich: {min} bis {max}</span>
    </label>
  );
}

function Output({ label, value }) {
  return <div className="rounded-xl bg-white/10 p-4"><p className="text-sm font-bold text-white/65">{label}</p><p className="mt-2 break-words text-2xl font-black">{value}</p></div>;
}

function SavingsExplanation() {
  const points = [
    ["Weniger Rückfragen", "Hypothese: Strukturierte Entwürfe könnten fehlende Angaben früher sichtbar machen."],
    ["Klarere Priorisierung", "Hypothese: Eine fachlich geprüfte Struktur könnte die menschliche Sichtung unterstützen."],
    ["Bessere Vorbereitung", "Hypothese: Zuständige Stellen könnten mit klarer getrennten Fakten und Vermutungen starten."],
  ];

  return (
    <div className="mt-6 rounded-xl border border-db-dark/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h2 className="text-2xl font-black text-db-dark dark:text-white">Zu prüfende Nutzenhypothesen</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {points.map(([title, text]) => (
          <article key={title} className="rounded-xl bg-db-soft p-5 dark:bg-white/5">
            <CheckCircle2 className="text-emerald-600" size={20} aria-hidden="true" />
            <h3 className="mt-3 text-lg font-black text-db-dark dark:text-white">{title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail dark:text-white/60">{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0, style: "currency", currency: "EUR" }).format(value);
}

export default DashboardAnalytics;
