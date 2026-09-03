import React, { useState } from "react";
import {
  EyeOff,
  HeartPulse,
  HelpCircle,
  Scale,
  ShieldAlert,
  Siren,
  UsersRound,
  HandHeart,
  ArrowLeft,
  PhoneCall
} from "lucide-react";

const situations = [
  {
    id: "mobbing",
    title: "Ich werde gemobbt",
    icon: EyeOff,
    explanation: "Wiederholtes Bloßstellen, Ausgrenzen oder Schikanieren.",
    guidance: "Nimm das Muster ernst. Sprich mit einer vertrauten Person und sammle konkrete Beispiele. Nicht isoliert bleiben.",
    contacts: ["Vertrauensperson", "JAV", "Betriebsrat", "Ausbilder/in"]
  },
  {
    id: "bedrohung",
    title: "Ich wurde bedroht",
    icon: ShieldAlert,
    explanation: "Verbale Drohung, Einschüchterung oder körperliche Annäherung.",
    guidance: "Halte Abstand, gehe an einen sicheren Ort und beende die Diskussion. Nicht provozieren.",
    contacts: ["Sicherheitsstelle / Notruf 110", "Führungskraft"]
  },
  {
    id: "gewalt",
    title: "Ich habe Gewalt beobachtet",
    icon: Siren,
    explanation: "Körperliche Gewalt, Bedrohung oder gefährliche Eskalation.",
    guidance: "Nicht dazwischengehen, wenn du dich gefährdest. Abstand halten und sofort Hilfe holen.",
    contacts: ["Sicherheitsstelle / Notruf 110", "Führungskraft"]
  },
  {
    id: "diskriminierung",
    title: "Ich erlebe Diskriminierung",
    icon: Scale,
    explanation: "Abwertung wegen Herkunft, Religion, Geschlecht, Aussehen oder Identität.",
    guidance: "Ruhig widersprechen und die Aussage als nicht akzeptabel benennen (sofern sicher möglich). Wortlaut notieren.",
    contacts: ["Gleichstellungsbeauftragte", "Compliance / Meldestelle", "JAV", "Vertrauensperson"]
  },
  {
    id: "ueberlastung",
    title: "Ich bin psychisch überlastet",
    icon: HeartPulse,
    explanation: "Die Situation belastet dich stark oder hält länger an.",
    guidance: "Suche zeitnah Unterstützung. Du musst eine belastende Situation nicht allein sortieren.",
    contacts: ["Mitarbeitenden-Unterstützung", "Telefonseelsorge (0800 111 0 111)", "Vertrauensperson"]
  },
  {
    id: "kunde",
    title: "Ein Kunde ist aggressiv",
    icon: UsersRound,
    explanation: "Aggression, Beleidigung oder Druck im Kundenkontakt.",
    guidance: "Kurz und ruhig sprechen, Abstand halten und klare Grenzen setzen.",
    contacts: ["Kolleg/in", "Sicherheitsstelle / Notruf 110", "Führungskraft"]
  },
  {
    id: "orientierung",
    title: "Ich brauche Orientierung",
    icon: HelpCircle,
    explanation: "Du weißt nicht, an wen du dich wenden sollst.",
    guidance: "Nutze als ersten vertraulichen Schritt eine Vertrauensperson. Bei Gefahr immer sofort Notruf.",
    contacts: ["Vertrauensperson", "JAV", "Betriebsrat"]
  },
  {
    id: "unterstuetzen",
    title: "Ich möchte helfen",
    icon: HandHeart,
    explanation: "Du möchtest einer anderen Person Unterstützung anbieten.",
    guidance: "Biete Unterstützung an und frage, was die Person braucht. Nicht über die betroffene Person hinweg entscheiden.",
    contacts: ["Vertrauensperson (gemeinsam)"]
  }
];

