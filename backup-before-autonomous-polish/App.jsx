import { useState } from "react";

const views = [
  { id: "overview", label: "Übersicht" },
  { id: "kiHilfe", label: "KI-Hilfe" },
  { id: "meldung", label: "Meldung" },
  { id: "training", label: "Training" },
  { id: "dashboard", label: "Dashboard" },
  { id: "datenschutz", label: "Datenschutz" },
  { id: "projekt", label: "Projekt" },
];

const issues = [
  "Ich werde beleidigt",
  "Jemand droht mir",
  "Konflikt mit Kolleg/in",
  "Aggressiver Kunde/Fahrgast",
];

const scenarios = [
  "Aggressiver Fahrgast",
  "Mobbing in der Werkstatt",
  "Diskriminierende Aussage",
  "Konflikt im Gruppenchat",
];

const categories = [
  ["Mobbing", 14],
  ["Beleidigung", 11],
  ["Hassrede", 7],
  ["Diskriminierung", 9],
  ["Gewaltandrohung", 4],
  ["Konflikt im Team", 16],
];

const legalViews = {
  impressum: {
    title: "Impressum",
    subtitle: "Lokaler Demonstrationsprototyp",
  },
  datenschutzLegal: {
    title: "Datenschutzhinweise",
    subtitle: "DSGVO-bewusstes Konzept",
  },
  nutzung: {
    title: "Nutzungsbedingungen",
    subtitle: "Hinweise für den Prototyp",
  },
  barrierefreiheit: {
    title: "Barrierefreiheit",
    subtitle: "Barrierearme Demo-UX",
  },
  status: {
    title: "Projektstatus",
    subtitle: "Aktueller Entwicklungsstand",
  },
};

function App() {
  const [activeView, setActiveView] = useState("overview");
  const [legalView, setLegalView] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const safeActiveView = views.some((view) => view.id === activeView) ? activeView : "overview";
  const currentView = views.find((view) => view.id === safeActiveView) ?? views[0];
  const currentHeaderLabel = legalView ? legalViews[legalView]?.title ?? currentView.label : currentView.label;

  function navigateMain(viewId) {
    setActiveView(viewId);
    setLegalView(null);
    setMenuOpen(false);
  }

  function openLegal(viewId) {
    setLegalView(viewId);
    setMenuOpen(false);
  }

  function closeLegal() {
    setLegalView(null);
  }

  return (
    <div className="min-h-screen bg-db-soft text-db-dark">
      <div className="fixed left-4 top-4 z-50 rounded bg-white px-3 py-2 text-sm font-black text-db-red shadow-sm ring-1 ring-db-red/20">
        DB Peace AI loaded
      </div>

      <div className="lg:hidden">
        <MobileHeader
          activeView={safeActiveView}
          activeLabel={currentHeaderLabel}
          menuOpen={menuOpen}
          onNavigate={navigateMain}
          setMenuOpen={setMenuOpen}
        />
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-db-dark/10 bg-white lg:flex lg:flex-col">
          <Sidebar activeView={safeActiveView} onNavigate={navigateMain} />
        </aside>

        <main className="min-h-screen flex-1 lg:ml-72">
          <TopBar activeLabel={currentHeaderLabel} />
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            {legalView ? (
              <LegalView page={legalView} onBack={closeLegal} />
            ) : (
              <>
                {safeActiveView === "overview" && <OverviewView onNavigate={navigateMain} />}
                {safeActiveView === "kiHilfe" && <KiHilfeView />}
                {safeActiveView === "meldung" && <MeldungView />}
                {safeActiveView === "training" && <TrainingView />}
                {safeActiveView === "dashboard" && <DashboardView />}
                {safeActiveView === "datenschutz" && <DatenschutzView />}
                {safeActiveView === "projekt" && <ProjektView />}
              </>
            )}
          </div>
          <FooterNav
            onOpenLegal={openLegal}
            onNavigate={navigateMain}
            activeView={safeActiveView}
          />
        </main>
      </div>

      <MobileBottomNav activeView={safeActiveView} onNavigate={navigateMain} />
    </div>
  );
}

