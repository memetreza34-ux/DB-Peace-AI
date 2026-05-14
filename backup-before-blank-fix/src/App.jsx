import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardList,
  EyeOff,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageSquareText,
  MonitorCheck,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import AnonymousReport from "./components/AnonymousReport.jsx";
import DashboardAnalytics from "./components/DashboardAnalytics.jsx";
import KiKonflikthelfer from "./components/KiKonflikthelfer.jsx";
import PrivacyCompliance from "./components/PrivacyCompliance.jsx";
import ProjectOverview from "./components/ProjectOverview.jsx";
import TrainingMode from "./components/TrainingMode.jsx";

const views = [
  {
    id: "overview",
    label: "Übersicht",
    title: "Übersicht",
    description: "Zentrale Startseite für den lokalen DB Peace AI Demonstrationsprototyp.",
    icon: Home,
  },
  {
    id: "ki",
    label: "KI-Hilfe",
    title: "KI-Hilfe",
    description: "Konflikthelfer, strukturierte Antworten, Formulierungshilfe und Meldungsentwurf.",
    icon: MessageSquareText,
  },
  {
    id: "meldung",
    label: "Anonyme Meldung",
    title: "Anonyme Meldung",
    description: "Mehrstufige Demo-Meldung mit lokaler KI-Strukturierung und Vorschau.",
    icon: EyeOff,
  },
  {
    id: "training",
    label: "Training",
    title: "Training",
    description: "Realistische Simulationen für Deeskalation, Sicherheit und klare Kommunikation.",
    icon: GraduationCap,
  },
  {
    id: "analytics",
    label: "Dashboard",
    title: "Dashboard",
    description: "Anonymisierte Kennzahlen, Kategorien, Risiko und Kostenersparnis.",
    icon: BarChart3,
  },
  {
    id: "datenschutz",
    label: "Datenschutz",
    title: "Datenschutz",
    description: "DSGVO-bewusstes Konzept, KI-Governance, Mindestschutz und Prüfung.",
    icon: ShieldCheck,
  },
  {
    id: "projekt",
    label: "Projekt",
    title: "Projekt",
    description: "Kurzpräsentation mit Problem, Lösung, Nutzen und nächsten Schritten.",
    icon: FileText,
  },
];

const hashToView = {
  "#start": "overview",
  "#overview": "overview",
  "#ki-hilfe": "ki",
  "#meldung": "meldung",
  "#training": "training",
  "#unterstuetzung": "datenschutz",
  "#dashboard": "analytics",
  "#datenschutz": "datenschutz",
  "#projektuebersicht": "projekt",
  "#projekt-problem": "projekt",
  "#projekt-loesung": "projekt",
  "#projekt-nutzen": "projekt",
  "#projekt-datenschutz": "projekt",
};

const viewToHash = {
  overview: "#overview",
  ki: "#ki-hilfe",
  meldung: "#meldung",
  training: "#training",
  analytics: "#dashboard",
  datenschutz: "#datenschutz",
  projekt: "#projektuebersicht",
};

const featureComponents = {
  ki: KiKonflikthelfer,
  meldung: AnonymousReport,
  training: TrainingMode,
  analytics: DashboardAnalytics,
  datenschutz: PrivacyCompliance,
  projekt: ProjectOverview,
};