// `ziel` verlinkt echte, belegte Kontaktwege (siehe src/config/kontakte.js).
// Wo kein Ziel steht, ist die Stelle standortabhängig — dann sagt die App das,
// statt eine Adresse zu erfinden.
const contactDetails = {
  "Vertrauensperson": {
    desc: "Erster vertraulicher Einstieg, Orientierung, emotionale Entlastung.",
    role: "Intern",
    hinweis: "Unter \u201eAnsprechpartner & Meldewege\u201c siehst du, wer an deinem Standort ansprechbar ist."
  },
  "JAV": {
    desc: "Deine eigene Interessenvertretung als Azubi. Begleitet dich auch zu Gesprächen.",
    role: "Intern",
    hinweis: "Wer das an deinem Standort ist, steht unter „Ansprechpartner & Meldewege\u201c — sobald du dort deinen Standort gewählt hast."
  },
  "Betriebsrat": {
    desc: "Vertretung aller Beschäftigten. Kann eine Beschwerde formal aufnehmen (§ 85 BetrVG).",
    role: "Intern",
    hinweis: "Wer das an deinem Standort ist, steht unter „Ansprechpartner & Meldewege\u201c — sobald du dort deinen Standort gewählt hast."
  },
  "Ausbilder/in": {
    desc: "Wenn der Vorfall Ausbildung, Anleitung oder Teamalltag betrifft.",
    role: "Intern",
    hinweis: "Direkt in deinem Ausbildungsbereich."
  },
  "Sicherheitsstelle / Notruf 110": {
    desc: "Akute Sicherheitslage, Gewalt, direkte Bedrohung.",
    role: "Notfall",
    isUrgent: true,
    ziel: { href: "tel:110", label: "110 anrufen" }
  },
  "Führungskraft": {
    desc: "Zur direkten Deeskalation und Einsatzkoordination.",
    role: "Intern",
    hinweis: "Deine direkte Führungskraft im Betrieb."
  },
  "Gleichstellungsbeauftragte": {
    desc: "Für Benachteiligung und Belästigung. Wichtig: Für Ansprüche nach dem AGG läuft eine Frist von zwei Monaten (§ 15 Abs. 4 AGG).",
    role: "Intern",
    hinweis: "Wer das in deinem Bereich ist, klärt die Ausbildungsleitung."
  },
  "Compliance / Meldestelle": {
    desc: "Schwere Verstöße, Diskriminierung, Hassrede.",
    role: "Intern",
    ziel: {
      href: "https://www.bkms-system.net/deutschebahn",
      label: "Hinweisgebersystem öffnen",
      extern: true
    },
    hinweis: "Offizielles Meldesystem der DB – anonym nutzbar, in zwölf Sprachen."
  },
  "Mitarbeitenden-Unterstützung": {
    desc: "Psychische Belastung, Beratung, Stabilisierung.",
    role: "Intern",
    ziel: { href: "https://www.lyra-mut.de", label: "Zum MUT-Angebot", extern: true },
    hinweis: "Anonyme Beratung für alle DB-Beschäftigten, auch für Azubis."
  },
  "Telefonseelsorge (0800 111 0 111)": {
    desc: "Anonyme, kostenfreie Beratung rund um die Uhr in Krisen.",
    role: "Extern",
    ziel: { href: "tel:08001110111", label: "0800 111 0 111 anrufen" }
  },
  "Kolleg/in": {
    desc: "Direkte Unterstützung in der akuten Situation.",
    role: "Intern",
    hinweis: "Jemand, dem du vertraust und der gerade in der Nähe ist."
  },
  "Vertrauensperson (gemeinsam)": {
    desc: "Begleite die betroffene Person zur Vertrauensperson.",
    role: "Intern",
    hinweis: "Unter \u201eAnsprechpartner & Meldewege\u201c siehst du, wer an deinem Standort ansprechbar ist."
  }
};

