import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  EyeOff,
  FileText,
  HandHeart,
  HeartPulse,
  HelpCircle,
  MessageSquareText,
  PhoneCall,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  UsersRound,
} from "lucide-react";

const situations = [
  {
    id: "mobbing",
    title: "Ich werde gemobbt",
    icon: EyeOff,
    explanation: "Wiederholtes Bloßstellen, Ausgrenzen oder Schikanieren.",
    firstStep: "Nicht allein bleiben und konkrete Vorfälle notieren.",
    guidance: {
      immediate: "Nimm das Muster ernst. Sprich mit einer vertrauten Person und sammle konkrete Beispiele.",
      avoid: "Nicht isoliert bleiben, nicht öffentlich zurückschlagen und nicht alles als 'Spaß' abtun.",
      document: "Datum, Ort, Situation, konkrete Aussagen, Beteiligte als Rollen und mögliche Zeugen.",
      involve: "Ausbilder/in, Praxisanleitung, Vertrauensperson, Betriebsrat/JAV oder HR.",
      urgent: "Wenn Drohungen, starke psychische Belastung oder systematische Ausgrenzung auftreten.",
      next: "Dokumentation beginnen und bei Bedarf eine anonyme Meldung vorbereiten.",
    },
  },
  {
    id: "bedrohung",
    title: "Ich wurde bedroht",
    icon: ShieldAlert,
    explanation: "Verbale Drohung, Einschüchterung oder körperliche Annäherung.",
    firstStep: "Abstand herstellen und reale Hilfe kontaktieren, wenn Gefahr besteht.",
    guidance: {
      immediate: "Halte Abstand, gehe an einen sicheren Ort und beende die Diskussion.",
      avoid: "Nicht provozieren, nicht allein weiterdiskutieren und keine körperliche Konfrontation suchen.",
      document: "Nur wenn es sicher ist: Wortlaut der Drohung, Ort, Zeitpunkt, Beteiligte, Zeugen.",
      involve: "Sicherheitsstelle, zuständige Führung, Leitstelle oder reale Notfallhilfe.",
      urgent: "Sofort, wenn eine direkte Gefahr besteht oder die Person körperlich näher kommt.",
      next: "Sicherheit priorisieren. Dokumentation erst nach der Gefahrensituation.",
    },
  },
  {
    id: "gewalt",
    title: "Ich habe Gewalt beobachtet",
    icon: Siren,
    explanation: "Körperliche Gewalt, Bedrohung oder gefährliche Eskalation.",
    firstStep: "Eigene Sicherheit prüfen und reale Hilfe einschalten.",
    guidance: {
      immediate: "Nicht dazwischengehen, wenn du dich gefährdest. Abstand halten und Hilfe holen.",
      avoid: "Keine Selbstgefährdung, keine Eskalation durch Zurufe, keine Videos verbreiten.",
      document: "Nach der Situation: Ablauf, Ort, Zeit, beobachtete Handlungen und sichere Zeugenhinweise.",
      involve: "Sicherheitsstelle, Führungskraft, Leitstelle oder externe Notfallhilfe.",
      urgent: "Immer, wenn Gewalt aktuell passiert oder unmittelbar droht.",
      next: "Reale Hilfe kontaktieren und danach intern sachlich informieren.",
    },
  },
  {
    id: "diskriminierung",
    title: "Ich erlebe Diskriminierung",
    icon: Scale,
    explanation: "Abwertung wegen Herkunft, Religion, Geschlecht, Aussehen oder Identität.",
    firstStep: "Nicht normalisieren, Kontext notieren und Unterstützung suchen.",
    guidance: {
      immediate: "Wenn sicher möglich, ruhig widersprechen und die Aussage als nicht akzeptabel benennen.",
      avoid: "Nicht mitlachen, nicht verharmlosen und Betroffene nicht zur Rechtfertigung drängen.",
      document: "Wortlaut, Kontext, Wiederholung, beteiligte Rollen und Auswirkungen.",
      involve: "Vertrauensperson, HR, Betriebsrat/JAV, Compliance oder passende Beratungsstelle.",
      urgent: "Wenn die Aussage wiederholt, schwerwiegend oder mit Drohung/Machtmissbrauch verbunden ist.",
      next: "Sachlich dokumentieren und vertraulich prüfen lassen.",
    },
  },
  {
    id: "ueberlastung",
    title: "Ich bin psychisch überlastet",
    icon: HeartPulse,
    explanation: "Die Situation belastet dich stark oder hält länger an.",
    firstStep: "Belastung ernst nehmen und eine vertraute Person ansprechen.",
    guidance: {
      immediate: "Suche zeitnah Unterstützung. Du musst eine belastende Situation nicht allein sortieren.",
      avoid: "Nicht warten, bis es schlimmer wird, und nicht aus Scham schweigen.",
      document: "Was belastet dich, seit wann, wie wirkt es sich aus, welche Situationen verstärken es?",
      involve: "Vertrauensperson, psychosoziale Unterstützung, Ausbilder/in, HR oder Betriebsrat/JAV.",
      urgent: "Wenn du dich nicht sicher fühlst, Panik, starke Verzweiflung oder akute Gefahr besteht.",
      next: "Eine konkrete Ansprechperson wählen und einen kurzen Gesprächsanlass formulieren.",
    },
  },
  {
    id: "kunde",
    title: "Ein Kunde/Fahrgast ist aggressiv",
    icon: UsersRound,
    explanation: "Aggression, Beleidigung oder Druck im Kundenkontakt.",
    firstStep: "Abstand halten, ruhig bleiben und Unterstützung früh einbinden.",
    guidance: {
      immediate: "Kurz und ruhig sprechen, Abstand halten und klare Grenzen setzen.",
      avoid: "Nicht zurückbeleidigen, nicht allein eskalierende Gespräche fortführen.",
      document: "Ort, Zeit, Verhalten, Aussagen, Gefahrenlage und hinzugezogene Unterstützung.",
      involve: "Kolleg/in, Führungskraft, Sicherheitsstelle oder Leitstelle.",
      urgent: "Wenn Drohungen, körperliche Nähe oder Gefahr für Mitarbeitende/Kunden entstehen.",
      next: "Situation beenden, Unterstützung holen und danach sachlich dokumentieren.",
    },
  },
  {
    id: "orientierung",
    title: "Ich weiß nicht, an wen ich mich wenden soll",
    icon: HelpCircle,
    explanation: "Du brauchst Orientierung, welche Stelle passen könnte.",
    firstStep: "Situation kurz einordnen: Gefahr, Wiederholung, Belastung.",
    guidance: {
      immediate: "Nutze die Entscheidungsfragen unten oder sprich eine vertraute Person an.",
      avoid: "Nicht aus Unsicherheit gar nichts tun, wenn die Lage belastend oder wiederholt ist.",
      document: "Kurze Stichpunkte zur Situation, Häufigkeit, Dringlichkeit und gewünschter Unterstützung.",
      involve: "Vertrauensperson als erster sicherer Einstieg; bei Gefahr reale Hilfe.",
      urgent: "Wenn du aktuell bedroht bist oder eine andere Person gefährdet ist.",
      next: "Entscheidungshilfe nutzen und passende nächste Stelle auswählen.",
    },
  },
  {
    id: "unterstuetzen",
    title: "Ich möchte jemanden unterstützen",
    icon: HandHeart,
    explanation: "Du beobachtest Belastung oder möchtest einer Person helfen.",
    firstStep: "Ruhig nachfragen, zuhören und nicht drängen.",
    guidance: {
      immediate: "Biete Unterstützung an und frage, was die betroffene Person gerade braucht.",
      avoid: "Nicht über die Person hinweg entscheiden, keine Details ohne Anlass verbreiten.",
      document: "Nur relevante Beobachtungen: was, wann, wo, wer als Rolle, mögliche Wiederholung.",
      involve: "Mit Einverständnis: Vertrauensperson, Ausbilder/in, HR, Betriebsrat/JAV.",
      urgent: "Wenn Gewalt, Drohung, Selbstgefährdung oder akute Überlastung erkennbar ist.",
      next: "Gemeinsam eine sichere nächste Ansprechstelle auswählen.",
    },
  },
];

