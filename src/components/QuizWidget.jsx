import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const fallbackQuestions = [
  {
    id: "local-1",
    question: "Solltest du bei einem belastenden Vorfall möglichst zeitnah sachliche Notizen zu Datum, Ort und Beteiligten machen?",
    answer: true,
    explanation: "Ja. Zeitnahe, sachliche Notizen können helfen, den Ablauf später nachvollziehbar zu beschreiben. Vermutungen sollten klar von beobachteten Tatsachen getrennt werden.",
  },
  {
    id: "local-2",
    question: "Solltest du dich bei akuter Gewaltgefahr allein zwischen die beteiligten Personen stellen?",
    answer: false,
    explanation: "Nein. Eigenschutz geht vor. Abstand halten, reale Hilfe organisieren und bei akuter Gefahr 110 oder 112 anrufen.",
  },
  {
    id: "local-3",
    question: "Kann eine KI allein entscheiden, ob ein arbeitsrechtlicher Verstoß vorliegt?",
    answer: false,
    explanation: "Nein. Eine KI kann nur Orientierung und Strukturierung anbieten. Die Bewertung muss durch zuständige Menschen und bei Bedarf fachkundige Beratung erfolgen.",
  },
  {
    id: "local-4",
    question: "Ist es sinnvoll, vor dem Teilen sensibler Details nach Zuständigkeit und Umgang mit Vertraulichkeit zu fragen?",
    answer: true,
    explanation: "Ja. So kannst du besser einschätzen, welche Angaben wirklich benötigt werden und wer Zugriff auf sie erhält.",
  },
];

