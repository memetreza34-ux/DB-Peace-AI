import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, ArrowRight, Delete } from "lucide-react";

export function AppLock({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const CORRECT_PIN = "1234"; // For prototype purposes

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 500);
      }
    }
  }, [pin, onUnlock]);

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white selection:bg-db-red">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        <div className="bg-db-red/20 p-4 rounded-full mb-6">
          <Lock className="w-12 h-12 text-db-red" />
        </div>
        
        <h1 className="text-2xl font-black mb-2 tracking-tight">DB Peace</h1>
        <p className="text-slate-400 font-medium text-sm mb-8 text-center">
          Dein sicherer Raum. Bitte gib deine PIN ein, um die App zu entsperren.
        </p>

        {/* PIN Indicators */}
        <motion.div 
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-4 mb-12"
        >
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
                pin.length > i 
                  ? error ? 'bg-red-500 border-red-500' : 'bg-db-red border-db-red'
                  : 'border-slate-600'
              }`}
            />
          ))}
        </motion.div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-16 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-2xl font-bold transition flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div className="h-16"></div>
          <button
            onClick={() => handleKeyPress("0")}
            className="h-16 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-2xl font-bold transition flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 rounded-full hover:bg-slate-800 active:bg-slate-700 text-slate-400 transition flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-12 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Lokale Verschlüsselung aktiv
        </div>
      </motion.div>
    </div>
  );
}
