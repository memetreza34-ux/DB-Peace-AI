import React, { useEffect, useRef, useState } from "react";
import { Bot, MessageSquareText, Send, ShieldAlert, Trash2, WifiOff, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    text: "Hallo. Ich bin der Azubi-Begleiter im DB-Peace-Prototyp. Ich gebe Orientierung, ersetze aber keine reale Vertrauensperson, Fachberatung oder Notfallhilfe.",
  },
];

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState("checking");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4_000);

    fetch("/api/chat/status", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("status_failed")))
      .then((data) => setMode(data.connected ? "online" : "demo"))
      .catch(() => setMode("demo"))
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  async function handleSubmit(event) {
    event.preventDefault();
    const userText = input.trim().slice(0, 1_200);
    if (!userText || isTyping) return;

    const nextMessages = [...messages, { role: "user", text: userText }];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20_000);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({ role: message.role, content: message.text })),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.reply) throw new Error(data.error || "chat_failed");

      setMode("online");
      setMessages((current) => [...current, { role: "assistant", text: data.reply }]);
    } catch {
      setMode("demo");
      setMessages((current) => [
        ...current,
        { role: "assistant", text: createLocalOrientation(userText) },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function clearChat() {
    setMessages(INITIAL_MESSAGES);
    setInput("");
  }

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="absolute bottom-20 right-0 flex h-[min(560px,78vh)] w-[min(370px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-2xl dark:border-white/10 dark:bg-db-dark"
            aria-label="Azubi-Begleiter"
          >
            <header className="bg-db-dark px-4 py-4 text-white dark:bg-black/40">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Bot className="h-5 w-5 text-db-red" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black">Azubi-Begleiter</h2>
                    <p className="text-[11px] font-semibold text-white/65">
                      {mode === "online" ? "Gemini verbunden" : mode === "demo" ? "Lokale Orientierung" : "Verbindung wird geprüft"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={clearChat} className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white" title="Chat löschen">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Chat schließen">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </header>

            <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-[11px] font-semibold leading-5 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <span className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Keine Klarnamen, Personalnummern oder vertraulichen Dokumente eingeben. Der Verlauf wird nur im aktuellen React-Zustand gehalten und nicht dauerhaft gespeichert.
              </span>
            </div>

            {mode === "demo" && (
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 text-[11px] font-bold text-slate-600 dark:bg-white/5 dark:text-white/60">
                <WifiOff className="h-3.5 w-3.5" />
                KI nicht erreichbar. Antworten sind einfache lokale Orientierungstexte.
              </div>
            )}

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-db-soft/50 p-4 dark:bg-transparent">
              {messages.map((message, index) => (
                <motion.div key={`${message.role}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[86%] rounded-xl px-4 py-3 text-sm font-medium leading-6 ${message.role === "user" ? "rounded-br-sm bg-db-red text-white" : "rounded-bl-sm border border-db-dark/5 bg-white text-db-dark shadow-sm dark:border-white/10 dark:bg-db-rail dark:text-white"}`}>
                    {message.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-xl rounded-bl-sm border border-db-dark/5 bg-white px-4 py-3 text-xs font-bold text-db-rail dark:border-white/10 dark:bg-db-rail dark:text-white/60">
                    Antwort wird erstellt …
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-db-dark/10 bg-white p-4 dark:border-white/10 dark:bg-db-dark">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value.slice(0, 1_200))}
                  maxLength={1_200}
                  placeholder="Situation ohne Klarnamen beschreiben …"
                  className="min-w-0 flex-1 rounded-xl border border-db-dark/15 bg-db-warm/50 px-4 py-2.5 text-sm text-db-dark outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/20 dark:border-white/15 dark:bg-db-rail/50 dark:text-white"
                />
                <button type="submit" disabled={!input.trim() || isTyping} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-db-red text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Nachricht senden">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-right text-[10px] font-bold text-db-rail/60 dark:text-white/40">{input.length}/1200</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg ${isOpen ? "bg-db-dark" : "bg-db-red"}`}
        aria-label={isOpen ? "Chat schließen" : "Azubi-Begleiter öffnen"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquareText className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}

function createLocalOrientation(text) {
  const value = text.toLowerCase();

  if (["suizid", "selbstmord", "umbringen", "selbst verletzen", "nicht mehr leben"].some((word) => value.includes(word))) {
    return "Das klingt nach einer akuten Krise. Bitte bleib nicht allein und wende dich jetzt an eine anwesende Vertrauensperson oder reale Notfallhilfe. Bei unmittelbarer Gefahr rufe 112 an. Dieser Chat kann keine Krisenhilfe ersetzen.";
  }

  if (["gewalt", "bedroht", "drohung", "schlagen", "messer", "waffe"].some((word) => value.includes(word))) {
    return "Sicherheit zuerst: Geh auf Abstand, suche einen sicheren Ort und hole reale Hilfe. Konfrontiere die Person nicht allein. Bei akuter Gefahr rufe 110 oder 112 an. Dokumentiere den Vorfall erst, wenn du sicher bist.";
  }

  if (["mobbing", "diskrimin", "beleidigt", "ausgeschlossen", "rassistisch"].some((word) => value.includes(word))) {
    return "Nimm das ernst. Notiere Datum, Ort, möglichst genauen Wortlaut, Beteiligte und mögliche Zeug:innen. Sprich anschließend mit einer vertrauenswürdigen Person, etwa JAV, Betriebsrat oder Ausbildungsbetreuung. Menschen müssen den Fall prüfen.";
  }

  return "Ich kann die Situation lokal nur grob einordnen. Beschreibe sachlich, was passiert ist, wann es passiert ist und ob gerade Gefahr besteht. Vermeide Klarnamen. Bei Unsicherheit ist eine reale Vertrauensperson der bessere nächste Schritt.";
}
