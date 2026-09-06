import React from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Smartphone, Users } from "lucide-react";
import { GETEILT, PERSOENLICH, geraetemodusSetzen } from "../lib/geraet.js";

/*
 * Der erste Start: eine einzige Frage, dann ist die App offen.
 *
 * Hier stand bis zum 6.9.2026 zusätzlich eine vierstellige PIN. Sie ist raus,
 * und zwar aus einem Grund, der an diesem Tag vorgeführt wurde: Arman kam in
 * seine eigene App nicht mehr hinein.
 *
 * Für eine App, die jemand in einer Krise öffnet, ist das der falsche Handel.
 * Die PIN hat den Zugang zur Oberfläche verstellt, ohne irgendetwas zu
 * verschlüsseln — wer das Gerät in der Hand hat, liest den Speicher ohnehin
 * aus. Sie versprach Schutz und lieferte eine Hürde. Wer die Telefonseelsorge
 * braucht, darf nicht an vier Ziffern scheitern, die ihm gerade nicht
 * einfallen.
 *
 * Was den Schutz tatsächlich leistet, bleibt:
 * - „Schnell verlassen" schliesst die App sofort und löscht den Chatverlauf
 * - der geteilte Gerätemodus speichert von vornherein nichts Dauerhaftes
 */
export function AppLock({ onUnlock }) {
  return (
    <Geraetewahl
      onWahl={(modus) => {
        geraetemodusSetzen(modus);
        onUnlock();
      }}
    />
  );
}

/**
 * Die einzige Frage beim allerersten Start.
 *
 * Auf einem geteilten Gerät — Werkstattrechner, Tablet im Aufenthaltsraum —
 * speichert die App nichts, was das Schliessen des Fensters überdauert. Die
 * nächste Person soll nicht lesen können, was die vorherige eingegeben hat.
 */
function Geraetewahl({ onWahl }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white selection:bg-db-red">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <div className="bg-db-red/20 p-4 rounded-full mb-6">
          <Lock className="w-12 h-12 text-db-red" />
        </div>

        <h1 className="text-2xl font-black mb-2 tracking-tight text-center">
          Wer nutzt dieses Gerät?
        </h1>
        <p className="text-slate-400 font-medium text-sm mb-8 text-center max-w-sm leading-relaxed">
          Davon hängt ab, ob die App etwas auf diesem Gerät speichern darf. Du kannst das später
          nicht versehentlich umstellen — frag im Zweifel, wem das Gerät gehört.
        </p>

        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={() => onWahl(PERSOENLICH)}
            className="w-full rounded-2xl border-2 border-white/15 bg-white/5 p-5 text-left transition hover:border-db-red hover:bg-white/10"
          >
            <span className="flex items-center gap-3">
              <Smartphone className="h-6 w-6 shrink-0 text-db-red" />
              <span className="font-black">Nur ich nutze dieses Gerät</span>
            </span>
            <span className="mt-2 block text-sm font-medium leading-relaxed text-slate-400">
              Dein persönliches Diensthandy oder dein Laptop. Deine Notizen bleiben gespeichert —
              auf diesem Gerät, unverschlüsselt.
            </span>
          </button>

          <button
            type="button"
            onClick={() => onWahl(GETEILT)}
            className="w-full rounded-2xl border-2 border-white/15 bg-white/5 p-5 text-left transition hover:border-db-red hover:bg-white/10"
          >
            <span className="flex items-center gap-3">
              <Users className="h-6 w-6 shrink-0 text-db-red" />
              <span className="font-black">Mehrere nutzen dieses Gerät</span>
            </span>
            <span className="mt-2 block text-sm font-medium leading-relaxed text-slate-400">
              Werkstatt-Tablet, Schulungsraum, Schichtgerät. Dann speichert die App nichts: Sobald
              du das Fenster schließt, ist alles weg — auch für die nächste Person. Rechte,
              Kontakte und Meldewege funktionieren weiter.
            </span>
          </button>
        </div>

        <p className="mt-8 flex items-start gap-2 text-xs font-medium leading-relaxed text-slate-500 max-w-sm">
          <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-emerald-500" />
          <span>
            Die App verschlüsselt nichts. Auf einem geteilten Gerät wäre gespeicherter
            Text deshalb ein falsches Versprechen — dort behält sie lieber gar nichts.
          </span>
        </p>
      </motion.div>
    </div>
  );
}
