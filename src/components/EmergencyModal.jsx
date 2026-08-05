import React from "react";
import { X, ShieldAlert, HeartHandshake, PhoneCall } from "lucide-react";
import { EmergencySlider } from "./EmergencySlider.jsx";
import { motion, AnimatePresence } from "framer-motion";

export function EmergencyModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md rounded-lg bg-white dark:bg-db-dark p-6 shadow-lg border border-db-dark/10 dark:border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-db-dark/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-100 text-red-600">
                <ShieldAlert className="h-7 w-7 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black text-db-dark dark:text-white">Akuter Notfall</h2>
                <p className="text-xs font-semibold text-db-rail dark:text-white/60">
                  Schnelle Hilfe, ohne Versehen auszulösen.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 bg-db-warm/50 dark:bg-white/10 text-db-dark dark:text-white hover:bg-db-dark dark:hover:bg-white hover:text-white dark:hover:text-db-dark transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sliders Area */}
          <div className="mt-6 space-y-6">
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-db-dark dark:text-white">1. Polizei (Akute Gefahr)</h3>
              <EmergencySlider 
                phoneNumber="110" 
                label="Wischen für 110" 
                colorClass="bg-red-500" 
                iconColor="text-red-500" 
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-db-dark dark:text-white">2. DB Sicherheit</h3>
              <EmergencySlider 
                phoneNumber="0800 1234567" // Placeholder
                label="Wischen für DB Sicherheit" 
                colorClass="bg-db-dark" 
                iconColor="text-db-dark" 
              />
            </div>

            <div className="pt-4 border-t border-db-dark/10 dark:border-white/10 space-y-3">
               <h3 className="text-sm font-bold text-db-dark dark:text-white">Weitere Ansprechpartner</h3>
               
               <a href="tel:08001110111" className="flex items-center justify-between rounded-xl bg-db-warm/40 dark:bg-db-dark/50 p-4 border border-db-dark/5 dark:border-white/5 hover:border-db-dark/20 dark:hover:border-white/20 transition">
                  <div>
                    <div className="font-bold text-sm text-db-dark dark:text-white">Telefonseelsorge (24/7)</div>
                    <div className="text-xs font-medium text-db-rail dark:text-white/60">0800 111 0 111 (Kostenfrei)</div>
                  </div>
                  <div className="rounded-full bg-white dark:bg-db-dark/80 p-2 shadow-sm border dark:border-white/10">
                    <PhoneCall className="h-4 w-4 text-db-dark dark:text-white" />
                  </div>
               </a>
            </div>

          </div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