const contactCards = [
  ["Ausbilder/in oder Praxisanleitung", "Ausbildungssituation, wiederholte Konflikte, Lernumfeld.", "Wenn der Vorfall Ausbildung, Anleitung oder Teamalltag betrifft."],
  ["Vertrauensperson", "Erster vertraulicher Einstieg, Orientierung, emotionale Entlastung.", "Wenn du nicht sicher bist, welcher Weg passt."],
  ["HR / Personalbereich", "Arbeitsbezogene Konflikte, Verfahren, Zuständigkeiten.", "Wenn strukturelle oder personelle Klärung nötig wird."],
  ["Compliance / Meldestelle", "Schwere Verstöße, Diskriminierung, Gewalt, Hassrede.", "Wenn eine formale Prüfung erforderlich sein könnte."],
  ["Betriebsrat / Jugend- und Auszubildendenvertretung", "Interessenvertretung, Schutz, Begleitung.", "Wenn du Unterstützung im Arbeits- oder Ausbildungskontext brauchst."],
  ["Mitarbeitenden-Unterstützung", "Psychische Belastung, Beratung, Stabilisierung.", "Wenn dich die Situation stark belastet oder länger anhält."],
  ["Sicherheitsstelle bei akuter Bedrohung", "Akute Sicherheitslage, Gewalt, Drohung.", "Wenn sofort reale Hilfe notwendig ist."],
];