function Sidebar({ activeView, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-db-dark/10 p-5">
        <BrandMark />
        <p className="mt-4 rounded-lg border border-db-dark/10 bg-db-soft p-3 text-xs font-bold leading-5 text-db-rail">
          Lokal, ohne echte Daten. Keine Überwachung. KI unterstützt, Menschen entscheiden.
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {views.map((view) => (
          <NavButton
            key={view.id}
            active={activeView === view.id}
            label={view.label}
            onClick={() => onNavigate(view.id)}
          />
        ))}
      </nav>

      <div className="border-t border-db-dark/10 p-4">
        <button
          type="button"
          onClick={() => onNavigate("meldung")}
          className="w-full rounded bg-db-red px-4 py-3 text-sm font-black text-white transition hover:bg-red-700"
        >
          Vorfall melden
        </button>
      </div>
    </div>
  );
}

function MobileHeader({ activeView, activeLabel, menuOpen, onNavigate, setMenuOpen }) {
  return (
    <header className="sticky top-0 z-40 border-b border-db-dark/10 bg-white/95 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button type="button" onClick={() => onNavigate("overview")} className="flex items-center gap-3">
          <BrandMark compact subtitle={activeLabel} />
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-db-dark/10 text-db-dark"
          aria-label={menuOpen ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={menuOpen}
        >
          <span className="text-xl font-black">{menuOpen ? "×" : "≡"}</span>
        </button>
      </div>
      {menuOpen && (
        <div className="grid gap-2 border-t border-db-dark/10 bg-white p-3 shadow-panel">
          {views.map((view) => (
            <NavButton
              key={view.id}
              active={activeView === view.id}
              label={view.label}
              onClick={() => {
                onNavigate(view.id);
                setMenuOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </header>
  );
}

function TopBar({ activeLabel }) {
  return (
    <div className="hidden border-b border-db-dark/10 bg-white/90 px-8 py-4 backdrop-blur-xl lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <BrandMark compact subtitle="Lokaler Demo-Prototyp" />
          <div>
            <p className="text-sm font-black text-db-dark">{activeLabel}</p>
            <p className="text-xs font-bold text-db-rail">Lokaler Demo-Prototyp · keine offizielle Einführung</p>
          </div>
        </div>
        <div className="rounded bg-db-soft px-3 py-2 text-xs font-black text-db-rail ring-1 ring-db-dark/10">
          AI supports, humans decide
        </div>
      </div>
    </div>
  );
}

function BrandMark({ compact = false, subtitle = "Innovationsprototyp" }) {
  return (
    <div className={`flex items-center ${compact ? "gap-3" : "gap-4"}`}>
      <div
        className={`flex shrink-0 items-center justify-center rounded-2xl bg-db-red text-white shadow-sm ring-1 ring-db-red/10 ${
          compact ? "h-11 w-11" : "h-14 w-14"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 48 48" className={compact ? "h-7 w-7" : "h-9 w-9"} fill="none">
          <path
            d="M24 7L35 11.5V21c0 8.3-3.6 14.6-11 20-7.4-5.4-11-11.7-11-20V11.5L24 7Z"
            fill="white"
            fillOpacity="0.96"
          />
          <path d="M19 20c2.1-2 7.9-2 10 0" stroke="#e2001a" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="18" cy="16" r="1.6" fill="#e2001a" />
          <circle cx="30" cy="16" r="1.6" fill="#e2001a" />
          <circle cx="24" cy="26.5" r="1.8" fill="#e2001a" />
          <path d="M15 29h18" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-black text-db-dark">DB Peace AI</p>
        <p className="truncate text-xs font-bold text-db-rail">{subtitle}</p>
      </div>
    </div>
  );
}

function MobileBottomNav({ activeView, onNavigate }) {
  const items = views.slice(0, 5);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-db-dark/10 bg-white/95 px-1 py-2 shadow-panel lg:hidden">
      {items.map((view) => (
        <button
          key={view.id}
          type="button"
          onClick={() => onNavigate(view.id)}
          className={`rounded text-[11px] font-black ${
            activeView === view.id ? "bg-red-50 text-db-red" : "text-db-rail"
          }`}
        >
          {view.label}
        </button>
      ))}
    </nav>
  );
}

function FooterNav({ onOpenLegal, onNavigate, activeView }) {
  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mt-6 rounded-xl border border-db-dark/10 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-db-red px-2 py-1 text-xs font-black text-white">PAI</div>
            <div>
              <p className="text-sm font-black text-db-dark">DB Peace AI · Lokaler Innovationsprototyp</p>
              <p className="text-xs font-semibold text-db-rail">
                Keine echte Datenverarbeitung · AI supports, humans decide
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <FooterButton label="Impressum" onClick={() => onOpenLegal("impressum")} />
            <FooterButton label="Datenschutz" onClick={() => onNavigate("datenschutz")} active={activeView === "datenschutz"} />
            <FooterButton label="Nutzungsbedingungen" onClick={() => onOpenLegal("nutzung")} />
            <FooterButton label="Barrierefreiheit" onClick={() => onOpenLegal("barrierefreiheit")} />
            <FooterButton label="Projektstatus" onClick={() => onOpenLegal("status")} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterButton({ label, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-black transition ${
        active ? "bg-red-50 text-db-red ring-1 ring-db-red/15" : "bg-db-soft text-db-dark hover:bg-red-50 hover:text-db-red"
      }`}
    >
      {label}
    </button>
  );
}

function LegalView({ page, onBack }) {
  if (page === "impressum") {
    return (
      <ViewFrame>
        <section className="space-y-6 p-5 lg:p-6">
          <LegalHeader title={legalViews.impressum.title} subtitle={legalViews.impressum.subtitle} onBack={onBack} />
          <p className="rounded-xl border border-db-dark/10 bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
            Dies ist ein lokaler Demonstrationsprototyp. Für eine öffentliche Veröffentlichung müssten die tatsächlichen
            Anbieterangaben nach § 5 DDG ergänzt und rechtlich geprüft werden.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <LegalField title="Anbieter / Verantwortliche Stelle" value="Platzhalter" />
            <LegalField title="Anschrift" value="Platzhalter" />
            <LegalField title="Kontakt" value="Platzhalter" />
            <LegalField title="Vertretungsberechtigte Person" value="Platzhalter" />
            <LegalField title="Projektstatus" value="Nicht offiziell eingeführtes System" />
            <LegalField title="Hinweis" value="Keine offizielle Website der Deutschen Bahn AG" />
          </div>
          <SectionCard title="Rechtlicher Prüfhinweis" text="Vor Veröffentlichung prüfen lassen." />
        </section>
      </ViewFrame>
    );
  }

  if (page === "nutzung") {
    return (
      <ViewFrame>
        <section className="space-y-6 p-5 lg:p-6">
          <LegalHeader title={legalViews.nutzung.title} subtitle={legalViews.nutzung.subtitle} onBack={onBack} />
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="Zweck" text="Der Prototyp dient nur zur Demonstration." />
            <SectionCard title="Keine Ersatzfunktion" text="Er ersetzt keine offizielle Meldestelle, Notfallhilfe oder Beratung." />
            <SectionCard title="Eingaben" text="Keine echten Vorfälle, Namen oder sensiblen Daten eingeben." />
            <SectionCard title="KI-Hinweise" text="Alle Hinweise sind Vorschläge; qualifizierte Menschen entscheiden." />
          </div>
        </section>
      </ViewFrame>
    );
  }

  if (page === "barrierefreiheit") {
    return (
      <ViewFrame>
        <section className="space-y-6 p-5 lg:p-6">
          <LegalHeader title={legalViews.barrierefreiheit.title} subtitle={legalViews.barrierefreiheit.subtitle} onBack={onBack} />
          <p className="rounded-xl border border-db-dark/10 bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
            Die Demo orientiert sich an barrierearmen UX-Grundsätzen. Vor einer echten Veröffentlichung wäre eine vollständige
            Barrierefreiheitsprüfung notwendig.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="Kontrast" text="Ausreichende Farbabstufungen und klare Lesbarkeit." />
            <SectionCard title="Labels" text="Formulare und Schaltflächen haben klare Beschriftungen." />
            <SectionCard title="Schriftgröße" text="Lesbare Größen mit stabilen Abständen." />
            <SectionCard title="Tastatur" text="Bedienung per Tastatur ist vorgesehen." />
            <SectionCard title="Farben" text="Informationen werden nicht nur über Farbe vermittelt." />
            <SectionCard title="Hinweis" text="Eine vollständige Prüfung muss vor Veröffentlichung erfolgen." />
          </div>
        </section>
      </ViewFrame>
    );
  }

  if (page === "status") {
    return (
      <ViewFrame>
        <section className="space-y-6 p-5 lg:p-6">
          <LegalHeader title={legalViews.status.title} subtitle={legalViews.status.subtitle} onBack={onBack} />
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="Lokaler Prototyp" text="Die App ist für die lokale Demo gedacht." />
            <SectionCard title="Keine echte Datenverarbeitung" text="Es werden keine echten personenbezogenen Daten verarbeitet." />
            <SectionCard title="Keine offizielle DB-Freigabe" text="Es handelt sich nicht um ein offiziell eingeführtes System." />
            <SectionCard title="Keine produktive Nutzung" text="Die Demo ist nicht für den Live-Betrieb vorgesehen." />
          </div>
          <SectionCard
            title="Nächste Schritte"
            text="Datenschutz prüfen, Compliance prüfen, IT-Sicherheit prüfen, Betriebsrat/JAV einbeziehen und eine Testphase mit anonymisierten Daten planen."
          />
        </section>
      </ViewFrame>
    );
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <LegalHeader title={legalViews.datenschutzLegal.title} subtitle={legalViews.datenschutzLegal.subtitle} onBack={onBack} />
        <p className="rounded-xl border border-db-dark/10 bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
          Diese Demo verarbeitet keine echten personenbezogenen Daten. Eingaben bleiben lokal im Prototyp. Es gibt keine echte
          Übermittlung, keine dauerhafte Speicherung, keine automatische Entscheidung und keine Überwachung. Für eine echte
          Einführung wären Datenschutzprüfung, Rechtsgrundlage, Speicherfristen, Zugriffskonzept und technische Schutzmaßnahmen
          notwendig.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Datensparsamkeit", "Nur notwendige Informationen erfassen."],
            ["Zweckbindung", "Nur für Hilfe, Prävention und Prüfung nutzen."],
            ["Transparenz", "Verständlich erklären, was die Demo macht."],
            ["Freiwilligkeit", "Nutzung und Angaben bleiben freiwillig."],
            ["Menschliche Prüfung", "Die KI unterstützt, Menschen entscheiden."],
            ["Zugriffsbeschränkung", "Nur begrenzte Rollen sollen Zugang haben."],
          ].map(([title, text]) => (
            <SectionCard key={title} title={title} text={text} />
          ))}
        </div>
      </section>
    </ViewFrame>
  );
}

function LegalHeader({ title, subtitle, onBack }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-db-dark p-5 text-white shadow-panel md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-red-200">{subtitle}</p>
        <h2 className="mt-2 text-3xl font-black">{title}</h2>
      </div>
      <button type="button" onClick={onBack} className="rounded bg-white px-4 py-3 text-sm font-black text-db-dark">
        Zurück
      </button>
    </div>
  );
}

function LegalField({ title, value }) {
  return (
    <article className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-db-red">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">{value}</p>
    </article>
  );
}

function NavButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center rounded-lg px-3 py-3 text-left text-sm font-black transition ${
        active ? "bg-red-50 text-db-red ring-1 ring-db-red/15" : "text-db-rail hover:bg-db-soft hover:text-db-dark"
      }`}
    >
      {label}
    </button>
  );
}

function ViewFrame({ children }) {
  return <div className="overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-sm">{children}</div>;
}

function OverviewView({ onNavigate }) {
  const actions = [
    ["KI-Hilfe starten", "kiHilfe"],
    ["Vorfall melden", "meldung"],
    ["Training starten", "training"],
    ["Dashboard ansehen", "dashboard"],
  ];

  const benefits = [
    ["frühere Hilfe", "Orientierung sofort statt später."],
    ["strukturierte Meldungen", "Wichtige Angaben sind gleich geordnet."],
    ["weniger manuelle Sortierung", "Vorprüfung statt Freitext-Chaos."],
  ];

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-6 text-white shadow-panel">
          <p className="text-sm font-black uppercase tracking-wider text-red-200">Lokaler Innovationsprototyp</p>
          <h1 className="mt-3 text-4xl font-black">DB Peace AI</h1>
          <p className="mt-4 text-xl font-semibold leading-8 text-white/82">
            KI-gestützte Prävention gegen Hass, Gewalt, Mobbing und Konflikte
          </p>
          <p className="mt-4 font-semibold leading-7 text-white/70">
            Lokaler Innovationsprototyp - keine echte Datenverarbeitung
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actions.map(([label, viewId]) => (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(viewId)}
              className="rounded-xl border border-db-dark/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-panel"
            >
              <p className="text-lg font-black text-db-dark">{label}</p>
              <p className="mt-1 text-sm font-semibold text-db-rail">Zum Bereich wechseln</p>
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map(([title, text]) => (
            <article key={title} className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <p className="text-lg font-black text-db-dark">{title}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </ViewFrame>
  );
}

function KiHilfeView() {
  const [issue, setIssue] = useState(issues[0]);
  const [text, setText] = useState("");
  const [response, setResponse] = useState(null);

  function generate() {
    const content = `${issue} ${text}`.toLowerCase();
    let risk = "Mittel";
    let category = "Allgemeiner Konflikt";
    let immediate = "Ruhig bleiben und den Inhalt konkret benennen.";
    let responseText = "Ich möchte die Situation sachlich klären.";
    let next = "Später dokumentieren und passende Unterstützung holen.";

    if (content.includes("droh") || content.includes("angst") || content.includes("gewalt")) {
      risk = "Hoch";
      category = "Akute Gefahr";
      immediate = "Abstand halten und die Situation nicht weiter eskalieren lassen.";
      responseText = "Ich beende das Gespräch und hole sofort Unterstützung.";
      next = "Reale Hilfe kontaktieren und erst danach dokumentieren.";
    } else if (content.includes("beleid") || content.includes("dumm")) {
      category = "Beleidigung / Mobbing";
      immediate = "Nicht zurückbeleidigen, ruhig bleiben und Grenzen setzen.";
      responseText = "Ich möchte respektvoll sprechen und bitte darum, das zu unterlassen.";
      next = "Konkrete Situation später sachlich festhalten.";
    } else if (content.includes("ausgr") || content.includes("ignor")) {
      category = "Ausgrenzung";
      immediate = "Kontakt suchen und das Muster beobachten.";
      responseText = "Mir ist wichtig, dass Informationen fair geteilt werden.";
      next = "Mit Vertrauensperson oder Ausbildungsperson besprechen.";
    } else if (content.includes("kunde") || content.includes("fahrgast")) {
      category = "Kundenkontakt";
      immediate = "Ruhig sprechen und Abstand halten.";
      responseText = "Ich kann helfen, wenn wir sachlich bleiben.";
      next = "Bei Eskalation Unterstützung holen.";
    }

    setResponse({ category, risk, immediate, responseText, next });
  }

  return (
    <ViewFrame>
      <section className="grid gap-6 p-5 lg:grid-cols-[0.95fr_1.2fr] lg:p-6">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {issues.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setIssue(item)}
                className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                  issue === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-white text-db-dark"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-db-dark p-5 text-white">
            <p className="text-sm font-black uppercase tracking-wider text-red-200">Sicherheitsnote</p>
            <p className="mt-2 font-semibold leading-7 text-white/80">
              Die KI ersetzt keine reale Hilfe. Bei akuter Gefahr bitte sofort echte Hilfe kontaktieren.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-db-dark">KI-Hilfe</h2>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="field mt-4 min-h-36 resize-y"
              placeholder="Beschreibe kurz die Situation..."
            />
            <button
              type="button"
              onClick={generate}
              className="mt-4 rounded bg-db-red px-5 py-3 font-black text-white transition hover:bg-red-700"
            >
              Hilfe generieren
            </button>
          </div>

          {response && (
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-black text-db-dark">Demo-Antwort</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ResponseBlock label="Einordnung" value={response.category} />
                <ResponseBlock label="Sofort sinnvoll" value={response.immediate} />
                <ResponseBlock label="Deeskalierende Antwort" value={response.responseText} />
                <ResponseBlock label="Nächste Schritte" value={response.next} />
              </div>
            </div>
          )}
        </div>
      </section>
    </ViewFrame>
  );
}

function MeldungView() {
  const [type, setType] = useState("Mobbing");
  const [context, setContext] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Mittel");
  const [anonymous, setAnonymous] = useState(true);
  const [summary, setSummary] = useState(null);

  function createSummary() {
    setSummary({
      category: type,
      risk: urgency,
      shortSummary: description.slice(0, 120) || "Kurzbeschreibung folgt nach Eingabe.",
      nextStep: urgency === "Hoch" ? "Sofort reale Hilfe prüfen." : "Meldung für menschliche Prüfung vorbereiten.",
    });
  }

  return (
    <ViewFrame>
      <section className="grid gap-6 p-5 lg:grid-cols-[1fr_0.95fr] lg:p-6">
        <div className="space-y-4 rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Art des Vorfalls</span>
            <select className="field" value={type} onChange={(event) => setType(event.target.value)}>
              <option>Mobbing</option>
              <option>Beleidigung</option>
              <option>Hassrede</option>
              <option>Gewaltandrohung</option>
              <option>Diskriminierung</option>
              <option>Ausgrenzung</option>
              <option>Konflikt im Team</option>
              <option>Aggressiver Kunde/Fahrgast</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Kontext</span>
            <input className="field" value={context} onChange={(event) => setContext(event.target.value)} placeholder="Werkstatt, Bahnhof, Büro, Gruppenchat..." />
          </label>
          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Beschreibung</span>
            <textarea className="field min-h-36 resize-y py-3" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Was ist passiert?" />
          </label>
          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Dringlichkeit</span>
            <select className="field" value={urgency} onChange={(event) => setUrgency(event.target.value)}>
              <option>Niedrig</option>
              <option>Mittel</option>
              <option>Hoch</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 font-bold text-db-dark">
            <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} className="h-4 w-4 accent-db-red" />
            Anonym bleiben
          </label>
          <button
            type="button"
            onClick={createSummary}
            className="rounded bg-db-red px-5 py-3 font-black text-white transition hover:bg-red-700"
          >
            Demo-Zusammenfassung erstellen
          </button>
          <p className="text-sm font-semibold leading-6 text-db-rail">
            Diese Demo übermittelt keine echten Meldungen.
          </p>
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-db-dark">Vorschau</h3>
          {summary ? (
            <div className="mt-4 space-y-3">
              <PreviewRow label="Kategorie" value={summary.category} />
              <PreviewRow label="Risiko" value={summary.risk} />
              <PreviewRow label="Kurzbeschreibung" value={summary.shortSummary} />
              <PreviewRow label="Nächster Schritt" value={summary.nextStep} />
            </div>
          ) : (
            <p className="mt-4 text-sm font-semibold leading-6 text-db-rail">
              Eine kurze Demo-Zusammenfassung erscheint nach dem Klick.
            </p>
          )}
        </div>
      </section>
    </ViewFrame>
  );
}

function TrainingView() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  function evaluate() {
    const lower = answer.toLowerCase();
    let score = 3;
    let better = "Ruhig bleiben, Grenze setzen und Unterstützung holen.";

    if (lower.includes("beleid") || lower.includes("zurück")) {
      score = 1;
      better = "Nicht zurückbeleidigen, sondern ruhig und klar bleiben.";
    } else if (lower.includes("ruhe") || lower.includes("hilfe") || lower.includes("abstand")) {
      score = 5;
      better = "Das ist bereits eine gute deeskalierende Richtung.";
    }

    setFeedback({ score, better });
  }

  return (
    <ViewFrame>
      <section className="grid gap-6 p-5 lg:grid-cols-[0.9fr_1.1fr] lg:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario}
              type="button"
              onClick={() => setSelectedScenario(scenario)}
              className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                selectedScenario === scenario ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-white text-db-dark"
              }`}
            >
              {scenario}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-db-dark">{selectedScenario}</h2>
            <textarea
              className="field mt-4 min-h-32 resize-y"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Was würdest du tun?"
            />
            <button
              type="button"
              onClick={evaluate}
              className="mt-4 rounded bg-db-red px-5 py-3 font-black text-white transition hover:bg-red-700"
            >
              Antwort prüfen
            </button>
          </div>

          {feedback && (
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-black text-db-dark">Feedback</h3>
              <p className="mt-3 font-semibold leading-7 text-db-rail">Score: {feedback.score}/5</p>
              <p className="mt-2 font-semibold leading-7 text-db-rail">{feedback.better}</p>
            </div>
          )}
        </div>
      </section>
    </ViewFrame>
  );
}

function DashboardView() {
  const [cases, setCases] = useState(25);
  const [minutes, setMinutes] = useState(60);
  const [hourlyCost, setHourlyCost] = useState(50);
  const [savingPercent, setSavingPercent] = useState(35);

  const totalHours = (cases * minutes) / 60;
  const savedHours = totalHours * (savingPercent / 100);
  const monthly = savedHours * hourlyCost;
  const yearly = monthly * 12;

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Offene Demo-Meldungen" value="18" />
          <MetricCard title="Strukturierte Fälle" value="42" />
          <MetricCard title="Trainingsfortschritt" value="82 %" />
          <MetricCard title="Geschätzte Zeitersparnis" value="31,5 Std." />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-black text-db-dark">Kategorieübersicht</h3>
            <div className="mt-4 space-y-4">
              {categories.map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm font-black text-db-rail">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-3 rounded bg-db-soft">
                    <div className="h-3 rounded bg-db-red" style={{ width: `${(value / 16) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-black text-db-dark">Risikoverteilung</h3>
            <div className="mt-4 grid gap-3">
              {[
                ["Niedrig", "35%", "bg-emerald-50 text-emerald-700"],
                ["Mittel", "48%", "bg-amber-50 text-amber-700"],
                ["Hoch", "17%", "bg-red-50 text-red-700"],
              ].map(([label, value, style]) => (
                <div key={label} className={`rounded-xl p-4 font-black ${style}`}>
                  <div className="flex items-center justify-between">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-db-dark">Kostenersparnis-Rechner</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InputCard label="Fälle pro Monat" value={cases} onChange={setCases} />
            <InputCard label="Minuten pro Fall" value={minutes} onChange={setMinutes} />
            <InputCard label="Stundenkosten" value={hourlyCost} onChange={setHourlyCost} />
            <InputCard label="Ersparnis in %" value={savingPercent} onChange={setSavingPercent} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ResultCard label="Gesamtzeit ohne System" value={`${totalHours.toFixed(1)} Std.`} />
            <ResultCard label="Eingesparte Stunden" value={`${savedHours.toFixed(1)} Std.`} />
            <ResultCard label="Monatliche Einsparung" value={`${monthly.toFixed(0)} EUR`} />
            <ResultCard label="Jährliche Einsparung" value={`${yearly.toFixed(0)} EUR`} />
          </div>
          <p className="mt-4 text-sm font-semibold leading-6 text-db-rail">
            Demo-Schätzung, müsste intern validiert werden.
          </p>
        </div>
      </section>
    </ViewFrame>
  );
}

function DatenschutzView() {
  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
          <p className="text-sm font-black uppercase tracking-wider text-red-200">DSGVO-bewusstes Konzept</p>
          <h2 className="mt-2 text-3xl font-black">Datenschutz</h2>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-white/75">
            Diese Demo verarbeitet keine echten personenbezogenen Daten. Es gibt keine Überwachung, keine automatische
            Entscheidung und keine dauerhafte Speicherung.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Keine Überwachung", "Die Demo beobachtet keine realen Chats oder Personen."],
            ["Keine automatische Entscheidung", "Die KI liefert nur Vorschläge; Menschen entscheiden."],
            ["Menschliche Prüfung", "Kritische Fälle gehören in geschulte Hände."],
            ["Anonymisierung", "Eingaben können ohne Namen und ohne direkte Zuordnung bleiben."],
            ["Datensparsamkeit", "Es werden nur wenige, notwendige Angaben verwendet."],
            ["Transparenz", "Die Demo erklärt sichtbar, was sie tut und was nicht."],
          ].map(([title, detail]) => (
            <article key={title} className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <p className="text-lg font-black text-db-dark">{title}</p>
              <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">{detail}</p>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-db-dark/10 bg-db-dark p-5 text-white shadow-panel">
          <p className="font-semibold leading-7 text-white/80">
            Diese Demo ersetzt keine rechtliche Prüfung durch Datenschutz, Compliance, IT-Sicherheit oder Betriebsrat/JAV.
          </p>
        </div>
      </section>
    </ViewFrame>
  );
}

function ProjektView() {
  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <SectionCard title="Problem" text="Hass, Mobbing, Gewalt und Konflikte werden oft zu spät oder unstrukturiert sichtbar." />
        <SectionCard title="Lösung" text="DB Peace AI hilft beim Strukturieren, Melden, Trainieren und Einordnen - nicht beim Entscheiden." />
        <SectionCard title="Hauptfunktionen" text="KI-Hilfe, Meldung, Training, Dashboard und Datenschutz." />
        <SectionCard title="Nutzen für DB" text="Frühere Hilfe, klarere Meldungen, weniger Rückfragen, bessere Vorbereitung." />
        <SectionCard title="Datenschutzprinzip" text="Anonym nutzbar, keine Überwachung, keine automatische Bestrafung, Menschen entscheiden." />
        <SectionCard title="Nächste Schritte" text="Fachliche Prüfung mit Datenschutz, Compliance, IT-Sicherheit und Gremien." />
        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <p className="whitespace-pre-line text-lg font-semibold leading-8 text-db-rail">
            {`DB Peace AI ist ein lokaler Demonstrationsprototyp für Prävention gegen Hass, Gewalt, Mobbing und Konflikte.

Die KI unterstützt nur beim Strukturieren und Formulieren. Menschen entscheiden.

Für die DB könnte das frühere Hilfe, klarere Meldungen und weniger Rückfragen bedeuten.`}
          </p>
        </div>
      </section>
    </ViewFrame>
  );
}

function SectionCard({ title, text }) {
  return (
    <article className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <p className="text-lg font-black text-db-dark">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">{text}</p>
    </article>
  );
}

function MetricCard({ title, value }) {
  return (
    <article className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-black text-db-rail">{title}</p>
      <p className="mt-2 text-3xl font-black text-db-dark">{value}</p>
    </article>
  );
}

function InputCard({ label, onChange, value }) {
  return (
    <label className="block">
      <span className="mb-2 block font-black text-db-dark">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="field"
      />
    </label>
  );
}

function ResultCard({ label, value }) {
  return (
    <article className="rounded-xl bg-db-soft p-4">
      <p className="text-sm font-bold text-db-rail">{label}</p>
      <p className="mt-2 text-2xl font-black text-db-dark">{value}</p>
    </article>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div className="rounded-lg bg-db-soft p-4">
      <p className="text-xs font-black uppercase tracking-wide text-db-red">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-db-rail">{value}</p>
    </div>
  );
}

function ResponseBlock({ label, value }) {
  return (
    <div className="rounded-lg bg-db-soft p-4">
      <p className="text-xs font-black uppercase tracking-wide text-db-red">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-db-rail">{value}</p>
    </div>
  );
}

export default App;
