import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Ban,
  CheckCircle2,
  ClipboardList,
  Gauge,
  GraduationCap,
  Hand,
  MessageSquareWarning,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Wrench,
  Star,
} from "lucide-react";

const scenarios = [
  {
    id: "fahrgast",
    title: "Aggressiver Fahrgast",
    context: "Ein Fahrgast ist wütend wegen Verspätung und beleidigt Mitarbeitende.",
    goal: "Ruhig bleiben, Grenzen setzen, Sicherheit beachten.",
    difficulty: "Mittel",
    risk: "Mittel",
    icon: TrainFront,
    rounds: [
      {
        title: "Situation beginnt",
        description: "Am Bahnsteig beschwert sich ein Fahrgast lautstark über eine Verspätung.",
        options: makeOptions(
          "Dann schreien Sie doch nicht so rum, wir können auch nichts dafür.",
          "Ich ignoriere den Fahrgast und gehe sofort weg.",
          "Ich höre kurz zu, bleibe ruhig und erkläre knapp, welche Information verfügbar ist.",
          "Ich halte Abstand, spreche ruhig, setze früh eine Grenze und bitte bei Bedarf eine Kollegin dazu."
        ),
      },
      {
        title: "Situation wird schwieriger",
        description: "Der Fahrgast beleidigt dich direkt und spricht sehr laut weiter.",
        options: makeOptions(
          "Wenn Sie mich beleidigen, beleidige ich zurück.",
          "Ich lasse alles stehen, damit es nicht schlimmer wird.",
          "Ich sage ruhig, dass Beleidigungen nicht akzeptiert werden, und bleibe beim konkreten Anliegen.",
          "Ich setze eine klare Grenze, vergrößere Abstand und informiere eine zweite Person."
        ),
      },
      {
        title: "Entscheidung / Eskalationspunkt",
        description: "Der Fahrgast kommt körperlich näher und wirkt zunehmend bedrohlich.",
        options: makeOptions(
          "Ich stelle mich direkt vor ihn, damit er zurückweicht.",
          "Ich rede weiter allein auf ihn ein.",
          "Ich beende das Gespräch und hole Unterstützung.",
          "Ich halte Abstand, bringe mich aus der Nähe, kontaktiere reale Unterstützung und dokumentiere danach sachlich."
        ),
      },
    ],
  },
  {
    id: "werkstatt",
    title: "Mobbing in der Werkstatt",
    context: "Ein Azubi wird regelmäßig ausgelacht und vor anderen klein gemacht.",
    goal: "Mobbing erkennen, richtig reagieren, Hilfe holen.",
    difficulty: "Mittel",
    risk: "Mittel",
    icon: Wrench,
    rounds: [
      {
        title: "Situation beginnt",
        description: "Beim Schichtbeginn machen mehrere Personen abwertende Sprüche über einen Azubi.",
        options: makeOptions(
          "Ich mache einen Spruch zurück, damit die Gruppe merkt, wie es ist.",
          "Ich sage nichts, weil es vielleicht nur Spaß ist.",
          "Ich benenne ruhig, dass die Sprüche verletzend wirken können.",
          "Ich unterbreche sachlich, unterstütze den Azubi und beobachte, ob es ein Muster gibt."
        ),
      },
      {
        title: "Situation wird schwieriger",
        description: "Der Azubi wird von Aufgaben ausgeschlossen und wirkt sichtbar belastet.",
        options: makeOptions(
          "Ich konfrontiere die Gruppe laut vor allen.",
          "Ich rate dem Azubi, das einfach auszuhalten.",
          "Ich frage vertraulich, ob Unterstützung gewünscht ist.",
          "Ich dokumentiere konkrete Beobachtungen, spreche vertraulich mit dem Azubi und binde eine zuständige Person ein."
        ),
      },
      {
        title: "Entscheidung / Eskalationspunkt",
        description: "Das Verhalten wiederholt sich über mehrere Wochen in der Ausbildungssituation.",
        options: makeOptions(
          "Ich schreibe in den Gruppenchat, wer Schuld ist.",
          "Ich warte weiter ab.",
          "Ich sammle Fakten und suche das Gespräch mit einer Vertrauensperson.",
          "Ich sichere konkrete Beispiele, priorisiere Schutz der betroffenen Person und nutze offizielle Unterstützungswege."
        ),
      },
    ],
  },
  {
    id: "diskriminierung",
    title: "Diskriminierende Aussage",
    context: "In der Gruppe fällt ein Kommentar über Herkunft, Religion, Geschlecht oder Aussehen.",
    goal: "Grenzen setzen, respektvoll widersprechen.",
    difficulty: "Mittel",
    risk: "Mittel",
    icon: Ban,
    rounds: [
      {
        title: "Situation beginnt",
        description: "Bei einer Teamübergabe fällt ein abwertender Kommentar über Herkunft.",
        options: makeOptions(
          "Ich antworte mit einem abwertenden Kommentar zurück.",
          "Ich lache unsicher mit, damit es nicht auffällt.",
          "Ich sage ruhig, dass die Aussage nicht in Ordnung ist.",
          "Ich widerspreche klar und respektvoll, ohne die betroffene Person in den Mittelpunkt zu drängen."
        ),
      },
      {
        title: "Situation wird schwieriger",
        description: "Eine Person sagt, das sei doch nur ein Witz gewesen.",
        options: makeOptions(
          "Ich sage, dass diese Person grundsätzlich problematisch ist.",
          "Ich gebe nach, weil es sonst unangenehm wird.",
          "Ich bleibe beim Verhalten und erkläre, warum solche Aussagen verletzen können.",
          "Ich setze eine klare Norm: respektvolle Sprache, keine Abwertung, bei Bedarf spätere Klärung mit Unterstützung."
        ),
      },
      {
        title: "Entscheidung / Eskalationspunkt",
        description: "Ähnliche Kommentare fallen wiederholt im Team.",
        options: makeOptions(
          "Ich veröffentliche Screenshots im größeren Verteiler.",
          "Ich ziehe mich komplett zurück.",
          "Ich dokumentiere die Wiederholung und suche Unterstützung.",
          "Ich unterstütze Betroffene, dokumentiere sachlich und informiere eine zuständige interne Stelle."
        ),
      },
    ],
  },
  {
    id: "gruppenchat",
    title: "Konflikt im Gruppenchat",
    context: "Ein Chat kippt in Beleidigungen und Ausgrenzung.",
    goal: "Eskalation stoppen, sachlich bleiben, dokumentieren.",
    difficulty: "Mittel",
    risk: "Mittel",
    icon: MessageSquareWarning,
    rounds: [
      {
        title: "Situation beginnt",
        description: "Im Gruppenchat einer Ausbildungsklasse wird eine Person abwertend kommentiert.",
        options: makeOptions(
          "Ich poste noch einen Kommentar dazu.",
          "Ich lese nur mit und hoffe, dass es endet.",
          "Ich bitte darum, sachlich zu bleiben.",
          "Ich stoppe die weitere Eskalation klar, ohne zusätzliche Details zu verbreiten."
        ),
      },
      {
        title: "Situation wird schwieriger",
        description: "Es werden Screenshots und private Informationen geteilt.",
        options: makeOptions(
          "Ich leite die Screenshots an weitere Personen weiter.",
          "Ich lösche alles und tue so, als hätte ich nichts gesehen.",
          "Ich schreibe, dass private Inhalte nicht weiter geteilt werden sollen.",
          "Ich stoppe die Verbreitung, sichere notwendige Informationen nur für Klärung und hole Unterstützung."
        ),
      },
      {
        title: "Entscheidung / Eskalationspunkt",
        description: "Die betroffene Person schreibt, dass sie nicht mehr zur Schicht kommen möchte.",
        options: makeOptions(
          "Ich schreibe, sie soll sich nicht so anstellen.",
          "Ich antworte gar nicht, weil es kompliziert ist.",
          "Ich frage vertraulich nach und empfehle Unterstützung.",
          "Ich nehme die Belastung ernst, biete Unterstützung an und informiere eine zuständige Vertrauensperson."
        ),
      },
    ],
  },
  {
    id: "druck",
    title: "Druck durch Kolleginnen oder Kollegen",
    context: "Jemand wird gedrängt, etwas Unsicheres oder Falsches zu machen.",
    goal: "Nein sagen, Sicherheit priorisieren, Unterstützung holen.",
    difficulty: "Mittel",
    risk: "Mittel",
    icon: Hand,
    rounds: [
      {
        title: "Situation beginnt",
        description: "Kurz vor Schichtbeginn drängt dich jemand, eine Sicherheitsregel zu umgehen.",
        options: makeOptions(
          "Ich mache mit, damit es schneller geht.",
          "Ich sage nichts und verzögere heimlich.",
          "Ich sage ruhig, dass ich die Regel einhalte.",
          "Ich sage klar Nein, begründe es mit Sicherheit und schlage eine regelkonforme Lösung vor."
        ),
      },
      {
        title: "Situation wird schwieriger",
        description: "Die Person macht Druck und sagt, alle anderen würden das auch so machen.",
        options: makeOptions(
          "Ich beschimpfe die Person wegen ihres Verhaltens.",
          "Ich gebe nach, um nicht als schwierig zu gelten.",
          "Ich bleibe bei meiner Grenze.",
          "Ich halte meine Grenze, dokumentiere den Druck und ziehe bei Bedarf eine zuständige Person hinzu."
        ),
      },
      {
        title: "Entscheidung / Eskalationspunkt",
        description: "Die Situation könnte Auswirkungen auf Kundensicherheit oder Betrieb haben.",
        options: makeOptions(
          "Ich entscheide allein und hoffe, dass nichts passiert.",
          "Ich verlasse die Situation ohne Information.",
          "Ich stoppe den unsicheren Ablauf und informiere die verantwortliche Stelle.",
          "Ich priorisiere Sicherheit, unterbreche den Ablauf und hole sofort verantwortliche Unterstützung."
        ),
      },
    ],
  },
  {
    id: "drohung",
    title: "Gewaltandrohung",
    context: "Eine Person droht körperliche Gewalt an.",
    goal: "Abstand halten, nicht provozieren, reale Hilfe einschalten.",
    difficulty: "Hoch",
    risk: "Hoch",
    icon: ShieldAlert,
    rounds: [
      {
        title: "Situation beginnt",
        description: "Am Bahnsteig droht eine Person: 'Ich schlage gleich zu.'",
        options: makeOptions(
          "Ich fordere die Person heraus, es doch zu versuchen.",
          "Ich bleibe allein stehen und rede weiter.",
          "Ich halte Abstand und beende die direkte Diskussion.",
          "Ich halte Abstand, bringe mich in Sicherheit und kontaktiere sofort reale Unterstützung."
        ),
      },
      {
        title: "Situation wird schwieriger",
        description: "Die Person kommt näher und wirkt unberechenbar.",
        options: makeOptions(
          "Ich gehe auf die Person zu, um Stärke zu zeigen.",
          "Ich diskutiere weiter, um sie zu überzeugen.",
          "Ich weiche zurück und rufe Unterstützung.",
          "Ich vergrößere Abstand, warne andere im Umfeld und nutze die vorgesehenen Notfallwege."
        ),
      },
      {
        title: "Entscheidung / Eskalationspunkt",
        description: "Die Lage ist nicht mehr sicher kontrollierbar.",
        options: makeOptions(
          "Ich versuche die Person körperlich festzuhalten.",
          "Ich warte ab, ob es wirklich passiert.",
          "Ich verlasse den Gefahrenbereich und informiere sofort zuständige Hilfe.",
          "Ich priorisiere Sicherheit, alarmiere reale Hilfe und dokumentiere erst nach der Gefahrensituation."
        ),
      },
    ],
  },
];

