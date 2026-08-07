import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  FlaskConical,
  Inbox,
  LogOut,
  RotateCcw,
  Search,
  Send,
} from "lucide-react";
import {
  createDemoMessageId,
  mockTicketsData,
  resetTickets,
  subscribeToTickets,
  updateTickets,
} from "../data/mockTickets.js";

export function HRDashboard({ onExit }) {
  const [tickets, setTickets] = useState(() => [...mockTicketsData]);
  const [selectedTicketId, setSelectedTicketId] = useState(mockTicketsData[0]?.id || null);
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => subscribeToTickets(setTickets), []);

  useEffect(() => {
    if (!tickets.length) {
      setSelectedTicketId(null);
      setReplyText("");
      return;
    }
    if (!tickets.some((ticket) => ticket.id === selectedTicketId)) {
      setSelectedTicketId(tickets[0].id);
      setReplyText("");
    }
  }, [selectedTicketId, tickets]);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || null;
  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("de-DE");
    if (!query) return tickets;
    return tickets.filter((ticket) => [ticket.id, ticket.category, ticket.summary]
      .some((value) => String(value || "").toLocaleLowerCase("de-DE").includes(query)));
  }, [searchQuery, tickets]);

  const stats = useMemo(() => ({
    total: tickets.length,
    high: tickets.filter((ticket) => ticket.risk === "High").length,
    medium: tickets.filter((ticket) => ticket.risk === "Medium").length,
    closed: tickets.filter((ticket) => ticket.status === "closed").length,
  }), [tickets]);

  function selectTicket(id) {
    setSelectedTicketId(id);
    setReplyText("");
  }

  function handleSendReply(event) {
    event.preventDefault();
    const text = replyText.trim().slice(0, 800);
    if (!text || !selectedTicket) return;

    const updated = tickets.map((ticket) => ticket.id === selectedTicket.id
      ? {
          ...ticket,
          messages: [
            ...ticket.messages,
            {
              id: createDemoMessageId("hr-reply"),
              sender: "hr",
              text,
              timestamp: new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
            },
          ],
        }
      : ticket);

    if (updateTickets(updated)) setReplyText("");
  }

  function resetDemo() {
    resetTickets();
    setSelectedTicketId(mockTicketsData[0]?.id || null);
    setReplyText("");
    setSearchQuery("");
    setActiveTab("tickets");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-black">HR-Dashboard · Demonstration</h1>
              <p className="text-xs font-semibold text-white/55">Erfundene Fälle · keine DB-Systemanbindung · keine echten Beschäftigtendaten</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={resetDemo} className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-black hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Demo zurücksetzen
            </button>
            <button type="button" onClick={onExit} className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-black hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Demo verlassen
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
          Dieses Dashboard zeigt nur einen möglichen Bedienablauf. Kennzahlen, Prioritäten, Dialoge und Fälle sind erfunden und nicht fachlich, rechtlich oder organisatorisch validiert.
        </div>

        <div className="flex max-w-md rounded-xl bg-slate-200 p-1" role="tablist" aria-label="HR-Demo-Bereiche">
          <TabButton active={activeTab === "tickets"} onClick={() => setActiveTab("tickets")}>Fälle</TabButton>
          <TabButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>Demo-Auswertung</TabButton>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Kennzahlen aus erfundenen Fällen">
          <Metric label="Demo-Fälle" value={stats.total} icon={Inbox} />
          <Metric label="Hohe Beispiel-Priorität" value={stats.high} icon={AlertTriangle} tone="red" />
          <Metric label="Mittlere Beispiel-Priorität" value={stats.medium} icon={Clock} tone="amber" />
          <Metric label="Als abgeschlossen markiert" value={stats.closed} icon={CheckCircle2} tone="green" />
        </section>

        {activeTab === "tickets" ? (
          <section className="grid min-h-[620px] gap-5 lg:grid-cols-[0.85fr_1.15fr]" role="tabpanel">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 p-4">
                <label className="relative block">
                  <span className="sr-only">Demo-Fälle durchsuchen</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value.slice(0, 120))} maxLength={120} placeholder="Demo-Fälle durchsuchen" className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15" />
                </label>
              </div>

              <div className="max-h-[560px] divide-y divide-slate-100 overflow-y-auto">
                {filteredTickets.length ? filteredTickets.map((ticket) => (
                  <button key={ticket.id} type="button" aria-pressed={selectedTicketId === ticket.id} onClick={() => selectTicket(ticket.id)} className={`w-full p-4 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500/30 ${selectedTicketId === ticket.id ? "border-l-4 border-violet-600 bg-violet-50/60" : "border-l-4 border-transparent"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-slate-900">{ticket.id}</p>
                        <p className="mt-1 text-sm font-bold text-slate-700">{ticket.category}</p>
                      </div>
                      <RiskBadge risk={ticket.risk} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-500">{ticket.summary}</p>
                    <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-slate-400"><Clock className="h-3 w-3" aria-hidden="true" />{ticket.date}</p>
                  </button>
                )) : <p className="p-8 text-center text-sm font-semibold text-slate-500">Keine Demo-Fälle gefunden.</p>}
              </div>
            </div>

            <div className="flex min-h-[620px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {selectedTicket ? (
                <>
                  <div className="border-b border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Erfundener Demonstrationsfall</p>
                        <h2 className="mt-1 text-xl font-black">{selectedTicket.id} · {selectedTicket.category}</h2>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{selectedTicket.summary}</p>
                      </div>
                      <RiskBadge risk={selectedTicket.risk} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-5" role="log" aria-live="polite" aria-relevant="additions">
                    {selectedTicket.messages.map((message) => (
                      <div key={message.id} className={`flex flex-col ${message.sender === "hr" ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[88%] rounded-xl px-4 py-3 text-sm font-medium leading-6 ${message.sender === "hr" ? "rounded-br-sm bg-slate-900 text-white" : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"}`}>
                          <p className="mb-1 text-[10px] font-black uppercase tracking-wide opacity-60">{message.sender === "hr" ? "Demo-Bearbeitung" : "Demo-Fall"}</p>
                          <span className="break-words">{message.text}</span>
                        </div>
                        <span className="mt-1 px-1 text-[10px] font-bold text-slate-400">{message.timestamp}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendReply} className="border-t border-slate-200 p-4">
                    <p className="mb-2 text-[11px] font-bold text-slate-500">Antwort wird nicht versendet und nur im lokalen Demo-Zustand ergänzt.</p>
                    <label className="sr-only" htmlFor="hr-demo-reply">Demo-Antwort</label>
                    <div className="flex gap-2">
                      <input id="hr-demo-reply" value={replyText} onChange={(event) => setReplyText(event.target.value.slice(0, 800))} maxLength={800} placeholder="Demo-Antwort verfassen …" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15" />
                      <button type="submit" disabled={!replyText.trim()} className="flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-black text-white hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-40">
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Ergänzen
                      </button>
                    </div>
                  </form>
                </>
              ) : <div className="flex flex-1 items-center justify-center p-8 text-center text-sm font-semibold text-slate-500">Wähle links einen Demo-Fall aus.</div>}
            </div>
          </section>
        ) : <AnalyticsDemo tickets={tickets} />}
      </main>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`flex-1 rounded-lg px-4 py-2 text-sm font-black focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${active ? "bg-white shadow-sm" : "text-slate-600"}`}>{children}</button>;
}