export default function SupportPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);

  function selectSituation(sit) {
    setSelected(sit);
    setStep(2);
  }

  function goBack() {
    setStep(1);
    setSelected(null);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fadeIn">
      {/* STEP 1: SITUATION SELECTION */}
      {step === 1 && (
        <div className="text-center space-y-6 py-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-green-500/10 text-green-600 mb-2">
            <PhoneCall className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-db-dark dark:text-white">Finde die richtige Unterstützung</h2>
          <p className="text-sm font-semibold text-db-rail dark:text-white/60 max-w-lg mx-auto">
            Wähle aus, in welcher Situation du dich befindest. Wir zeigen dir sofort, welche Anlaufstellen bei der DB und extern für dich da sind.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
            {situations.map((sit) => {
              const Icon = sit.icon;
              return (
                <button
                  key={sit.id}
                  onClick={() => selectSituation(sit)}
                  className="group rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50 p-5 hover:-translate-y-1 hover:border-green-500 transition shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-green-600" />
                    <span className="font-bold text-db-dark dark:text-white group-hover:text-green-700">{sit.title}</span>
                  </div>
                  <p className="text-xs font-semibold text-db-rail dark:text-white/60">{sit.explanation}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: GUIDANCE & CONTACTS */}
      {step === 2 && selected && (
        <div className="space-y-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-bold text-db-rail dark:text-white/60 hover:text-green-600 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Zurück zur Übersicht
          </button>

          <div className="rounded-md bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-6 sm:p-8 space-y-6">
             <div className="flex items-center gap-4 border-b border-green-200/50 dark:border-green-800/50 pb-4">
               <selected.icon className="h-8 w-8 text-green-700 dark:text-green-400" />
               <h3 className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-300">{selected.title}</h3>
             </div>
             
             <div>
               <h4 className="text-sm font-bold text-green-800 dark:text-green-400 uppercase tracking-wider mb-2">Was du jetzt tun solltest</h4>
               <p className="text-sm font-medium text-green-900 dark:text-green-300 leading-relaxed bg-white/60 dark:bg-black/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                 {selected.guidance}
               </p>
             </div>

             <div className="pt-4">
               <h4 className="text-sm font-bold text-green-800 dark:text-green-400 uppercase tracking-wider mb-4">Empfohlene Anlaufstellen</h4>
               <div className="grid gap-3">
                 {selected.contacts.map((contactName) => {
                   const details = contactDetails[contactName];
                   return (
                     <div key={contactName} className={`rounded-xl border p-4 bg-white dark:bg-db-dark/50 flex flex-col sm:flex-row gap-4 sm:items-center justify-between ${details?.isUrgent ? 'border-red-200 dark:border-red-800 shadow-sm' : 'border-db-dark/10 dark:border-white/10 shadow-sm'}`}>
                        <div>
                          <div className="flex items-center gap-2">
                             <span className={`font-bold text-sm ${details?.isUrgent ? 'text-red-700 dark:text-red-400' : 'text-db-dark dark:text-white'}`}>{contactName}</span>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${details?.isUrgent ? 'bg-red-100 text-red-800' : 'bg-db-warm dark:bg-white/10 text-db-dark/70 dark:text-white/70'}`}>
                                {details?.role || 'Intern'}
                             </span>
                          </div>
                          <p className="text-xs font-semibold text-db-rail dark:text-white/60 mt-1">{details?.desc}</p>
                          {!details?.ziel && details?.hinweis && (
                            <p className="text-[11px] font-semibold text-db-rail/80 dark:text-white/50 mt-1.5">
                              {details.hinweis}
                            </p>
                          )}
                        </div>
                        {details?.ziel ? (
                          <a
                            href={details.ziel.href}
                            {...(details.ziel.extern
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition text-center ${details?.isUrgent ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-db-dark text-white hover:bg-black'}`}
                          >
                            {details.ziel.label}
                          </a>
                        ) : (
                          <span className="shrink-0 rounded-lg border border-db-dark/15 dark:border-white/15 px-4 py-2 text-xs font-bold text-db-rail dark:text-white/60 text-center">
                            Vor Ort erfragen
                          </span>
                        )}
                     </div>
                   );
                 })}
               </div>
             </div>
          </div>
          
          <div className="rounded-xl border border-db-dark/10 dark:border-white/10 bg-db-soft dark:bg-db-dark/50 p-5 text-center">
             <p className="text-xs font-semibold text-db-rail dark:text-white/60">
               Noch unsicher, was du tun sollst? Du kannst den Vorfall erst mal nur für dich <strong className="text-db-dark dark:text-white cursor-pointer underline" onClick={() => onNavigate && onNavigate("record-report")}>aufschreiben</strong> – ohne dass jemand davon erfährt. Später entscheidest du, ob etwas daraus wird.
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
