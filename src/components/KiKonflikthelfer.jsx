import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardList,
  Clock3,
  EyeOff,
  FileText,
  HelpCircle,
  LockKeyhole,
  MessageSquareText,
  PenLine,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";

const issueCards = [
  {
    title: "Ich werde beleidigt",
    starter: "Ich werde wiederholt beleidigt und weiß nicht, wie ich reagieren soll.",
    category: "Beleidigung / Mobbing",
  },
  {
    title: "Ich werde ausgeschlossen",
    starter: "Ich werde im Team ausgeschlossen und wichtige Informationen erreichen mich nicht.",
    category: "Ausgrenzung",
  },
  {
    title: "Jemand droht mir",
    starter: "Jemand droht mir und ich habe Sorge, dass die Situation eskalieren kann.",
    category: "Drohung / akute Gefahr",
  },
  {
    title: "Konflikt mit Kolleg/in",
    starter: "Ich habe einen wiederkehrenden Konflikt mit einer Kollegin oder einem Kollegen.",
    category: "Arbeitsplatzkonflikt",
  },
  {
    title: "Aggressiver Kunde",
    starter: "Ein Kunde oder Fahrgast verhält sich aggressiv und ich brauche eine sichere Reaktion.",
    category: "Kundenaggression",
  },
  {
    title: "Diskriminierende Aussage",
    starter: "Ich habe eine diskriminierende Aussage über Herkunft, Religion, Geschlecht oder Identität erlebt.",
    category: "Diskriminierung",
  },
  {
    title: "Ich bin unsicher, ob es Mobbing ist",
    starter: "Ich bin unsicher, ob das Verhalten schon Mobbing ist oder ein normaler Konflikt.",
    category: "Einordnung",
  },
  {
    title: "Ich brauche Hilfe beim Formulieren",
    starter: "Ich brauche Hilfe, eine ruhige und professionelle Antwort zu formulieren.",
    category: "Formulierungshilfe",
  },
];

const guidedQuestions = [
  "Was ist passiert?",
  "Wie oft ist das passiert?",
  "Wo oder in welchem Kontext ist es passiert?",
  "Gibt es aktuell eine direkte Gefahr?",
  "Möchtest du nur Rat oder eine Meldung vorbereiten?",
];

const initialAssistantMessage = {
  role: "assistant",
  kind: "intro",
  time: "Jetzt",
  text:
    "Willkommen im lokalen KI-Konflikthelfer. Wähle links ein Thema oder beschreibe die Situation frei. Bitte keine echten Namen, Personalnummern oder vertraulichen Details eingeben.",
};

const toneOptions = {
  ruhig: "Ich merke, dass mich die Situation belastet. Ich würde das gerne in Ruhe und sachlich klären.",
  direkt: "Die Situation belastet mich. Ich möchte, dass wir konkret klären, was passiert ist und wie wir respektvoll weiterarbeiten.",
  professionell:
    "Ich nehme wahr, dass die aktuelle Situation die Zusammenarbeit belastet. Ich bitte um eine sachliche Klärung und einen respektvollen Umgang.",
};

