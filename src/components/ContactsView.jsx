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
  ShieldPlus,
  ChevronDown
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
        <h1 className="text-3xl font-black text-db-dark dark:text-white mb-2">
          Wichtige Kontakte & SOS
        </h1>
        <p className="text-lg text-db-rail dark:text-white/70 font-medium">
          Bei akuter Gefahr die Nummern ganz oben. Alles andere ist für später.
        </p>
      </div>

      <div className="space-y-4">
        <Abschnitt
          titel="Akute Gefahr"
          symbol={<ShieldAlert className="w-6 h-6" />}
          symbolKlasse="bg-red-500 text-white"
          anzahl={notrufe.length}
          offen
        >
          <div className="space-y-4">
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
        </Abschnitt>

        {/* Offizielle Meldewege der DB */}
        <Abschnitt
          titel="Meldewege der DB"
          hinweis="Offizielle Meldestellen des Konzerns. Du entscheidest, ob du deinen Namen nennst."
          symbol={<Building2 className="w-6 h-6" />}
          symbolKlasse="bg-db-dark text-white dark:bg-white dark:text-db-dark"
          anzahl={DB_MELDEWEGE.length}
        >
          <div className="space-y-4">
            {DB_MELDEWEGE.map((w) => (
              <MeldewegKarte key={w.id} weg={w} />
            ))}
          </div>
        </Abschnitt>

        {/* Vertrauliche Beratung */}
        <Abschnitt
          titel="Beratung"
          hinweis="Zum Reden und Sortieren — ohne dass daraus eine Meldung wird."
          symbol={<HeartHandshake className="w-6 h-6" />}
          symbolKlasse="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
          anzahl={DB_BERATUNG.length + beratung.length}
        >
          <div className="space-y-4">
            {DB_BERATUNG.map((b) => (
              <BeratungKarte key={b.id} eintrag={b} />
            ))}
            {beratung.map((k) => (
              <TelefonKarte key={k.id} name={k.name} nummer={k.telefon} desc={k.beschreibung} />
            ))}
          </div>
        </Abschnitt>

      {/* Standortabhängige Stellen */}
        <Abschnitt
          titel="An deinem Standort"
          hinweis="Je nach Standort und Ausbildungsbereich unterschiedlich — erst auswählen."
          symbol={<MapPin className="w-6 h-6" />}
          symbolKlasse="bg-db-red/10 text-db-red"
          anzahl={STANDORT_ROLLEN.length}
        >

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <label htmlFor="standortwahl" className="text-xs font-black text-db-dark dark:text-white">
            Dein Standort
          </label>
          <select
            id="standortwahl"
            value={standort?.id ?? ""}
            onChange={(event) => standortWaehlen(event.target.value)}
            className="min-h-11 rounded-xl border border-db-dark/15 dark:border-white/15 bg-white dark:bg-db-dark/50 px-3 text-sm font-bold text-db-dark dark:text-white"
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
          <p className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs font-semibold leading-relaxed text-amber-900 dark:text-amber-200">
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
                  className="rounded-xl bg-white dark:bg-db-dark/50 p-4 border border-db-dark/10 dark:border-white/10"
                >
                  <h3 className="font-black text-sm text-db-dark dark:text-white">{rolle?.kurz}</h3>
                  <p className="mb-3 text-[11px] font-semibold text-db-rail dark:text-white/50">
                    {rolle?.name}
                  </p>
                  {personen.length > 0 ? (
                    <ul className="space-y-2.5">
                      {personen.map((person) => (
                        <li key={person.name}>
                          <p className="text-xs font-black text-db-dark dark:text-white">{person.name}</p>
                          <p className="text-[11px] font-semibold text-db-rail dark:text-white/60">
                            {person.funktion}
                          </p>
                          <p className="text-[11px] font-medium text-db-rail/80 dark:text-white/50">
                            {person.erreichbar}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="flex items-start gap-1.5 text-[11px] font-semibold text-db-rail/80 dark:text-white/50">
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
                className="rounded-xl bg-white dark:bg-db-dark/50 p-4 border border-db-dark/10 dark:border-white/10"
              >
                <h3 className="font-black text-sm text-db-dark dark:text-white mb-1">{eintrag.name}</h3>
                <p className="text-xs font-medium text-db-rail dark:text-white/60 mb-3 leading-relaxed">
                  {eintrag.beschreibung}
                </p>
                {eintrag.wert ? (
                  <a
                    href={telLink(eintrag.wert)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-db-red hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> {eintrag.wert}
                  </a>
                ) : (
                  <p className="text-[11px] font-semibold text-db-rail/80 dark:text-white/50 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
                    <span>{eintrag.hinweis}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        </Abschnitt>

      {/* Viele Azubis im ersten Lehrjahr sind noch keine 18 — für sie gelten
          zusätzliche Rechte, die kaum jemand kennt. */}
        <Abschnitt
          titel="Noch keine 18? Dann gilt für dich mehr"
          hinweis="Zusätzliche Rechte, die kaum jemand kennt."
          symbol={<ShieldPlus className="w-6 h-6" />}
          symbolKlasse="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          anzahl={UNTER_18.length}
        >
          <div className="grid gap-4 sm:grid-cols-3">
          {UNTER_18.map((h) => (
            <div key={h.id}>
              <h3 className="font-black text-sm text-db-dark dark:text-white mb-1">{h.titel}</h3>
              <p className="text-xs font-medium text-db-rail dark:text-white/70 leading-relaxed">
                {h.text}
              </p>
            </div>
          ))}
        </div>
        </Abschnitt>
      </div>

      <p className="mt-6 text-center text-[11px] font-semibold text-db-rail/70 dark:text-white/40">
        Kontaktdaten zuletzt geprüft am {new Date(GEPRUEFT_AM).toLocaleDateString("de-DE")} ·
        Quellen: deutschebahn.com (Compliance – Hinweise geben), railbow.deutschebahn.com
      </p>
    </div>
  );
}

/*
 * Ein zugeklappter Abschnitt. Die Seite war 6000 Pixel lang und warf siebzehn
 * Anlaufstellen auf einmal aus — wer in Not ist, scrollt daran vorbei.
 * „Akute Gefahr" bleibt offen, alles andere klappt auf Wunsch auf. Das ist
 * genau das, was der Untertitel ohnehin verspricht: die Nummern ganz oben,
 * alles andere ist für später.
 *
 * <details> statt eigener Zustand, damit Tastatur und Screenreader das
 * Verhalten vom Browser bekommen.
 */
function Abschnitt({ titel, hinweis, symbol, symbolKlasse, anzahl, offen = false, children }) {
  return (
    <details
      open={offen}
      className="group bg-white dark:bg-db-dark/80 rounded-lg border border-db-dark/10 dark:border-white/10 shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 p-6 min-h-[44px]">
        <div className={`p-3 rounded-xl shrink-0 ${symbolKlasse}`}>{symbol}</div>
        <div className="min-w-0 flex-grow">
          <h2 className="text-xl font-black text-db-dark dark:text-white">{titel}</h2>
          {hinweis && (
            <p className="text-xs font-medium text-db-rail dark:text-white/60 mt-0.5 leading-relaxed">
              {hinweis}
            </p>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-2 text-sm font-bold text-db-rail dark:text-white/60">
          {anzahl}
          <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="px-6 pb-6 space-y-4">{children}</div>
    </details>
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
