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
      <div className="mb-8 border-l-4 border-db-red pl-4">
        <h1 className="font-schild text-4xl font-bold leading-[0.98] tracking-tight text-ink">
          Wichtige Kontakte & SOS
        </h1>
        <p className="mt-3 max-w-[46ch] text-base font-normal leading-relaxed text-ink-muted">
          Bei akuter Gefahr die Nummern ganz oben. Alles andere ist für später.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Akute Nothilfe */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-full flex-col"
        >
          <h2 className="flex items-center gap-2 border-b-2 border-db-red pb-2 font-schild text-sm font-semibold uppercase tracking-[0.18em] text-db-redInk">
            <ShieldAlert className="h-4 w-4" />
            Akute Gefahr
          </h2>

          <div className="flex-grow">
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
          className="flex h-full flex-col"
        >
          <h2 className="flex items-center gap-2 border-b-2 border-ink pb-2 font-schild text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            <Building2 className="h-4 w-4" />
            Meldewege der DB
          </h2>

          <p className="mt-3 text-sm font-normal leading-relaxed text-ink-muted">
            Offizielle Meldestellen des DB-Konzerns. Du entscheidest, ob du deinen Namen nennst.
          </p>

          <div className="mt-2 flex-grow">
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
          className="flex h-full flex-col"
        >
          <h2 className="flex items-center gap-2 border-b-2 border-ink pb-2 font-schild text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            <HeartHandshake className="h-4 w-4" />
            Beratung
          </h2>

          <p className="mt-3 text-sm font-normal leading-relaxed text-ink-muted">
            Zum Reden und Sortieren — ohne dass daraus eine Meldung wird.
          </p>

          <div className="mt-2 flex-grow">
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
        className="mt-10"
      >
        <h2 className="flex items-center gap-2 border-b-2 border-ink pb-2 font-schild text-sm font-semibold uppercase tracking-[0.18em] text-ink">
          <MapPin className="h-4 w-4" />
          An deinem Standort
        </h2>
        <p className="mb-4 mt-3 max-w-3xl text-sm font-normal leading-relaxed text-ink-muted">
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
          <p className="mb-5 flex items-start gap-2 rounded-xl border border-warn-line bg-warn p-3 text-sm font-semibold leading-relaxed text-warn-ink">
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
        className="mt-6 rounded-lg border-2 border-warn-line bg-amber-50/60 dark:bg-amber-950/20 p-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <ShieldPlus className="w-5 h-5 text-warn-ink" />
          <h2 className="text-lg font-schild font-bold text-ink">
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

/*
 * Eine Zeile für alle drei Listen. Vorher gab es drei fast gleiche Karten-
 * Komponenten, die sich nur in der Aktion unterschieden.
 *
 * Links steht die Art des Wegs — „Notruf", „Online", „E-Mail". Das ist keine
 * Beschriftung, sondern die Entscheidung, die vor dem Antippen ansteht: kann
 * ich jetzt anrufen, oder muss ich tippen?
 */
function Weg({ marker, name, beschreibung, dringend, kinder }) {
  return (
    <div
      className={`grid grid-cols-[84px_1fr] items-baseline gap-x-3 border-b py-4 sm:grid-cols-[104px_1fr] sm:gap-x-4 ${
        dringend ? "border-danger-line" : "border-line/15"
      }`}
    >
      <span
        className={`font-schild text-xs font-semibold uppercase leading-tight tracking-[0.12em] ${
          dringend ? "text-danger-ink" : "text-ink-muted"
        }`}
      >
        {marker}
      </span>
      <div>
        <h3
          className={`font-schild text-xl font-bold leading-tight tracking-tight ${
            dringend ? "text-danger-ink" : "text-ink"
          }`}
        >
          {name}
        </h3>
        {beschreibung && (
          <p className="mt-1 text-sm font-normal leading-snug text-ink-muted">{beschreibung}</p>
        )}
        {kinder}
      </div>
    </div>
  );
}

/* Der Knopf am Ende einer Zeile: bei einem Notruf rot und gross, sonst ruhig. */
function WegAktion({ href, extern, dringend, icon: Icon, children }) {
  return (
    <a
      href={href}
      {...(extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`mt-3 inline-flex min-h-11 items-center gap-2 break-all px-4 font-schild text-base font-bold transition ${
        dringend
          ? "bg-db-red text-white hover:bg-db-redInk"
          : "border border-line/20 text-ink hover:border-db-red hover:text-db-red"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {children}
    </a>
  );
}

function TelefonKarte({ name, nummer, desc, dringend }) {
  return (
    <Weg
      marker={dringend ? "Notruf" : "Telefon"}
      name={name}
      beschreibung={desc}
      dringend={dringend}
      kinder={
        <WegAktion href={telLink(nummer)} dringend={dringend} icon={PhoneCall}>
          {nummer}
        </WegAktion>
      }
    />
  );
}

function MeldewegKarte({ weg }) {
  const ziel =
    weg.art === "online"
      ? { href: weg.url, label: "Zum Meldesystem", icon: ExternalLink, extern: true, marker: "Online" }
      : weg.art === "email"
      ? { href: `mailto:${weg.email}`, label: weg.email, icon: Mail, marker: "E-Mail" }
      : weg.art === "telefon"
      ? { href: telLink(weg.telefon), label: weg.telefon, icon: PhoneCall, marker: "Telefon" }
      : null;

  return (
    <Weg
      marker={ziel?.marker ?? "Per Post"}
      name={weg.name}
      beschreibung={weg.beschreibung}
      kinder={
        <>
          {ziel ? (
            <WegAktion href={ziel.href} extern={ziel.extern} icon={ziel.icon}>
              {ziel.label}
            </WegAktion>
          ) : (
            <p className="mt-2 text-sm font-normal text-ink-muted">{weg.adresse}</p>
          )}
          {weg.erreichbarkeit && (
            <p className="mt-2 text-sm font-normal text-ink-muted">{weg.erreichbarkeit}</p>
          )}
        </>
      }
    />
  );
}

function BeratungKarte({ eintrag }) {
  return (
    <Weg
      marker={eintrag.url ? "Im Netz" : "Intranet"}
      name={eintrag.name}
      beschreibung={eintrag.beschreibung}
      kinder={
        <>
          {eintrag.url && (
            <WegAktion href={eintrag.url} extern icon={ExternalLink}>
              Zur Seite
            </WegAktion>
          )}
          {eintrag.intranet && (
            <p className="mt-2 flex items-start gap-1.5 text-sm font-normal text-ink-muted">
              <Info className="mt-px h-3.5 w-3.5 shrink-0" />
              <span>Im DB-Intranet: {eintrag.intranet}</span>
            </p>
          )}
        </>
      }
    />
  );
}
