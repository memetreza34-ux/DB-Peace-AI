import React from "react";
import { motion } from "framer-motion";
import { Eye, Info, Scale, X } from "lucide-react";
import { GRUPPEN, POSTFACH_ROLLEN } from "../config/rollen.js";
import { meineRollen, istMeineRolle } from "../lib/rolle.js";
import { useDialog } from "../lib/useDialog.js";

/**
 * Die Rollenauswahl.
 *
 * Hier stand einmal eine nachgebaute Anmeldung, die nach anderthalb Sekunden
 * jeden durchgelassen hat. Das täuschte eine Anbindung an DB-Systeme vor, die
 * es nicht gibt. Was hier passiert, ist ein Perspektivwechsel — und die Ansicht
 * sagt das auch, statt so zu tun, als prüfe sie Berechtigungen.
 */
export function RollenWechsel({ isOpen, onClose, onRolleWaehlen, aktiveRolle }) {
  const dialogRef = useDialog(isOpen, onClose);

  if (!isOpen) return null;

  const eigene = meineRollen();
  // Vorschau-Rollen: alles, was der nutzenden Person nicht selbst gehört.
  const fremde = POSTFACH_ROLLEN.filter((rolle) => !istMeineRolle(rolle.id));
  const gruppen = Object.values(GRUPPEN).filter((gruppe) =>
    fremde.some((rolle) => rolle.gruppe === gruppe.id)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60  p-4"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rollenwahl-titel"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark shadow-lg outline-none"
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition hover:text-slate-600 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-db-dark/10 dark:border-white/10 bg-db-soft dark:bg-white/5 p-6 text-center">
          <div className="mx-auto mb-4 w-fit rounded-xl bg-db-dark dark:bg-white p-3 text-white dark:text-db-dark shadow-sm">
            <Eye className="h-8 w-8" />
          </div>
          <h2 id="rollenwahl-titel" className="text-xl font-bold text-db-dark dark:text-white">
            Rolle wechseln
          </h2>
          <p className="mt-1 text-sm font-medium text-db-rail dark:text-white/60">
            Deine eigenen Rollen — und eine Vorschau auf alle übrigen
          </p>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-db-red">Meine Rollen</p>
            <p className="mb-3 text-xs font-semibold text-db-rail dark:text-white/50">
              Viele JAV-Mitglieder sind selbst Azubis. Du wechselst den Hut, nicht die Person —
              was du selbst gemeldet hast, siehst du in der Bearbeitungsrolle nicht.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {eigene.map((rolle) => {
                const istAktiv = rolle.id === "azubi" ? !aktiveRolle : aktiveRolle === rolle.id;
                return (
                  <button
                    key={rolle.id}
                    type="button"
                    onClick={() => onRolleWaehlen(rolle.id === "azubi" ? null : rolle.id)}
                    className={`rounded-xl border-2 p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                      istAktiv
                        ? "border-db-red bg-db-red/5"
                        : "border-db-dark/15 dark:border-white/15 bg-white dark:bg-db-dark/50 hover:border-db-red"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-db-dark dark:text-white">{rolle.kurz}</span>
                      {istAktiv && (
                        <span className="rounded bg-db-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          aktiv
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold text-db-rail dark:text-white/60">
                      {rolle.id === "azubi" ? "Eigene Sachen festhalten und melden" : "Fälle bearbeiten"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-db-dark/10 dark:border-white/10 pt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-db-rail dark:text-white/50">
              Andere Stellen ansehen
            </p>
            <p className="text-xs font-semibold text-db-rail dark:text-white/50">
              Gehören dir nicht — hier nur als Vorschau, damit sichtbar wird, wo eine Meldung
              ankommt und wo nicht.
            </p>
          </div>

          <div className="flex gap-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium leading-relaxed text-amber-900 dark:text-amber-200">
              Keine Anmeldung und keine Berechtigungsprüfung — die Rollen sind zum Ansehen. Jedes
              Postfach zeigt erfundene Beispielfälle, und die Stellen sehen einander nicht.
            </p>
          </div>

          {gruppen.map((gruppe) => (
            <div key={gruppe.id}>
              <p className="text-xs font-bold uppercase tracking-wide text-db-red">
                {gruppe.name}
              </p>
              <p className="mb-3 text-xs font-semibold text-db-rail dark:text-white/50">
                {gruppe.zweck}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {fremde.filter((rolle) => rolle.gruppe === gruppe.id).map((rolle) => (
                  <button
                    key={rolle.id}
                    type="button"
                    onClick={() => onRolleWaehlen(rolle.id)}
                    className={`rounded-xl border p-3.5 text-left transition hover:-translate-y-0.5 hover:border-db-red hover:shadow-sm ${
                      aktiveRolle === rolle.id
                        ? "border-db-red bg-db-red/5"
                        : "border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50"
                    }`}
                  >
                    <span className="block text-sm font-bold text-db-dark dark:text-white">
                      {rolle.kurz}
                    </span>
                    {rolle.name !== rolle.kurz && (
                      <span className="mt-0.5 block text-xs font-semibold text-db-rail dark:text-white/60">
                        {rolle.name}
                      </span>
                    )}
                    {(rolle.grundlage || rolle.grundlageOffen) && (
                      <span className="mt-2 flex items-start gap-1 text-[11px] font-bold text-db-rail/70 dark:text-white/40">
                        <Scale className="mt-px h-3 w-3 shrink-0" />
                        {rolle.grundlage || rolle.grundlageOffen}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