function App() {
  const [activeView, setActiveView] = useState(() => {
    if (typeof window === "undefined") return "overview";
    const initialHash = hashToView[window.location.hash];
    return initialHash ?? "overview";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const currentView = views.find((view) => view.id === activeView) ?? views[0];
  const ActiveComponent = featureComponents[activeView];

  useEffect(() => {
    const syncFromHash = () => {
      const nextView = hashToView[window.location.hash] ?? "overview";
      setActiveView(nextView);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function navigate(viewId) {
    setActiveView(viewId);
    setMenuOpen(false);
    const nextHash = viewToHash[viewId] ?? "#overview";
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleInternalNavigation(event) {
    const link = event.target.closest?.("a[href^='#']");
    if (!link) return;
    const viewId = hashToView[link.getAttribute("href")];
    if (!viewId) return;
    if (viewId === activeView) return;
    event.preventDefault();
    navigate(viewId);
  }

  return (
    <div className="min-h-screen bg-db-soft text-db-dark" onClick={handleInternalNavigation}>
      <div className="fixed left-4 top-4 z-50 rounded bg-white px-3 py-2 text-sm font-black text-db-red shadow-sm ring-1 ring-db-red/20">
        DB Peace AI loaded
      </div>
      <Sidebar activeView={activeView} onNavigate={navigate} />
      <MobileHeader activeView={currentView} menuOpen={menuOpen} onNavigate={navigate} setMenuOpen={setMenuOpen} />
      <main className="min-h-screen pb-24 lg:ml-72 lg:pb-0">
        <TopBar activeView={currentView} />
        <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-wider text-db-red">DB Peace AI</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-db-dark sm:text-4xl">
              {currentView.title}
            </h1>
            <p className="mt-2 max-w-3xl font-semibold leading-7 text-db-rail">{currentView.description}</p>
          </div>
          {activeView === "overview" ? (
            <OverviewDashboard onNavigate={navigate} />
          ) : (
            <ViewFrame>{ActiveComponent && <ActiveComponent />}</ViewFrame>
          )}
        </div>
      </main>
      <MobileBottomNav activeView={activeView} onNavigate={navigate} />
    </div>
  );
}

function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-db-dark/10 bg-white lg:flex lg:flex-col">
      <div className="border-b border-db-dark/10 p-5">
        <button type="button" onClick={() => onNavigate("overview")} className="flex w-full items-center gap-3 text-left">
          <span className="flex h-11 w-14 items-center justify-center rounded bg-db-red text-lg font-black text-white">
            PAI
          </span>
          <span>
            <span className="block text-base font-black text-db-dark">Peace AI</span>
            <span className="block text-xs font-bold text-db-rail">Interner Demo-Prototyp</span>
          </span>
        </button>
        <div className="mt-4 rounded-lg border border-db-dark/10 bg-db-soft p-3">
          <p className="flex gap-2 text-xs font-bold leading-5 text-db-rail">
            <LockKeyhole className="mt-0.5 shrink-0 text-db-red" size={16} aria-hidden="true" />
            Lokal, ohne echte Daten, keine Überwachung. KI unterstützt, Menschen entscheiden.
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Hauptnavigation">
        {views.map((view) => (
          <NavButton key={view.id} active={activeView === view.id} view={view} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="border-t border-db-dark/10 p-4">
        <button
          type="button"
          onClick={() => onNavigate("meldung")}
          className="flex w-full items-center justify-center gap-2 rounded bg-db-red px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
        >
          Demo-Meldung starten
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

function NavButton({ active, onNavigate, view }) {
  const Icon = view.icon;
  return (
    <button
      type="button"
      onClick={() => onNavigate(view.id)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-black transition ${
        active
          ? "bg-red-50 text-db-red ring-1 ring-db-red/15"
          : "text-db-rail hover:bg-db-soft hover:text-db-dark"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon size={19} aria-hidden="true" />
      <span>{view.label}</span>
    </button>
  );
}

function MobileHeader({ activeView, menuOpen, onNavigate, setMenuOpen }) {
  return (
    <header className="sticky top-0 z-40 border-b border-db-dark/10 bg-white/95 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button type="button" onClick={() => onNavigate("overview")} className="flex items-center gap-3 text-left">
          <span className="flex h-10 w-12 items-center justify-center rounded bg-db-red font-black text-white">PAI</span>
          <span>
            <span className="block text-sm font-black text-db-dark">Peace AI</span>
            <span className="block text-xs font-bold text-db-rail">{activeView.label}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-db-dark/10 text-db-dark"
          aria-label={menuOpen ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {menuOpen && (
        <div className="grid gap-2 border-t border-db-dark/10 bg-white p-3 shadow-panel">
          {views.map((view) => (
            <NavButton key={view.id} active={activeView.id === view.id} view={view} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </header>
  );
}

function TopBar({ activeView }) {
  const Icon = activeView.icon;
  return (
    <div className="hidden border-b border-db-dark/10 bg-white/90 px-8 py-4 backdrop-blur-xl lg:block">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
            <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded bg-red-50 text-db-red">
            <Icon size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-black text-db-dark">{activeView.label}</p>
            <p className="text-xs font-bold text-db-rail">Lokaler Innovationsprototyp · keine offizielle Einführung</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <StatusBadge icon={ShieldCheck} text="DSGVO-bewusstes Konzept" />
          <StatusBadge icon={EyeOff} text="Keine Überwachung" />
          <StatusBadge icon={UsersRound} text="Menschliche Prüfung" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded bg-db-soft px-3 py-2 text-xs font-black text-db-rail ring-1 ring-db-dark/10">
      <Icon size={15} className="text-db-red" aria-hidden="true" />
      {text}
    </span>
  );
}

function MobileBottomNav({ activeView, onNavigate }) {
  const items = views.slice(0, 5);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-db-dark/10 bg-white/95 px-1 py-2 shadow-panel backdrop-blur-xl lg:hidden" aria-label="Schnellnavigation">
      {items.map((view) => {
        const Icon = view.icon;
        const active = activeView === view.id;
        return (
          <button
            key={view.id}
            type="button"
            onClick={() => onNavigate(view.id)}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded text-[11px] font-black transition ${
              active ? "bg-red-50 text-db-red" : "text-db-rail"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{view.label.split(" ")[0]}</span>
          </button>
        );
      })}
    </nav>
  );
}

function ViewFrame({ children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-sm">
      <div className="app-view-content">{children}</div>
    </div>
  );
}

function OverviewDashboard({ onNavigate }) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-db-dark text-white shadow-panel">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-red-100 ring-1 ring-white/10">
              <ShieldCheck size={15} aria-hidden="true" />
              Lokaler Innovationsprototyp
            </p>
            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">DB Peace AI</h2>
            <p className="mt-4 max-w-3xl text-xl font-semibold leading-8 text-white/82">
              KI-gestützte Prävention gegen Hass, Gewalt, Mobbing und Konflikte.
            </p>
            <p className="mt-4 max-w-3xl font-semibold leading-7 text-white/70">
              Diese Demo nutzt keine echten DB-Daten, speichert keine personenbezogenen Daten und
              zeigt nur ein compliance-orientiertes Konzept. Keine Überwachung, keine automatische
              Entscheidung: Menschen prüfen und entscheiden.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {quickActions.map(({ icon: Icon, label, target, text }) => (
              <button
                key={label}
                type="button"
                onClick={() => onNavigate(target)}
                className="rounded-lg bg-white p-5 text-left text-db-dark shadow-sm transition hover:-translate-y-0.5 hover:shadow-panel"
              >
                <Icon className="text-db-red" size={25} aria-hidden="true" />
                <p className="mt-4 text-lg font-black">{label}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-db-rail">{text}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <KpiOverview />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <RecommendedCard onNavigate={onNavigate} />
        <WhySystem />
      </div>

      <ComplianceStrip onNavigate={onNavigate} />
    </div>
  );
}

const quickActions = [
  {
    label: "KI-Hilfe starten",
    text: "Konflikt beschreiben und strukturierte Hilfe erhalten.",
    target: "ki",
    icon: Bot,
  },
  {
    label: "Vorfall anonym melden",
    text: "Eine Demo-Meldung schrittweise vorbereiten.",
    target: "meldung",
    icon: EyeOff,
  },
  {
    label: "Training starten",
    text: "Deeskalation in realistischen Szenarien üben.",
    target: "training",
    icon: GraduationCap,
  },
  {
    label: "Hilfe anzeigen",
    text: "Notfallhinweise und Unterstützung finden.",
    target: "hilfe",
    icon: HelpCircle,
  },
];

function KpiOverview() {
  const kpis = [
    ["18", "Offene Demo-Meldungen", "fiktive Fälle zur Darstellung", ClipboardList],
    ["82%", "Trainingsfortschritt", "durchschnittlicher Demo-Wert", GraduationCap],
    ["31,5 Std.", "Geschätzte Zeitersparnis", "müsste intern validiert werden", MonitorCheck],
    ["4", "Hochrisiko-Hinweise", "nur Priorisierungsvorschlag", AlertTriangle],
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map(([value, label, text, Icon]) => (
        <article key={label} className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-3xl font-black text-db-dark">{value}</p>
              <h3 className="mt-2 font-black text-db-dark">{label}</h3>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded bg-red-50 text-db-red">
              <Icon size={20} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-db-rail">{text}</p>
        </article>
      ))}
    </section>
  );
}

function RecommendedCard({ onNavigate }) {
  const items = [
    ["Training: Aggressiver Fahrgast", "training", GraduationCap],
    ["Datenschutz prüfen", "datenschutz", ShieldCheck],
    ["Meldungsvorlage testen", "meldung", EyeOff],
  ];

  return (
    <section className="rounded-xl border border-db-dark/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-db-dark">Heute empfohlen</h2>
      <div className="mt-5 grid gap-3">
        {items.map(([label, target, Icon]) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(target)}
            className="flex items-center justify-between gap-3 rounded-lg border border-db-dark/10 bg-db-soft p-4 text-left font-black text-db-dark transition hover:border-db-red hover:text-db-red"
          >
            <span className="flex items-center gap-3">
              <Icon size={20} className="text-db-red" aria-hidden="true" />
              {label}
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

function WhySystem() {
  const points = [
    ["Frühere Hilfe", "Betroffene erhalten schneller Orientierung, ohne reale Daten übermitteln zu müssen."],
    ["Bessere Struktur", "Meldungen und Situationen werden verständlicher vorbereitet."],
    ["Weniger Rückfragen", "Wichtige Details werden im Demo-Workflow systematischer abgefragt."],
    ["Menschliche Prüfung", "Die KI entscheidet nicht und ersetzt keine zuständigen Stellen."],
  ];

  return (
    <section className="rounded-xl border border-db-dark/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-db-dark">Warum dieses System?</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {points.map(([title, text]) => (
          <article key={title} className="rounded-lg bg-db-soft p-4">
            <CheckCircle2 className="text-emerald-600" size={20} aria-hidden="true" />
            <h3 className="mt-3 font-black text-db-dark">{title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComplianceStrip({ onNavigate }) {
  return (
    <section className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="flex items-start gap-3 font-semibold leading-7 text-db-rail">
          <LockKeyhole className="mt-1 shrink-0 text-db-red" size={20} aria-hidden="true" />
          Vor echter Einführung wären Datenschutzprüfung, Compliance-Bewertung, IT-Sicherheit und
          Beteiligung zuständiger Gremien/Betriebsrat/JAV notwendig.
        </p>
        <button
          type="button"
          onClick={() => onNavigate("datenschutz")}
          className="inline-flex items-center justify-center gap-2 rounded bg-db-red px-5 py-3 font-black text-white transition hover:bg-red-700"
        >
          Standards ansehen
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export default App;
