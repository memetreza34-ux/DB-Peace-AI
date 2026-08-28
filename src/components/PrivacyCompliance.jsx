import { useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Database,
  EyeOff,
  FileText,
  LockKeyhole,
  Scale,
  Server,
  ShieldAlert,
  UsersRound,
  XCircle,
} from "lucide-react";

const implementedControls = [
  ["Prototyp-Hinweis", "Die Oberfläche weist sichtbar darauf hin, dass keine echten Personen- oder Falldaten eingegeben werden sollen.", BadgeCheck],
  ["Temporäre Eingaben", "Chat und Gedächtnisprotokolle liegen nur im React-Arbeitsspeicher der laufenden App; Protokolle überstehen interne Navigation. Stimmungseinträge verwenden ausschließlich sessionStorage. Keiner dieser Inhalte wird in einer eigenen serverseitigen DB-Peace-Falldatenbank gespeichert.", EyeOff],
  ["Externe KI-Verarbeitung", "Wenn ein Gemini-Schlüssel konfiguriert ist, werden Chat- und Meldeanalyse-Texte über den lokalen Node-Proxy an Google Gemini übertragen, damit eine Modellantwort erzeugt werden kann. Deshalb dürfen hier keine realen sensiblen Falldaten eingegeben werden.", Server],
  ["Lokaler Sichtschutz", "Die selbst gewählte PIN schützt die Ansicht im Browser, ist aber ausdrücklich keine Datenverschlüsselung.", LockKeyhole],
  ["Kein API-Cache", "Der Service Worker speichert keine Antworten aus /api/ im Offline-Cache.", Server],
  ["Menschliche Entscheidung", "KI-Ausgaben werden als Orientierung gekennzeichnet und ersetzen keine zuständige Prüfung.", UsersRound],
  ["Dokumentierte Grenzen", "SECURITY.md und MVP-Status benennen nicht implementierte Produkt- und Sicherheitsfunktionen.", FileText],
];

const notImplemented = [
  "echte SSO- oder OIDC-Anmeldung",
  "serverseitige Rollen und Berechtigungen",
  "produktive Datenbank und verschlüsselte Datenspeicherung",
  "sichere Anhänge und Schadsoftwareprüfung",
  "Audit-Logs, Speicherfristen und Betroffenenrechte",
  "offizielle DB-Systemintegration oder anonyme Rückkommunikation",
];

const checklistItems = [
  "Verantwortliche Organisationseinheit und Zweck festlegen",
  "Datenschutz-Folgenabschätzung durchführen",
  "Datenschutz, Compliance, Betriebsrat und JAV beteiligen",
  "Datenkategorien, Rechtsgrundlagen und Einwilligungen dokumentieren",
  "Rollen, Berechtigungen und Löschfristen definieren",
  "KI-Anbieter, Verträge und Datenflüsse prüfen",
  "Bedrohungsmodell, Penetrationstest und Incident Response umsetzen",
  "Pilot ausschließlich mit freigegebenen synthetischen Daten starten",
];

function PrivacyCompliance() {
  const [planningChecks, setPlanningChecks] = useState([]);

  function toggle(item) {
    setPlanningChecks((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
    );
  }

  return (
    <section id="datenschutz" className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <EntryHeader />
        <ImplementedControls />
        <MissingControls />
        <AiBoundaries />
        <PlanningChecklist checked={planningChecks} toggle={toggle} />
        <FinalDisclaimer />
      </div>
    </section>
  );
}

function EntryHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-db-red">Datenschutz und Sicherheit</p>
        <h2 className="mt-3 text-4xl font-black leading-tight text-db-dark dark:text-white sm:text-5xl">
          Technischer Ist-Stand statt Compliance-Versprechen
        </h2>
        <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-db-rail dark:text-white/65">
          Diese Seite unterscheidet klar zwischen bereits umgesetzten Schutzmaßnahmen und Voraussetzungen,
          die vor einer echten Einführung noch fehlen.
        </p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-800/50 dark:bg-amber-950/25">
        <p className="flex items-start gap-3 text-sm font-black leading-6 text-amber-950 dark:text-amber-100">
          <Scale className="mt-0.5 shrink-0" size={19} aria-hidden="true" />
          Der Prototyp ist weder DSGVO-zertifiziert noch durch Datenschutz, Compliance, Betriebsrat, JAV oder IT-Sicherheit freigegeben.
        </p>
      </div>
    </div>
  );
}

