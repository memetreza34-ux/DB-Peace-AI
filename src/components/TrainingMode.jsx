import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Info,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  TrainFront,
  Wrench,
  XCircle,
} from "lucide-react";

const scenarios = [
  {
    id: "passenger",
    title: "Aggressive Ansprache am Bahnsteig",
    context: "Eine Person beschwert sich laut, beleidigt Mitarbeitende und kommt näher.",
    icon: TrainFront,
    rounds: [
      {
        situation: "Die Person spricht sehr laut und fordert sofort eine Erklärung.",
        options: [
          option("Ich werde ebenfalls laut, damit ich mich durchsetze.", "unsafe", "Gegenlautstärke kann die Situation verschärfen."),
          option("Ich bleibe ruhig, halte Abstand und gebe nur verfügbare Informationen.", "good", "Ruhiger Ton, Abstand und klare Informationen sind eine belastbare erste Reaktion."),
          option("Ich ignoriere alles, obwohl die Person andere bedroht.", "weak", "Rückzug kann richtig sein, aber bei Gefahr muss reale Unterstützung organisiert werden."),
        ],
      },
      {
        situation: "Die Person beleidigt dich direkt und überschreitet deine persönliche Distanz.",
        options: [
          option("Ich setze eine kurze Grenze, vergrößere den Abstand und hole Unterstützung.", "excellent", "Die Antwort verbindet Grenze, Eigenschutz und reale Unterstützung."),
          option("Ich bleibe allein stehen und diskutiere weiter.", "unsafe", "Bei zunehmender Bedrohung sollte die direkte Diskussion beendet werden."),
          option("Ich entferne mich kommentarlos und informiere niemanden.", "weak", "Eigenschutz ist wichtig; bei Gefahr oder Risiko für andere sollte Unterstützung informiert werden."),
        ],
      },
      {
        situation: "Die Lage wirkt nicht mehr kontrollierbar und eine Gewalthandlung ist möglich.",
        options: [
          option("Ich versuche die Person ohne Ausbildung körperlich festzuhalten.", "unsafe", "Körperliches Eingreifen kann dich und andere zusätzlich gefährden."),
          option("Ich bringe mich aus der Gefahrenzone und alarmiere reale Hilfe.", "excellent", "In akuter Gefahr haben Abstand, Notruf und Schutz Vorrang vor Dokumentation oder Diskussion."),
          option("Ich dokumentiere zuerst alles ausführlich in der App.", "unsafe", "Dokumentation erfolgt erst, wenn die akute Gefahr vorbei ist."),
        ],
      },
    ],
  },
  {
    id: "workshop",
    title: "Wiederholte Ausgrenzung in der Ausbildung",
    context: "Eine auszubildende Person wird regelmäßig abgewertet und von Aufgaben ausgeschlossen.",
    icon: Wrench,
    rounds: [
      {
        situation: "Im Team fallen wiederholt abwertende Sprüche über dieselbe Person.",
        options: [
          option("Ich mache einen Gegenspruch über die andere Person.", "unsafe", "Eine Gegenbeleidigung verschiebt den Konflikt, statt ihn zu begrenzen."),
          option("Ich benenne ruhig, dass die Aussage abwertend ist, und unterstütze die betroffene Person.", "excellent", "Die Reaktion setzt eine Grenze, ohne zusätzlich zu eskalieren."),
          option("Ich lache mit, weil es vielleicht nur Spaß ist.", "unsafe", "Mitlachen kann Ausgrenzung verstärken und Betroffene weiter isolieren."),
        ],
      },
      {
        situation: "Das Verhalten wiederholt sich über mehrere Wochen.",
        options: [
          option("Ich veröffentliche Namen und Screenshots in einem großen Verteiler.", "unsafe", "Unkontrolliertes Weiterverbreiten kann Datenschutz, Betroffene und Klärung zusätzlich belasten."),
          option("Ich dokumentiere konkrete Beobachtungen und frage die betroffene Person, welche Unterstützung gewünscht ist.", "excellent", "Sachliche Dokumentation und abgestimmte Unterstützung sind ein guter nächster Schritt."),
          option("Ich warte unbegrenzt ab.", "weak", "Bei einem wiederkehrenden Muster sollte eine passende Vertrauens- oder Fachstelle einbezogen werden."),
        ],
      },
      {
        situation: "Du möchtest eine zuständige Stelle ansprechen.",
        options: [
          option("Ich schildere nur beobachtbare Tatsachen und kläre vorher Zuständigkeit sowie Umgang mit Vertraulichkeit.", "excellent", "Das reduziert unnötige Daten und schafft Klarheit über den Prozess."),
          option("Ich garantiere der betroffenen Person, dass alles absolut geheim bleibt.", "unsafe", "Eine absolute Vertraulichkeitsgarantie ist ohne Kenntnis von Rolle und Verfahren nicht belastbar."),
          option("Ich füge Vermutungen über Motive als sichere Tatsachen hinzu.", "unsafe", "Beobachtungen, Gefühle und Vermutungen müssen getrennt werden."),
        ],
      },
    ],
  },
  {
    id: "safety-rule",
    title: "Druck, eine Sicherheitsregel zu umgehen",
    context: "Eine andere Person drängt dich, einen unsicheren Ablauf zu akzeptieren.",
    icon: ShieldAlert,
    rounds: [
      {
        situation: "Es heißt, die Abkürzung werde immer so gemacht und spare Zeit.",
        options: [
          option("Ich mache mit, damit ich nicht als schwierig gelte.", "unsafe", "Sozialer Druck ist kein Grund, eine Sicherheitsregel zu umgehen."),
          option("Ich lehne den unsicheren Ablauf klar ab und schlage eine regelkonforme Alternative vor.", "excellent", "Die Antwort priorisiert Sicherheit und bleibt lösungsorientiert."),
          option("Ich beleidige die Person wegen ihres Vorschlags.", "unsafe", "Die Grenze kann ohne persönliche Abwertung gesetzt werden."),
        ],
      },
      {
        situation: "Der Druck wird stärker und könnte Auswirkungen auf andere haben.",
        options: [
          option("Ich stoppe meinen eigenen unsicheren Beitrag und informiere eine verantwortliche Stelle.", "excellent", "Bei möglicher Gefährdung muss Sicherheit vor Tempo und Gruppendruck stehen."),
          option("Ich verlasse den Bereich, ohne jemanden zu informieren.", "weak", "Eigenschutz ist wichtig; ein fortbestehendes Risiko für andere sollte gemeldet werden."),
          option("Ich hoffe, dass nichts passiert.", "unsafe", "Ein bekanntes Sicherheitsrisiko darf nicht nur beobachtet werden."),
        ],
      },
      {
        situation: "Nach der Situation möchtest du den Vorgang festhalten.",
        options: [
          option("Ich notiere Zeitpunkt, Ablauf, konkrete Aussagen und meine Handlung sachlich.", "excellent", "Eine zeitnahe, sachliche Notiz unterstützt spätere Klärung."),
          option("Ich erfinde Details, damit die Meldung ernster klingt.", "unsafe", "Unzutreffende Angaben schaden der Glaubwürdigkeit und können andere belasten."),
          option("Ich speichere echte Personendaten in diesem Demonstrationsprototyp.", "unsafe", "Der aktuelle Prototyp ist nicht für reale sensible Daten freigegeben."),
        ],
      },
    ],
  },
];

