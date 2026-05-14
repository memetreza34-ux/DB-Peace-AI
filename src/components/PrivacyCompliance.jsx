import { useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  EyeOff,
  FileText,
  KeyRound,
  LockKeyhole,
  Scale,
  ShieldCheck,
  UserCheck,
  UsersRound,
  XCircle,
} from "lucide-react";

const principles = [
  ["Zweckbindung", "Daten werden nur für Hilfe, Prävention und Fallklärung genutzt.", ShieldCheck],
  ["Datensparsamkeit", "Es werden nur Angaben erfasst, die wirklich gebraucht werden.", LockKeyhole],
  ["Transparenz", "Nutzende sehen klar, was die Demo macht und was nicht.", FileText],
  ["Freiwilligkeit", "Die Nutzung bleibt freiwillig und ohne versteckte Überwachung.", UserCheck],
  ["Anonymisierung", "Meldungen können ohne Namen vorbereitet werden.", EyeOff],
  ["Menschliche Prüfung", "Die KI gibt nur Vorschläge. Menschen entscheiden.", UsersRound],
];

const aiAllowed = [
  "Meldungen strukturieren",
  "Risiken als Vorschlag einstufen",
  "Zusammenfassungen erstellen",
  "Deeskalationshinweise geben",
];

const aiForbidden = [
  "Menschen automatisch bestrafen",
  "heimlich Chats überwachen",
  "Entscheidungen allein treffen",
  "vertrauliche Daten unnötig speichern",
];

const checklistItems = [
  "Datenschutzbeauftragte einbeziehen",
  "Betriebsrat/JAV prüfen lassen",
  "Zugriffsrechte definieren",
  "Speicherfristen festlegen",
  "Sicherheitskonzept erstellen",
  "KI-Risiken bewerten",
  "Transparenz für Nutzende sicherstellen",
  "Testphase mit anonymisierten Daten durchführen",
];

function PrivacyCompliance() {
  const [checked, setChecked] = useState([
    "Datenschutzbeauftragte einbeziehen",
    "Zugriffsrechte definieren",
  ]);

  function toggle(item) {
    setChecked((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    );
  }

  return (
    <section id="datenschutz" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <EntryHeader />
        <Principles />
        <AiBoundaries />
        <UserControl />
        <ComplianceChecklist checked={checked} toggle={toggle} />
        <FinalDisclaimer />
      </div>
    </section>
  );
}

function EntryHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.78fr] lg:items-end">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-db-red">Datenschutz</p>
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal text-db-dark sm:text-5xl">
          Datenschutz & Standards
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-db-rail">
          DSGVO-bewusstes Konzept - keine finale Rechtsprüfung.
        </p>
      </div>
      <div className="rounded-lg border border-db-dark/10 bg-db-soft p-4 shadow-sm">
        <p className="flex items-start gap-3 text-sm font-black text-db-dark">
          <Scale className="mt-0.5 shrink-0 text-db-red" size={18} aria-hidden="true" />
          Diese Demo ersetzt keine rechtliche Prüfung durch Datenschutz, Compliance oder Betriebsrat.
        </p>
      </div>
    </div>
  );
}

function Principles() {
  return (
    <Section title="Kernprinzipien" text="Die Demo zeigt klare Leitplanken für eine spätere Einführung.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {principles.map(([title, text, Icon]) => (
          <article key={title} className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-sm">
            <Icon className="text-db-red" size={24} aria-hidden="true" />
            <h3 className="mt-4 text-lg font-black">{title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function AiBoundaries() {
  return (
    <Section title="Was die KI darf / nicht darf" text="KI unterstützt, Menschen entscheiden.">
      <div className="grid gap-6 lg:grid-cols-2">
        <BoundaryColumn title="Die KI darf" items={aiAllowed} allowed />
        <BoundaryColumn title="Die KI darf nicht" items={aiForbidden} />
      </div>
    </Section>
  );
}

function BoundaryColumn({ allowed = false, items, title }) {
  return (
    <div className={`rounded-lg p-5 shadow-panel ${allowed ? "bg-white" : "bg-db-dark text-white"}`}>
      <h3 className="text-2xl font-black">{title}</h3>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <p key={item} className={`flex gap-3 font-semibold ${allowed ? "text-db-rail" : "text-white/80"}`}>
            {allowed ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
            ) : (
              <XCircle className="mt-0.5 shrink-0 text-red-200" size={18} />
            )}
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function UserControl() {
  const items = [
    "Anonyme Nutzung bleibt möglich",
    "Kontaktangaben sind freiwillig",
    "Meldungsvorschau vor Absenden",
    "Keine versteckte Analyse realer Chats",
  ];

  return (
    <Section title="Nutzerkontrolle" text="Nutzende behalten die Kontrolle über ihre Eingaben.">
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-lg border border-db-dark/10 bg-white p-4 font-semibold text-db-rail shadow-sm">
            <BadgeCheck className="mt-0.5 shrink-0 text-db-red" size={18} />
            {item}
          </div>
        ))}
      </div>
    </Section>
  );
}

function ComplianceChecklist({ checked, toggle }) {
  return (
    <Section title="Checkliste vor echter Einführung" text="Diese Punkte müssten vor einer produktiven Nutzung geklärt werden.">
      <div className="grid gap-3 md:grid-cols-2">
        {checklistItems.map((item) => (
          <label key={item} className="flex items-start gap-3 rounded-lg border border-db-dark/10 bg-white p-4 font-semibold text-db-dark shadow-sm">
            <input
              type="checkbox"
              checked={checked.includes(item)}
              onChange={() => toggle(item)}
              className="mt-1 h-4 w-4 accent-db-red"
            />
            {item}
          </label>
        ))}
      </div>
    </Section>
  );
}

function FinalDisclaimer() {
  return (
    <div className="mt-10 rounded-lg border border-db-dark/10 bg-db-dark p-6 text-white shadow-panel">
      <h3 className="text-2xl font-black">Hinweis</h3>
      <p className="mt-3 max-w-4xl font-semibold leading-7 text-white/80">
        DB Peace AI ist ein Innovations- und Demonstrationsprototyp. Für eine echte Einführung wären
        Datenschutzprüfung, Compliance-Bewertung, IT-Sicherheitsprüfung und Beteiligung zuständiger
        Gremien notwendig.
      </p>
    </div>
  );
}

function Section({ children, text, title }) {
  return (
    <div className="mt-10">
      <div className="max-w-3xl">
        <h3 className="text-3xl font-black text-db-dark">{title}</h3>
        {text && <p className="mt-3 font-semibold leading-7 text-db-rail">{text}</p>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default PrivacyCompliance;
