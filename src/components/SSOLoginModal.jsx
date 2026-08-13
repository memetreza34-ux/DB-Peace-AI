import React from "react";
import { motion } from "framer-motion";
import { Eye, X, ArrowRight, Info } from "lucide-react";
import { useDialog } from "../lib/useDialog";

/**
 * Einstieg in die HR-Vorschau.
 *
 * Hier stand vorher eine nachgebaute Azure-AD-Anmeldung ("DB Enterprise
 * Authentication", "Überprüfe Berechtigungen (Role: HR_ADMIN)"), die nach
 * anderthalb Sekunden jeden durchgelassen hat. Das täuschte eine Anbindung an
 * DB-Systeme vor, die es nicht gibt — in einer Vorführung vor der DB wäre das
 * der falsche Eindruck. Jetzt ist es das, was es ist: ein Perspektivwechsel.
 */
export function SSOLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const dialogRef = useDialog(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hr-vorschau-titel"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-db-dark rounded-md shadow-lg w-full max-w-md overflow-hidden relative outline-none border border-db-dark/10 dark:border-white/10"
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-db-soft dark:bg-white/5 border-b border-db-dark/10 dark:border-white/10 p-6 flex flex-col items-center text-center">
          <div className="bg-db-dark dark:bg-white text-white dark:text-db-dark p-3 rounded-xl mb-4 shadow-sm">
            <Eye className="w-8 h-8" />
          </div>
          <h2 id="hr-vorschau-titel" className="text-xl font-black text-db-dark dark:text-white">
            Die andere Seite ansehen
          </h2>
          <p className="text-sm font-medium text-db-rail dark:text-white/60 mt-1">
            So könnte eine Meldung bei HR oder JAV ankommen
          </p>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl flex gap-3">
            <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200 leading-relaxed">
              Eine Vorschau mit erfundenen Beispielfällen — keine Anmeldung, keine Verbindung zu
              DB-Systemen, keine echten Meldungen. Sie zeigt, wie eine Meldung aussieht, wenn sie
              ankommt.
            </p>
          </div>

          <button
            onClick={onLoginSuccess}
            className="w-full bg-db-dark dark:bg-db-red hover:opacity-90 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
          >
            Vorschau öffnen
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