function Metric({ label, value, icon: Icon, tone = "slate" }) {
  const tones = { slate: "bg-slate-100 text-slate-700", red: "bg-red-100 text-red-700", amber: "bg-amber-100 text-amber-700", green: "bg-emerald-100 text-emerald-700" };
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}><Icon className="h-4 w-4" aria-hidden="true" /></div><p className="mt-4 text-3xl font-black">{value}</p><p className="mt-1 text-xs font-bold text-slate-500">{label}</p></article>;
}

function RiskBadge({ risk }) {
  const className = risk === "High" ? "bg-red-100 text-red-700" : risk === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${className}`}>{risk || "Low"} · Demo</span>;
}

function AnalyticsDemo({ tickets }) {
  const categories = Object.entries(tickets.reduce((accumulator, ticket) => {
    accumulator[ticket.category] = (accumulator[ticket.category] || 0) + 1;
    return accumulator;
  }, {}));
  const max = Math.max(1, ...categories.map(([, count]) => count));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" role="tabpanel">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><BarChart3 className="h-5 w-5" aria-hidden="true" /></div>
        <div><h2 className="text-xl font-black">Auswertung der erfundenen Beispieldaten</h2><p className="mt-1 text-sm font-semibold leading-6 text-slate-500">Keine Prognose, kein Frühwarnsystem und keine Aussage über reale Standorte oder Beschäftigte.</p></div>
      </div>
      <div className="mt-7 space-y-5">
        {categories.map(([category, count]) => (
          <div key={category}>
            <div className="mb-2 flex justify-between gap-4 text-sm font-bold text-slate-700"><span>{category}</span><span>{count}</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100" aria-hidden="true"><div className="h-full rounded-full bg-violet-600" style={{ width: `${(count / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}
