import React, { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation.jsx";
import { DashboardHome } from "./components/DashboardHome.jsx";
import SupportPage from "./components/SupportPage.jsx";
import { RecordAndReportView } from "./components/RecordAndReportView.jsx";
import { LearningHubView } from "./components/LearningHubView.jsx";
import { EmergencyModal } from "./components/EmergencyModal.jsx";
import { Footer } from "./components/Footer.jsx";
import { FloatingChatWidget } from "./components/FloatingChatWidget.jsx";
import { ProfileView } from "./components/ProfileView.jsx";
import { ContactsView } from "./components/ContactsView.jsx";
import { GlobalSearch } from "./components/GlobalSearch.jsx";
import { RightsAndLawsView } from "./components/RightsAndLawsView.jsx";
import { RollenPostfach } from "./components/RollenPostfach.jsx";
import { AppLock } from "./components/AppLock.jsx";
import { istGeteilt, modusGewaehlt } from "./lib/geraet.js";
import { PanicButton } from "./components/PanicButton.jsx";
import { RollenWechsel } from "./components/RollenWechsel.jsx";

import DashboardAnalytics from "./components/DashboardAnalytics.jsx";
import ProjectOverview from "./components/ProjectOverview.jsx";
import PrivacyCompliance from "./components/PrivacyCompliance.jsx";
import { ArrowLeft, WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, filter: "blur(4px)", transition: { duration: 0.2, ease: "easeIn" } }
};

export default function App() {
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'support' | 'record-report' | 'learning' | 'analytics' | 'project' | 'privacy'
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // null = Azubi-Ansicht. Sonst die Id der Rolle, deren Postfach angesehen wird.
  const [aktiveRolle, setAktiveRolle] = useState(null);
  // Auf einem geteilten Gerät gibt es keine gespeicherten Inhalte und damit
  // nichts zu sperren. Ist der Modus noch nicht gewählt, fragt AppLock danach.
  const [isLocked, setIsLocked] = useState(() => !modusGewaehlt() || !istGeteilt());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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
  const [istRollenwahlOffen, setIstRollenwahlOffen] = useState(false);

  if (isLocked) {
    return <AppLock onUnlock={() => setIsLocked(false)} />;
  }

  // Die Rollenauswahl wird an beiden Stellen gebraucht: aus der Azubi-Ansicht
  // heraus und aus einem Postfach, um direkt zur nächsten Rolle zu wechseln.
  const rollenauswahl = (
    <RollenWechsel
      isOpen={istRollenwahlOffen}
      onClose={() => setIstRollenwahlOffen(false)}
      aktiveRolle={aktiveRolle}
      onRolleWaehlen={(rolleId) => {
        setIstRollenwahlOffen(false);
        setAktiveRolle(rolleId);
      }}
    />
  );

  if (aktiveRolle) {
    return (
      <>
        <RollenPostfach
          key={aktiveRolle}
          rolleId={aktiveRolle}
          onExit={() => setAktiveRolle(null)}
          onRolleWechseln={() => setIstRollenwahlOffen(true)}
        />
        {rollenauswahl}
        {/* Gerade hier gebraucht: Im Postfach stehen fremde Meldungen auf dem
            Bildschirm. Wenn jemand hereinkommt, muss das genauso schnell weg
            sein wie in der Azubi-Ansicht. */}
        <PanicButton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-db-soft dark:bg-db-dark flex flex-col justify-between selection:bg-db-red selection:text-white relative">
      <div>
        {/* Global Search Overlay */}
        <GlobalSearch 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
          onNavigate={setActiveTab} 
        />

        {/* Top Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        
        {/* DB Red Stripe */}
        <div className="h-1 w-full db-red-stripe shadow-sm"></div>

        {/* Back Button if in any view other than home */}
        <AnimatePresence>
          {activeTab !== "home" && (
            <motion.div
              key="zurueck-leiste"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 pt-4"
            >
              <button
                type="button"
                onClick={() => setActiveTab("home")}
                className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2 text-sm font-bold text-ink border border-line/10 shadow-xs hover:border-db-red dark:hover:border-db-red hover:text-db-red dark:hover:text-db-red transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Zurück zur Übersicht (Home)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 pb-24">
          {/* Bewusst ohne AnimatePresence mode="wait": Das wartet auf die Exit-
              Animation der alten Ansicht. Läuft die nicht zu Ende, erscheint die
              neue Ansicht nie und die Navigation hängt. */}
            {activeTab === "home" && (
              <motion.div key="home" variants={pageVariants} initial="initial" animate="animate">
                <DashboardHome onNavigate={setActiveTab} onOpenEmergency={() => setIsEmergencyOpen(true)} />
              </motion.div>
            )}
            
            {activeTab === "record-report" && (
              <motion.div key="record-report" variants={pageVariants} initial="initial" animate="animate">
                <RecordAndReportView />
              </motion.div>
            )}
            
            {activeTab === "learning" && (
              <motion.div key="learning" variants={pageVariants} initial="initial" animate="animate">
                <LearningHubView />
              </motion.div>
            )}

            {activeTab === "rights" && (
              <motion.div key="rights" variants={pageVariants} initial="initial" animate="animate">
                <RightsAndLawsView onBack={() => setActiveTab("home")} />
              </motion.div>
            )}

            {activeTab === "project" && (
              <motion.div key="project" variants={pageVariants} initial="initial" animate="animate">
                <ProjectOverview />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate">
                <ProfileView />
              </motion.div>
            )}

            {activeTab === "contacts" && (
              <motion.div key="contacts" variants={pageVariants} initial="initial" animate="animate">
                <ContactsView />
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div key="privacy" variants={pageVariants} initial="initial" animate="animate">
                <PrivacyCompliance />
              </motion.div>
            )}
            
            {activeTab === "support" && (
              <motion.div key="support" variants={pageVariants} initial="initial" animate="animate">
                <SupportPage onNavigate={setActiveTab} />
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div key="analytics" variants={pageVariants} initial="initial" animate="animate">
                <DashboardAnalytics />
              </motion.div>
            )}
        </main>
      </div>

      {rollenauswahl}

      {/* Global Floating AI Chat Widget */}
      <FloatingChatWidget />

      {/* Quick Exit / Panic Button */}
      <PanicButton />

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-db-red text-white text-sm font-bold py-1.5 px-4 flex items-center justify-center gap-2 z-50">
          <WifiOff className="w-3 h-3" />
          Keine Internetverbindung. Deine Eingaben bleiben ohnehin auf diesem Gerät – nur der
          KI-Assistent antwortet solange eingeschränkt.
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={setActiveTab} onRollenAnsehen={() => setIstRollenwahlOffen(true)} />
    </div>
  );
}
