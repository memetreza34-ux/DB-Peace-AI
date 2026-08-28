import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Info,
  Play,
  X,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useModalDialog } from "../hooks/useModalDialog.js";

const sampleModules = [
  {
    title: "Situation sicher einschätzen",
    duration: "ca. 10 Minuten",
    content: "Prüfe zuerst, ob eine akute Gefahr besteht. Eigenschutz und reale Hilfe gehen vor. Eine App oder KI ersetzt bei Gewalt, medizinischem Notfall oder unmittelbarer Bedrohung keinen Notruf.",
    quiz: {
      question: "Was hat bei einer akut gefährlichen Situation Vorrang?",
      options: [
        "Den Vorfall zuerst vollständig in der App dokumentieren",
        "Eigenschutz und reale Hilfe organisieren",
        "Die beteiligte Person allein konfrontieren",
      ],
      correct: 1,
    },
  },
  {
    title: "Beobachtungen sachlich dokumentieren",
    duration: "ca. 10 Minuten",
    content: "Notiere beobachtbare Tatsachen wie Datum, Uhrzeit, Ort, Beteiligte, mögliche Zeug:innen und konkrete Aussagen. Trenne Wahrnehmungen und Gefühle klar von Vermutungen über Motive.",
    quiz: {
      question: "Welche Formulierung ist für ein Gedächtnisprotokoll am geeignetsten?",
      options: [
        "Die Person wollte mich bestimmt absichtlich zerstören.",
        "Am 5. August um 14:10 Uhr fiel im Pausenraum der Satz …",
        "Alle behandeln mich immer schlecht.",
      ],
      correct: 1,
    },
  },
  {
    title: "Passenden Hilfeweg auswählen",
    duration: "ca. 10 Minuten",
    content: "Wähle den nächsten Schritt nach Dringlichkeit und Zuständigkeit. Frage vor dem Teilen sensibler Details, wer Zugriff erhält, wie dokumentiert wird und welche Stelle tatsächlich zuständig ist.",
    quiz: {
      question: "Was ist vor dem Teilen sensibler Angaben sinnvoll?",
      options: [
        "Zuständigkeit und Umgang mit Vertraulichkeit klären",
        "Möglichst viele Personen gleichzeitig informieren",
        "Klarnamen grundsätzlich öffentlich posten",
      ],
      correct: 0,
    },
  },
];

