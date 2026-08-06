import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, ShieldCheck, X } from "lucide-react";

export function SSOLoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-db-dark"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hr-demo-title"
        >
          <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Fenster schließen">
            <X className="h-5 w-5" />
          </button>

          <div className="border-b border-slate-100 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <FlaskConical className="h-6 w-6" />
            </div>
            <h2 id="hr-demo-title" className="mt-4 text-xl font-black text-slate-900 dark:text-white">HR-Dashboard als Demo öffnen</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-white/60">
              Dieser Bereich enthält ausschließlich erfundene Beispieldaten. Es findet keine Anmeldung über DB Azure AD, kein Rollencheck und kein Zugriff auf Unternehmenssysteme statt.
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
              Für einen echten Einsatz wären SSO/OIDC, Rollen, Audit-Logs und eine sichere Datenbank zwingend erforderlich.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5">
                Abbrechen
              </button>
              <button type="button" onClick={onLoginSuccess} className="rounded-xl bg-violet-700 px-4 py-3 text-sm font-black text-white hover:bg-violet-800">
                Demo öffnen
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