const checklistItems = [
  "Datum und Uhrzeit",
  "Ort oder Kontext",
  "Was wurde gesagt oder getan?",
  "Wer war beteiligt?",
  "Gab es Zeugen?",
  "Wiederholt sich das Verhalten?",
  "Gibt es Screenshots oder Nachrichten?",
  "Wie hat es dich belastet?",
  "Welche Schritte hast du bereits versucht?",
];

const preventionTips = [
  ["Respektvolle Sprache", "Sachlich bleiben, keine abwertenden Zuschreibungen. Kritik am Verhalten formulieren, nicht an der Person."],
  ["Früh ansprechen", "Kleine Grenzverletzungen früh und ruhig benennen. So muss ein Konflikt nicht erst groß werden."],
  ["Nicht wegschauen", "Beobachtetes Mobbing oder Hassrede nicht normalisieren. Schon ein ruhiger Satz kann Betroffene entlasten."],
  ["Grenzen setzen", "Kurz, klar und ohne Drohung formulieren, was nicht akzeptabel ist. Bei Gefahr nicht diskutieren."],
  ["Vorfälle ernst nehmen", "Wiederholung, Machtgefälle und Belastung sind wichtige Signale. Dokumentation hilft bei der Prüfung."],
  ["Unterstützung anbieten", "Nachfragen, zuhören und Optionen anbieten. Nicht über die betroffene Person hinweg handeln."],
  ["Konflikte nicht im Chat eskalieren lassen", "Keine Screenshots weiterverbreiten, keine Gruppenangriffe. Sachlich stoppen und passend klären."],
];

const calmVersions = {
  ruhig: "Ich merke, dass mich die Situation belastet. Ich möchte das gerne in Ruhe und sachlich klären.",
  klar: "Ich möchte, dass dieses Verhalten aufhört. Die Situation belastet mich, und ich möchte sie sachlich klären.",
  professionell: "Ich nehme wahr, dass die aktuelle Situation die Zusammenarbeit belastet. Ich bitte um eine sachliche Klärung und respektvollen Umgang.",
  grenzsetzend: "Dieses Verhalten ist für mich nicht akzeptabel. Ich möchte, dass es aufhört, und schlage vor, die Situation mit Unterstützung zu klären.",
};

function SupportPage() {
  const [selectedSituation, setSelectedSituation] = useState(situations[0]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showSafeSteps, setShowSafeSteps] = useState(false);
  const [danger, setDanger] = useState("Nein");
  const [repeat, setRepeat] = useState("Nein");
  const [perspective, setPerspective] = useState("selbst betroffen");
  const [message, setMessage] = useState("Du nervst mich komplett, hör endlich auf.");
  const [tone, setTone] = useState("klar");

  const recommendation = useMemo(
    () => getRecommendation(danger, repeat, perspective),
    [danger, repeat, perspective]
  );

  return (
    <section id="unterstuetzung" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <EntryHeader />
        <EmergencyCard
          showEmergency={showEmergency}
          showSafeSteps={showSafeSteps}
          toggleEmergency={() => setShowEmergency((value) => !value)}
          toggleSafeSteps={() => setShowSafeSteps((value) => !value)}
        />
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.35fr_0.9fr]">
          <aside className="space-y-5">
            <SituationCards selected={selectedSituation} onSelect={setSelectedSituation} />
            <CostBenefitCard />
          </aside>

          <div className="space-y-5">
            <GuidancePanel situation={selectedSituation} />
            <DecisionHelper
              danger={danger}
              perspective={perspective}
              recommendation={recommendation}
              repeat={repeat}
              setDanger={setDanger}
              setPerspective={setPerspective}
              setRepeat={setRepeat}
            />
            <DocumentationChecklist />
          </div>

          <aside className="space-y-5">
            <MessageRewriteTool message={message} setMessage={setMessage} setTone={setTone} tone={tone} />
            <SupportContacts />
          </aside>
        </div>
        <PreventionTips />
      </div>
    </section>
  );
}

