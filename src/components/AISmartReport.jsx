import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, CheckCircle2, Loader2, FileText } from "lucide-react";

export function AISmartReport({ onReportGenerated }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hallo, ich bin der DB Peace Assistent. Bitte beschreibe mir in eigenen Worten, was passiert ist. Ich erstelle daraus automatisch ein strukturiertes Protokoll für dich." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI extraction delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: "Danke. Ich habe die Kerninformationen extrahiert. Möchtest du das fertige Protokoll jetzt übernehmen oder noch etwas ergänzen?"
      }]);
      
      // Mock AI extraction logic
      const mockExtractedData = {
        category: "Vorfall-Protokoll (KI-generiert)",
        description: userMsg,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        location: userMsg.toLowerCase().includes("bahnhof") ? "Bahnhof" : userMsg.toLowerCase().includes("zug") ? "Zug" : "Unbekannt",
      };
      setGeneratedReport(mockExtractedData);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-db-dark/50 rounded-md border border-db-dark/10 dark:border-white/10 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-db-dark p-4 flex items-center gap-3 text-white">
        <div className="bg-white/10 p-2 rounded-full ">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold">KI-Meldeassistent</h3>
          <p className="text-xs text-white/70">Automatische Datenextraktion aus Freitext</p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-db-dark/80 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-db-red text-white rounded-tr-none' 
                : 'bg-white dark:bg-db-dark/50 border border-gray-200 dark:border-white/10 text-db-dark dark:text-white rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-db-dark/50 border border-gray-200 dark:border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-db-red" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Analysiert Text...</span>
            </div>
          </div>
        )}

        {generatedReport && !isTyping && (
          <div className="flex justify-start mt-4 animate-fadeIn">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl px-4 py-4 text-sm shadow-sm w-full">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-3">
                <CheckCircle2 className="w-5 h-5" />
                Protokoll erfolgreich generiert
              </div>
              <div className="space-y-2 text-green-900 dark:text-green-300 mb-4 text-xs bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                <p><strong>Datum:</strong> {generatedReport.date}</p>
                <p><strong>Uhrzeit:</strong> {generatedReport.time}</p>
                <p><strong>Ort:</strong> {generatedReport.location}</p>
                <p><strong>Extrakt:</strong> {generatedReport.description}</p>
              </div>
              <button 
                onClick={() => {
                  onReportGenerated(generatedReport);
                  setGeneratedReport(null);
                  setMessages(prev => [...prev, { role: "ai", text: "Protokoll wurde erfolgreich in deine Liste übernommen. Kann ich sonst noch etwas für dich tun?" }]);
                }}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition"
              >
                <FileText className="w-4 h-4" />
                In Protokoll-Liste übernehmen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-db-dark border-t border-gray-100 dark:border-white/10">
        <div className="flex gap-2 relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Beschreibe den Vorfall..."
            className="flex-1 border-2 border-db-dark/10 dark:border-white/10 dark:bg-db-dark/30 dark:text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-db-red transition pr-12"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-1 top-1 bottom-1 bg-db-red text-white p-2 rounded-full hover:bg-red-700 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