const learningCards = [
  {
    title: "Ruhe bewahren",
    text: "Sprich langsamer, atme bewusst und bleibe beim beobachtbaren Verhalten. Ruhe senkt oft das Tempo der Eskalation.",
  },
  {
    title: "Abstand halten",
    text: "Sichere Distanz schützt dich und gibt Handlungsspielraum. Bei Bedrohung zählt Sicherheit vor Diskussion.",
  },
  {
    title: "Nicht provozieren",
    text: "Keine Gegenbeleidigungen, keine Machtdemonstration. Klare Sprache ist stärker als laute Sprache.",
  },
  {
    title: "Klare Grenze setzen",
    text: "Benennen, was nicht akzeptabel ist. Kurz, ruhig und ohne persönliche Abwertung formulieren.",
  },
  {
    title: "Unterstützung holen",
    text: "Schwierige Situationen nicht allein tragen. Kolleginnen, Führung oder zuständige Stellen früh einbinden.",
  },
  {
    title: "Vorfall dokumentieren",
    text: "Nach der Situation sachlich festhalten: Ort, Zeit, Kontext, konkrete Aussagen und beobachtbares Verhalten.",
  },
  {
    title: "Bei Gefahr Sicherheit priorisieren",
    text: "Bei Drohung oder Gewalt nicht weiterklären. Abstand, reale Hilfe und Schutz anderer haben Vorrang.",
  },
];