function ImplementedControls() {
  return (
    <Section
      title="Im aktuellen MVP umgesetzt"
      text="Diese Aussagen beschreiben konkrete Funktionen im Branch und keine geplanten Zielbilder."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {implementedControls.map(([title, text, Icon]) => (
          <article key={title} className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <Icon className="text-emerald-700 dark:text-emerald-300" size={24} aria-hidden="true" />
            <h3 className="mt-4 text-lg font-black text-db-dark dark:text-white">{title}</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-db-rail dark:text-white/65">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function MissingControls() {
  return (
    <Section
      title="Noch nicht umgesetzt"
      text="Ohne diese Funktionen dürfen keine realen sensiblen Meldungen verarbeitet werden."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {notImplemented.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-950 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-100">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-300" aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </Section>
  );
}

function AiBoundaries() {
  const allowed = [
    "einen Text strukturieren oder zusammenfassen",
    "unverbindliche nächste Schritte vorschlagen",
    "Lernfragen und Entwürfe erzeugen",
    "auf reale Hilfe und menschliche Prüfung verweisen",
  ];

  const forbidden = [
    "arbeitsrechtliche oder medizinische Entscheidungen treffen",
    "automatisch sanktionieren oder Fälle abschließen",
    "Vertraulichkeit, Anonymität oder Rechtssicherheit garantieren",
    "unnötige Klarnamen, Personalnummern oder Gesundheitsdaten anfordern",
  ];

  return (
    <Section title="KI-Leitplanken" text="Technische und organisatorische Grenzen müssen gleichzeitig gelten. Mit aktiviertem Gemini verlassen eingegebene Chat- und Meldeanalyse-Texte den Browser und werden über den lokalen Proxy an den externen KI-Dienst übertragen.">
      <div className="grid gap-6 lg:grid-cols-2">
        <BoundaryColumn title="Zulässige Unterstützung" items={allowed} allowed />
        <BoundaryColumn title="Nicht zulässig" items={forbidden} />
      </div>
    </Section>
  );
}

function BoundaryColumn({ allowed = false, items, title }) {
  return (
    <div className={`rounded-xl p-5 shadow-sm ${allowed ? "border border-db-dark/10 bg-white dark:border-white/10 dark:bg-white/5" : "bg-db-dark text-white"}`}>
      <h3 className="text-2xl font-black">{title}</h3>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <p key={item} className={`flex items-start gap-3 text-sm font-semibold leading-6 ${allowed ? "text-db-rail dark:text-white/70" : "text-white/75"}`}>
            {allowed ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            ) : (
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
            )}
            {item}
          </p>
        ))}
      </div>
    </Section>
  );
}

function PlanningChecklist({ checked, toggle }) {
  return (
    <Section
      title="Interaktive Planungscheckliste"
      text="Die Häkchen existieren nur im React-Zustand dieser geöffneten Datenschutzansicht. Ein Bereichswechsel oder Neuladen setzt sie zurück; sie sind kein Nachweis einer erfolgten Freigabe. Standardmäßig ist deshalb nichts als erledigt markiert."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {checklistItems.map((item) => (
          <label key={item} className="flex cursor-pointer items-start gap-3 rounded-xl border border-db-dark/10 bg-white p-4 font-semibold text-db-dark shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white">
            <input
              type="checkbox"
              checked={checked.includes(item)}
              onChange={() => toggle(item)}
              className="mt-1 h-4 w-4 accent-db-red"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </Section>
  );
}

function FinalDisclaimer() {
  return (
    <div className="mt-10 rounded-xl bg-db-dark p-6 text-white shadow-panel">
      <div className="flex items-start gap-3">
        <Database className="mt-1 h-6 w-6 shrink-0 text-red-200" aria-hidden="true" />
        <div>
          <h3 className="text-2xl font-black">Keine realen sensiblen Daten</h3>
          <p className="mt-3 max-w-4xl font-semibold leading-7 text-white/75">
            Bis Authentifizierung, sichere Datenhaltung, Rollen, Löschung, Auditierung sowie fachliche und rechtliche Freigaben umgesetzt sind,
            darf DB Peace AI ausschließlich mit erfundenen Beispieldaten demonstriert werden. Ist Gemini aktiviert, werden Chat- und Meldeanalyse-Texte für die Modellverarbeitung an Google Gemini übertragen.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ children, text, title }) {
  return (
    <div className="mt-10">
      <div className="max-w-3xl">
        <h3 className="text-3xl font-black text-db-dark dark:text-white">{title}</h3>
        {text && <p className="mt-3 font-semibold leading-7 text-db-rail dark:text-white/65">{text}</p>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default PrivacyCompliance;
