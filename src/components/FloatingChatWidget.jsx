import React, { useState, useRef, useEffect } from "react";
import { lesen, schreiben } from "../lib/speicher.js";
import { Bot, Send, X, MessageSquareText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { erkenneKrise } from "../lib/crisis";

// Erkennt Notrufnummern (110, 112) und Servicenummern (0800…, 116…) im Fließtext
// und macht sie antippbar. In einer Krise soll niemand eine Nummer abtippen müssen.
const RUFNUMMER_MUSTER = "\\b(?:0800\\s?\\d{3}\\s?\\d\\s?\\d{3}|116\\s?\\d{3})\\b|(?<![\\d,.])\\b11[02]\\b(?![\\d,.])";
const RUFNUMMER_SPLIT = new RegExp(`(${RUFNUMMER_MUSTER})`, "g");
const IST_RUFNUMMER = new RegExp(`^(?:${RUFNUMMER_MUSTER})$`);

function TextMitRufnummern({ text }) {
  const teile = text.split(RUFNUMMER_SPLIT).filter((t) => t !== undefined);
  return (
    <>
      {teile.map((teil, i) =>
        IST_RUFNUMMER.test(teil) ? (
          <a
            key={i}
            href={`tel:${teil.replace(/\s/g, "")}`}
            className="font-bold underline decoration-2 underline-offset-2 hover:text-db-red"
          >
            {teil}
          </a>
        ) : (
          <React.Fragment key={i}>{teil}</React.Fragment>
        )
      )}
    </>
  );
}

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  const INITIAL_MESSAGES = [
    {
      role: "assistant",
      text: "Hallo! Ich bin dein vertraulicher KI-Begleiter. Wie kann ich dir heute helfen?"
    }
  ];

  const [messages, setMessages] = useState(() => {
    const saved = lesen("db-peace-chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  useEffect(() => {
    schreiben("db-peace-chat", JSON.stringify(messages));
  }, [messages]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    // Add user message
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Krisensignale gehen nie an ein Sprachmodell: Die Antwort muss auch ohne
    // API-Key, bei Netzfehlern und unabhängig von Modellausgaben korrekt sein.
    const krise = erkenneKrise(userText);
    if (krise) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: krise.text, kritisch: true }
      ]);
      setIsTyping(false);
      return;
    }

    try {
      // Map messages to API format { role, content }
      const apiMessages = newMessages.map(m => ({
        role: m.role,
        content: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();
      
      if (response.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.reply }
        ]);
        setIsTyping(false);
        return; // Success, exit here
      } else {
        throw new Error(data.error || "Fehler bei der Antwort");
      }
    } catch (error) {
      console.warn("API Server not available or missing key, falling back to mock:", error);
      
      // Fallback Mock Logic
      setTimeout(() => {
        const lowerInput = userText.toLowerCase();
        let aiText = "Ich verstehe. Möchtest du mir mehr darüber erzählen, was genau passiert ist?";
        
        const lastBotMessage = messages.length > 0 ? messages[messages.length - 1].text : "";

        if (lowerInput.includes("hallo") || lowerInput.includes("hi ") || lowerInput === "hi") {
          aiText = "Hallo! Schön, dass du dich meldest. Wie kann ich dich heute unterstützen?";
        } else if (lowerInput.includes("wie geht es") || lowerInput.includes("wie gehts")) {
          aiText = "Danke der Nachfrage, mir geht es gut! Mein Ziel ist es, dir bei Fragen rund um ein faires Miteinander zu helfen. Was beschäftigt dich?";
        } else if (lowerInput.includes("mobbing") || lowerInput.includes("beleidigt") || lowerInput.includes("schlecht behandelt")) {
          aiText = "Das klingt belastend. Es tut mir leid, dass du das erlebst. Wenn du dich unwohl fühlst, kannst du jederzeit unter 'Notfall & Kontakte' vertrauliche Hilfe finden. Sollen wir die Situation gemeinsam einordnen?";
        } else if (lowerInput.includes("danke")) {
          aiText = "Sehr gerne! Wenn du noch etwas auf dem Herzen hast, bin ich hier.";
        } else if ((lowerInput === "ja" || lowerInput.includes("gerne")) && lastBotMessage.includes("gemeinsam einordnen")) {
          aiText = "Alles klar. Lass uns Schritt für Schritt vorgehen: Ist der Vorfall heute passiert, oder handelt es sich um etwas, das schon länger andauert?";
        } else if (lowerInput.includes("heute") || lowerInput.includes("gerade eben") || lowerInput.includes("länger")) {
          aiText = "Danke für die Offenheit. Manchmal hilft es, solche Vorfälle offiziell zu dokumentieren. Möchtest du, dass ich dich zum Formular 'Vorfall melden' weiterleite, oder brauchst du erst mal jemanden zum Reden (siehe 'Kontakte')?";
        } else if (lowerInput.includes("melden") || lowerInput.includes("formular")) {
          aiText = "Gut. Du findest das Formular im Hauptmenü unter 'Vorfall protokollieren'. Deine Angaben dort sind sicher und du entscheidest selbst, wer sie sieht.";
        } else if (lowerInput.includes("1 plus 1")) {
          aiText = "Das ist einfach: 1 plus 1 ist 2! Aber eigentlich bin ich Experte für Zwischenmenschliches. Wobei kann ich noch helfen?";
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: aiText
          }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-fenster"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-20 right-0 w-[360px] h-[540px] max-h-[80vh] rounded-lg bg-white/90 dark:bg-db-dark/95  border border-line/10 shadow-lg flex flex-col overflow-hidden transition-colors"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-db-dark dark:bg-black/50 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ">
                  <Bot className="h-6 w-6 text-db-red" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide">Dein Peace-Assistent</h3>
                  <p className="text-sm font-medium text-white/70">Sicher & vertraulich</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-db-soft/50 dark:bg-transparent" ref={scrollRef}>
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-[85%] whitespace-pre-line rounded-md px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-db-red text-white rounded-br-sm shadow-md shadow-db-red/20"
                        : m.kritisch
                        ? "bg-danger text-ink rounded-bl-sm border-2 border-db-red shadow-sm"
                        : "bg-white dark:bg-db-rail text-ink rounded-bl-sm border border-line/5  shadow-sm"
                    }`}
                  >
                    {m.role === "assistant" ? <TextMitRufnummern text={m.text} /> : m.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-db-rail border border-line/5  rounded-md rounded-bl-sm px-4 py-3 flex gap-1 items-center shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-db-dark/30 dark:bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-db-dark/30 dark:bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-db-dark/30 dark:bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="border-t border-line/10 bg-surface  p-4 transition-colors">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Schreibe eine Nachricht..."
                  className="flex-1 rounded-xl border border-line/15 bg-db-warm/50 dark:bg-db-rail/50 dark:text-white px-4 py-2.5 text-sm outline-none transition placeholder:text-db-rail/70 dark:placeholder:text-white/50 focus:border-db-red focus:bg-white dark:focus:bg-db-dark focus:ring-2 focus:ring-db-red/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-db-dark dark:bg-db-red text-white transition hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 dark:hover:bg-red-500"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Peace-Assistent schließen" : "Peace-Assistent öffnen – schreib, was los ist"}
        aria-expanded={isOpen}
        className={`flex h-14 w-14 items-center justify-center shadow-schwebend transition-colors ${
          isOpen ? 'bg-db-dark text-white' : 'bg-db-red text-white'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageSquareText className="h-6 w-6" aria-hidden="true" />
        )}
      </motion.button>
      
    </div>
  );
}