export function CourseDetailModal({ course, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isOpen = Boolean(course);

  useModalDialog({ isOpen, onClose: closeModal, dialogRef, initialFocusRef: closeButtonRef });

  const safeCourse = useMemo(() => normalizeCourse(course), [course]);
  const providerUrl = useMemo(() => getVerifiedCourseUrl(course?.link), [course]);

  useEffect(() => {
    if (!course) return;
    setActiveTab("overview");
    setCurrentModule(0);
    setCompletedModules([]);
    setQuizAnswer(null);
    setError("");
  }, [course]);

  if (!course) return null;

  const current = sampleModules[currentModule];
  const answerIsCorrect = quizAnswer === current.quiz.correct;

  function closeModal() {
    setError("");
    onClose();
  }

  function openModule(index) {
    const safeIndex = Math.max(0, Math.min(sampleModules.length - 1, index));
    setCurrentModule(safeIndex);
    setQuizAnswer(null);
    setActiveTab("training");
    setError("");
  }

  function completeModule() {
    if (!answerIsCorrect) return;
    setCompletedModules((items) => items.includes(currentModule) ? items : [...items, currentModule]);

    if (currentModule < sampleModules.length - 1) {
      setCurrentModule((index) => index + 1);
      setQuizAnswer(null);
      return;
    }
    setActiveTab("note");
  }

  function downloadLearningNote() {
    try {
      const doc = new jsPDF();
      doc.setFillColor(31, 41, 55);
      doc.rect(0, 0, 210, 28, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("PERSÖNLICHE LERNNOTIZ", 15, 18);

      const text = [
        safeCourse.title,
        "",
        `Demo-Datensatz / angegebener Anbieter: ${safeCourse.provider}`,
        `Datum: ${new Date().toLocaleDateString("de-DE")}`,
        `Bearbeitete Beispielmodule: ${completedModules.length} von ${sampleModules.length}`,
        "",
        "Reflexionsfragen:",
        "- Was war für mich neu?",
        "- Welchen sicheren nächsten Schritt kann ich in einer schwierigen Situation nutzen?",
        "- Welche Information möchte ich noch bei einer fachkundigen Stelle prüfen?",
        "",
        "WICHTIG: Dieses Dokument ist eine private Lernnotiz aus einem Demonstrationsprototyp.",
        "Es ist kein Zertifikat, keine Teilnahmebescheinigung und kein offizieller Nachweis.",
      ].join("\n");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(35, 35, 35);
      const lines = doc.splitTextToSize(text, 180);
      let y = 42;
      for (const line of lines) {
        if (y > 278) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += 5.4;
      }
      doc.save(`Lernnotiz_${safeFileName(safeCourse.title)}.pdf`);
      setError("");
    } catch {
      setError("Die Lernnotiz konnte nicht als PDF erzeugt werden.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="course-detail-title" aria-describedby="course-detail-description" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl outline-none">
        <header className="relative shrink-0 bg-slate-900 p-6 text-white">
          <button ref={closeButtonRef} type="button" onClick={closeModal} className="absolute right-5 top-5 rounded-full bg-white/10 p-2 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50" aria-label="Kursdetails schließen">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="mb-2 flex flex-wrap items-center gap-2 pr-12">
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-100">Ungeprüfter Demo-Katalogeintrag</span>
            <span className="text-xs font-semibold text-white/55">{safeCourse.provider}</span>
          </div>
          <h2 id="course-detail-title" className="pr-12 text-xl font-black">{safeCourse.title}</h2>
          <p id="course-detail-description" className="mt-2 pr-12 text-xs font-semibold leading-5 text-white/60">Externe Kursangaben sind nicht verifiziert. Die In-App-Module sind eigenständige Demo-Inhalte.</p>
        </header>

        <div className="flex shrink-0 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4" role="group" aria-label="Kursdetail-Bereich anzeigen">
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={BookOpen}>Übersicht</TabButton>
          <TabButton active={activeTab === "training"} onClick={() => setActiveTab("training")} icon={Play}>Demo-Training</TabButton>
          <TabButton active={activeTab === "note"} onClick={() => setActiveTab("note")} icon={FileText}>Lernnotiz</TabButton>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <Notice />
              <section>
                <h3 className="text-sm font-black text-slate-900">Beschreibung aus dem Demo-Datensatz</h3>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm font-medium leading-6 text-slate-600">{safeCourse.description}</p>
              </section>
              {safeCourse.requirements && (
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-xs font-black uppercase tracking-wide text-slate-800">Ungeprüfte Angaben</h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm font-medium leading-6 text-slate-600">{safeCourse.requirements}</p>
                </section>
              )}
              <section>
                <h3 className="text-sm font-black text-slate-900">In-App-Demo-Module</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">Diese Module gehören zum Prototyp und nicht automatisch zum genannten externen Angebot.</p>
                <div className="mt-4 space-y-3">
                  {sampleModules.map((module, index) => (
                    <button type="button" key={module.title} onClick={() => openModule(index)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-db-red hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-db-red/30">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${completedModules.includes(index) ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {completedModules.includes(index) ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : index + 1}
                        </span>
                        <div>
                          <p className="font-black text-slate-900">{module.title}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">{module.duration}</p>
                        </div>
                      </div>
                      <Play className="h-4 w-4 shrink-0 text-db-red" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </section>
              <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
                {providerUrl ? (
                  <a href={providerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-black text-slate-700 hover:border-db-red hover:text-db-red focus:outline-none focus:ring-2 focus:ring-db-red/30">
                    Anbieter-Seite prüfen
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900">Keine verifizierbare HTTPS-Anbieter-URL hinterlegt</span>
                )}
                <button type="button" onClick={() => openModule(0)} className="inline-flex items-center gap-2 rounded-xl bg-db-red px-5 py-2.5 text-sm font-black text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-db-red/30">
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Demo-Training starten
                </button>
              </div>
            </div>
          )}

          {activeTab === "training" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-500">
                <span>Beispielmodul {currentModule + 1} von {sampleModules.length}</span>
                <span>{completedModules.length} abgeschlossen</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true"><div className="h-full rounded-full bg-db-red transition-all" style={{ width: `${(completedModules.length / sampleModules.length) * 100}%` }} /></div>
              <section className="rounded-xl bg-slate-900 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wider text-red-200">{current.duration}</p>
                <h3 className="mt-2 text-lg font-black">{current.title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-white/75">{current.content}</p>
              </section>
              <fieldset className="rounded-xl border border-slate-200 p-5">
                <legend className="px-1 text-sm font-black text-slate-900">Wissensfrage</legend>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{current.quiz.question}</p>
                <div className="mt-4 space-y-2">
                  {current.quiz.options.map((option, index) => {
                    const selected = quizAnswer === index;
                    const correct = selected && index === current.quiz.correct;
                    const incorrect = selected && index !== current.quiz.correct;
                    return (
                      <button type="button" key={option} aria-pressed={selected} onClick={() => setQuizAnswer(index)} className={`w-full rounded-xl border p-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-db-red/30 ${correct ? "border-emerald-500 bg-emerald-50 text-emerald-900" : incorrect ? "border-red-500 bg-red-50 text-red-900" : "border-slate-200 text-slate-800 hover:bg-slate-50"}`}>
                        {option}
                      </button>
                    );
                  })}
                </div>
                {quizAnswer !== null && <p className={`mt-3 text-xs font-bold ${answerIsCorrect ? "text-emerald-700" : "text-red-700"}`} role="status">{answerIsCorrect ? "Richtig. Du kannst das Modul abschließen." : "Noch nicht richtig. Prüfe die Antwort erneut."}</p>}
              </fieldset>
              <div className="flex items-center justify-between gap-3">
                <button type="button" disabled={currentModule === 0} onClick={() => openModule(currentModule - 1)} className="rounded-xl px-4 py-2 text-sm font-black text-slate-600 focus:outline-none focus:ring-2 focus:ring-db-red/30 disabled:opacity-30">Zurück</button>
                <button type="button" disabled={!answerIsCorrect} onClick={completeModule} className="rounded-xl bg-db-red px-5 py-2.5 text-sm font-black text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-db-red/30 disabled:cursor-not-allowed disabled:opacity-40">
                  {currentModule < sampleModules.length - 1 ? "Modul abschließen" : "Abschließen und Lernnotiz öffnen"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "note" && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700"><Award className="h-8 w-8" aria-hidden="true" /></div>
              <h3 className="mt-5 text-2xl font-black text-slate-900">Persönliche Lernnotiz</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm font-medium leading-7 text-slate-600">Du kannst den aktuellen Lernstand als private PDF-Notiz exportieren. Das Dokument bestätigt keine Teilnahme an einem externen Kurs und ist kein offizieller Nachweis.</p>
              <div className="mx-auto mt-5 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-4 text-left text-xs font-semibold leading-5 text-amber-950">Bearbeitete Demo-Module: {completedModules.length} von {sampleModules.length}</div>
              {error && <p role="alert" className="mx-auto mt-4 max-w-md rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-800">{error}</p>}
              <button type="button" onClick={downloadLearningNote} className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-600/30">
                <Download className="h-4 w-4" aria-hidden="true" />
                Private Lernnotiz als PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, children, icon: Icon, onClick }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-db-red/30 ${active ? "border-db-red text-db-red" : "border-transparent text-slate-500 hover:text-slate-900"}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  );
}

function Notice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-950">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      Kurs, Anbieter, Kosten, Termin, Verfügbarkeit und Anerkennung müssen direkt bei einer offiziellen Quelle geprüft werden.
    </div>
  );
}

function normalizeCourse(course) {
  return {
    title: String(course?.title || "Unbenannter Demo-Eintrag").slice(0, 180),
    provider: String(course?.provider || "Anbieter nicht verifiziert").slice(0, 140),
    description: sanitizeDemoText(course?.desc || course?.description || "Keine Beschreibung hinterlegt."),
    requirements: sanitizeDemoText(course?.requirements || course?.requirement || ""),
  };
}

function sanitizeDemoText(value) {
  return String(value)
    .replace(/offizielles angebot/gi, "ungeprüfter Demo-Eintrag")
    .replace(/offiziell anerkannt/gi, "laut Demo-Datensatz anerkannt")
    .replace(/anerkannter abschluss/gi, "im Demo-Datensatz behaupteter Abschluss")
    .slice(0, 1_500);
}

function getVerifiedCourseUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function safeFileName(value) {
  return value.replace(/[^a-zA-Z0-9äöüÄÖÜß-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80) || "Lernnotiz";
}
