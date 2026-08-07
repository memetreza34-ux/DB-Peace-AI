import React, { useRef } from "react";
import { HeartHandshake, Info, PhoneCall, ShieldAlert, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EmergencySlider } from "./EmergencySlider.jsx";
import { useModalDialog } from "../hooks/useModalDialog.js";

export function EmergencyModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  useModalDialog({ isOpen, onClose, dialogRef, initialFocusRef: closeButtonRef });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl border border-db-dark/10 bg-white p-6 shadow-2xl outline-none dark:border-white/10 dark:bg-db-dark"
            role="dialog"
            aria-modal="true"
            aria-labelledby="emergency-title"
            aria-describedby="emergency-description"
          >
            <div className="flex items-start justify-between gap-4 border-b border-db-dark/10 pb-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                  <ShieldAlert className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="emergency-title" className="text-xl font-black text-db-dark dark:text-white">Akute Hilfe</h2>
                  <p id="emergency-description" className="mt-1 text-xs font-semibold text-db-rail dark:text-white/60">Nur verifizierte öffentliche Notrufnummern.</p>
                </div>
              </div>
              <button ref={closeButtonRef} type="button" onClick={onClose} className="rounded-full p-2 text-db-dark hover:bg-db-dark/5 focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:text-white dark:hover:bg-white/10" aria-label="Notfallfenster schließen">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <span className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Die App öffnet nur die Telefon-App. Sie sendet keinen Standort, keine Meldung und keine persönlichen Daten.
              </span>
            </div>

            <div className="mt-6 space-y-6">
              <section className="space-y-2">
                <h3 className="text-sm font-black text-db-dark dark:text-white">Polizei bei akuter Bedrohung oder Gewalt</h3>
                <p className="text-xs font-semibold text-db-rail dark:text-white/60">Wenn eine Straftat oder unmittelbare Gefahr besteht.</p>
                <EmergencySlider phoneNumber="110" label="Wischen für Polizei 110" colorClass="bg-red-500" iconColor="text-red-600" />
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-black text-db-dark dark:text-white">Rettungsdienst und Feuerwehr</h3>
                <p className="text-xs font-semibold text-db-rail dark:text-white/60">Bei medizinischem Notfall, Feuer oder Lebensgefahr.</p>
                <EmergencySlider phoneNumber="112" label="Wischen für Notruf 112" colorClass="bg-orange-500" iconColor="text-orange-600" />
              </section>

              <section className="border-t border-db-dark/10 pt-5 dark:border-white/10">
                <h3 className="text-sm font-black text-db-dark dark:text-white">Weitere Unterstützung</h3>
                <div className="mt-3 space-y-3">
                  <a href="tel:08001110111" className="flex items-center justify-between rounded-xl border border-db-dark/10 bg-db-soft p-4 transition hover:border-db-red focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/10 dark:bg-db-dark/50">
                    <div>
                      <p className="font-black text-db-dark dark:text-white">Telefonseelsorge</p>
                      <p className="mt-1 text-xs font-semibold text-db-rail dark:text-white/60">0800 111 0 111 · kostenfrei</p>
                    </div>
                    <PhoneCall className="h-5 w-5 text-db-red" aria-hidden="true" />
                  </a>

                  <div className="flex items-start gap-3 rounded-xl border border-db-dark/10 bg-white p-4 dark:border-white/10 dark:bg-db-dark/50">
                    <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <div>
                      <p className="font-black text-db-dark dark:text-white">Interne Hilfe</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-db-rail dark:text-white/60">
                        Nutze ausschließlich die offiziell bestätigten internen Notfall- oder Sicherheitskontakte deines Standorts. Dieser Prototyp hinterlegt bewusst keine erfundene DB-Nummer.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
