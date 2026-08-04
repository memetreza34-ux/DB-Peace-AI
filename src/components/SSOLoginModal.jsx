import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, ArrowRight, Server, X } from "lucide-react";

export function SSOLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Close button (only if not loading) */}
          {!loading && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Microsoft / Azure AD Header Simulation */}
          <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col items-center">
            <div className="bg-blue-600 text-white p-3 rounded-xl mb-4 shadow-sm">
              <Server className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Single Sign-On (SSO)</h2>
            <p className="text-sm text-slate-500 mt-1">DB Enterprise Authentication</p>
          </div>

          <div className="p-8 flex flex-col gap-6">
            {!loading ? (
              <>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-800">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                  <p>
                    Dieser Bereich ist für <strong>HR & Compliance Officer</strong> reserviert. 
                    Bitte loggen Sie sich über das gesicherte Firmennetzwerk ein.
                  </p>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
                >
                  <Lock className="w-4 h-4" />
                  Mit DB Azure AD anmelden
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Authentifizierung läuft...</p>
                <p className="text-xs text-slate-400 mt-1">Überprüfe Berechtigungen (Role: HR_ADMIN)</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
