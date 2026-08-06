import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Delete, Lock, RotateCcw, ShieldCheck } from "lucide-react";

const LOCK_STORAGE_KEY = "db-peace-lock-v2";
const SESSION_UNLOCK_KEY = "db-peace-unlocked";
const PIN_LENGTH = 4;

export function AppLock({ onUnlock }) {
  const existingConfig = useMemo(() => readLockConfig(), []);
  const [mode, setMode] = useState(existingConfig ? "unlock" : "setup");
  const [pin, setPin] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [phase, setPhase] = useState("pin");
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_UNLOCK_KEY) === "1") onUnlock();
  }, [onUnlock]);

  useEffect(() => {
    if (mode === "unlock" && pin.length === PIN_LENGTH) void verifyPin();
  }, [pin, mode]);

  async function verifyPin() {
    const config = readLockConfig();
    if (!config || isWorking) return;

    setIsWorking(true);
    const verifier = await createVerifier(pin, config.salt);
    if (verifier === config.verifier) {
      sessionStorage.setItem(SESSION_UNLOCK_KEY, "1");
      onUnlock();
      return;
    }

    setError("PIN falsch. Bitte erneut versuchen.");
    setPin("");
    setIsWorking(false);
  }

  async function completeSetup() {
    if (pin.length !== PIN_LENGTH) {
      setError("Die PIN muss genau vier Ziffern haben.");
      return;
    }

    if (phase === "pin") {
      setConfirmation(pin);
      setPin("");
      setPhase("confirm");
      setError("");
      return;
    }

    if (pin !== confirmation) {
      setError("Die PINs stimmen nicht überein. Bitte neu beginnen.");
      setPin("");
      setConfirmation("");
      setPhase("pin");
      return;
    }

    setIsWorking(true);
    const salt = randomBase64(16);
    const verifier = await createVerifier(pin, salt);
    localStorage.setItem(LOCK_STORAGE_KEY, JSON.stringify({ salt, verifier, version: 2, pinLength: PIN_LENGTH }));
    sessionStorage.setItem(SESSION_UNLOCK_KEY, "1");
    onUnlock();
  }

  function pressDigit(digit) {
    if (pin.length >= PIN_LENGTH || isWorking) return;
    setPin((current) => current + digit);
    setError("");
  }

  function resetLock() {
    localStorage.removeItem(LOCK_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    setMode("setup");
    setPin("");
    setConfirmation("");
    setPhase("pin");
    setIsWorking(false);
    setError("Lokale Sperre zurückgesetzt. Lege eine neue vierstellige PIN fest.");
  }

  const title = mode === "setup"
    ? phase === "pin" ? "Lokale PIN festlegen" : "PIN wiederholen"
    : "DB Peace entsperren";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white selection:bg-db-red">
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-db-red/15">
          <Lock className="h-8 w-8 text-db-red" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-center text-2xl font-black">{title}</h1>
        <p className="mt-2 text-center text-sm font-medium leading-6 text-slate-400">
          {mode === "setup"
            ? "Lege eine vierstellige PIN als lokalen Sichtschutz fest. Sie ersetzt keine Anmeldung und keine Datenverschlüsselung."
            : "Gib deine vierstellige lokale PIN ein. Nach dem Schließen des Tabs wird die Ansicht erneut gesperrt."}
        </p>

        <div className="mt-7 flex min-h-6 justify-center gap-3" aria-label={`${pin.length} von ${PIN_LENGTH} Ziffern eingegeben`}>
          {Array.from({ length: PIN_LENGTH }, (_, index) => (
            <span key={index} className={`h-3.5 w-3.5 rounded-full border-2 transition ${pin.length > index ? "border-db-red bg-db-red" : "border-slate-600"}`} />
          ))}
        </div>

        {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-xs font-bold text-red-200">{error}</p>}

        <div className="mx-auto mt-7 grid max-w-xs grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button key={digit} type="button" onClick={() => pressDigit(String(digit))} className="h-14 rounded-full bg-slate-800 text-xl font-black transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-db-red">
              {digit}
            </button>
          ))}
          <div />
          <button type="button" onClick={() => pressDigit("0")} className="h-14 rounded-full bg-slate-800 text-xl font-black hover:bg-slate-700">0</button>
          <button type="button" onClick={() => setPin((current) => current.slice(0, -1))} className="h-14 rounded-full text-slate-400 hover:bg-slate-800" aria-label="Letzte Ziffer löschen">
            <Delete className="mx-auto h-5 w-5" />
          </button>
        </div>

        {mode === "setup" && (
          <button type="button" disabled={pin.length !== PIN_LENGTH || isWorking} onClick={() => void completeSetup()} className="mt-6 w-full rounded-xl bg-db-red px-4 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">
            {phase === "pin" ? "PIN übernehmen" : "PIN speichern und öffnen"}
          </button>
        )}

        {mode === "unlock" && (
          <button type="button" onClick={resetLock} className="mt-6 flex w-full items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-white">
            <RotateCcw className="h-3.5 w-3.5" />
            Lokale PIN vergessen oder zurücksetzen
          </button>
        )}

        <div className="mt-7 flex items-start gap-2 rounded-xl bg-white/5 p-3 text-xs font-semibold leading-5 text-slate-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          Die PIN wird nicht im Klartext gespeichert. Die Sperre bleibt dennoch nur ein lokaler Sichtschutz für den Prototyp.
        </div>
      </motion.main>
    </div>
  );
}

function readLockConfig() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCK_STORAGE_KEY) || "null");
    return parsed?.salt && parsed?.verifier ? parsed : null;
  } catch {
    return null;
  }
}

async function createVerifier(pin, saltBase64) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: base64ToBytes(saltBase64), iterations: 150_000, hash: "SHA-256" }, keyMaterial, 256);
  return bytesToBase64(new Uint8Array(bits));
}

function randomBase64(length) {
  return bytesToBase64(crypto.getRandomValues(new Uint8Array(length)));
}

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}
