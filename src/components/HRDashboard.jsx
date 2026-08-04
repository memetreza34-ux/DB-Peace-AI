import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ShieldCheck, Clock, UserX, User, ArrowRight, MessageSquare, AlertCircle, FileText, Send, TrainFront, ShieldAlert } from "lucide-react";
import { mockTicketsData, subscribeToTickets, updateTickets } from "../data/mockTickets";

export function HRDashboard({ onExit }) {
  const [tickets, setTickets] = useState([...mockTicketsData]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [activeHRTab, setActiveHRTab] = useState("tickets");

  useEffect(() => {
    const unsubscribe = subscribeToTickets((newTickets) => {
      setTickets([...newTickets]);
    });
    return () => unsubscribe();
  }, []);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      id: Date.now(),
      sender: "hr",
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

  return (
    <div className="space-y-6 animate-fadeIn pb-24 h-full flex flex-col">
      {/* Header Banner - HR Style */}
      <div className="rounded-md bg-gradient-to-r from-slate-900 via-slate-800 to-db-red p-6 text-white shadow-md relative overflow-hidden shrink-0">
        <div className="flex flex-col md:flex-row justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>DB Peace: HR & Compliance Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Sicheres Meldewesen
            </h1>
            <p className="text-sm font-medium text-white/80 leading-relaxed max-w-md">
              Eingehende anonyme Meldungen bearbeiten und in den Dialog mit Hinweisgebern treten.
            </p>
          </div>
          <div className="flex items-start">
             <button 
                onClick={onExit}
                className="rounded-full bg-white text-slate-900 px-4 py-2 font-black text-sm hover:bg-slate-200 transition"
             >
                Zurück zum Azubi-Modus
             </button>
          </div>
        </div>
        <TrainFront className="absolute right-10 top-1/2 -translate-y-1/2 h-40 w-40 text-white/5 pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setActiveHRTab("tickets")}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            activeHRTab === "tickets" 
              ? "bg-slate-900 text-white" 
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Eingänge & Tickets
        </button>
        <button
          onClick={() => setActiveHRTab("esg")}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeHRTab === "esg" 
              ? "bg-slate-900 text-white" 
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          ESG & Culture Analytics (Predictive)
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[60vh]">
        {activeHRTab === "tickets" ? (
          <>
            {/* Ticket List Sidebar */}
            <div className="w-full lg:w-1/3 bg-white rounded-md border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
           <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h2 className="font-black text-slate-800">Eingänge (Anonym)</h2>
           </div>
           <div className="overflow-y-auto flex-1 p-2 space-y-2">
             {tickets.map(ticket => (
               <button
                 key={ticket.id}
                 onClick={() => setSelectedTicketId(ticket.id)}
                 className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTicketId === ticket.id ? 'border-db-red bg-red-50' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
               >
                 <div className="flex justify-between items-start mb-1">
                    <span className="font-black text-slate-800">{ticket.id}</span>
                    {ticket.risk === "High" && <span className="bg-red-100 text-red-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">High Risk</span>}
                    {ticket.risk === "Medium" && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Medium</span>}
                 </div>
                 <p className="text-xs font-bold text-slate-500 mb-2 truncate">{ticket.category}</p>
                 <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                    <Clock className="w-3 h-3" /> {ticket.date}
                 </div>
               </button>
             ))}
           </div>
        </div>

        {/* Ticket Details & Chat */}
        <div className="w-full lg:w-2/3 bg-white rounded-md border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-black text-slate-800">Fall {selectedTicket.id}</h2>
                    <p className="text-sm font-semibold text-slate-500">{selectedTicket.category}</p>
                 </div>
                 <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                    <UserX className="w-4 h-4" />
                    Absender 100% Anonym
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 flex flex-col gap-6">
                 {/* KI Summary */}
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                    <div className="absolute -top-3 left-4 bg-purple-100 text-purple-700 text-[10px] uppercase font-black px-2 py-0.5 rounded flex items-center gap-1">
                      <SparklesIcon className="w-3 h-3" /> KI Zusammenfassung
                    </div>
                    <p className="text-sm font-medium text-slate-700 mt-2 leading-relaxed">
                       {selectedTicket.summary}
                    </p>
                 </div>

                 {/* Chat History */}
                 <div className="space-y-4">
                    {selectedTicket.messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'hr' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'system' ? (
                          <div className="w-full text-center py-2">
                             <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{msg.text}</span>
                          </div>
                        ) : (
                          <div className={`max-w-[80%] rounded-md p-4 ${msg.sender === 'hr' ? 'bg-db-red text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                             <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] font-bold uppercase tracking-wider">
                                {msg.sender === 'hr' ? 'Du (HR)' : 'Anonymer Hinweisgeber'} • {msg.timestamp}
                             </div>
                             <p className="text-sm font-medium">{msg.text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                 </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                 <form onSubmit={handleSendReply} className="flex gap-2">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Sichere, anonyme Antwort verfassen..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-db-red focus:ring-1 focus:ring-db-red"
                    />
                    <button 
                      type="submit"
                      disabled={!replyText.trim() || selectedTicket.status === 'closed'}
                      className="bg-db-red text-white p-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       <Send className="w-5 h-5" />
                    </button>
                 </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
                 <MessageSquare className="w-16 h-16 mb-4 text-slate-200" />
                 <p className="font-bold text-lg text-slate-600">Kein Ticket ausgewählt</p>
                 <p className="text-sm mt-1 max-w-sm">Wähle eine Meldung aus der Liste, um die KI-Zusammenfassung zu lesen und sicher zu antworten.</p>
              </div>
            )}
          </div>
          </>
        ) : (
          <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm overflow-y-auto p-6">
            <h2 className="text-xl font-black text-slate-800 mb-6">Culture Analytics & Prävention (Vision 2040)</h2>
            <p className="text-slate-600 mb-8 max-w-3xl leading-relaxed">
              Dieses Dashboard nutzt Predictive Analytics, um Hotspots für Konflikte zu identifizieren, bevor sie eskalieren. Die Daten basieren vollständig auf anonymisierten Metadaten des MoodTrackers und der KI-Triage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 p-5 rounded-md border border-red-100">
                <h3 className="text-sm font-bold text-red-800 uppercase mb-2">Risiko-Hotspot</h3>
                <p className="text-3xl font-black text-red-900 mb-1">Standort Süd</p>
                <p className="text-xs font-semibold text-red-700">+14% Stress-Meldungen (MoodTracker) in den letzten 7 Tagen</p>
              </div>
              <div className="bg-emerald-50 p-5 rounded-md border border-emerald-100">
                <h3 className="text-sm font-bold text-emerald-800 uppercase mb-2">Speak-Up Culture</h3>
                <p className="text-3xl font-black text-emerald-900 mb-1">92%</p>
                <p className="text-xs font-semibold text-emerald-700">Mitarbeiter vertrauen dem anonymen System (Benchmark: 74%)</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-md border border-blue-100">
                <h3 className="text-sm font-bold text-blue-800 uppercase mb-2">KI-Trend (Konflikte)</h3>
                <p className="text-3xl font-black text-blue-900 mb-1">Überstunden</p>
                <p className="text-xs font-semibold text-blue-700">Häufigstes Keyword in den Gedächtnisprotokollen</p>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-md text-white">
              <h3 className="font-bold text-lg mb-2">💡 Handlungsempfehlung der KI</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Basierend auf dem Anstieg der negativen Stimmung im Bereich "Standort Süd" wird eine proaktive Informationskampagne zum Thema "Gesetzliche Pausenzeiten" und "Mental Health" empfohlen, um einem Anstieg von offiziellen Beschwerden vorzubeugen.
              </p>
              <button className="mt-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition">
                Maßnahme initiieren
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
