import React from "react";
import { LogOut } from "lucide-react";

export function PanicButton() {
  function handleQuickExit() {
    try {
      sessionStorage.removeItem("db-peace-mood-session");
    } catch {
      // Der Seitenwechsel funktioniert auch, wenn Session Storage blockiert ist.
    }
    window.location.replace("https://www.google.de/search?q=wetter");
  }

  return (
    <button
      type="button"
      onClick={handleQuickExit}
      className="group fixed bottom-5 left-4 z-[140] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-db-rail text-white/60 shadow-lg transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-db-red/30 sm:bottom-6 sm:left-6"
      title="App sofort verlassen und temporäre Sitzungseinträge löschen"
      aria-label="App schnell verlassen und temporäre Sitzungseinträge löschen"
    >
      <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-black text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Schnell verlassen
      </span>
    </button>
  );
}