function KiKonflikthelfer() {
  const [selectedIssue, setSelectedIssue] = useState(issueCards[0]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [messages, setMessages] = useState([initialAssistantMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [draftReport, setDraftReport] = useState(null);
  const [angryText, setAngryText] = useState("Ich hasse den Typ, der nervt nur.");
  const [tone, setTone] = useState("ruhig");

  const progress = Math.round((answers.length / guidedQuestions.length) * 100);
  const latestResponse = useMemo(
    () => [...messages].reverse().find((message) => message.role === "assistant" && message.kind === "response"),
    [messages]
  );

  function selectIssue(issue) {
    setSelectedIssue(issue);
    setQuestionIndex(0);
    setAnswers([]);
    setDraftReport(null);
    setMessages([
      initialAssistantMessage,
      {
        role: "user",
        kind: "text",
        time: formatTime(),
        text: issue.starter,
      },
      {
        role: "assistant",
        kind: "text",
        time: formatTime(),
        text: `Thema ausgewählt: ${issue.category}. Lass uns die Situation Schritt für Schritt einordnen.`,
      },
    ]);
  }

  function answerGuidedQuestion(value = input) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const question = guidedQuestions[questionIndex];
    const nextAnswers = [...answers, { question, answer: trimmed }];

    setAnswers(nextAnswers);
    setMessages((current) => [
      ...current,
      { role: "user", kind: "text", time: formatTime(), text: `${question}\n${trimmed}` },
    ]);
    setInput("");
    setDraftReport(null);

    if (questionIndex < guidedQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    generateResponse(buildConversationText(selectedIssue, nextAnswers));
  }

  function submitFreeMessage(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { role: "user", kind: "text", time: formatTime(), text: trimmed },
    ]);
    setInput("");
    setDraftReport(null);
    generateResponse(`${selectedIssue?.starter || ""} ${trimmed}`);
  }

  function generateResponse(text) {
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          kind: "response",
          time: formatTime(),
          response: createStructuredResponse(text),
        },
      ]);
      setIsTyping(false);
    }, 650);
  }

  function prepareReport() {
    const conversationText = messages
      .filter((message) => message.role === "user")
      .map((message) => message.text)
      .join(" ");
    setDraftReport(createDraftReport(conversationText, selectedIssue, latestResponse?.response));
  }

  return (
    <section id="ki-hilfe" className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-db-dark/10" />
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <EntryHeader />
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.88fr_1.45fr_0.87fr]">
          <aside className="space-y-5">
            <EmergencyCard />
            <QuickIssueCards selectedIssue={selectedIssue} onSelect={selectIssue} />
          </aside>

          <div className="space-y-5">
            <GuidedFlow
              answers={answers}
              input={input}
              onInput={setInput}
              onSubmit={answerGuidedQuestion}
              progress={progress}
              questionIndex={questionIndex}
              selectedIssue={selectedIssue}
            />
            <ChatInterface
              input={input}
              isTyping={isTyping}
              messages={messages}
              onInput={setInput}
              onPrepareReport={prepareReport}
              onSubmit={submitFreeMessage}
            />
            {draftReport && <DraftReportPreview report={draftReport} />}
          </div>

          <aside className="space-y-5">
            <FormulationTool
              angryText={angryText}
              onText={setAngryText}
              onTone={setTone}
              tone={tone}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

function EntryHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-db-red">KI-Konflikthelfer</p>
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal text-db-dark sm:text-5xl">
          KI-Konflikthelfer
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-db-rail">
          Beschreibe eine Situation und erhalte strukturierte Hilfe, Deeskalationsvorschläge und
          nächste Schritte.
        </p>
      </div>
      <div className="rounded-lg border border-db-dark/10 bg-db-soft p-4 shadow-sm">
        <p className="flex items-start gap-3 text-sm font-black text-db-dark">
          <LockKeyhole className="mt-0.5 shrink-0 text-db-red" size={18} aria-hidden="true" />
          Anonym nutzbar · Keine echten Daten speichern · Mensch entscheidet
        </p>
      </div>
    </div>
  );
}