function TrainingMode() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [history, setHistory] = useState([]);
  const [completed, setCompleted] = useState(false);

  const scenario = scenarios[scenarioIndex];
  const round = scenario.rounds[roundIndex];
  const selected = selectedOption === null ? null : round.options[selectedOption];
  const metrics = useMemo(() => calculateMetrics(history), [history]);
  const progress = Math.round(((roundIndex + (selected ? 1 : 0)) / scenario.rounds.length) * 100);

  function chooseScenario(index) {
    setScenarioIndex(index);
    setRoundIndex(0);
    setSelectedOption(null);
    setHistory([]);
    setCompleted(false);
  }

  function chooseOption(index) {
    if (selectedOption !== null) return;
    const option = round.options[index];
    setSelectedOption(index);
    setHistory((current) => [...current, option]);
  }

  function nextRound() {
    if (roundIndex >= scenario.rounds.length - 1) {
      setCompleted(true);
      return;
    }
    setRoundIndex((current) => current + 1);
    setSelectedOption(null);
  }

  function repeatScenario() {
    setRoundIndex(0);
    setSelectedOption(null);
    setHistory([]);
    setCompleted(false);
  }

  return (
    <section id="training" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <EntryHeader />
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.98fr_1.35fr_0.82fr]">
          <aside className="space-y-4">
            <ScenarioSelection activeIndex={scenarioIndex} onSelect={chooseScenario} />
          </aside>

          <div className="space-y-4">
            {!completed ? (
              <SimulationPanel
                onChoose={chooseOption}
                onNext={nextRound}
                progress={progress}
                round={round}
                roundIndex={roundIndex}
                scenario={scenario}
                selected={selected}
                selectedOption={selectedOption}
              />
            ) : (
              <FinalResult
                metrics={metrics}
                onNewScenario={() => chooseScenario((scenarioIndex + 1) % scenarios.length)}
                onRepeat={repeatScenario}
                scenario={scenario}
              />
            )}
          </div>

          <aside className="space-y-4">
            <ScorePanel metrics={metrics} />
          </aside>
        </div>
      </div>
    </section>
  );
}

