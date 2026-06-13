import { useEffect, useRef, useState } from "react";
import {
  Home,
  LifeBuoy,
  NotebookPen,
  Megaphone,
  GraduationCap,
  Lightbulb,
  Newspaper,
  Phone,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  Clock,
  Users,
  Landmark,
  ExternalLink,
  HeartHandshake,
  Send,
  ChevronDown,
  Scale,
  FileText,
} from "lucide-react";

const views = [
  { id: "overview", label: "Start", icon: Home },
  { id: "kiHilfe", label: "Hilfe", icon: LifeBuoy },
  { id: "protokoll", label: "Festhalten", icon: NotebookPen },
  { id: "meldung", label: "Melden", icon: Megaphone },
  { id: "training", label: "Lernen", icon: GraduationCap },
  { id: "ideen", label: "Ideen", icon: Lightbulb },
  { id: "news", label: "Azubi-News", icon: Newspaper },
];

const issues = [
  "Beleidigung",
  "Drohung",
  "Mobbing",
  "Diskriminierung",
  "Konflikt mit Kolleg/in",
  "Aggressiver Kunde/Fahrgast",
];

const scenarios = [
  {
    title: "Aggressiver Fahrgast",
    situation: "Ein Fahrgast ist laut, wütend und beleidigt Mitarbeitende wegen einer Verspätung.",
    goal: "Ruhig bleiben, Abstand wahren und nicht eskalieren lassen.",
    answers: [
      "Ich antworte ebenso scharf zurück, damit Ruhe ist.",
      "Ich bleibe ruhig, nenne die Grenze und hole Unterstützung, wenn es weiter eskaliert.",
      "Ich ignoriere die Situation komplett und gehe weg.",
    ],
    better: "Ruhig bleiben, die Grenze klar benennen und Sicherheit vorziehen.",
  },
  {
    title: "Mobbing in der Werkstatt",
    situation: "Ein Azubi wird vor anderen klein gemacht und wiederholt ausgelacht.",
    goal: "Mobbing erkennen, dokumentieren und Unterstützung holen.",
    answers: [
      "Ich sage nichts, damit es nicht noch peinlicher wird.",
      "Ich spreche die Situation ruhig an und suche danach eine Vertrauensperson.",
      "Ich mache die Person vor allen anderen ebenfalls lächerlich.",
    ],
    better: "Ruhe bewahren, Verhalten benennen und die Situation nicht allein lassen.",
  },
  {
    title: "Diskriminierende Aussage",
    situation: "In einer Gruppe fällt ein abwertender Kommentar über Herkunft, Religion oder Aussehen.",
    goal: "Grenzen setzen und Respekt einfordern.",
    answers: [
      "Ich lache mit, damit ich nicht auffalle.",
      "Ich sage klar, dass der Kommentar nicht okay ist, und halte die Situation fest.",
      "Ich diskutiere endlos, bis alle genervt sind.",
    ],
    better: "Klar widersprechen und später sachlich dokumentieren.",
  },
  {
    title: "Konflikt im Gruppenchat",
    situation: "Ein Chat kippt in Vorwürfe, Beleidigungen und Ausgrenzung.",
    goal: "Eskalation stoppen und Inhalte später ordnen.",
    answers: [
      "Ich schreibe sofort wütend zurück.",
      "Ich antworte sachlich, beende die Eskalation und sichere den Verlauf.",
      "Ich lösche alles und tue so, als sei nichts gewesen.",
    ],
    better: "Sachebene halten und relevante Inhalte sichern.",
  },
  {
    title: "Gewaltandrohung",
    situation: "Eine Person droht mit körperlicher Gewalt und die Stimmung wirkt angespannt.",
    goal: "Sicherheit priorisieren, Abstand schaffen und Unterstützung holen.",
    answers: [
      "Ich fordere die Person direkt heraus.",
      "Ich halte Abstand, beende die Situation und hole sofort Unterstützung.",
      "Ich tue so, als hätte ich nichts gehört.",
    ],
    better: "Sicherheit geht vor: Distanz, Unterstützung und keine Eskalation.",
  },
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

const profileRoles = ["Azubi", "Mitarbeiter/in", "Ausbilder/in", "Vertrauensperson", "Demo-Gast"];
const profileAreas = ["Werkstatt", "Bahnhof", "Büro", "Ausbildung", "Kundenkontakt", "Gruppenchat", "Sonstiges"];

const protocolTypes = [
  "Beleidigung",
  "Mobbing",
  "Hassrede",
  "Diskriminierung",
  "Gewaltandrohung",
  "Aggressiver Kunde/Fahrgast",
  "Konflikt im Team",
  "Sonstiges",
];

const reportTypes = [
  "Mobbing",
  "Beleidigung",
  "Hassrede",
  "Diskriminierung",
  "Gewaltandrohung",
  "Aggressiver Kunde/Fahrgast",
  "Konflikt im Team",
  "Ausgrenzung",
  "Sexuelle Belästigung",
  "Sonstiges",
];

const protocolInvolvement = [
  "Ich bin selbst betroffen",
  "Ich habe es beobachtet",
  "Ich dokumentiere für eine andere Person",
  "Ich bin unsicher",
];

const protocolRepetition = ["Einmalig", "Mehrfach", "Regelmäßig", "Schon länger"];

const protocolEvidence = [
  "Chatnachricht vorhanden",
  "Screenshot vorhanden",
  "Zeugen vorhanden",
  "Datum/Uhrzeit bekannt",
  "Ort/Kontext bekannt",
  "Keine Beweise vorhanden",
];

const protocolDangerOptions = [
  "Nein",
  "Unsicher",
  "Ja, es könnte eskalieren",
  "Ja, direkte Gefahr",
];

const protocolStatusOptions = ["Entwurf", "In Prüfung vorbereiten", "Abgeschlossen", "Beobachten"];
const protocolRiskOptions = ["Alle", "Niedrig", "Mittel", "Hoch"];
const protocolPeriodOptions = ["Alle", "Heute", "Diese Woche", "Dieser Monat"];
const protocolSortOptions = ["Neueste zuerst", "Älteste zuerst", "Höchstes Risiko", "Kategorie A-Z"];
const defaultProtocolFolders = [
  "Alle Protokolle",
  "Entwürfe",
  "Hohe Dringlichkeit",
  "Beobachten",
  "Für Meldung vorbereiten",
  "Abgeschlossen",
];

const helpContacts = [
  ["Ausbilder/in", "Platzhalter für zuständige Ausbildungsperson"],
  ["Vertrauensperson", "Platzhalter für vertrauliche Ansprechperson"],
  ["HR/Personalbereich", "Platzhalter für Personalbereich"],
  ["Compliance/Meldestelle", "Platzhalter für interne Meldestelle"],
  ["Betriebsrat/JAV", "Platzhalter für Interessenvertretung"],
  ["Sicherheitsstelle", "Platzhalter für Sicherheit oder Leitstelle"],
];

const documentationChecklist = [
  "Datum und Uhrzeit notieren",
  "Ort oder Kontext beschreiben",
  "sachliche Beschreibung festhalten",
  "Beteiligung ohne echte Namen dokumentieren",
  "Hinweise oder Belege sichern",
  "Belastung und akute Gefahr einschätzen",
];

const prototypeLimits = [
  "keine echte Meldestelle",
  "keine Notfallhilfe",
  "keine Rechtsberatung",
  "keine psychologische Beratung",
  "keine echte Datenübermittlung",
  "vor echter Einführung wären Prüfungen nötig",
];

const resourceCategories = [
  ["DB-interne Angebote", "Platzhalter für interne Schulungen, Community-Angebote, Ausbildungsangebote und Unterstützungsmöglichkeiten."],
  ["EVG / Gewerkschaft", "Platzhalter für Bildungsangebote, Jugendseminare, Beratung und Unterstützung."],
  ["Staatliche / öffentliche Angebote", "Platzhalter für mögliche Programme zu Demokratiebildung, Gewaltprävention, Anti-Rassismus und Zivilcourage."],
  ["Externe Beratungsstellen", "Platzhalter für Beratungs- und Präventionsangebote."],
  ["Online-Lernangebote", "Kurzformate, Lernkarten und digitale Trainings zu Konfliktlösung und respektvoller Kommunikation."],
];

const demoResources = [
  {
    title: "Deeskalation im Kundenkontakt",
    providerType: "DB-intern",
    topic: "Gewaltprävention",
    format: "Hybrid",
    cost: "muss geprüft werden",
    audience: "Azubis, Kundenkontakt, Bahnhof",
    duration: "1 Tag",
    description: "Training zu Abstand, klarer Kommunikation und sicherem Verhalten bei angespannten Situationen.",
    suitableFor: "Kundenkontakt, Bahnhof, Service",
    status: "Demo-Eintrag",
  },
  {
    title: "Mobbing erkennen und richtig handeln",
    providerType: "Online-Lernen",
    topic: "Mobbing",
    format: "Online",
    cost: "kostenlos möglich",
    audience: "Azubis und Mitarbeitende",
    duration: "60-90 Minuten",
    description: "Lerne Warnzeichen, Dokumentation und angemessene nächste Schritte kennen.",
    suitableFor: "Teams, Ausbildung, Vertrauenspersonen",
    status: "Demo-Eintrag",
  },
  {
    title: "Diskriminierung und Hassrede im Arbeitsumfeld",
    providerType: "Extern",
    topic: "Diskriminierung",
    format: "Hybrid",
    cost: "muss geprüft werden",
    audience: "Azubis, Mitarbeitende, Führungskräfte",
    duration: "Halbtägig",
    description: "Orientierung zu diskriminierenden Aussagen, Grenzen und respektvoller Intervention.",
    suitableFor: "Prävention, Teamkultur, Ausbildung",
    status: "Demo-Eintrag",
  },
  {
    title: "Zivilcourage sicher zeigen",
    providerType: "Staatlich/öffentlich",
    topic: "Zivilcourage",
    format: "Präsenz",
    cost: "kostenlos möglich",
    audience: "Azubis und Mitarbeitende",
    duration: "Workshop",
    description: "Sicher helfen, Grenzen beachten und Unterstützung holen, ohne sich selbst zu gefährden.",
    suitableFor: "Bahnhof, Gruppen, Alltagssituationen",
    status: "Demo-Eintrag",
  },
  {
    title: "Gesprächsführung bei Konflikten",
    providerType: "EVG/Gewerkschaft",
    topic: "Deeskalation",
    format: "Präsenz",
    cost: "muss geprüft werden",
    audience: "Azubis, JAV, Mitarbeitende",
    duration: "Seminar",
    description: "Demo-Seminar zu klarer Sprache, Zuhören und Konfliktklärung.",
    suitableFor: "Teamkonflikte, Ausbildung, Interessenvertretung",
    status: "Demo-Eintrag",
  },
];

const resourceTopics = ["Alle", "Mobbing", "Diskriminierung", "Gewaltprävention", "Deeskalation", "Zivilcourage", "psychische Belastung"];
const resourceFormats = ["Alle", "Online", "Präsenz", "Hybrid"];
const resourceCosts = ["Alle", "kostenlos möglich", "kostenpflichtig", "muss geprüft werden"];
const resourceProviders = ["Alle", "DB-intern", "EVG/Gewerkschaft", "Staatlich/öffentlich", "Extern", "Online-Lernen"];
const resourceNeeds = [
  "Ich erlebe Mobbing",
  "Ich erlebe Diskriminierung",
  "Ich hatte Kontakt mit Gewalt/Drohung",
  "Ich möchte Deeskalation lernen",
  "Ich möchte anderen helfen",
  "Ich bin unsicher",
];

const profileStorageKey = "db-peace-ai-demo-profile";
const protocolStorageKey = "db-peace-ai-demo-protocols";
const reportDraftStorageKey = "db-peace-ai-demo-report-drafts";
const resourceSuggestionsStorageKey = "db-peace-ai-demo-resource-suggestions";
const communityDraftStorageKey = "db-peace-ai-demo-community-drafts";

const profileDefaults = {
  displayName: "",
  role: "Demo-Gast",
  area: "Sonstiges",
  anonymous: true,
  confirmed: false,
};

const emptyProtocol = () => ({
  date: todayIso(),
  time: currentTime(),
  location: "",
  area: "Sonstiges",
  type: "Beleidigung",
  description: "",
  involvement: "Ich bin unsicher",
  repetition: "Einmalig",
  evidence: [],
  attachments: [],
  burden: 3,
  danger: "Nein",
  status: "Entwurf",
  folder: "Alle Protokolle",
});

const emptyReportDraft = () => ({
  mode: "entwurf",
  name: "",
  contact: "",
  role: "",
  area: "Sonstiges",
  category: "Mobbing",
  date: todayIso(),
  time: currentTime(),
  location: "",
  description: "",
  affected: "",
  witnesses: "",
  repetition: "Einmalig",
  danger: "Nein",
  burden: 3,
  status: "Entwurf",
});

function createProtocolId(existing = []) {
  const year = new Date().getFullYear();
  const count = existing.filter((item) => String(item.id || "").startsWith(`PROT-${year}-`)).length + 1;
  return `PROT-${year}-${String(count).padStart(3, "0")}`;
}

function nowStamp() {
  return new Date().toISOString();
}

function formatDateTime(value) {
  if (!value) {
    return "Noch nicht gespeichert";
  }

  try {
    return new Intl.DateTimeFormat("de-DE", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function formatFileSize(bytes = 0) {
  const size = Number(bytes) || 0;
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }
  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }
  return `${size} B`;
}

function mostCommonValue(values) {
  const counts = values.filter(Boolean).reduce((map, value) => {
    map[value] = (map[value] || 0) + 1;
    return map;
  }, {});
  const [value] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
  return value || "Keine Daten";
}

function normalizeProtocol(item, index = 0) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const createdAt = item.createdAt || item.updatedAt || nowStamp();
  const existingId = String(item.id || "");
  const id = existingId.startsWith("PROT-") || existingId.startsWith("EINTRAG-") ? existingId : `PROT-DEMO-${String(index + 1).padStart(3, "0")}`;
  const type = item.type || item.category || "Sonstiges";
  const status = item.status === "Vorbereitet" ? "In Prüfung vorbereiten" : item.status || "Entwurf";
  const risk = item.risk || "Niedrig";

  return {
    ...emptyProtocol(),
    ...item,
    id,
    type,
    risk,
    status,
    folder: item.folder || folderForProtocol({ ...item, risk, status }),
    createdAt,
    updatedAt: item.updatedAt || createdAt,
    aiSummary: item.aiSummary || "",
    nextStep: item.nextStep || "",
    history: Array.isArray(item.history) && item.history.length
      ? item.history
      : [{ label: "Erstellt", at: createdAt }],
  };
}

function createReportCaseNumber(existing = []) {
  const year = new Date().getFullYear();
  return `MELD-${year}-${String(existing.length + 1).padStart(3, "0")}`;
}

function normalizeReportDraft(item, index = 0) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const createdAt = item.createdAt || item.updatedAt || nowStamp();
  return {
    ...emptyReportDraft(),
    ...item,
    id: item.id || `MELD-DEMO-${String(index + 1).padStart(3, "0")}`,
    caseNumber: item.caseNumber || item.id || `MELD-DEMO-${String(index + 1).padStart(3, "0")}`,
    risk: item.risk || reportRisk(item),
    status: item.status || "Entwurf",
    createdAt,
    updatedAt: item.updatedAt || createdAt,
  };
}

function reportRisk(report) {
  if (report.danger === "Ja, direkte Gefahr") {
    return "Hoch";
  }

  if (report.danger === "Ja, es könnte eskalieren" || Number(report.burden) >= 4) {
    return "Mittel";
  }

  return "Niedrig";
}

function reportRoutingSuggestion(report) {
  const category = String(report.category || "").toLowerCase();

  if (report.danger === "Ja, direkte Gefahr" || category.includes("gewalt") || category.includes("kunde")) {
    return "Gewalt / Bedrohung / Sicherheit";
  }

  if (category.includes("mobbing") || category.includes("beleid") || category.includes("team") || category.includes("ausgrenz")) {
    return "Mobbing / Arbeitsumfeld";
  }

  if (category.includes("diskrimin") || category.includes("hass") || category.includes("sexuelle")) {
    return "Diskriminierung / Hassrede";
  }

  if (category.includes("datenschutz")) {
    return "Datenschutz";
  }

  if (category.includes("it")) {
    return "IT-Sicherheit";
  }

  return "Unklar / erst prüfen lassen";
}

function reportCompleteness(report) {
  return [
    ["Was?", report.category && report.description],
    ["Wo?", report.location],
    ["Wann?", report.date || report.time],
    ["Wie oft?", report.repetition],
    ["Wer betroffen?", report.affected],
  ];
}

