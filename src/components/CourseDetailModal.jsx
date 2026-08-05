import React, { useState } from "react";
import { X, Play, CheckCircle2, Award, Download, ExternalLink, BookOpen, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { jsPDF } from "jspdf";

export function CourseDetailModal({ course, onClose }) {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'player' | 'certificate'
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);

  if (!course) return null;

  const modules = [
    {
      title: "Modul 1: Grundlagen der Zivilcourage & Rechtslage",
      duration: "20 Min.",
      content: "Verstehe deine Rechte als Azubi am Arbeitsplatz und lerne, wo Zivilcourage anfängt. Nach § 618 BGB hat der Arbeitgeber eine Fürsorgepflicht.",
      quiz: {
        question: "Was ist der wichtigste Grundsatz bei Zivilcourage im Betrieb?",
        options: [
          "Selbstschutz geht immer vor!",
          "Möglichst laut zurückschreien.",
          "Warten, bis der Meister reagiert.",
          "Nichts tun und wegsehen."
        ],
        correct: 0
      }
    },
    {
      title: "Modul 2: Deeskalation & De-Escalation Messaging",
      duration: "30 Min.",
      content: "Lerne die 'Ich-Botschaften' kennen. Vermeide Vorwürfe, bleibe ruhig im Tonfall, halte 1,5m Sicherheitsabstand.",
      quiz: {
        question: "Wie reagiert man am besten auf aggressive Äußerungen?",
        options: [
          "Gegenangriff starten",
          "Ruhe bewahren, Distanz wahren und klare Grenzen setzen",
          "Sofort körperlich eingreifen",
          "Den Raum verlassen ohne Rückmeldung"
        ],
        correct: 1
      }
    },
    {
      title: "Modul 3: Dokumentation & Meldung bei der DB",
      duration: "25 Min.",
      content: "So erstellst du ein lückenloses Gedächtnisprotokoll für JAV, Betriebsrat oder HR. Datum, Uhrzeit, Zeugen und wörtliche Zitate notieren.",
      quiz: {
        question: "Was gehört zwingend in ein Gedächtnisprotokoll?",
        options: [
          "Persönliche Vermutungen und Gefühle",
          "Sachliche Tatsachen, Datum, Uhrzeit, Personen & Aussagen",
          "Nur der Name des Vorgesetzten",
          "Keine Angaben"
        ],
        correct: 1
      }
    }
  ];

  const handleNextModule = () => {
    if (!completedModules.includes(currentModule)) {
      setCompletedModules([...completedModules, currentModule]);
    }
    if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setQuizAnswer(null);
    } else {
      setActiveTab("certificate");
    }
  };

  const handleDownloadCertificate = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(226, 0, 26); // DB Red
    doc.rect(0, 0, 210, 30, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("DEUTSCHE BAHN AG - BILDUNGSZERTIFIKAT", 15, 20);

    // Body
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text("Teilnahmebescheinigung", 15, 50);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Hiermit wird bestätigt, dass der/die Auszubildende das folgende E-Learning erfolgreich absolviert hat:", 15, 65);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(226, 0, 26);
    doc.text(course.title, 15, 80);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`Anbieter: ${course.provider}`, 15, 92);
    doc.text(`Abschlussdatum: ${new Date().toLocaleDateString("de-DE")}`, 15, 100);
    doc.text(`Prüf-ID: CERT-DB-${Math.floor(100000 + Math.random() * 900000)}`, 15, 108);

    doc.setFont("helvetica", "bold");
    doc.text("Vermittelte Kompetenzen:", 15, 125);

    doc.setFont("helvetica", "normal");
    doc.text("• Zivilcourage & Deeskalation im Arbeitsumfeld", 20, 135);
    doc.text("• AGG-Konforme Konfliktbewältigung & Selbstschutz", 20, 143);
    doc.text("• Rechtssichere Dokumentation für JAV & HR", 20, 151);

    // Stamp / Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 220, 195, 220);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("DB Peace AI Digital Academy — Offizieller Nachweis für die Personalakte", 15, 230);

    doc.save(`Zertifikat_${course.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
  };

  const getRealProviderUrl = (provider) => {
    const p = (provider || "").toLowerCase();
    if (p.includes("bpb")) return "https://www.bpb.de";
    if (p.includes("mauthausen")) return "https://www.zivilcourage.at";
    if (p.includes("amadeu")) return "https://www.amadeu-antonio-stiftung.de";
    if (p.includes("evg")) return "https://www.evg-online.org";
    if (p.includes("db")) return "https://www.deutschebahn.com";
    return "https://www.google.com/search?q=" + encodeURIComponent(course.title);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-db-red text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              {course.provider}
            </span>
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 75 Min. Gesamtdauer
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white pr-8">{course.title}</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-db-red text-db-red"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Kurs-Übersicht
          </button>
          <button
            onClick={() => setActiveTab("player")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === "player"
                ? "border-db-red text-db-red"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Play className="w-4 h-4" /> In-App Schulung starten
          </button>
          <button
            onClick={() => setActiveTab("certificate")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === "certificate"
                ? "border-db-red text-db-red"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Award className="w-4 h-4" /> Zertifikat
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Beschreibung</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{course.desc}</p>
              </div>

              {course.requirements && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Voraussetzungen:</h4>
                  <p className="text-xs text-slate-600">{course.requirements}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Lehrplan & Module</h3>
                <div className="space-y-2">
                  {modules.map((mod, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-3 flex items-center justify-between bg-white hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedModules.includes(idx) ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {completedModules.includes(idx) ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{mod.title}</p>
                          <p className="text-[11px] text-slate-500">{mod.duration}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentModule(idx);
                          setActiveTab("player");
                        }}
                        className="text-xs font-bold text-db-red hover:underline"
                      >
                        Starten
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <a
                  href={getRealProviderUrl(course.provider)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Externe Anbieter-Webseite öffnen
                </a>
                <button
                  onClick={() => setActiveTab("player")}
                  className="bg-db-red hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Jetzt In-App lernen
                </button>
              </div>
            </div>
          )}

          {activeTab === "player" && (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Modul {currentModule + 1} von {modules.length}</span>
                <span>{Math.round(((currentModule + 1) / modules.length) * 100)}% Abgeschlossen</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-db-red h-full transition-all duration-300" 
                  style={{ width: `${((currentModule + 1) / modules.length) * 100}%` }}
                ></div>
              </div>

              {/* Module Content */}
              <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-db-red">{modules[currentModule].title}</h4>
                <p className="text-xs leading-relaxed text-slate-300">{modules[currentModule].content}</p>
              </div>

              {/* Quiz */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <h5 className="font-bold text-xs text-slate-900">Wissens-Check:</h5>
                <p className="text-xs text-slate-700 font-medium">{modules[currentModule].quiz.question}</p>
                
                <div className="space-y-2 pt-2">
                  {modules[currentModule].quiz.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => setQuizAnswer(oIdx)}
                      className={`w-full text-left p-3 rounded-lg text-xs font-semibold border transition ${
                        quizAnswer === oIdx
                          ? oIdx === modules[currentModule].quiz.correct
                            ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                            : "bg-red-50 border-red-500 text-red-900"
                          : "border-slate-200 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  disabled={currentModule === 0}
                  onClick={() => setCurrentModule(currentModule - 1)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 disabled:opacity-30"
                >
                  Zurück
                </button>
                <button
                  onClick={handleNextModule}
                  className="bg-db-red hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  {currentModule < modules.length - 1 ? "Nächstes Modul" : "Abschließen & Zertifikat"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "certificate" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Herzlichen Glückwunsch!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Du hast den Kurs <strong>{course.title}</strong> erfolgreich absolviert. Du kannst dir jetzt dein offizielles Zertifikat für deine Ausbildungsakte herunterladen.
              </p>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={handleDownloadCertificate}
                  className="bg-db-red hover:bg-red-700 text-white text-xs font-bold px-6 py-3 rounded-lg shadow-md transition inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Zertifikat herunterladen (PDF)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
