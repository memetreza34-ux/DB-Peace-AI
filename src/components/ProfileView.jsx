import React, { useState, useEffect } from "react";
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
  Star
} from "lucide-react";
import { mockTicketsData, subscribeToTickets, updateTickets } from "../data/mockTickets";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("postfach");
  const [tickets, setTickets] = useState([...mockTicketsData]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToTickets((newTickets) => {
      setTickets([...newTickets]);
    });
    return () => unsubscribe();
  }, []);

  const handleSendReply = (e) => {
    e.preventDefault();
    const selectedTicket = tickets.find(t => t.id === selectedTicketId);
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      id: Date.now(),
      sender: "azubi",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return { ...t, messages: [...t.messages, newMsg] };
      }
      return t;
    });

    updateTickets(updatedTickets);
    setReplyText("");
  };

  // Beispielinhalte, damit die Ansicht im Prototyp nicht leer wirkt. Sie sind
  // erfunden — im Betrieb stehen hier ausschliesslich eigene Einträge. Die
  // Ansicht weist unten sichtbar darauf hin.
  const savedRecords = [
    {
      id: 1,
      date: "2026-07-20",
      time: "14:15",
      category: "Beleidigung & Ausgrenzung",
      description: "Wiederholte abwertende Sprüche während der Teambesprechung.",
    }
  ];

  const moodHistory = [
    { date: "Heute", mood: "Gut", icon: "🙂", color: "text-emerald-500" },
    { date: "Gestern", mood: "Gestresst", icon: "😞", color: "text-red-500" },
    { date: "Vorgestern", mood: "Okay", icon: "😐", color: "text-amber-500" },
  ];

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

  const badges = [
    {
      title: "DB Peace Guardian",
      description: "Hat alle Quiz-Fragen richtig beantwortet.",
      icon: ShieldCheck,
      color: "text-amber-500",
      bg: "bg-amber-500/20"
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "postfach":
        const selectedTicket = tickets.find(t => t.id === selectedTicketId);
        return (
          <div className="space-y-4">
            <h3 className="font-black text-xl text-db-dark dark:text-white mb-2">Meine Meldungen & Postfach</h3>
            <p className="text-sm font-medium text-db-rail dark:text-white/70 mb-6">
              Hier siehst du deine eingereichten, anonymen Meldungen und kannst sicher mit den Bearbeitern (JAV, HR) schreiben.
            </p>
            
            <div className="flex flex-col lg:flex-row gap-4 h-[500px]">
              {/* Inbox List */}
              <div className="w-full lg:w-1/3 bg-white dark:bg-db-dark/50 rounded-md border border-db-dark/10 dark:border-white/10 flex flex-col overflow-hidden shrink-0">
                 <div className="overflow-y-auto flex-1 p-2 space-y-2">
                   {tickets.map(ticket => (
                     <button
                       key={ticket.id}
                       onClick={() => setSelectedTicketId(ticket.id)}
                       className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTicketId === ticket.id ? 'border-db-red bg-db-red/5 dark:bg-db-red/10' : 'border-transparent hover:bg-db-dark/5 dark:hover:bg-white/5'}`}
                     >
                       <div className="flex justify-between items-start mb-1">
                          <span className="font-black text-db-dark dark:text-white text-sm">{ticket.id}</span>
                          <span className="bg-db-dark/5 dark:bg-white/10 text-db-dark dark:text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">{ticket.status}</span>
                       </div>
                       <p className="text-xs font-bold text-db-rail dark:text-white/60 mb-2 truncate">{ticket.category}</p>
                     </button>
                   ))}
                 </div>
              </div>

              {/* Chat Area */}
              <div className="w-full lg:w-2/3 bg-white dark:bg-db-dark/50 rounded-md border border-db-dark/10 dark:border-white/10 flex flex-col overflow-hidden">
                {selectedTicket ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                       {selectedTicket.messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'azubi' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'system' ? (
                              <div className="w-full text-center py-2">
                                 <span className="text-[10px] font-bold uppercase text-db-rail dark:text-white/40 bg-db-dark/5 dark:bg-white/5 px-3 py-1 rounded-full">{msg.text}</span>
                              </div>
                            ) : (
                              <div className={`max-w-[85%] rounded-md p-4 ${msg.sender === 'azubi' ? 'bg-db-red text-white rounded-tr-sm' : 'bg-db-soft dark:bg-white/5 text-db-dark dark:text-white rounded-tl-sm border border-db-dark/10 dark:border-white/10'}`}>
                                 <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] font-bold uppercase tracking-wider">
                                    {msg.sender === 'azubi' ? 'Du' : 'HR / Vorgesetzter'} • {msg.timestamp}
                                 </div>
                                 <p className="text-sm font-medium">{msg.text}</p>
                              </div>
                            )}
                          </div>
                       ))}
                    </div>
                    <div className="p-3 border-t border-db-dark/10 dark:border-white/10 bg-white dark:bg-transparent shrink-0">
                       <form onSubmit={handleSendReply} className="flex gap-2">
                          <input 
                            type="text" 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Anonym antworten..."
                            className="flex-1 bg-db-dark/5 dark:bg-white/5 border border-db-dark/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-db-dark dark:text-white focus:outline-none focus:border-db-red"
                          />
                          <button 
                            type="submit"
                            disabled={!replyText.trim() || selectedTicket.status === 'closed'}
                            className="bg-db-red text-white p-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                          >
                             <Send className="w-5 h-5" />
                          </button>
                       </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-db-rail dark:text-white/40 p-8 text-center">
                     <Inbox className="w-12 h-12 mb-4 opacity-20" />
                     <h3 className="text-sm font-black">Wähle eine Meldung aus</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "protokolle":
        return (
          <div className="space-y-4">
            <h3 className="font-black text-xl text-db-dark dark:text-white mb-2">Meine Gedächtnisprotokolle</h3>
            <p className="text-sm font-medium text-db-rail dark:text-white/70 mb-6">
              Diese Einträge bleiben auf diesem Gerät und werden nirgendwo hochgeladen.
            </p>
            {savedRecords.map(record => (
              <div key={record.id} className="bg-white dark:bg-db-dark/50 border border-db-dark/10 dark:border-white/10 rounded-md p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 text-xs font-bold text-db-rail dark:text-white/60 mb-2">
                  <Clock className="w-3 h-3" />
                  {record.date} • {record.time}
                </div>
                <h4 className="font-black text-db-dark dark:text-white text-lg mb-1">{record.category}</h4>
                <p className="text-sm text-db-dark/80 dark:text-white/80">{record.description}</p>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => alert("Funktion 'Bearbeiten' ist in der aktuellen Demo-Version noch nicht verfügbar.")}
                    className="text-xs font-bold bg-db-dark/5 dark:bg-white/5 hover:bg-db-dark/10 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg text-db-dark dark:text-white transition"
                  >
                    Bearbeiten
                  </button>
                  <button 
                    onClick={() => alert("Funktion 'Meldung erstellen' ist in der aktuellen Demo-Version noch nicht verfügbar.")}
                    className="text-xs font-bold bg-db-red/10 hover:bg-db-red/20 text-db-red px-3 py-1.5 rounded-lg transition"
                  >
                    Meldung daraus erstellen
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "stimmung":
        return (
          <div className="space-y-4">
            <h3 className="font-black text-xl text-db-dark dark:text-white mb-2">Stimmungs-Verlauf</h3>
            <div className="bg-white dark:bg-db-dark/50 border border-db-dark/10 dark:border-white/10 rounded-md p-6 shadow-sm">
              <div className="space-y-6">
                {moodHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-db-dark/5 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="text-xs font-bold text-db-rail dark:text-white/60 mb-1">{item.date}</div>
                      <div className="font-black text-db-dark dark:text-white">{item.mood}</div>
                    </div>
                    <div className={`text-4xl ${item.color}`}>{item.icon}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "kurse":
        return (
          <div className="space-y-4">
            <h3 className="font-black text-xl text-db-dark dark:text-white mb-2">Gemerkte Kurse</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedCourses.map((course, idx) => (
                <div key={idx} className="group bg-white dark:bg-db-dark/50 border border-db-dark/10 dark:border-white/10 rounded-md p-5 shadow-sm hover:border-db-red dark:hover:border-db-red transition cursor-pointer flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-db-rail dark:text-white/60 mb-2 uppercase tracking-wider">
                      <Video className="w-3 h-3" />
                      {course.type}
                    </div>
                    <h4 className="font-black text-db-dark dark:text-white text-lg group-hover:text-db-red transition">{course.title}</h4>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs font-bold text-db-dark/70 dark:text-white/70">{course.duration}</span>
                    <ChevronRight className="w-5 h-5 text-db-dark/30 dark:text-white/30 group-hover:text-db-red transition translate-x-0 group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "abzeichen":
        return (
          <div className="space-y-4">
            <h3 className="font-black text-xl text-db-dark dark:text-white mb-2">Meine Erfolge</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="bg-white dark:bg-db-dark/50 border border-db-dark/10 dark:border-white/10 rounded-md p-5 shadow-sm flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${badge.bg}`}>
                      <Icon className={`w-8 h-8 ${badge.color}`} />
                    </div>
                    <div>
                      <h4 className="font-black text-db-dark dark:text-white text-lg">{badge.title}</h4>
                      <p className="text-sm font-medium text-db-dark/70 dark:text-white/70 mt-1">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
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
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6"
    >
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 bg-db-dark p-8 rounded-lg shadow-md shadow-db-dark/10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 opacity-5 pointer-events-none">
          <User className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 w-24 h-24 rounded-full bg-db-red flex items-center justify-center border-4 border-white/20 shadow-lg shrink-0">
          <User className="w-12 h-12 text-white" />
        </div>
        <div className="relative z-10 text-white flex-1">
          <h1 className="text-3xl font-black mb-1">Mein DB Peace</h1>
          <p className="text-white/70 font-medium mb-2">Dein sicherer, privater Raum.</p>
          <p className="text-white/60 text-xs font-semibold mb-4 max-w-xl leading-relaxed">
            Im Prototyp sind hier Beispieleinträge hinterlegt, damit die Ansicht nicht leer ist.
            Sie stammen nicht von dir.
          </p>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
              <div className="bg-amber-400/20 p-2 rounded-lg text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white/60 uppercase tracking-wider">Level 3 • Zivilcourage Experte</div>
                <div className="font-black text-xl">850 DB Peace Points</div>
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
            <div className="bg-db-dark/20 text-xs px-2 py-0.5 rounded-full">{tickets.length}</div>
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
          
          <button 
            onClick={() => setActiveTab("abzeichen")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "abzeichen" 
                ? "bg-db-dark dark:bg-white text-white dark:text-db-dark shadow-md" 
                : "text-db-dark/70 dark:text-white/70 hover:bg-db-dark/5 dark:hover:bg-white/10"
            }`}
          >
            <Award className="w-5 h-5" /> Erfolge & Abzeichen
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