const quality = {
  excellent: {
    label: "Belastbare Option",
    className: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700/50 dark:bg-emerald-950/25 dark:text-emerald-100",
    icon: CheckCircle2,
  },
  good: {
    label: "Gute Grundlage",
    className: "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700/50 dark:bg-blue-950/25 dark:text-blue-100",
    icon: CheckCircle2,
  },
  weak: {
    label: "Unvollständig",
    className: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/25 dark:text-amber-100",
    icon: AlertTriangle,
  },
  unsafe: {
    label: "Riskante Option",
    className: "border-red-300 bg-red-50 text-red-950 dark:border-red-700/50 dark:bg-red-950/25 dark:text-red-100",
    icon: XCircle,
  },
};

function TrainingMode() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const feedbackRef = useRef(null);

  const scenario = scenarios[scenarioIndex];
  const round = scenario.rounds[roundIndex];
  const selected = selectedIndex === null ? null : round.options[selectedIndex];

  useEffect(() => {
    if (selected) window.requestAnimationFrame(() => feedbackRef.current?.focus());
  }, [selected]);

  function selectScenario(index) {
    if (!Number.isInteger(index) || index < 0 || index >= scenarios.length) return;
    setScenarioIndex(index);
    resetProgress();
  }

  function resetProgress() {
    setRoundIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
    setIsComplete(false);
  }

  function selectAnswer(index) {
    if (selectedIndex !== null || !round.options[index]) return;
    const answer = round.options[index];
    setSelectedIndex(index);
    setAnswers((current) => [...current, answer]);
  }

  function continueTraining() {
    if (!selected) return;
    if (roundIndex === scenario.rounds.length - 1) {
      setIsComplete(true);
      return;
    }
    setRoundIndex((current) => current + 1);
    setSelectedIndex(null);
  }

  return (
    <section className="py-4 sm:py-6">
      <header className="grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-db-red">Lokale Übung</p>
          <h2 className="mt-2 text-3xl font-black text-db-dark dark:text-white sm:text-4xl">Szenarien mit fest hinterlegtem Regel-Feedback</h2>
          <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-db-rail dark:text-white/65">
            Die Übung verwendet keine KI. Antworten, Bewertungen und Rückmeldungen sind statisch im Code hinterlegt und dienen nur der Reflexion.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/25 dark:text-amber-100">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>Kein Zertifikat, keine Punkte und keine Kompetenzmessung. Bei akuter Gefahr reale Hilfe nutzen.</p>
        </div>
      </header>

      <div className="mt-7 grid gap-6 xl:grid-cols-[0.75fr_1.35fr]">
        <aside className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5" aria-label="Trainingsszenarien">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-db-red" aria-hidden="true" />
            <h3 className="text-xl font-black text-db-dark dark:text-white">Szenario auswählen</h3>
          </div>
          <div className="mt-5 space-y-3">
            {scenarios.map((item, index) => {
              const Icon = item.icon;
              const active = index === scenarioIndex;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => selectScenario(index)}
                  aria-pressed={active}
                  className={`w-full rounded-xl border p-4 text-left transition ${active ? "border-db-red bg-red-50 dark:bg-db-red/10" : "border-db-dark/10 bg-db-soft hover:border-db-red dark:border-white/10 dark:bg-white/5"}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-db-red" : "text-db-rail dark:text-white/55"}`} aria-hidden="true" />
                    <div>
                      <p className="font-black text-db-dark dark:text-white">{item.title}</p>
                      <p className="mt-2 text-xs font-semibold leading-5 text-db-rail dark:text-white/55">{item.context}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div>
          {!isComplete ? (
            <div className="overflow-hidden rounded-xl border border-db-dark/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="bg-db-dark p-5 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-red-200">Runde {roundIndex + 1} von {scenario.rounds.length}</p>
                    <h3 className="mt-2 text-2xl font-black">{scenario.title}</h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">statische Demo-Logik</span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
                  <div className="h-full rounded-full bg-db-red transition-all" style={{ width: `${((roundIndex + (selected ? 1 : 0)) / scenario.rounds.length) * 100}%` }} />
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-wider text-db-red">Situation</p>
                <h4 className="mt-2 text-xl font-black leading-8 text-db-dark dark:text-white">{round.situation}</h4>

                <div className="mt-5 space-y-3" role="group" aria-label="Antwortmöglichkeiten">
                  {round.options.map((answer, index) => {
                    const locked = selectedIndex !== null;
                    return (
                      <button
                        type="button"
                        key={answer.text}
                        aria-disabled={locked}
                        onClick={() => selectAnswer(index)}
                        className={`w-full rounded-xl border p-4 text-left text-sm font-semibold leading-6 transition ${selectedIndex === index ? quality[answer.quality].className : "border-db-dark/10 bg-db-soft text-db-dark hover:border-db-red dark:border-white/10 dark:bg-white/5 dark:text-white"} ${locked && selectedIndex !== index ? "cursor-default opacity-60" : ""}`}
                      >
                        <span className="mr-2 font-black text-db-red">{String.fromCharCode(65 + index)}.</span>
                        {answer.text}
                      </button>
                    );
                  })}
                </div>

                {selected && (
                  <Feedback
                    answer={selected}
                    feedbackRef={feedbackRef}
                    onContinue={continueTraining}
                    isLast={roundIndex === scenario.rounds.length - 1}
                  />
                )}
              </div>
            </div>
          ) : (
            <Result scenario={scenario} answers={answers} onReset={resetProgress} onNext={() => selectScenario((scenarioIndex + 1) % scenarios.length)} />
          )}
        </div>
      </div>
    </section>
  );
}

function Feedback({ answer, feedbackRef, isLast, onContinue }) {
  const definition = quality[answer.quality];
  const Icon = definition.icon;

  return (
    <div ref={feedbackRef} tabIndex={-1} role="status" className={`mt-5 rounded-xl border p-5 outline-none ${definition.className}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-black">{definition.label}</p>
          <p className="mt-2 text-sm font-semibold leading-6">{answer.feedback}</p>
        </div>
      </div>
      <button type="button" onClick={onContinue} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-db-dark px-5 py-3 text-sm font-black text-white hover:bg-slate-800 sm:w-auto">
        {isLast ? "Lernrückmeldung öffnen" : "Nächste Runde"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function Result({ answers, onNext, onReset, scenario }) {
  const unsafeCount = answers.filter((answer) => answer.quality === "unsafe").length;
  const weakCount = answers.filter((answer) => answer.quality === "weak").length;
  const message = unsafeCount === 0 && weakCount === 0
    ? "Du hast in allen Runden Optionen gewählt, die Sicherheit, klare Grenzen oder passende Unterstützung in den Vordergrund stellen."
    : unsafeCount === 0
      ? "Deine Auswahl enthielt keine als riskant markierte Option. Einzelne Situationen lassen sich noch vollständiger lösen."
      : "In mindestens einer Runde wurde eine riskante Option gewählt. Wiederhole das Szenario und prüfe besonders Eigenschutz, sachliche Grenzen und zuständige reale Hilfe.";

  return (
    <div className="rounded-xl border border-db-dark/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <ShieldCheck className="h-9 w-9 text-emerald-600" aria-hidden="true" />
      <p className="mt-5 text-xs font-black uppercase tracking-wider text-db-red">Lokale Lernrückmeldung</p>
      <h3 className="mt-2 text-3xl font-black text-db-dark dark:text-white">{scenario.title} abgeschlossen</h3>
      <p className="mt-4 text-base font-semibold leading-7 text-db-rail dark:text-white/65">{message}</p>

      <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-800/50 dark:bg-violet-950/25">
        <p className="text-sm font-black text-violet-950 dark:text-violet-100">Keine Punktzahl und keine Kompetenzbewertung</p>
        <p className="mt-2 text-xs font-semibold leading-5 text-violet-900/75 dark:text-violet-100/70">
          Die Rückmeldung basiert ausschließlich auf fest hinterlegten Antwortkategorien. Sie wird nicht gespeichert und ist kein Trainingsnachweis.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onReset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-db-dark/15 px-5 py-3 text-sm font-black text-db-dark hover:border-db-red hover:text-db-red dark:border-white/15 dark:text-white">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Wiederholen
        </button>
        <button type="button" onClick={onNext} className="inline-flex items-center justify-center gap-2 rounded-xl bg-db-red px-5 py-3 text-sm font-black text-white hover:bg-red-700">
          Nächstes Szenario
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function option(text, qualityName, feedback) {
  return { text, quality: qualityName, feedback };
}

export default TrainingMode;
