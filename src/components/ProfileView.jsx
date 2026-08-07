import React, { useEffect, useState } from "react";
import { BookOpen, FileText, FlaskConical, Inbox, Send, Trash2 } from "lucide-react";
import {
  createDemoMessageId,
  mockTicketsData,
  resetTickets,
  subscribeToTickets,
  updateTickets,
} from "../data/mockTickets.js";

const demoCourses = [
  { title: "Zivilcourage im Arbeitsalltag", duration: "15 Min.", status: "Demo-Merkliste" },
  { title: "Konflikte früh ansprechen", duration: "20 Min.", status: "Demo-Merkliste" },
];

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [tickets, setTickets] = useState(() => [...mockTicketsData]);
  const [selectedTicketId, setSelectedTicketId] = useState(mockTicketsData[0]?.id || null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => subscribeToTickets((nextTickets) => setTickets(nextTickets)), []);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || null;

  useEffect(() => {
    if (tickets.length === 0) {
      setSelectedTicketId(null);
      return;
    }
    if (!tickets.some((ticket) => ticket.id === selectedTicketId)) setSelectedTicketId(tickets[0].id);
  }, [tickets, selectedTicketId]);

  function sendDemoReply(event) {
    event.preventDefault();
    const text = replyText.trim();
    if (!text || !selectedTicket) return;

    const updated = tickets.map((ticket) => ticket.id === selectedTicket.id
      ? {
          ...ticket,
          messages: [
            ...ticket.messages,
            {
              id: createDemoMessageId("profile-reply"),
              sender: "azubi",
              text,
              timestamp: new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
            },
          ],
        }
      : ticket);
    updateTickets(updated);
    setReplyText("");
  }

  function resetDemoInbox() {
    resetTickets();
    setSelectedTicketId(mockTicketsData[0]?.id || null);
    setReplyText("");
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl bg-gradient-to-r from-db-dark to-db-rail p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-violet-200">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          Demo-Sammlung
        </div>
        <h1 className="mt-3 text-3xl font-black">Sammlung und Beispiel-Postfach</h1>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/70">
          Dieser Bereich enthält keine echten Profile, Meldungen, Zertifikate oder DB-Nachrichten. Er demonstriert ausschließlich mögliche Bedienabläufe mit erfundenen Daten.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 rounded-xl bg-db-dark/5 p-1.5 dark:bg-white/5" role="group" aria-label="Demo-Sammlung anzeigen">
        <TabButton active={activeTab === "inbox"} onClick={() => setActiveTab("inbox")} icon={Inbox}>Demo-Postfach</TabButton>
        <TabButton active={activeTab === "records"} onClick={() => setActiveTab("records")} icon={FileText}>Protokolle</TabButton>
        <TabButton active={activeTab === "courses"} onClick={() => setActiveTab("courses")} icon={BookOpen}>Merkliste</TabButton>
      </div>

      {activeTab === "inbox" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm font-semibold leading-6 text-violet-950 dark:border-violet-900/50 dark:bg-violet-950/25 dark:text-violet-200 sm:flex-row sm:items-center sm:justify-between">
            <span>Alle Fälle und Nachrichten sind erfunden und bleiben nur im lokalen Demo-Zustand.</span>
            <button type="button" onClick={resetDemoInbox} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-violet-300 px-3 py-2 text-xs font-black hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-violet-600/30 dark:border-violet-800">
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Demo zurücksetzen
            </button>
          </div>

          <div className="grid min-h-[540px] gap-4 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="overflow-hidden rounded-xl border border-db-dark/10 bg-white dark:border-white/10 dark:bg-db-dark/50">
              <div className="border-b border-db-dark/10 bg-db-soft p-4 text-xs font-black uppercase tracking-wide text-db-rail dark:border-white/10 dark:bg-white/5 dark:text-white/60">Erfundene Fälle</div>
              <div className="divide-y divide-db-dark/5 dark:divide-white/5">
                {tickets.map((ticket) => (
                  <button key={ticket.id} type="button" onClick={() => setSelectedTicketId(ticket.id)} aria-pressed={selectedTicketId === ticket.id} className={`w-full p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-600/40 ${selectedTicketId === ticket.id ? "border-l-4 border-violet-600 bg-violet-50/70 dark:bg-violet-950/20" : "border-l-4 border-transparent hover:bg-db-soft dark:hover:bg-white/5"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-db-dark dark:text-white">{ticket.id}</p>
                        <p className="mt-1 text-sm font-bold text-db-rail dark:text-white/60">{ticket.category}</p>
                      </div>
                      <span className="rounded-full bg-db-soft px-2 py-1 text-[9px] font-black uppercase text-db-rail dark:bg-white/10 dark:text-white/60">Demo</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex min-h-[540px] flex-col overflow-hidden rounded-xl border border-db-dark/10 bg-white dark:border-white/10 dark:bg-db-dark/50">
              {selectedTicket ? (
                <>
                  <div className="border-b border-db-dark/10 bg-db-soft p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-300">Erfundener Dialog</p>
                    <h2 className="mt-1 font-black text-db-dark dark:text-white">{selectedTicket.id} · {selectedTicket.category}</h2>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto p-4" role="log" aria-live="polite" aria-relevant="additions">
                    {selectedTicket.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === "azubi" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[86%] rounded-xl px-4 py-3 text-sm font-medium leading-6 ${message.sender === "azubi" ? "rounded-br-sm bg-db-red text-white" : "rounded-bl-sm border border-db-dark/10 bg-db-soft text-db-dark dark:border-white/10 dark:bg-white/5 dark:text-white"}`}>
                          <p className="mb-1 text-[9px] font-black uppercase tracking-wide opacity-60">{message.sender === "azubi" ? "Demo-Nutzer" : "Demo-System"} · {message.timestamp}</p>
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendDemoReply} className="border-t border-db-dark/10 p-4 dark:border-white/10">
                    <p className="mb-2 text-[10px] font-bold text-db-rail dark:text-white/50">Die Antwort wird nicht gesendet und nur im Demo-Zustand ergänzt.</p>
                    <label className="sr-only" htmlFor="demo-inbox-reply">Demo-Antwort</label>
                    <div className="flex gap-2">
                      <input id="demo-inbox-reply" value={replyText} onChange={(event) => setReplyText(event.target.value.slice(0, 800))} maxLength={800} placeholder="Demo-Antwort …" className="min-w-0 flex-1 rounded-xl border border-db-dark/15 bg-white px-4 py-2.5 text-sm text-db-dark outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/20 dark:border-white/15 dark:bg-db-dark/40 dark:text-white" />
                      <button type="submit" disabled={!replyText.trim()} className="flex h-11 w-11 items-center justify-center rounded-xl bg-db-red text-white focus:outline-none focus:ring-2 focus:ring-db-red/30 disabled:opacity-40" aria-label="Demo-Antwort ergänzen"><Send className="h-4 w-4" aria-hidden="true" /></button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center p-8 text-center text-sm font-semibold text-db-rail dark:text-white/50">Wähle einen erfundenen Fall aus.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "records" && (
        <EmptyCollection
          icon={FileText}
          title="Protokolle liegen im Bereich „Festhalten & Melden“"
          text="Der Prototyp besitzt bewusst kein zentrales Nutzerkonto und keine verschlüsselte Cloud-Sammlung. Entwürfe müssen dort als PDF exportiert werden."
        />
      )}

      {activeTab === "courses" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {demoCourses.map((course) => (
            <article key={course.title} className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-db-dark/50">
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black uppercase text-violet-700 dark:bg-violet-950/30 dark:text-violet-300">{course.status}</span>
              <h2 className="mt-4 text-lg font-black text-db-dark dark:text-white">{course.title}</h2>
              <p className="mt-2 text-sm font-semibold text-db-rail dark:text-white/60">{course.duration} · nicht mit einem Nutzerkonto synchronisiert</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function TabButton({ active, children, icon: Icon, onClick }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-violet-600/30 sm:flex-none ${active ? "bg-white text-db-dark shadow-sm dark:bg-db-dark dark:text-white" : "text-db-rail dark:text-white/60"}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  );
}

function EmptyCollection({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl border border-dashed border-db-dark/15 bg-white py-14 text-center dark:border-white/15 dark:bg-db-dark/50">
      <Icon className="mx-auto h-11 w-11 text-db-dark/15 dark:text-white/15" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-black text-db-dark dark:text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-db-rail dark:text-white/60">{text}</p>
    </div>
  );
}
