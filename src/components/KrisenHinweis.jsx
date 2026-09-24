import React from "react";
import { LifeBuoy, PhoneCall } from "lucide-react";
import { erkenneKrise, krisenKontakte } from "../lib/crisis.js";
import { telLink } from "../config/kontakte.js";

/**
 * Steht unter jedem Freitextfeld der App.
 *
 * Wer in eine Meldung oder ins Gedächtnisprotokoll schreibt, dass er nicht mehr
 * leben will, soll nicht erst das Formular zu Ende ausfüllen müssen, um eine
 * Hilfenummer zu sehen. Die Prüfung läuft lokal bei jeder Eingabe; der Text
 * bleibt stehen, niemand wird aus dem Formular geworfen.
 */
export function KrisenHinweis({ text }) {
  const krise = erkenneKrise(text);
  if (!krise) return null;

  const einleitung = krise.text.split("\n\n")[0];
  const kontakte = krisenKontakte(krise.art);

  return (
    <div
      role="alert"
      className="mt-3 rounded-lg border-2 border-db-red bg-db-red/5 dark:bg-db-red/10 p-4"
    >
      <p className="flex items-start gap-2 text-sm font-black text-db-dark dark:text-white">
        <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0 text-db-red" aria-hidden="true" />
        {einleitung}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {kontakte.map((kontakt) => (
          <a
            key={kontakt.id}
            href={telLink(kontakt.telefon)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-db-red px-4 py-2 text-sm font-black text-white hover:bg-red-700 transition"
          >
            <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
            {kontakt.name}: {kontakt.telefon}
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold text-db-rail dark:text-white/60">
        Die Anrufe sind kostenfrei. Was du geschrieben hast, bleibt hier stehen — du kannst
        später weitermachen.
      </p>
    </div>
  );
}
