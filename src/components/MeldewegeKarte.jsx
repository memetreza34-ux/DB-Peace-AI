import React from "react";
import { ExternalLink, Mail, PhoneCall, MapPin, Info } from "lucide-react";
import { DB_MELDEWEGE, OFFEN_FUER_PILOT, telLink } from "../config/kontakte";
import { standortLaden, besetzungFuer } from "../lib/standort.js";
import { STANDORT_ROLLEN } from "../config/standorte.js";
import { rolleFinden } from "../lib/rolle.js";

/**
 * „Und wohin jetzt damit?" — der Schritt, der aus einem Entwurf eine echte
 * Meldung macht.
 *
 * Die App versendet bewusst nichts selbst. Sie bereitet den Text auf und
 * übergibt ihn an einen offiziellen Meldeweg der DB; abgeschickt wird er von
 * einem Menschen, der vorher noch einmal draufschaut.
 */
export function MeldewegeKarte({ entwurf }) {
  const betreff = "Meldung über DB Peace AI (Prototyp)";
  const text = entwurfAlsText(entwurf);

  return (
    <div className="rounded-lg border-2 border-db-red/30 bg-surface p-5 shadow-panel">
      <p className="text-sm font-bold uppercase tracking-wide text-db-red">Nächster Schritt</p>
      <h3 className="mt-1 text-2xl font-bold dark:text-white">Wohin mit deiner Meldung?</h3>
      <p className="mt-2 text-sm font-normal text-ink-muted leading-relaxed">
        Diese App verschickt nichts von allein. Wähle einen offiziellen Meldeweg der DB — dein
        Entwurf wird dabei übernommen, und du entscheidest, ob und was du abschickst.
      </p>

      <div className="mt-5 space-y-3">
        {DB_MELDEWEGE.map((weg) => (
          <Weg key={weg.id} weg={weg} betreff={betreff} text={text} />
        ))}
      </div>

      <StandortHinweis />
    </div>
  );
}

/**
 * Wer am eingestellten Standort ansprechbar ist. Ohne Standort bleibt es beim
 * ehrlichen Hinweis, dass diese Stellen noch nicht hinterlegt sind.
 */
function StandortHinweis() {
  const standort = standortLaden();

  if (!standort) {
    return (
      <div className="mt-5 rounded-xl bg-surface-sunk p-4 border border-line/10">
        <p className="text-sm font-bold text-ink flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-db-red" /> An deinem Standort
        </p>
        <p className="text-sm font-medium text-ink-muted leading-relaxed">
          {OFFEN_FUER_PILOT.filter((eintrag) => !eintrag.wert)
            .map((eintrag) => eintrag.name)
            .join(", ")}{" "}
          sind je nach Standort verschieden und noch nicht hinterlegt. Deinen Standort kannst du
          unter „Ansprechpartner &amp; Meldewege" einstellen.
        </p>
      </div>
    );
  }

  const besetzt = STANDORT_ROLLEN.map((rolleId) => ({
    rolle: rolleFinden(rolleId),
    personen: besetzungFuer(standort, rolleId),
  })).filter((eintrag) => eintrag.personen.length > 0);

  return (
    <div className="mt-5 rounded-xl bg-surface-sunk p-4 border border-line/10">
      <p className="text-sm font-bold text-ink flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-db-red" /> An deinem Standort
        {standort.beispiel && (
          <span className="rounded bg-warn px-2 py-0.5 text-sm text-warn-ink">
            Beispiel
          </span>
        )}
      </p>
      <ul className="space-y-1.5">
        {besetzt.map(({ rolle, personen }) => (
          <li key={rolle.id} className="text-sm font-medium text-ink-muted">
            <span className="font-bold text-ink">{rolle.kurz}:</span>{" "}
            {personen.map((person) => person.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Weg({ weg, betreff, text }) {
  if (weg.art === "online") {
    return (
      <Zeile
        name={weg.name}
        beschreibung={weg.beschreibung}
        aktion={{
          href: weg.url,
          label: "Meldesystem öffnen",
          Icon: ExternalLink,
          extern: true
        }}
        hinweis="Dein Entwurf wird nicht automatisch übertragen — kopiere ihn dort hinein."
      />
    );
  }

  if (weg.art === "email") {
    const href = `mailto:${weg.email}?subject=${encodeURIComponent(
      betreff
    )}&body=${encodeURIComponent(text)}`;
    return (
      <Zeile
        name={weg.name}
        beschreibung={weg.beschreibung}
        aktion={{ href, label: "E-Mail mit Entwurf öffnen", Icon: Mail }}
        hinweis={`Öffnet dein E-Mail-Programm an ${weg.email}. Abgeschickt wird erst, wenn du auf Senden drückst.`}
      />
    );
  }

  if (weg.art === "telefon") {
    return (
      <Zeile
        name={weg.name}
        beschreibung={weg.beschreibung}
        aktion={{ href: telLink(weg.telefon), label: weg.telefon, Icon: PhoneCall }}
        hinweis={weg.erreichbarkeit}
      />
    );
  }

  return <Zeile name={weg.name} beschreibung={weg.beschreibung} hinweis={weg.adresse} />;
}

function Zeile({ name, beschreibung, aktion, hinweis }) {
  return (
    <div className="rounded-xl border border-line/10 bg-db-soft/50 dark:bg-white/5 p-4">
      <h4 className="font-bold text-sm text-ink">{name}</h4>
      <p className="mt-1 text-sm font-medium text-ink-muted leading-relaxed">
        {beschreibung}
      </p>

      {aktion && (
        <a
          href={aktion.href}
          {...(aktion.extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-db-dark dark:bg-db-red px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 break-all"
        >
          <aktion.Icon className="w-4 h-4 shrink-0" />
          {aktion.label}
        </a>
      )}

      {hinweis && (
        <p className="mt-2 text-sm font-normal text-ink-muted  flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
          <span>{hinweis}</span>
        </p>
      )}
    </div>
  );
}

/** Formt den Entwurf zu einem Fließtext, der sich in eine E-Mail einfügen lässt. */
function entwurfAlsText(entwurf) {
  if (!Array.isArray(entwurf) || entwurf.length === 0) {
    return "Hiermit möchte ich einen Vorfall melden.\n\n";
  }

  const zeilen = entwurf
    .filter(({ value }) => value && value !== "nicht angegeben")
    .map(({ label, value }) => `${label}: ${value}`);

  return (
    "Hiermit möchte ich folgenden Vorfall melden.\n\n" +
    zeilen.join("\n") +
    "\n\n---\nDieser Entwurf wurde mit dem Prototyp DB Peace AI vorbereitet und vor dem " +
    "Versand von mir geprüft.\n"
  );
}