function EntryHeader() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.74fr] lg:items-end">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-db-red">Hilfe & Unterstützung</p>
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal text-db-dark sm:text-5xl">
          Hilfe & Unterstützung
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-db-rail">
          Schnelle Orientierung, klare nächste Schritte und passende Unterstützung bei Konflikten,
          Mobbing, Hass und Gewalt.
        </p>
      </div>
      <div className="rounded-lg border border-db-dark/10 bg-db-soft p-4 shadow-sm">
        <p className="flex items-start gap-3 text-sm font-black text-db-dark">
          <ShieldCheck className="mt-0.5 shrink-0 text-db-red" size={18} aria-hidden="true" />
          Diese Demo ersetzt keine Notfallstelle, keine psychologische Beratung und keine offizielle DB-Meldestelle.
        </p>
      </div>
    </div>
  );
}

function EmergencyCard({ showEmergency, showSafeSteps, toggleEmergency, toggleSafeSteps }) {
  return (
    <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 shadow-panel">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-db-red text-white">
            <Siren size={24} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-2xl font-black text-db-dark">Akute Gefahr?</h3>
            <p className="mt-2 max-w-3xl font-semibold leading-7 text-db-rail">
              Wenn du oder eine andere Person gerade bedroht wird, entferne dich aus der Situation
              und kontaktiere sofort reale Hilfe.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={toggleEmergency} className="rounded bg-db-red px-5 py-3 font-black text-white transition hover:bg-red-700">
            Notfallhinweise anzeigen
          </button>
          <button type="button" onClick={toggleSafeSteps} className="rounded border border-db-dark/15 bg-white px-5 py-3 font-black text-db-dark transition hover:border-db-red hover:text-db-red">
            Sichere Schritte anzeigen
          </button>
        </div>
      </div>
      {(showEmergency || showSafeSteps) && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {showEmergency && (
            <InfoBox
              title="Notfallhinweise"
              items={[
                "Abstand herstellen und einen sichereren Ort aufsuchen.",
                "Reale Hilfe kontaktieren, wenn Gefahr besteht.",
                "Nicht provozieren und nicht allein weiterklären.",
              ]}
            />
          )}
          {showSafeSteps && (
            <InfoBox
              title="Sichere Schritte"
              items={[
                "Andere Personen warnen, wenn das ohne Eigengefährdung möglich ist.",
                "Unterstützung durch Kolleg/innen oder zuständige Stellen holen.",
                "Erst dokumentieren, wenn die Situation sicher ist.",
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SituationCards({ selected, onSelect }) {
  return (
    <div className="rounded-lg border border-db-dark/10 bg-db-soft p-5 shadow-sm">
      <h3 className="text-xl font-black">Situation auswählen</h3>
      <div className="mt-5 grid gap-3">
        {situations.map((situation) => {
          const Icon = situation.icon;
          const active = selected.id === situation.id;
          return (
            <button
              key={situation.id}
              type="button"
              onClick={() => onSelect(situation)}
              className={`group rounded-lg border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                active ? "border-db-red bg-white" : "border-db-dark/10 bg-white hover:border-db-red"
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={active ? "text-db-red" : "text-db-rail group-hover:text-db-red"} size={23} />
                <div>
                  <p className="font-black text-db-dark">{situation.title}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-db-rail">{situation.explanation}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-wide text-db-red">
                    Erster Schritt: {situation.firstStep}
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

function GuidancePanel({ situation }) {
  const items = [
    ["Sofort wichtig", situation.guidance.immediate, ShieldCheck],
    ["Was du vermeiden solltest", situation.guidance.avoid, AlertTriangle],
    ["Was du dokumentieren kannst", situation.guidance.document, ClipboardCheck],
    ["Wen du einbeziehen kannst", situation.guidance.involve, UsersRound],
    ["Wann du dringend Hilfe holen solltest", situation.guidance.urgent, Siren],
    ["Nächster sinnvoller Schritt", situation.guidance.next, ArrowRight],
  ];

  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-panel">
      <p className="text-sm font-black uppercase tracking-wide text-db-red">Orientierung</p>
      <h3 className="mt-1 text-3xl font-black">{situation.title}</h3>
      <p className="mt-3 text-lg font-semibold leading-8 text-db-rail">{situation.explanation}</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {items.map(([title, text, Icon]) => (
          <div key={title} className="rounded bg-db-soft p-4">
            <div className="flex items-start gap-3">
              <Icon className="mt-1 shrink-0 text-db-red" size={18} aria-hidden="true" />
              <div>
                <p className="font-black text-db-dark">{title}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-db-rail">{text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a href="#meldung" className="inline-flex items-center justify-center gap-2 rounded bg-db-red px-5 py-3 font-black text-white transition hover:bg-red-700">
          Anonyme Meldung vorbereiten
          <FileText size={18} aria-hidden="true" />
        </a>
        <a href="#ki-hilfe" className="inline-flex items-center justify-center gap-2 rounded border border-db-dark/15 bg-white px-5 py-3 font-black text-db-dark transition hover:border-db-red hover:text-db-red">
          KI-Konflikthelfer nutzen
          <MessageSquareText size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function DecisionHelper({ danger, perspective, recommendation, repeat, setDanger, setPerspective, setRepeat }) {
  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-panel">
      <div className="flex items-center gap-3">
        <Sparkles className="text-db-red" size={23} aria-hidden="true" />
        <h3 className="text-2xl font-black">Welche Hilfe passt zu meiner Situation?</h3>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <ChoiceGroup label="Ist gerade akute Gefahr vorhanden?" value={danger} onChange={setDanger} options={["Nein", "Unsicher", "Ja"]} />
        <ChoiceGroup label="Passiert es wiederholt?" value={repeat} onChange={setRepeat} options={["Nein", "Unsicher", "Ja"]} />
        <ChoiceGroup label="Bist du selbst betroffen oder beobachtest du es?" value={perspective} onChange={setPerspective} options={["selbst betroffen", "beobachtet", "unterstütze jemanden"]} />
      </div>
      <div className="mt-5 rounded bg-db-soft p-4">
        <p className="text-sm font-black uppercase tracking-wide text-db-red">Demo-Empfehlung</p>
        <p className="mt-2 text-xl font-black text-db-dark">{recommendation.title}</p>
        <p className="mt-2 font-semibold leading-7 text-db-rail">{recommendation.text}</p>
      </div>
    </div>
  );
}

function ChoiceGroup({ label, onChange, options, value }) {
  return (
    <div>
      <p className="mb-3 min-h-12 text-sm font-black leading-6 text-db-dark">{label}</p>
      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded border px-3 py-2 text-left text-sm font-black transition ${
              value === option ? "border-db-red bg-red-50 text-db-red" : "border-db-dark/10 bg-db-soft text-db-dark hover:border-db-red"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function DocumentationChecklist() {
  const [checked, setChecked] = useState(["Datum und Uhrzeit", "Ort oder Kontext"]);

  function toggle(item) {
    setChecked((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    );
  }

  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-panel">
      <h3 className="text-2xl font-black">Was du dokumentieren kannst</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {checklistItems.map((item) => (
          <label key={item} className="flex items-start gap-3 rounded bg-db-soft p-3 font-semibold text-db-dark">
            <input
              type="checkbox"
              checked={checked.includes(item)}
              onChange={() => toggle(item)}
              className="mt-1 h-4 w-4 accent-db-red"
            />
            {item}
          </label>
        ))}
      </div>
      <a href="#meldung" className="mt-5 inline-flex items-center justify-center gap-2 rounded bg-db-red px-5 py-3 font-black text-white transition hover:bg-red-700">
        Meldung daraus vorbereiten
        <ArrowRight size={18} aria-hidden="true" />
      </a>
    </div>
  );
}

function MessageRewriteTool({ message, setMessage, setTone, tone }) {
  return (
    <div className="rounded-lg border border-db-dark/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <MessageSquareText className="text-db-red" size={23} aria-hidden="true" />
        <h3 className="text-xl font-black">Nachricht sachlich formulieren</h3>
      </div>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="field mt-4 min-h-28 resize-y py-3"
      />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {Object.keys(calmVersions).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTone(option)}
            className={`rounded px-3 py-2 text-sm font-black transition ${
              tone === option ? "bg-db-red text-white" : "bg-db-soft text-db-dark hover:text-db-red"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded bg-db-soft p-4">
        <p className="text-xs font-black uppercase tracking-wide text-db-red">Sachliche Version</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-db-dark">{rewriteMessage(message, tone)}</p>
      </div>
    </div>
  );
}

function SupportContacts() {
  return (
    <div className="rounded-lg border border-db-dark/10 bg-db-soft p-5 shadow-sm">
      <h3 className="text-xl font-black">Kontaktkarten</h3>
      <div className="mt-5 space-y-3">
        {contactCards.map(([title, purpose, when]) => (
          <div key={title} className="rounded bg-white p-4 shadow-sm">
            <PhoneCall className="text-db-red" size={20} aria-hidden="true" />
            <p className="mt-3 font-black text-db-dark">{title}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{purpose}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">Nutzen: {when}</p>
            <button type="button" className="mt-3 rounded border border-db-dark/15 px-3 py-2 text-sm font-black text-db-dark transition hover:border-db-red hover:text-db-red">
              Kontakt anzeigen (Demo)
            </button>
            <p className="mt-2 text-xs font-bold text-db-rail">Platzhalter - reale interne Daten später ergänzen</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreventionTips() {
  return (
    <div className="mt-10">
      <h3 className="text-3xl font-black text-db-dark">Prävention im Alltag</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {preventionTips.map(([title, text]) => (
          <article key={title} className="rounded-lg border border-db-dark/10 bg-db-soft p-5 shadow-sm">
            <BadgeCheck className="text-db-red" size={23} aria-hidden="true" />
            <h4 className="mt-4 text-lg font-black text-db-dark">{title}</h4>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail">{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function CostBenefitCard() {
  const points = [
    "bessere Orientierung reduziert unnötige Rückfragen",
    "strukturierte Dokumentation erleichtert die Prüfung",
    "frühzeitige Hilfe kann Eskalationen vermeiden",
    "Mitarbeitende finden schneller die passende Stelle",
    "Ausbilder und HR erhalten klarere Informationen",
    "weniger unstrukturierte Konfliktfälle",
  ];

  return (
    <div className="rounded-lg bg-db-dark p-5 text-white shadow-panel">
      <BriefcaseBusiness size={26} className="text-red-200" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-black">Wie dieser Bereich Zeit und Kosten sparen kann</h3>
      <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-white/80">
        {points.map((point) => (
          <p key={point} className="flex gap-2">
            <CheckCircle2 className="mt-1 shrink-0 text-red-200" size={16} aria-hidden="true" />
            {point}
          </p>
        ))}
      </div>
    </div>
  );
}

function InfoBox({ items, title }) {
  return (
    <div className="rounded bg-white p-4">
      <p className="font-black text-db-dark">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm font-semibold leading-6 text-db-rail">
            <CheckCircle2 className="mt-1 shrink-0 text-emerald-600" size={16} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function getRecommendation(danger, repeat, perspective) {
  if (danger === "Ja") {
    return {
      title: "Sofort reale Hilfe kontaktieren",
      text: "Entferne dich aus der Situation, priorisiere Sicherheit und kontaktiere reale Hilfe. Diese Demo löst keinen Alarm aus.",
    };
  }
  if (repeat === "Ja") {
    return {
      title: "Anonyme Meldung vorbereiten",
      text: "Wiederholte Vorfälle sollten strukturiert dokumentiert und durch eine zuständige menschliche Stelle geprüft werden.",
    };
  }
  if (perspective === "unterstütze jemanden") {
    return {
      title: "Vertrauensperson einbeziehen",
      text: "Biete Unterstützung an, höre zu und kläre gemeinsam, welche interne Ansprechperson passend ist.",
    };
  }
  if (danger === "Unsicher" || repeat === "Unsicher") {
    return {
      title: "KI-Konflikthelfer nutzen",
      text: "Wenn du die Lage noch sortieren musst, kann der KI-Konflikthelfer beim Formulieren und Einordnen unterstützen.",
    };
  }
  return {
    title: "Situation dokumentieren und beobachten",
    text: "Halte relevante Fakten fest und suche Unterstützung, wenn sich das Verhalten wiederholt oder dich belastet.",
  };
}

function rewriteMessage(message, tone) {
  if (!message.trim()) return calmVersions[tone];
  return calmVersions[tone];
}

export default SupportPage;