function folderForProtocol(protocol) {
  if (protocol.status === "Abgeschlossen") {
    return "Abgeschlossen";
  }

  if (protocol.status === "Beobachten") {
    return "Beobachten";
  }

  if (protocol.status === "In Prüfung vorbereiten" || protocol.status === "Vorbereitet") {
    return "Für Meldung vorbereiten";
  }

  if (protocol.risk === "Hoch") {
    return "Hohe Dringlichkeit";
  }

  if (protocol.status === "Entwurf") {
    return "Entwürfe";
  }

  return "Alle Protokolle";
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function currentTime() {
  return new Date().toTimeString().slice(0, 5);
}

function parseStoredJson(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function App() {
  const [activeView, setActiveView] = useState("overview");
  const [legalView, setLegalView] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewHistory, setViewHistory] = useState([]);
  const [profile, setProfile] = useState(() => ({ ...profileDefaults, ...parseStoredJson(profileStorageKey, {}) }));
  const [protocols, setProtocols] = useState(() => {
    const stored = parseStoredJson(protocolStorageKey, []);
    return Array.isArray(stored) ? stored.map(normalizeProtocol).filter(Boolean) : [];
  });
  const [reportDrafts, setReportDrafts] = useState(() => {
    const stored = parseStoredJson(reportDraftStorageKey, []);
    return Array.isArray(stored) ? stored.map(normalizeReportDraft).filter(Boolean) : [];
  });
  const [resourceSuggestions, setResourceSuggestions] = useState(() => {
    const stored = parseStoredJson(resourceSuggestionsStorageKey, []);
    return Array.isArray(stored) ? stored.filter((item) => item && typeof item === "object") : [];
  });
  const [communityDrafts, setCommunityDrafts] = useState(() => {
    const stored = parseStoredJson(communityDraftStorageKey, []);
    return Array.isArray(stored) ? stored.filter((item) => item && typeof item === "object") : [];
  });
  const [ideas, setIdeas] = useState([]);
  const [newsSuggestions, setNewsSuggestions] = useState([]);
  const [latestProtocolId, setLatestProtocolId] = useState(null);
  const [reportDraft, setReportDraft] = useState(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [dirtyState, setDirtyState] = useState({
    meldung: false,
    protokoll: false,
    profil: false,
  });
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const toastTimerRef = useRef(null);
  const safeActiveView = views.some((view) => view.id === activeView) ? activeView : "overview";
  const currentView = views.find((view) => view.id === safeActiveView) ?? views[0];
  const currentHeaderLabel = legalView ? legalViews[legalView]?.title ?? currentView.label : currentView.label;
  const protocolMetrics = {
    saved: protocols.filter((item) => item.status !== "Gelöscht").length,
    urgent: protocols.filter((item) => item.risk === "Hoch").length,
    prepared: protocols.filter((item) => item.status === "In Prüfung vorbereiten" || item.status === "Vorbereitet").length,
    drafts: protocols.filter((item) => item.status === "Entwurf").length,
    mostCommonCategory: mostCommonValue(protocols.map((item) => item.type)),
  };
  const reportMetrics = {
    anonymous: reportDrafts.filter((item) => item.mode === "anonym").length,
    personal: reportDrafts.filter((item) => item.mode === "persönlich").length,
    noMode: reportDrafts.filter((item) => item.mode === "entwurf").length,
    completeFiveW: reportDrafts.filter((item) => reportCompleteness(item).filter(([, filled]) => Boolean(filled)).length === 5).length,
    urgent: reportDrafts.filter((item) => item.risk === "Hoch").length,
  };
  const resourceMetrics = {
    available: demoResources.length,
    recommended: 3,
    topics: new Set(demoResources.map((item) => item.topic)).size,
    suggestions: resourceSuggestions.length,
  };

  useEffect(() => {
    window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    try {
      window.localStorage.setItem(protocolStorageKey, JSON.stringify(protocols));
    } catch {
      const metadataOnly = protocols.map((entry) => ({
        ...entry,
        attachments: Array.isArray(entry.attachments)
          ? entry.attachments.map(({ previewData, sessionUrl, ...file }) => ({ ...file, status: "nur Metadaten gespeichert" }))
          : [],
      }));
      try {
        window.localStorage.setItem(protocolStorageKey, JSON.stringify(metadataOnly));
      } catch {
        // Lokale Demo-Speicherung kann bei großen Dateien an Browsergrenzen stoßen.
      }
    }
  }, [protocols]);

  useEffect(() => {
    window.localStorage.setItem(reportDraftStorageKey, JSON.stringify(reportDrafts));
  }, [reportDrafts]);

  useEffect(() => {
    window.localStorage.setItem(resourceSuggestionsStorageKey, JSON.stringify(resourceSuggestions));
  }, [resourceSuggestions]);

  useEffect(() => {
    window.localStorage.setItem(communityDraftStorageKey, JSON.stringify(communityDrafts));
  }, [communityDrafts]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [safeActiveView, legalView]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function showToast(message) {
    setToast(message);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  function navigateMain(viewId) {
    if (viewId === safeActiveView && !legalView) {
      return;
    }

    if (!legalView && dirtyState[safeActiveView]) {
      setConfirmDialog({
        title: "Ungespeicherte Demo-Eingaben",
        message: "Du hast nicht gespeicherte Demo-Eingaben.",
        confirmLabel: "Trotzdem wechseln",
        cancelLabel: "Abbrechen",
        onConfirm: () => {
          clearDirty(safeActiveView);
          setViewHistory((stack) => {
            const nextHistory = safeActiveView === viewId ? stack : [...stack, safeActiveView].slice(-8);
            setActiveView(viewId);
            setLegalView(null);
            setMenuOpen(false);
            if (viewId !== "meldung") {
              setReportDraft(null);
            }
            return nextHistory;
          });
        },
      });
      return;
    }

    setViewHistory((stack) => {
      const nextHistory = safeActiveView === viewId ? stack : [...stack, safeActiveView].slice(-8);
      setActiveView(viewId);
      setLegalView(null);
      setMenuOpen(false);
      if (viewId !== "meldung") {
        setReportDraft(null);
      }
      return nextHistory;
    });
  }

  function openLegal(viewId) {
    if (dirtyState[safeActiveView]) {
      setConfirmDialog({
        title: "Ungespeicherte Demo-Eingaben",
        message: "Du hast nicht gespeicherte Demo-Eingaben.",
        confirmLabel: "Trotzdem öffnen",
        cancelLabel: "Abbrechen",
        onConfirm: () => {
          clearDirty(safeActiveView);
          setLegalView(viewId);
          setMenuOpen(false);
        },
      });
      return;
    }

    setLegalView(viewId);
    setMenuOpen(false);
  }

  function closeLegal() {
    setLegalView(null);
  }

  function goHome() {
    navigateMain("overview");
  }

  function goBack() {
    if (legalView) {
      closeLegal();
      return;
    }

    if (dirtyState[safeActiveView]) {
      setConfirmDialog({
        title: "Ungespeicherte Demo-Eingaben",
        message: "Du hast nicht gespeicherte Demo-Eingaben.",
        confirmLabel: "Trotzdem zurück",
        cancelLabel: "Abbrechen",
        onConfirm: () => {
          clearDirty(safeActiveView);
          setViewHistory((stack) => {
            const previous = stack[stack.length - 1];
            if (!previous) {
              setActiveView("overview");
              return [];
            }

            setActiveView(previous);
            if (previous !== "meldung") {
              setReportDraft(null);
            }
            return stack.slice(0, -1);
          });
          setMenuOpen(false);
        },
      });
      return;
    }

    setConfirmDialog(null);
    setViewHistory((stack) => {
      const previous = stack[stack.length - 1];
      if (!previous) {
        setActiveView("overview");
        return [];
      }

      setActiveView(previous);
      if (previous !== "meldung") {
        setReportDraft(null);
      }
      return stack.slice(0, -1);
    });
    setMenuOpen(false);
  }

  function requestConfirmation({ title, message, confirmLabel = "Weiter", cancelLabel = "Abbrechen", onConfirm }) {
    setConfirmDialog({ title, message, confirmLabel, cancelLabel, onConfirm });
  }

  function clearDirty(viewId) {
    setDirtyState((current) => ({ ...current, [viewId]: false }));
  }

  function markDirty(viewId, value = true) {
    setDirtyState((current) => ({ ...current, [viewId]: value }));
  }

  function protocolRiskLabel(protocol) {
    if (protocol.danger === "Ja" || protocol.danger === "Ja, direkte Gefahr") {
      return "Hoch";
    }

    if (protocol.danger === "Ja, es könnte eskalieren" || protocol.burden >= 4) {
      return "Mittel";
    }

    return "Niedrig";
  }

  function saveProtocol(protocol) {
    const timestamp = nowStamp();
    const risk = protocolRiskLabel(protocol);
    const id = protocol.id || createProtocolId(protocols);
    const savedProtocol = normalizeProtocol({
      ...protocol,
      id,
      risk,
      folder: protocol.folder || folderForProtocol({ ...protocol, risk }),
      createdAt: protocol.createdAt || timestamp,
      updatedAt: timestamp,
      history: [
        ...(Array.isArray(protocol.history) ? protocol.history : []),
        { label: protocol.id ? "Protokoll bearbeitet" : "Erstellt", at: timestamp },
      ],
    });

    setProtocols((items) => {
      return [savedProtocol, ...items.filter((item) => item.id !== id)];
    });
    setLatestProtocolId(savedProtocol?.id);
    setReportDraft({
      caseNumber: savedProtocol?.id || `DBPA-${String(Date.now()).slice(-6)}`,
      category: protocol.type,
      risk: protocolRiskLabel(protocol),
      shortSummary: protocol.description.slice(0, 120) || "Kurzfassung aus dem Protokoll.",
      nextStep:
        protocol.danger === "Ja, direkte Gefahr"
          ? "Sofort reale Hilfe kontaktieren."
          : "Für menschliche Prüfung vorbereiten.",
      details: protocol,
    });
    return savedProtocol?.id;
  }

  function prepareProtocol(protocol) {
    const timestamp = nowStamp();
    const risk = protocolRiskLabel(protocol);
    const id = protocol.id || createProtocolId(protocols);
    const savedProtocol = normalizeProtocol({
      ...protocol,
      id,
      risk,
      status: "In Prüfung vorbereiten",
      folder: "Für Meldung vorbereiten",
      createdAt: protocol.createdAt || timestamp,
      updatedAt: timestamp,
      history: [
        ...(Array.isArray(protocol.history) ? protocol.history : []),
        { label: "Meldungsvorschau erstellt", at: timestamp },
      ],
    });

    setProtocols((items) => {
      return [savedProtocol, ...items.filter((item) => item.id !== id)];
    });
    setLatestProtocolId(savedProtocol?.id);
    setReportDraft({
      caseNumber: savedProtocol?.id || `DBPA-${String(Date.now()).slice(-6)}`,
      category: protocol.type,
      risk: protocolRiskLabel(protocol),
      shortSummary: protocol.description.slice(0, 120) || "Kurzfassung aus dem Protokoll.",
      nextStep:
        protocol.danger === "Ja, direkte Gefahr"
          ? "Sofort reale Hilfe kontaktieren."
          : "Für menschliche Prüfung vorbereiten.",
      details: protocol,
    });
    return savedProtocol?.id;
  }

  function deleteProtocol(protocolId) {
    setProtocols((items) => items.filter((item) => item.id !== protocolId));
  }

  function duplicateProtocol(protocolId) {
    const source = protocols.find((item) => item.id === protocolId);
    if (!source) {
      return null;
    }

    const timestamp = nowStamp();
    const duplicateId = createProtocolId(protocols);
    const duplicate = normalizeProtocol({
      ...source,
      id: duplicateId,
      status: "Entwurf",
      folder: "Entwürfe",
      createdAt: timestamp,
      updatedAt: timestamp,
      history: [{ label: "Dupliziert", at: timestamp }],
    });

    setProtocols((items) => {
      return [duplicate, ...items];
    });
    setLatestProtocolId(duplicateId);
    return duplicateId;
  }

  function createExampleDemoData() {
    const exampleProtocol = {
      ...emptyProtocol(),
      date: todayIso(),
      time: "09:30",
      location: "Werkstatt",
      type: "Mobbing",
      description: "Ein Azubi wird seit mehreren Wochen vor anderen ausgelacht und abwertend angesprochen.",
      repetition: "Mehrfach",
      burden: 4,
      danger: "Nein",
      status: "Entwurf",
      aiSummary: "Wiederholtes Auslachen und abwertende Sprüche im Werkstattkontext.",
    };
    const protocolId = saveProtocol(exampleProtocol);
    const reportId = createReportCaseNumber(reportDrafts);
    const report = normalizeReportDraft({
      ...emptyReportDraft(),
      id: reportId,
      caseNumber: reportId,
      mode: "entwurf",
      category: "Mobbing",
      date: todayIso(),
      time: "09:30",
      location: "Werkstatt",
      repetition: "Mehrfach",
      affected: "Azubi, anonymes Demo-Beispiel",
      description: "Wiederholtes Auslachen und abwertende Sprüche vor anderen in der Werkstatt.",
      danger: "Nein",
      risk: "Mittel",
      nextStep: "Mit Vertrauensperson prüfen und bei Bedarf Meldung vorbereiten.",
      updatedAt: nowStamp(),
    });
    setReportDrafts((items) => [report, ...items.filter((item) => item.id !== reportId)]);
    setReportDraft({
      caseNumber: protocolId || reportId,
      category: "Mobbing",
      risk: "Mittel",
      shortSummary: exampleProtocol.description,
      nextStep: "Mit Vertrauensperson prüfen und bei Bedarf Meldung vorbereiten.",
      details: exampleProtocol,
    });
    showToast("Beispiel-Daten lokal erstellt");
  }

  return (
    <div className="min-h-screen bg-db-soft text-db-dark">
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
          <div key={`${safeActiveView}-${legalView ?? "main"}`} className="motion-view-shell mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            {legalView || safeActiveView === "overview" ? null : (
              <ViewChrome
                title={currentView.label}
                canGoBack={safeActiveView !== "overview"}
                onBack={goBack}
                onHome={goHome}
                onTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                isDirty={dirtyState[safeActiveView]}
              />
            )}
            {legalView ? (
              <LegalView page={legalView} onBack={closeLegal} onHome={goHome} />
            ) : (
              <>
                {safeActiveView === "overview" && (
                  <SimpleStartView
                    onNavigate={navigateMain}
                    demoOpen={demoOpen}
                    setDemoOpen={setDemoOpen}
                    onCreateExampleData={createExampleDemoData}
                  />
                )}
                {safeActiveView === "kiHilfe" && <SimpleSoforthilfeView onNavigate={navigateMain} onNotify={showToast} />}
                {safeActiveView === "meldung" && (
                  <SimpleMeldenView
                    protocols={protocols}
                    reportDraft={reportDraft}
                    reportDrafts={reportDrafts}
                    setReportDrafts={setReportDrafts}
                    onNavigate={navigateMain}
                    onRequestConfirm={requestConfirmation}
                    onNotify={showToast}
                    onDirtyChange={(value) => markDirty("meldung", value)}
                    onResetDirty={() => clearDirty("meldung")}
                    onUseAsReport={(draft) => {
                      setReportDraft(draft);
                      showToast("Meldungsvorschau erstellt");
                    }}
                  />
                )}
                {safeActiveView === "protokoll" && (
                  <SimpleVorfallView
                    onNavigate={navigateMain}
                    onSaveProtocol={saveProtocol}
                    onDeleteProtocol={deleteProtocol}
                    onUseAsReport={(protocol) => {
                      saveProtocol(protocol);
                      clearDirty("protokoll");
                      setViewHistory((stack) => [...stack, "protokoll"].slice(-8));
                      setActiveView("meldung");
                      setLegalView(null);
                      setMenuOpen(false);
                    }}
                    protocols={protocols}
                    latestProtocolId={latestProtocolId}
                    onRequestConfirm={requestConfirmation}
                    onNotify={showToast}
                    onDirtyChange={(value) => markDirty("protokoll", value)}
                    onResetDirty={() => clearDirty("protokoll")}
                  />
                )}
                {safeActiveView === "training" && <SimpleTrainingLearningView onNotify={showToast} />}
                {safeActiveView === "ideen" && <IdeenView ideas={ideas} setIdeas={setIdeas} onNotify={showToast} />}
                {safeActiveView === "news" && <AzubiNewsView suggestions={newsSuggestions} setSuggestions={setNewsSuggestions} onNavigate={navigateMain} onNotify={showToast} />}
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
      <FloatingAzubiBegleiter onNavigate={navigateMain} onNotify={showToast} />
      {toast && <Toast message={toast} />}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          cancelLabel={confirmDialog.cancelLabel}
          onCancel={() => setConfirmDialog(null)}
          onConfirm={() => {
            const handler = confirmDialog.onConfirm;
            setConfirmDialog(null);
            handler?.();
          }}
        />
      )}
    </div>
  );
}

function Sidebar({ activeView, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-db-dark/10 p-5">
        <BrandMark />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {views.map((view) => (
          <NavButton
            key={view.id}
            active={activeView === view.id}
            label={view.label}
            icon={view.icon}
            onClick={() => onNavigate(view.id)}
          />
        ))}
      </nav>
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
              icon={view.icon}
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
            <p className="text-xs font-bold text-db-rail">Keine echte Übermittlung</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandMark({ compact = false, subtitle = "Innovationsprototyp" }) {
  return (
    <div className={`flex items-center ${compact ? "gap-3" : "gap-4"}`}>
      <div
        className={`flex shrink-0 items-center justify-center rounded-md bg-db-red font-black italic tracking-tight text-white shadow-sm ${
          compact ? "h-11 w-11 text-lg" : "h-14 w-14 text-2xl"
        }`}
        aria-label="Deutsche Bahn"
      >
        DB
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-black text-db-dark">DB Peace AI</p>
        <p className="truncate text-xs font-bold text-db-rail">{subtitle}</p>
      </div>
    </div>
  );
}

function MobileBottomNav({ activeView, onNavigate }) {
  const mobileIds = ["overview", "kiHilfe", "protokoll", "meldung", "training", "ideen", "news"];
  const items = views.filter((view) => mobileIds.includes(view.id));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-7 gap-0.5 border-t border-db-dark/10 bg-white/95 px-1 py-2 shadow-panel backdrop-blur-xl lg:hidden">
      {items.map((view) => {
        const Icon = view.icon;
        const active = activeView === view.id;
        return (
          <button
            key={view.id}
            type="button"
            onClick={() => onNavigate(view.id)}
            aria-label={view.label}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-1 rounded-lg px-0.5 py-1.5 text-center text-[9px] font-black leading-[1.1] transition ${
              active ? "bg-red-50 text-db-red" : "text-db-rail hover:text-db-dark"
            }`}
          >
            {Icon && <Icon size={19} aria-hidden="true" />}
            <span>{view.label}</span>
          </button>
        );
      })}
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
                Keine echte Datenverarbeitung · KI unterstützt, Menschen entscheiden
            </p>
          </div>
        </div>

          <div className="flex flex-wrap gap-2">
            <FooterButton label="Impressum" onClick={() => onOpenLegal("impressum")} />
            <FooterButton label="Datenschutz" onClick={() => onOpenLegal("datenschutzLegal")} />
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

function LegalView({ page, onBack, onHome }) {
  if (page === "impressum") {
    return (
      <ViewFrame>
        <section className="space-y-6 p-5 lg:p-6">
          <LegalHeader title={legalViews.impressum.title} subtitle={legalViews.impressum.subtitle} onBack={onBack} onHome={onHome} />
          <p className="rounded-xl border border-db-dark/10 bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
            Lokaler Innovationsprototyp – entwickelt als Beitrag zum Wettbewerb „Bahn-Azubis gegen Hass und Gewalt" von Deutsche Bahn und EVG.
            Kein offizielles Angebot der Deutschen Bahn AG.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <LegalField title="Verantwortlich für diesen Prototyp" value="Mohammad Reza Rahimi" />
            <LegalField title="Rolle" value="Auszubildender, Deutsche Bahn" />
            <LegalField title="Kontakt" value="[E-Mail / Telefon vor Einreichung ergänzen]" />
            <LegalField title="Projektstatus" value="Demo – nicht offiziell eingeführtes System" />
          </div>
          <div className="rounded-xl border border-db-dark/10 bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-db-red">Unternehmensbezug (Referenzangaben Konzern)</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <LegalField title="Unternehmen" value="Deutsche Bahn AG" />
              <LegalField title="Anschrift" value="Potsdamer Platz 2, 10785 Berlin" />
              <LegalField title="Telefon" value="+49 30 297-0" />
              <LegalField title="Registergericht" value="Amtsgericht Berlin-Charlottenburg, HRB 50000" />
              <LegalField title="USt-IdNr." value="DE 811569869" />
              <LegalField title="Offizielles Impressum" value="deutschebahn.com/de/impressum" />
            </div>
            <p className="mt-3 text-[11px] font-semibold leading-5 text-db-rail">
              Diese Konzernangaben dienen nur als Referenz zum Projektkontext. Betreiberin dieses Prototyps ist nicht die Deutsche Bahn AG.
            </p>
          </div>
          <SectionCard title="Rechtlicher Prüfhinweis" text="Vor einer echten Veröffentlichung Anbieterangaben nach § 5 DDG ergänzen und rechtlich prüfen lassen." />
        </section>
      </ViewFrame>
    );
  }

  if (page === "nutzung") {
    return (
      <ViewFrame>
        <section className="space-y-6 p-5 lg:p-6">
          <LegalHeader title={legalViews.nutzung.title} subtitle={legalViews.nutzung.subtitle} onBack={onBack} onHome={onHome} />
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
          <LegalHeader title={legalViews.barrierefreiheit.title} subtitle={legalViews.barrierefreiheit.subtitle} onBack={onBack} onHome={onHome} />
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
          <LegalHeader title={legalViews.status.title} subtitle={legalViews.status.subtitle} onBack={onBack} onHome={onHome} />
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
          <SectionCard
            title="Echten KI-Modus aktivieren"
            text=".env aus .env.example erstellen, OPENAI_API_KEY eintragen, optional OPENAI_MODEL setzen, npm install ausführen und mit npm run dev starten. Ohne API-Key nutzt der Chat lokale Demo-Antworten."
          />
        </section>
      </ViewFrame>
    );
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <LegalHeader title={legalViews.datenschutzLegal.title} subtitle={legalViews.datenschutzLegal.subtitle} onBack={onBack} onHome={onHome} />
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

function LegalHeader({ title, subtitle, onBack, onHome }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-db-dark p-5 text-white shadow-panel md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-red-200">{subtitle}</p>
        <h2 className="mt-2 text-3xl font-black">{title}</h2>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/60">DB Peace AI / {title}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onBack} className="rounded bg-white px-4 py-3 text-sm font-black text-db-dark">
          Zurück
        </button>
        <button type="button" onClick={onHome} className="rounded bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-white/20">
          Zur Übersicht
        </button>
      </div>
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

function NavButton({ active, label, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-black transition ${
        active ? "bg-red-50 text-db-red ring-1 ring-db-red/15" : "text-db-rail hover:bg-db-soft hover:text-db-dark"
      }`}
    >
      {Icon && <Icon size={18} className="shrink-0" aria-hidden="true" />}
      <span>{label}</span>
    </button>
  );
}

function ViewFrame({ children }) {
  return <div className="overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-sm">{children}</div>;
}

function ViewChrome({ title, canGoBack, onBack, onHome, isDirty }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-black text-db-rail ring-1 ring-db-dark/10 transition hover:bg-red-50 hover:text-db-red"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Zurück
        </button>
      )}
      <button
        type="button"
        onClick={onHome}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-black text-db-rail ring-1 ring-db-dark/10 transition hover:bg-red-50 hover:text-db-red"
      >
        <Home size={16} aria-hidden="true" /> Übersicht
      </button>
      {isDirty && (
        <span className="ml-auto inline-flex items-center rounded-lg bg-amber-50 px-3 py-2 text-xs font-black text-amber-800 ring-1 ring-amber-200">
          Nicht gespeichert
        </span>
      )}
    </div>
  );
}

function IdeenView({ ideas, setIdeas, onNotify }) {
  const categories = ["Ausbildung", "Sicherheit", "Nachhaltigkeit", "Digitalisierung", "Werkstatt", "Kundenkontakt", "Zusammenarbeit", "Kosten sparen", "Respekt & Miteinander"];
  const examples = [
    { title: "Digitaler Azubi-Hilfe-QR", category: "Ausbildung", text: "Ein QR-Code führt Azubis direkt zu Hilfe, Lernmaterial, Kontakten und Meldefunktionen.", status: "Suche Mitstreiter:innen" },
    { title: "Werkstatt-Checkliste digital", category: "Sicherheit", text: "Wiederkehrende Aufgaben werden mit einfachen digitalen Checklisten klarer und sicherer.", status: "Idee" },
    { title: "Deeskalations-Mini-Training", category: "Respekt & Miteinander", text: "Kurze Übungen helfen Azubis im Umgang mit Konflikten, Kund:innen oder schwierigen Situationen.", status: "Prototyp" },
    { title: "Azubi-Lernbörse", category: "Lernen", text: "Azubis können Lernpartner:innen für Prüfungen, Berufsschule oder Praxis finden.", status: "Suche Team" },
    { title: "Material besser nutzen", category: "Nachhaltigkeit", text: "Übrig gebliebenes Material wird sichtbar gemacht, damit weniger neu bestellt werden muss.", status: "Idee" },
  ];
  const emptyIdea = { title: "", category: "Ausbildung", problem: "", solution: "", team: "", status: "Idee" };
  const [tab, setTab] = useState("list");
  const [draft, setDraft] = useState(emptyIdea);
  const allIdeas = [...ideas, ...examples];

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function saveIdea() {
    if (!draft.title.trim()) {
      onNotify?.("Bitte gib einen Titel ein.");
      return;
    }
    setIdeas((items) => [{ ...draft, id: `IDEE-${Date.now()}`, text: draft.solution || draft.problem || "Lokale Demo-Idee" }, ...items]);
    setDraft(emptyIdea);
    setTab("list");
    onNotify?.("Idee lokal vorgemerkt.");
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <ViewHero icon={Lightbulb} title="Ideen" subtitle="Projektideen sammeln, Mitstreiter:innen finden und Verbesserungen als Demo vormerken." note="Demo: Ideen werden nicht echt veröffentlicht oder übermittelt." />

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setTab("list")} className={`rounded-lg px-4 py-3 text-sm font-black ring-1 ${tab === "list" ? "bg-db-red text-white ring-db-red" : "bg-white text-db-dark ring-db-dark/10 hover:bg-red-50 hover:text-db-red"}`}>Ideen ansehen</button>
          <button type="button" onClick={() => setTab("new")} className={`rounded-lg px-4 py-3 text-sm font-black ring-1 ${tab === "new" ? "bg-db-red text-white ring-db-red" : "bg-white text-db-dark ring-db-dark/10 hover:bg-red-50 hover:text-db-red"}`}>Idee erstellen</button>
        </div>

        {tab === "list" && (
          <div className="grid gap-4 md:grid-cols-2">
            {allIdeas.map((idea) => (
              <article key={idea.id || idea.title} className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  <SmallTag>{idea.category}</SmallTag>
                  <InfoTag>{idea.status}</InfoTag>
                  <InfoTag>Gesucht: Mitstreiter:innen</InfoTag>
                </div>
                <h2 className="mt-4 text-xl font-black text-db-dark">{idea.title}</h2>
                <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">{idea.text || idea.solution}</p>
                <button type="button" onClick={() => onNotify?.("Interesse lokal vorgemerkt.")} className="mt-4 rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Interesse vormerken</button>
              </article>
            ))}
          </div>
        )}

        {tab === "new" && (
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <ReportInput label="Titel der Idee" value={draft.title} onChange={(value) => update("title", value)} />
              <label><FieldLabel>Kategorie</FieldLabel><select className="field" value={draft.category} onChange={(event) => update("category", event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="md:col-span-2"><FieldLabel>Welches Problem löst die Idee?</FieldLabel><textarea className="field min-h-24 resize-y py-3" value={draft.problem} onChange={(event) => update("problem", event.target.value)} /></label>
              <label className="md:col-span-2"><FieldLabel>Kurze Lösung</FieldLabel><textarea className="field min-h-24 resize-y py-3" value={draft.solution} onChange={(event) => update("solution", event.target.value)} /></label>
              <ReportInput label="Wer könnte mitmachen?" value={draft.team} onChange={(value) => update("team", value)} />
              <label><FieldLabel>Status</FieldLabel><select className="field" value={draft.status} onChange={(event) => update("status", event.target.value)}>{["Idee", "Suche Team", "In Planung", "Prototyp"].map((item) => <option key={item}>{item}</option>)}</select></label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={saveIdea} className="rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Idee lokal vormerken</button>
              <button type="button" onClick={() => setDraft(emptyIdea)} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Formular leeren</button>
            </div>
          </div>
        )}

        <p className="rounded-xl bg-white p-4 text-sm font-semibold leading-7 text-db-rail shadow-sm">Für echte interne Nutzung wären Zuständigkeit, Moderation und Freigabe nötig.</p>
      </section>
    </ViewFrame>
  );
}

function AzubiNewsView({ suggestions, setSuggestions, onNavigate, onNotify }) {
  const categories = ["Alle", "Ausbildung", "Respekt", "Mobbing", "Diskriminierung", "Gewaltprävention", "Lernen"];
  const articles = [
    { title: "Warum frühes Ansprechen Konflikte kleiner halten kann", category: "Respekt", date: "14.05.2026", preview: "Viele Konflikte werden größer, weil niemand früh reagiert. Ein sachliches Gespräch oder eine Notiz kann helfen, den nächsten Schritt klarer zu machen." },
    { title: "Mobbing erkennen: Wann aus Spaß ein Problem wird", category: "Mobbing", date: "14.05.2026", preview: "Wenn Sprüche wiederholt verletzen, vor anderen bloßstellen oder ausgrenzen, sollte man das ernst nehmen und dokumentieren." },
    { title: "Deeskalation im Kundenkontakt: ruhig bleiben, Abstand halten", category: "Gewaltprävention", date: "14.05.2026", preview: "Bei aggressivem Verhalten ist Sicherheit wichtiger als Diskussion. Abstand halten, Unterstützung holen und später sachlich festhalten." },
    { title: "Diskriminierung nicht normalisieren", category: "Diskriminierung", date: "14.05.2026", preview: "Abwertende Aussagen über Herkunft, Religion, Geschlecht oder Aussehen sollten nicht klein geredet werden. Kontext und Wortlaut können wichtig sein." },
    { title: "Ausbildung: Hilfe früh suchen ist kein Zeichen von Schwäche", category: "Ausbildung", date: "14.05.2026", preview: "Wer früh sagt, dass etwas zu viel wird, kann oft verhindern, dass Stress oder Konflikte größer werden." },
    { title: "Lernen unter Druck: kleine Pläne statt Panik", category: "Lernen", date: "14.05.2026", preview: "Prüfungsstress wird leichter, wenn Aufgaben kleiner werden: Thema wählen, 25 Minuten lernen, kurze Pause, nächste Einheit." },
  ];
  const [filter, setFilter] = useState("Alle");
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({ topic: "", category: "Ausbildung", why: "", proposal: "" });
  const filtered = filter === "Alle" ? articles : articles.filter((item) => item.category === filter);

  function saveSuggestion() {
    if (!draft.topic.trim()) {
      onNotify?.("Bitte gib ein Thema ein.");
      return;
    }
    setSuggestions((items) => [{ ...draft, id: `NEWS-${Date.now()}` }, ...items]);
    setDraft({ topic: "", category: "Ausbildung", why: "", proposal: "" });
    onNotify?.("Beitrag lokal vorgemerkt.");
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <ViewHero icon={Newspaper} title="Azubi-News" subtitle="Kurze Demo-Beiträge rund um Ausbildung, Respekt, Prävention und ein sicheres Miteinander." note="Demo-Zeitung: keine echten DB-News, keine offizielle Veröffentlichung." />

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => setFilter(category)} className={`rounded-lg px-3 py-2 text-xs font-black ring-1 ${filter === category ? "bg-db-red text-white ring-db-red" : "bg-white text-db-dark ring-db-dark/10 hover:bg-red-50 hover:text-db-red"}`}>{category}</button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <article key={article.title} className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap gap-2"><SmallTag>{article.category}</SmallTag><InfoTag>{article.date}</InfoTag></div>
              <h2 className="mt-4 text-xl font-black text-db-dark">{article.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">{article.preview}</p>
              <button type="button" onClick={() => setSelected(article)} className="mt-4 rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Lesen</button>
            </article>
          ))}
        </div>

        {selected && (
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-panel">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SmallTag>{selected.category}</SmallTag>
                <h2 className="mt-4 text-2xl font-black text-db-dark">{selected.title}</h2>
                <p className="mt-2 text-sm font-semibold text-db-rail">{selected.date}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg bg-db-soft px-3 py-2 text-sm font-black text-db-dark ring-1 ring-db-dark/10">Schließen</button>
            </div>
            <div className="mt-4 grid gap-3 text-sm font-semibold leading-7 text-db-rail">
              <p>{selected.preview}</p>
              <p>Wichtig ist, Situationen früh ernst zu nehmen und nicht alles allein auszuhalten.</p>
              <p>Eine kurze Notiz kann helfen, später sachlich über den nächsten Schritt zu sprechen.</p>
              <p>Bei Gefahr oder starker Belastung bitte echte Hilfe holen.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => onNavigate("kiHilfe")} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Hilfe öffnen</button>
              <button type="button" onClick={() => onNavigate("protokoll")} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Vorfall festhalten</button>
              <button type="button" onClick={() => onNavigate("training")} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Training & Lernen</button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-db-dark">Beitrag vorschlagen</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ReportInput label="Thema" value={draft.topic} onChange={(value) => setDraft((current) => ({ ...current, topic: value }))} />
            <label><FieldLabel>Kategorie</FieldLabel><select className="field" value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}>{categories.filter((item) => item !== "Alle").map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="md:col-span-2"><FieldLabel>Warum ist das wichtig?</FieldLabel><textarea className="field min-h-20 resize-y py-3" value={draft.why} onChange={(event) => setDraft((current) => ({ ...current, why: event.target.value }))} /></label>
            <label className="md:col-span-2"><FieldLabel>Kurzer Vorschlag</FieldLabel><textarea className="field min-h-20 resize-y py-3" value={draft.proposal} onChange={(event) => setDraft((current) => ({ ...current, proposal: event.target.value }))} /></label>
          </div>
          <button type="button" onClick={saveSuggestion} className="mt-5 rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Beitrag lokal vormerken</button>
          {suggestions.length > 0 && <p className="mt-3 text-sm font-semibold text-db-rail">{suggestions.length} Beitrag/Beiträge lokal vorgemerkt.</p>}
        </div>
      </section>
    </ViewFrame>
  );
}

function FloatingIdeenBubble({ onNotify }) {
  const categories = ["Ausbildung", "Sicherheit", "Nachhaltigkeit", "Digitalisierung", "Werkstatt", "Kundenkontakt", "Zusammenarbeit", "Kosten sparen", "Respekt & Miteinander"];
  const examples = [
    ["Digitaler Azubi-Hilfe-QR", "Ausbildung", "Ein QR-Code führt Azubis direkt zu Hilfe, Lernmaterial, Kontakten und Meldefunktionen."],
    ["Werkstatt-Checkliste digital", "Werkstatt", "Wiederkehrende Aufgaben werden mit einfachen digitalen Checklisten sicherer und klarer."],
    ["Deeskalations-Mini-Training", "Kundenkontakt", "Kurze Übungen helfen Azubis im Umgang mit Konflikten, Kund:innen oder schwierigen Situationen."],
    ["Azubi-Lernbörse", "Ausbildung", "Azubis können Lernpartner:innen für Prüfungen, Berufsschule oder Praxis finden."],
    ["Material besser nutzen", "Kosten sparen", "Übrig gebliebenes Material wird sichtbar gemacht, damit weniger neu bestellt werden muss."],
  ];
  const emptyIdea = {
    title: "",
    category: "Ausbildung",
    problem: "",
    solution: "",
    team: "",
    status: "Idee",
  };
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Ausbildung");
  const [idea, setIdea] = useState(emptyIdea);
  const [savedIdeas, setSavedIdeas] = useState([]);

  function update(field, value) {
    setIdea((current) => ({ ...current, [field]: value }));
  }

  function saveIdea() {
    if (!idea.title.trim()) {
      onNotify?.("Bitte gib einen kurzen Titel ein.");
      return;
    }
    setSavedIdeas((items) => [{ ...idea, id: `IDEE-${Date.now()}` }, ...items]);
    setIdea(emptyIdea);
    onNotify?.("Idee lokal vorgemerkt.");
  }

  return (
    <div className="fixed left-4 bottom-24 z-[54] sm:left-6 lg:bottom-6">
      {open && (
        <section className="mb-4 max-h-[min(620px,calc(100vh-8rem))] w-[calc(100vw-2rem)] max-w-[430px] overflow-y-auto rounded-2xl border border-db-dark/10 bg-white shadow-panel">
          <div className="flex items-start justify-between gap-3 border-b border-db-dark/10 bg-db-dark p-4 text-white">
            <div>
              <h2 className="text-lg font-black">Ideen-Bubble</h2>
              <p className="mt-1 text-xs font-semibold leading-5 text-white/75">Teile Projektideen und finde Mitstreiter:innen – als lokale Demo.</p>
              <p className="mt-2 text-[11px] font-black text-white/65">Demo: Ideen werden nicht echt veröffentlicht oder übermittelt.</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Ideen-Bubble schließen" className="rounded bg-white/10 px-3 py-2 text-sm font-black text-white hover:bg-white/20">
              x
            </button>
          </div>

          <div className="space-y-5 p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    update("category", category);
                  }}
                  className={`rounded-full px-3 py-2 text-xs font-black ring-1 ${activeCategory === category ? "bg-red-50 text-db-red ring-red-100" : "bg-db-soft text-db-dark ring-db-dark/10 hover:bg-red-50 hover:text-db-red"}`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-3">
              {examples.map(([title, category, text]) => (
                <article key={title} className="rounded-xl bg-db-soft p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-white px-2 py-1 text-[11px] font-black text-db-rail">{category}</span>
                    <span className="rounded bg-white px-2 py-1 text-[11px] font-black text-db-rail">Demo-Idee</span>
                    <span className="rounded bg-white px-2 py-1 text-[11px] font-black text-db-rail">Mitstreiter:innen gesucht</span>
                  </div>
                  <p className="mt-3 font-black text-db-dark">{title}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{text}</p>
                  <button type="button" onClick={() => onNotify?.("Interesse lokal vorgemerkt.")} className="mt-3 rounded bg-white px-3 py-2 text-xs font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                    Interesse vormerken
                  </button>
                </article>
              ))}
            </div>

            <div className="rounded-xl border border-db-dark/10 p-4">
              <p className="text-lg font-black text-db-dark">Neue Idee vormerken</p>
              <div className="mt-3 grid gap-3">
                <input className="field" value={idea.title} onChange={(event) => update("title", event.target.value)} placeholder="Titel der Idee" />
                <select className="field" value={idea.category} onChange={(event) => update("category", event.target.value)}>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
                <textarea className="field min-h-20 resize-y py-3" value={idea.problem} onChange={(event) => update("problem", event.target.value)} placeholder="Welches Problem löst die Idee?" />
                <textarea className="field min-h-20 resize-y py-3" value={idea.solution} onChange={(event) => update("solution", event.target.value)} placeholder="Kurze Lösung" />
                <input className="field" value={idea.team} onChange={(event) => update("team", event.target.value)} placeholder="Wer könnte mitmachen?" />
                <select className="field" value={idea.status} onChange={(event) => update("status", event.target.value)}>
                  {["Idee", "Suche Team", "In Planung", "Prototyp"].map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={saveIdea} className="rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">
                  Idee lokal vormerken
                </button>
                <button type="button" onClick={() => setIdea(emptyIdea)} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                  Formular leeren
                </button>
              </div>
            </div>

            {savedIdeas.length > 0 && (
              <div className="rounded-xl bg-db-soft p-4">
                <p className="font-black text-db-dark">Lokal vorgemerkt</p>
                <div className="mt-3 grid gap-2">
                  {savedIdeas.slice(0, 3).map((item) => (
                    <p key={item.id} className="rounded bg-white p-3 text-sm font-semibold text-db-rail">{item.title} · {item.category} · {item.status}</p>
                  ))}
                </div>
              </div>
            )}

            <p className="rounded-xl bg-db-soft p-3 text-xs font-semibold leading-5 text-db-rail">
              Diese Ideen-Bubble ist nur ein Demo-Bereich. Für echte interne Nutzung wären Zuständigkeiten, Moderation und Freigabe nötig.
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Ideen-Bubble öffnen"
        className="flex h-12 items-center gap-2 rounded-full bg-white px-4 text-db-dark shadow-panel ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red focus-visible:outline focus-visible:outline-4 focus-visible:outline-db-red/25"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-db-red text-xs font-black text-white">ID</span>
        <span className="hidden pr-1 text-sm font-black sm:inline">Ideen</span>
      </button>
    </div>
  );
}

function FloatingAzubiBegleiter({ onNavigate, onNotify }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [aiMode, setAiMode] = useState("unknown");
  const [chatContext, setChatContext] = useState(() => emptyFloatingChatContext());
  const [messages, setMessages] = useState(() => [
    {
      id: "floating-start",
      role: "bot",
      time: currentTime(),
      text: "Hey, ich bin da. Schreib einfach, was passiert ist oder was dich gerade beschäftigt.",
    },
  ]);
  const endRef = useRef(null);
  const typingRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
      checkAiStatus();
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (typingRef.current) {
        window.clearTimeout(typingRef.current);
      }
    };
  }, []);

  async function checkAiStatus() {
    try {
      const response = await fetch("/api/chat/status", { cache: "no-store" });
      if (!response.ok) {
        setAiMode("demo");
        return;
      }
      const data = await response.json();
      setAiMode(data.connected ? "active" : "demo");
    } catch {
      setAiMode("demo");
    }
  }

  async function send(text = input) {
    const trimmed = text.trim();
    if (!trimmed || typing) {
      return;
    }

    const nextContext = detectFloatingChatIntent(trimmed, chatContext);
    const userMessage = { id: `float-user-${Date.now()}`, role: "user", time: currentTime(), text: trimmed };
    setChatContext(nextContext);
    setOpen(true);
    setInput("");
    setMessages((items) => [...items, userMessage]);
    setTyping(true);

    if (typingRef.current) {
      window.clearTimeout(typingRef.current);
    }

    try {
      const aiReply = await requestAiReply([...messages, userMessage]);
      const actions = actionsForFloatingIntent(nextContext).slice(0, 3);
      setAiMode("active");
      setChatContext((current) => ({ ...current, lastSuggestedAction: actions[0] ?? current.lastSuggestedAction }));
      setMessages((items) => [
        ...items,
        {
          id: `float-bot-${Date.now()}`,
          role: "bot",
          time: currentTime(),
          text: aiReply,
          actions,
        },
      ]);
    } catch {
      const response = localFloatingBegleiterResponse(trimmed, nextContext);
      setAiMode("demo");
      setChatContext((current) => ({ ...current, lastSuggestedAction: response.actions?.[0] ?? current.lastSuggestedAction }));
      setMessages((items) => [
        ...items,
        {
          id: `float-bot-${Date.now()}`,
          role: "bot",
          time: currentTime(),
          modeNote: "Der echte KI-Modus ist gerade nicht erreichbar. Ich nutze kurz eine einfache Demo-Antwort.",
          ...response,
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function clearChat() {
    setMessages([
      {
        id: "floating-start",
        role: "bot",
        time: currentTime(),
        text: "Hey, ich bin da. Schreib einfach, was passiert ist oder was dich gerade beschäftigt.",
      },
    ]);
    setInput("");
    setTyping(false);
    setChatContext(emptyFloatingChatContext());
    onNotify?.("Chat lokal geleert");
  }

  function go(viewId, label) {
    setOpen(false);
    onNavigate(viewId);
    onNotify?.(`${label} geöffnet`);
  }

  function addRewrite() {
    const text = messageForFloatingContext(chatContext);
    setMessages((items) => [
      ...items,
      {
        id: `float-rewrite-${Date.now()}`,
        role: "bot",
        time: currentTime(),
        text,
        actions: chatContext.category === "money" || chatContext.category === "rules" ? ["note"] : ["protocol", "report"],
      },
    ]);
  }

  function addNotePreview() {
    const topicLabels = {
      money: "Geld / finanzielle Sorgen",
      stress: "Stress / Überforderung",
      training: "Ausbildung / Lernen",
      exam: "Prüfung / Berufsschule",
      conflict: "Konflikt",
      bullying: "Mobbing / Ausgrenzung",
      discrimination: "Diskriminierung / Hass",
      danger: "Sicherheit / Gefahr",
      rules: "Regeln / Rechte",
      crisis: "Krise",
      worry: "Sorge / Unsicherheit",
      dbWork: "Bahn-Kontext",
    };
    const topic = topicLabels[chatContext.category] || "Sorge / Unsicherheit";
    const nextStep = nextStepForFloatingContext(chatContext);
    setMessages((items) => [
      ...items,
      {
        id: `float-note-${Date.now()}`,
        role: "bot",
        time: currentTime(),
        text: "Ich habe daraus eine einfache Demo-Notiz gemacht. Sie wird hier nur angezeigt und nicht dauerhaft gespeichert.",
        note: {
          topic,
          summary: chatContext.lastUserTopic || "Kurze Sorge im Chat beschrieben.",
          date: todayIso(),
          nextStep,
        },
        actions: chatContext.category === "money" || chatContext.category === "stress" || chatContext.category === "worry" ? ["rewrite"] : ["protocol"],
      },
    ]);
    onNotify?.("Notizvorschau erstellt");
  }

  function addNextStep() {
    setMessages((items) => [
      ...items,
      {
        id: `float-next-${Date.now()}`,
        role: "bot",
        time: currentTime(),
        text: nextStepForFloatingContext(chatContext),
        actions: actionsForFloatingIntent(chatContext),
      },
    ]);
  }

  function handleAction(action) {
    if (action === "protocol" || action === "protocolFirst") {
      go("protokoll", "Festhalten");
      return;
    }
    if (action === "report") {
      go("meldung", "Melden");
      return;
    }
    if (action === "training") {
      go("training", "Training");
      return;
    }
    if (action === "help") {
      go("kiHilfe", "Hilfe");
      return;
    }
    if (action === "rewrite") {
      addRewrite();
      return;
    }
    if (action === "note") {
      addNotePreview();
      return;
    }
    if (action === "next") {
      addNextStep();
    }
  }

  const actionLabels = {
    protocol: "Festhalten",
    protocolFirst: "Erst festhalten",
    report: "Melden",
    training: "Lernen",
    help: "Hilfe",
    rewrite: "Nachricht formulieren",
    note: "Notiz speichern",
    next: "Nächster Schritt",
  };

  async function requestAiReply(nextMessages) {
    const payload = buildFloatingChatPayload(nextMessages);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: payload }),
    });

    if (!response.ok) {
      throw new Error("ai_unavailable");
    }

    const data = await response.json();
    const reply = String(data.reply || "").trim();
    if (!reply) {
      throw new Error("empty_ai_reply");
    }
    return reply;
  }

  return (
    <div className="fixed right-4 bottom-24 z-[55] sm:right-6 lg:bottom-6">
      {open && (
        <section className="mb-4 flex h-[min(520px,calc(100vh-8rem))] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-db-dark/10 bg-white shadow-panel">
          <div className="bg-db-red p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Sparkles size={18} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-black">Azubi-Begleiter</h2>
                  <p className="mt-0.5 text-xs font-semibold leading-5 text-white/85">Schreib einfach, was los ist.</p>
                  <p className="mt-1.5 text-[11px] font-black text-white/75">
                    {aiMode === "active" ? "KI-Modus aktiv" : aiMode === "demo" ? "Demo-Modus" : "KI-Modus wird geprüft"}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Azubi-Begleiter minimieren"
                  className="rounded bg-white/10 px-3 py-2 text-sm font-black text-white hover:bg-white/20"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Azubi-Begleiter schließen"
                  className="rounded bg-white/10 px-3 py-2 text-sm font-black text-white hover:bg-white/20"
                >
                  x
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-db-soft p-5">
            <div className="grid gap-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-sm ${message.role === "user" ? "bg-db-red text-white" : "bg-white text-db-dark ring-1 ring-db-dark/10"}`}>
                    <p className={`mb-2 text-[11px] font-black ${message.role === "user" ? "text-white/75" : "text-db-rail"}`}>
                      {message.role === "user" ? "Du" : "Azubi-Begleiter"} · {message.time}
                    </p>
                    {message.text ? (
                      <p className={`font-semibold leading-6 ${message.role === "bot" ? "text-db-rail" : ""}`}>{message.text}</p>
                    ) : (
                      <div className="grid gap-3">
                        {message.sections.map(([title, body]) => (
                          <div key={title}>
                            <p className="font-black">{title}</p>
                            <p className="mt-1 font-semibold leading-6 text-db-rail">{body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {message.modeNote && (
                      <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs font-black leading-5 text-amber-800">
                        {message.modeNote}
                      </p>
                    )}
                    {message.role === "bot" && message.actions?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action) => (
                          <button
                            key={action}
                            type="button"
                            onClick={() => handleAction(action)}
                            className="rounded bg-db-soft px-2 py-1 text-xs font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red"
                          >
                            {actionLabels[action]}
                          </button>
                        ))}
                      </div>
                    )}
                    {message.note && (
                      <div className="mt-3 rounded-xl bg-db-soft p-3 text-db-dark ring-1 ring-db-dark/10">
                        <p className="text-xs font-black uppercase tracking-wide text-db-red">Notizvorschau</p>
                        <p className="mt-2 text-sm font-black">{message.note.topic}</p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-db-rail">{message.note.summary}</p>
                        <p className="mt-2 text-xs font-semibold text-db-rail">Datum: {message.note.date}</p>
                        <p className="mt-1 text-xs font-semibold text-db-rail">Nächster Schritt: {message.note.nextStep}</p>
                        <p className="mt-2 text-xs font-black text-db-rail">Nur lokal im Demo-Prototyp.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-db-rail ring-1 ring-db-dark/10">
                    Azubi-Begleiter schreibt ...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          <div className="border-t border-db-dark/10 bg-white p-4">
            <label className="block">
              <span className="sr-only">Nachricht an Azubi-Begleiter</span>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
                placeholder="Nachricht schreiben..."
                className="field min-h-20 resize-none py-3 text-sm"
              />
            </label>
            <div className="mt-3 flex items-center justify-between gap-2">
              <button type="button" onClick={clearChat} className="rounded-lg bg-db-soft px-3 py-2 text-xs font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Chat leeren
              </button>
              <button type="button" onClick={() => send()} className="rounded bg-db-red px-4 py-2 text-sm font-black text-white hover:bg-red-700">
                Senden
              </button>
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-db-rail">
              Demo-Chat · keine echten Namen · bei Gefahr echte Hilfe holen
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Azubi-Begleiter öffnen"
        className="flex h-14 items-center gap-3 rounded-full bg-gradient-to-br from-[#f01428] to-[#c00015] px-4 text-white shadow-[0_14px_34px_rgba(226,0,26,0.35)] ring-1 ring-db-red/20 transition hover:brightness-110 focus-visible:outline focus-visible:outline-4 focus-visible:outline-db-red/25"
      >
        <span className="motion-pulse flex h-9 w-9 items-center justify-center rounded-full bg-white text-db-red">
          <Sparkles size={18} aria-hidden="true" />
        </span>
        <span className="hidden pr-1 text-sm font-black sm:inline">Azubi-Begleiter</span>
      </button>
    </div>
  );
}

function emptyFloatingChatContext() {
  return {
    lastUserTopic: "",
    category: "worry",
    lastSuggestedAction: null,
    mentionedDanger: false,
    flags: {
      money: false,
      stress: false,
      conflict: false,
      bullying: false,
      training: false,
      dbWork: false,
      exam: false,
      rules: false,
      personalWorry: false,
    },
  };
}

function buildFloatingChatPayload(messages) {
  return messages
    .filter((message) => message && (message.role === "user" || message.role === "bot"))
    .map((message) => {
      const content =
        message.text ||
        (Array.isArray(message.sections)
          ? message.sections.map(([title, body]) => `${title} ${body}`).join("\n")
          : "");

      return {
        role: message.role === "user" ? "user" : "assistant",
        content,
      };
    })
    .filter((message) => message.content.trim())
    .slice(-8);
}

function hasAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function detectFloatingChatIntent(message, previousContext = emptyFloatingChatContext()) {
  const text = message.toLowerCase();
  const shortFollowUp = text.length <= 24;
  let category = "worry";

  if (hasAny(text, ["depressiv", "hoffnungslos", "suizid", "selbst verletzen", "selbstverletzen", "nicht mehr leben", "alles egal"])) {
    category = "crisis";
  } else if (hasAny(text, ["angst", "gefahr", "bedroht", "drohung", "gewalt", "schlagen", "eskaliert"])) {
    category = "danger";
  } else if (hasAny(text, ["geld", "geldprobleme", "schulden", "miete", "rechnung", "konto", "knapp", "bafög", "gehalt", "lohn", "azubi gehalt", "kosten", "sparen", "bezahlen"])) {
    category = "money";
  } else if (hasAny(text, ["diskriminierung", "rassistisch", "herkunft", "religion", "geschlecht", "beleidigt wegen", "hass"])) {
    category = "discrimination";
  } else if (hasAny(text, ["mobbing", "beleidigt", "ausgelacht", "ausgeschlossen", "fertiggemacht", "lästern", "schlecht behandelt"])) {
    category = "bullying";
  } else if (hasAny(text, ["streit", "konflikt", "kollege", "kollegin", "team", "ausbilder", "meister", "chef", "vorgesetzter"])) {
    category = "conflict";
  } else if (hasAny(text, ["prüfung", "test", "lernen", "durchfallen", "note", "berufsschule"])) {
    category = "exam";
  } else if (hasAny(text, ["recht", "darf", "pflicht", "pause", "arbeitszeit", "urlaub", "vertrag", "krankmeldung"])) {
    category = "rules";
  } else if (hasAny(text, ["stress", "überfordert", "druck", "müde", "schaffe nicht", "zu viel", "burnout", "keine kraft"])) {
    category = "stress";
  } else if (hasAny(text, ["db", "bahn", "bahnhof", "werkstatt", "schicht", "zug", "fahrgast", "kunde", "einsatz", "betrieb"])) {
    category = "dbWork";
  } else if (hasAny(text, ["ausbildung", "azubi", "berufsschule", "betrieb", "lehrjahr", "praxis"])) {
    category = "training";
  } else if (hasAny(text, ["sorge", "sorgen", "problem", "weiß nicht weiter", "hilfe"])) {
    category = "worry";
  } else if (shortFollowUp && previousContext.category) {
    category = previousContext.category;
  }

  const flags = {
    money: previousContext.flags?.money || category === "money",
    stress: previousContext.flags?.stress || category === "stress",
    conflict: previousContext.flags?.conflict || category === "conflict",
    bullying: previousContext.flags?.bullying || category === "bullying",
    training: previousContext.flags?.training || category === "training",
    dbWork: previousContext.flags?.dbWork || category === "dbWork",
    exam: previousContext.flags?.exam || category === "exam",
    rules: previousContext.flags?.rules || category === "rules",
    personalWorry: previousContext.flags?.personalWorry || category === "worry" || category === "crisis",
  };

  return {
    lastUserTopic: message,
    category,
    lastSuggestedAction: null,
    mentionedDanger: previousContext.mentionedDanger || category === "danger" || category === "crisis",
    flags,
  };
}

function actionsForFloatingIntent(context) {
  if (context.category === "money") return ["rewrite", "note", "next"];
  if (context.category === "stress" || context.category === "worry") return ["rewrite", "note"];
  if (context.category === "bullying" || context.category === "discrimination" || context.category === "conflict") return ["protocol", "report"];
  if (context.category === "danger" || context.category === "crisis") return ["help", "protocol"];
  if (context.category === "exam" || context.category === "training") return ["training", "rewrite"];
  if (context.category === "rules") return ["rewrite", "note"];
  if (context.category === "dbWork") return ["protocol", "help"];
  return ["protocol", "report"];
}

function nextStepForFloatingContext(context) {
  if (context.category === "money") {
    if (String(context.lastUserTopic || "").toLowerCase().includes("miete")) {
      return "Wenn es um Miete geht: Schreib auf, welcher Betrag wann fällig ist. Melde dich früh bei Vermieter:in, zuständiger Stelle oder Beratung, bevor es eskaliert.";
    }
    return "Schreib auf, was offen ist, und frag eine zuständige Beratungsstelle oder Vertrauensperson nach Unterstützungsmöglichkeiten.";
  }
  if (context.category === "stress") return "Schreib drei Stresspunkte auf und wähle einen kleinen Schritt für heute.";
  if (context.category === "conflict") return "Sammle ein konkretes Beispiel und bereite ein ruhiges Gespräch vor.";
  if (context.category === "bullying" || context.category === "discrimination") return "Halte Datum, Ort, Kontext und genaue Worte sachlich fest.";
  if (context.category === "danger" || context.category === "crisis") return "Sicherheit zuerst: echte Hilfe holen und nicht allein bleiben.";
  if (context.category === "exam") return "Plane einen kurzen Lernblock und frag früh nach Unterstützung.";
  if (context.category === "rules") return "Formuliere die Frage sachlich und frage eine zuständige Stelle.";
  return "Schreib kurz auf, worum es geht, und entscheide dann: reden, festhalten oder Meldung vorbereiten.";
}

function messageForFloatingContext(context) {
  if (context.category === "money") {
    return "Sachlich könnte es heißen: \"Hallo, ich habe aktuell finanzielle Schwierigkeiten und möchte frühzeitig nachfragen, welche Unterstützung oder Beratungsmöglichkeiten es gibt. Können Sie mir sagen, an wen ich mich wenden kann?\"";
  }
  if (context.category === "conflict") {
    return "Sachlich könnte es heißen: \"Hallo, ich möchte eine Situation aus der Ausbildung ruhig ansprechen, weil sie mich belastet. Können wir dafür einen Gesprächstermin finden?\"";
  }
  if (context.category === "bullying" || context.category === "discrimination") {
    return "Sachlich könnte es heißen: \"Hallo, ich möchte eine wiederholte Situation sachlich melden bzw. besprechen. Ich habe Datum, Uhrzeit und Kontext notiert und möchte wissen, welcher nächste Schritt sinnvoll ist.\"";
  }
  if (context.category === "rules") {
    return "Sachlich könnte es heißen: \"Hallo, ich habe eine Frage zu den geltenden Regeln in meiner Ausbildung. Können Sie mir sagen, welche zuständige Stelle mir das offiziell erklären kann?\"";
  }
  return "Sachlicher könnte es heißen: \"Die Situation belastet mich. Ich möchte klären, wie wir respektvoller miteinander umgehen können.\"";
}

function localFloatingBegleiterResponse(message, context = detectFloatingChatIntent(message)) {
  const text = message.toLowerCase();
  const emotional = text.includes("hasse") || text.includes("nervt") || text.includes("scheiße") || text.includes("komplett fertig") || text.includes("wütend");
  const withRewrite = (actions) => (emotional ? Array.from(new Set([...actions, "rewrite"])).slice(0, 3) : actions);

  if (hasAny(text, ["melden", "meldung", "anzeigen", "weitergeben"])) {
    return {
      text: "Okay. Willst du die Meldung anonym, persönlich oder erstmal nur als Entwurf vorbereiten? Die App führt dich Schritt für Schritt durch. Es wird nichts automatisch gesendet.",
      actions: ["report", "protocolFirst"],
    };
  }

  if (context.category === "crisis") {
    return {
      sections: [
        ["Ich ordne das so ein:", "Das klingt sehr belastend. Damit solltest du jetzt nicht allein bleiben."],
        ["Ruf jetzt an – kostenlos & anonym:", "Telefonseelsorge: 0800 111 0 111 oder 0800 111 0 222 (24/7). Bis 25 Jahre: Nummer gegen Kummer 116 111."],
        ["Bei akuter Gefahr:", "Notruf 112. Bei der DB hilft das MUT-Team anonym: 0800 100 99 66."],
        ["Wichtig:", "Diese App kann keine Krisenhilfe leisten und ersetzt keine psychologische Hilfe."],
      ],
      actions: ["help", "protocol"],
    };
  }

  if (context.category === "danger") {
    return {
      sections: [
        ["Ich ordne das so ein:", "Sicherheit geht vor. Klärung kommt erst danach."],
        ["Was du jetzt tun kannst:", "Geh, wenn möglich, an einen sicheren Ort und hol eine reale Person dazu. Konfrontiere niemanden allein."],
        ["Bei akuter Bedrohung sofort anrufen:", "Polizei 110 oder Notruf 112. Bei der DB anonym: MUT-Team 0800 100 99 66."],
        ["Danach:", "Dokumentiere die Situation sachlich, wenn du wieder sicher bist."],
      ],
      actions: ["help", "protocol", "report"],
    };
  }

  if (context.category === "money") {
    const followUp = hasAny(text, ["miete", "rechnung", "konto", "schulden", "bezahlen", "knapp"])
      ? "Wenn es um Miete geht, ist frühes Reagieren wichtig: Was genau ist fällig und bis wann?"
      : "Ist es eher Schulden, laufende Kosten oder zu wenig Geld am Monatsende?";
    return {
      text: `Okay, Geldsorgen können richtig drücken, gerade als Azubi. Wichtig ist: nicht ignorieren und nichts einfach liegen lassen. Schreib kurz Einnahmen, Ausgaben und offene Dinge auf: Miete, Rechnungen, Raten oder Konto. Danach kannst du prüfen, ob Schuldnerberatung, eine Vertrauensperson, JAV/Betriebsrat, Ausbilder:in oder soziale Beratung helfen kann. Das ist keine Finanzberatung. ${followUp}`,
      actions: ["rewrite", "note", "next"],
    };
  }

  if (context.category === "discrimination") {
    return {
      text: "Das solltest du nicht einfach normalisieren. Schreib möglichst genau auf, was gesagt wurde, wann und in welchem Kontext. Hol dir Unterstützung, wenn es wiederholt passiert oder dich belastet. Soll ich dir helfen, es sachlich zu formulieren?",
      actions: withRewrite(["protocol", "report"]),
    };
  }

  if (context.category === "bullying") {
    return {
      text: "Das klingt nicht okay, vor allem wenn es öfter passiert. Notiere Datum, Uhrzeit und Kontext, ohne echte Namen hier einzugeben. Sprich mit einer Vertrauensperson, wenn du damit nicht allein bleiben willst. Ist das einmal passiert oder schon öfter?",
      actions: withRewrite(["protocol", "report", "training"]),
    };
  }

  if (context.category === "conflict") {
    return {
      text: "Das solltest du ernst nehmen, besonders wenn es vor anderen passiert oder wiederholt vorkommt. Schreib konkrete Beispiele mit Datum, Uhrzeit und Kontext auf. Danach kannst du ein ruhiges Gespräch vorbereiten oder dir Unterstützung von einer Vertrauensperson holen. Wenn es demütigend oder wiederholt ist, nutze Vorfall festhalten.",
      actions: withRewrite(["protocol", "report"]),
    };
  }

  if (context.category === "exam") {
    return {
      text: "Okay, das klingt nach Prüfungsdruck. Mach es kleiner: ein Thema, 20 Minuten, dann kurze Pause. Wenn du merkst, dass du festhängst, frag früh bei Ausbilder:in, Berufsschule oder einer Vertrauensperson nach. Was ist gerade das schwierigste Thema?",
      actions: ["training"],
    };
  }

  if (context.category === "rules") {
    return {
      text: "Das klingt nach Regeln oder Rechten. Ich kann keine Rechtsberatung geben und kenne keine internen Einzelfallregeln. Schreib die Frage kurz und sachlich auf und frag bei deiner zuständigen Stelle, JAV/Betriebsrat oder HR/Personalbereich nach. Ich kann dir helfen, die Frage vorzubereiten.",
      actions: ["rewrite"],
    };
  }

  if (context.category === "stress") {
    return {
      text: "Klingt, als wäre gerade zu viel auf einmal. Schreib dir nur die drei größten Stresspunkte auf und such dir einen kleinen Schritt für heute. Wenn das länger so bleibt, sprich früh mit Ausbilder:in oder einer Vertrauensperson. Geht es eher um Schule, Betrieb oder Team?",
      actions: ["training"],
    };
  }

  if (context.category === "dbWork") {
    return {
      text: "Das klingt nach Alltag im Bahn-Kontext. Ich kann keine internen Regeln prüfen, aber ich kann dir helfen, es zu sortieren. Geht es um Sicherheit, Konflikt oder Organisation? Wenn Sicherheit oder respektloses Verhalten betroffen ist, halte die Situation sachlich fest.",
      actions: ["protocol", "help"],
    };
  }

  if (context.category === "training") {
    return {
      text: "Bei Ausbildungsthemen hilft oft eine ganz konkrete Frage: Was ist unklar, seit wann, und wen betrifft es? Wenn es offiziell geklärt werden muss, frag Ausbilder:in oder Praxisanleitung. Ich kann dir helfen, die Frage kurz und ruhig zu formulieren.",
      actions: ["training", "rewrite"],
    };
  }

  return {
    text: "Okay, ich höre raus: Da ist gerade etwas, das dich beschäftigt. Geht es eher um Geld, Ausbildung, Stress oder einen Konflikt?",
    actions: ["note", "rewrite"],
  };
}

function Toast({ message }) {
  return (
    <div className="toast-pop fixed left-1/2 bottom-20 z-[60] flex w-[calc(100%-2rem)] max-w-sm items-center gap-2.5 rounded-xl border border-db-dark/10 bg-white px-4 py-3 text-sm font-black text-db-dark shadow-panel md:bottom-6">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-db-red">
        <Sparkles size={13} aria-hidden="true" />
      </span>
      {message}
    </div>
  );
}

function ConfirmDialog({ title, message, confirmLabel, cancelLabel, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/35 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-db-dark/10 bg-white p-5 shadow-panel">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-db-rail">Bestätigung</p>
        <h3 className="mt-2 text-2xl font-black text-db-dark">{title}</h3>
        <p className="mt-3 text-sm font-semibold leading-7 text-db-rail">{message}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-db-red px-4 py-3 text-sm font-black text-white">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoTag({ children }) {
  return <span className="rounded bg-db-soft px-2 py-1 text-[11px] font-black text-db-rail ring-1 ring-db-dark/10">{children}</span>;
}

function SmallTag({ children }) {
  return <span className="rounded bg-red-50 px-3 py-2 text-xs font-black text-db-red ring-1 ring-red-100">{children}</span>;
}

function getQuickActions(viewId, navigateMain) {
  if (viewId === "overview") {
    return [
      { label: "Hilfe", onClick: () => navigateMain("kiHilfe") },
      { label: "Festhalten", onClick: () => navigateMain("protokoll") },
      { label: "Melden", onClick: () => navigateMain("meldung") },
      { label: "Lernen", onClick: () => navigateMain("training") },
    ];
  }

  return [];
}

function ViewHero({ icon: Icon, title, subtitle, note }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-sm">
      <div className="h-1.5 bg-gradient-to-r from-db-red via-[#ff2d3f] to-db-red" />
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-db-red/[0.07] blur-2xl" aria-hidden="true" />
      <div className="relative p-5">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-db-red">
              <Icon size={22} aria-hidden="true" />
            </span>
          )}
          <h1 className="text-2xl font-black text-db-dark sm:text-3xl">{title}</h1>
        </div>
        {subtitle && <p className="mt-3 text-sm font-semibold leading-7 text-db-rail">{subtitle}</p>}
        {note && <p className="mt-2 text-xs font-black text-db-rail/70">{note}</p>}
      </div>
    </div>
  );
}

function SimpleStartView({ onNavigate, demoOpen, setDemoOpen, onCreateExampleData }) {
  const actions = [
    ["Ich brauche Hilfe", "kiHilfe", "Reden, sortieren, schnelle Orientierung.", LifeBuoy],
    ["Ich will etwas festhalten", "protokoll", "Datum, Uhrzeit, Ort und Verlauf notieren.", NotebookPen],
    ["Ich will eine Meldung vorbereiten", "meldung", "Einen sachlichen Entwurf erstellen.", Megaphone],
  ];

  return (
    <ViewFrame>
      <section className="space-y-8 p-5 lg:p-8">
        <div className="relative overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-panel">
          <div className="h-2 bg-gradient-to-r from-db-red via-[#ff2d3f] to-db-red" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-db-red/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-db-red/5 blur-3xl" aria-hidden="true" />
          <div className="relative p-7">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-db-red">Deutsche Bahn · Gegen Hass und Gewalt</p>
            <h1 className="mt-3 text-4xl font-black text-db-dark">DB Peace AI</h1>
            <p className="mt-3 max-w-2xl text-lg font-semibold leading-8 text-db-rail">
              Wenn du Mobbing, Hass, Gewalt oder Diskriminierung erlebst, hilft dir die App beim nächsten Schritt.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 shrink-0 text-db-red" size={22} aria-hidden="true" />
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-db-red">Im Notfall</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-db-rail">Bei akuter Gefahr zählt jede Sekunde – hol dir sofort echte Hilfe.</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <a href="tel:112" className="motion-pulse inline-flex items-center gap-2 rounded-lg bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700" aria-label="Notruf 112 anrufen">
              <Phone size={16} aria-hidden="true" /> Notruf 112
            </a>
            <button type="button" onClick={() => onNavigate("kiHilfe")} className="rounded-lg bg-white px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
              Hilfe öffnen
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {actions.map(([label, viewId, text, Icon]) => (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(viewId)}
              className="group flex flex-col rounded-xl border border-db-dark/10 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-db-red hover:shadow-panel"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-db-red transition group-hover:bg-db-red group-hover:text-white">
                {Icon && <Icon size={24} aria-hidden="true" />}
              </span>
              <span className="text-xl font-black text-db-dark transition group-hover:text-db-red">{label}</span>
              {text && <span className="mt-2 block text-sm font-semibold leading-6 text-db-rail">{text}</span>}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-db-red opacity-0 transition group-hover:opacity-100">
                Öffnen <ArrowRight size={16} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-white p-4 shadow-sm">
          <p className="px-1 text-xs font-black uppercase tracking-wide text-db-rail">Mehr in der App</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              ["Lernen & Üben", "training", GraduationCap],
              ["Ideen einreichen", "ideen", Lightbulb],
              ["Azubi-News", "news", Newspaper],
            ].map(([label, viewId, Icon]) => (
              <button
                key={viewId}
                type="button"
                onClick={() => onNavigate(viewId)}
                className="flex items-center gap-2 rounded-lg bg-db-soft px-3 py-3 text-left text-sm font-black text-db-dark transition hover:bg-red-50 hover:text-db-red"
              >
                <Icon size={18} className="shrink-0 text-db-red" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="px-1 text-sm font-black leading-6 text-db-rail">
          Die App sendet nichts automatisch. Menschen entscheiden, nicht die KI.
        </p>

        {demoOpen && (
          <GuidedDemoPanel
            onClose={() => setDemoOpen(false)}
            onNavigate={onNavigate}
            onCreateExampleData={onCreateExampleData}
          />
        )}
      </section>
    </ViewFrame>
  );
}

function GuidedDemoPanel({ onClose, onNavigate, onCreateExampleData }) {
  const today = todayIso();
  const steps = [
    {
      title: "1. Situation verstehen",
      text: "Der Azubi kann zuerst mit dem Azubi-Begleiter schreiben, ohne direkt eine Meldung auszufüllen.",
      button: "Zum Azubi-Begleiter",
      view: "kiHilfe",
      preview: [
        ["Nachricht", "Ich werde in der Werkstatt öfter ausgelacht und weiß nicht, ob ich übertreibe."],
        ["Antwort", "Das solltest du ernst nehmen. Wenn es wiederholt passiert und dich belastet, ist es sinnvoll, konkrete Situationen festzuhalten: Datum, Uhrzeit, Ort und was gesagt wurde."],
      ],
    },
    {
      title: "2. Vorfall festhalten",
      text: "Die Situation wird sachlich als lokale Demo-Notiz vorbereitet.",
      button: "Vorfall festhalten öffnen",
      view: "protokoll",
      preview: [
        ["Datum", today],
        ["Uhrzeit", "09:30"],
        ["Ort/Kontext", "Werkstatt"],
        ["Situation", "wiederholtes Auslachen und abwertende Sprüche"],
        ["Wiederholung", "mehrfach"],
        ["Belastung", "4/5"],
        ["Akute Gefahr", "nein"],
        ["Status", "lokal gespeichert"],
      ],
    },
    {
      title: "3. Meldung vorbereiten",
      text: "Aus der Notiz kann eine Meldung als Entwurf vorbereitet werden.",
      button: "Meldung vorbereiten öffnen",
      view: "meldung",
      preview: [
        ["Modus", "Entwurf"],
        ["Kategorie", "Mobbing / respektloser Umgang"],
        ["Risiko", "mittel"],
        ["5-W-Check", "4 von 5"],
        ["Hinweis", "nicht übermittelt"],
      ],
    },
    {
      title: "4. Training nutzen",
      text: "Passende Übungen helfen, ruhig und vorbereitet zu reagieren.",
      button: "Training öffnen",
      view: "training",
      preview: [
        ["Empfohlen", "Mobbing in der Werkstatt"],
        ["Üben", "Gespräch ruhig vorbereiten"],
        ["Ziel", "Deeskalierend reagieren"],
      ],
    },
    {
      title: "5. Nächster Schritt",
      text: "Der Azubi entscheidet selbst, ob er erstmal nur dokumentiert, mit einer Vertrauensperson spricht oder eine Meldung vorbereitet.",
      button: "Mit leerer App starten",
      view: "overview",
      preview: [
        ["Wichtig", "Die App sendet nichts automatisch."],
        ["Grundsatz", "Menschen entscheiden, nicht die KI."],
      ],
    },
  ];

  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-db-red">Fiktives Beispiel – keine echten Daten</p>
          <h2 className="mt-2 text-2xl font-black text-db-dark">Geführte Beispiel-Demo</h2>
          <p className="mt-2 max-w-4xl text-sm font-semibold leading-7 text-db-rail">
            Ein Azubi wird in der Werkstatt seit mehreren Wochen vor anderen ausgelacht und abwertend angesprochen. Er ist unsicher, ob das schon Mobbing ist, und möchte erstmal wissen, was er tun kann.
          </p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
          Demo schließen
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-5">
        {steps.map((step) => (
          <article key={step.title} className="rounded-xl bg-db-soft p-4">
            <p className="text-base font-black text-db-dark">{step.title}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{step.text}</p>
            <div className="mt-3 grid gap-2">
              {step.preview.map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white p-3">
                  <p className="text-[11px] font-black uppercase tracking-wide text-db-red">{label}</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-db-rail">{value}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => { onNavigate(step.view); onClose(); }} className="mt-4 w-full rounded bg-white px-3 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
              {step.button}
            </button>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={onCreateExampleData} className="rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">
          Beispiel-Daten in Demo übernehmen
        </button>
        <button type="button" onClick={onClose} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
          Demo beenden
        </button>
        <button type="button" onClick={() => { onClose(); onNavigate("overview"); }} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
          Mit leerer App starten
        </button>
      </div>
    </div>
  );
}

const notrufKontakte = [
  { label: "Notruf 112", tel: "112", note: "Feuerwehr & Rettung – bei akuter Gefahr" },
  { label: "Polizei 110", tel: "110", note: "Bei Bedrohung oder Gewalt" },
];

const hilfeKontaktGruppen = [
  {
    titel: "Bei der Deutschen Bahn",
    icon: Building2,
    hinweis: "Kostenlos und auf Wunsch anonym.",
    kontakte: [
      { label: "MUT-Team", tel: "0800 100 99 66", note: "Mitarbeiterunterstützung – anonym oder persönlich, bei Sorgen, Konflikten und Belastung" },
      { label: "Compliance-Meldestelle", note: "Anonyme Meldung von Fehlverhalten – Kontakt über das DB-Intranet" },
      { label: "JAV / Vertrauensperson vor Ort", note: "Deine Jugend- und Auszubildendenvertretung kennt dich und deinen Betrieb" },
    ],
  },
  {
    titel: "Anonym & rund um die Uhr",
    icon: Clock,
    hinweis: "Unabhängig, kostenlos, vertraulich.",
    kontakte: [
      { label: "Telefonseelsorge", tel: "0800 111 0 111", note: "24/7, kostenlos, anonym" },
      { label: "Telefonseelsorge", tel: "0800 111 0 222", note: "Zweite Leitung, 24/7" },
      { label: "Nummer gegen Kummer", tel: "116 111", note: "Für junge Menschen bis 25" },
    ],
  },
];

function telHref(tel) {
  return `tel:${tel.replace(/\s+/g, "")}`;
}

function KontaktZeile({ label, tel, note }) {
  return (
    <div className="rounded-lg border border-db-dark/10 bg-db-soft p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 flex-1 text-sm font-black text-db-dark break-words">{label}</p>
        {tel ? (
          <a
            href={telHref(tel)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-db-red px-3 py-2 text-sm font-black text-white hover:bg-red-700"
            aria-label={`${label} anrufen: ${tel}`}
          >
            <Phone size={14} aria-hidden="true" /> {tel}
          </a>
        ) : (
          <span className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-black text-db-rail ring-1 ring-db-dark/10">
            vor Ort
          </span>
        )}
      </div>
      {note && <p className="mt-2 text-xs font-semibold leading-5 text-db-rail">{note}</p>}
    </div>
  );
}

function EchteHilfeKontakte() {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-db-dark">Echte Hilfe – sofort erreichbar</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">
        Diese App ersetzt keine Menschen. Bei akuter Gefahr sofort anrufen – tippe auf die Nummer.
      </p>

      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-db-red">
          <ShieldAlert size={16} aria-hidden="true" /> Akute Gefahr
        </p>
        <div className="mt-3 space-y-2">
          {notrufKontakte.map((kontakt) => (
            <KontaktZeile key={kontakt.label} {...kontakt} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowAll((value) => !value)}
        aria-expanded={showAll}
        className="mt-3 flex w-full items-center justify-between gap-2 rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark transition hover:bg-red-50 hover:text-db-red"
      >
        <span>Weitere Anlaufstellen (DB-Hilfe & anonyme Beratung)</span>
        <ChevronDown size={18} className={`shrink-0 transition-transform ${showAll ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {showAll && (
        <div className="motion-card">
          {hilfeKontaktGruppen.map((gruppe) => {
            const GIcon = gruppe.icon;
            return (
              <div key={gruppe.titel} className="mt-4">
                <p className="flex items-center gap-2 text-sm font-black text-db-dark">
                  {GIcon && <GIcon size={16} className="text-db-red" aria-hidden="true" />}
                  {gruppe.titel}
                </p>
                <p className="text-xs font-semibold text-db-rail">{gruppe.hinweis}</p>
                <div className="mt-2 space-y-2">
                  {gruppe.kontakte.map((kontakt) => (
                    <KontaktZeile key={`${kontakt.label}-${kontakt.tel ?? "vorort"}`} {...kontakt} />
                  ))}
                </div>
              </div>
            );
          })}
          <p className="mt-4 text-[11px] font-semibold leading-5 text-db-rail">
            Hinweis: DB-interne Nummern vor dem echten Einsatz im Intranet verifizieren. Notruf 112/110 und die unabhängigen Hotlines sind bundesweit gültig.
          </p>
        </div>
      )}
    </div>
  );
}

function SimpleSoforthilfeView({ onNavigate, onNotify }) {
  const [tab, setTab] = useState("hilfe");
  const [selected, setSelected] = useState("Ich bin unsicher");
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);
  const [chatCategory, setChatCategory] = useState("Ich weiß nicht, wohin damit");
  const [chatText, setChatText] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [companionInput, setCompanionInput] = useState("");
  const [companionMessages, setCompanionMessages] = useState(() => [
    {
      id: "start",
      role: "bot",
      time: currentTime(),
      sections: [
        ["Azubi-Begleiter", "Hey, ich bin dein Azubi-Begleiter. Du kannst hier offen schreiben, was dich belastet."],
        ["Wobei ich helfe", "Ich helfe dir, die Situation zu sortieren und den nächsten Schritt zu finden."],
      ],
    },
  ]);
  const [companionTyping, setCompanionTyping] = useState(false);
  const [notePreview, setNotePreview] = useState("");
  const chatEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const options = [
    "Ich werde beleidigt",
    "Ich werde gemobbt",
    "Jemand droht mir",
    "Ich erlebe Diskriminierung",
    "Ich bin überfordert",
    "Ich weiß nicht weiter",
  ];
  const help = simpleHelpFor(selected);
  const chatCategories = [
    "Ausbildung allgemein",
    "Stress & Überforderung",
    "Konflikt mit Kolleg:innen",
    "Problem mit Ausbilder:in",
    "Prüfung / Lernen",
    "Rechte & Pflichten",
    "Mobbing / Hass / Gewalt",
    "Ich weiß nicht, wohin damit",
  ];
  const starterChips = [
    "Ich bin überfordert",
    "Ich habe Streit",
    "Ich fühle mich ausgeschlossen",
    "Ich habe Angst",
    "Ich habe Prüfungsstress",
    "Ich weiß nicht, ob das normal ist",
    "Ich brauche Hilfe beim Formulieren",
    "Ich will einfach kurz reden",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [companionMessages, companionTyping]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  function generateChatResponse() {
    setChatResponse(localAzubiChatResponse(chatText, chatCategory));
  }

  function sendCompanionMessage(messageText = companionInput) {
    const trimmed = messageText.trim();
    if (!trimmed || companionTyping) {
      return;
    }

    const userMessage = { id: `user-${Date.now()}`, role: "user", time: currentTime(), text: trimmed };
    setCompanionMessages((items) => [...items, userMessage]);
    setCompanionInput("");
    setNotePreview("");
    setCompanionTyping(true);

    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = window.setTimeout(() => {
      setCompanionMessages((items) => [
        ...items,
        {
          id: `bot-${Date.now()}`,
          role: "bot",
          time: currentTime(),
          sections: localAzubiBegleiterResponse(trimmed),
        },
      ]);
      setCompanionTyping(false);
    }, 550);
  }

  function clearCompanionChat() {
    setCompanionMessages([
      {
        id: "start",
        role: "bot",
        time: currentTime(),
        sections: [
          ["Azubi-Begleiter", "Hey, ich bin dein Azubi-Begleiter. Du kannst hier offen schreiben, was dich belastet."],
          ["Wobei ich helfe", "Ich helfe dir, die Situation zu sortieren und den nächsten Schritt zu finden."],
        ],
      },
    ]);
    setCompanionInput("");
    setNotePreview("");
    onNotify?.("Chat lokal geleert");
  }

  function latestUserText() {
    return [...companionMessages].reverse().find((item) => item.role === "user")?.text || companionInput;
  }

  function addCompanionToolResponse(type) {
    const source = latestUserText().trim();
    if (!source) {
      onNotify?.("Schreib zuerst kurz, worum es geht.");
      return;
    }

    if (type === "note") {
      setNotePreview(source);
      onNotify?.("Notizvorschau erstellt");
      return;
    }

    const sections =
      type === "formal"
        ? [
            ["Sachlicher Vorschlag", `Ich möchte kurz schildern, was passiert ist: ${source}`],
            ["Bitte", "Ich wünsche mir ein ruhiges Gespräch und Unterstützung bei einem nächsten sinnvollen Schritt."],
          ]
        : [
            ["Gespräch vorbereiten", "Nimm dir kurz Zeit und notiere nur die wichtigsten Punkte."],
            ["1. Was ist passiert?", source],
            ["2. Was brauchst du?", "Eine ruhige Klärung, Unterstützung oder einen klaren nächsten Schritt."],
            ["3. Wen kannst du ansprechen?", "Ausbilder:in, Vertrauensperson, JAV/Betriebsrat oder eine zuständige Stelle."],
          ];

    setCompanionMessages((items) => [
      ...items,
      { id: `tool-${Date.now()}`, role: "bot", time: currentTime(), sections },
    ]);
  }

  return (
    <ViewFrame>
      <section className="space-y-5 p-5 lg:p-6">
        <ViewHero icon={LifeBuoy} title="Hilfe" subtitle="Was brauchst du gerade?" />

        <EchteHilfeKontakte />

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-db-dark">Was ist los?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSelected(option);
                  setShown(true);
                }}
                className={`rounded-xl border p-5 text-left text-base font-black ${selected === option ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark hover:bg-red-50 hover:text-db-red"}`}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="mt-5 block">
            <FieldLabel>Optional kurz beschreiben</FieldLabel>
            <textarea className="field min-h-24 resize-y py-3" value={text} onChange={(event) => setText(event.target.value)} placeholder="Du musst keine Namen nennen." />
          </label>
          <button type="button" onClick={() => setShown(true)} className="mt-4 rounded bg-db-red px-5 py-3 font-black text-white hover:bg-red-700">
            Hilfe anzeigen
          </button>
        </div>

        {shown && (
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-db-dark">{selected}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <SectionCard title="Das kannst du jetzt tun" text={help.now} />
              <SectionCard title="Das solltest du vermeiden" text={help.avoid} />
              <SectionCard title="Nächster Schritt" text={help.next} />
              <SectionCard title="Wann echte Hilfe nötig ist" text={help.realHelp} />
            </div>
          </div>
        )}

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <p className="text-lg font-black text-db-dark">Azubi-Begleiter</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">Unten rechts kannst du einfach schreiben, was los ist.</p>
        </div>
      </section>
    </ViewFrame>
  );

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
          <h1 className="text-3xl font-black">Azubi-Kompass</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
            Stell allgemeine Fragen zu Ausbildung, Stress, Konflikten oder Unsicherheit. Der Chat gibt Orientierung, ersetzt aber keine offizielle Beratung.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setTab("hilfe")} className={`rounded-lg px-4 py-3 text-sm font-black ring-1 ${tab === "hilfe" ? "bg-db-red text-white ring-db-red" : "bg-white text-db-dark ring-db-dark/10 hover:bg-red-50 hover:text-db-red"}`}>
            Schnelle Hilfe
          </button>
          <button type="button" onClick={() => setTab("chat")} className={`rounded-lg px-4 py-3 text-sm font-black ring-1 ${tab === "chat" ? "bg-db-red text-white ring-db-red" : "bg-white text-db-dark ring-db-dark/10 hover:bg-red-50 hover:text-db-red"}`}>
            Azubi-Chat
          </button>
          <button type="button" onClick={() => setTab("begleiter")} className={`rounded-lg px-4 py-3 text-sm font-black ring-1 ${tab === "begleiter" ? "bg-db-red text-white ring-db-red" : "bg-white text-db-dark ring-db-dark/10 hover:bg-red-50 hover:text-db-red"}`}>
            Azubi-Begleiter
          </button>
        </div>

        {tab === "hilfe" && (
          <>
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black text-db-dark">Was ist gerade los?</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSelected(option);
                      setShown(false);
                    }}
                    className={`rounded-xl border p-4 text-left font-black ${selected === option ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <label className="mt-5 block">
                <FieldLabel>Beschreibe kurz, was passiert ist</FieldLabel>
                <textarea className="field min-h-28 resize-y py-3" value={text} onChange={(event) => setText(event.target.value)} />
              </label>
              <button type="button" onClick={() => setShown(true)} className="mt-4 rounded bg-db-red px-5 py-3 font-black text-white hover:bg-red-700">
                Hilfe anzeigen
              </button>
            </div>

            {shown && (
              <div className="grid gap-4 md:grid-cols-2">
                <SectionCard title="Was ist los?" text={selected} />
                <SectionCard title="Was du jetzt tun kannst" text={help.now} />
                <SectionCard title="Was du vermeiden solltest" text={help.avoid} />
                <SectionCard title="Nächster Schritt" text={help.next} />
                <SectionCard title="Wann echte Hilfe nötig ist" text={help.realHelp} />
              </div>
            )}
          </>
        )}

        {tab === "chat" && (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black text-db-dark">Azubi-Chat</h2>
              <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">
                Stell allgemeine Fragen zu Ausbildung, Stress, Konflikten oder Unsicherheit. Der Chat gibt Orientierung, ersetzt aber keine offizielle Beratung.
              </p>
              <div className="mt-4 grid gap-2">
                {chatCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setChatCategory(category)}
                    className={`rounded-xl border p-3 text-left text-sm font-black ${chatCategory === category ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="mt-5 block">
                <FieldLabel>Was beschäftigt dich gerade?</FieldLabel>
                <textarea className="field min-h-32 resize-y py-3" value={chatText} onChange={(event) => setChatText(event.target.value)} />
              </label>
              <button type="button" onClick={generateChatResponse} className="mt-4 rounded bg-db-red px-5 py-3 font-black text-white hover:bg-red-700">
                Orientierung bekommen
              </button>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              {chatResponse ? (
                <div className="grid gap-4">
                  <SectionCard title="Was ist los?" text={chatResponse.context} />
                  <SectionCard title="Was kannst du jetzt tun?" text={chatResponse.now} />
                  <SectionCard title="Was solltest du vermeiden?" text={chatResponse.avoid} />
                  <SectionCard title="Nächster Schritt" text={chatResponse.next} />
                  <SectionCard title="Wann echte Hilfe nötig ist" text={chatResponse.realHelp} />
                  <SectionCard title="Passende Funktion in der App" text={chatResponse.feature} />
                </div>
              ) : (
                <p className="rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
                  Wähle ein Thema, schreib kurz deine Frage und klicke auf Orientierung bekommen.
                </p>
              )}
            </div>
          </div>
        )}

        {tab === "begleiter" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 border-b border-db-dark/10 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-db-dark">Azubi-Begleiter</h2>
                  <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">
                    Ein ruhiger KI-Chat für Sorgen, Stress, Konflikte und Unsicherheit in der Ausbildung.
                  </p>
                </div>
                <div className="grid gap-2 text-sm font-semibold leading-6 text-db-rail">
                  <p className="rounded-lg bg-db-soft p-3">Der Azubi-Begleiter ersetzt keine offizielle Beratung, keine psychologische Hilfe und keine Notfallstelle.</p>
                  <p className="rounded-lg bg-red-50 p-3 text-db-red">Wenn du akut in Gefahr bist oder dir selbst etwas antun könntest, hole bitte sofort reale Hilfe.</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {starterChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => sendCompanionMessage(chip)}
                    className="rounded-full bg-db-soft px-3 py-2 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="mt-5 max-h-[30rem] overflow-y-auto rounded-xl bg-db-soft p-4">
                <div className="grid gap-3">
                  {companionMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[86%] rounded-2xl px-4 py-3 shadow-sm ${message.role === "user" ? "bg-db-red text-white" : "bg-white text-db-dark ring-1 ring-db-dark/10"}`}>
                        <p className={`mb-2 text-[11px] font-black ${message.role === "user" ? "text-white/75" : "text-db-rail"}`}>
                          {message.role === "user" ? "Du" : "Azubi-Begleiter"} · {message.time}
                        </p>
                        {message.text ? (
                          <p className="text-sm font-semibold leading-7">{message.text}</p>
                        ) : (
                          <div className="grid gap-3">
                            {message.sections.map(([title, body]) => (
                              <div key={title}>
                                <p className="text-sm font-black">{title}</p>
                                <p className="mt-1 text-sm font-semibold leading-7 opacity-85">{body}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {companionTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-db-rail ring-1 ring-db-dark/10">
                        Azubi-Begleiter schreibt ...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <label>
                  <FieldLabel>Nachricht</FieldLabel>
                  <textarea
                    className="field min-h-24 resize-y py-3"
                    value={companionInput}
                    onChange={(event) => setCompanionInput(event.target.value)}
                    placeholder="Schreib, was dich gerade beschäftigt..."
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                        sendCompanionMessage();
                      }
                    }}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => sendCompanionMessage()} className="rounded bg-db-red px-5 py-3 text-sm font-black text-white hover:bg-red-700">
                    Senden
                  </button>
                  <button type="button" onClick={clearCompanionChat} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                    Chat leeren
                  </button>
                </div>
                <p className="text-sm font-semibold leading-6 text-db-rail">
                  Bitte keine echten Namen oder sensiblen Daten eingeben. Diese Demo ist nur lokal.
                </p>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-db-dark">Nächste Aktion</h3>
                <div className="mt-4 grid gap-2">
                  <button type="button" onClick={() => onNavigate("protokoll")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Vorfall festhalten</button>
                  <button type="button" onClick={() => onNavigate("meldung")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Meldung vorbereiten</button>
                  <button type="button" onClick={() => onNavigate("training")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Training öffnen</button>
                  <button type="button" onClick={() => setTab("hilfe")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Soforthilfe anzeigen</button>
                </div>
              </div>

              <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-db-dark">Gesprächswerkzeuge</h3>
                <div className="mt-4 grid gap-2">
                  <button type="button" onClick={() => addCompanionToolResponse("formal")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Antwort sachlicher formulieren</button>
                  <button type="button" onClick={() => addCompanionToolResponse("talk")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Gespräch vorbereiten</button>
                  <button type="button" onClick={() => addCompanionToolResponse("note")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Als Notiz übernehmen</button>
                </div>
              </div>

              {notePreview && (
                <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-black text-db-dark">Notizvorschau</h3>
                  <p className="mt-3 rounded-lg bg-db-soft p-3 text-sm font-semibold leading-7 text-db-rail">{notePreview}</p>
                  <button type="button" onClick={() => onNavigate("protokoll")} className="mt-3 rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">
                    Zu Vorfall festhalten
                  </button>
                </div>
              )}
            </aside>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onNavigate("protokoll")} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
            Vorfall festhalten
          </button>
          <button type="button" onClick={() => onNavigate("meldung")} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
            Meldung vorbereiten
          </button>
          <button type="button" onClick={() => onNavigate("training")} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
            Training starten
          </button>
        </div>
        <p className="rounded-xl border border-db-dark/10 bg-white p-4 text-sm font-semibold leading-7 text-db-rail shadow-sm">
          Der Azubi-Chat ersetzt keine offizielle Beratung, keine medizinische Hilfe und keine Rechtsberatung. Bei akuter Gefahr bitte sofort reale Hilfe kontaktieren.
        </p>
      </section>
    </ViewFrame>
  );
}

function simpleHelpFor(option) {
  if (option.includes("droht") || option.includes("Angst")) {
    return {
      now: "Geh auf Abstand. Such eine sichere Person oder einen sicheren Ort.",
      avoid: "Nicht provozieren und nicht allein weiterklären.",
      realHelp: "Wenn du dich bedroht fühlst oder Gewalt möglich ist.",
      next: "Sicherheit zuerst. Danach kurz notieren, was passiert ist.",
    };
  }
  if (option.includes("Diskriminierung")) {
    return {
      now: "Atme kurz durch. Wenn möglich: Grenze ruhig benennen und Unterstützung holen.",
      avoid: "Nicht in eine hitzige Diskussion geraten.",
      realHelp: "Wenn du dich unsicher fühlst oder es wiederholt passiert.",
      next: "Sachlich festhalten, was gesagt oder getan wurde.",
    };
  }
  if (option.includes("gemobbt")) {
    return {
      now: "Sprich mit einer Vertrauensperson. Du musst das nicht allein lösen.",
      avoid: "Nicht alles für dich behalten, wenn es dich belastet.",
      realHelp: "Wenn es wiederholt passiert oder dich stark belastet.",
      next: "Notiere Datum, Ort und was passiert ist.",
    };
  }
  if (option.includes("überfordert") || option.includes("weiter")) {
    return {
      now: "Mach kurz langsam. Schreib auf, was gerade am meisten drückt.",
      avoid: "Nicht alles allein aushalten, wenn es zu viel wird.",
      realHelp: "Wenn du Angst hast, zusammenbrichst oder nicht mehr weiterweißt.",
      next: "Sprich mit einer Vertrauensperson oder nutze den Azubi-Begleiter unten rechts.",
    };
  }
  return {
    now: "Bleib ruhig und bring dich nicht in Gefahr.",
    avoid: "Keine Schuldzuweisungen oder wütenden Antworten.",
    realHelp: "Wenn Gefahr, Angst oder starke Belastung entsteht.",
    next: "Du kannst erstmal nur eine Notiz speichern.",
  };
}

function localAzubiChatResponse(message, category) {
  const text = `${message} ${category}`.toLowerCase();
  const realHelp = "Bei Gefahr, starker Belastung oder rechtlichen/gesundheitlichen Fragen echte Fachstellen einbeziehen.";

  if (text.includes("stress") || text.includes("überfordert") || text.includes("schaffe nicht") || text.includes("müde") || text.includes("druck")) {
    return {
      context: "Es klingt nach Stress oder Überforderung.",
      now: "Schreib auf, was gerade zu viel ist. Wähle einen kleinen Schritt für heute.",
      avoid: "Nicht alles allein aushalten oder so tun, als wäre nichts.",
      next: "Sprich mit einer Vertrauensperson oder Ausbilder:in.",
      realHelp,
      feature: "Training & Lernen oder Vorfall festhalten.",
    };
  }

  if (text.includes("ausbilder") || text.includes("chef") || text.includes("vorgesetzter") || text.includes("meister")) {
    return {
      context: "Es geht um ein Problem mit einer verantwortlichen Person.",
      now: "Notiere kurz: Was ist passiert? Wann? Was brauchst du?",
      avoid: "Nicht im Affekt schreiben oder allein eskalieren.",
      next: "Bitte um ein ruhiges Gespräch oder hol Unterstützung.",
      realHelp,
      feature: "Vorfall festhalten, danach bei Bedarf Meldung vorbereiten.",
    };
  }

  if (text.includes("prüfung") || text.includes("lernen") || text.includes("angst") || text.includes("durchfallen")) {
    return {
      context: "Es klingt nach Lern- oder Prüfungsdruck.",
      now: "Teile das Thema in kleine Schritte ein. Starte mit dem wichtigsten Punkt.",
      avoid: "Nicht bis kurz vor der Prüfung warten.",
      next: "Frag früh nach Hilfe bei Ausbilder:in, Berufsschule oder Vertrauensperson.",
      realHelp,
      feature: "Training & Lernen kann dir kurze Übungssituationen und einfache Lernkarten zeigen.",
    };
  }

  if (text.includes("recht") || text.includes("darf") || text.includes("pflicht") || text.includes("arbeitszeit") || text.includes("pause") || text.includes("vertrag")) {
    return {
      context: "Es klingt nach einer rechtlichen oder organisatorischen Frage.",
      now: "Sammle deine Frage sachlich und ohne persönliche Daten.",
      avoid: "Nicht nur auf den Chat verlassen. Er gibt keine Rechtsberatung.",
      next: "Frag eine zuständige Person, JAV/Betriebsrat, HR oder eine offizielle Stelle.",
      realHelp,
      feature: "Nutze Vorfall festhalten, wenn du Fakten für ein späteres Gespräch ordnen möchtest.",
    };
  }

  if (text.includes("mobbing") || text.includes("hass") || text.includes("gewalt") || text.includes("drohung") || text.includes("angst") || text.includes("diskriminiert")) {
    return {
      context: "Das kann belastend oder gefährlich sein.",
      now: "Bring dich in Sicherheit. Notiere danach sachlich, was passiert ist.",
      avoid: "Nicht provozieren und nicht allein weiterklären, wenn du Angst hast.",
      next: "Sprich mit einer Vertrauensperson. Bereite bei Bedarf eine Meldung vor.",
      realHelp: "Bei akuter Gefahr sofort echte Hilfe holen. Die App ist kein Notfallsystem.",
      feature: "Nutze Vorfall festhalten oder Meldung vorbereiten. Bei akuter Gefahr nicht auf die App warten.",
    };
  }

  return {
    context: "Du bist unsicher, wo das Thema hingehört. Das ist okay.",
    now: "Schreib in einfachen Worten auf, was dich beschäftigt.",
    avoid: "Nicht alles in dich hineinfragen, wenn es dich belastet.",
    next: "Wähle einen kleinen Schritt: reden, notieren, üben oder Hilfe holen.",
    realHelp,
    feature: "Training & Lernen oder Vorfall festhalten.",
  };
}

function localAzubiBegleiterResponse(message) {
  const text = message.toLowerCase();

  if (
    text.includes("suizid") ||
    text.includes("selbst verletzen") ||
    text.includes("selbstverletzen") ||
    text.includes("hoffnungslos") ||
    text.includes("depressiv") ||
    text.includes("traurig")
  ) {
    return [
      ["Ich ordne das so ein:", "Das klingt sehr belastend. Damit solltest du nicht allein bleiben."],
      ["Was du jetzt tun kannst:", "Sprich jetzt mit einer realen Person, der du vertraust. Wenn Gefahr besteht, kontaktiere sofort echte Notfallhilfe."],
      ["Ein kleiner nächster Schritt:", "Leg das Handy nicht einfach weg. Such dir jetzt eine Person in deiner Nähe oder ruf Hilfe."],
      ["Wenn es ernster wird:", "Diese App kann keine Krisenhilfe leisten. Bitte hole sofort reale Hilfe."],
    ];
  }

  if (text.includes("angst") || text.includes("panik") || text.includes("bedrohung") || text.includes("gefahr")) {
    return [
      ["Ich ordne das so ein:", "Sicherheit ist jetzt wichtiger als Klärung."],
      ["Was du jetzt tun kannst:", "Geh, wenn möglich, an einen sicheren Ort und hol eine reale Person dazu."],
      ["Ein kleiner nächster Schritt:", "Konfrontiere niemanden allein. Schreib später nur auf, was passiert ist."],
      ["Wenn es ernster wird:", "Bei akuter Gefahr sofort echte Hilfe holen. Die App ist kein Notfallsystem."],
    ];
  }

  if (text.includes("mobbing") || text.includes("beleidigt") || text.includes("ausgeschlossen") || text.includes("fertiggemacht")) {
    return [
      ["Ich ordne das so ein:", "Das sollte ernst genommen werden, besonders wenn es wiederholt passiert."],
      ["Was du jetzt tun kannst:", "Notiere Datum, Uhrzeit, Ort und kurz, was gesagt oder getan wurde."],
      ["Ein kleiner nächster Schritt:", "Nutze Vorfall festhalten oder sprich mit einer Vertrauensperson."],
      ["Wenn es ernster wird:", "Wenn du dich bedroht fühlst oder es dich stark belastet, hole echte Unterstützung."],
    ];
  }

  if (text.includes("stress") || text.includes("überfordert") || text.includes("druck") || text.includes("müde")) {
    return [
      ["Ich ordne das so ein:", "Das klingt nach Überforderung. Das ist ernst zu nehmen, aber du musst nicht alles auf einmal lösen."],
      ["Was du jetzt tun kannst:", "Schreib die drei größten Stresspunkte auf. Markiere nur den wichtigsten für heute."],
      ["Ein kleiner nächster Schritt:", "Sprich mit einer Vertrauensperson, wenn der Druck bleibt."],
      ["Wenn es ernster wird:", "Wenn Schlaf, Gesundheit oder Sicherheit betroffen sind, hole echte Hilfe."],
    ];
  }

  if (text.includes("ausbilder") || text.includes("chef") || text.includes("vorgesetzter") || text.includes("meister")) {
    return [
      ["Ich ordne das so ein:", "Das klingt nach einem Konflikt im Arbeits- oder Ausbildungsumfeld."],
      ["Was du jetzt tun kannst:", "Sammle konkrete Beispiele: Was war? Wann war es? Wer war dabei?"],
      ["Ein kleiner nächster Schritt:", "Bereite ein ruhiges Gespräch vor oder hol eine Vertrauensperson dazu."],
      ["Wenn es ernster wird:", "Wenn es wiederholt, demütigend oder bedrohlich ist, nutze Vorfall festhalten."],
    ];
  }

  if (text.includes("prüfung") || text.includes("lernen") || text.includes("durchfallen")) {
    return [
      ["Ich ordne das so ein:", "Das klingt nach Prüfungs- oder Lerndruck."],
      ["Was du jetzt tun kannst:", "Teile den Stoff in kleine Blöcke. Starte mit 20 Minuten für ein Thema."],
      ["Ein kleiner nächster Schritt:", "Frag früh nach Unterstützung, bevor es zu viel wird."],
      ["Wenn es ernster wird:", "Wenn Angst oder Druck sehr stark werden, sprich mit einer realen Ansprechperson."],
    ];
  }

  if (text.includes("recht") || text.includes("darf") || text.includes("pflicht") || text.includes("pause") || text.includes("arbeitszeit")) {
    return [
      ["Ich ordne das so ein:", "Das klingt nach einer rechtlichen oder organisatorischen Frage."],
      ["Was du jetzt tun kannst:", "Sammle die Frage sachlich. Der Chat gibt keine Rechtsberatung."],
      ["Ein kleiner nächster Schritt:", "Frag eine zuständige Person, JAV/Betriebsrat, HR oder eine offizielle Beratungsstelle."],
      ["Wenn es ernster wird:", "Wenn Sicherheit oder Gesundheit betroffen sind, hole sofort echte Unterstützung."],
    ];
  }

  return [
    ["Ich ordne das so ein:", "Du musst noch nicht genau wissen, wie du es nennen sollst."],
    ["Was du jetzt tun kannst:", "Schreib in einfachen Worten auf, was passiert ist oder was dich belastet."],
    ["Ein kleiner nächster Schritt:", "Wähle eins: kurz reden, Vorfall festhalten, Meldung vorbereiten oder Training öffnen."],
    ["Wenn es ernster wird:", "Bei Gefahr, starker Belastung oder rechtlichen/gesundheitlichen Fragen echte Hilfe holen."],
  ];
}

async function exportRecordPdf({ subtitle, title, fields, footerNote, fileName }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;

  // Kopfbalken in DB-Verkehrsrot
  doc.setFillColor(226, 0, 26);
  doc.rect(0, 0, pageW, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("DB Peace AI", margin, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(subtitle, margin, 19);

  let y = 38;
  doc.setTextColor(31, 35, 40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, margin, y);
  y += 9;

  const ensureSpace = () => {
    if (y > pageH - 28) {
      doc.addPage();
      y = margin + 6;
    }
  };

  doc.setFontSize(11);
  fields.forEach(([label, value]) => {
    ensureSpace();
    doc.setFont("helvetica", "bold");
    doc.setTextColor(58, 63, 69);
    doc.text(label, margin, y);
    y += 5.5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 35, 40);
    const text = value != null && String(value).trim() ? String(value) : "—";
    doc.splitTextToSize(text, contentW).forEach((line) => {
      ensureSpace();
      doc.text(line, margin, y);
      y += 5.5;
    });
    y += 3;
  });

  doc.setFontSize(8.5);
  doc.setTextColor(130, 130, 130);
  doc.text(doc.splitTextToSize(footerNote, contentW), margin, pageH - 14);

  doc.save(fileName);
}

function SimpleVorfallView({ onNavigate, onSaveProtocol, onDeleteProtocol, onUseAsReport, protocols, onNotify, onDirtyChange, onResetDirty, onRequestConfirm }) {
  const [note, setNote] = useState(() => emptyProtocol());
  const [tab, setTab] = useState("new");
  const [summary, setSummary] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [selectedId, setSelectedId] = useState(null);
  const [historySummary, setHistorySummary] = useState("");
  const [highlightedId, setHighlightedId] = useState(null);
  const [copyFallback, setCopyFallback] = useState("");
  const highlightTimerRef = useRef(null);
  const entryCategories = ["Beleidigung", "Mobbing", "Diskriminierung", "Drohung / Gewalt", "Konflikt", "Stress / Überforderung", "Sonstiges"];
  const evidenceOptions = ["Chatnachricht", "Screenshot", "E-Mail", "Zeuge", "Foto", "Keine", "Sonstiges"];
  const entries = protocols.filter((item) => item.status !== "Gelöscht");
  const filtered = entries.filter((item) => {
    const haystack = [item.id, item.date, item.type, item.location, item.description, item.risk].join(" ").toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    const evidenceCount = Array.isArray(item.evidence) ? item.evidence.filter((value) => value && value !== "Keine").length : 0;
    const matchesFilter =
      activeFilter === "Alle" ||
      (activeFilter === "Hohe Belastung" && Number(item.burden) >= 4) ||
      (activeFilter === "Mit Hinweisen/Beweisen" && evidenceCount > 0) ||
      (activeFilter === "Wiederholt" && item.repetition !== "Einmalig") ||
      (activeFilter === "Drohung/Gewalt" && item.type === "Drohung / Gewalt");
    return matchesSearch && matchesFilter;
  });
  const selected = entries.find((item) => item.id === selectedId) || null;

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  function update(field, value) {
    setNote((current) => ({ ...current, [field]: value }));
    onDirtyChange?.(true);
  }

  function toggleEvidence(value) {
    setNote((current) => {
      const evidence = Array.isArray(current.evidence) ? current.evidence : [];
      const next = evidence.includes(value) ? evidence.filter((item) => item !== value) : [...evidence.filter((item) => item !== "Keine" || value === "Keine"), value];
      return { ...current, evidence: value === "Keine" ? ["Keine"] : next.filter((item) => item !== "Keine") };
    });
    onDirtyChange?.(true);
  }

  function entryRisk(item) {
    if (item.danger === "Ja" || item.danger === "Ja, direkte Gefahr" || item.type === "Drohung / Gewalt") return "Hoch";
    if (Number(item.burden) >= 4 || item.danger === "Unsicher") return "Mittel";
    return "Niedrig";
  }

  function entryId() {
    const count = protocols.filter((item) => String(item.id || "").startsWith("EINTRAG-")).length + 1;
    return `EINTRAG-${String(count).padStart(3, "0")}`;
  }

  function evidenceText(item) {
    const evidence = Array.isArray(item.evidence) ? item.evidence : [];
    return evidence.length ? evidence.join(", ") : "Keine Angabe";
  }

  function hasEvidence(item) {
    return Array.isArray(item.evidence) && item.evidence.some((value) => value && value !== "Keine");
  }

  function attachmentsFor(item) {
    return Array.isArray(item.attachments) ? item.attachments.filter((file) => file && typeof file === "object") : [];
  }

  function attachmentKind(file) {
    const type = String(file.type || "");
    if (type.startsWith("image/")) return "Foto";
    if (type.startsWith("audio/")) return "Audio";
    if (type.startsWith("video/")) return "Video";
    return file.category || "Datei";
  }

  function attachmentSummary(item) {
    const files = attachmentsFor(item);
    if (!files.length) return "Keine Dateien";
    const counts = files.reduce((map, file) => {
      const kind = attachmentKind(file);
      map[kind] = (map[kind] || 0) + 1;
      return map;
    }, {});
    return Object.entries(counts).map(([kind, count]) => `${count} ${kind}${count === 1 ? "" : "s"}`).join(", ");
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  }

  async function addFiles(fileList, category) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const imageLimit = 2 * 1024 * 1024;
    const smallMediaLimit = 600 * 1024;
    const next = await Promise.all(files.map(async (file) => {
      const isImage = file.type.startsWith("image/");
      const isAudio = file.type.startsWith("audio/");
      const isVideo = file.type.startsWith("video/");
      const canPersist = (isImage && file.size <= imageLimit) || ((isAudio || isVideo) && file.size <= smallMediaLimit);
      const sessionUrl = URL.createObjectURL(file);
      const previewData = canPersist ? await readFileAsDataUrl(file) : "";
      return {
        id: `DATEI-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        type: file.type || "Unbekannt",
        size: file.size,
        category,
        previewData,
        sessionUrl,
        status: canPersist ? "lokal gespeichert" : "nur Sitzung / Original separat sichern",
      };
    }));
    setNote((current) => ({ ...current, attachments: [...attachmentsFor(current), ...next] }));
    onDirtyChange?.(true);
    if (next.some((file) => file.status !== "lokal gespeichert")) {
      onNotify?.("Große Datei nur für diese Sitzung vorgemerkt");
    }
  }

  function removeAttachment(fileId) {
    setNote((current) => ({ ...current, attachments: attachmentsFor(current).filter((file) => file.id !== fileId) }));
    onDirtyChange?.(true);
  }

  function shortDescription(item) {
    const text = String(item.description || "").trim();
    return text.length > 135 ? `${text.slice(0, 135)}...` : text || "Keine Beschreibung";
  }

  function autoSummary(item) {
    const description = String(item.description || "").trim();
    const firstSentences = description
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .join(" ");
    const base = `Am ${item.date || "offenen Datum"} um ${item.time || "offener Uhrzeit"} wurde im Kontext ${item.location || "Ort offen"} ein Vorfall der Kategorie ${item.type || "Sonstiges"} festgehalten. Die Belastung wurde mit ${item.burden || "?"}/5 angegeben. Hinweise/Beweise: ${hasEvidence(item) || attachmentsFor(item).length ? "ja" : "nein"}.`;
    return firstSentences ? `${base}\n\nKurzbeschreibung: ${firstSentences}` : base;
  }

  function shareText(item) {
    return [
      "DB Peace AI – Lokaler Demo-Eintrag",
      "",
      `ID: ${item.id || "Noch nicht gespeichert"}`,
      `Datum: ${item.date || "Keine Angabe"}`,
      `Uhrzeit: ${item.time || "Keine Angabe"}`,
      `Ort/Kontext: ${item.location || "Keine Angabe"}`,
      `Kategorie: ${item.type || "Sonstiges"}`,
      `Belastung: ${item.burden || "?"}/5`,
      `Akute Gefahr: ${item.danger || "Keine Angabe"}`,
      `Beschreibung: ${item.description || "Keine Beschreibung"}`,
      `Hinweise/Beweise: ${evidenceText(item)}`,
      `Hinweise/Dateien: ${attachmentSummary(item)}`,
      `Zusammenfassung: ${autoSummary(item).replace(/\n+/g, " ")}`,
      "",
      "Hinweis: Dieser Text wurde lokal im Demo-Prototyp erstellt und nicht automatisch übermittelt. Originaldateien wurden nicht automatisch übermittelt.",
    ].join("\n");
  }

  function summaryFor(item) {
    const evidence = evidenceText(item);
    return [
      `Kurzfassung: ${item.description || "Vorfall noch nicht beschrieben."}`,
      `Wichtige Fakten: ${item.date} ${item.time}, ${item.location || "Ort offen"}, Kategorie ${item.type}.`,
      `Zeitraum / Datum: ${item.date || "offen"}.`,
      `Vorhandene Hinweise: ${evidence}.`,
      `Mögliche nächste Schritte: sachlich weiter dokumentieren, Vertrauensperson einbeziehen oder Meldung vorbereiten.`,
      "Diese Zusammenfassung ist nur eine sachliche Hilfe für Gespräche, Meldungen oder spätere Klärung. Sie ersetzt keine rechtliche Beratung.",
    ].join("\n");
  }

  function summarize() {
    const text = summaryFor(note);
    setSummary(text);
    setNote((current) => ({ ...current, aiSummary: text }));
  }

  function summarizeSelected(item) {
    const selectedNote = normalizeProtocol(item);
    const text = summaryFor(selectedNote);
    setNote({ ...selectedNote, aiSummary: text });
    setSummary(text);
    setTab("new");
  }

  function save() {
    if (!note.description.trim()) {
      onNotify?.("Bitte kurz beschreiben, was passiert ist.");
      return;
    }

    const isExisting = Boolean(note.id);
    const id = note.id || entryId();
    onSaveProtocol({
      ...note,
      id,
      risk: entryRisk(note),
      type: note.type || "Sonstiges",
      updatedAt: nowStamp(),
      createdAt: note.createdAt || nowStamp(),
    });
    setNote(emptyProtocol());
    setSummary("");
    setCopyFallback("");
    onDirtyChange?.(false);
    onResetDirty?.();
    setTab("history");
    setSelectedId(id);
    setHighlightedId(id);
    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
    }
    highlightTimerRef.current = window.setTimeout(() => setHighlightedId(null), 1800);
    onNotify?.(isExisting ? "Eintrag aktualisiert" : "Eintrag lokal gespeichert");
  }

  function open(item) {
    setNote(normalizeProtocol(item));
    setSummary(item.aiSummary || "");
    setCopyFallback("");
    setSelectedId(item.id);
  }

  function edit(item) {
    open(item);
    setTab("new");
  }

  function remove(item) {
    onRequestConfirm?.({
      title: "Diesen lokalen Demo-Eintrag wirklich löschen?",
      message: "Der Eintrag wird nur aus der lokalen Demo entfernt.",
      confirmLabel: "Löschen",
      cancelLabel: "Abbrechen",
      onConfirm: () => {
        onDeleteProtocol(item.id);
        if (selectedId === item.id) setSelectedId(null);
        setCopyFallback("");
        onNotify?.("Eintrag gelöscht");
      },
    });
  }

  function prepareReport(item = note) {
    if (!item.description?.trim()) {
      onNotify?.("Bitte erst kurz beschreiben, was passiert ist.");
      return;
    }

    onDirtyChange?.(false);
    onResetDirty?.();
    onUseAsReport(item);
  }

  function exportEntryPdf(item) {
    exportRecordPdf({
      subtitle: "Vorfall-Dokumentation",
      title: `Eintrag ${item.id || "(nicht gespeichert)"}`,
      fields: [
        ["Datum", item.date],
        ["Uhrzeit", item.time],
        ["Ort / Kontext", item.location],
        ["Kategorie", item.type],
        ["Belastung", item.burden ? `${item.burden} / 5` : "—"],
        ["Akute Gefahr", item.danger],
        ["Beschreibung", item.description],
      ],
      footerNote:
        "Lokal im DB Peace AI Demo-Prototyp erstellt und nicht automatisch übermittelt. Diese Dokumentation ist eine sachliche Hilfe für Gespräche oder Meldungen und ersetzt keine rechtliche Beratung.",
      fileName: `DB-Peace-AI_${item.id || "Eintrag"}.pdf`,
    })
      .then(() => onNotify?.("PDF erstellt"))
      .catch(() => onNotify?.("PDF konnte nicht erstellt werden"));
  }

  function copyEntry(item) {
    const text = shareText(item);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopyFallback("");
          onNotify?.("Eintrag kopiert");
        },
        () => {
          setCopyFallback(text);
          onNotify?.("Text zum Kopieren vorbereitet");
        }
      );
      return;
    }
    setCopyFallback(text);
    onNotify?.("Text zum Kopieren vorbereitet");
  }

  function shareEntry(item) {
    const text = shareText(item);
    if (navigator.share) {
      navigator.share({ title: "DB Peace AI – Lokaler Demo-Eintrag", text }).catch(() => {
        copyEntry(item);
      });
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopyFallback("");
          onNotify?.("Text zum Teilen kopiert");
        },
        () => {
          setCopyFallback(text);
          onNotify?.("Text zum Teilen vorbereitet");
        }
      );
      return;
    }
    setCopyFallback(text);
    onNotify?.("Text zum Teilen vorbereitet");
  }

  function summarizeHistory() {
    if (entries.length === 0) {
      setHistorySummary("Noch keine Einträge im Verlauf.");
      return;
    }
    const dates = entries.map((item) => item.date).filter(Boolean).sort();
    const mostCommon = mostCommonValue(entries.map((item) => item.type));
    const highest = Math.max(...entries.map((item) => Number(item.burden) || 0));
    const repeated = entries.filter((item) => item.repetition && item.repetition !== "Einmalig").length;
    const evidenceCount = entries.filter((item) => Array.isArray(item.evidence) && item.evidence.some((value) => value !== "Keine")).length;
    setHistorySummary([
      `Anzahl Einträge: ${entries.length}`,
      `Zeitraum: ${dates[0] || "offen"} bis ${dates[dates.length - 1] || "offen"}`,
      `Häufigste Kategorie: ${mostCommon}`,
      `Höchste Belastung: ${highest}/5`,
      `Wiederholte Situationen: ${repeated}`,
      `Vorhandene Hinweise: ${evidenceCount} Eintrag/Einträge`,
      "Nächster sinnvoller Schritt: Verlauf prüfen, sachlich ergänzen und bei Bedarf Unterstützung oder Meldung vorbereiten.",
    ].join("\n"));
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <ViewHero icon={NotebookPen} title="Vorfall festhalten" subtitle="Sachliche Dokumentation für Gespräche, Meldungen oder spätere Klärung. Du musst keine echten Namen nennen." />

        <div className="flex flex-wrap gap-2">
          {["Neuer Eintrag", "Verlauf"].map((label) => {
            const id = label === "Neuer Eintrag" ? "new" : "history";
            return (
              <button key={id} type="button" onClick={() => setTab(id)} className={`rounded-lg px-4 py-3 text-sm font-black ring-1 ${tab === id ? "bg-db-red text-white ring-db-red" : "bg-white text-db-dark ring-db-dark/10 hover:bg-red-50 hover:text-db-red"}`}>
                {label}
              </button>
            );
          })}
        </div>

        {tab === "new" && (
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <label><FieldLabel>Datum</FieldLabel><input className="field" type="date" value={note.date} onChange={(event) => update("date", event.target.value)} /></label>
              <label><FieldLabel>Uhrzeit</FieldLabel><input className="field" type="time" value={note.time} onChange={(event) => update("time", event.target.value)} /></label>
              <ReportInput label="Ort / Kontext" value={note.location} onChange={(value) => update("location", value)} />
              <label><FieldLabel>Kategorie</FieldLabel><select className="field" value={note.type} onChange={(event) => update("type", event.target.value)}>{entryCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><FieldLabel>Ist es einmalig oder wiederholt?</FieldLabel><select className="field" value={note.repetition} onChange={(event) => update("repetition", event.target.value)}>{protocolRepetition.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><FieldLabel>Gibt es akute Gefahr?</FieldLabel><select className="field" value={note.danger} onChange={(event) => update("danger", event.target.value)}>{["Nein", "Unsicher", "Ja"].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="md:col-span-2"><FieldLabel>Was ist passiert?</FieldLabel><textarea className="field min-h-36 resize-y py-3" value={note.description} onChange={(event) => update("description", event.target.value)} /></label>
              <p className="text-sm font-semibold leading-6 text-db-rail md:col-span-2">Beschreibe sachlich, was passiert ist. Du musst keine echten Namen nennen.</p>
              <div className="md:col-span-2">
                <FieldLabel>Gibt es Hinweise oder Beweise?</FieldLabel>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {evidenceOptions.map((item) => (
                    <label key={item} className="flex items-center gap-2 rounded-lg bg-db-soft p-3 text-sm font-black text-db-dark">
                      <input type="checkbox" checked={(note.evidence || []).includes(item)} onChange={() => toggleEvidence(item)} className="h-4 w-4 accent-db-red" />
                      {item}
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-db-rail">Screenshots oder Nachrichten können später hilfreich sein. Bitte keine sensiblen Daten unnötig eingeben. Originale sicher aufbewahren. Die App prüft keine Echtheit von Beweisen.</p>
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Hinweise / Dateien hinzufügen</FieldLabel>
                <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">
                  Du kannst Fotos, Audio oder Videos als lokalen Demo-Hinweis hinzufügen. Die App prüft keine Echtheit und übermittelt nichts.
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {[
                    ["Fotos/Bilder", "image/*", "Foto"],
                    ["Audio", "audio/*", "Audio"],
                    ["Video", "video/*", "Video"],
                  ].map(([label, accept, category]) => (
                    <label key={label} className="rounded-xl bg-db-soft p-4 text-sm font-black text-db-dark ring-1 ring-db-dark/10">
                      {label}
                      <input
                        className="mt-3 block w-full text-xs font-semibold text-db-rail file:mr-3 file:rounded file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-black file:text-db-dark"
                        type="file"
                        accept={accept}
                        multiple
                        onChange={(event) => {
                          addFiles(event.target.files, category);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-db-rail">
                  Große Video- oder Audiodateien können in einer lokalen Demo nicht dauerhaft gespeichert werden. Originaldateien bitte sicher separat aufbewahren.
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-db-rail">
                  Bitte lade keine sensiblen Dateien hoch, wenn du dir unsicher bist. Diese Demo ist nicht für echte Beweissicherung gedacht.
                </p>
                {attachmentsFor(note).length > 0 && (
                  <div className="mt-4 grid gap-3">
                    {attachmentsFor(note).map((file) => (
                      <AttachmentPreview key={file.id} file={file} onRemove={() => removeAttachment(file.id)} />
                    ))}
                  </div>
                )}
              </div>
              <label><FieldLabel>Wie belastend ist es? {note.burden}/5</FieldLabel><input className="w-full accent-db-red" type="range" min="1" max="5" value={note.burden} onChange={(event) => update("burden", Number(event.target.value))} /></label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={summarize} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Sachlich zusammenfassen</button>
              <button type="button" onClick={save} className="rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">{note.id ? "Änderungen speichern" : "Lokal speichern"}</button>
              <button type="button" onClick={prepareReport} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Zur Meldung übernehmen</button>
              {note.id && <button type="button" onClick={() => { setNote(emptyProtocol()); setSummary(""); setTab("history"); onDirtyChange?.(false); onResetDirty?.(); }} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Abbrechen</button>}
              {note.id && <button type="button" onClick={() => { setNote(emptyProtocol()); setSummary(""); onDirtyChange?.(false); onResetDirty?.(); }} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Neuer leerer Eintrag</button>}
            </div>
            {summary && <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">{summary}</pre>}
            <p className="mt-4 text-sm font-semibold leading-6 text-db-rail">Nur lokal im Demo-Prototyp gespeichert. Keine echte Übermittlung.</p>
          </div>
        )}

        {tab === "history" && (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-black text-db-dark">Verlauf</h2>
              <button type="button" onClick={summarizeHistory} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Verlauf zusammenfassen</button>
            </div>
            <input className="field mt-4" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Verlauf durchsuchen..." />
            {historySummary && <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">{historySummary}</pre>}
            <div className="mt-4 grid gap-3">
              {entries.length === 0 ? (
                <div className="rounded-xl bg-db-soft p-4">
                  <p className="text-sm font-semibold leading-7 text-db-rail">Noch keine Einträge gespeichert.</p>
                  <button type="button" onClick={() => setTab("new")} className="mt-3 rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Neuen Eintrag erstellen</button>
                </div>
              ) : filtered.length === 0 ? (
                <p className="rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">Keine passenden Einträge gefunden.</p>
              ) : filtered.map((item) => (
                <article
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => open(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      open(item);
                    }
                  }}
                  className={`cursor-pointer rounded-xl p-4 transition ${highlightedId === item.id ? "bg-red-50 ring-2 ring-db-red/30" : selectedId === item.id ? "bg-red-50 ring-1 ring-db-red/20" : "bg-db-soft hover:bg-red-50"}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-db-dark">{item.id}</p>
                    <span className={`rounded px-2 py-1 text-xs font-black ${entryRisk(item) === "Hoch" ? "bg-red-50 text-db-red" : entryRisk(item) === "Mittel" ? "bg-amber-50 text-amber-700" : "bg-white text-db-rail"}`}>{entryRisk(item)}</span>
                    {hasEvidence(item) && <span className="rounded bg-white px-2 py-1 text-xs font-black text-db-rail">Hinweise</span>}
                    {attachmentsFor(item).length > 0 && <span className="rounded bg-white px-2 py-1 text-xs font-black text-db-rail">{attachmentsFor(item).length} Hinweise</span>}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-db-rail">{item.date || "Datum offen"} · {item.time || "Uhrzeit offen"}</p>
                  <p className="mt-1 text-sm font-semibold text-db-rail">{item.type || "Sonstiges"} · {item.location || "Ort offen"} · Belastung {item.burden}/5</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{shortDescription(item)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionButton label="Öffnen" onClick={() => open(item)} />
                    <ActionButton label="Bearbeiten" onClick={() => edit(item)} />
                    <ActionButton label="Löschen" onClick={() => remove(item)} />
                    <ActionButton label="Zur Meldung übernehmen" onClick={() => prepareReport(item)} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-db-dark">Eintrag ansehen</h2>
            {!selected ? (
              <p className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold text-db-rail">Wähle einen Eintrag aus, um Details zu sehen.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl bg-db-soft p-4">
                  <p className="text-lg font-black text-db-dark">Zusammenfassung</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-7 text-db-rail">{autoSummary(selected)}</p>
                  <p className="mt-3 text-xs font-semibold leading-5 text-db-rail">Diese Zusammenfassung ist nur eine sachliche Hilfe für Gespräche, Meldungen oder spätere Klärung.</p>
                </div>
                <PreviewRow label="ID" value={selected.id} />
                <PreviewRow label="Datum / Uhrzeit" value={`${selected.date} / ${selected.time}`} />
                <PreviewRow label="Ort / Kontext" value={selected.location || "Keine Angabe"} />
                <PreviewRow label="Kategorie" value={selected.type || "Sonstiges"} />
                <PreviewRow label="Beschreibung" value={selected.description || "Keine Beschreibung"} />
                <PreviewRow label="Betroffene optional" value={selected.affected || "Keine Angabe"} />
                <PreviewRow label="Zeugen optional" value={selected.witnesses || "Keine Angabe"} />
                <PreviewRow label="Hinweise / Beweise" value={evidenceText(selected)} />
                <div className="rounded-xl bg-db-soft p-4">
                  <p className="text-lg font-black text-db-dark">Hinweise / Dateien</p>
                  {attachmentsFor(selected).length === 0 ? (
                    <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">Keine Dateien hinzugefügt.</p>
                  ) : (
                    <div className="mt-3 grid gap-3">
                      {attachmentsFor(selected).map((file) => (
                        <AttachmentPreview key={file.id} file={file} />
                      ))}
                    </div>
                  )}
                  <p className="mt-3 text-xs font-semibold leading-5 text-db-rail">Die App prüft keine Echtheit von Dateien. Originale sicher separat aufbewahren.</p>
                </div>
                <PreviewRow label="Wiederholung" value={selected.repetition || "Keine Angabe"} />
                <PreviewRow label="Belastung" value={`${selected.burden}/5`} />
                <PreviewRow label="Akute Gefahr" value={selected.danger || "Keine Angabe"} />
                <PreviewRow label="Anonymitätsstatus" value={selected.anonymous === false ? "Nicht anonym markiert" : "Anonym / ohne echte Namen möglich"} />
                <PreviewRow label="Erstellt am" value={formatDateTime(selected.createdAt)} />
                <PreviewRow label="Letzte Änderung" value={formatDateTime(selected.updatedAt)} />
                {selected.aiSummary && <pre className="whitespace-pre-wrap rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">{selected.aiSummary}</pre>}
                <div className="flex flex-wrap gap-2">
                  <ActionButton label="Kopieren" onClick={() => copyEntry(selected)} />
                  <ActionButton label="Teilen" onClick={() => shareEntry(selected)} />
                  <ActionButton label="Als PDF" onClick={() => exportEntryPdf(selected)} />
                  <ActionButton label="Bearbeiten" onClick={() => edit(selected)} />
                  <ActionButton label="Löschen" onClick={() => remove(selected)} />
                  <ActionButton label="Zur Meldung übernehmen" onClick={() => prepareReport(selected)} />
                </div>
                {copyFallback && <textarea className="field min-h-40 resize-y py-3" value={copyFallback} readOnly />}
                <p className="rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">Es wird nichts automatisch übermittelt.</p>
              </div>
            )}
          </div>
        </div>
        )}
      </section>
    </ViewFrame>
  );
}

function MeldewegeHinweis() {
  const dbGruppe = hilfeKontaktGruppen.find((gruppe) => gruppe.titel === "Bei der Deutschen Bahn");
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Send size={18} className="text-db-red" aria-hidden="true" />
        <h2 className="text-xl font-black text-db-dark">Wohin mit deiner Meldung?</h2>
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">
        Diese App sendet nichts. Deine fertige Meldung gibst du selbst an eine echte Stelle weiter – du entscheidest, an welche:
      </p>
      <div className="mt-4 space-y-2">
        {dbGruppe?.kontakte.map((kontakt) => (
          <KontaktZeile key={`${kontakt.label}-${kontakt.tel ?? "vorort"}`} {...kontakt} />
        ))}
      </div>
      <p className="mt-3 text-[11px] font-semibold leading-5 text-db-rail">
        Bei akuter Gefahr zählt jede Sekunde: Notruf 112. DB-interne Kontakte vor dem Einsatz im Intranet verifizieren.
      </p>
    </div>
  );
}

function SimpleMeldenView({ reportDraft, reportDrafts, setReportDrafts, onNotify, onDirtyChange, onResetDirty }) {
  const [mode, setMode] = useState("Entwurf");
  const [draft, setDraft] = useState(() => emptyReportDraft());
  const [preview, setPreview] = useState(null);
  const [copyText, setCopyText] = useState("");

  useEffect(() => {
    if (!reportDraft) return;
    setDraft((current) => ({
      ...current,
      category: reportDraft.category || current.category,
      description: reportDraft.shortSummary || reportDraft.note || current.description,
      date: reportDraft.details?.date || current.date,
      time: reportDraft.details?.time || current.time,
      location: reportDraft.details?.location || current.location,
      danger: reportDraft.risk === "Hoch" ? "Ja, es könnte eskalieren" : current.danger,
    }));
    setMode("Entwurf");
  }, [reportDraft]);

  const risk = reportRisk(draft);
  const checks = reportCompleteness(draft);
  const nextStep = draft.danger === "Ja, direkte Gefahr" ? "Bei Gefahr bitte sofort echte Hilfe holen." : "Mit Vertrauensperson oder zuständiger Stelle prüfen.";

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    onDirtyChange?.(true);
  }

  function makePreview() {
    if (!draft.description.trim()) {
      onNotify?.("Bitte erst kurz beschreiben, was passiert ist.");
      return;
    }

    setPreview({ caseNumber: draft.caseNumber || createReportCaseNumber(reportDrafts), mode, risk, nextStep });
    onNotify?.("Meldungsvorschau erstellt");
  }

  function save() {
    if (!draft.description.trim()) {
      onNotify?.("Bitte erst kurz beschreiben, was passiert ist.");
      return;
    }

    const id = draft.id || createReportCaseNumber(reportDrafts);
    const saved = normalizeReportDraft({ ...draft, id, caseNumber: id, mode: mode.toLowerCase(), risk, nextStep, updatedAt: nowStamp() });
    setReportDrafts((items) => [saved, ...items.filter((item) => item.id !== id)]);
    setDraft(saved);
    setPreview({ caseNumber: id, mode, risk, nextStep });
    onDirtyChange?.(false);
    onResetDirty?.();
    onNotify?.("Entwurf lokal gespeichert");
  }

  function reset() {
    setMode("Entwurf");
    setDraft(emptyReportDraft());
    setPreview(null);
    setCopyText("");
    onDirtyChange?.(false);
    onResetDirty?.();
  }

  function copy() {
    const text = [
      `Demo-Fallnummer: ${preview?.caseNumber || "Noch nicht erstellt"}`,
      `Modus: ${mode}`,
      `Kategorie: ${draft.category}`,
      `Risiko: ${risk}`,
      `Kurzbeschreibung: ${draft.description || "Noch offen"}`,
      `Nächster Schritt: ${nextStep}`,
      "Nicht übermittelt - nur lokale Demo.",
    ].join("\n");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => onNotify?.("Text kopiert"), () => setCopyText(text));
    } else {
      setCopyText(text);
    }
  }

  function exportMeldungPdf() {
    exportRecordPdf({
      subtitle: "Meldung (Vorbereitung)",
      title: `Meldung ${preview?.caseNumber || draft.caseNumber || "(Entwurf)"}`,
      fields: [
        ["Modus", mode],
        ["Art des Vorfalls", draft.category],
        ["Dringlichkeit / Risiko", risk],
        ["Datum", draft.date],
        ["Uhrzeit", draft.time],
        ["Ort", draft.location],
        ["Wie oft", draft.repetition],
        ["Beschreibung", draft.description],
        ["Wer betroffen", draft.affected],
        ["Nächster Schritt", nextStep],
      ],
      footerNote:
        "Lokal im DB Peace AI Demo-Prototyp vorbereitet. Diese App übermittelt nichts automatisch – du gibst die Meldung selbst an eine zuständige Stelle weiter. Ersetzt keine rechtliche Beratung.",
      fileName: `DB-Peace-AI_Meldung_${preview?.caseNumber || "Entwurf"}.pdf`,
    })
      .then(() => onNotify?.("PDF erstellt"))
      .catch(() => onNotify?.("PDF konnte nicht erstellt werden"));
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <ViewHero icon={Megaphone} title="Meldung vorbereiten" subtitle="Diese Demo übermittelt nichts. Du bereitest nur eine klare Vorschau vor." />

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-db-dark">Wie möchtest du die Meldung vorbereiten?</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Anonym", "Persönlich", "Entwurf"].map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-xl border p-5 text-left text-lg font-black ${mode === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <label><FieldLabel>Art des Vorfalls</FieldLabel><select className="field" value={draft.category} onChange={(event) => update("category", event.target.value)}>{reportTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><FieldLabel>Dringlichkeit</FieldLabel><select className="field" value={draft.danger} onChange={(event) => update("danger", event.target.value)}>{protocolDangerOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><FieldLabel>Datum</FieldLabel><input className="field" type="date" value={draft.date} onChange={(event) => update("date", event.target.value)} /></label>
              <label><FieldLabel>Uhrzeit</FieldLabel><input className="field" type="time" value={draft.time} onChange={(event) => update("time", event.target.value)} /></label>
              <ReportInput label="Ort" value={draft.location} onChange={(value) => update("location", value)} />
              <label><FieldLabel>Wie oft?</FieldLabel><select className="field" value={draft.repetition} onChange={(event) => update("repetition", event.target.value)}>{protocolRepetition.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="md:col-span-2"><FieldLabel>Beschreibung</FieldLabel><textarea className="field min-h-36 resize-y py-3" value={draft.description} onChange={(event) => update("description", event.target.value)} /></label>
              <ReportInput label="Wer betroffen?" value={draft.affected} onChange={(value) => update("affected", value)} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={makePreview} className="rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Meldungsvorschau erstellen</button>
              <button type="button" onClick={copy} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Text kopieren</button>
              <button type="button" onClick={exportMeldungPdf} className="rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Als PDF speichern</button>
              <button type="button" onClick={save} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Entwurf speichern</button>
              <button type="button" onClick={reset} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Neue Meldung</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-db-dark">Checkliste</h2>
              <div className="mt-4 grid gap-2">
                {checks.map(([label, filled]) => <p key={label} className={`rounded-lg p-3 text-sm font-black ${filled ? "bg-emerald-50 text-emerald-700" : "bg-db-soft text-db-rail"}`}>{label}</p>)}
              </div>
            </div>
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-db-dark">Vorschau</h2>
              {preview ? (
                <div className="mt-4 grid gap-3">
                  <PreviewRow label="Demo-Fallnummer" value={preview.caseNumber} />
                  <PreviewRow label="Modus" value={mode} />
                  <PreviewRow label="Kategorie" value={draft.category} />
                  <PreviewRow label="Risiko" value={risk} />
                  <PreviewRow label="Kurzbeschreibung" value={draft.description || "Noch offen"} />
                  <PreviewRow label="Nächster Schritt" value={nextStep} />
                  <p className="rounded-lg bg-db-soft p-3 text-sm font-black text-db-rail">Nicht übermittelt – nur lokale Demo.</p>
                </div>
              ) : <p className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold text-db-rail">Erstelle zuerst eine Vorschau.</p>}
            </div>
            <MeldewegeHinweis />
            {copyText && <textarea className="field min-h-32 resize-y py-3" value={copyText} readOnly />}
          </div>
        </div>
      </section>
    </ViewFrame>
  );
}

const praeventionsAngebote = [
  {
    gruppe: "Bei der Deutschen Bahn",
    icon: Building2,
    angebote: [
      {
        name: "DB Lernwelt",
        titel: "Trainings zu Vielfalt & Unconscious Bias",
        info: "Interne Lernangebote für Azubis und Mitarbeitende rund um Respekt, Vielfalt und Umgang mit Diskriminierung.",
        linkLabel: "Im DB-Intranet",
        link: null,
      },
      {
        name: "Bahn-Azubis gegen Hass und Gewalt",
        titel: "Mitmach-Wettbewerb von DB & EVG",
        info: "Seit 2000 – eigene Projekte gegen Rassismus, Gewalt und Diskriminierung einreichen. Über 13.000 Azubis haben schon mitgemacht.",
        linkLabel: "Zum Wettbewerb",
        link: "https://www.deutschebahn.com/de/nachhaltigkeit/verantwortung_gesellschaft/BAgHG",
      },
    ],
  },
  {
    gruppe: "EVG & Gewerkschaftsjugend",
    icon: Users,
    angebote: [
      {
        name: "EVG Jugend",
        titel: "JiB-Seminare (Jugend im Betrieb)",
        info: "Bildung und Beratung der EVA Akademie für junge Mitglieder – auch zu Respekt, Vielfalt und gegen Diskriminierung.",
        linkLabel: "Zu den Jugend-Seminaren",
        link: "https://www.eva-akademie.de/seminare-politische-bildung/seminare-fuer-jugendliche",
      },
      {
        name: "DGB Bildungswerk",
        titel: "Jugendseminare gegen Rechts & für Vielfalt",
        info: "Politische Jugendbildung, Zivilcourage und Anti-Rassismus-Workshops für junge Beschäftigte.",
        linkLabel: "Seminarfinder",
        link: "https://www.dgb-bildungswerk-nrw.de/seminare/evg/seminarfinder",
      },
    ],
  },
  {
    gruppe: "Staatlich & unabhängig",
    icon: Landmark,
    angebote: [
      {
        name: "Bundeszentrale für politische Bildung (bpb)",
        titel: "Workshops & Material gegen Hass",
        info: "Zivilcourage, gegen Hass im Netz und Demokratiebildung – kostenlose Angebote für junge Menschen.",
        linkLabel: "Zu Material & Methoden",
        link: "https://www.bpb.de/themen/rechtsextremismus/infopool-rechtsextremismus/550489/materialien-und-methoden-fuer-die-paedagogische-praxis/",
      },
      {
        name: "Antidiskriminierungsstelle des Bundes",
        titel: "Kostenlose Beratung & Bildungsmaterial",
        info: "Vertraulich und unabhängig. Beratung auch telefonisch: 0800 546 546 5.",
        linkLabel: "Zu Bildung & Material",
        link: "https://www.antidiskriminierungsstelle.de/DE/wir-beraten-sie/materialien-fuer-ratsuchende/schulen-hochschulen/bildung_materialien.html",
      },
    ],
  },
  {
    gruppe: "Initiativen & Opferhilfe",
    icon: HeartHandshake,
    angebote: [
      {
        name: "Amadeu Antonio Stiftung",
        titel: "Gegen Rechtsextremismus, Rassismus & Antisemitismus",
        info: "Fördert über 1.000 Projekte für eine demokratische Kultur – mit Bildungsmaterial und Beratung.",
        linkLabel: "Zu den Materialien",
        link: "https://www.amadeu-antonio-stiftung.de/fachstelle-fuer-politische-bildung-und-entschwoerung/unsere-materialien/",
      },
      {
        name: "Gesicht Zeigen!",
        titel: "Für ein weltoffenes Deutschland",
        info: "Workshops und Aktionen für Zivilcourage und gegen Rassismus.",
        linkLabel: "Zu den Workshops",
        link: "https://www.gesichtzeigen.de/workshops/",
      },
      {
        name: "HateAid",
        titel: "Hilfe bei Hass im Netz",
        info: "Kostenlose Beratung für Betroffene digitaler Gewalt – bei Beleidigung, Bedrohung oder Hetze online.",
        linkLabel: "Zur Beratung",
        link: "https://hateaid.org/betroffenenberatung/",
      },
      {
        name: "Weisser Ring",
        titel: "Opferhilfe bei Gewalt",
        info: "Unterstützung für Gewaltopfer. Hilfetelefon täglich 7–22 Uhr: 116 006.",
        linkLabel: "Hilfe bei Gewalt",
        link: "https://weisser-ring.de/digitalegewalt",
      },
    ],
  },
];

const regelwerkGruppen = [
  {
    titel: "Regeln bei der DB",
    icon: FileText,
    hinweis: "DB-interne Vereinbarungen – Volltexte im Intranet, bei JAV oder Betriebsrat.",
    punkte: [
      {
        name: "Konzernbetriebsvereinbarung: Gleichbehandlung & Schutz vor Diskriminierung",
        text: "Zwischen DB und Arbeitnehmervertretung vereinbart: Niemand darf wegen Herkunft, Religion, Geschlecht, Behinderung, Alter oder sexueller Identität benachteiligt werden. Mobbing und Belästigung verstoßen gegen diese Vereinbarung – Beschwerden müssen geprüft werden.",
        link: "https://www.antidiskriminierungsstelle.de/SharedDocs/praxisbeispiele/DE/praxisbeispiel-deutsche-bahn-ag.html",
        linkLabel: "Öffentliche Infos",
      },
      {
        name: "Verhaltenskodex der DB (Code of Conduct)",
        text: "Verbindliche Grundregeln für alle Mitarbeitenden: respektvoller Umgang, keine Diskriminierung, keine Gewalt. Verstöße kannst du über die Compliance-Meldewege melden.",
        linkLabel: "Im DB-Intranet",
      },
    ],
  },
  {
    titel: "Deine gesetzlichen Rechte",
    icon: Scale,
    hinweis: "Gilt in jedem Betrieb in Deutschland – tippe auf einen Paragraphen, um ihn zu lesen.",
    punkte: [
      {
        name: "Beschwerderecht (§ 13 AGG)",
        text: "Du darfst dich offiziell beschweren, wenn du dich gemobbt, belästigt oder diskriminiert fühlst. Deine Beschwerde muss geprüft werden.",
        link: "https://www.gesetze-im-internet.de/agg/__13.html",
        linkLabel: "§ 13 lesen",
      },
      {
        name: "Schutzpflicht des Arbeitgebers (§ 12 AGG)",
        text: "Die DB muss dich schützen und handeln, sobald sie von Belästigung oder Diskriminierung erfährt – bis hin zu Abmahnung oder Kündigung der Verantwortlichen.",
        link: "https://www.gesetze-im-internet.de/agg/__12.html",
        linkLabel: "§ 12 lesen",
      },
      {
        name: "Kein Nachteil für dich (§ 16 AGG)",
        text: "Wer sich beschwert oder Hilfe holt, darf dafür nicht bestraft oder benachteiligt werden. Das ist gesetzlich verboten.",
        link: "https://www.gesetze-im-internet.de/agg/__16.html",
        linkLabel: "§ 16 lesen",
      },
      {
        name: "Gesundheitsschutz (§ 4 ArbSchG)",
        text: "Auch psychische Belastung zählt: Der Arbeitgeber muss Gefährdungen ernst nehmen und vorbeugen – Mobbing macht nachweislich krank.",
        link: "https://www.gesetze-im-internet.de/arbschg/__4.html",
        linkLabel: "§ 4 lesen",
      },
      {
        name: "Faires Miteinander im Betrieb (§ 75 BetrVG)",
        text: "Arbeitgeber und Betriebsrat müssen gemeinsam über die faire Behandlung aller wachen. JAV und Betriebsrat sind dafür deine offiziellen Ansprechpartner.",
        link: "https://www.gesetze-im-internet.de/betrvg/__75.html",
        linkLabel: "§ 75 lesen",
      },
      {
        name: "Besonderer Schutz unter 18 (JArbSchG)",
        text: "Bist du noch minderjährig, stehst du unter besonderem gesetzlichen Schutz – auch bei Arbeitszeiten und Behandlung im Betrieb.",
        link: "https://www.gesetze-im-internet.de/jarbschg/",
        linkLabel: "Gesetz lesen",
      },
    ],
  },
  {
    titel: "Was heißt das für dich?",
    icon: Sparkles,
    hinweis: "Kurz zusammengefasst – ohne Juristendeutsch.",
    punkte: [
      { name: "Du musst nichts hinnehmen", text: "Mobbing, Hass und Gewalt verstoßen gegen DB-Regeln UND Gesetze. Die Regeln stehen auf deiner Seite." },
      { name: "Beschweren ist dein Recht", text: "Und es darf dir keinen Nachteil bringen – das garantiert § 16 AGG." },
      { name: "Die DB muss handeln", text: "Sobald sie davon erfährt, ist sie gesetzlich zum Schutz verpflichtet." },
      { name: "Du bist nicht allein", text: "JAV und Betriebsrat vertreten dich offiziell – kostenlos und vertraulich." },
      { name: "Dokumentieren stärkt dich", text: "Sachliche Notizen machen deine Beschwerde belastbar – nutze dafür Festhalten in dieser App." },
    ],
  },
];

function RegelnUndRechte() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-db-red">
          <Scale size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-black text-db-dark">Regeln & deine Rechte</h2>
          <p className="text-sm font-semibold text-db-rail">Was bei der DB und per Gesetz gegen Mobbing, Hass und Gewalt gilt.</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {regelwerkGruppen.map((gruppe, index) => {
          const GIcon = gruppe.icon;
          const open = openIndex === index;
          return (
            <div key={gruppe.titel} className="overflow-hidden rounded-xl border border-db-dark/10">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                aria-expanded={open}
                className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-black transition ${open ? "bg-red-50 text-db-red" : "bg-db-soft text-db-dark hover:bg-red-50 hover:text-db-red"}`}
              >
                <span className="flex items-center gap-2">
                  {GIcon && <GIcon size={16} aria-hidden="true" />}
                  {gruppe.titel}
                </span>
                <ChevronDown size={18} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {open && (
                <div className="motion-card space-y-3 bg-white p-4">
                  <p className="text-xs font-semibold text-db-rail">{gruppe.hinweis}</p>
                  {gruppe.punkte.map((punkt) => (
                    <article key={punkt.name} className="rounded-lg bg-db-soft p-3">
                      <p className="text-sm font-black text-db-dark">{punkt.name}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-db-rail">{punkt.text}</p>
                      {punkt.link ? (
                        <a
                          href={punkt.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-db-red px-3 py-1.5 text-xs font-black text-white hover:bg-red-700"
                        >
                          {punkt.linkLabel} <ExternalLink size={12} aria-hidden="true" />
                        </a>
                      ) : punkt.linkLabel ? (
                        <span className="mt-2 inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-black text-db-rail ring-1 ring-db-dark/10">
                          {punkt.linkLabel}
                        </span>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] font-semibold leading-5 text-db-rail">
        Demo-Hinweis: vereinfachte Zusammenfassungen, kein offizieller Wortlaut und keine Rechtsberatung. Volltexte: verlinkte Gesetze (öffentlich) sowie DB-Intranet, JAV oder Betriebsrat.
      </p>
    </div>
  );
}

function PraeventionsAngebote() {
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-db-red">
          <GraduationCap size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-black text-db-dark">Kurse & Angebote gegen Hass und Gewalt</h2>
          <p className="text-sm font-semibold text-db-rail">Echte Bildungs- und Präventionsangebote, an denen du teilnehmen kannst.</p>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {praeventionsAngebote.map((gruppe) => {
          const GIcon = gruppe.icon;
          return (
            <div key={gruppe.gruppe}>
              <p className="flex items-center gap-2 text-sm font-black text-db-dark">
                {GIcon && <GIcon size={16} className="text-db-red" aria-hidden="true" />}
                {gruppe.gruppe}
              </p>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                {gruppe.angebote.map((angebot) => (
                  <article key={angebot.name} className="flex flex-col rounded-xl border border-db-dark/10 bg-db-soft p-4 transition hover:border-db-red/40 hover:shadow-sm">
                    <p className="text-sm font-black text-db-dark">{angebot.name}</p>
                    <p className="mt-0.5 text-sm font-black text-db-red">{angebot.titel}</p>
                    <p className="mt-1 flex-1 text-xs font-semibold leading-5 text-db-rail">{angebot.info}</p>
                    {angebot.link ? (
                      <a
                        href={angebot.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 self-start rounded-lg bg-db-red px-3 py-2 text-xs font-black text-white hover:bg-red-700"
                      >
                        {angebot.linkLabel} <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="mt-3 inline-flex self-start rounded-lg bg-white px-3 py-2 text-xs font-black text-db-rail ring-1 ring-db-dark/10">
                        {angebot.linkLabel}
                      </span>
                    )}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] font-semibold leading-5 text-db-rail">
        Hinweis: Angebote und Termine ändern sich. Aktuelle Kurse findest du direkt bei den verlinkten Anbietern, DB-interne Angebote über das Intranet.
      </p>
    </div>
  );
}

function SimpleTrainingLearningView({ onNotify }) {
  const [scenario, setScenario] = useState(null);
  const [feedback, setFeedback] = useState(null);

  function answer(index) {
    setFeedback(index === 1 ? "Gute Wahl." : "Besser wäre eine ruhige, sichere Reaktion.");
    onNotify?.("Training ausgewertet");
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <ViewHero icon={GraduationCap} title="Lernen" subtitle="Kurz üben und einfache Lernangebote ansehen." />
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-db-dark">Kurztraining</h2>
            <div className="mt-4 grid gap-3">
              {scenarios.slice(0, 4).map((item) => (
                <button key={item.title} type="button" onClick={() => { setScenario(item); setFeedback(null); }} className="rounded-xl bg-db-soft p-4 text-left font-black text-db-dark hover:bg-red-50 hover:text-db-red">
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            {scenario ? (
              <>
                <h2 className="text-2xl font-black text-db-dark">{scenario.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-db-rail">{scenario.situation}</p>
                <div className="mt-4 grid gap-3">
                  {scenario.answers.map((item, index) => (
                    <button key={item} type="button" onClick={() => answer(index)} className="rounded-xl bg-db-soft p-4 text-left text-sm font-black text-db-dark hover:bg-red-50 hover:text-db-red">{item}</button>
                  ))}
                </div>
                {feedback && <p className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">{feedback} Bessere Antwort: {scenario.better}</p>}
              </>
            ) : <p className="rounded-xl bg-db-soft p-4 text-sm font-semibold text-db-rail">Wähle ein Szenario aus.</p>}
          </div>
        </div>
        <RegelnUndRechte />
        <PraeventionsAngebote />
      </section>
    </ViewFrame>
  );
}

function SimpleCommunityView({ drafts, setDrafts, onNavigate, onNotify, onUseAsProtocol }) {
  const [mode, setMode] = useState("community");
  const [draft, setDraft] = useState(() => ({
    kind: "Frage",
    topic: "Ausbildung",
    visibility: "anonym vorbereiten",
    text: "",
    checked: false,
  }));
  const [helper, setHelper] = useState(null);
  const options = [
    ["Frage stellen", "Wenn du unsicher bist und Orientierung brauchst.", "Frage"],
    ["Sorge teilen", "Wenn dich eine Situation belastet.", "Sorge"],
    ["Idee vorschlagen", "Wenn du etwas in Ausbildung oder Zusammenarbeit verbessern möchtest.", "Idee"],
    ["Unterstützung suchen", "Wenn du nicht weißt, an wen du dich wenden sollst.", "Unterstützung"],
  ];

  if (mode === "jav") {
    return <JavDemoView onBack={() => setMode("community")} onNavigate={onNavigate} />;
  }
  const demoPosts = [
    ["Ausbildung", "Ich habe Angst, in der Werkstatt Fehler zu machen. Wie spreche ich das an?", "Sprich es früh an und frage nach einem sicheren Übungsrahmen. Training & Lernen kann beim Vorbereiten helfen."],
    ["Mobbing", "Ich werde öfter ausgelacht und weiß nicht, ob ich übertreibe.", "Danke, dass du das ansprichst. Halte konkrete Beispiele fest und suche Unterstützung, wenn es wiederholt passiert."],
    ["Diskriminierung", "Ein Spruch über meine Herkunft hat mich verletzt. Was kann ich tun?", "Das sollte nicht normalisiert werden. Notiere Wortlaut und Kontext und sprich mit einer Vertrauensperson."],
    ["Verbesserungsidee", "Ein kurzer Workshop zu Deeskalation im Kundenkontakt wäre hilfreich.", "Gute Idee. Du könntest kurz beschreiben, für wen der Workshop nützlich wäre und welche Situationen geübt werden sollen."],
  ];

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function communitySuggestion(text = draft.text, topic = draft.topic) {
    if (!text.trim()) {
      return "Schreib erst kurz auf, was du sagen oder fragen möchtest.";
    }
    if (text.toLowerCase().includes("name")) {
      return "Prüfe bitte, ob echte Namen oder sensible Details entfernt werden sollten.";
    }
    if (topic === "Mobbing" || topic === "Teamkonflikt") {
      return "Dein Text wirkt wie eine Sorge zum Thema Teamkonflikt. Konkrete Beispiele helfen, ohne Schuldzuweisungen öffentlich zu machen.";
    }
    if (topic === "Diskriminierung") {
      return "Dein Text wirkt wie ein sensibles Thema. Formuliere sachlich und hole dir Unterstützung, wenn es dich belastet.";
    }
    return `Dein Beitrag wirkt wie ${draft.kind.toLowerCase()} zum Thema ${topic}. Eine Vertrauensperson, JAV/Betriebsrat oder Ausbilder:in könnte in einer echten Version relevant sein.`;
  }

  function makeFormal() {
    const text = draft.text.trim() || "Ich bin unsicher und möchte das Thema sachlich ansprechen.";
    setHelper({
      title: "Sachlicher Vorschlag",
      text: `Du könntest es so formulieren: "${text.replace(/\s+/g, " ")} Ich möchte das ruhig besprechen und wissen, welcher nächste Schritt sinnvoll ist."`,
    });
  }

  function checkPost() {
    setHelper({ title: "Beitrag geprüft", text: communitySuggestion() });
  }

  function saveDraft() {
    if (!draft.text.trim()) {
      onNotify?.("Bitte erst einen kurzen Text eingeben.");
      return;
    }
    if (!draft.checked) {
      onNotify?.("Bitte bestätige, dass keine echten Namen enthalten sind.");
      return;
    }
    const item = {
      id: `COM-${Date.now()}`,
      ...draft,
      date: todayIso(),
      status: "Demo-Entwurf",
    };
    setDrafts((items) => [item, ...items]);
    setDraft({ kind: "Frage", topic: "Ausbildung", visibility: "anonym vorbereiten", text: "", checked: false });
    setHelper(null);
    onNotify?.("Community-Entwurf lokal gespeichert");
  }

  function openDraft(item) {
    setDraft({
      kind: item.kind,
      topic: item.topic,
      visibility: item.visibility,
      text: item.text,
      checked: true,
    });
    setHelper({ title: "Entwurf geöffnet", text: "Du kannst den lokalen Demo-Entwurf jetzt weiter bearbeiten." });
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
          <h1 className="text-3xl font-black">Azubi-Community</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
            Fragen, Sorgen und Ideen gesammelt vorbereiten – als Demo für betreuten Austausch mit JAV, Mentor:innen oder Vertrauenspersonen.
          </p>
          <p className="mt-3 rounded-lg bg-white/10 p-3 text-sm font-semibold leading-6 text-white/80">
            Dies ist kein echter Live-Chat. In dieser Demo wird nichts veröffentlicht oder übermittelt.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMode("jav")}
          className="w-full rounded-xl border border-db-dark/10 bg-white p-5 text-left shadow-sm hover:border-db-red hover:bg-red-50"
        >
          <p className="text-lg font-black text-db-dark">JAV-Demoansicht ansehen</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">
            Zeigt beispielhaft, wie vorbereitete Anliegen moderiert bearbeitet werden könnten.
          </p>
        </button>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {options.map(([title, text, kind]) => (
            <button
              key={title}
              type="button"
              onClick={() => update("kind", kind)}
              className={`rounded-xl border p-5 text-left shadow-sm ${draft.kind === kind ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-white text-db-dark hover:border-db-red"}`}
            >
              <p className="text-lg font-black">{title}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{text}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-db-dark">Beitrag vorbereiten</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label><FieldLabel>Art des Beitrags</FieldLabel><select className="field" value={draft.kind} onChange={(event) => update("kind", event.target.value)}>{["Frage", "Sorge", "Idee", "Unterstützung"].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><FieldLabel>Thema</FieldLabel><select className="field" value={draft.topic} onChange={(event) => update("topic", event.target.value)}>{["Ausbildung", "Berufsschule", "Teamkonflikt", "Mobbing", "Diskriminierung", "Stress", "Sicherheit", "Verbesserungsidee", "Sonstiges"].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="md:col-span-2"><FieldLabel>Sichtbarkeit</FieldLabel><select className="field" value={draft.visibility} onChange={(event) => update("visibility", event.target.value)}>{["anonym vorbereiten", "mit Demo-Profil vorbereiten", "nur Entwurf"].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="md:col-span-2"><FieldLabel>Was möchtest du sagen oder fragen?</FieldLabel><textarea className="field min-h-36 resize-y py-3" value={draft.text} onChange={(event) => update("text", event.target.value)} /></label>
              <label className="flex items-center gap-3 rounded-xl bg-db-soft p-4 text-sm font-black text-db-dark md:col-span-2">
                <input type="checkbox" checked={draft.checked} onChange={(event) => update("checked", event.target.checked)} className="h-4 w-4 accent-db-red" />
                Ich habe keine echten Namen oder sensiblen Daten eingegeben.
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={checkPost} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Beitrag prüfen</button>
              <button type="button" onClick={makeFormal} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Sachlicher formulieren</button>
              <button type="button" onClick={saveDraft} className="rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Als Demo-Entwurf speichern</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-db-dark">KI hilft beim Formulieren</h2>
              <div className="mt-4 grid gap-2">
                <button type="button" onClick={makeFormal} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">sachlicher formulieren</button>
                <button type="button" onClick={() => setHelper({ title: "Persönliche Daten", text: "Entferne echte Namen, genaue Personalnummern, private Kontaktdaten und sehr sensible Details." })} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">persönliche Daten entfernen</button>
                <button type="button" onClick={() => setHelper({ title: "Thema vorgeschlagen", text: communitySuggestion() })} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Thema vorschlagen</button>
                <button type="button" onClick={() => setHelper({ title: "Mögliche Anlaufstelle", text: "Für echte Unterstützung könnte eine Vertrauensperson, JAV/Betriebsrat oder Ausbilder:in relevant sein. Das müsste intern geprüft werden." })} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">nächste Anlaufstelle vorschlagen</button>
              </div>
              {helper && <p className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail"><strong className="text-db-dark">{helper.title}:</strong> {helper.text}</p>}
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-db-dark">Schnelle Wege</h2>
              <div className="mt-4 grid gap-2">
                <button type="button" onClick={() => onUseAsProtocol(draft)} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Aus Sorge ein Protokoll machen</button>
                <button type="button" onClick={() => onNavigate("meldung")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Meldung vorbereiten</button>
                <button type="button" onClick={() => onNavigate("kiHilfe")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Azubi-Begleiter fragen</button>
                <button type="button" onClick={() => onNavigate("training")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Training & Lernen öffnen</button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-db-dark">Beispiele aus der Community</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {demoPosts.map(([topic, text, answer]) => (
              <article key={text} className="rounded-xl bg-db-soft p-4">
                <p className="text-xs font-black uppercase tracking-wide text-db-red">{topic} · Demo-Beitrag</p>
                <p className="mt-2 text-sm font-semibold leading-7 text-db-dark">{text}</p>
                <p className="mt-3 text-sm font-black text-db-dark">JAV/Mentor:innen-Demoantwort</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-db-rail">{answer}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-db-dark">Warum moderiert?</h2>
            <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-db-rail">
              {["keine öffentlichen Anschuldigungen", "keine echten Namen", "sensible Inhalte schützen", "Beiträge würden in echter Version vor Veröffentlichung geprüft", "bei Gefahr echte Hilfe holen"].map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-db-dark">Meine Demo-Entwürfe</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">Community-Beiträge werden in dieser Demo nicht veröffentlicht.</p>
            <div className="mt-4 grid gap-3">
              {drafts.length === 0 ? (
                <p className="rounded-xl bg-db-soft p-4 text-sm font-semibold text-db-rail">Noch keine Community-Entwürfe gespeichert.</p>
              ) : drafts.map((item) => (
                <article key={item.id} className="rounded-xl bg-db-soft p-4">
                  <p className="font-black text-db-dark">{item.date} · {item.topic}</p>
                  <p className="mt-1 text-sm font-semibold text-db-rail">{item.kind} · {item.visibility} · {item.status}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{item.text}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionButton label="öffnen" onClick={() => openDraft(item)} />
                    <ActionButton label="löschen" onClick={() => setDrafts((items) => items.filter((draftItem) => draftItem.id !== item.id))} />
                    <ActionButton label="als Protokoll übernehmen" onClick={() => onUseAsProtocol(item)} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <p className="rounded-xl border border-db-dark/10 bg-white p-4 text-sm font-semibold leading-7 text-db-rail shadow-sm">
          Community-Beiträge werden in dieser Demo nicht veröffentlicht. Eine echte Version bräuchte Moderation, Datenschutzkonzept, Rollenrechte und klare Zuständigkeiten.
        </p>
      </section>
    </ViewFrame>
  );
}

function JavDemoView({ onBack, onNavigate }) {
  const demoItems = [
    {
      id: "JAV-001",
      type: "Sorge",
      topic: "Mobbing",
      urgency: "Mittel",
      visibility: "anonym",
      status: "Neu",
      date: todayIso(),
      text: "Ich werde in der Werkstatt öfter ausgelacht.",
    },
    {
      id: "JAV-002",
      type: "Frage",
      topic: "Ausbildung",
      urgency: "Niedrig",
      visibility: "Demo-Profil",
      status: "In Prüfung",
      date: todayIso(),
      text: "Wie spreche ich Prüfungsstress beim Ausbilder an?",
    },
    {
      id: "JAV-003",
      type: "Idee",
      topic: "Training",
      urgency: "Niedrig",
      visibility: "Entwurf",
      status: "Antwort vorbereitet",
      date: todayIso(),
      text: "Deeskalationsworkshop für Azubis im Kundenkontakt.",
    },
    {
      id: "JAV-004",
      type: "Meldeentwurf",
      topic: "Diskriminierung",
      urgency: "Hoch",
      visibility: "anonym",
      status: "Weiterleitung prüfen",
      date: todayIso(),
      text: "Wiederholte beleidigende Aussagen wegen Herkunft.",
    },
  ];
  const [selectedId, setSelectedId] = useState(demoItems[0].id);
  const [tone, setTone] = useState("unterstützend");
  const [answer, setAnswer] = useState("");
  const [checklist, setChecklist] = useState({
    names: false,
    sensitive: false,
    accusations: false,
    danger: false,
    contact: false,
    tone: false,
  });
  const selected = demoItems.find((item) => item.id === selectedId) || demoItems[0];
  const highUrgency = demoItems.filter((item) => item.urgency === "Hoch").length;
  const openAnswers = demoItems.filter((item) => item.status !== "Abgeschlossen").length;
  const mostCommonTopic = "Mobbing";

  function badgeClass(value) {
    if (value === "Hoch") return "bg-red-50 text-db-red ring-red-100";
    if (value === "Mittel") return "bg-amber-50 text-amber-700 ring-amber-100";
    return "bg-db-soft text-db-rail ring-db-dark/10";
  }

  function createAnswer() {
    if (selected.topic === "Mobbing") {
      setAnswer("Danke, dass du das ansprichst. Bitte halte konkrete Situationen mit Datum, Uhrzeit und Kontext fest. Wenn es wiederholt passiert oder dich belastet, suche dir Unterstützung und nutze die Protokollfunktion.");
      return;
    }
    if (selected.topic === "Ausbildung") {
      setAnswer("Es ist gut, dass du früh nach Unterstützung suchst. Schreib dir auf, was genau dich belastet, und sprich möglichst früh mit einer Vertrauensperson oder deiner zuständigen Ansprechperson.");
      return;
    }
    if (selected.topic === "Training") {
      setAnswer("Danke für deine Idee. Ein Deeskalationsworkshop könnte gut zur Prävention passen. Als nächster Schritt wäre sinnvoll, Zielgruppe, Format und mögliche Ansprechpersonen zu klären.");
      return;
    }
    setAnswer("Danke, dass du das vorbereitest. Bitte halte konkrete Beispiele sachlich fest und prüfe mit einer zuständigen Vertrauensperson, welcher nächste Schritt sinnvoll ist.");
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
          <button type="button" onClick={onBack} className="rounded bg-white px-3 py-2 text-sm font-black text-db-dark">Zur Azubi-Community</button>
          <h1 className="mt-4 text-3xl font-black">JAV-Demoansicht</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
            Beispiel, wie vorbereitete Fragen, Sorgen und Ideen moderiert bearbeitet werden könnten.
          </p>
          <p className="mt-3 rounded-lg bg-white/10 p-3 text-sm font-semibold leading-6 text-white/80">
            Nur Demo. Keine echte JAV-Kommunikation, keine echte Übermittlung, keine offiziellen Daten.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard title="Neue Anliegen" value={String(demoItems.filter((item) => item.status === "Neu").length)} />
          <MetricCard title="Hohe Dringlichkeit" value={String(highUrgency)} />
          <MetricCard title="Offene Antwortentwürfe" value={String(openAnswers)} />
          <MetricCard title="Häufigstes Thema" value={mostCommonTopic} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-db-dark">Demo-Posteingang</h2>
            <div className="mt-4 grid gap-3">
              {demoItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`rounded-xl border p-4 text-left ${selected.id === item.id ? "border-db-red bg-red-50" : "border-db-dark/10 bg-db-soft hover:border-db-red"}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-db-dark">{item.type} · {item.topic}</span>
                    <span className={`rounded px-2 py-1 text-xs font-black ring-1 ${badgeClass(item.urgency)}`}>{item.urgency}</span>
                    <span className="rounded bg-white px-2 py-1 text-xs font-black text-db-rail ring-1 ring-db-dark/10">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{item.text}</p>
                  <p className="mt-2 text-xs font-bold text-db-rail">{item.visibility} · {item.date}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-db-dark">{selected.type}: {selected.topic}</h2>
                <span className={`rounded px-2 py-1 text-xs font-black ring-1 ${badgeClass(selected.urgency)}`}>{selected.urgency}</span>
              </div>
              <div className="mt-4 grid gap-3">
                <PreviewRow label="Zusammenfassung" value={selected.text} />
                <PreviewRow label="Wichtige Angaben" value={`${selected.visibility}, Status: ${selected.status}, Datum: ${selected.date}`} />
                <PreviewRow label="Mögliche nächste Schritte" value="Sachlich prüfen, konkrete Beispiele klären, passende Ansprechperson noch intern prüfen." />
                <PreviewRow label="Risiko-Hinweis" value={selected.urgency === "Hoch" ? "Hohe Dringlichkeit: Sicherheit und Unterstützung zuerst prüfen." : "Keine akute Gefahr aus Demo-Daten erkennbar."} />
                <PreviewRow label="Datenschutz-Hinweis" value="Keine echten Namen oder sensiblen Daten in Demo-Antworten übernehmen." />
                <PreviewRow label="Empfohlene App-Funktion" value={selected.topic === "Training" ? "Training empfehlen" : selected.type === "Meldeentwurf" ? "Meldung vorbereiten" : "Protokoll prüfen"} />
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-db-dark">Antwort vorbereiten</h2>
              <div className="mt-4 grid gap-4">
                <label><FieldLabel>Ton</FieldLabel><select className="field" value={tone} onChange={(event) => setTone(event.target.value)}>{["unterstützend", "sachlich", "klärend", "weiterleitend"].map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><FieldLabel>Antwortentwurf</FieldLabel><textarea className="field min-h-28 resize-y py-3" value={answer} onChange={(event) => setAnswer(event.target.value)} /></label>
                <button type="button" onClick={createAnswer} className="rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Antwortvorschlag erstellen</button>
              </div>
              <p className="mt-3 text-sm font-semibold text-db-rail">Gewählter Ton: {tone}. Keine echte Antwort wird gesendet.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-db-dark">Moderation-Checkliste</h2>
            <div className="mt-4 grid gap-2">
              {[
                ["names", "Keine echten Namen enthalten"],
                ["sensitive", "Keine sensiblen Daten öffentlich"],
                ["accusations", "Keine direkten Anschuldigungen ohne Prüfung"],
                ["danger", "Akute Gefahr geprüft"],
                ["contact", "passende Anlaufstelle noch zu prüfen"],
                ["tone", "Antwort sachlich und unterstützend formuliert"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-xl bg-db-soft p-3 text-sm font-black text-db-dark">
                  <input type="checkbox" checked={Boolean(checklist[key])} onChange={(event) => setChecklist((current) => ({ ...current, [key]: event.target.checked }))} className="h-4 w-4 accent-db-red" />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-db-dark">Datenschutz & Sicherheit</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-db-rail">
              Eine echte Version bräuchte Rollenrechte, Moderation, Datenschutzprüfung, klare Zuständigkeiten und sichere Kommunikationswege.
            </p>
            <div className="mt-4 grid gap-2">
              <button type="button" onClick={() => onNavigate("protokoll")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Protokoll prüfen</button>
              <button type="button" onClick={() => onNavigate("meldung")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Meldung vorbereiten</button>
              <button type="button" onClick={() => onNavigate("training")} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Training empfehlen</button>
            </div>
          </div>
        </div>
      </section>
    </ViewFrame>
  );
}


function OverviewView({ onNavigate }) {
  const actions = [
    ["KI-Hilfe starten", "kiHilfe", "Schnelle Orientierung für akute Situationen."],
    ["Vorfall protokollieren", "protokoll", "Situation sachlich dokumentieren."],
    ["Melden", "meldung", "Geführte Meldung lokal vorbereiten."],
    ["Training starten", "training", "Sicheres Verhalten üben."],
  ];

  const benefits = [
    ["Frühe Orientierung", "Schnelle Ersteinschätzung und nächste Schritte."],
    ["Sachliche Dokumentation", "Wichtige Angaben werden geordnet festgehalten."],
    ["Deeskalation trainieren", "Reaktionen in typischen Situationen üben."],
    ["Menschliche Prüfung bleibt notwendig", "Die Demo unterstützt, entscheidet aber nicht."],
  ];

  const statusCards = [
    ["Demo-Protokolle", "lokal"],
    ["vorbereitete Meldungen", "Demo"],
    ["Trainingsfortschritt", "82 %"],
    ["Datenschutzmodus aktiv", "anonym"],
  ];

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-6 text-white shadow-panel">
          <p className="text-sm font-black uppercase tracking-wider text-red-200">Lokaler Innovationsprototyp</p>
          <h1 className="mt-3 text-4xl font-black">DB Peace AI</h1>
          <p className="mt-4 text-xl font-semibold leading-8 text-white/82">
            KI-gestützte Unterstützung bei Hass, Gewalt, Mobbing und Konflikten
          </p>
          <p className="mt-4 max-w-3xl font-semibold leading-7 text-white/70">Lokaler Innovationsprototyp - keine echte Datenverarbeitung</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <InfoTag>Nur lokal im Prototyp</InfoTag>
            <InfoTag>Keine echte Übermittlung</InfoTag>
            <InfoTag>Menschliche Prüfung erforderlich</InfoTag>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actions.map(([label, viewId, text]) => (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(viewId)}
              className="rounded-xl border border-db-dark/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-panel"
            >
              <p className="text-lg font-black text-db-dark">{label}</p>
              <p className="mt-1 text-sm font-semibold text-db-rail">{text}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statusCards.map(([title, value]) => (
            <MetricCard key={title} title={title} value={value} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

function KiHilfeView({ onNavigate }) {
  const [issue, setIssue] = useState(issues[0]);
  const [text, setText] = useState("");
  const [response, setResponse] = useState(null);
  const [draftReport, setDraftReport] = useState(null);

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
    setDraftReport(null);
  }

  function prepareReport() {
    if (!response) {
      return;
    }

    setDraftReport({
      category: response.category,
      risk: response.risk,
      note: text.slice(0, 110) || "Kurzbeschreibung aus der Demo-Antwort.",
      next: response.risk === "Hoch" ? "Sofort reale Hilfe prüfen." : "Für menschliche Prüfung vorbereiten.",
    });
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
            <div className="mt-4 flex flex-wrap gap-2">
              <InfoTag>Nur lokal im Prototyp</InfoTag>
              <InfoTag>Keine echte Übermittlung</InfoTag>
            </div>
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
                <ResponseBlock label="Wann echte Hilfe nötig ist" value={response.risk === "Hoch" ? "Bei Gefahr sofort reale Hilfe kontaktieren." : "Wenn sich die Lage zuspitzt oder Angst entsteht."} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate("protokoll")}
                  className="rounded bg-db-soft px-5 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 transition hover:bg-red-50 hover:text-db-red"
                >
                  Als Protokoll übernehmen
                </button>
                <button
                  type="button"
                  onClick={prepareReport}
                  className="rounded bg-db-soft px-5 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 transition hover:bg-red-50 hover:text-db-red"
                >
                  Meldung vorbereiten
                </button>
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-db-rail">Menschliche Prüfung erforderlich</p>
            </div>
          )}

          {draftReport && (
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-black text-db-dark">Meldungsvorschau</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <PreviewRow label="Kategorie" value={draftReport.category} />
                <PreviewRow label="Risiko" value={draftReport.risk} />
                <PreviewRow label="Kurzbeschreibung" value={draftReport.note} />
                <PreviewRow label="Nächster Schritt" value={draftReport.next} />
              </div>
            </div>
          )}
        </div>
      </section>
    </ViewFrame>
  );
}

function MeldungView({ protocols, reportDraft, reportDrafts, setReportDrafts, onNavigate, onRequestConfirm, onNotify, onDirtyChange, onResetDirty }) {
  const steps = ["Meldeart", "Situation", "Zeit & Ort", "Details", "Dringlichkeit", "Vorschlag", "Vorschau"];
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => emptyReportDraft());
  const [copyFallback, setCopyFallback] = useState("");

  useEffect(() => {
    if (!reportDraft) {
      onDirtyChange?.(false);
      return;
    }

    setDraft((current) => ({
      ...current,
      mode: "entwurf",
      caseNumber: reportDraft.caseNumber || current.caseNumber,
      category: reportDraft.category || current.category,
      risk: reportDraft.risk || current.risk,
      description: reportDraft.shortSummary || reportDraft.note || current.description,
      location: reportDraft.details?.location || current.location,
      date: reportDraft.details?.date || current.date,
      time: reportDraft.details?.time || current.time,
      area: reportDraft.details?.area || current.area,
      nextStep: reportDraft.nextStep || reportDraft.next || current.nextStep,
    }));
    setStarted(true);
    setStep(6);
    onDirtyChange?.(false);
  }, [reportDraft]);

  const risk = reportRisk(draft);
  const routing = reportRoutingSuggestion(draft);
  const completeness = reportCompleteness(draft);
  const completeCount = completeness.filter(([, filled]) => Boolean(filled)).length;
  const caseNumber = draft.caseNumber || createReportCaseNumber(reportDrafts);
  const nextStep =
    draft.danger === "Ja, direkte Gefahr"
      ? "Bei akuter Gefahr sofort reale Hilfe kontaktieren."
      : "Meldung mit einer zuständigen Stelle oder Vertrauensperson prüfen.";

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    onDirtyChange?.(true);
  }

  function chooseMode(mode) {
    setDraft({ ...emptyReportDraft(), mode });
    setStarted(true);
    setStep(0);
    setCopyFallback("");
    onDirtyChange?.(true);
  }

  function newReport() {
    setStarted(false);
    setStep(0);
    setDraft(emptyReportDraft());
    setCopyFallback("");
    onDirtyChange?.(false);
    onResetDirty?.();
  }

  function saveDraft() {
    const timestamp = nowStamp();
    const id = draft.id || createReportCaseNumber(reportDrafts);
    const saved = normalizeReportDraft({
      ...draft,
      id,
      caseNumber: id,
      risk,
      routing,
      nextStep,
      updatedAt: timestamp,
      createdAt: draft.createdAt || timestamp,
    });
    setReportDrafts((items) => [saved, ...items.filter((item) => item.id !== id)]);
    setDraft(saved);
    onDirtyChange?.(false);
    onResetDirty?.();
    onNotify?.("Meldeentwurf lokal gespeichert");
  }

  function openDraft(item) {
    setDraft(normalizeReportDraft(item));
    setStarted(true);
    setStep(6);
  }

  function duplicateDraft(item) {
    const timestamp = nowStamp();
    const id = createReportCaseNumber(reportDrafts);
    const duplicate = normalizeReportDraft({ ...item, id, caseNumber: id, createdAt: timestamp, updatedAt: timestamp, status: "Entwurf" });
    setReportDrafts((items) => [duplicate, ...items]);
    onNotify?.("Entwurf dupliziert");
  }

  function deleteDraft(item) {
    onRequestConfirm?.({
      title: "Meldeentwurf löschen?",
      message: "Der Entwurf wird nur aus dem lokalen Demo-Speicher entfernt.",
      confirmLabel: "Löschen",
      cancelLabel: "Abbrechen",
      onConfirm: () => {
        setReportDrafts((items) => items.filter((entry) => entry.id !== item.id));
        onNotify?.("Entwurf gelöscht");
      },
    });
  }

  function importProtocol(protocol) {
    if (!protocol) {
      return;
    }

    setDraft((current) => ({
      ...current,
      mode: current.mode || "entwurf",
      category: protocol.type || current.category,
      date: protocol.date || current.date,
      time: protocol.time || current.time,
      location: protocol.location || current.location,
      area: protocol.area || current.area,
      description: protocol.description || current.description,
      affected: protocol.involvement || current.affected,
      witnesses: protocol.evidence?.includes("Zeugen vorhanden") ? "Zeugen vorhanden" : current.witnesses,
      repetition: protocol.repetition || current.repetition,
      danger: protocol.danger || current.danger,
      burden: protocol.burden || current.burden,
    }));
    setStarted(true);
    setStep(6);
    onNotify?.("Protokoll übernommen");
  }

  function reportText() {
    return [
      `Demo-Fallnummer: ${caseNumber}`,
      `Modus: ${draft.mode}`,
      `Datum/Uhrzeit: ${draft.date} ${draft.time}`,
      `Ort/Kontext: ${draft.location || "nicht angegeben"}`,
      `Kategorie: ${draft.category}`,
      `Risiko: ${risk}`,
      `Beschreibung: ${draft.description || "nicht angegeben"}`,
      `Betroffene/Zeugen: ${[draft.affected, draft.witnesses].filter(Boolean).join(" / ") || "nicht angegeben"}`,
      `5-W-Check: ${completeCount} von 5 W-Fragen ausgefüllt`,
      `Routing-Vorschlag: ${routing}`,
      `Nächster Schritt: ${nextStep}`,
      "Hinweis: Nicht übermittelt - nur lokale Demo-Vorschau",
    ].join("\n");
  }

  function copyReportText() {
    const text = reportText();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => onNotify?.("Meldungstext kopiert"),
        () => setCopyFallback(text)
      );
      return;
    }
    setCopyFallback(text);
  }

  function StepNav() {
    return (
      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <div className="h-2 overflow-hidden rounded bg-db-soft">
          <div className="h-full rounded bg-db-red transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded px-3 py-2 text-xs font-black ring-1 ${step === index ? "bg-red-50 text-db-red ring-red-100" : "bg-db-soft text-db-rail ring-db-dark/10"}`}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
          <p className="text-sm font-black uppercase tracking-wider text-red-200">Melden</p>
          <h1 className="mt-2 text-4xl font-black">Melden</h1>
          <p className="mt-3 max-w-4xl text-lg font-semibold leading-8 text-white/80">
            Bereite eine Meldung strukturiert vor - anonym, persönlich oder zunächst als Entwurf.
          </p>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-7 text-white/70">
            Diese Funktion hilft dir, wichtige Informationen vollständig und sachlich zusammenzustellen. In dieser Demo wird nichts übermittelt.
          </p>
        </div>

        {!started ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ["anonym", "Anonym melden vorbereiten", "Ohne Namen oder Kontaktdaten. Geeignet, wenn du dich zunächst schützen möchtest."],
              ["persönlich", "Persönlich melden vorbereiten", "Mit freiwilligen Kontaktdaten. Hilfreich, wenn Rückfragen möglich sein sollen."],
              ["entwurf", "Erst Entwurf erstellen", "Wenn du noch unsicher bist, kannst du die Meldung zunächst nur lokal vorbereiten."],
            ].map(([mode, title, text]) => (
              <button key={mode} type="button" onClick={() => chooseMode(mode)} className="rounded-xl border border-db-dark/10 bg-white p-6 text-left shadow-sm hover:border-db-red hover:bg-red-50">
                <p className="text-xl font-black text-db-dark">{title}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-db-rail">{text}</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            <StepNav />
            <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
              <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
                {step === 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black text-db-dark">Meldeart</h2>
                    <PreviewRow label="Ausgewählter Modus" value={draft.mode} />
                    {draft.mode === "persönlich" && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <ReportInput label="Name optional" value={draft.name} onChange={(value) => updateDraft("name", value)} />
                        <ReportInput label="Kontakt optional" value={draft.contact} onChange={(value) => updateDraft("contact", value)} />
                        <ReportInput label="Rolle optional" value={draft.role} onChange={(value) => updateDraft("role", value)} />
                        <label>
                          <FieldLabel>Bereich optional</FieldLabel>
                          <select className="field" value={draft.area} onChange={(event) => updateDraft("area", event.target.value)}>
                            {profileAreas.map((area) => <option key={area}>{area}</option>)}
                          </select>
                        </label>
                        <p className="rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail md:col-span-2">
                          Gib nur Daten ein, die du wirklich angeben möchtest. Diese Demo übermittelt nichts.
                        </p>
                      </div>
                    )}
                    {draft.mode === "anonym" && (
                      <p className="rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
                        Du kannst die Meldung ohne Namen vorbereiten. Für echte Rückfragen wäre später ein geschützter Rückkanal nötig.
                      </p>
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-black text-db-dark">Was möchtest du melden?</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {reportTypes.map((item) => (
                        <button key={item} type="button" onClick={() => updateDraft("category", item)} className={`rounded-xl border p-4 text-left font-black ${draft.category === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"}`}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <h2 className="text-2xl font-black text-db-dark md:col-span-2">Zeit & Ort</h2>
                    <label><FieldLabel>Datum</FieldLabel><input className="field" type="date" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} /></label>
                    <label><FieldLabel>Uhrzeit</FieldLabel><input className="field" type="time" value={draft.time} onChange={(event) => updateDraft("time", event.target.value)} /></label>
                    <ReportInput label="Ort / Kontext" value={draft.location} onChange={(value) => updateDraft("location", value)} />
                    <label>
                      <FieldLabel>Bereich</FieldLabel>
                      <select className="field" value={draft.area} onChange={(event) => updateDraft("area", event.target.value)}>
                        {profileAreas.map((area) => <option key={area}>{area}</option>)}
                      </select>
                    </label>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black text-db-dark">Details</h2>
                    <label className="block">
                      <FieldLabel>Beschreibe sachlich, was passiert ist.</FieldLabel>
                      <textarea className="field min-h-40 resize-y py-3" value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} placeholder="Nutze möglichst konkrete Angaben. Keine echten Namen nötig, wenn du anonym bleiben möchtest." />
                    </label>
                    <div className="grid gap-4 md:grid-cols-3">
                      <ReportInput label="Wer war betroffen?" value={draft.affected} onChange={(value) => updateDraft("affected", value)} />
                      <ReportInput label="Gab es Zeugen?" value={draft.witnesses} onChange={(value) => updateDraft("witnesses", value)} />
                      <label><FieldLabel>Einmalig oder wiederholt?</FieldLabel><select className="field" value={draft.repetition} onChange={(event) => updateDraft("repetition", event.target.value)}>{protocolRepetition.map((item) => <option key={item}>{item}</option>)}</select></label>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <h2 className="text-2xl font-black text-db-dark">Dringlichkeit</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {protocolDangerOptions.map((item) => (
                        <button key={item} type="button" onClick={() => updateDraft("danger", item)} className={`rounded-xl border p-4 text-left font-black ${draft.danger === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"}`}>{item}</button>
                      ))}
                    </div>
                    <div>
                      <p className="font-black text-db-dark">Wie belastend ist die Situation?</p>
                      <input className="mt-4 w-full accent-db-red" type="range" min="1" max="5" value={draft.burden} onChange={(event) => updateDraft("burden", Number(event.target.value))} />
                      <p className="mt-2 text-sm font-semibold text-db-rail">Belastung: {draft.burden}/5</p>
                    </div>
                    {draft.danger === "Ja, direkte Gefahr" && (
                      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-black leading-7 text-red-800">
                        Bei akuter Gefahr bitte sofort reale Hilfe kontaktieren. Diese App ist kein Notfallsystem.
                      </p>
                    )}
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black text-db-dark">Vorschlag für zuständige Stelle</h2>
                    <PreviewRow label="Routing-Vorschlag" value={routing} />
                    <p className="rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
                      Die passende Stelle müsste intern geprüft werden.
                    </p>
                    <div className="grid gap-3 md:grid-cols-5">
                      {completeness.map(([label, filled]) => (
                        <div key={label} className={`rounded-lg p-3 text-sm font-black ${filled ? "bg-emerald-50 text-emerald-700" : "bg-db-soft text-db-rail"}`}>{label}</div>
                      ))}
                    </div>
                    <p className="font-black text-db-dark">{completeCount} von 5 W-Fragen ausgefüllt</p>
                  </div>
                )}

                {step === 6 && (
                  <ReportPreview caseNumber={caseNumber} completeCount={completeCount} draft={draft} nextStep={nextStep} risk={risk} routing={routing} />
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Zurück</button>
                  <button type="button" onClick={() => setStep((current) => Math.min(6, current + 1))} className="rounded-lg bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Weiter</button>
                  <button type="button" onClick={() => setStep(6)} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Meldungsvorschau erstellen</button>
                  <button type="button" onClick={copyReportText} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Meldungstext kopieren</button>
                  <button type="button" onClick={saveDraft} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Als Entwurf speichern</button>
                  <button type="button" onClick={newReport} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Neue Meldung starten</button>
                  <button type="button" onClick={() => onNavigate("overview")} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Zur Übersicht</button>
                </div>
                {copyFallback && <textarea className="field mt-4 min-h-40 resize-y py-3" value={copyFallback} readOnly />}
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
                  <h3 className="text-xl font-black text-db-dark">Aus Protokoll übernehmen</h3>
                  {protocols.length === 0 ? (
                    <p className="mt-3 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">Noch kein Protokoll vorhanden. Du kannst zuerst einen Vorfall protokollieren.</p>
                  ) : (
                    <div className="mt-4 grid gap-2">
                      {protocols.slice(0, 5).map((protocol) => (
                        <button key={protocol.id} type="button" onClick={() => importProtocol(protocol)} className="rounded-lg bg-db-soft p-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                          {protocol.id} · {protocol.type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <DraftList drafts={reportDrafts} onDelete={deleteDraft} onDuplicate={duplicateDraft} onOpen={openDraft} />
              </div>
            </div>
          </>
        )}
      </section>
    </ViewFrame>
  );
}

function ReportInput({ label, onChange, value }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input className="field" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ReportPreview({ caseNumber, completeCount, draft, nextStep, risk, routing }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-db-dark">Meldungsvorschau</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <PreviewRow label="Demo-Fallnummer" value={caseNumber} />
        <PreviewRow label="Modus" value={draft.mode} />
        <PreviewRow label="Datum" value={draft.date} />
        <PreviewRow label="Uhrzeit" value={draft.time} />
        <PreviewRow label="Ort/Kontext" value={draft.location || "Nicht angegeben"} />
        <PreviewRow label="Kategorie" value={draft.category} />
        <PreviewRow label="Risiko" value={risk} />
        <PreviewRow label="5-W-Check" value={`${completeCount} von 5 W-Fragen ausgefüllt`} />
        <PreviewRow label="Routing-Vorschlag" value={routing} />
        <PreviewRow label="Empfohlener nächster Schritt" value={nextStep} />
      </div>
      <div className="mt-4 grid gap-4">
        <SectionCard title="Beschreibung" text={draft.description || "Noch keine Beschreibung eingetragen."} />
        <SectionCard title="Betroffene / Zeugen" text={[draft.affected, draft.witnesses].filter(Boolean).join(" / ") || "Nicht angegeben"} />
        <p className="rounded-xl bg-db-soft p-4 text-sm font-black text-db-rail">Nicht übermittelt - nur lokale Demo-Vorschau</p>
      </div>
    </div>
  );
}

function DraftList({ drafts, onDelete, onDuplicate, onOpen }) {
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <h3 className="text-xl font-black text-db-dark">Gespeicherte Meldeentwürfe</h3>
      <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Entwürfe werden nur lokal im Demo-Prototyp gespeichert.</p>
      {drafts.length === 0 ? (
        <p className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">Noch keine Meldeentwürfe gespeichert.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {drafts.map((item) => (
            <article key={item.id} className="rounded-xl bg-db-soft p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-black text-db-dark">{item.caseNumber}</p>
                  <p className="mt-1 text-sm font-semibold text-db-rail">{item.date} · {item.category} · {item.mode} · Risiko {item.risk}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wide text-db-rail">{item.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ActionButton label="Öffnen" onClick={() => onOpen(item)} />
                  <ActionButton label="Duplizieren" onClick={() => onDuplicate(item)} />
                  <ActionButton label="Löschen" onClick={() => onDelete(item)} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function TrainingView({ onNotify }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [feedback, setFeedback] = useState(null);

  function evaluate(choiceIndex) {
    if (!selectedScenario) {
      return;
    }

    const scoreByChoice = [1, 5, 2];
    const score = scoreByChoice[choiceIndex] ?? 3;
    setFeedback({
      score,
      better: selectedScenario.better,
      choice: selectedScenario.answers[choiceIndex],
    });
    onNotify?.("Training abgeschlossen");
  }

  return (
    <ViewFrame>
      <section className="grid gap-6 p-5 lg:grid-cols-[0.9fr_1.1fr] lg:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
            {scenarios.map((scenario) => (
              <button
                key={scenario.title}
                type="button"
                onClick={() => {
                  setSelectedScenario(scenario);
                  setFeedback(null);
                }}
                className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                  selectedScenario.title === scenario.title ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-white text-db-dark"
                }`}
              >
              <p className="text-lg">{scenario.title}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{scenario.goal}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            {selectedScenario ? (
              <>
                <h2 className="text-2xl font-black text-db-dark">{selectedScenario.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-db-rail">{selectedScenario.situation}</p>
                <div className="mt-4 grid gap-3">
                  {selectedScenario.answers.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => evaluate(index)}
                      className="rounded-xl border border-db-dark/10 bg-db-soft px-4 py-4 text-left font-semibold leading-7 text-db-dark transition hover:border-db-red hover:bg-red-50 hover:text-db-red"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-db-soft p-5">
                <p className="text-lg font-black text-db-dark">Wähle ein Szenario aus, um das Training zu starten.</p>
                <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">
                  Danach erscheinen Situation, Antwortmöglichkeiten und Feedback.
                </p>
              </div>
            )}
          </div>

          {feedback && selectedScenario && (
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-black text-db-dark">Feedback</h3>
              <p className="mt-3 font-semibold leading-7 text-db-rail">Score: {feedback.score}/5</p>
              <div className="mt-2 h-3 rounded-full bg-db-soft">
                <div className="h-3 rounded-full bg-db-red transition-all" style={{ width: `${feedback.score * 20}%` }} />
              </div>
              <p className="mt-2 font-semibold leading-7 text-db-rail">Gewählte Antwort: {feedback.choice}</p>
              <p className="mt-2 font-semibold leading-7 text-db-rail">{feedback.better}</p>
              <p className="mt-3 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
                Bessere Alternative: {selectedScenario.better}
              </p>
            </div>
          )}
        </div>
      </section>
    </ViewFrame>
  );
}

function DashboardView({ protocolMetrics, reportMetrics, resourceMetrics, onNavigate }) {
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
          <MetricCard title="Gespeicherte Demo-Protokolle" value={String(protocolMetrics?.saved ?? 0)} />
          <MetricCard title="Hohe Dringlichkeit" value={String(protocolMetrics?.urgent ?? 0)} />
          <MetricCard title="Häufigste Kategorie" value={protocolMetrics?.mostCommonCategory || "Keine Daten"} />
          <MetricCard title="Offene Entwürfe" value={String(protocolMetrics?.drafts ?? 0)} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Vorbereitete Meldungen" value={String(protocolMetrics?.prepared ?? 0)} />
          <MetricCard title="Trainings abgeschlossen" value="126" />
          <MetricCard title="Datenschutzmodus" value="aktiv" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard title="Anonyme Meldeentwürfe" value={String(reportMetrics?.anonymous ?? 0)} />
          <MetricCard title="Persönliche Meldeentwürfe" value={String(reportMetrics?.personal ?? 0)} />
          <MetricCard title="Entwürfe ohne Modus" value={String(reportMetrics?.noMode ?? 0)} />
          <MetricCard title="Vollständige 5-W-Fragen" value={String(reportMetrics?.completeFiveW ?? 0)} />
          <MetricCard title="Hohe Dringlichkeit" value={String(reportMetrics?.urgent ?? 0)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Verfügbare Demo-Ressourcen" value={String(resourceMetrics?.available ?? 0)} />
          <MetricCard title="Empfohlene Ressourcen" value={String(resourceMetrics?.recommended ?? 0)} />
          <MetricCard title="Ressourcen nach Thema" value={String(resourceMetrics?.topics ?? 0)} />
          <MetricCard title="Weiterbildungspotenzial" value={String(resourceMetrics?.suggestions ?? 0)} />
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>Protokolle können helfen, Rückfragen zu reduzieren, weil wichtige Informationen strukturierter vorliegen.</p>
            <button
              type="button"
              onClick={() => onNavigate("hilfe")}
              className="rounded-lg bg-white px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red"
            >
              Hilfe öffnen
            </button>
          </div>
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
          <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">
            Demo-Schätzung: Die Werte zeigen nur, was strukturierte Vorbereitung Zeit sparen könnte.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <InfoTag>Demo-Schätzung</InfoTag>
            <InfoTag>Müsste intern validiert werden</InfoTag>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InputCard label="Fälle pro Monat" value={cases} onChange={setCases} />
            <InputCard label="Minuten pro Fall" value={minutes} onChange={setMinutes} />
            <InputCard label="Stundenkosten" value={hourlyCost} onChange={setHourlyCost} />
            <InputCard label="Zeitersparnis in %" value={savingPercent} onChange={setSavingPercent} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ResultCard label="Gesamtzeit ohne System" value={`${totalHours.toFixed(1)} Std.`} />
            <ResultCard label="Eingesparte Stunden" value={`${savedHours.toFixed(1)} Std.`} />
            <ResultCard label="Monatliche Einsparung" value={`${monthly.toFixed(0)} EUR`} />
            <ResultCard label="Jährliche Einsparung" value={`${yearly.toFixed(0)} EUR`} />
          </div>
          <p className="mt-4 text-sm font-semibold leading-6 text-db-rail">Demo-Schätzung · müsste intern validiert werden.</p>
        </div>
      </section>
    </ViewFrame>
  );
}

function RessourcenView({ resourceSuggestions, setResourceSuggestions, onNotify }) {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("Alle");
  const [format, setFormat] = useState("Alle");
  const [cost, setCost] = useState("Alle");
  const [provider, setProvider] = useState("Alle");
  const [need, setNeed] = useState("Ich bin unsicher");
  const [suggestion, setSuggestion] = useState({
    title: "",
    provider: "",
    topic: "",
    link: "",
    reason: "",
    cost: "muss geprüft werden",
  });

  const filteredResources = demoResources.filter((item) => {
    const haystack = [item.title, item.providerType, item.topic, item.format, item.cost, item.audience, item.description, item.suitableFor]
      .join(" ")
      .toLowerCase();
    return (
      (!search.trim() || haystack.includes(search.trim().toLowerCase())) &&
      (topic === "Alle" || item.topic === topic) &&
      (format === "Alle" || item.format.includes(format)) &&
      (cost === "Alle" || item.cost.includes(cost)) &&
      (provider === "Alle" || item.providerType === provider)
    );
  });

  const recommendations = recommendResources(need);

  function updateSuggestion(field, value) {
    setSuggestion((current) => ({ ...current, [field]: value }));
  }

  function submitSuggestion() {
    const entry = {
      ...suggestion,
      id: `RES-${Date.now()}`,
      createdAt: nowStamp(),
    };
    setResourceSuggestions((items) => [entry, ...items]);
    setSuggestion({ title: "", provider: "", topic: "", link: "", reason: "", cost: "muss geprüft werden" });
    onNotify?.("Ressourcenvorschlag lokal als Demo vorgemerkt.");
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
          <p className="text-sm font-black uppercase tracking-wider text-red-200">Ressourcen</p>
          <h1 className="mt-2 text-4xl font-black">Ressourcen & Weiterbildung</h1>
          <p className="mt-3 max-w-4xl text-lg font-semibold leading-8 text-white/80">
            Seminare, Lernangebote und Anlaufstellen als Orientierung für Prävention, Deeskalation und respektvolles Miteinander.
          </p>
          <p className="mt-4 rounded-lg bg-white/10 p-3 text-sm font-semibold leading-6 text-white/80 ring-1 ring-white/15">
            Alle Einträge sind Demo-Beispiele. Verfügbarkeit, Kosten und interne Freigabe müssten vor Nutzung geprüft werden.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {resourceCategories.map(([title, text]) => (
            <SectionCard key={title} title={title} text={text} />
          ))}
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
            <input className="field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ressourcen durchsuchen..." />
            <FilterSelect value={topic} onChange={setTopic} options={resourceTopics} />
            <FilterSelect value={format} onChange={setFormat} options={resourceFormats} />
            <FilterSelect value={cost} onChange={setCost} options={resourceCosts} />
            <FilterSelect value={provider} onChange={setProvider} options={resourceProviders} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-db-dark">Demo-Ressourcen</h2>
            {filteredResources.length === 0 ? (
              <p className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">Keine Ressourcen für diese Suche gefunden.</p>
            ) : (
              <div className="mt-4 grid gap-4">
                {filteredResources.map((resource) => <ResourceCard key={resource.title} resource={resource} />)}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black text-db-dark">Passende Ressource finden</h2>
              <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Lokale Demo-Empfehlung - keine offizielle Zuweisung.</p>
              <select className="field mt-4" value={need} onChange={(event) => setNeed(event.target.value)}>
                {resourceNeeds.map((item) => <option key={item}>{item}</option>)}
              </select>
              <div className="mt-4 grid gap-3">
                {recommendations.map((resource) => (
                  <ResourceCard key={resource.title} resource={resource} compact />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-db-dark">Verknüpfungen</h2>
              <div className="mt-4 grid gap-3">
                <SectionCard title="Aus Protokoll passende Ressourcen anzeigen" text="Diese Verknüpfung ist als nächster Entwicklungsschritt vorgesehen." />
                <SectionCard title="Nach Meldeentwurf passende Weiterbildung anzeigen" text="Diese Verknüpfung ist als nächster Entwicklungsschritt vorgesehen." />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-db-dark">Ressource vorschlagen</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ReportInput label="Titel" value={suggestion.title} onChange={(value) => updateSuggestion("title", value)} />
            <ReportInput label="Anbieter" value={suggestion.provider} onChange={(value) => updateSuggestion("provider", value)} />
            <ReportInput label="Thema" value={suggestion.topic} onChange={(value) => updateSuggestion("topic", value)} />
            <ReportInput label="Link optional" value={suggestion.link} onChange={(value) => updateSuggestion("link", value)} />
            <label className="md:col-span-2">
              <FieldLabel>Warum passt es?</FieldLabel>
              <textarea className="field min-h-28 resize-y py-3" value={suggestion.reason} onChange={(event) => updateSuggestion("reason", event.target.value)} />
            </label>
            <label>
              <FieldLabel>Kostenstatus</FieldLabel>
              <select className="field" value={suggestion.cost} onChange={(event) => updateSuggestion("cost", event.target.value)}>
                <option>Kostenstatus unbekannt</option>
                <option>kostenlos möglich</option>
                <option>kostenpflichtig</option>
                <option>muss geprüft werden</option>
              </select>
            </label>
          </div>
          <button type="button" onClick={submitSuggestion} className="mt-4 rounded bg-db-red px-5 py-3 font-black text-white hover:bg-red-700">
            Vorschlag lokal vormerken
          </button>
          {resourceSuggestions.length > 0 && (
            <p className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
              Lokal vorgemerkte Vorschläge: {resourceSuggestions.length}
            </p>
          )}
        </div>
      </section>
    </ViewFrame>
  );
}

function recommendResources(need) {
  const wantedTopics =
    need.includes("Mobbing")
      ? ["Mobbing", "Deeskalation"]
      : need.includes("Diskriminierung")
        ? ["Diskriminierung", "Zivilcourage"]
        : need.includes("Gewalt")
          ? ["Gewaltprävention", "Deeskalation"]
          : need.includes("Deeskalation")
            ? ["Deeskalation", "Gewaltprävention"]
            : need.includes("anderen helfen")
              ? ["Zivilcourage", "Mobbing"]
              : ["Mobbing", "Diskriminierung", "Deeskalation"];

  return demoResources.filter((resource) => wantedTopics.includes(resource.topic)).slice(0, 3);
}

function ResourceCard({ compact = false, resource }) {
  return (
    <article className="rounded-xl border border-db-dark/10 bg-db-soft p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-black text-db-dark">{resource.title}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-db-rail">{resource.description}</p>
        </div>
        <span className="rounded bg-white px-2 py-1 text-xs font-black text-db-rail ring-1 ring-db-dark/10">{resource.status}</span>
      </div>
      <div className={`mt-4 grid gap-3 ${compact ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        <PreviewRow label="Anbieter-Typ" value={resource.providerType} />
        <PreviewRow label="Thema" value={resource.topic} />
        <PreviewRow label="Format" value={resource.format} />
        <PreviewRow label="Kostenstatus" value={resource.cost} />
        {!compact && <PreviewRow label="Zielgruppe" value={resource.audience} />}
        {!compact && <PreviewRow label="Dauer" value={resource.duration} />}
        {!compact && <PreviewRow label="Geeignet für" value={resource.suitableFor} />}
      </div>
    </article>
  );
}

function HilfeView({ onNavigate }) {
  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
          <p className="text-sm font-black uppercase tracking-wider text-red-200">Hilfe</p>
          <h2 className="mt-2 text-3xl font-black">Hilfe & Notfall</h2>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-white/75">
            Orientierung für akute Situationen, Dokumentation und passende Ansprechstellen. Dies ist ein lokaler Prototyp.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-lg font-black text-db-red">Bei akuter Gefahr</p>
          <p className="mt-2 text-sm font-semibold leading-7 text-red-800">
            Abstand halten, die Situation verlassen, Unterstützung holen und reale Notfall- oder Sicherheitswege nutzen.
            DB Peace AI ist keine Notfallhilfe.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="In Gefahr" text="Nicht diskutieren, Abstand schaffen, andere Personen dazuholen und reale Hilfe kontaktieren." />
          <SectionCard title="Nach Mobbing oder Diskriminierung" text="Situation sachlich festhalten, Belastung einschätzen und eine Vertrauensperson einbeziehen." />
          <SectionCard title="Nach Drohungen" text="Sicherheit priorisieren, Belege sichern und nicht allein weiterklären." />
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-db-dark">Dokumentations-Checkliste</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {documentationChecklist.map((item) => (
              <label key={item} className="flex items-start gap-3 rounded-xl bg-db-soft p-4 text-sm font-black leading-6 text-db-dark">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-db-red" />
                {item}
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => onNavigate("protokoll")} className="rounded-lg bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">
              Protokoll öffnen
            </button>
            <button type="button" onClick={() => onNavigate("meldung")} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
              Meldung vorbereiten
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-db-dark">Ansprechstellen</h3>
          <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Platzhalter - reale interne Kontakte müssten ergänzt werden.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {helpContacts.map(([title, text]) => (
              <SectionCard key={title} title={title} text={text} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-db-dark">Grenzen des Prototyps</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {prototypeLimits.map((limit) => (
              <div key={limit} className="rounded-lg bg-db-soft p-4 text-sm font-black leading-6 text-db-dark">
                {limit}
              </div>
            ))}
          </div>
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
            Keine echten Daten in der Demo, keine Überwachung und keine automatische Entscheidung.
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
        <SectionCard
          title="Protokoll-Funktion & Datenschutz"
          text="Protokolle sollen freiwillig sein, ohne echte Namen funktionieren und nicht automatisch weitergeleitet werden. Vor einer echten Einführung wären Speicherfristen, Zugriffskonzept und Datenschutzprüfung nötig."
        />
        <SectionCard
          title="Melden-Funktion"
          text="Meldungen werden in dieser Demo nicht übermittelt. Anonym oder persönlich ist nur eine Vorbereitung. Es gibt keine automatische Weiterleitung und keine automatische Entscheidung. Vor echter Nutzung wären sichere Meldewege, Zugriffskonzept und Datenschutzprüfung nötig."
        />
        <SectionCard
          title="Ressourcen & Weiterbildung"
          text="Externe Links und Angebote müssten vor echter Nutzung geprüft werden. Die App übernimmt keine Garantie für Kosten, Verfügbarkeit oder Eignung."
        />
        <div className="rounded-xl border border-db-dark/10 bg-db-dark p-5 text-white shadow-panel">
          <p className="font-semibold leading-7 text-white/80">
            EU AI Act, Arbeitsrecht, Betriebsrat/JAV, Datenschutz und IT-Sicherheit müssten vor einer echten Einführung geprüft werden.
          </p>
        </div>
      </section>
    </ViewFrame>
  );
}

function ProfileView({ profile, setProfile, onNavigate, onRequestConfirm, onNotify, onDirtyChange, onResetDirty }) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
    onDirtyChange?.(false);
  }, [profile]);

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    onDirtyChange?.(true);
  }

  function saveProfile() {
    setProfile({ ...draft, confirmed: true });
    onDirtyChange?.(false);
    onResetDirty?.();
    onNotify?.("Profil gespeichert");
  }

  function resetProfile() {
    const nextProfile = { ...profileDefaults, confirmed: false };
    setDraft(nextProfile);
    setProfile(nextProfile);
    onDirtyChange?.(false);
    onResetDirty?.();
    onNotify?.("Eingabe zurückgesetzt");
  }

  return (
    <ViewFrame>
      <section className="grid gap-6 p-5 lg:grid-cols-[1fr_0.95fr] lg:p-6">
        <div className="space-y-4 rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-db-dark p-4 text-white">
            <p className="text-sm font-black uppercase tracking-wider text-red-200">Profil</p>
            <h2 className="mt-2 text-3xl font-black">Demo-Profil</h2>
            <p className="mt-2 text-sm font-semibold leading-7 text-white/75">
              Dies ist kein echtes Login-System. Es werden keine echten Konten erstellt.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <InfoTag>Nur lokal im Prototyp</InfoTag>
              <InfoTag>Keine echte Übermittlung</InfoTag>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Anzeigename optional</span>
            <input className="field" value={draft.displayName} onChange={(event) => updateField("displayName", event.target.value)} placeholder="z. B. Samira" />
          </label>

          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Rolle</span>
            <select className="field" value={draft.role} onChange={(event) => updateField("role", event.target.value)}>
              {profileRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Bereich</span>
            <select className="field" value={draft.area} onChange={(event) => updateField("area", event.target.value)}>
              {profileAreas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 font-bold text-db-dark">
            <input
              type="checkbox"
              checked={draft.anonymous}
              onChange={(event) => updateField("anonymous", event.target.checked)}
              className="h-4 w-4 accent-db-red"
            />
            Ich möchte anonym bleiben
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 font-bold text-db-dark">
            <input type="checkbox" checked={draft.confirmed} onChange={(event) => updateField("confirmed", event.target.checked)} className="h-4 w-4 accent-db-red" />
            Ich verstehe, dass dies nur ein lokaler Demo-Prototyp ist.
          </label>

          <button type="button" onClick={saveProfile} className="rounded bg-db-red px-5 py-3 font-black text-white transition hover:bg-red-700">
            Profil speichern
          </button>
          <button
            type="button"
            onClick={() =>
              onRequestConfirm?.({
                title: "Profil zurücksetzen?",
                message: "Bist du sicher? Diese Demo-Eingabe wird lokal gelöscht.",
                confirmLabel: "Zurücksetzen",
                onConfirm: resetProfile,
              })
            }
            className="rounded-lg bg-db-soft px-5 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red"
          >
            Profil zurücksetzen
          </button>
          <p className="text-sm font-semibold leading-6 text-db-rail">
            Keine echten DB-E-Mailadressen, Kennungen oder Passwörter erforderlich.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-db-dark">Profilzusammenfassung</p>
            {profile.confirmed ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <PreviewRow label="Rolle" value={profile.role} />
                <PreviewRow label="Bereich" value={profile.area} />
                <PreviewRow label="Anonymitätsstatus" value={profile.anonymous ? "Anonym aktiv" : "Namen sichtbar im Demo-Profil"} />
                <PreviewRow label="Demo-Modus" value={profile.confirmed ? "Aktiv bestätigt" : "Noch nicht bestätigt"} />
                <PreviewRow label="Anzeigename" value={profile.displayName || "Kein Anzeigename gesetzt"} />
                <PreviewRow label="Hinweis" value="Dies ist kein echtes Login-System." />
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
                Richte ein Demo-Profil ein, um den Prototyp personalisiert zu testen.
              </div>
            )}
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-db-dark p-5 text-white">
            <p className="text-sm font-black uppercase tracking-wider text-red-200">Hinweis</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-white/80">
              Das Profil bleibt nur als Demo im Browser gespeichert und dient der lokalen Präsentation.
            </p>
          </div>

          <button type="button" onClick={() => onNavigate("overview")} className="rounded-xl bg-db-soft px-5 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
            Zur Übersicht
          </button>
        </div>
      </section>
    </ViewFrame>
  );
}

function ProtokollViewLegacy({ onNavigate, onSaveProtocol, onPrepareProtocol, onDeleteProtocol, onUseAsReport, protocols, latestProtocolId }) {
  const [protocol, setProtocol] = useState(() => emptyProtocol());
  const [helperResult, setHelperResult] = useState(null);
  const [notice, setNotice] = useState("Protokoll nur lokal im Demo-Prototyp.");

  function updateField(field, value) {
    setProtocol((current) => ({ ...current, [field]: value }));
  }

  function toggleEvidence(option) {
    setProtocol((current) => ({
      ...current,
      evidence: current.evidence.includes(option)
        ? current.evidence.filter((item) => item !== option)
        : [...current.evidence, option],
    }));
  }

  function summarizeProtocol() {
    setHelperResult({
      title: "Neutrale Kurzfassung",
      lines: [
        `Sachlicher Ton: ${protocol.type} im Bereich ${protocol.area}.`,
        protocol.description ? "Keine Schuldzuweisung." : "Nur beobachtbare Fakten sind erfasst.",
        "Neutral formulieren statt bewerten.",
        protocol.description ? "Nur beobachtbare Fakten." : "Beschreibung noch ergänzen.",
      ],
    });
  }

  function checkMissingDetails() {
    const checklist = [
      protocol.date ? "Datum vorhanden" : "Datum fehlt",
      protocol.time ? "Uhrzeit vorhanden" : "Uhrzeit fehlt",
      protocol.location ? "Ort vorhanden" : "Ort fehlt",
      protocol.description ? "Beschreibung vorhanden" : "Beschreibung fehlt",
      protocol.evidence.length > 0 ? "Hinweise erfasst" : "Hinweise fehlen",
      protocol.burden ? "Belastung eingeschätzt" : "Belastung fehlt",
      protocol.danger ? "Gefahr eingeschätzt" : "Gefahr fehlt",
    ];

    setHelperResult({ title: "Fehlende Details", lines: checklist });
  }

  function assessRisk() {
    const risk = protocol.danger === "Ja, direkte Gefahr" ? "hoch" : protocol.danger === "Ja, es könnte eskalieren" ? "mittel" : protocol.burden >= 4 ? "mittel" : "niedrig";
    const reason =
      risk === "hoch"
        ? "Es liegt direkte Gefahr vor."
        : risk === "mittel"
          ? "Die Situation ist belastend oder kann eskalieren."
          : "Aktuell keine direkte Eskalation beschrieben.";

    setHelperResult({
      title: "Risiko-Einschätzung",
      lines: [`Risiko: ${risk}`, reason, "Nur Demo-Einschätzung, menschliche Prüfung erforderlich."],
    });
  }

  function prepareReport() {
    const category = protocol.type;
    const risk = protocol.danger === "Ja, direkte Gefahr" ? "Hoch" : protocol.danger === "Ja, es könnte eskalieren" ? "Mittel" : protocol.burden >= 4 ? "Mittel" : "Niedrig";
    const caseNumber = `DBPA-${String(Date.now()).slice(-6)}`;

    setHelperResult({
      title: "Meldungsvorschau",
      lines: [
        `Kategorie: ${category}`,
        `Kurzbeschreibung: ${protocol.description.slice(0, 90) || "Keine Kurzbeschreibung."}`,
        `Risiko: ${risk}`,
        `Wichtige Details: ${protocol.location || "Ort offen"}`,
        `Nächster Schritt: ${protocol.danger === "Ja, direkte Gefahr" ? "Sofort reale Hilfe kontaktieren." : "Für menschliche Prüfung vorbereiten."}`,
        `Demo-Fallnummer: ${caseNumber}`,
      ],
    });
    onPrepareProtocol(protocol);
    setNotice("Meldung nur als Demo-Vorschau vorbereitet.");
  }

  function showNextSteps() {
    setHelperResult({
      title: "Nächste Schritte",
      lines: [
        "Situation sichern.",
        "Sachlich dokumentieren.",
        "Unterstützung holen.",
        protocol.danger === "Ja, direkte Gefahr" ? "Bei Gefahr reale Hilfe kontaktieren." : "Ggf. anonyme Meldung vorbereiten.",
      ],
    });
  }

  function saveDraft() {
    onSaveProtocol(protocol);
    setNotice("Dieses Protokoll wurde nur lokal im Demo-Prototyp vorgemerkt.");
  }

  function deleteDraft() {
    if (!latestProtocolId) {
      setNotice("Kein vorgemerktes Protokoll zum Löschen vorhanden.");
      return;
    }

    onDeleteProtocol(latestProtocolId);
    setProtocol(emptyProtocol());
    setHelperResult({
      title: "Protokoll gelöscht",
      lines: ["Der aktuelle lokale Demoeintrag wurde als gelöscht markiert.", "Es wurden keine Daten an einen Server gesendet."],
    });
    setNotice("Das Protokoll wurde lokal als gelöscht markiert.");
  }

  function useAsReport() {
    onUseAsReport(protocol);
    setNotice("Protokoll wurde als Vorlage für die Meldung übernommen.");
  }

  return (
    <ViewFrame>
      <section className="grid gap-6 p-5 lg:grid-cols-[1.02fr_0.98fr] lg:p-6">
        <div className="space-y-5">
          <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
            <p className="text-sm font-black uppercase tracking-wider text-red-200">Protokoll</p>
            <h2 className="mt-2 text-3xl font-black">Incident sauber dokumentieren</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
              Das Protokoll hilft, einen Vorfall vor einer Meldung sachlich und strukturiert festzuhalten.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <InfoTag>Nur lokal im Prototyp</InfoTag>
              <InfoTag>Menschliche Prüfung erforderlich</InfoTag>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">A) Grunddaten</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-black text-db-dark">Datum</span>
                  <input className="field" type="date" value={protocol.date} onChange={(event) => updateField("date", event.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block font-black text-db-dark">Uhrzeit</span>
                  <input className="field" type="time" value={protocol.time} onChange={(event) => updateField("time", event.target.value)} />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block font-black text-db-dark">Ort / Kontext</span>
                  <input className="field" value={protocol.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Werkstatt, Bahnhof, Büro, Chat..." />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block font-black text-db-dark">Bereich</span>
                  <select className="field" value={protocol.area} onChange={(event) => updateField("area", event.target.value)}>
                    {profileAreas.map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">B) Art der Situation</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField("type", type)}
                    className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                      protocol.type === type ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">C) Beschreibung</p>
              <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Beschreibe die Situation sachlich. Du musst keine Namen nennen.</p>
              <textarea className="field mt-4 min-h-40 resize-y" value={protocol.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Was ist passiert?" />
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">D) Beteiligung</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolInvolvement.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateField("involvement", item)}
                    className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                      protocol.involvement === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">E) Wiederholung</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolRepetition.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateField("repetition", item)}
                    className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                      protocol.repetition === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">F) Beweise / Hinweise</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolEvidence.map((item) => (
                  <label key={item} className="flex items-center gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 font-semibold text-db-dark">
                    <input type="checkbox" checked={protocol.evidence.includes(item)} onChange={() => toggleEvidence(item)} className="h-4 w-4 accent-db-red" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">G) Belastung</p>
              <div className="mt-4">
                <input type="range" min="1" max="5" value={protocol.burden} onChange={(event) => updateField("burden", Number(event.target.value))} className="w-full accent-db-red" />
                <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Wie stark belastet dich die Situation? {protocol.burden}/5</p>
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">H) Akute Gefahr</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolDangerOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateField("danger", item)}
                    className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                      protocol.danger === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {protocol.danger === "Ja, direkte Gefahr" && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-7 text-red-700">
                  Bei akuter Gefahr bitte sofort reale Hilfe kontaktieren.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-db-dark">KI-Protokollhilfe</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">
              Die lokale Demo hilft, das Protokoll neutral, klar und strukturiert zu formulieren.
            </p>
            <div className="mt-4 grid gap-3">
              <button type="button" onClick={summarizeProtocol} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Sachlich zusammenfassen
              </button>
              <button type="button" onClick={checkMissingDetails} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Fehlende Details prüfen
              </button>
              <button type="button" onClick={assessRisk} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Risiko einschätzen
              </button>
              <button type="button" onClick={prepareReport} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Meldung vorbereiten
              </button>
              <button type="button" onClick={showNextSteps} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Nächste Schritte anzeigen
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-db-dark p-4 text-white">
            <p className="text-sm font-black uppercase tracking-wider text-red-200">Hinweis</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-white/80">{notice}</p>
          </div>

          {helperResult && (
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-black text-db-dark">{helperResult.title}</h3>
              <div className="mt-4 grid gap-3">
                {helperResult.lines.map((line) => (
                  <div key={line} className="rounded-lg bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-db-dark">Aktionen</p>
            <div className="mt-4 grid gap-3">
              <button type="button" onClick={saveDraft} className="rounded-xl bg-db-red px-4 py-3 text-left font-black text-white hover:bg-red-700">
                Protokoll lokal vormerken
              </button>
              <button
                type="button"
                onClick={() =>
                  onRequestConfirm?.({
                    title: "Protokoll löschen?",
                    message: "Bist du sicher? Diese Demo-Eingabe wird lokal gelöscht.",
                    confirmLabel: "Löschen",
                    onConfirm: deleteDraft,
                  })
                }
                disabled={!latestProtocolId}
                className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red disabled:cursor-not-allowed disabled:opacity-60"
              >
                Protokoll löschen
              </button>
              <button type="button" onClick={useAsReport} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Als Meldung übernehmen
              </button>
              <button type="button" onClick={() => onNavigate("meldung")} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Zur Meldung wechseln
              </button>
            </div>
            <p className="mt-4 text-sm font-semibold leading-7 text-db-rail">
              Dieses Protokoll wurde nur lokal im Demo-Prototyp vorgemerkt.
            </p>
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-db-dark">Meine Demo-Protokolle</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Lokale Demo-Daten nur im Browser.</p>
            <div className="mt-4 space-y-3">
              {protocols.length ? (
                protocols.map((entry) => (
                  <article key={entry.id} className="rounded-xl border border-db-dark/10 bg-db-soft p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-db-dark">{entry.type}</p>
                      <span className="rounded bg-white px-2 py-1 text-xs font-black text-db-rail ring-1 ring-db-dark/10">{entry.status}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">
                      {entry.date} · Risiko {entry.risk}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
                  Noch keine Demo-Protokolle vorhanden. Lege ein Protokoll an oder übernehme eine Meldungsvorlage.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </ViewFrame>
  );
}

function ProtokollView({
  onNavigate,
  onSaveProtocol,
  onPrepareProtocol,
  onDeleteProtocol,
  onDuplicateProtocol,
  onUseAsReport,
  protocols,
  onRequestConfirm,
  onNotify,
  onDirtyChange,
  onResetDirty,
}) {
  const [activeTab, setActiveTab] = useState("neu");
  const [protocol, setProtocol] = useState(() => emptyProtocol());
  const [helperResult, setHelperResult] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("Alle");
  const [categoryFilter, setCategoryFilter] = useState("Alle");
  const [riskFilter, setRiskFilter] = useState("Alle");
  const [statusFilter, setStatusFilter] = useState("Alle");
  const [areaFilter, setAreaFilter] = useState("Alle");
  const [sortBy, setSortBy] = useState("Neueste zuerst");
  const [folders, setFolders] = useState(defaultProtocolFolders);
  const [activeFolder, setActiveFolder] = useState("Alle Protokolle");
  const [newFolder, setNewFolder] = useState("");
  const [exportProtocol, setExportProtocol] = useState(null);
  const [notice, setNotice] = useState("Protokolle werden in dieser Demo nur lokal im Browser gespeichert. Keine echte Übermittlung, keine zentrale Speicherung, keine automatische Prüfung.");

  useEffect(() => {
    onDirtyChange?.(false);
  }, []);

  const selectedProtocol = protocols.find((item) => item.id === selectedId) || null;
  const filteredProtocols = filterProtocols(protocols, {
    activeFolder,
    areaFilter,
    categoryFilter,
    periodFilter,
    riskFilter,
    search,
    sortBy,
    statusFilter,
  });

  function updateField(field, value) {
    setProtocol((current) => ({ ...current, [field]: value }));
    onDirtyChange?.(true);
  }

  function toggleEvidence(option) {
    setProtocol((current) => ({
      ...current,
      evidence: current.evidence.includes(option)
        ? current.evidence.filter((item) => item !== option)
        : [...current.evidence, option],
    }));
    onDirtyChange?.(true);
  }

  function summarizeProtocol() {
    const summary = protocol.description
      ? `${protocol.type} im Kontext ${protocol.location || protocol.area}: ${protocol.description.slice(0, 180)}`
      : `${protocol.type} im Bereich ${protocol.area}. Beschreibung noch ergänzen.`;
    setProtocol((current) => ({
      ...current,
      aiSummary: summary,
      history: [...(current.history || []), { label: "KI-Zusammenfassung erstellt", at: nowStamp() }],
    }));
    setHelperResult({
      title: "Neutrale Kurzfassung",
      summary,
      lines: ["Sachlich formuliert.", "Keine Schuldzuweisung.", "Menschliche Prüfung bleibt notwendig."],
    });
    onNotify?.("Eingabe verarbeitet");
  }

  function checkMissingDetails() {
    const lines = [
      protocol.date ? "Datum vorhanden" : "Datum fehlt",
      protocol.time ? "Uhrzeit vorhanden" : "Uhrzeit fehlt",
      protocol.location ? "Ort/Kontext vorhanden" : "Ort/Kontext fehlt",
      protocol.description ? "Beschreibung vorhanden" : "Beschreibung fehlt",
      protocol.evidence.length > 0 ? "Hinweise erfasst" : "Hinweise fehlen",
      protocol.danger ? "Akute Gefahr eingeschätzt" : "Akute Gefahr fehlt",
    ];
    setHelperResult({ title: "Fehlende Informationen", lines });
    onNotify?.("Eingabe verarbeitet");
  }

  function assessRisk() {
    const risk = localRisk(protocol);
    const nextStep =
      risk === "Hoch"
        ? "Sicherheit priorisieren und reale Hilfe kontaktieren."
        : risk === "Mittel"
          ? "Situation beobachten, dokumentieren und Unterstützung einbeziehen."
          : "Sachlich dokumentieren und bei Bedarf weitere Schritte prüfen.";
    setProtocol((current) => ({ ...current, risk, nextStep }));
    setHelperResult({
      title: "Risiko-Einschätzung",
      lines: [`Risiko: ${risk}`, nextStep, "Nur Demo-Einschätzung, keine automatische Entscheidung."],
    });
    onNotify?.("Eingabe verarbeitet");
  }

  function prepareReport() {
    const risk = localRisk(protocol);
    const nextStep = protocol.danger === "Ja, direkte Gefahr" ? "Sofort reale Hilfe kontaktieren." : "Für menschliche Prüfung vorbereiten.";
    setProtocol((current) => ({
      ...current,
      risk,
      status: "In Prüfung vorbereiten",
      folder: "Für Meldung vorbereiten",
      nextStep,
      history: [...(current.history || []), { label: "Meldungsvorschau erstellt", at: nowStamp() }],
    }));
    setHelperResult({
      title: "Meldungsvorschau",
      lines: [
        `Kategorie: ${protocol.type}`,
        `Risiko: ${risk}`,
        `Kurzbeschreibung: ${protocol.description.slice(0, 120) || "Beschreibung noch offen."}`,
        `Nächster Schritt: ${nextStep}`,
        "Es wird nichts automatisch übermittelt.",
      ],
    });
    onNotify?.("Meldungsvorschau erstellt");
  }

  function showNextSteps() {
    const lines = [
      "Situation sachlich weiter dokumentieren.",
      "Hinweise und Kontext ergänzen.",
      protocol.danger === "Ja, direkte Gefahr" ? "Bei Gefahr sofort reale Hilfe kontaktieren." : "Passende Vertrauensperson einbeziehen.",
      "Bei Bedarf Meldung vorbereiten.",
    ];
    setProtocol((current) => ({ ...current, nextStep: lines[2] }));
    setHelperResult({ title: "Empfohlener nächster Schritt", lines });
    onNotify?.("Eingabe verarbeitet");
  }

  function saveProtocolLocal() {
    const savedId = onSaveProtocol({ ...protocol, risk: localRisk(protocol) });
    setSelectedId(savedId || protocol.id || null);
    setNotice("Nur lokal im Demo-Prototyp gespeichert. Keine echte Übermittlung.");
    onDirtyChange?.(false);
    onResetDirty?.();
    onNotify?.("Protokoll lokal gespeichert");
    setActiveTab("register");
  }

  function startNewProtocol() {
    setProtocol(emptyProtocol());
    setHelperResult(null);
    setSelectedId(null);
    setExportProtocol(null);
    onDirtyChange?.(false);
    setActiveTab("neu");
  }

  function openProtocol(entry) {
    setSelectedId(entry.id);
    setActiveTab("details");
  }

  function editProtocol(entry) {
    setProtocol(normalizeProtocol(entry));
    setHelperResult(entry.aiSummary ? { title: "Neutrale Kurzfassung", summary: entry.aiSummary, lines: [entry.nextStep || "Nächsten Schritt prüfen."] } : null);
    setSelectedId(entry.id);
    setActiveTab("neu");
  }

  function duplicateProtocol(entry) {
    const id = onDuplicateProtocol?.(entry.id);
    setSelectedId(id || null);
    setActiveTab("register");
    onNotify?.("Protokoll dupliziert");
  }

  function confirmDelete(entry) {
    onRequestConfirm?.({
      title: "Dieses Demo-Protokoll wirklich löschen?",
      message: "Das Protokoll wird nur aus dem lokalen Demo-Register entfernt.",
      confirmLabel: "Löschen",
      cancelLabel: "Abbrechen",
      onConfirm: () => {
        onDeleteProtocol(entry.id);
        if (selectedId === entry.id) {
          setSelectedId(null);
        }
        onNotify?.("Protokoll gelöscht");
      },
    });
  }

  function useAsReport(entry = protocol) {
    onUseAsReport(entry);
    setNotice("Protokoll wurde als Vorlage für die Meldung übernommen. Es wird nichts automatisch übermittelt.");
    onNotify?.("Meldungsvorschau erstellt");
  }

  function addFolder() {
    const trimmed = newFolder.trim();
    if (!trimmed || folders.includes(trimmed)) {
      return;
    }

    setFolders((items) => [...items, trimmed]);
    setActiveFolder(trimmed);
    setNewFolder("");
  }

  function updateProtocolFolder(entry, folder) {
    onSaveProtocol({ ...entry, folder, history: [...(entry.history || []), { label: "Ordner geändert", at: nowStamp() }] });
    onNotify?.("Ordner aktualisiert");
  }

  return (
    <ViewFrame>
      <section className="space-y-6 p-5 lg:p-6">
        <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
          <p className="text-sm font-black uppercase tracking-wider text-red-200">Protokoll</p>
          <h2 className="mt-2 text-3xl font-black">Protokollregister</h2>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-7 text-white/75">
            Vorfälle lokal dokumentieren, wiederfinden und für eine Meldung vorbereiten.
          </p>
          <p className="mt-4 rounded-lg bg-white/10 p-3 text-sm font-semibold leading-6 text-white/80 ring-1 ring-white/15">
            Protokolle werden in dieser Demo nur lokal im Browser gespeichert. Keine echte Übermittlung, keine zentrale Speicherung, keine automatische Prüfung.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["neu", "Neues Protokoll"],
            ["register", "Register"],
            ["ordner", "Ordner"],
            ["details", "Details"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`rounded-lg px-4 py-3 text-sm font-black ring-1 ${
                activeTab === id ? "bg-db-red text-white ring-db-red" : "bg-white text-db-dark ring-db-dark/10 hover:bg-red-50 hover:text-db-red"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "neu" && (
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <ProtocolForm folders={folders} protocol={protocol} toggleEvidence={toggleEvidence} updateField={updateField} />
            <div className="space-y-5">
              <ProtocolHelper
                helperResult={helperResult}
                onAssessRisk={assessRisk}
                onCheckMissing={checkMissingDetails}
                onNextSteps={showNextSteps}
                onPrepareReport={prepareReport}
                onSummarize={summarizeProtocol}
              />
              <ProtocolActions
                notice={notice}
                onExport={() => setExportProtocol({ ...protocol, risk: localRisk(protocol) })}
                onNew={startNewProtocol}
                onSave={saveProtocolLocal}
                onUseAsReport={() => useAsReport(protocol)}
              />
              {exportProtocol && <ExportPreview protocol={exportProtocol} />}
            </div>
          </div>
        )}

        {activeTab === "register" && (
          <ProtocolRegister
            activeFolder={activeFolder}
            areaFilter={areaFilter}
            categoryFilter={categoryFilter}
            filteredProtocols={filteredProtocols}
            folders={folders}
            onAssignFolder={updateProtocolFolder}
            onDelete={confirmDelete}
            onDuplicate={duplicateProtocol}
            onEdit={editProtocol}
            onExport={(entry) => setExportProtocol(entry)}
            onOpen={openProtocol}
            onPrepareReport={useAsReport}
            periodFilter={periodFilter}
            riskFilter={riskFilter}
            search={search}
            setAreaFilter={setAreaFilter}
            setCategoryFilter={setCategoryFilter}
            setPeriodFilter={setPeriodFilter}
            setRiskFilter={setRiskFilter}
            setSearch={setSearch}
            setSortBy={setSortBy}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            statusFilter={statusFilter}
          />
        )}

        {activeTab === "ordner" && (
          <FolderView
            activeFolder={activeFolder}
            folders={folders}
            newFolder={newFolder}
            onAddFolder={addFolder}
            protocols={protocols}
            setActiveFolder={setActiveFolder}
            setNewFolder={setNewFolder}
          />
        )}

        {activeTab === "details" && (
          <ProtocolDetails
            onDelete={confirmDelete}
            onEdit={editProtocol}
            onExport={(entry) => setExportProtocol(entry)}
            onPrepareReport={useAsReport}
            protocol={selectedProtocol}
          />
        )}

        {exportProtocol && activeTab !== "neu" && <ExportPreview protocol={exportProtocol} />}
      </section>
    </ViewFrame>
  );
}

function ProtokollViewLegacy2({
  onNavigate,
  onSaveProtocol,
  onPrepareProtocol,
  onDeleteProtocol,
  onUseAsReport,
  protocols,
  latestProtocolId,
  onRequestConfirm,
  onNotify,
  onDirtyChange,
  onResetDirty,
}) {
  const [protocol, setProtocol] = useState(() => emptyProtocol());
  const [helperResult, setHelperResult] = useState(null);
  const [notice, setNotice] = useState("Protokoll nur lokal im Demo-Prototyp.");

  useEffect(() => {
    onDirtyChange?.(false);
  }, []);

  function updateField(field, value) {
    setProtocol((current) => ({ ...current, [field]: value }));
    onDirtyChange?.(true);
  }

  function toggleEvidence(option) {
    setProtocol((current) => ({
      ...current,
      evidence: current.evidence.includes(option)
        ? current.evidence.filter((item) => item !== option)
        : [...current.evidence, option],
    }));
  }

  function summarizeProtocol() {
    setHelperResult({
      title: "Neutrale Kurzfassung",
      lines: [
        `Sachlicher Ton: ${protocol.type} im Bereich ${protocol.area}.`,
        protocol.description ? "Keine Schuldzuweisung." : "Nur beobachtbare Fakten sind erfasst.",
        "Neutral formulieren statt bewerten.",
        protocol.description ? "Nur beobachtbare Fakten." : "Beschreibung noch ergänzen.",
      ],
    });
    onNotify?.("Eingabe verarbeitet");
  }

  function checkMissingDetails() {
    const checklist = [
      protocol.date ? "Datum vorhanden" : "Datum fehlt",
      protocol.time ? "Uhrzeit vorhanden" : "Uhrzeit fehlt",
      protocol.location ? "Ort vorhanden" : "Ort fehlt",
      protocol.description ? "Beschreibung vorhanden" : "Beschreibung fehlt",
      protocol.evidence.length > 0 ? "Hinweise erfasst" : "Hinweise fehlen",
      protocol.burden ? "Belastung eingeschätzt" : "Belastung fehlt",
      protocol.danger ? "Gefahr eingeschätzt" : "Gefahr fehlt",
    ];

    setHelperResult({
      title: "Fehlende Details",
      lines: checklist,
    });
    onNotify?.("Eingabe verarbeitet");
  }

  function assessRisk() {
    const risk = protocol.danger === "Ja, direkte Gefahr" ? "hoch" : protocol.danger === "Ja, es könnte eskalieren" ? "mittel" : protocol.burden >= 4 ? "mittel" : "niedrig";
    const reason =
      risk === "hoch"
        ? "Es liegt direkte Gefahr vor."
        : risk === "mittel"
          ? "Die Situation ist belastend oder kann eskalieren."
          : "Aktuell keine direkte Eskalation beschrieben.";

    setHelperResult({
      title: "Risiko-Einschätzung",
      lines: [`Risiko: ${risk}`, reason, "Nur Demo-Einschätzung, menschliche Prüfung erforderlich."],
    });
    onNotify?.("Eingabe verarbeitet");
  }

  function prepareReport() {
    const category = protocol.type;
    const risk = protocol.danger === "Ja, direkte Gefahr" ? "Hoch" : protocol.danger === "Ja, es könnte eskalieren" ? "Mittel" : protocol.burden >= 4 ? "Mittel" : "Niedrig";
    const caseNumber = `DBPA-${String(Date.now()).slice(-6)}`;

    setHelperResult({
      title: "Meldungsvorschau",
      lines: [
        `Kategorie: ${category}`,
        `Kurzbeschreibung: ${protocol.description.slice(0, 90) || "Keine Kurzbeschreibung."}`,
        `Risiko: ${risk}`,
        `Wichtige Details: ${protocol.location || "Ort offen"}`,
        `Nächster Schritt: ${protocol.danger === "Ja, direkte Gefahr" ? "Sofort reale Hilfe kontaktieren." : "Für menschliche Prüfung vorbereiten."}`,
        `Demo-Fallnummer: ${caseNumber}`,
      ],
    });
    onPrepareProtocol(protocol);
    setNotice("Meldung nur als Demo-Vorschau vorbereitet.");
    onNotify?.("Meldungsvorschau erstellt");
  }

  function showNextSteps() {
    setHelperResult({
      title: "Nächste Schritte",
      lines: [
        "Situation sichern.",
        "Sachlich dokumentieren.",
        "Unterstützung holen.",
        protocol.danger === "Ja, direkte Gefahr" ? "Bei Gefahr reale Hilfe kontaktieren." : "Ggf. anonyme Meldung vorbereiten.",
      ],
    });
    onNotify?.("Eingabe verarbeitet");
  }

  function saveDraft() {
    onSaveProtocol(protocol);
    setNotice("Dieses Protokoll wurde nur lokal im Demo-Prototyp vorgemerkt.");
    onDirtyChange?.(false);
    onResetDirty?.();
    onNotify?.("Demo-Protokoll vorgemerkt");
  }

  function deleteDraft() {
    if (!latestProtocolId) {
      setNotice("Kein vorgemerktes Protokoll zum Löschen vorhanden.");
      return;
    }

    onDeleteProtocol(latestProtocolId);
    setProtocol(emptyProtocol());
    setHelperResult({
      title: "Protokoll gelöscht",
      lines: ["Der aktuelle lokale Demoeintrag wurde als gelöscht markiert.", "Es wurden keine Daten an einen Server gesendet."],
    });
    setNotice("Das Protokoll wurde lokal als gelöscht markiert.");
    onDirtyChange?.(false);
    onResetDirty?.();
    onNotify?.("Eingabe zurückgesetzt");
  }

  function useAsReport() {
    onUseAsReport(protocol);
    setNotice("Protokoll wurde als Vorlage für die Meldung übernommen.");
    onDirtyChange?.(false);
    onResetDirty?.();
    onNotify?.("Meldungsvorschau erstellt");
  }

  return (
    <ViewFrame>
      <section className="grid gap-6 p-5 lg:grid-cols-[1.02fr_0.98fr] lg:p-6">
        <div className="space-y-5">
          <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
            <p className="text-sm font-black uppercase tracking-wider text-red-200">Protokoll</p>
            <h2 className="mt-2 text-3xl font-black">Incident sauber dokumentieren</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
              Das Protokoll hilft, einen Vorfall vor einer Meldung sachlich und strukturiert festzuhalten.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">A) Grunddaten</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-black text-db-dark">Datum</span>
                  <input className="field" type="date" value={protocol.date} onChange={(event) => updateField("date", event.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block font-black text-db-dark">Uhrzeit</span>
                  <input className="field" type="time" value={protocol.time} onChange={(event) => updateField("time", event.target.value)} />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block font-black text-db-dark">Ort / Kontext</span>
                  <input className="field" value={protocol.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Werkstatt, Bahnhof, Büro, Chat..." />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block font-black text-db-dark">Bereich</span>
                  <select className="field" value={protocol.area} onChange={(event) => updateField("area", event.target.value)}>
                    {profileAreas.map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">B) Art der Situation</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField("type", type)}
                    className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                      protocol.type === type ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">C) Beschreibung</p>
              <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Beschreibe die Situation sachlich. Du musst keine Namen nennen.</p>
              <textarea className="field mt-4 min-h-40 resize-y" value={protocol.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Was ist passiert?" />
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">D) Beteiligung</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolInvolvement.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateField("involvement", item)}
                    className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                      protocol.involvement === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">E) Wiederholung</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolRepetition.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateField("repetition", item)}
                    className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                      protocol.repetition === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">F) Beweise / Hinweise</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolEvidence.map((item) => (
                  <label key={item} className="flex items-center gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 font-semibold text-db-dark">
                    <input type="checkbox" checked={protocol.evidence.includes(item)} onChange={() => toggleEvidence(item)} className="h-4 w-4 accent-db-red" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">G) Belastung</p>
              <div className="mt-4">
                <input type="range" min="1" max="5" value={protocol.burden} onChange={(event) => updateField("burden", Number(event.target.value))} className="w-full accent-db-red" />
                <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Wie stark belastet dich die Situation? {protocol.burden}/5</p>
              </div>
            </div>

            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm md:col-span-2">
              <p className="text-lg font-black text-db-dark">H) Akute Gefahr</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {protocolDangerOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateField("danger", item)}
                    className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
                      protocol.danger === item ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {protocol.danger === "Ja, direkte Gefahr" && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-7 text-red-700">
                  Bei akuter Gefahr bitte sofort reale Hilfe kontaktieren.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-db-dark">KI-Protokollhilfe</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">
              Die lokale Demo hilft, das Protokoll neutral, klar und strukturiert zu formulieren.
            </p>
            <div className="mt-4 grid gap-3">
              <button type="button" onClick={summarizeProtocol} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Sachlich zusammenfassen
              </button>
              <button type="button" onClick={checkMissingDetails} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Fehlende Details prüfen
              </button>
              <button type="button" onClick={assessRisk} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Risiko einschätzen
              </button>
              <button type="button" onClick={prepareReport} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Meldung vorbereiten
              </button>
              <button type="button" onClick={showNextSteps} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Nächste Schritte anzeigen
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-db-dark p-4 text-white">
            <p className="text-sm font-black uppercase tracking-wider text-red-200">Hinweis</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-white/80">
              {notice}
            </p>
          </div>

          {helperResult && (
            <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-black text-db-dark">{helperResult.title}</h3>
              <div className="mt-4 grid gap-3">
                {helperResult.lines.map((line) => (
                  <div key={line} className="rounded-lg bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-db-dark">Aktionen</p>
            <div className="mt-4 grid gap-3">
              <button type="button" onClick={saveDraft} className="rounded-xl bg-db-red px-4 py-3 text-left font-black text-white hover:bg-red-700">
                Protokoll lokal vormerken
              </button>
              <button type="button" onClick={deleteDraft} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Protokoll löschen
              </button>
              <button type="button" onClick={useAsReport} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Als Meldung übernehmen
              </button>
              <button type="button" onClick={() => onNavigate("meldung")} className="rounded-xl bg-db-soft px-4 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
                Zur Meldung wechseln
              </button>
            </div>
            <p className="mt-4 text-sm font-semibold leading-7 text-db-rail">
              Dieses Protokoll wurde nur lokal im Demo-Prototyp vorgemerkt.
            </p>
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-db-dark">Meine Demo-Protokolle</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Lokale Demo-Daten nur im Browser.</p>
            <div className="mt-4 space-y-3">
              {protocols.length ? (
                protocols.map((entry) => (
                  <article key={entry.id} className="rounded-xl border border-db-dark/10 bg-db-soft p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-db-dark">{entry.type}</p>
                      <span className="rounded bg-white px-2 py-1 text-xs font-black text-db-rail ring-1 ring-db-dark/10">{entry.status}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">
                      {entry.date} · Risiko {entry.risk}
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">
                  Noch keine vorgemerkten Demo-Protokolle vorhanden.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </ViewFrame>
  );
}

function localRisk(protocol) {
  if (protocol.danger === "Ja" || protocol.danger === "Ja, direkte Gefahr") {
    return "Hoch";
  }

  if (protocol.danger === "Ja, es könnte eskalieren" || Number(protocol.burden) >= 4) {
    return "Mittel";
  }

  return "Niedrig";
}

function filterProtocols(protocols, filters) {
  const riskWeight = { Hoch: 3, Mittel: 2, Niedrig: 1 };
  const search = filters.search.trim().toLowerCase();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - ((startOfToday.getDay() + 6) % 7));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return protocols
    .filter((item) => {
      const haystack = [item.id, item.type, item.location, item.description, item.status].join(" ").toLowerCase();
      const date = item.date ? new Date(`${item.date}T00:00:00`) : null;
      const folderMatch =
        filters.activeFolder === "Alle Protokolle" ||
        item.folder === filters.activeFolder ||
        (filters.activeFolder === "Entwürfe" && item.status === "Entwurf") ||
        (filters.activeFolder === "Hohe Dringlichkeit" && item.risk === "Hoch") ||
        (filters.activeFolder === "Beobachten" && item.status === "Beobachten") ||
        (filters.activeFolder === "Für Meldung vorbereiten" && item.status === "In Prüfung vorbereiten") ||
        (filters.activeFolder === "Abgeschlossen" && item.status === "Abgeschlossen");

      const periodMatch =
        filters.periodFilter === "Alle" ||
        (date && filters.periodFilter === "Heute" && date >= startOfToday) ||
        (date && filters.periodFilter === "Diese Woche" && date >= startOfWeek) ||
        (date && filters.periodFilter === "Dieser Monat" && date >= startOfMonth);

      return (
        folderMatch &&
        periodMatch &&
        (!search || haystack.includes(search)) &&
        (filters.categoryFilter === "Alle" || item.type === filters.categoryFilter) &&
        (filters.riskFilter === "Alle" || item.risk === filters.riskFilter) &&
        (filters.statusFilter === "Alle" || item.status === filters.statusFilter) &&
        (filters.areaFilter === "Alle" || item.area === filters.areaFilter)
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "Älteste zuerst") {
        return String(a.updatedAt || "").localeCompare(String(b.updatedAt || ""));
      }
      if (filters.sortBy === "Höchstes Risiko") {
        return (riskWeight[b.risk] || 0) - (riskWeight[a.risk] || 0);
      }
      if (filters.sortBy === "Kategorie A-Z") {
        return String(a.type || "").localeCompare(String(b.type || ""), "de");
      }
      return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
    });
}

function FieldLabel({ children }) {
  return <span className="mb-2 block font-black text-db-dark">{children}</span>;
}

function ProtocolForm({ folders, protocol, toggleEvidence, updateField }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <h3 className="text-xl font-black text-db-dark">Neues Protokoll</h3>
        <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Sachlich beschreiben. Keine echten Namen nötig.</p>
      </div>

      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-db-dark">Grunddaten</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label>
            <FieldLabel>Datum</FieldLabel>
            <input className="field" type="date" value={protocol.date} onChange={(event) => updateField("date", event.target.value)} />
          </label>
          <label>
            <FieldLabel>Uhrzeit</FieldLabel>
            <input className="field" type="time" value={protocol.time} onChange={(event) => updateField("time", event.target.value)} />
          </label>
          <label className="md:col-span-2">
            <FieldLabel>Ort / Kontext</FieldLabel>
            <input className="field" value={protocol.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Werkstatt, Bahnhof, Büro, Gruppenchat..." />
          </label>
          <label>
            <FieldLabel>Bereich</FieldLabel>
            <select className="field" value={protocol.area} onChange={(event) => updateField("area", event.target.value)}>
              {profileAreas.map((area) => <option key={area}>{area}</option>)}
            </select>
          </label>
          <label>
            <FieldLabel>Status</FieldLabel>
            <select className="field" value={protocol.status} onChange={(event) => updateField("status", event.target.value)}>
              {protocolStatusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="md:col-span-2">
            <FieldLabel>Ordner</FieldLabel>
            <select className="field" value={protocol.folder} onChange={(event) => updateField("folder", event.target.value)}>
              {folders.map((folder) => <option key={folder}>{folder}</option>)}
            </select>
          </label>
        </div>
      </div>

      <ChoiceGroup title="Art der Situation" options={protocolTypes} value={protocol.type} onChange={(value) => updateField("type", value)} />

      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-db-dark">Beschreibung</p>
        <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Sachlich beschreiben. Keine echten Namen nötig.</p>
        <textarea className="field mt-4 min-h-44 resize-y py-3" value={protocol.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Was ist passiert?" />
      </div>

      <ChoiceGroup title="Beteiligung" options={protocolInvolvement} value={protocol.involvement} onChange={(value) => updateField("involvement", value)} />
      <ChoiceGroup title="Wiederholung" options={protocolRepetition} value={protocol.repetition} onChange={(value) => updateField("repetition", value)} />

      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-db-dark">Hinweise / Beweise</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {protocolEvidence.map((item) => (
            <label key={item} className="flex items-center gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 font-semibold text-db-dark">
              <input type="checkbox" checked={protocol.evidence.includes(item)} onChange={() => toggleEvidence(item)} className="h-4 w-4 accent-db-red" />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <p className="text-lg font-black text-db-dark">Belastung</p>
        <input type="range" min="1" max="5" value={protocol.burden} onChange={(event) => updateField("burden", Number(event.target.value))} className="mt-4 w-full accent-db-red" />
        <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Belastung: {protocol.burden}/5</p>
      </div>

      <ChoiceGroup title="Akute Gefahr" options={protocolDangerOptions} value={protocol.danger} onChange={(value) => updateField("danger", value)} />
    </div>
  );
}

function ChoiceGroup({ onChange, options, title, value }) {
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <p className="text-lg font-black text-db-dark">{title}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl border p-4 text-left font-black transition hover:border-db-red ${
              value === option ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProtocolHelper({ helperResult, onAssessRisk, onCheckMissing, onNextSteps, onPrepareReport, onSummarize }) {
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <p className="text-lg font-black text-db-dark">KI-Protokollhilfe</p>
      <p className="mt-2 text-sm font-semibold leading-7 text-db-rail">Lokale Demo-Regeln, keine echte KI-Analyse.</p>
      <div className="mt-4 grid gap-2">
        {[
          ["Sachlich zusammenfassen", onSummarize],
          ["Fehlende Details prüfen", onCheckMissing],
          ["Risiko einschätzen", onAssessRisk],
          ["Meldung vorbereiten", onPrepareReport],
          ["Nächste Schritte anzeigen", onNextSteps],
        ].map(([label, handler]) => (
          <button key={label} type="button" onClick={handler} className="rounded-lg bg-db-soft px-4 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
            {label}
          </button>
        ))}
      </div>
      {helperResult && (
        <div className="mt-5 rounded-xl bg-db-soft p-4">
          <p className="font-black text-db-dark">{helperResult.title}</p>
          {helperResult.summary && <p className="mt-3 text-sm font-semibold leading-7 text-db-rail">{helperResult.summary}</p>}
          <div className="mt-3 grid gap-2">
            {helperResult.lines.map((line) => (
              <p key={line} className="rounded bg-white p-3 text-sm font-semibold leading-6 text-db-rail">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProtocolActions({ notice, onExport, onNew, onSave, onUseAsReport }) {
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
      <p className="text-lg font-black text-db-dark">Aktionen</p>
      <div className="mt-4 grid gap-2">
        <button type="button" onClick={onSave} className="rounded bg-db-red px-5 py-3 font-black text-white hover:bg-red-700">Protokoll lokal speichern</button>
        <button type="button" onClick={onUseAsReport} className="rounded-lg bg-db-soft px-5 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Als Meldung übernehmen</button>
        <button type="button" onClick={onExport} className="rounded-lg bg-db-soft px-5 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Export-Vorschau</button>
        <button type="button" onClick={onNew} className="rounded-lg bg-db-soft px-5 py-3 text-left text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Neues Protokoll starten</button>
      </div>
      <p className="mt-4 rounded-lg bg-db-soft p-3 text-sm font-semibold leading-6 text-db-rail">{notice}</p>
    </div>
  );
}

function ProtocolRegister(props) {
  const {
    areaFilter,
    categoryFilter,
    filteredProtocols,
    folders,
    onAssignFolder,
    onDelete,
    onDuplicate,
    onEdit,
    onExport,
    onOpen,
    onPrepareReport,
    periodFilter,
    riskFilter,
    search,
    setAreaFilter,
    setCategoryFilter,
    setPeriodFilter,
    setRiskFilter,
    setSearch,
    setSortBy,
    setStatusFilter,
    sortBy,
    statusFilter,
  } = props;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_repeat(5,1fr)]">
          <input className="field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Protokolle durchsuchen..." />
          <FilterSelect value={periodFilter} onChange={setPeriodFilter} options={protocolPeriodOptions} />
          <FilterSelect value={categoryFilter} onChange={setCategoryFilter} options={["Alle", ...protocolTypes]} />
          <FilterSelect value={riskFilter} onChange={setRiskFilter} options={protocolRiskOptions} />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={["Alle", ...protocolStatusOptions]} />
          <FilterSelect value={areaFilter} onChange={setAreaFilter} options={["Alle", ...profileAreas]} />
        </div>
        <div className="mt-3 max-w-xs">
          <FilterSelect value={sortBy} onChange={setSortBy} options={protocolSortOptions} />
        </div>
      </div>

      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <h3 className="text-xl font-black text-db-dark">Protokollregister</h3>
        {filteredProtocols.length === 0 ? (
          <p className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">Keine Treffer für diese Suche.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[960px] border-separate border-spacing-y-2 text-left">
              <thead className="text-xs font-black uppercase tracking-wide text-db-rail">
                <tr>
                  {["ID", "Datum", "Uhrzeit", "Kategorie", "Ort/Kontext", "Risiko", "Status", "Letzte Änderung", "Aktionen"].map((head) => (
                    <th key={head} className="px-3 py-2">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProtocols.map((entry) => (
                  <tr key={entry.id} className="bg-db-soft text-sm font-semibold text-db-rail">
                    <td className="rounded-l-lg px-3 py-3 font-black text-db-dark">{entry.id}</td>
                    <td className="px-3 py-3">{entry.date}</td>
                    <td className="px-3 py-3">{entry.time}</td>
                    <td className="px-3 py-3">{entry.type}</td>
                    <td className="px-3 py-3">{entry.location || entry.area}</td>
                    <td className="px-3 py-3"><RiskBadge risk={entry.risk} /></td>
                    <td className="px-3 py-3">{entry.status}</td>
                    <td className="px-3 py-3">{formatDateTime(entry.updatedAt)}</td>
                    <td className="rounded-r-lg px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <ActionButton label="Öffnen" onClick={() => onOpen(entry)} />
                        <ActionButton label="Bearbeiten" onClick={() => onEdit(entry)} />
                        <ActionButton label="Duplizieren" onClick={() => onDuplicate(entry)} />
                        <ActionButton label="Löschen" onClick={() => onDelete(entry)} />
                        <ActionButton label="Als Meldung vorbereiten" onClick={() => onPrepareReport(entry)} />
                        <ActionButton label="Export-Vorschau" onClick={() => onExport(entry)} />
                      </div>
                      <select className="field mt-2 h-10 text-xs" value={entry.folder || "Alle Protokolle"} onChange={(event) => onAssignFolder(entry, event.target.value)}>
                        {folders.map((folder) => <option key={folder}>{folder}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ onChange, options, value }) {
  return (
    <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

function AttachmentPreview({ file, onRemove }) {
  const source = file.previewData || file.sessionUrl || "";
  const type = String(file.type || "");
  const kind = type.startsWith("image/") ? "Foto" : type.startsWith("audio/") ? "Audio" : type.startsWith("video/") ? "Video" : file.category || "Datei";

  return (
    <article className="rounded-xl bg-white p-3 ring-1 ring-db-dark/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-db-dark">{file.name || "Datei"}</p>
          <p className="mt-1 text-xs font-semibold text-db-rail">{kind} · {formatFileSize(file.size)} · {file.status || "nur Metadaten gespeichert"}</p>
        </div>
        {onRemove && (
          <button type="button" onClick={onRemove} className="rounded bg-db-soft px-3 py-2 text-xs font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
            Entfernen
          </button>
        )}
      </div>
      {source && type.startsWith("image/") && <img src={source} alt="" className="mt-3 max-h-48 w-full rounded-lg object-cover" />}
      {source && type.startsWith("audio/") && <audio className="mt-3 w-full" controls src={source}>Audio-Vorschau nicht verfügbar.</audio>}
      {source && type.startsWith("video/") && <video className="mt-3 max-h-64 w-full rounded-lg bg-black" controls src={source}>Video-Vorschau nicht verfügbar.</video>}
      {!source && <p className="mt-3 rounded-lg bg-db-soft p-3 text-xs font-semibold leading-5 text-db-rail">Keine Vorschau gespeichert. Originaldatei separat sichern.</p>}
    </article>
  );
}

function ActionButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="rounded bg-white px-2 py-1 text-xs font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red"
    >
      {label}
    </button>
  );
}

function RiskBadge({ risk }) {
  const style = risk === "Hoch" ? "bg-red-50 text-red-700 ring-red-100" : risk === "Mittel" ? "bg-amber-50 text-amber-700 ring-amber-100" : "bg-emerald-50 text-emerald-700 ring-emerald-100";
  return <span className={`rounded px-2 py-1 text-xs font-black ring-1 ${style}`}>{risk || "Niedrig"}</span>;
}

function FolderView({ activeFolder, folders, newFolder, onAddFolder, protocols, setActiveFolder, setNewFolder }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <h3 className="text-xl font-black text-db-dark">Ordner</h3>
        <div className="mt-4 grid gap-2">
          {folders.map((folder) => (
            <button key={folder} type="button" onClick={() => setActiveFolder(folder)} className={`rounded-lg px-4 py-3 text-left text-sm font-black ring-1 ${activeFolder === folder ? "bg-red-50 text-db-red ring-red-100" : "bg-db-soft text-db-dark ring-db-dark/10"}`}>
              {folder} ({filterProtocols(protocols, { activeFolder: folder, areaFilter: "Alle", categoryFilter: "Alle", periodFilter: "Alle", riskFilter: "Alle", search: "", sortBy: "Neueste zuerst", statusFilter: "Alle" }).length})
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-2">
          <input className="field" value={newFolder} onChange={(event) => setNewFolder(event.target.value)} placeholder="Neuen Ordner erstellen" />
          <button type="button" onClick={onAddFolder} className="rounded bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Ordner hinzufügen</button>
        </div>
      </div>
      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <h3 className="text-xl font-black text-db-dark">{activeFolder}</h3>
        {filterProtocols(protocols, { activeFolder, areaFilter: "Alle", categoryFilter: "Alle", periodFilter: "Alle", riskFilter: "Alle", search: "", sortBy: "Neueste zuerst", statusFilter: "Alle" }).length === 0 ? (
          <p className="mt-4 rounded-xl bg-db-soft p-4 text-sm font-semibold leading-7 text-db-rail">Dieser Ordner ist leer.</p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {filterProtocols(protocols, { activeFolder, areaFilter: "Alle", categoryFilter: "Alle", periodFilter: "Alle", riskFilter: "Alle", search: "", sortBy: "Neueste zuerst", statusFilter: "Alle" }).map((entry) => (
              <article key={entry.id} className="rounded-xl bg-db-soft p-4">
                <p className="font-black text-db-dark">{entry.id}</p>
                <p className="mt-1 text-sm font-semibold text-db-rail">{entry.type} · {entry.status}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProtocolDetails({ onDelete, onEdit, onExport, onPrepareReport, protocol }) {
  if (!protocol) {
    return <p className="rounded-xl border border-db-dark/10 bg-white p-5 text-sm font-semibold leading-7 text-db-rail shadow-sm">Wähle ein Protokoll aus, um Details zu sehen.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-db-dark p-5 text-white shadow-panel">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-red-200">{protocol.id}</p>
            <h3 className="mt-2 text-3xl font-black">{protocol.type}</h3>
            <p className="mt-2 text-sm font-semibold leading-7 text-white/75">{protocol.date} · {protocol.time}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RiskBadge risk={protocol.risk} />
            <span className="rounded bg-white px-2 py-1 text-xs font-black text-db-dark">{protocol.status}</span>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PreviewRow label="Grunddaten" value={`${protocol.area} · ${protocol.location || "Kontext offen"}`} />
        <PreviewRow label="Beteiligung" value={protocol.involvement} />
        <PreviewRow label="Wiederholung" value={protocol.repetition} />
        <PreviewRow label="Hinweise / Beweise" value={protocol.evidence.join(", ") || "Keine Hinweise erfasst"} />
        <PreviewRow label="Belastung" value={`${protocol.burden}/5`} />
        <PreviewRow label="Akute Gefahr" value={protocol.danger} />
      </div>
      <SectionCard title="Beschreibung" text={protocol.description || "Keine Beschreibung erfasst."} />
      <SectionCard title="KI-Zusammenfassung" text={protocol.aiSummary || "Noch keine KI-Zusammenfassung erstellt."} />
      <SectionCard title="Nächste Schritte" text={protocol.nextStep || "Noch kein nächster Schritt hinterlegt."} />
      <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
        <h3 className="text-xl font-black text-db-dark">Verlauf</h3>
        <div className="mt-4 grid gap-2">
          {(protocol.history || []).map((item, index) => (
            <div key={`${item.label}-${index}`} className="rounded-lg bg-db-soft p-3 text-sm font-semibold leading-6 text-db-rail">
              {item.label} · {formatDateTime(item.at)}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onEdit(protocol)} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Bearbeiten</button>
        <button type="button" onClick={() => onPrepareReport(protocol)} className="rounded-lg bg-db-red px-4 py-3 text-sm font-black text-white hover:bg-red-700">Als Meldung übernehmen</button>
        <button type="button" onClick={() => onExport(protocol)} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Export-Vorschau</button>
        <button type="button" onClick={() => onDelete(protocol)} className="rounded-lg bg-db-soft px-4 py-3 text-sm font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">Löschen</button>
      </div>
    </div>
  );
}

function ExportPreview({ protocol }) {
  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-panel">
      <p className="text-sm font-black uppercase tracking-wider text-db-red">Export-Vorschau</p>
      <h3 className="mt-2 text-2xl font-black text-db-dark">Druckansicht Protokoll</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <PreviewRow label="Protokoll-ID" value={protocol.id || "Noch nicht gespeichert"} />
        <PreviewRow label="Datum/Uhrzeit" value={`${protocol.date} · ${protocol.time}`} />
        <PreviewRow label="Kategorie" value={protocol.type} />
        <PreviewRow label="Risiko" value={protocol.risk || localRisk(protocol)} />
        <PreviewRow label="Kontext" value={protocol.location || protocol.area} />
        <PreviewRow label="Nächster Schritt" value={protocol.nextStep || "Für menschliche Prüfung vorbereiten."} />
      </div>
      <div className="mt-4">
        <SectionCard title="Beschreibung" text={protocol.description || "Keine Beschreibung erfasst."} />
      </div>
      <div className="mt-4">
        <SectionCard title="KI-Zusammenfassung" text={protocol.aiSummary || "Noch keine KI-Zusammenfassung erstellt."} />
      </div>
    </div>
  );
}

function ProfileViewLegacy({ profile, setProfile, onNavigate }) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function saveProfile() {
    setProfile({ ...draft, confirmed: true });
  }

  return (
    <ViewFrame>
      <section className="grid gap-6 p-5 lg:grid-cols-[1fr_0.95fr] lg:p-6">
        <div className="space-y-4 rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-db-dark p-4 text-white">
            <p className="text-sm font-black uppercase tracking-wider text-red-200">Profil</p>
            <h2 className="mt-2 text-3xl font-black">Demo-Profil</h2>
            <p className="mt-2 text-sm font-semibold leading-7 text-white/75">
              Dies ist kein echtes Login-System. Es werden keine echten Konten erstellt.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Anzeigename optional</span>
            <input className="field" value={draft.displayName} onChange={(event) => updateField("displayName", event.target.value)} placeholder="z. B. Samira" />
          </label>

          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Rolle</span>
            <select className="field" value={draft.role} onChange={(event) => updateField("role", event.target.value)}>
              {profileRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block font-black text-db-dark">Bereich</span>
            <select className="field" value={draft.area} onChange={(event) => updateField("area", event.target.value)}>
              {profileAreas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 font-bold text-db-dark">
            <input type="checkbox" checked={draft.anonymous} onChange={(event) => updateField("anonymous", event.target.checked)} className="h-4 w-4 accent-db-red" />
            Ich möchte anonym bleiben
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 font-bold text-db-dark">
            <input type="checkbox" checked={draft.confirmed} onChange={(event) => updateField("confirmed", event.target.checked)} className="h-4 w-4 accent-db-red" />
            Ich verstehe, dass dies nur ein lokaler Demo-Prototyp ist.
          </label>

          <button type="button" onClick={saveProfile} className="rounded bg-db-red px-5 py-3 font-black text-white transition hover:bg-red-700">
            Profil speichern
          </button>
          <p className="text-sm font-semibold leading-6 text-db-rail">
            Keine echten DB-E-Mailadressen, Kennungen oder Passwörter erforderlich.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-db-dark">Profilzusammenfassung</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <PreviewRow label="Rolle" value={profile.role} />
              <PreviewRow label="Bereich" value={profile.area} />
              <PreviewRow label="Anonymitätsstatus" value={profile.anonymous ? "Anonym aktiv" : "Namen sichtbar im Demo-Profil"} />
              <PreviewRow label="Demo-Modus" value={profile.confirmed ? "Aktiv bestätigt" : "Noch nicht bestätigt"} />
              <PreviewRow label="Anzeigename" value={profile.displayName || "Kein Anzeigename gesetzt"} />
              <PreviewRow label="Hinweis" value="Dies ist kein echtes Login-System." />
            </div>
          </div>

          <div className="rounded-xl border border-db-dark/10 bg-db-dark p-5 text-white">
            <p className="text-sm font-black uppercase tracking-wider text-red-200">Hinweis</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-white/80">
              Das Profil bleibt nur als Demo im Browser gespeichert und dient der lokalen Präsentation.
            </p>
          </div>

          <button type="button" onClick={() => onNavigate("overview")} className="rounded-xl bg-db-soft px-5 py-3 text-left font-black text-db-dark ring-1 ring-db-dark/10 hover:bg-red-50 hover:text-db-red">
            Zur Übersicht
          </button>
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