function EmergencyCard() {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-1 shrink-0 text-db-red" size={24} aria-hidden="true" />
        <div>
          <h3 className="text-lg font-black text-db-dark">Akute Gefahr</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">
            Die KI ersetzt keine reale Hilfe. Bei akuter Gefahr bitte sofort echte Hilfe
            kontaktieren.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickIssueCards({ selectedIssue, onSelect }) {
  return (
    <div className="rounded-lg border border-db-dark/10 bg-db-soft p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Sparkles className="text-db-red" size={22} aria-hidden="true" />
        <h3 className="text-lg font-black">Schnellauswahl</h3>
      </div>
      <div className="mt-4 grid gap-3">
        {issueCards.map((issue) => {
          const active = selectedIssue?.title === issue.title;
          return (
            <button
              key={issue.title}
              type="button"
              onClick={() => onSelect(issue)}
              className={`group rounded-lg border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                active
                  ? "border-db-red bg-white text-db-red"
                  : "border-db-dark/10 bg-white text-db-dark hover:border-db-red"
              }`}
            >
              <span className="block font-black">{issue.title}</span>
              <span className="mt-1 block text-sm font-semibold text-db-rail">{issue.category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GuidedFlow({ answers, input, onInput, onSubmit, progress, questionIndex, selectedIssue }) {
  const isComplete = answers.length >= guidedQuestions.length;

  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-db-red">Geführte Einordnung</p>
          <h3 className="mt-1 text-2xl font-black">{selectedIssue?.category || "Situation"}</h3>
        </div>
        <div className="min-w-36">
          <div className="h-2 overflow-hidden rounded bg-db-soft">
            <div className="h-full bg-db-red transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-right text-xs font-black text-db-rail">{progress}%</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {guidedQuestions.map((question, index) => (
          <div
            key={question}
            className={`rounded border p-3 text-xs font-bold leading-5 ${
              index < answers.length
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : index === questionIndex && !isComplete
                  ? "border-db-red bg-red-50 text-db-red"
                  : "border-db-dark/10 bg-db-soft text-db-rail"
            }`}
          >
            {index + 1}. {question}
          </div>
        ))}
      </div>

      {!isComplete ? (
        <div className="mt-5 rounded-lg bg-db-soft p-4">
          <label className="block text-lg font-black text-db-dark" htmlFor="guided-answer">
            {guidedQuestions[questionIndex]}
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="guided-answer"
              value={input}
              onChange={(event) => onInput(event.target.value)}
              className="min-h-12 flex-1 rounded border border-db-dark/15 px-4 outline-none transition focus:border-db-red focus:ring-2 focus:ring-db-red/15"
              placeholder="Kurz und ohne echte Namen antworten ..."
            />
            <button
              type="button"
              onClick={() => onSubmit()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-db-red px-5 font-black text-white transition hover:bg-red-700"
            >
              Weiter
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-800">
          Die geführte Einordnung ist vollständig. Die lokale Demo-Antwort wurde im Chat erzeugt.
        </div>
      )}
    </div>
  );
}

function ChatInterface({ input, isTyping, messages, onInput, onPrepareReport, onSubmit }) {
  return (
    <div className="overflow-hidden rounded-lg border border-db-dark/10 bg-white shadow-panel">
      <div className="flex items-center justify-between gap-4 border-b border-db-dark/10 p-5">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-db-red">Demo-Chat</p>
          <h3 className="mt-1 text-2xl font-black">Strukturierte Unterstützung</h3>
        </div>
        <Bot className="hidden text-db-red sm:block" size={30} aria-hidden="true" />
      </div>
      <div className="max-h-[640px] min-h-[460px] space-y-5 overflow-y-auto bg-db-soft p-4 sm:p-5">
        {messages.map((message, index) => (
          <ChatMessage
            key={`${message.role}-${message.kind}-${index}`}
            message={message}
            onPrepareReport={message.kind === "response" ? onPrepareReport : undefined}
          />
        ))}
        {isTyping && <TypingBubble />}
      </div>
      <form className="border-t border-db-dark/10 bg-white p-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={input}
            onChange={(event) => onInput(event.target.value)}
            className="min-h-12 flex-1 rounded border border-db-dark/15 px-4 outline-none transition focus:border-db-red focus:ring-2 focus:ring-db-red/15"
            placeholder="Freie Nachricht eingeben, z. B. 'Ein Fahrgast droht mir' ..."
          />
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-db-red px-5 font-black text-white transition hover:bg-red-700">
            Senden
            <Send size={18} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}

function ChatMessage({ message, onPrepareReport }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded bg-db-red text-white">
          <Bot size={18} aria-hidden="true" />
        </span>
      )}
      <div className={`max-w-[94%] sm:max-w-[82%] ${isUser ? "order-first" : ""}`}>
        <div className={`mb-1 flex items-center gap-2 text-xs font-bold text-db-rail ${isUser ? "justify-end" : ""}`}>
          {isUser ? <UserRound size={14} aria-hidden="true" /> : <Clock3 size={14} aria-hidden="true" />}
          {message.time}
        </div>
        {message.kind === "response" ? (
          <StructuredResponseCard response={message.response} onPrepareReport={onPrepareReport} />
        ) : (
          <div
            className={`rounded-lg p-4 shadow-sm ${
              isUser ? "bg-db-red text-white" : "bg-white text-db-dark"
            }`}
          >
            <p className="whitespace-pre-line leading-7">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StructuredResponseCard({ response, onPrepareReport }) {
  const risk = riskStyles[response.risk];
  const sections = [
    { title: "Einordnung", text: response.classification, icon: HelpCircle },
    { title: "Sofort sinnvoll", text: response.immediate, icon: ShieldCheck },
    { title: "Deeskalierende Antwort", text: response.deescalation, icon: MessageSquareText },
    { title: "Nächste Schritte", text: response.nextSteps, icon: ClipboardList },
    { title: "Wann du echte Hilfe holen solltest", text: response.realHelp, icon: AlertTriangle },
  ];

  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-db-red">Lokale Demo-Einschätzung</p>
          <h4 className="mt-1 text-xl font-black">{response.category}</h4>
        </div>
        <span className={`w-fit rounded px-3 py-1 text-sm font-black ${risk.className}`}>{risk.label}</span>
      </div>
      <div className="mt-4 grid gap-3">
        {sections.map(({ title, text, icon: Icon }) => (
          <div key={title} className="rounded bg-db-soft p-4">
            <div className="flex items-start gap-3">
              <Icon className="mt-1 shrink-0 text-db-red" size={19} aria-hidden="true" />
              <div>
                <p className="font-black">{title}</p>
                <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-6 text-db-rail">{text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onPrepareReport}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-db-dark px-4 py-3 font-black text-white transition hover:bg-db-red sm:w-auto"
      >
        Anonyme Meldung vorbereiten
        <FileText size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded bg-db-red text-white">
        <Bot size={18} aria-hidden="true" />
      </span>
      <div className="rounded-lg bg-white px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-db-red" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-db-red [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-db-red [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}

function DraftReportPreview({ report }) {
  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-panel">
      <div className="flex items-start gap-3">
        <FileText className="mt-1 shrink-0 text-db-red" size={25} aria-hidden="true" />
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-db-red">Vorschau, nicht gesendet</p>
          <h3 className="mt-1 text-2xl font-black">Anonyme Meldung vorbereiten</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">
            Diese Zusammenfassung bleibt im lokalen Prototyp und wird nicht gespeichert oder
            weitergeleitet.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <PreviewItem label="Kategorie" value={report.category} />
        <PreviewItem label="Risiko" value={report.risk} />
        <PreviewItem label="Kurzbeschreibung" value={report.summary} wide />
        <PreviewItem label="Empfohlene nächste Stelle" value={report.route} wide />
        <PreviewItem label="Wichtige Details" value={report.details} wide />
      </div>
    </div>
  );
}

function PreviewItem({ label, value, wide = false }) {
  return (
    <div className={`rounded bg-db-soft p-4 ${wide ? "md:col-span-2" : ""}`}>
      <p className="text-xs font-black uppercase tracking-wide text-db-red">{label}</p>
      <p className="mt-2 whitespace-pre-line font-semibold leading-7 text-db-dark">{value}</p>
    </div>
  );
}

function FormulationTool({ angryText, onText, onTone, tone }) {
  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <PenLine className="text-db-red" size={22} aria-hidden="true" />
        <h3 className="text-lg font-black">Antwort besser formulieren</h3>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-db-rail">
        Schreibe eine belastete Nachricht um, bevor sie eskaliert.
      </p>
      <textarea
        value={angryText}
        onChange={(event) => onText(event.target.value)}
        className="mt-4 min-h-28 w-full rounded border border-db-dark/15 px-3 py-3 text-sm outline-none transition focus:border-db-red focus:ring-2 focus:ring-db-red/15"
      />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {Object.keys(toneOptions).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onTone(option)}
            className={`rounded px-3 py-2 text-sm font-black transition ${
              tone === option ? "bg-db-red text-white" : "bg-db-soft text-db-dark hover:text-db-red"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded bg-db-soft p-4">
        <p className="text-xs font-black uppercase tracking-wide text-db-red">Ruhigere Version</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-db-dark">{rewriteMessage(angryText, tone)}</p>
      </div>
    </div>
  );
}

function SafetyPrinciples() {
  return (
    <div className="rounded-lg bg-db-dark p-5 text-white shadow-panel">
      <UsersRound size={26} className="text-red-200" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-black">Prinzipien im Prototyp</h3>
      <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-white/78">
        {[
          "Keine echte KI-API, nur lokale Demo-Logik.",
          "Keine Speicherung sensibler Daten.",
          "Keine automatische Bestrafung.",
          "Keine Überwachung realer Chats.",
          "Menschen entscheiden über nächste Schritte.",
        ].map((item) => (
          <p key={item} className="flex gap-2">
            <CheckCircle2 className="mt-1 shrink-0 text-red-200" size={16} aria-hidden="true" />
            {item}
          </p>
        ))}
      </div>
      <a
        href="#datenschutz"
        className="mt-5 inline-flex w-full items-center justify-center rounded bg-white px-4 py-3 font-black text-db-dark transition hover:text-db-red"
      >
        Datenschutz ansehen
      </a>
    </div>
  );
}

function createStructuredResponse(text) {
  const lower = text.toLowerCase();
  const highRisk = containsAny(lower, ["droht", "drohung", "angst", "gewalt", "schlagen", "bedroht"]);
  const insult = containsAny(lower, ["beleidigt", "beleidigung", "ausgelacht", "dumm", "bloßgestellt"]);
  const exclusion = containsAny(lower, ["ausgeschlossen", "ignoriert", "ausgrenz", "nicht eingeladen"]);
  const customer = containsAny(lower, ["kunde", "kundin", "fahrgast", "passagier"]);
  const discrimination = containsAny(lower, ["rassistisch", "religion", "herkunft", "geschlecht", "diskrimin"]);

  if (highRisk) {
    return {
      category: "Drohung oder mögliche Gewalt",
      risk: "high",
      classification:
        "Das klingt nach einer Situation mit erhöhtem Sicherheitsrisiko. Deine Sicherheit steht vor Klärung oder Dokumentation.",
      immediate:
        "Distanz herstellen, nicht allein bleiben und sofort reale Unterstützung kontaktieren, wenn die Gefahr aktuell ist.",
      deescalation:
        "Ich möchte Abstand halten. Ich beende das Gespräch jetzt und hole Unterstützung.",
      nextSteps:
        "Ort, Uhrzeit und beobachtbare Aussagen kurz notieren. Danach zuständige Führung, Leitstelle, Sicherheitsdienst oder Vertrauensperson einbinden.",
      realHelp:
        "Sofort, wenn Gewalt angedroht wird, du Angst hast, jemand dich verfolgt oder die Situation nicht kontrollierbar wirkt.",
    };
  }

  if (discrimination) {
    return {
      category: "Diskriminierende Aussage",
      risk: "medium",
      classification:
        "Diskriminierende Aussagen können verletzend sein und ein unsicheres Arbeitsumfeld schaffen.",
      immediate:
        "Wenn es sicher ist, ruhig widersprechen und die Aussage als nicht akzeptabel benennen.",
      deescalation:
        "Diese Aussage ist diskriminierend. Ich möchte, dass wir respektvoll miteinander sprechen.",
      nextSteps:
        "Aussage, Kontext und Wiederholung sachlich dokumentieren. Betroffene Person unterstützen und zuständige Ansprechstelle einbinden.",
      realHelp:
        "Wenn sich die Aussage wiederholt, Machtgefälle besteht, Drohungen hinzukommen oder die betroffene Person stark belastet ist.",
    };
  }

  if (customer) {
    return {
      category: "Aggressives Kunden- oder Fahrgastverhalten",
      risk: "medium",
      classification:
        "Aggressives Verhalten von Kund/innen oder Fahrgästen sollte früh begrenzt und nicht allein getragen werden.",
      immediate:
        "Abstand halten, klare Grenze setzen, Kolleg/in hinzuziehen und die Situation nicht persönlich nehmen.",
      deescalation:
        "Ich möchte helfen. Bitte sprechen Sie ruhig und halten Sie Abstand, sonst hole ich Unterstützung.",
      nextSteps:
        "Sicherheitsrelevante Details dokumentieren und bei Eskalation betriebliche Unterstützung aktivieren.",
      realHelp:
        "Wenn die Person droht, dich verfolgt, körperlich näher kommt oder andere gefährdet.",
    };
  }

  if (exclusion) {
    return {
      category: "Ausgrenzung im Team",
      risk: "medium",
      classification:
        "Wiederholtes Ausschließen oder Ignorieren kann belastend sein und Richtung Mobbing gehen.",
      immediate:
        "Sammle konkrete Beispiele und vermeide vorschnelle Gegenangriffe im Teamchat oder in Gruppen.",
      deescalation:
        "Mir ist aufgefallen, dass wichtige Informationen nicht bei mir ankommen. Ich möchte klären, wie wir das zuverlässig lösen.",
      nextSteps:
        "Muster dokumentieren, Gespräch mit neutraler Person vorbereiten und bei Wiederholung Unterstützung einbinden.",
      realHelp:
        "Wenn die Ausgrenzung systematisch wird, Aufgaben blockiert, psychisch stark belastet oder mit Beleidigungen verbunden ist.",
    };
  }

  if (insult) {
    return {
      category: "Beleidigung oder mögliches Mobbing",
      risk: "medium",
      classification:
        "Wiederholte Beleidigungen sind nicht normaler Konflikt, sondern können Mobbing oder respektloses Verhalten anzeigen.",
      immediate:
        "Ruhig Grenze setzen, nicht zurückbeleidigen und konkrete Aussagen dokumentieren.",
      deescalation:
        "Ich möchte sachlich bleiben. Diese Beleidigung akzeptiere ich nicht. Lass uns über das konkrete Problem sprechen.",
      nextSteps:
        "Notiere Wortlaut, Häufigkeit und Kontext. Suche Unterstützung, wenn das Verhalten wiederholt auftritt.",
      realHelp:
        "Wenn Beleidigungen systematisch werden, mehrere Personen beteiligt sind oder du dich zunehmend belastet fühlst.",
    };
  }

  return {
    category: "Allgemeiner Arbeitsplatzkonflikt",
    risk: "low",
    classification:
      "Das wirkt zunächst wie ein Konflikt, der mit Struktur, Abstand und sachlicher Klärung bearbeitet werden kann.",
    immediate:
      "Kurz sortieren: Was ist beobachtbar passiert, was brauchst du jetzt, und wer kann neutral unterstützen?",
    deescalation:
      "Ich möchte das sachlich klären. Mir ist wichtig, dass wir beim konkreten Verhalten bleiben und respektvoll sprechen.",
    nextSteps:
      "Fakten notieren, ein ruhiges Gespräch vorbereiten und bei Wiederholung eine Vertrauensperson hinzuziehen.",
    realHelp:
      "Wenn Drohungen, Diskriminierung, Machtmissbrauch, starke Belastung oder wiederholtes Mobbing erkennbar werden.",
  };
}

function createDraftReport(text, issue, response) {
  const structured = response || createStructuredResponse(text);
  return {
    category: structured.category || issue?.category || "Nicht festgelegt",
    risk: riskStyles[structured.risk]?.label || "Nicht bewertet",
    summary: summarizeText(text || issue?.starter || "Keine Beschreibung vorhanden."),
    route:
      structured.risk === "high"
        ? "Sofort reale Hilfe, zuständige Führung, Leitstelle oder Sicherheitsdienst prüfen."
        : "Vertrauensperson, Führungskraft, Betriebsrat/JAV oder zuständige interne Beratungsstelle prüfen.",
    details:
      "Nur Rollen und Sachverhalte verwenden, keine echten Namen. Hilfreich sind Zeitpunkt, Kontext, Wiederholung, aktuelle Gefahr und gewünschte Unterstützung.",
  };
}

function rewriteMessage(text, tone) {
  const normalized = text.trim();
  if (!normalized) return toneOptions[tone];

  if (tone === "direkt") {
    return "Die Situation belastet mich. Ich möchte konkret klären, welches Verhalten problematisch war und wie wir respektvoll weiterarbeiten.";
  }

  if (tone === "professionell") {
    return "Ich nehme wahr, dass die aktuelle Situation die Zusammenarbeit erschwert. Ich bitte um eine sachliche Klärung und einen respektvollen Umgang.";
  }

  return "Ich merke, dass mich die Situation belastet. Ich würde das gerne in Ruhe und sachlich klären.";
}

function buildConversationText(issue, answers) {
  return `${issue?.starter || ""} ${answers.map((item) => `${item.question} ${item.answer}`).join(" ")}`;
}

function summarizeText(text) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= 180) return compact;
  return `${compact.slice(0, 177)}...`;
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function formatTime() {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

const riskStyles = {
  low: {
    label: "Niedrig",
    className: "bg-emerald-100 text-emerald-800",
  },
  medium: {
    label: "Mittel",
    className: "bg-amber-100 text-amber-800",
  },
  high: {
    label: "Hoch",
    className: "bg-red-100 text-red-800",
  },
};

export default KiKonflikthelfer;
