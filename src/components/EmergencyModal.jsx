import React from "react";
import { X, ShieldAlert, HeartHandshake, PhoneCall } from "lucide-react";
import { EmergencySlider } from "./EmergencySlider.jsx";
import { motion } from "framer-motion";
import { useDialog } from "../lib/useDialog";

export function EmergencyModal({ isOpen, onClose }) {
  const dialogRef = useDialog(isOpen, onClose);

  // Bewusst ohne AnimatePresence: Das Overlay blieb damit nach dem Schließen
  // unsichtbar im DOM liegen (opacity 0, pointer-events auto) und fing weiter
  // Klicks über der ganzen Seite ab. Ein Notfall-Dialog muss zuverlässig
  // verschwinden — das wiegt schwerer als eine Ausblend-Animation.
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 "
    >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notfall-titel"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-surface  p-5 shadow-lg border border-line/10 outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-line/10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-db-redInk dark:text-red-400">
                Notfall
              </p>
              <h2 id="notfall-titel" className="mt-1.5 text-2xl font-bold tracking-tight text-ink">
                Jetzt Hilfe holen
              </h2>
              <div className="mt-3 h-1 w-10 bg-db-red" />
            </div>
            <button
              onClick={onClose}
              aria-label="Notfall-Dialog schließen"
              className="rounded-full p-2 bg-db-warm/50 dark:bg-white/10 text-ink hover:bg-db-dark dark:hover:bg-white hover:text-white dark:hover:text-db-dark transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sliders Area */}
          <div className="mt-6 space-y-6">
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-ink">1. Polizei (Akute Gefahr)</h3>
              <EmergencySlider 
                phoneNumber="110" 
                label="Wischen für 110" 
                colorClass="bg-red-500" 
                iconColor="text-red-500" 
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-ink">2. Rettungsdienst (Verletzung, medizinischer Notfall)</h3>
              <EmergencySlider
                phoneNumber="112"
                label="Wischen für 112"
                colorClass="bg-db-dark"
                iconColor="text-db-dark"
              />
            </div>

            <div className="pt-4 border-t border-line/10 space-y-3">
               <h3 className="text-sm font-bold text-ink">Weitere Ansprechpartner</h3>
               
               <a href="tel:08001110111" className="flex items-center justify-between rounded-xl bg-db-warm/40 dark:bg-db-dark/50 p-4 border border-line/5  hover:border-line/20  transition">
                  <div>
                    <div className="font-bold text-sm text-ink">Telefonseelsorge (24/7)</div>
                    <div className="text-sm font-medium text-ink-muted">0800 111 0 111 (Kostenfrei, anonym)</div>
                  </div>
                  <div className="rounded-full bg-surface  p-2 shadow-sm border dark:border-white/10">
                    <PhoneCall className="h-4 w-4 text-ink" />
                  </div>
               </a>

               <a href="tel:116111" className="flex items-center justify-between rounded-xl bg-db-warm/40 dark:bg-db-dark/50 p-4 border border-line/5  hover:border-line/20  transition">
                  <div>
                    <div className="font-bold text-sm text-ink">Nummer gegen Kummer</div>
                    <div className="text-sm font-medium text-ink-muted">116 111 (Kostenfrei, bis 25 Jahre)</div>
                  </div>
                  <div className="rounded-full bg-surface  p-2 shadow-sm border dark:border-white/10">
                    <PhoneCall className="h-4 w-4 text-ink" />
                  </div>
               </a>
               <div className="flex items-center justify-between rounded-xl bg-db-warm/40 dark:bg-db-dark/50 p-4 border border-line/5 ">
                  <div>
                    <div className="font-bold text-sm text-ink">DB Sicherheitszentrale</div>
                    <div className="text-sm font-medium text-ink-muted">
                      Die Nummer steht auf deinem Dienstausweis.
                    </div>
                  </div>
                  <div className="rounded-full bg-surface  p-2 shadow-sm border dark:border-white/10">
                    <ShieldAlert className="h-4 w-4 text-ink" />
                  </div>
               </div>
            </div>

            <p className="border-t border-line/10 pt-4 text-sm font-normal leading-relaxed text-ink-muted">
              Hilfe holen ist kein Verrat. Du musst nichts entscheiden, was du nicht willst.
            </p>

          </div>
      </motion.div>
    </motion.div>
  );
}
