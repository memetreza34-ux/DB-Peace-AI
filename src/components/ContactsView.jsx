import React from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  HeartHandshake,
  Building2,
  PhoneCall,
  ArrowRight,
  Mail,
  ExternalLink,
  Info,
  MapPin,
  ShieldPlus
} from "lucide-react";
import {
  DB_MELDEWEGE,
  DB_BERATUNG,
  EXTERNE_HILFE,
  OFFEN_FUER_PILOT,
  UNTER_18,
  GEPRUEFT_AM,
  telLink
} from "../config/kontakte";

export function ContactsView() {
  const notrufe = EXTERNE_HILFE.filter((k) => k.dringend);
  const beratung = EXTERNE_HILFE.filter((k) => !k.dringend);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-db-dark dark:text-white mb-2">
          Wichtige Kontakte & SOS
        </h1>
        <p className="text-lg text-db-rail dark:text-white/70 font-medium">
          Hier findest du alle wichtigen Ansprechpartner – egal ob es brennt oder du einfach
          jemanden zum Reden brauchst.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Akute Nothilfe */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-db-dark/80 rounded-lg p-6 border-2 border-red-500/20 shadow-sm flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500 text-white p-3 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-db-dark dark:text-white">Akute Gefahr</h2>
          </div>

          <div className="space-y-4 flex-grow">
            {notrufe.map((k) => (
              <TelefonKarte
                key={k.id}
                name={k.name}
                nummer={k.telefon}
                desc={k.beschreibung}
                dringend
              />
            ))}
          </div>
        </motion.div>

        {/* Offizielle Meldewege der DB */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-db-dark/80 rounded-lg p-6 border border-db-dark/10 dark:border-white/10 shadow-sm flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-db-dark text-white dark:bg-white dark:text-db-dark p-3 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-db-dark dark:text-white">Meldewege der DB</h2>
          </div>

          <p className="text-xs font-medium text-db-rail dark:text-white/60 mb-5 leading-relaxed">
            Offizielle Meldestellen des DB-Konzerns. Du entscheidest, ob du deinen Namen nennst.
          </p>

          <div className="space-y-4 flex-grow">
            {DB_MELDEWEGE.map((w) => (
              <MeldewegKarte key={w.id} weg={w} />
            ))}
          </div>
        </motion.div>

        {/* Vertrauliche Beratung */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-db-dark/80 rounded-lg p-6 border border-db-dark/10 dark:border-white/10 shadow-sm flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 p-3 rounded-xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-db-dark dark:text-white">Beratung</h2>
          </div>

          <p className="text-xs font-medium text-db-rail dark:text-white/60 mb-5 leading-relaxed">
            Zum Reden und Sortieren — ohne dass daraus eine Meldung wird.
          </p>

          <div className="space-y-4 flex-grow">
            {DB_BERATUNG.map((b) => (
              <BeratungKarte key={b.id} eintrag={b} />
            ))}
            {beratung.map((k) => (
              <TelefonKarte key={k.id} name={k.name} nummer={k.telefon} desc={k.beschreibung} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Standortabhängige Stellen */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-db-soft dark:bg-white/5 rounded-lg p-6 border border-db-dark/10 dark:border-white/10"
      >
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-5 h-5 text-db-red" />
          <h2 className="text-lg font-black text-db-dark dark:text-white">An deinem Standort</h2>
        </div>
        <p className="text-sm font-medium text-db-rail dark:text-white/70 mb-5 max-w-3xl leading-relaxed">
          Diese Stellen sind je nach Standort und Ausbildungsbereich unterschiedlich. Dieser
          Prototyp erfindet dafür keine Kontaktdaten — im Pilotbetrieb werden sie hinterlegt.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {OFFEN_FUER_PILOT.map((s) => (
            <div
              key={s.id}
              className="rounded-xl bg-white dark:bg-db-dark/50 p-4 border border-db-dark/10 dark:border-white/10"
            >
              <h3 className="font-black text-sm text-db-dark dark:text-white mb-1">{s.name}</h3>
              <p className="text-xs font-medium text-db-rail dark:text-white/60 mb-3 leading-relaxed">
                {s.beschreibung}
              </p>
              {s.wert ? (
                <a
                  href={telLink(s.wert)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-db-red hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> {s.wert}
                </a>
              ) : (
                <p className="text-[11px] font-semibold text-db-rail/80 dark:text-white/50 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
                  <span>{s.hinweis}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Viele Azubis im ersten Lehrjahr sind noch keine 18 — für sie gelten
          zusätzliche Rechte, die kaum jemand kennt. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 rounded-lg border-2 border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <ShieldPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-black text-db-dark dark:text-white">
            Noch keine 18? Dann gilt für dich mehr
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          {UNTER_18.map((h) => (
            <div key={h.id}>
              <h3 className="font-black text-sm text-db-dark dark:text-white mb-1">{h.titel}</h3>
              <p className="text-xs font-medium text-db-rail dark:text-white/70 leading-relaxed">
                {h.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <p className="mt-6 text-center text-[11px] font-semibold text-db-rail/70 dark:text-white/40">
        Kontaktdaten zuletzt geprüft am {new Date(GEPRUEFT_AM).toLocaleDateString("de-DE")} ·
        Quellen: deutschebahn.com (Compliance – Hinweise geben), railbow.deutschebahn.com
      </p>
    </div>
  );
}

function TelefonKarte({ name, nummer, desc, dringend }) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        dringend
          ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30"
          : "bg-db-dark/5 dark:bg-white/5 border-transparent"
      } transition hover:border-db-dark/20 dark:hover:border-white/20`}
    >
      <h3
        className={`font-black mb-1 ${
          dringend ? "text-red-700 dark:text-red-400" : "text-db-dark dark:text-white"
        }`}
      >
        {name}
      </h3>
      <p className="text-sm font-medium text-db-rail dark:text-white/60 mb-3 leading-relaxed">
        {desc}
      </p>
      <a
        href={telLink(nummer)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
          dringend
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-white dark:bg-db-dark text-db-dark dark:text-white border border-db-dark/10 dark:border-white/10 hover:shadow-sm"
        }`}
      >
        <PhoneCall className="w-4 h-4" />
        {nummer}
      </a>
    </div>
  );
}

function MeldewegKarte({ weg }) {
  const ziel =
    weg.art === "online"
      ? { href: weg.url, label: "Zum Meldesystem", icon: ExternalLink, extern: true }
      : weg.art === "email"
      ? { href: `mailto:${weg.email}`, label: weg.email, icon: Mail }
      : weg.art === "telefon"
      ? { href: telLink(weg.telefon), label: weg.telefon, icon: PhoneCall }
      : null;

  return (
    <div className="p-4 rounded-xl bg-db-dark/5 dark:bg-white/5 border border-transparent transition hover:border-db-dark/20 dark:hover:border-white/20">
      <h3 className="font-black mb-1 text-db-dark dark:text-white">{weg.name}</h3>
      <p className="text-sm font-medium text-db-rail dark:text-white/60 mb-3 leading-relaxed">
        {weg.beschreibung}
      </p>

      {ziel ? (
        <a
          href={ziel.href}
          {...(ziel.extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs bg-white dark:bg-db-dark text-db-dark dark:text-white border border-db-dark/10 dark:border-white/10 hover:shadow-sm transition break-all"
        >
          <ziel.icon className="w-4 h-4 shrink-0" />
          {ziel.label}
        </a>
      ) : (
        <p className="text-xs font-semibold text-db-rail dark:text-white/60">{weg.adresse}</p>
      )}

      {weg.erreichbarkeit && (
        <p className="mt-2 text-[11px] font-semibold text-db-rail/80 dark:text-white/50">
          {weg.erreichbarkeit}
        </p>
      )}
    </div>
  );
}

function BeratungKarte({ eintrag }) {
  return (
    <div className="p-4 rounded-xl bg-db-dark/5 dark:bg-white/5 border border-transparent transition hover:border-db-dark/20 dark:hover:border-white/20">
      <h3 className="font-black mb-1 text-db-dark dark:text-white">{eintrag.name}</h3>
      <p className="text-sm font-medium text-db-rail dark:text-white/60 mb-3 leading-relaxed">
        {eintrag.beschreibung}
      </p>

      {eintrag.url && (
        <a
          href={eintrag.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs bg-white dark:bg-db-dark text-db-dark dark:text-white border border-db-dark/10 dark:border-white/10 hover:shadow-sm transition"
        >
          <ExternalLink className="w-4 h-4" /> Zur Seite
        </a>
      )}

      {eintrag.intranet && (
        <p className="mt-2 text-[11px] font-semibold text-db-rail/80 dark:text-white/50 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
          <span>Im DB-Intranet: {eintrag.intranet}</span>
        </p>
      )}
    </div>
  );
}