function EntryHeader() {
  const badges = [
    "Realistische DB-Situationen",
    "Deeskalation üben",
    "Keine echten Daten",
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.78fr] lg:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-db-red">Trainingsmodus</p>
        <h2 className="mt-3 text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl">
          KI-Trainingsmodus
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-muted">
          Übe schwierige Situationen sicher in einer Simulation - bevor sie im Alltag eskalieren.
        </p>
        <p className="mt-4 max-w-3xl text-base font-normal leading-7 text-ink-muted">
          Die KI-Simulation hilft dabei, deeskalierende Antworten, klare Grenzen und sichere
          nächste Schritte zu trainieren.
        </p>
      </div>
      <div className="rounded-lg border border-line/10 bg-surface p-4 shadow-sm">
        <p className="flex items-start gap-3 text-sm font-bold text-ink">
          <ShieldCheck className="mt-0.5 shrink-0 text-db-red" size={18} aria-hidden="true" />
          Dieses Training ersetzt keine echte Schulung oder Hilfe in Gefahrensituationen.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span key={badge} className="rounded bg-db-soft dark:bg-db-dark/80 px-3 py-2 text-sm font-medium text-ink-muted">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScenarioSelection({ activeIndex, onSelect }) {
  return (
    <div className="rounded-lg border border-line/10 bg-surface p-5 shadow-panel">
      <div className="flex items-center gap-3">
        <GraduationCap className="text-db-red" size={24} aria-hidden="true" />
        <h3 className="text-xl font-bold dark:text-white">Szenario auswählen</h3>
      </div>
      <div className="mt-5 grid gap-3">
        {scenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          const active = activeIndex === index;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelect(index)}
              className={`group rounded-lg border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                active
                  ? "border-db-red bg-red-50"
                  : "border-db-dark/10 bg-db-soft hover:border-db-red"
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={active ? "text-db-red" : "text-ink-muted group-hover:text-db-red"} size={24} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink">{scenario.title}</p>
                    <DifficultyBadge value={scenario.difficulty} />
                  </div>
                  <p className="mt-2 text-sm font-normal leading-6 text-ink-muted">{scenario.context}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-db-red">
                    Lernziel: {scenario.goal}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SimulationPanel({ onChoose, onNext, progress, round, roundIndex, scenario, selected, selectedOption }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line/10 bg-surface shadow-panel">
      <div className="border-b border-line/10 bg-db-dark dark:bg-db-dark/80 p-5 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-red-200">
              Runde {roundIndex + 1} von {scenario.rounds.length}
            </p>
            <h3 className="mt-2 text-3xl font-bold">{scenario.title}</h3>
            <p className="mt-3 max-w-2xl font-semibold leading-7 text-white/75">{scenario.context}</p>
          </div>
          <RiskBadge value={scenario.risk} />
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded bg-white/15">
          <div className="h-full bg-db-red transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-lg bg-surface-sunk  p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-db-red">{round.title}</p>
          <h4 className="mt-2 text-2xl font-bold text-ink">Was würdest du tun?</h4>
          <p className="mt-3 text-lg font-normal leading-8 text-ink-muted">{round.description}</p>
          <p className="mt-4 rounded bg-surface p-3 text-sm font-bold text-ink">
            Lernziel: {scenario.goal}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {round.options.map((option, index) => (
            <button
              key={option.text}
              type="button"
              onClick={() => onChoose(index)}
              className={`rounded-lg border p-4 text-left font-semibold leading-7 transition ${
                selectedOption === index
                  ? "border-db-red bg-red-50 dark:bg-red-900/30 text-ink"
                  : "border-line/10 bg-surface hover:-translate-y-0.5 hover:border-db-red hover:shadow-sm"
              }`}
            >
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded bg-db-soft dark:bg-db-dark/80 text-sm font-bold text-db-red">
                {String.fromCharCode(65 + index)}
              </span>
              {option.text}
            </button>
          ))}
        </div>

        {selected && <FeedbackCard option={selected} onNext={onNext} isLast={roundIndex === scenario.rounds.length - 1} />}
      </div>
    </div>
  );
}

function FeedbackCard({ isLast, onNext, option }) {
  return (
    <div className="mt-6 rounded-lg border border-line/10 bg-surface-sunk  p-5 shadow-sm transition">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-db-red">Sofortiges Feedback</p>
          <h4 className="mt-1 text-2xl font-bold dark:text-white">Auswertung deiner Antwort</h4>
        </div>
        <span className={`w-fit rounded px-3 py-1 text-sm font-bold ${qualityStyles[option.quality].className}`}>
          {qualityStyles[option.quality].label}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <FeedbackBlock icon={CheckCircle2} title="Was daran gut war" text={option.feedback.good} />
        <FeedbackBlock icon={AlertTriangle} title="Was riskant war" text={option.feedback.risk} />
        <FeedbackBlock icon={Sparkles} title="Bessere Alternative" text={option.feedback.alternative} />
        <FeedbackBlock icon={BadgeCheck} title="Merksatz für den Alltag" text={option.feedback.memory} />
        <FeedbackBlock icon={ShieldCheck} title="Nächster sicherer Schritt" text={option.feedback.next} wide />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {Object.entries(option.scores).map(([label, value]) => (
          <ScoreBar key={label} label={metricLabels[label]} value={value} />
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-db-red px-5 py-3 font-bold text-white transition hover:bg-red-700 sm:w-auto"
      >
        {isLast ? "Training abschließen" : "Nächste Runde"}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

function FeedbackBlock({ icon: Icon, text, title, wide = false }) {
  return (
    <div className={`rounded bg-surface p-4 ${wide ? "md:col-span-2" : ""}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-1 shrink-0 text-db-red" size={18} aria-hidden="true" />
        <div>
          <p className="font-bold text-ink">{title}</p>
          <p className="mt-1 text-sm font-normal leading-6 text-ink-muted">{text}</p>
        </div>
      </div>
    </div>
  );
}

function FinalResult({ metrics, onNewScenario, onRepeat, scenario }) {
  const average = Math.round(
    (metrics.deescalation + metrics.safety + metrics.clarity + metrics.professionalism) / 4
  );

  return (
    <div className="rounded-lg border border-line/10 bg-surface p-5 shadow-panel">
      <p className="text-sm font-bold uppercase tracking-wide text-db-red">Abschluss</p>
      <div className="flex items-center gap-4 mt-6">
        <h3 className="text-3xl font-bold dark:text-white">Gesamtbewertung: {average}%</h3>
        {average > 50 && (
          <div className="bg-amber-100 border border-amber-300 text-amber-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            +50 DB Peace Points
          </div>
        )}
      </div>
      <p className="mt-3 text-lg font-normal leading-8 text-ink-muted">
        Du hast das Szenario "{scenario.title}" abgeschlossen. Die Auswertung basiert nur auf
        lokaler Demo-Logik.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ResultBlock title="Stärken" text={average >= 70 ? "Du hast sichere, klare und deeskalierende Handlungsoptionen gewählt." : "Du hast wichtige Ansätze erkannt, besonders dort, wo du Grenzen benannt hast."} />
        <ResultBlock title="Verbesserungsbereich" text={average >= 70 ? "Weiter üben: frühzeitig Unterstützung einbinden und knapp dokumentieren." : "Fokus: Abstand, klare Grenze, keine Gegeneskalation und reale Hilfe bei Gefahr."} />
        <ResultBlock title="Empfohlene Lernkarte" text={average >= 70 ? "Vorfall dokumentieren" : "Bei Gefahr Sicherheit priorisieren"} />
        <div className="rounded-lg border border-line/10 bg-db-dark dark:bg-db-dark/80 p-5 text-white">
          <GraduationCap size={28} className="text-red-200" aria-hidden="true" />
          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-white/60">Demo-Zertifikat</p>
          <h4 className="mt-2 text-2xl font-bold">Training abgeschlossen - Deeskalation Grundlagen</h4>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRepeat}
          className="inline-flex items-center justify-center gap-2 rounded border border-line/15 bg-surface px-5 py-3 font-bold text-ink transition hover:border-db-red hover:text-db-red"
        >
          Wiederholen
          <RefreshCw size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onNewScenario}
          className="inline-flex items-center justify-center gap-2 rounded bg-db-red px-5 py-3 font-bold text-white transition hover:bg-red-700"
        >
          Neues Szenario
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function ResultBlock({ text, title }) {
  return (
    <div className="rounded-lg bg-surface-sunk  p-5">
      <p className="text-sm font-bold uppercase tracking-wide text-db-red">{title}</p>
      <p className="mt-2 font-semibold leading-7 text-ink">{text}</p>
    </div>
  );
}

function ScorePanel({ metrics }) {
  return (
    <div className="rounded-lg bg-db-dark dark:bg-db-dark/80 p-5 text-white shadow-panel">
      <Gauge size={26} className="text-red-200" aria-hidden="true" />
      <h3 className="mt-4 text-xl font-bold">Kompetenzprofil</h3>
      <div className="mt-5 space-y-4">
        <ScoreBar label="Deeskalation" value={metrics.deescalation} dark />
        <ScoreBar label="Sicherheit" value={metrics.safety} dark />
        <ScoreBar label="Klarheit" value={metrics.clarity} dark />
        <ScoreBar label="Professionalität" value={metrics.professionalism} dark />
      </div>
    </div>
  );
}

function ScoreBar({ dark = false, label, value }) {
  return (
    <div>
      <div className={`mb-2 flex justify-between text-sm font-medium ${dark ? "text-white/80" : "text-ink-muted"}`}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className={`h-2 overflow-hidden rounded ${dark ? "bg-white/15" : "bg-db-dark/10 dark:bg-white/10"}`}>
        <div className="h-full rounded bg-db-red transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}



function DifficultyBadge({ value }) {
  return (
    <span className="rounded bg-surface px-2 py-1 text-sm font-medium text-ink-muted ring-1 ring-db-dark/10 dark:ring-white/10">
      {value}
    </span>
  );
}

function RiskBadge({ value }) {
  const className = value === "Hoch" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800";
  return <span className={`w-fit rounded px-3 py-1 text-sm font-bold ${className}`}>Risiko: {value}</span>;
}

function makeOptions(escalating, avoidant, good, professional) {
  return [
    createOption(escalating, "bad"),
    createOption(avoidant, "weak"),
    createOption(good, "good"),
    createOption(professional, "excellent"),
  ];
}

function createOption(text, quality) {
  const templates = {
    bad: {
      scores: { deescalation: 20, safety: 25, clarity: 35, professionalism: 20 },
      feedback: {
        good: "Du erkennst, dass die Situation eine Reaktion braucht.",
        risk: "Die Antwort kann die Lage verschärfen, provozieren oder den Fokus von Sicherheit weglenken.",
        alternative: "Ruhig bleiben, Abstand halten, klare Grenze setzen und Unterstützung einbinden.",
        memory: "Nicht jede klare Grenze muss laut sein.",
        next: "Kurz stoppen, Sicherheit prüfen und eine sachliche Formulierung wählen.",
      },
    },
    weak: {
      scores: { deescalation: 45, safety: 45, clarity: 30, professionalism: 45 },
      feedback: {
        good: "Du vermeidest eine direkte Gegeneskalation.",
        risk: "Zu viel Rückzug kann problematisches Verhalten normalisieren oder Betroffene allein lassen.",
        alternative: "Kurz, ruhig und klar reagieren: Verhalten benennen, Grenze setzen, Unterstützung holen.",
        memory: "Abwarten ist nicht immer neutral.",
        next: "Eine sichere, sachliche Intervention oder Meldung vorbereiten.",
      },
    },
    good: {
      scores: { deescalation: 76, safety: 72, clarity: 78, professionalism: 80 },
      feedback: {
        good: "Die Antwort bleibt ruhig, benennt das Problem und vermeidet Gegenangriffe.",
        risk: "Achte darauf, früh genug Unterstützung zu holen, wenn die Lage kippt.",
        alternative: "Noch stärker: klare Grenze plus konkreter nächster Schritt.",
        memory: "Sachlich bleiben heißt nicht, alles hinzunehmen.",
        next: "Situation beobachten, bei Wiederholung dokumentieren und zuständige Unterstützung einbinden.",
      },
    },
    excellent: {
      scores: { deescalation: 92, safety: 94, clarity: 90, professionalism: 93 },
      feedback: {
        good: "Sehr gute Balance aus Ruhe, klarer Grenze, Sicherheit und nächstem Schritt.",
        risk: "Auch professionelle Reaktionen brauchen reale Unterstützung, wenn Gefahr entsteht.",
        alternative: "Diese Antwort ist bereits sehr belastbar. Ergänzend kann nach der Situation dokumentiert werden.",
        memory: "Sicherheit zuerst, Klärung danach.",
        next: "Unterstützung einbinden, wenn nötig, und den Vorfall sachlich festhalten.",
      },
    },
  };

  return {
    text,
    quality,
    ...templates[quality],
  };
}

function calculateMetrics(history) {
  if (!history.length) {
    return { deescalation: 0, safety: 0, clarity: 0, professionalism: 0 };
  }

  const totals = history.reduce(
    (acc, option) => {
      Object.entries(option.scores).forEach(([key, value]) => {
        acc[key] += value;
      });
      return acc;
    },
    { deescalation: 0, safety: 0, clarity: 0, professionalism: 0 }
  );

  return Object.fromEntries(
    Object.entries(totals).map(([key, value]) => [key, Math.round(value / history.length)])
  );
}

const metricLabels = {
  deescalation: "Deeskalation",
  safety: "Sicherheit",
  clarity: "Klarheit",
  professionalism: "Professionalität",
};

const qualityStyles = {
  bad: { label: "Eskalationsrisiko", className: "bg-red-100 text-red-800" },
  weak: { label: "Ausweichend", className: "bg-amber-100 text-amber-800" },
  good: { label: "Deeskalierend", className: "bg-emerald-100 text-emerald-800" },
  excellent: { label: "Sehr sicher", className: "bg-emerald-100 text-emerald-800" },
};

export default TrainingMode;
