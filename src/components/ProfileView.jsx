import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  FolderLock, 
  LineChart, 
  Bookmark, 
  Award,
  FileText,
  Clock,
  ChevronRight,
  ShieldCheck,
  Video,
  Inbox,
  MessageSquare,
  Send,
  Download,
  Trash2,
  Shield,
  Eye,
  Lock,
  ArrowRight,
  Star,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { abonnieren, alleFaelle, verlaufErgaenzen } from "../lib/faelle.js";
import { eigeneFaelle, rolleFinden } from "../lib/rolle.js";
import { eingangsDatum, fristenFuer, fristStand } from "../lib/fristen.js";
import { protokollLaden } from "../lib/protokoll.js";
import { stimmungLaden, tagesbezeichnung } from "../lib/stimmung.js";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("postfach");
  // Die eigenen Vorgänge — dieselben Fälle, die im Postfach der jeweiligen
  // Stelle liegen. Antworten bleiben in diesem Tab, es geht nichts hinaus.
  const [tickets, setTickets] = useState(() => eigeneFaelle(alleFaelle()));
  useEffect(() => abonnieren((bestand) => setTickets(eigeneFaelle(bestand))), []);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (e) => {
    e.preventDefault();
    const selectedTicket = tickets.find(t => t.id === selectedTicketId);
    if (!replyText.trim() || !selectedTicket) return;

    verlaufErgaenzen(selectedTicket.id, {
      id: Date.now(),
      von: "melder",
      text: replyText,
      zeit: new Date().toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' }),
    });
    setReplyText("");
  };

  // Dieselben Einträge wie unter „Festhalten & Melden" — beide Ansichten lesen
  // denselben Gerätespeicher, sonst zeigen sie Unterschiedliches.
  const savedRecords = protokollLaden().eintraege;

  // Die echten Einträge aus dem Stimmungs-Tracker auf der Startseite.
  const stimmungsBezeichnung = {
    good: { mood: "Gut", Icon: Smile, color: "text-emerald-600 dark:text-emerald-400" },
    neutral: { mood: "Okay", Icon: Meh, color: "text-ink-muted" },
    bad: { mood: "Gestresst", Icon: Frown, color: "text-db-red" },
  };
  const moodHistory = stimmungLaden().map((eintrag) => ({
    date: tagesbezeichnung(eintrag.datum),
    notiz: eintrag.notiz,
    ...(stimmungsBezeichnung[eintrag.stimmung] ?? { mood: eintrag.stimmung, Icon: Meh, color: "text-db-rail" }),
  }));

  const savedCourses = [
    {
      title: "Zivilcourage im Zug",
      duration: "15 Min",
      type: "Video-Training",
    },
    {
      title: "Grenzen setzen lernen",
      duration: "20 Min",
      type: "Interaktiver Kurs",
    }
  ];


  const renderContent = () => {
    switch (activeTab) {
      case "postfach":
        const selectedTicket = tickets.find(t => t.id === selectedTicketId);
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-ink mb-2">Meine Meldungen & Postfach</h3>
            <p className="text-sm font-medium text-ink-muted mb-6">
              Hier siehst du deine eingereichten, anonymen Meldungen und kannst sicher mit den Bearbeitern (JAV, HR) schreiben.
            </p>
            
            <div className="flex flex-col lg:flex-row gap-4 h-[500px]">
              {/* Inbox List */}
              <div className="w-full lg:w-1/3 bg-surface rounded-md border border-line/10 flex flex-col overflow-hidden shrink-0">
                 <div className="overflow-y-auto flex-1 p-2 space-y-2">
                   {tickets.map(ticket => (
                     <button
                       key={ticket.id}
                       onClick={() => setSelectedTicketId(ticket.id)}
                       className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTicketId === ticket.id ? 'border-db-red bg-db-red/5 dark:bg-db-red/10' : 'border-transparent hover:bg-db-dark/5 dark:hover:bg-white/5'}`}
                     >
                       <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-ink text-sm">{ticket.id}</span>
                          <span className="shrink-0 whitespace-nowrap rounded bg-db-dark/5 dark:bg-white/10 px-2 py-0.5 text-sm font-bold text-ink">
                            {{ offen: "offen", "in-bearbeitung": "läuft", abgeschlossen: "erledigt" }[ticket.status] ?? ticket.status}
                          </span>
                       </div>
                       <p className="text-sm font-medium text-ink-muted mb-1 truncate">{ticket.kategorie}</p>
                       <p className="text-sm font-normal text-db-rail/70 dark:text-white/40 truncate">
                         an {rolleFinden(ticket.empfaenger)?.kurz ?? "unbekannt"}
                       </p>
                     </button>
                   ))}
                 </div>
              </div>

              {/* Chat Area */}
              <div className="w-full lg:w-2/3 bg-surface rounded-md border border-line/10 flex flex-col overflow-hidden">
                {selectedTicket ? (
                  <>
                    <FristenFuerMich fall={selectedTicket} />
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                       {selectedTicket.verlauf.map(msg => (
                          <div key={msg.id} className={`flex ${msg.von === 'melder' ? 'justify-end' : 'justify-start'}`}>
                            {msg.von === 'system' ? (
                              <div className="w-full text-center py-2">
                                 <span className="text-xs font-bold uppercase text-db-rail dark:text-white/40 bg-db-dark/5 dark:bg-white/5 px-3 py-1 rounded-full">{msg.text}</span>
                              </div>
                            ) : (
                              <div className={`max-w-[85%] rounded-md p-4 ${msg.von === 'melder' ? 'bg-db-red text-white rounded-tr-sm' : 'bg-surface-sunk text-ink rounded-tl-sm border border-line/10'}`}>
                                 <div className="flex items-center gap-2 mb-1 opacity-70 text-xs font-bold uppercase tracking-wider">
                                    {msg.von === 'melder'
                                      ? 'Du'
                                      : rolleFinden(selectedTicket.empfaenger)?.kurz ?? 'Bearbeitung'}{' '}
                                    • {msg.zeit}
                                 </div>
                                 <p className="text-sm font-medium">{msg.text}</p>
                              </div>
                            )}
                          </div>
                       ))}
                    </div>
                    <div className="p-3 border-t border-line/10 bg-white dark:bg-transparent shrink-0">
                       <form onSubmit={handleSendReply} className="flex gap-2">
                          <input 
                            type="text" 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Anonym antworten..."
                            className="flex-1 bg-db-dark/5 dark:bg-white/5 border border-line/10 rounded-xl px-4 py-3 text-sm font-medium text-ink focus:outline-none focus:border-db-red"
                          />
                          <button 
                            type="submit"
                            disabled={!replyText.trim() || selectedTicket.status === 'abgeschlossen'}
                            className="bg-db-red text-white p-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                          >
                             <Send className="w-5 h-5" />
                          </button>
                       </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-db-rail dark:text-white/40 p-6 text-center">
                     <Inbox className="w-12 h-12 mb-4 opacity-20" />
                     <h3 className="text-sm font-bold">Wähle eine Meldung aus</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "protokolle":
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-ink mb-2">Meine Gedächtnisprotokolle</h3>
            <p className="text-sm font-medium text-ink-muted mb-6">
              Diese Einträge bleiben auf diesem Gerät und werden nirgendwo hochgeladen.
            </p>
            {savedRecords.map(record => (
              <div key={record.id} className="bg-surface border border-line/10 rounded-md p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 text-sm font-medium text-ink-muted mb-2">
                  <Clock className="w-3 h-3" />
                  {record.date} • {record.time}
                </div>
                <h4 className="font-bold text-ink text-lg mb-1">{record.category || "Protokoll-Eintrag"}</h4>
                <p className="text-sm text-db-dark/80 dark:text-white/80">{record.description}</p>
                {/* Beide Funktionen sind im Prototyp nicht angebunden. Sichtbar
                    deaktiviert statt mit einem Hinweisfenster beim Klick. */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled
                    title="Im Prototyp noch nicht verfügbar"
                    className="text-sm font-medium bg-db-dark/5 dark:bg-white/5 px-3 py-1.5 rounded-lg text-db-dark/40 dark:text-white/40 cursor-not-allowed"
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Im Prototyp noch nicht verfügbar"
                    className="text-sm font-bold bg-db-red/5 px-3 py-1.5 rounded-lg text-db-red/40 cursor-not-allowed"
                  >
                    Meldung daraus erstellen
                  </button>
                  <span className="text-sm font-normal text-db-rail/70 dark:text-white/40">
                    im Prototyp noch nicht angebunden
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      case "stimmung":
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-ink mb-2">Stimmungs-Verlauf</h3>
            <div className="bg-surface border border-line/10 rounded-md p-5 shadow-sm">
              <div className="space-y-6">
                {moodHistory.length === 0 ? (
                  <p className="py-5 text-center text-sm font-normal text-db-rail dark:text-white/50">
                    Noch kein Eintrag. Auf der Startseite kannst du festhalten, wie deine Schicht war.
                  </p>
                ) : (
                  moodHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 border-b border-db-dark/5 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-ink-muted mb-1">{item.date}</div>
                        <div className="font-bold text-ink">{item.mood}</div>
                        {item.notiz && (
                          <p className="mt-1 text-sm font-normal text-ink-muted">{item.notiz}</p>
                        )}
                      </div>
                      {item.Icon && <item.Icon className={`h-8 w-8 shrink-0 ${item.color}`} />}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      case "kurse":
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-ink mb-2">Gemerkte Kurse</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedCourses.map((course, idx) => (
                <div key={idx} className="group bg-surface border border-line/10 rounded-md p-5 shadow-sm hover:border-db-red dark:hover:border-db-red transition cursor-pointer flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-ink-muted mb-2 uppercase tracking-wider">
                      <Video className="w-3 h-3" />
                      {course.type}
                    </div>
                    <h4 className="font-bold text-ink text-lg group-hover:text-db-red transition">{course.title}</h4>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-db-dark/70 dark:text-white/70">{course.duration}</span>
                    <ChevronRight className="w-5 h-5 text-db-dark/30 dark:text-white/30 group-hover:text-db-red transition translate-x-0 group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-5"
    >
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 bg-db-dark p-6 rounded-lg shadow-md shadow-db-dark/10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 opacity-5 pointer-events-none">
          <User className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 w-24 h-24 rounded-full bg-db-red flex items-center justify-center border-4 border-white/20 shadow-lg shrink-0">
          <User className="w-12 h-12 text-white" />
        </div>
        <div className="relative z-10 text-white flex-1">
          <h1 className="text-3xl font-bold mb-1">Mein DB Peace</h1>
          <p className="text-white/70 font-medium mb-2">Dein sicherer, privater Raum.</p>
          <p className="text-white/60 text-sm font-normal mb-4 max-w-xl leading-relaxed">
            Postfach und gemerkte Kurse zeigen im Prototyp erfundene Beispiele. Deine
            Gedächtnisprotokolle und dein Stimmungs-Tagebuch sind echt — sie liegen auf diesem
            Gerät.
          </p>
          {/* Bewusst keine Punkte, Level oder Ranglisten: Wer diese App öffnet,
              weil er gemobbt wird, sammelt keine Abzeichen. Belohnungslogik wäre
              hier zynisch — und die Zahlen wären ohnehin erfunden. */}
          <div className="flex gap-4">
            <div className="bg-white/10  rounded-xl p-3 border border-white/10 flex items-center gap-3 max-w-md">
              <div className="bg-white/10 p-2 rounded-lg text-white/80">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Nur auf diesem Gerät
                </div>
                <div className="text-sm font-semibold text-white/90">
                  Niemand bei der DB sieht, was hier steht – auch nicht, dass du die App nutzt.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button 
            onClick={() => setActiveTab("postfach")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "postfach" 
                ? "bg-db-red text-white shadow-md" 
                : "text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-5 h-5" /> Postfach
            </div>
            <div className="bg-db-dark/20 text-sm px-2 py-0.5 rounded-full">{tickets.length}</div>
          </button>
          
          <button 
            onClick={() => setActiveTab("protokolle")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "protokolle" 
                ? "bg-db-dark dark:bg-white text-white dark:text-db-dark shadow-md" 
                : "text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10"
            }`}
          >
            <FolderLock className="w-5 h-5" /> Gedächtnisprotokolle
          </button>
          
          <button 
            onClick={() => setActiveTab("stimmung")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "stimmung" 
                ? "bg-db-dark dark:bg-white text-white dark:text-db-dark shadow-md" 
                : "text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10"
            }`}
          >
            <LineChart className="w-5 h-5" /> Stimmungs-Verlauf
          </button>
          
          <button 
            onClick={() => setActiveTab("kurse")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "kurse" 
                ? "bg-db-dark dark:bg-white text-white dark:text-db-dark shadow-md" 
                : "text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10"
            }`}
          >
            <Bookmark className="w-5 h-5" /> Gemerkte Kurse
          </button>

        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Ohne AnimatePresence mode="wait" — sonst blockiert eine nicht beendete
              Exit-Animation den Tabwechsel. */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}

/**
 * Was die meldende Person über den Fristenlauf wissen muss.
 *
 * Die bearbeitende Stelle sieht ihre Fristen längst. Für Betroffene ist die
 * Frage aber die wichtigere: Wann muss ich eine Antwort bekommen — und läuft
 * währenddessen eine Frist, die mir schadet, wenn ich sie verpasse?
 */
function FristenFuerMich({ fall }) {
  const eingang = eingangsDatum(fall);
  const fristen = eingang ? fristenFuer(fall.empfaenger, fall) : [];
  if (fristen.length === 0) return null;

  const stelle = rolleFinden(fall.empfaenger)?.kurz ?? "die zuständige Stelle";

  return (
    <div className="border-b border-line/10 bg-db-soft/60 dark:bg-white/5 p-4 space-y-2">
      {fristen.map((frist) => {
        const stand = fristStand(frist, eingang);
        const ueberfaellig = stand.stand === "ueberfaellig";
        return (
          <div
            key={frist.id}
            className={`rounded-xl border p-3 ${
              ueberfaellig
                ? "border-db-red/40 bg-red-50 dark:bg-red-950/20"
                : "border-line/10 bg-surface"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                ueberfaellig ? "text-db-redInk dark:text-red-300" : "text-ink"
              }`}
            >
              {frist.bezeichnung}: {stand.text}
            </p>
            <p className="mt-1 text-sm font-normal leading-relaxed text-ink-muted">
              {ueberfaellig
                ? `${stelle} hätte sich längst melden müssen. Du darfst nachfragen — und dich an eine andere Stelle wenden, wenn nichts passiert.`
                : frist.erklaerung}{" "}
              ({frist.grundlage})
            </p>
          </div>
        );
      })}
    </div>
  );
}
