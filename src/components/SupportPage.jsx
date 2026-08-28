import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  EyeOff,
  HandHeart,
  HeartPulse,
  HelpCircle,
  PhoneCall,
  Scale,
  ShieldAlert,
  Siren,
  UsersRound,
} from "lucide-react";

const situations = [
  {
    id: "mobbing",
    title: "Ich werde gemobbt",
    icon: EyeOff,
    explanation: "Wiederholtes Bloßstellen, Ausgrenzen oder Schikanieren.",
    guidance: "Nimm das Muster ernst. Notiere konkrete Beispiele und sprich mit einer vertrauenswürdigen Person. Bleib nicht allein mit der Situation.",
    contacts: ["vertrauen", "vertretung", "ausbildung"],
  },
  {
    id: "bedrohung",
    title: "Ich wurde bedroht",
    icon: ShieldAlert,
    explanation: "Drohung, Einschüchterung oder körperliche Annäherung.",
    guidance: "Geh auf Abstand, suche einen sicheren Ort und beende die Diskussion. Bei unmittelbarer Gefahr rufe die Polizei.",
    contacts: ["polizei", "notruf", "fuehrung"],
  },
  {
    id: "gewalt",
    title: "Ich habe Gewalt beobachtet",
    icon: Siren,
    explanation: "Körperliche Gewalt oder eine gefährliche Eskalation.",
    guidance: "Gefährde dich nicht selbst. Halte Abstand, hole sofort reale Hilfe und merke dir nur Details, wenn das sicher möglich ist.",
    contacts: ["polizei", "notruf", "fuehrung"],
  },
  {
    id: "diskriminierung",
    title: "Ich erlebe Diskriminierung",
    icon: Scale,
    explanation: "Abwertung wegen Herkunft, Religion, Geschlecht, Behinderung, Alter oder Identität.",
    guidance: "Notiere möglichst genauen Wortlaut, Datum, Ort und mögliche Zeug:innen. Lass die Situation durch eine zuständige menschliche Stelle prüfen.",
    contacts: ["vertretung", "vertrauen", "compliance"],
  },
  {
    id: "ueberlastung",
    title: "Ich bin stark belastet",
    icon: HeartPulse,
    explanation: "Die Situation belastet dich stark oder hält länger an.",
    guidance: "Suche zeitnah Unterstützung und bleib bei einer akuten Krise nicht allein. Der Prototyp ersetzt keine medizinische oder psychologische Hilfe.",
    contacts: ["seelsorge", "vertrauen", "ausbildung"],
  },
  {
    id: "kunde",
    title: "Ein Kunde ist aggressiv",
    icon: UsersRound,
    explanation: "Aggression, Beleidigung oder Druck im Kundenkontakt.",
    guidance: "Sprich kurz und ruhig, halte Abstand, setze klare Grenzen und hole Kolleg:innen oder die zuständige Sicherheitsstruktur hinzu.",
    contacts: ["fuehrung", "polizei"],
  },
  {
    id: "orientierung",
    title: "Ich brauche Orientierung",
    icon: HelpCircle,
    explanation: "Du weißt nicht, an wen du dich wenden sollst.",
    guidance: "Beginne mit einer Vertrauensperson oder Interessenvertretung. Du kannst vorher einen sachlichen Meldungsentwurf vorbereiten.",
    contacts: ["vertrauen", "vertretung", "ausbildung"],
  },
  {
    id: "unterstuetzen",
    title: "Ich möchte jemandem helfen",
    icon: HandHeart,
    explanation: "Du möchtest einer betroffenen Person Unterstützung anbieten.",
    guidance: "Höre zu, frage nach dem gewünschten nächsten Schritt und entscheide nicht über den Kopf der betroffenen Person hinweg.",
    contacts: ["vertrauen", "vertretung"],
  },
];