export function QuizWidget() {
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState("local");
  const [notice, setNotice] = useState("");
  const activeControllerRef = useRef(null);

  useEffect(() => {
    void reloadQuestions();
    return () => {
      activeControllerRef.current?.abort();
      activeControllerRef.current = null;
    };
  }, []);

  async function reloadQuestions() {
    activeControllerRef.current?.abort();
    const controller = new AbortController();
    activeControllerRef.current = controller;
    setIsLoading(true);
    setNotice("");

    try {
      const response = await fetch("/api/quiz", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`quiz_${response.status}`);
      const payload = await response.json();
      const validated = validateQuestions(payload.questions);
      if (validated.length < 3) throw new Error("quiz_invalid");
      if (controller.signal.aborted) return;

      startQuiz(validated, "ai");
    } catch (error) {
      if (error?.name === "AbortError" || controller.signal.aborted) return;
      startQuiz(fallbackQuestions.map((question) => ({ ...question })), "local");
      setNotice("Der KI-Dienst ist nicht verfügbar. Deshalb werden fest hinterlegte lokale Übungsfragen verwendet.");
    } finally {
      if (activeControllerRef.current === controller) {
        activeControllerRef.current = null;
        setIsLoading(false);
      }
    }
  }

  function startQuiz(nextQuestions, nextSource) {
    setQuestions(nextQuestions);
    setSource(nextSource);
    setCurrentQIndex(0);
    setScore(0);
    setShowResult(false);
    setIsCorrect(false);
    setIsFinished(false);
  }

  function handleAnswer(userAnswer) {
    const currentQuestion = questions[currentQIndex];
    if (!currentQuestion || showResult) return;

    const correct = userAnswer === currentQuestion.answer;
    setIsCorrect(correct);
    if (correct) setScore((current) => current + 1);
    setShowResult(true);
  }

  function nextQuestion() {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((current) => current + 1);
      setShowResult(false);
      setIsCorrect(false);
      return;
    }
    setIsFinished(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-xl border border-db-dark/10 bg-white shadow-md dark:border-white/10 dark:bg-db-dark/80" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-db-red" aria-hidden="true" />
        <p className="text-sm font-semibold text-db-rail dark:text-white/70">Quiz-Fragen werden geladen …</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-950" role="alert">
        Es konnten keine Quiz-Fragen geladen werden.
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-db-dark p-8 text-center text-white shadow-md">
        <ShieldCheck className="absolute -right-8 -top-8 h-36 w-36 opacity-5" aria-hidden="true" />
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} role="status" aria-live="polite">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <ShieldCheck className="h-8 w-8 text-emerald-300" aria-hidden="true" />
          </div>
          <h3 className="mt-5 text-2xl font-black">Quiz abgeschlossen</h3>
          <p className="mt-2 font-medium text-white/75">{score} von {questions.length} Fragen richtig beantwortet.</p>
          <p className="mx-auto mt-4 max-w-lg text-xs font-semibold leading-5 text-white/55">
            Das Ergebnis ist nur eine Lernrückmeldung. Es ist kein Zertifikat und keine fachliche oder rechtliche Bewertung.
          </p>
          <button type="button" onClick={() => void reloadQuestions()} className="mx-auto mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-black transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Neues Fragenset laden
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-db-dark/10 bg-white p-6 shadow-md dark:border-white/10 dark:bg-db-dark/80">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-wider text-db-red">Wissens-Quiz · Frage {currentQIndex + 1} von {questions.length}</p>
        <span className="rounded-full bg-db-soft px-3 py-1 text-[10px] font-black text-db-rail dark:bg-white/10 dark:text-white/60">
          {source === "ai" ? "KI-Fragen · ungeprüfte Lernhilfe" : "Lokale Übungsfragen"}
        </span>
      </div>

      {notice && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-950" role="status">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {notice}
        </div>
      )}

      <div className="mb-6 flex items-center gap-1" aria-hidden="true">
        {questions.map((question, index) => (
          <div key={question.id} className={`h-1.5 flex-1 rounded-full ${index <= currentQIndex ? "bg-db-red" : "bg-db-dark/10 dark:bg-white/10"}`} />
        ))}
      </div>

      <h3 className="min-h-16 text-lg font-black leading-snug text-db-dark dark:text-white">{currentQuestion.question}</h3>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div key="answers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 flex gap-3">
            <AnswerButton label="Ja" onClick={() => handleAnswer(true)} />
            <AnswerButton label="Nein" onClick={() => handleAnswer(false)} />
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className={`mt-6 rounded-xl border p-5 ${isCorrect ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10" : "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"}`} role="status" aria-live="polite">
            <div className="flex items-start gap-3">
              {isCorrect ? <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" /> : <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" aria-hidden="true" />}
              <div>
                <h4 className={`font-black ${isCorrect ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"}`}>{isCorrect ? "Richtig" : "Nicht richtig"}</h4>
                <p className="mt-1 text-sm font-medium leading-6 text-db-dark/80 dark:text-white/75">{currentQuestion.explanation}</p>
              </div>
            </div>
            <button type="button" onClick={nextQuestion} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-db-dark/10 bg-white py-2.5 text-sm font-black text-db-dark transition hover:bg-db-soft focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
              {currentQIndex < questions.length - 1 ? "Nächste Frage" : "Ergebnis anzeigen"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnswerButton({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex-1 rounded-xl border border-db-dark/10 bg-db-soft p-4 text-center font-black text-db-dark transition hover:border-db-red hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-db-red dark:hover:bg-db-red/10">
      {label}
    </button>
  );
}

function validateQuestions(input) {
  if (!Array.isArray(input)) return [];

  return input
    .slice(0, 6)
    .map((question, index) => ({
      id: String(question?.id ?? `ai-${index + 1}`),
      question: String(question?.question ?? "").trim().slice(0, 300),
      answer: normalizeBoolean(question?.answer),
      explanation: String(question?.explanation ?? "").trim().slice(0, 700),
    }))
    .filter((question) => question.question && question.explanation && question.answer !== null);
}

function normalizeBoolean(value) {
  if (value === true || value === false) return value;
  if (String(value).toLowerCase() === "true") return true;
  if (String(value).toLowerCase() === "false") return false;
  return null;
}
