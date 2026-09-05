import { useMemo, useState } from "react";
import { ausweisbar, SCHWELLE, sperrBegruendung } from "../lib/muster.js";
import {
  AlertTriangle,
  BadgeEuro,
  CheckCircle2,
  Clock3,
  ClipboardList,
  GraduationCap,
  LockKeyhole,
  Route,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

const kpis = [
  {
    title: "Offene Demo-Meldungen",
    value: "18",
    explanation: "Noch nicht abschließend geprüfte anonymisierte Demo-Fälle.",
    trend: "-12 % ggü. Vormonat",
    icon: ClipboardList,
  },
  {
    title: "Strukturiert vorbereitete Fälle",
    value: "42",
    explanation: "Meldungen mit Kategorie, Risiko und nächstem Schritt.",
    trend: "+18 % strukturierter",
    icon: Route,
  },
  {
    title: "Abgeschlossene Trainings",
    value: "126",
    explanation: "Beendete Simulationen im lokalen Demo-Datensatz.",
    trend: "+24 Simulationen",
    icon: GraduationCap,
  },
  {
    title: "Hochrisiko-Hinweise",
    // Bewusst keine Zahl: Sie läge unter der Anonymitätsschwelle von fünf, und
    // dieselbe Regel gilt auf dieser Seite wie in den Rollen-Postfächern.
    value: "unter der Schwelle",
    explanation: `Weniger als ${SCHWELLE} Fälle — die Zahl wird nicht ausgewiesen, weil daraus erkennbar wäre, um wen es geht.`,
    trend: "nur Priorisierung, keine Sanktion",
    icon: ShieldAlert,
  },
  {
    title: "Geschätzte eingesparte Stunden",
    value: "31,5",
    explanation: "Konservative Demo-Schätzung durch strukturierte Vorbereitung.",
    trend: "+6,5 Std.",
    icon: Clock3,
  },
  {
    title: "Mögliche monatliche Kostenersparnis",
    value: "1.575 EUR",
    explanation: "Fiktiver Wert, intern zu validieren.",
    trend: "+325 EUR",
    icon: BadgeEuro,
  },
];

const categories = [
  ["Mobbing", 14],
  ["Beleidigung", 11],
  ["Hassrede", 7],
  ["Diskriminierung", 9],
  ["Gewaltandrohung", 4],
  ["Konflikt im Team", 16],
  ["Aggressiver Kunde/Fahrgast", 12],
];

const risks = [
  ["Niedrig", 35, "bg-emerald-500", "text-emerald-700", "bg-emerald-50"],
  ["Mittel", 48, "bg-amber-500", "text-amber-700", "bg-amber-50"],
  ["Hoch", 17, "bg-red-600", "text-red-700", "bg-red-50"],
];

function DashboardAnalytics() {
  const [cases, setCases] = useState(25);
  const [minutes, setMinutes] = useState(60);
  const [hourlyCost, setHourlyCost] = useState(50);
  const [savingPercent, setSavingPercent] = useState(35);

  const savings = useMemo(() => {
    const totalHours = (cases * minutes) / 60;
    const savedHours = totalHours * (savingPercent / 100);
    const monthly = savedHours * hourlyCost;
    return {
      totalHours,
      savedHours,
      monthly,
      yearly: monthly * 12,
    };
  }, [cases, hourlyCost, minutes, savingPercent]);

  return (
    <section id="dashboard" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <EntryHeader />
        <KpiGrid />

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
    <div className="grid gap-6 lg:grid-cols-[1fr_0.78fr] lg:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-db-red">Dashboard</p>
        <h2 className="mt-3 text-4xl font-bold leading-tight tracking-normal text-db-dark sm:text-5xl">
          Dashboard & Präventionsübersicht
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-db-rail">
          Anonymisierte Demo-Auswertung für Konflikte, Meldungen und mögliche Zeitersparnis.
        </p>
      </div>
      <div className="rounded-lg border border-db-dark/10 bg-white p-4 shadow-sm">
        <p className="flex items-start gap-3 text-sm font-bold text-db-dark">
          <LockKeyhole className="mt-0.5 shrink-0 text-db-red" size={18} aria-hidden="true" />
          Alle Daten in dieser Demo sind anonymisiert und fiktiv.
        </p>
        <p className="mt-3 text-sm font-normal leading-6 text-db-rail">
          Keine automatische Bestrafung, keine Überwachung. KI unterstützt Analyse und Sortierung, Menschen entscheiden.
        </p>
      </div>
    </div>
  );
}

function KpiGrid() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {kpis.map(({ explanation, icon: Icon, title, trend, value }, index) => (
        <article key={title} className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-db-rail">{title}</p>
              <p className="mt-2 text-4xl font-bold text-db-dark">{value}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded bg-red-50 text-db-red">
              <Icon size={24} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-4 text-sm font-normal leading-6 text-db-rail">{explanation}</p>
          <p className={`mt-3 inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-bold ${index === 3 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
            {index === 3 ? <AlertTriangle size={14} /> : <TrendingUp size={14} />}
            {trend}
          </p>
        </article>
      ))}
    </div>
  );
}

function CategoryBreakdown() {
  // Dieselbe Anonymitätsschwelle wie in den Rollen-Postfächern: Was darunter
  // liegt, wird nicht ausgewiesen — auch nicht mit Namen der Kategorie. Bei
  // wenigen Fällen an einem Standort wäre sonst erkennbar, um wen es geht.
  const ausgewiesen = categories.filter(([, value]) => ausweisbar(value));
  const gesperrt = categories.length - ausgewiesen.length;
  const max = Math.max(...ausgewiesen.map(([, value]) => value), 1);

  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-panel">
      <h3 className="text-2xl font-bold">Meldungen nach Kategorie</h3>
      <p className="mt-2 font-normal leading-7 text-db-rail">
        Anonymisierte Mock-Kategorien im Demo-Zeitraum. Ausgewiesen wird erst ab {SCHWELLE} Fällen.
      </p>
      <div className="mt-6 space-y-4">
        {ausgewiesen.map(([label, value]) => (
          <div key={label}>
            <div className="mb-2 flex justify-between text-sm font-medium text-db-rail">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded bg-db-soft">
              <div className="h-full rounded bg-db-red transition-all" style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {gesperrt > 0 && (
        <p className="mt-6 rounded-xl border border-db-dark/10 bg-db-soft p-4 text-sm font-normal leading-relaxed text-db-rail">
          {gesperrt === 1 ? "Eine weitere Kategorie liegt" : `${gesperrt} weitere Kategorien liegen`}{" "}
          unter der Schwelle und {gesperrt === 1 ? "wird" : "werden"} bewusst nicht ausgewiesen —
          auch nicht mit Namen. {sperrBegruendung()}
        </p>
      )}
    </div>
  );
}

function RiskOverview() {
  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-panel">
      <h3 className="text-2xl font-bold">Risikoverteilung</h3>
      <p className="mt-2 font-normal leading-7 text-db-rail">
        Die Risiko-Einschätzung dient nur zur Priorisierung für menschliche Prüfung.
      </p>
      <div className="mt-6 grid gap-3">
        {risks.map(([label, value, bar, text, bg]) => (
          <div key={label} className={`rounded p-4 ${bg}`}>
            <div className="flex items-center justify-between">
              <p className={`font-bold ${text}`}>{label}</p>
              <p className={`text-2xl font-bold ${text}`}>{value}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded bg-white">
              <div className={`h-full rounded ${bar}`} style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Calculator(props) {
  const {
    cases,
    hourlyCost,
    minutes,
    savings,
    savingPercent,
    setCases,
    setHourlyCost,
    setMinutes,
    setSavingPercent,
  } = props;

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.92fr]">
      <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-panel">
        <h3 className="text-2xl font-bold">Kostenersparnis-Rechner</h3>
        <p className="mt-2 font-normal leading-7 text-db-rail">
          Dies ist eine konservative Demo-Schätzung. Reale Werte müssten intern validiert werden.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <NumberInput label="Anzahl Konfliktfälle pro Monat" value={cases} onChange={setCases} suffix="Fälle" />
          <NumberInput label="Manuelle Bearbeitungszeit pro Fall" value={minutes} onChange={setMinutes} suffix="Min." />
          <NumberInput label="Interne Kosten pro Stunde" value={hourlyCost} onChange={setHourlyCost} suffix="EUR" />
          <NumberInput label="Zeitersparnis durch KI-Vorbereitung" value={savingPercent} onChange={setSavingPercent} suffix="%" />
        </div>
      </div>
      <div className="rounded-lg bg-db-dark p-5 text-white shadow-panel">
        <BadgeEuro size={30} className="text-red-200" aria-hidden="true" />
        <p className="mt-5 text-sm font-bold uppercase tracking-wide text-white/60">Demo-Ergebnis</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Output label="Gesamtzeit ohne System" value={`${formatNumber(savings.totalHours)} Std.`} />
          <Output label="Eingesparte Stunden" value={`${formatNumber(savings.savedHours)} Std.`} />
          <Output label="Monatliche Einsparung" value={`${formatCurrency(savings.monthly)}`} />
          <Output label="Jährliche Einsparung" value={`${formatCurrency(savings.yearly)}`} />
        </div>
      </div>
    </div>
  );
}

function NumberInput({ label, onChange, suffix, value }) {
  return (
    <label className="block">
      <span className="mb-2 block font-bold text-db-dark">{label}</span>
      <div className="flex overflow-hidden rounded border border-db-dark/15 bg-white focus-within:border-db-red focus-within:ring-2 focus-within:ring-db-red/15">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-h-12 w-full px-4 text-lg font-bold outline-none"
        />
        <span className="flex min-w-20 items-center justify-center bg-db-soft px-3 text-sm font-medium text-db-rail">
          {suffix}
        </span>
      </div>
    </label>
  );
}

function Output({ label, value }) {
  return (
    <div className="rounded bg-white/10 p-4">
      <p className="text-sm font-bold text-white/65">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function SavingsExplanation() {
  const points = [
    ["Weniger Rückfragen", "Meldungen sind strukturierter und enthalten wichtige Details."],
    ["Schnellere Priorisierung", "Kritische Fälle werden schneller erkannt und zur Prüfung vorbereitet."],
    ["Bessere Vorbereitung", "Ausbilder, HR oder zuständige Stellen erhalten klarere Zusammenfassungen."],
  ];

  return (
    <div className="mt-6 rounded-lg border border-db-dark/10 bg-white p-5 shadow-panel">
      <h3 className="text-2xl font-bold">Wo die DB Zeit sparen könnte</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {points.map(([title, text]) => (
          <article key={title} className="rounded bg-db-soft p-5">
            <CheckCircle2 className="text-emerald-600" size={20} aria-hidden="true" />
            <h4 className="mt-3 text-lg font-bold">{title}</h4>
            <p className="mt-2 text-sm font-normal leading-6 text-db-rail">{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default DashboardAnalytics;
