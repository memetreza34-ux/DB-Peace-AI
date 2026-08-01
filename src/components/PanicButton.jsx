import React, { useState } from "react";
import { LogOut } from "lucide-react";

export function PanicButton() {
  const handlePanic = () => {
    // In a real app, this might immediately replace the DOM or redirect to Google
    window.location.href = "https://www.google.de/search?q=wetter";
  };

  return (
    <button
      onClick={handlePanic}
      className="fixed bottom-6 left-6 z-[100] flex items-center justify-center w-12 h-12 bg-db-rail text-white/50 hover:text-white hover:bg-slate-800 rounded-full shadow-lg transition-all border border-white/10 group"
      title="Quick Exit (Schnell verlassen)"
    >
      <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      
      {/* Tooltip */}
      <div className="absolute left-full ml-4 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Quick Exit
      </div>
    </button>
  );
}
