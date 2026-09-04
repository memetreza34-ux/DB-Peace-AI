import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function QuizWidget() {
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = () => {
    setQuestions([
      {
        id: 1,
        question: "Ein Kollege macht sich im Team-Chat über eine andere Person lustig. Ist das Mobbing?",
        answer: true,
        explanation: "Ja. Wiederholtes Herabsetzen vor anderen – auch digital – ist eine Form von Mobbing."
      },
      {
        id: 2,
        question: "Darf mein Ausbilder mich vor der gesamten Gruppe lautstark anschreien, wenn ich einen Fehler mache?",
        answer: false,
        explanation: "Nein. Fehler passieren, aber sachliche Kritik muss respektvoll und idealerweise unter vier Augen geäußert werden."
      },
      {
        id: 3,
        question: "Ich fühle mich ungerecht behandelt, traue mich aber nicht zum Chef. Darf ich mich direkt an die JAV wenden?",
        answer: true,
        explanation: "Absolut! Die Jugend- und Auszubildendenvertretung (JAV) ist genau dafür da und behandelt dein Anliegen vertraulich."
      }
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (userAnswer) => {
    const currentQ = questions[currentQIndex];
    const correct = userAnswer === currentQ.answer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 rounded-lg bg-white dark:bg-db-dark/80  border border-line/10 shadow-md flex flex-col items-center justify-center gap-4 transition-colors">
        <Loader2 className="h-8 w-8 text-db-red animate-spin" />
        <p className="text-sm font-normal text-ink-muted">
          KI generiert neue Quiz-Fragen...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  if (isFinished) {
    return (
      <div className="w-full rounded-lg bg-db-dark text-white p-8 text-center shadow-md shadow-db-dark/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-10">
          <ShieldCheck className="w-40 h-40" />
        </div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="mx-auto w-16 h-16 bg-db-dark flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Quiz beendet!</h3>
          <p className="text-white/80 font-medium mb-6">
            Du hast {score} von {questions.length} Fragen richtig beantwortet.
          </p>
          {score === questions.length ? (
            <div className="inline-block bg-white/10 rounded-xl px-4 py-2 border border-white/20 mb-4">
              <p className="text-sm font-bold text-amber-400">🏆 Neues Abzeichen: DB Peace Guardian</p>
            </div>
          ) : null}
          <div className="mt-2">
            <button 
              onClick={() => { 
                setCurrentQIndex(0); 
                setScore(0); 
                setIsFinished(false); 
                setShowResult(false);
                fetchQuestions(); 
              }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 mx-auto"
            >
              Neue, endlose Fragen laden
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="w-full rounded-lg bg-white dark:bg-db-dark/80  border border-line/10 shadow-md p-6 relative overflow-hidden transition-colors">
      
      {/* Progress */}
      <div className="flex items-center gap-1 mb-6">
        {questions.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 flex-1 rounded-full ${idx <= currentQIndex ? 'bg-db-red' : 'bg-db-dark/10 dark:bg-white/10'}`} 
          />
        ))}
      </div>

      <div className="mb-2 text-xs font-bold text-db-red uppercase tracking-wider">
        Wissens-Quiz • Frage {currentQIndex + 1}
      </div>
      
      <h3 className="text-lg font-bold text-ink leading-snug min-h-[4rem]">
        {currentQ.question}
      </h3>

      {/* Ohne AnimatePresence mode="wait" — sonst blockiert eine nicht beendete
          Exit-Animation den Wechsel zur Auswertung. */}
      {!showResult ? (
          <motion.div 
            key="question"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mt-6"
          >
            <button 
              onClick={() => handleAnswer(true)}
              className="flex-1 bg-db-warm/50 dark:bg-white/5 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-line/10 rounded-xl p-4 text-center font-bold text-ink transition"
            >
              Ja
            </button>
            <button 
              onClick={() => handleAnswer(false)}
              className="flex-1 bg-db-warm/50 dark:bg-white/5 hover:bg-red-100 dark:hover:bg-red-500/20 border border-line/10 rounded-xl p-4 text-center font-bold text-ink transition"
            >
              Nein
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 rounded-md p-5 border ${
              isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' 
                : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={`font-bold ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isCorrect ? 'Richtig!' : 'Leider falsch.'}
                </h4>
                <p className="text-sm mt-1 text-db-dark/80 dark:text-white/80 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
            <button 
              onClick={nextQuestion}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-white dark:bg-white/10 border border-line/10 rounded-xl py-2.5 text-sm font-bold text-ink hover:bg-db-warm/50 dark:hover:bg-white/20 transition"
            >
              Weiter <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
    </div>
  );
}
