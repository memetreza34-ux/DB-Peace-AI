import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Delete, Smartphone, Users } from "lucide-react";
import { pinEingerichtet, pinEinrichten, pinPruefen, sperreRestMs } from "../lib/lock";
import { GETEILT, PERSOENLICH, geraetemodusSetzen, modusGewaehlt } from "../lib/geraet.js";

export function AppLock({ onUnlock }) {
  // Vor allem anderen: Gehört dieses Gerät einer Person, oder teilen es sich
  // mehrere? Davon hängt ab, ob überhaupt etwas gespeichert werden darf.
  const [modusOffen, setModusOffen] = useState(() => !modusGewaehlt());
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [meldung, setMeldung] = useState("");
  const [einrichten, setEinrichten] = useState(() => !pinEingerichtet());
  const [ersteEingabe, setErsteEingabe] = useState("");
  const [gesperrtBis, setGesperrtBis] = useState(() => sperreRestMs());

  // Countdown während einer Sperre nach zu vielen Fehlversuchen
  useEffect(() => {
    if (gesperrtBis <= 0) return;
    const t = setInterval(() => {
      const rest = sperreRestMs();
      setGesperrtBis(rest);
      if (rest <= 0) setMeldung("");
    }, 1000);
    return () => clearInterval(t);
  }, [gesperrtBis]);

  const fehlerZeigen = useCallback((text) => {
    setError(true);
    setMeldung(text);
    setTimeout(() => {
      setPin("");
      setError(false);
    }, 600);
  }, []);

  useEffect(() => {
    if (pin.length !== 4) return;

    let abgebrochen = false;

    (async () => {
      // Ersteinrichtung: PIN zweimal eingeben
      if (einrichten) {
        if (!ersteEingabe) {
          setErsteEingabe(pin);
          setPin("");
          setMeldung("");
          return;
        }
        if (ersteEingabe !== pin) {
          setErsteEingabe("");
          fehlerZeigen("Die PINs stimmen nicht überein. Bitte neu anfangen.");
          return;
        }
        await pinEinrichten(pin);
        if (!abgebrochen) onUnlock();
        return;
      }

      const ergebnis = await pinPruefen(pin);
      if (abgebrochen) return;

      if (ergebnis.ok) {
        onUnlock();
      } else if (ergebnis.grund === "gesperrt") {
        setGesperrtBis(ergebnis.restMs);
        fehlerZeigen("Zu viele Fehlversuche.");
      } else {
        fehlerZeigen(
          ergebnis.verbleibend > 0
            ? `Falsche PIN — noch ${ergebnis.verbleibend} Versuch${ergebnis.verbleibend === 1 ? "" : "e"}.`
            : "Falsche PIN."
        );
      }
    })();

    return () => {
      abgebrochen = true;
    };
  }, [pin, einrichten, ersteEingabe, onUnlock, fehlerZeigen]);

  const gesperrt = gesperrtBis > 0;

  const handleKeyPress = (num) => {
    if (gesperrt) return;
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    if (gesperrt) return;
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  // Tastatureingabe zulassen — am Rechner tippt niemand gern auf Bildschirmtasten
  useEffect(() => {
    const onKey = (e) => {
      if (gesperrt) return;
      if (/^[0-9]$/.test(e.key)) handleKeyPress(e.key);
      else if (e.key === "Backspace") handleDelete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Steht bewusst hinter allen Hooks: Ein früher Return davor würde beim
  // Wechsel von der Gerätewahl zur PIN die Zahl der Hooks ändern, und React
  // bricht dann mit „Rendered more hooks than during the previous render" ab.
  if (modusOffen) {
    return (
      <Geraetewahl
        onWahl={(modus) => {
          geraetemodusSetzen(modus);
          setModusOffen(false);
          // Auf einem geteilten Gerät bleibt nichts zurück, also gibt es auch
          // nichts zu sperren. Eine PIN wäre hier nur eine Hürde ohne Schutz.
          if (modus === GETEILT) onUnlock();
        }}
      />
    );
  }

  const titel = einrichten
    ? ersteEingabe
      ? "PIN bestätigen"
      : "PIN festlegen"
    : "DB Peace";

  const untertitel = einrichten
    ? ersteEingabe
      ? "Gib dieselbe vierstellige PIN noch einmal ein."
      : "Lege eine vierstellige PIN fest, mit der du diese App auf deinem Gerät öffnest."
    : "Dein geschützter Bereich. Bitte gib deine PIN ein.";

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

        <h1 className="text-2xl font-black mb-2 tracking-tight">{titel}</h1>
        <p className="text-slate-400 font-medium text-sm mb-8 text-center max-w-xs">{untertitel}</p>

        {/* PIN Indicators */}
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-4 mb-4"
          role="status"
          aria-label={`${pin.length} von 4 Ziffern eingegeben`}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
                pin.length > i
                  ? error
                    ? "bg-red-500 border-red-500"
                    : "bg-db-red border-db-red"
                  : "border-slate-600"
              }`}
            />
          ))}
        </motion.div>

        {/* Meldungsbereich — feste Höhe, damit das Layout nicht springt */}
        <div className="h-10 mb-4 flex items-center justify-center px-4" aria-live="polite">
          {gesperrt ? (
            <p className="text-sm font-bold text-red-400 text-center">
              Gesperrt — noch {Math.ceil(gesperrtBis / 1000)} Sekunden
            </p>
          ) : meldung ? (
            <p className={`text-sm font-medium text-center ${error ? "text-red-400" : "text-slate-300"}`}>
              {meldung}
            </p>
          ) : null}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              disabled={gesperrt}
              className="h-16 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-2xl font-bold transition flex items-center justify-center disabled:opacity-40 disabled:hover:bg-slate-800"
            >
              {num}
            </button>
          ))}
          <div className="h-16"></div>
          <button
            onClick={() => handleKeyPress("0")}
            disabled={gesperrt}
            className="h-16 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-2xl font-bold transition flex items-center justify-center disabled:opacity-40 disabled:hover:bg-slate-800"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={gesperrt}
            aria-label="Letzte Ziffer löschen"
            className="h-16 rounded-full hover:bg-slate-800 active:bg-slate-700 text-slate-400 transition flex items-center justify-center disabled:opacity-40"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-10 flex items-start gap-2 text-xs font-medium text-slate-500 max-w-xs text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-left">
            Deine Eingaben bleiben auf diesem Gerät. Die PIN wird nur als Prüfsumme gespeichert,
            nicht im Klartext.
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Die erste Frage beim allerersten Start.
 *
 * Sie steht vor der PIN, weil sie die wichtigere ist: Auf einem geteilten Gerät
 * schützt keine vierstellige PIN die Inhalte der vorherigen Person. Die App
 * speichert dort deshalb nichts, was das Schließen des Fensters überdauert.
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
              Dein persönliches Diensthandy oder dein Laptop. Deine Notizen bleiben gespeichert und
              sind mit einer PIN geschützt.
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
            Eine vierstellige PIN kann Inhalte nicht verschlüsseln. Auf einem geteilten Gerät wäre
            sie deshalb ein falsches Versprechen — dort speichert die App lieber gar nichts.
          </span>
        </p>
      </motion.div>
    </div>
  );
}
