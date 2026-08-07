import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, FlaskConical, WifiOff } from "lucide-react";
import { AppLock } from "./components/AppLock.jsx";
import { ContactsView } from "./components/ContactsView.jsx";
import DashboardAnalytics from "./components/DashboardAnalytics.jsx";
import { DashboardHome } from "./components/DashboardHome.jsx";
import { EmergencyModal } from "./components/EmergencyModal.jsx";
import { FloatingChatWidget } from "./components/FloatingChatWidget.jsx";
import { Footer } from "./components/Footer.jsx";
import { GlobalSearch } from "./components/GlobalSearch.jsx";
import { HRDashboard } from "./components/HRDashboard.jsx";
import { LearningHubView } from "./components/LearningHubView.jsx";
import { Navigation } from "./components/Navigation.jsx";
import { PanicButton } from "./components/PanicButton.jsx";
import PrivacyCompliance from "./components/PrivacyCompliance.jsx";
import { ProfileView } from "./components/ProfileView.jsx";
import ProjectOverview from "./components/ProjectOverview.jsx";
import { RecordAndReportView } from "./components/RecordAndReportView.jsx";
import { RightsAndLawsView } from "./components/RightsAndLawsView.jsx";
import { SSOLoginModal } from "./components/SSOLoginModal.jsx";
import SupportPage from "./components/SupportPage.jsx";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: "easeIn" } },
};

export default function App() {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("home");
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHRMode, setIsHRMode] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isSSOOpen, setIsSSOOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== "undefined" && !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isLocked) return <AppLock onUnlock={() => setIsLocked(false)} />;

  if (isHRMode) return <HRDashboard onExit={() => setIsHRMode(false)} />;

  const view = (
    <ActiveView
      activeTab={activeTab}
      onNavigate={setActiveTab}
      onOpenEmergency={() => setIsEmergencyOpen(true)}
    />
  );

  return (
    <div className="relative flex min-h-screen flex-col bg-db-soft text-slate-900 selection:bg-db-red selection:text-white dark:bg-db-dark dark:text-white">
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={setActiveTab} />

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <PrototypeBanner />
      <div className="h-1 w-full bg-db-red shadow-sm" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-28 sm:px-6 sm:py-8">
        {activeTab !== "home" && (
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-db-dark/10 bg-white px-4 py-2 text-xs font-black text-db-dark shadow-sm transition hover:border-db-red hover:text-db-red focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zur Übersicht
          </button>
        )}

        {reduceMotion ? (
          <div key={activeTab}>{view}</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} variants={pageVariants} initial="initial" animate="animate" exit="exit">
              {view}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <SSOLoginModal
        isOpen={isSSOOpen}
        onClose={() => setIsSSOOpen(false)}
        onLoginSuccess={() => {
          setIsSSOOpen(false);
          setIsHRMode(true);
        }}
      />

      <FloatingChatWidget />
      <PanicButton />
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />

      {isOffline && (
        <div className="fixed inset-x-0 bottom-0 z-[80] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-xs font-black text-amber-950 shadow-lg" role="status" aria-live="polite">
          <WifiOff className="h-4 w-4" aria-hidden="true" />
          Offline: Bereits geladene statische Inhalte können verfügbar sein. Eingaben und Meldungen werden nicht automatisch übertragen oder synchronisiert.
        </div>
      )}

      <Footer onNavigate={setActiveTab} onToggleHR={() => setIsSSOOpen(true)} />
    </div>
  );
}

function ActiveView({ activeTab, onNavigate, onOpenEmergency }) {
  switch (activeTab) {
    case "record-report":
      return <RecordAndReportView />;
    case "learning":
      return <LearningHubView />;
    case "rights":
      return <RightsAndLawsView onBack={() => onNavigate("home")} />;
    case "project":
      return <ProjectOverview />;
    case "profile":
      return <ProfileView />;
    case "contacts":
      return <ContactsView />;
    case "privacy":
      return <PrivacyCompliance />;
    case "support":
      return <SupportPage onNavigate={onNavigate} />;
    case "analytics":
      return <DashboardAnalytics />;
    case "home":
    default:
      return <DashboardHome onNavigate={onNavigate} onOpenEmergency={onOpenEmergency} />;
  }
}

function PrototypeBanner() {
  return (
    <div className="border-b border-violet-200 bg-violet-50 px-4 py-2 text-violet-950 dark:border-violet-900/50 dark:bg-violet-950/25 dark:text-violet-200">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-center text-[11px] font-bold sm:text-xs">
        <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Innovationsprototyp · keine offizielle DB-Anwendung · keine echten Personen- oder Falldaten eingeben
      </div>
    </div>
  );
}
