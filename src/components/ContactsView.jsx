import React, { useState } from "react";
import { STANDORTE, STANDORT_ROLLEN, STELLEN } from "../config/standorte.js";
import { standortLaden, standortSpeichern, besetzungFuer } from "../lib/standort.js";
import { rolleFinden } from "../lib/rolle.js";
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
  const [standort, setStandort] = useState(() => standortLaden());

  const standortWaehlen = (id) => {
    standortSpeichern(id);
    setStandort(id ? STANDORTE.find((eintrag) => eintrag.id === id) ?? null : null);
  };

  const notrufe = EXTERNE_HILFE.filter((k) => k.dringend);
  const beratung = EXTERNE_HILFE.filter((k) => !k.dringend);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">
          Wichtige Kontakte & SOS
        </h1>
        <p className="text-lg text-ink-muted font-medium">
          Bei akuter Gefahr die Nummern ganz oben. Alles andere ist für später.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Akute Nothilfe */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface  rounded-lg p-5 border-2 border-red-500/20 shadow-sm flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500 text-white p-3 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-ink">Akute Gefahr</h2>
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
          className="bg-surface  rounded-lg p-5 border border-line/10 shadow-sm flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-contrast text-contrast-ink   p-3 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-ink">Meldewege der DB</h2>
          </div>

          <p className="text-sm font-medium text-ink-muted mb-5 leading-relaxed">
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
          className="bg-surface  rounded-lg p-5 border border-line/10 shadow-sm flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 p-3 rounded-xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-ink">Beratung</h2>
          </div>

          <p className="text-sm font-medium text-ink-muted mb-5 leading-relaxed">
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
        className="mt-6 bg-surface-sunk rounded-lg p-5 border border-line/10"
      >
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-5 h-5 text-db-red" />
          <h2 className="text-lg font-bold text-ink">An deinem Standort</h2>
        </div>
        <p className="text-sm font-medium text-ink-muted mb-4 max-w-3xl leading-relaxed">
          Diese Stellen sind je nach Standort und Ausbildungsbereich unterschiedlich. Wähle deinen
          Standort, dann siehst du, wer dort hinter den Rollen steht.
        </p>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <label htmlFor="standortwahl" className="text-sm font-bold text-ink">
            Dein Standort
          </label>
          <select
            id="standortwahl"
            value={standort?.id ?? ""}
            onChange={(event) => standortWaehlen(event.target.value)}
            className="min-h-11 rounded-xl border border-line/15 bg-surface px-3 text-sm font-bold text-ink"
          >
            <option value="">Noch nicht gewählt</option>
            {STANDORTE.map((eintrag) => (
              <option key={eintrag.id} value={eintrag.id}>
                {eintrag.name}
                {eintrag.beispiel ? " (Beispiel)" : ""}
              </option>
            ))}
          </select>
        </div>

        {standort?.beispiel && (
          <p className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-3 text-sm font-semibold leading-relaxed text-amber-900 dark:text-amber-200">
            <Info className="mt-px h-4 w-4 shrink-0" />
            <span>
              Beispiel-Standort mit erfundenen Personen — so sieht es aus, wenn echte Daten
              hinterlegt sind. Bewusst ohne Rufnummern: Eine erfundene Nummer, die jemand in einer
              Notlage anruft, wäre schlimmer als gar keine Angabe.
            </span>
          </p>
        )}

        {standort ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STANDORT_ROLLEN.map((rolleId) => {
              // Am Standort steht nicht nur, wer eine Rolle mit Postfach hat —
              // DB Sicherheit ist eine Stelle ohne Postfach und gehört trotzdem hierher.
              const rolle = rolleFinden(rolleId) ?? STELLEN[rolleId];
              const personen = besetzungFuer(standort, rolleId);
              return (
                <div
                  key={rolleId}
                  className="rounded-xl bg-surface p-4 border border-line/10"
                >
                  <h3 className="font-bold text-sm text-ink">{rolle?.kurz}</h3>
                  <p className="mb-3 text-sm font-normal text-ink-muted ">
                    {rolle?.name}
                  </p>
                  {personen.length > 0 ? (
                    <ul className="space-y-2.5">
                      {personen.map((person) => (
                        <li key={person.name}>
                          <p className="text-sm font-bold text-ink">{person.name}</p>
                          <p className="text-sm font-normal text-ink-muted">
                            {person.funktion}
                          </p>
                          <p className="text-sm font-medium text-ink-muted ">
                            {person.erreichbar}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="flex items-start gap-1.5 text-sm font-normal text-ink-muted ">
                      <Info className="mt-px h-3.5 w-3.5 shrink-0" />
                      <span>Für diesen Standort noch nicht hinterlegt.</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {OFFEN_FUER_PILOT.map((eintrag) => (
              <div
                key={eintrag.id}
                className="rounded-xl bg-surface p-4 border border-line/10"
              >
                <h3 className="font-bold text-sm text-ink mb-1">{eintrag.name}</h3>
                <p className="text-sm font-medium text-ink-muted mb-3 leading-relaxed">
                  {eintrag.beschreibung}
                </p>
                {eintrag.wert ? (
                  <a
                    href={telLink(eintrag.wert)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-db-red hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> {eintrag.wert}
                  </a>
                ) : (
                  <p className="text-sm font-normal text-ink-muted  flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
                    <span>{eintrag.hinweis}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Viele Azubis im ersten Lehrjahr sind noch keine 18 — für sie gelten
          zusätzliche Rechte, die kaum jemand kennt. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 rounded-lg border-2 border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <ShieldPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-bold text-ink">
            Noch keine 18? Dann gilt für dich mehr
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          {UNTER_18.map((h) => (
            <div key={h.id}>
              <h3 className="font-bold text-sm text-ink mb-1">{h.titel}</h3>
              <p className="text-sm font-medium text-ink-muted leading-relaxed">
                {h.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <p className="mt-6 text-center text-sm font-normal text-ink-muted ">
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
          : "bg-line/5  border-transparent"
      } transition hover:border-line/20 `}
    >
      <h3
        className={`font-bold mb-1 ${
          dringend ? "text-red-700 dark:text-red-400" : "text-ink"
        }`}
      >
        {name}
      </h3>
      <p className="text-sm font-medium text-ink-muted mb-3 leading-relaxed">
        {desc}
      </p>
      <a
        href={telLink(nummer)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
          dringend
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-surface  text-ink border border-line/10 hover:shadow-sm"
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
    <div className="p-4 rounded-xl bg-line/5  border border-transparent transition hover:border-line/20 ">
      <h3 className="font-bold mb-1 text-ink">{weg.name}</h3>
      <p className="text-sm font-medium text-ink-muted mb-3 leading-relaxed">
        {weg.beschreibung}
      </p>

      {ziel ? (
        <a
          href={ziel.href}
          {...(ziel.extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-surface  text-ink border border-line/10 hover:shadow-sm transition break-all"
        >
          <ziel.icon className="w-4 h-4 shrink-0" />
          {ziel.label}
        </a>
      ) : (
        <p className="text-sm font-normal text-ink-muted">{weg.adresse}</p>
      )}

      {weg.erreichbarkeit && (
        <p className="mt-2 text-sm font-normal text-ink-muted ">
          {weg.erreichbarkeit}
        </p>
      )}
    </div>
  );
}

function BeratungKarte({ eintrag }) {
  return (
    <div className="p-4 rounded-xl bg-line/5  border border-transparent transition hover:border-line/20 ">
      <h3 className="font-bold mb-1 text-ink">{eintrag.name}</h3>
      <p className="text-sm font-medium text-ink-muted mb-3 leading-relaxed">
        {eintrag.beschreibung}
      </p>

      {eintrag.url && (
        <a
          href={eintrag.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-surface  text-ink border border-line/10 hover:shadow-sm transition"
        >
          <ExternalLink className="w-4 h-4" /> Zur Seite
        </a>
      )}

      {eintrag.intranet && (
        <p className="mt-2 text-sm font-normal text-ink-muted  flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
          <span>Im DB-Intranet: {eintrag.intranet}</span>
        </p>
      )}
    </div>
  );
}
