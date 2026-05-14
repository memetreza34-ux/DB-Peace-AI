import { ArrowRight, BadgeEuro, CheckCircle2, FileText, GraduationCap, LayoutDashboard, Scale, ShieldCheck } from "lucide-react";

const problemCards = [
  ["Hass, Mobbing und Gewalt werden oft zu spät gemeldet.", ShieldCheck],
  ["Betroffene wissen manchmal nicht, an wen sie sich wenden sollen.", LayoutDashboard],
  ["Meldungen sind häufig unvollständig oder schwer einzuordnen.", FileText],
  ["Rückfragen kosten Zeit in Ausbildung, HR und Führung.", GraduationCap],
];

const solutions = [
  ["KI-Hilfe", "Erste Orientierung, Deeskalation und nächste Schritte."],
  ["Meldung", "Strukturierte Vorfälle statt unklarer Freitext."],
  ["Training", "Sichere Reaktionen in realistischen Situationen."],
  ["Dashboard", "Anonymisierte Kennzahlen und Muster."],
  ["Datenschutz", "Klare Grenzen, Rollen und menschliche Prüfung."],
];

const benefits = [
  "frühere Hilfe",
  "bessere Struktur",
  "weniger Rückfragen",
  "menschliche Prüfung",
];

function ProjectOverview() {
  return (
    <section id="projektuebersicht" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Entry />
        <Problem />
        <Solution />
        <Benefits />
        <Privacy />
        <NextSteps />
        <PresentationScript />
      </div>
    </section>
  );
}

function Entry() {
  return (
    <div className="rounded-lg bg-db-dark p-6 text-white shadow-panel lg:p-8">
      <p className="text-sm font-black uppercase tracking-wider text-red-200">Projekt</p>
      <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl">Projektübersicht</h2>
      <p className="mt-4 max-w-3xl text-xl font-semibold leading-8 text-white/80">
        DB Peace AI ist ein lokaler Demonstrationsprototyp für Prävention, Meldung, Training und Orientierung.
      </p>
      <div className="mt-5 rounded bg-white/10 p-4 ring-1 ring-white/15">
        <p className="font-semibold leading-7 text-white/85">
          Das Projekt zeigt, wie KI unterstützen kann, ohne selbst zu entscheiden.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          ["Problem", "#projekt-problem"],
          ["Lösung", "#projekt-loesung"],
          ["Nutzen", "#projekt-nutzen"],
          ["Datenschutz", "#projekt-datenschutz"],
        ].map(([label, href]) => (
          <a key={label} href={href} className="inline-flex items-center gap-2 rounded bg-white px-4 py-3 font-black text-db-dark transition hover:text-db-red">
            {label}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}

function Problem() {
  return (
    <Section id="projekt-problem" title="Das Problem">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {problemCards.map(([text, Icon]) => (
          <article key={text} className="rounded-lg border border-db-dark/10 bg-db-soft p-5 shadow-sm">
            <Icon className="text-db-red" size={24} aria-hidden="true" />
            <p className="mt-4 font-black leading-7 text-db-dark">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Solution() {
  return (
    <Section id="projekt-loesung" title="Unsere Lösung" text="Die Plattform unterstützt, sortiert und trainiert - sie entscheidet nicht selbst.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {solutions.map(([title, text]) => (
          <article key={title} className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-black text-db-dark">{title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Benefits() {
  return (
    <Section id="projekt-nutzen" title="Nutzen für DB">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex gap-3 rounded bg-db-soft p-4 font-black text-db-dark">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
            {benefit}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Privacy() {
  return (
    <Section id="projekt-datenschutz" title="Datenschutzprinzip">
      <div className="rounded-lg bg-db-dark p-5 text-white shadow-panel">
        <div className="grid gap-3 md:grid-cols-2">
          <p className="flex gap-3 font-semibold leading-7 text-white/80">
            <Scale className="mt-1 shrink-0 text-red-200" size={18} aria-hidden="true" />
            DSGVO-bewusstes Konzept, keine finale Rechtsprüfung.
          </p>
          <p className="flex gap-3 font-semibold leading-7 text-white/80">
            <ShieldCheck className="mt-1 shrink-0 text-red-200" size={18} aria-hidden="true" />
            Keine Überwachung, keine automatische Bestrafung, Menschen entscheiden.
          </p>
        </div>
      </div>
    </Section>
  );
}

function NextSteps() {
  return (
    <Section title="Nächste Schritte">
      <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-sm">
        <p className="font-semibold leading-7 text-db-rail">
          Der nächste Schritt wäre eine fachliche Prüfung mit Datenschutz, Compliance, IT-Sicherheit und zuständigen Gremien.
        </p>
      </div>
    </Section>
  );
}

function PresentationScript() {
  return (
    <Section title="Kurzpräsentation">
      <div className="rounded-lg border border-db-dark/10 bg-white p-6 shadow-panel">
        <p className="whitespace-pre-line text-lg font-semibold leading-8 text-db-rail">
          {`DB Peace AI ist ein lokaler Demonstrationsprototyp für Prävention gegen Hass, Gewalt, Mobbing und Konflikte.

Die Idee ist einfach: KI hilft beim Strukturieren, Formulieren und Trainieren. Menschen entscheiden.

Für die DB könnte das frühere Hilfe, klarere Meldungen, weniger Rückfragen und bessere Vorbereitung bedeuten.

Wichtig bleibt: Das ist ein Prototyp. Vor einer echten Einführung müssten Datenschutz, Compliance, IT-Sicherheit und die zuständigen Gremien geprüft werden.`}
        </p>
      </div>
    </Section>
  );
}

function Section({ children, id, text, title }) {
  return (
    <div id={id} className="mt-10 scroll-mt-28">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-black text-db-dark">{title}</h2>
        {text && <p className="mt-3 font-semibold leading-7 text-db-rail">{text}</p>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default ProjectOverview;
