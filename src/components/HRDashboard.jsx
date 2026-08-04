import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, ShieldCheck, Clock, UserX, Send, 
  ShieldAlert, LayoutDashboard, Inbox, BarChart3, 
  LogOut, AlertTriangle, CheckCircle2, TrendingUp
} from "lucide-react";
import { mockTicketsData, subscribeToTickets, updateTickets } from "../data/mockTickets";

export function HRDashboard({ onExit }) {
  const [tickets, setTickets] = useState([...mockTicketsData]);
  const [selectedTicketId, setSelectedTicketId] = useState(mockTicketsData[0]?.id || null);
  const [replyText, setReplyText] = useState("");
  const [activeHRTab, setActiveHRTab] = useState("tickets"); // 'tickets' | 'esg'

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
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      {/* 1. Shadcn-style Left Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="p-5">
          {/* DB Brand Badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-db-red text-white font-black text-xs px-2 py-1 rounded">DB</div>
            <div>
              <h2 className="font-bold text-sm leading-none text-white">DB Compliance Portal</h2>
              <p className="text-[11px] text-slate-400 mt-1">HR & ESG Workspace</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveHRTab("tickets")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                activeHRTab === "tickets"
                  ? "bg-db-red text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Inbox className="w-4 h-4" />
              Eingegangene Meldungen
            </button>
            <button
              onClick={() => setActiveHRTab("esg")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                activeHRTab === "esg"
                  ? "bg-db-red text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              ESG & Culture Analytics
            </button>
          </nav>
        </div>

        {/* Exit Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Azubi-Modus
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            <h1 className="font-extrabold text-slate-800 text-base">
              {activeHRTab === "tickets" ? "Meldungs-Verwaltung & Dialog" : "Predictive ESG & Culture Analytics"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              HSMS Verschlüsselt
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 2. Tremor-style KPI Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offene Fälle</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">{tickets.length}</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Normal
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">High Risk Fälle</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-red-600">
                  {tickets.filter(t => t.risk === "High").length}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Priorität 1</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Speak-Up Index</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">92%</span>
                <span className="text-xs font-bold text-emerald-600">Sehr gut</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ESG Status</p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">Konform</span>
                <span className="text-xs font-bold text-slate-400">AGG-Geprüft</span>
              </div>
            </div>
          </div>

          {/* 3. Tab Specific Content */}
          {activeHRTab === "tickets" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">
              {/* Ticket Data Table / List */}
              <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">Posteingang (Anonym)</h3>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Suchen..." 
                      className="pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-db-red"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                  {tickets.map(ticket => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`w-full text-left p-4 transition-all flex items-start justify-between ${
                        selectedTicketId === ticket.id ? 'bg-red-50/50 border-l-4 border-db-red' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{ticket.id}</span>
                          <span className="text-[11px] font-medium text-slate-500">• {ticket.category}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 font-normal">
                          {ticket.messages[0]?.text || "Meldung ohne Text"}
                        </p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {ticket.date}
                        </span>
                      </div>
                      <div>
                        {ticket.risk === "High" && <span className="bg-red-100 text-red-700 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded">High</span>}
                        {ticket.risk === "Medium" && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded">Mid</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticket Details & Chat Panel */}
              <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                {selectedTicket ? (
                  <>
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">Fall {selectedTicket.id}</h3>
                          <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                            {selectedTicket.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Anonymer Hinweisgeber (Verschlüsselt)</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                        <UserX className="w-4 h-4 text-slate-400" />
                        ID: {selectedTicket.id.replace("INC-", "USER-ANON-")}
                      </div>
                    </div>

                    {/* Chat Messages Timeline */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                      {selectedTicket.messages.map(msg => (
                        <div 
                          key={msg.id}
                          className={`flex flex-col ${msg.sender === 'hr' ? 'items-end' : 'items-start'}`}
                        >
                          <div className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed ${
                            msg.sender === 'hr' 
                              ? 'bg-slate-900 text-white rounded-br-none' 
                              : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-bl-none'
                          }`}>
                            <p className="font-semibold mb-1 text-[10px] opacity-70">
                              {msg.sender === 'hr' ? 'HR Compliance Team' : 'Hinweisgeber (Anonym)'}
                            </p>
                            <p>{msg.text}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input Form */}
                    <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Antwort an den anonymen Hinweisgeber verfassen..."
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-db-red"
                      />
                      <button
                        type="submit"
                        className="bg-db-red hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Senden
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6">
                    <Inbox className="w-10 h-10 mb-2 opacity-40" />
                    <p className="text-xs font-bold">Wähle eine Meldung aus der Liste aus</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ESG & Culture Analytics Tab */
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Präventives Frühwarnsystem</h3>
                <p className="text-xs text-slate-500">Erkennt anonyme Stress-Hotspots in Abteilungen, bevor Meldungen entstehen.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
                  <h4 className="font-bold text-xs text-slate-700 mb-3 uppercase tracking-wider">Risiko-Hotspots nach Standorten</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Werkstatt Frankfurt Süd</span>
                        <span className="text-red-600">Erhöht (Stress/Führung)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-full w-[78%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Güterverkehr Leipzig</span>
                        <span className="text-amber-600">Mittel</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[45%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Zentrale Berlin</span>
                        <span className="text-emerald-600">Niedrig</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[12%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
                  <h4 className="font-bold text-xs text-slate-700 mb-3 uppercase tracking-wider">KI-Empfohlene Maßnahmen</h4>
                  <ul className="space-y-2 text-xs font-semibold text-slate-600">
                    <li className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>Führungskräfte-Workshop im Werk Frankfurt Süd anbieten.</span>
                    </li>
                    <li className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Speak-Up Kultur im Güterverkehr Leipzig stärken.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