const contactDetails = {
  vertrauen: {
    title: "Vertrauensperson",
    role: "Intern",
    description: "Möglicher Einstieg für Orientierung und Begleitung. Kläre vor sensiblen Angaben Zuständigkeit und Umgang mit Vertraulichkeit und nutze nur bestätigte Kontakte deines Standorts.",
    action: "prepare",
  },
  vertretung: {
    title: "JAV oder Betriebsrat",
    role: "Intern",
    description: "Interessenvertretung und Begleitung im Arbeits- und Ausbildungskontext. Kontaktdaten müssen intern bestätigt werden.",
    action: "prepare",
  },
  ausbildung: {
    title: "Ausbildungsbetreuung",
    role: "Intern",
    description: "Für Vorfälle, die Ausbildung, Anleitung, Einsatz oder Teamalltag betreffen.",
    action: "prepare",
  },
  fuehrung: {
    title: "Zuständige Führungskraft",
    role: "Intern",
    description: "Für unmittelbare Deeskalation und betriebliche Koordination. Nutze den offiziellen Dienstweg deines Standorts.",
    action: "prepare",
  },
  compliance: {
    title: "Compliance- oder Beschwerdestelle",
    role: "Intern",
    description: "Für schwere Verstöße und Diskriminierung. Der Prototyp enthält bewusst keine unbestätigte interne Adresse.",
    action: "prepare",
  },
  polizei: {
    title: "Polizei",
    role: "Notfall",
    description: "Bei akuter Bedrohung, Gewalt oder einer unmittelbar gefährlichen Situation.",
    href: "tel:110",
    label: "110 anrufen",
    urgent: true,
  },
  notruf: {
    title: "Rettungsdienst und Feuerwehr",
    role: "Notfall",
    description: "Bei medizinischem Notfall, Feuer oder Lebensgefahr.",
    href: "tel:112",
    label: "112 anrufen",
    urgent: true,
  },
  seelsorge: {
    title: "TelefonSeelsorge",
    role: "Extern",
    description: "Kostenfreie Unterstützung in Krisen und schwierigen Lebenslagen.",
    href: "tel:116123",
    label: "116 123 anrufen",
  },
};

export default function SupportPage({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const detailHeadingRef = useRef(null);

  useEffect(() => {
    if (selected) window.requestAnimationFrame(() => detailHeadingRef.current?.focus());
  }, [selected]);

  if (!selected) {
    return (
      <div className="mx-auto max-w-4xl space-y-7 py-4">
        <header className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <PhoneCall className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-3xl font-black text-db-dark dark:text-white">Finde die richtige Unterstützung</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-db-rail dark:text-white/60">
            Wähle deine Situation. Interne Kontakte sind nur Orientierung und müssen für deinen Standort offiziell bestätigt werden.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {situations.map((situation) => {
            const Icon = situation.icon;
            return (
              <button key={situation.id} type="button" onClick={() => setSelected(situation)} className="group rounded-xl border border-db-dark/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-db-dark/50">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  <span className="font-black text-db-dark group-hover:text-emerald-700 dark:text-white">{situation.title}</span>
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-db-rail dark:text-white/60">{situation.explanation}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const SelectedIcon = selected.icon;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button type="button" onClick={() => setSelected(null)} className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-bold text-db-rail hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:text-white/60">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Andere Situation wählen
      </button>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/25">
        <div className="flex items-center gap-4 border-b border-emerald-200/70 pb-4 dark:border-emerald-900/60">
          <SelectedIcon className="h-8 w-8 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
          <h1 ref={detailHeadingRef} tabIndex={-1} className="text-2xl font-black text-emerald-950 outline-none dark:text-emerald-200">{selected.title}</h1>
        </div>
        <div className="mt-5 rounded-xl bg-white/70 p-4 text-sm font-semibold leading-6 text-emerald-950 dark:bg-black/20 dark:text-emerald-200">
          {selected.guidance}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-black text-db-dark dark:text-white">Passende Anlaufstellen</h2>
        <div className="mt-3 space-y-3">
          {selected.contacts.map((contactId) => {
            const contact = contactDetails[contactId];
            return (
              <article key={contactId} className={`rounded-xl border bg-white p-4 shadow-sm dark:bg-db-dark/50 ${contact.urgent ? "border-red-300 dark:border-red-900" : "border-db-dark/10 dark:border-white/10"}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`font-black ${contact.urgent ? "text-red-700 dark:text-red-400" : "text-db-dark dark:text-white"}`}>{contact.title}</h3>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${contact.urgent ? "bg-red-100 text-red-800" : "bg-db-warm text-db-dark/70 dark:bg-white/10 dark:text-white/70"}`}>{contact.role}</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold leading-5 text-db-rail dark:text-white/60">{contact.description}</p>
                  </div>

                  {contact.href ? (
                    <a href={contact.href} className={`shrink-0 rounded-xl px-4 py-2.5 text-center text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${contact.urgent ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" : "bg-db-dark hover:bg-black focus:ring-db-red"}`}>
                      {contact.label}
                    </a>
                  ) : (
                    <button type="button" onClick={() => onNavigate?.("record-report")} className="shrink-0 rounded-xl bg-db-dark px-4 py-2.5 text-xs font-black text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-db-red/30">
                      Entwurf vorbereiten
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <p className="rounded-xl border border-db-dark/10 bg-db-soft p-4 text-xs font-semibold leading-5 text-db-rail dark:border-white/10 dark:bg-db-dark/50 dark:text-white/60">
        DB Peace AI ist ein Prototyp. Er stellt keine Verbindung zu internen DB-Systemen her und übermittelt keine Meldung automatisch.
      </p>
    </div>
  );
}
