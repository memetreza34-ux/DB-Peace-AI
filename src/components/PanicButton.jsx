import React from "react";
import { LogOut } from "lucide-react";
import { entfernen } from "../lib/speicher.js";

/**
 * Schnell raus hier.
 *
 * Diese Schaltfläche wird gedrückt, weil gerade jemand hereinkommt. Deshalb
 * reicht es nicht, die Seite zu wechseln — zwei Dinge zählen zusätzlich:
 *
 * 1. Was nur für diese Sitzung gespeichert ist, wird gelöscht. Auf einem
 *    geteilten Gerät ist das alles; auf einem persönlichen bleiben bewusst
 *    angelegte Notizen erhalten. Der Schlüssel „db-peace-chat" stammt aus der
 *    Zeit mit Chat-Assistent (bis 6.9.2026) — ältere Installationen haben ihn
 *    noch, deshalb wird er weiter entfernt.
 * 2. Der Wechsel läuft über location.replace statt href. Mit href bliebe die
 *    App im Verlauf und wäre über die Zurück-Taste sofort wieder sichtbar —
 *    genau das, was hier verhindert werden soll.
 */
export function PanicButton() {
  const sofortRaus = () => {
    try {
      entfernen("db-peace-chat");
      sessionStorage.clear();
    } catch {
      /* Speicher blockiert — dann wenigstens die Seite verlassen */
    }
    window.location.replace("https://www.google.de/search?q=wetter");
  };

  return (
    <button
      onClick={sofortRaus}
      aria-label="Schnell verlassen: schließt die App und öffnet eine Wetter-Suche"
      className="fixed bottom-6 left-6 z-[100] flex items-center justify-center w-12 h-12 bg-db-rail text-white hover:bg-slate-800 rounded-full shadow-xl ring-2 ring-white/70 dark:ring-black/40 transition-all group"
      title="Schnell verlassen"
    >
      <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />

      <span className="absolute left-full ml-4 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Schnell verlassen
      </span>
    </button>
  );
}
