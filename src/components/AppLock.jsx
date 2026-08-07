import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Delete, Lock, RotateCcw, ShieldCheck } from "lucide-react";

const LOCK_STORAGE_KEY = "db-peace-lock-v2";
const SESSION_UNLOCK_KEY = "db-peace-unlocked";
const PIN_LENGTH = 4;
const MAX_FAILED_ATTEMPTS = 5;
const RETRY_DELAY_MS = 10_000;

export function AppLock({ onUnlock }) {
  const existingConfig = useMemo(() => readLockConfig(), []);
  const [mode, setMode] = useState(existingConfig ? "unlock" : "setup");
  const [pin, setPin] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [phase, setPhase] = useState("pin");
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(0);
  const [clock, setClock] = useState(Date.now());

  const retrySeconds = Math.max(0, Math.ceil((blockedUntil - clock) / 1_000));
  const isBlocked = retrySeconds > 0;

  useEffect(() => {
    if (safeStorageGet("session", SESSION_UNLOCK_KEY) === "1") onUnlock();
  }, [onUnlock]);

  useEffect(() => {
    if (!blockedUntil) return undefined;
    const timer = window.setInterval(() => setClock(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [blockedUntil]);

  useEffect(() => {
    if (mode === "unlock" && pin.length === PIN_LENGTH && !isBlocked) void verifyPin();
  }, [pin, mode, isBlocked]);

  async function verifyPin() {
    const config = readLockConfig();
    if (!config || isWorking || isBlocked) return;

    setIsWorking(true);
    setError("");

    try {
      const verifier = await createVerifier(pin, config.salt);
      if (verifier === config.verifier) {
        safeStorageSet("session", SESSION_UNLOCK_KEY, "1");
        setFailedAttempts(0);
        onUnlock();
        return;
      }

      const nextAttempts = failedAttempts + 1;
      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        const nextBlockedUntil = Date.now() + RETRY_DELAY_MS;
        setFailedAttempts(0);
        setBlockedUntil(nextBlockedUntil);
        setClock(Date.now());
        setError("Zu viele Fehlversuche. Die Eingabe ist kurz gesperrt.");
      } else {
        setFailedAttempts(nextAttempts);
        setError(`PIN falsch. Noch ${MAX_FAILED_ATTEMPTS - nextAttempts} Versuche bis zur kurzen Pause.`);
      }
      setPin("");
    } catch {
      setError("Die lokale PIN-Prüfung ist in diesem Browser nicht verfügbar. Prüfe Web-Crypto- und Speicherfreigaben.");
      setPin("");
    } finally {
      setIsWorking(false);
    }
  }

  async function completeSetup() {
    if (pin.length !== PIN_LENGTH || isWorking) {
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
    setError("");

    try {
      const salt = randomBase64(16);
      const verifier = await createVerifier(pin, salt);
      const stored = safeStorageSet(
        "local",
        LOCK_STORAGE_KEY,
        JSON.stringify({ salt, verifier, version: 2, pinLength: PIN_LENGTH }),
      );

      if (!stored) {
        setError("Die PIN konnte nicht lokal gespeichert werden. Erlaube Website-Speicher oder nutze ein normales Browserfenster.");
        return;
      }

      safeStorageSet("session", SESSION_UNLOCK_KEY, "1");
      onUnlock();
    } catch {
      setError("Die lokale PIN konnte nicht erstellt werden, weil Web Crypto in diesem Browser nicht verfügbar ist.");
    } finally {
      setIsWorking(false);
    }
  }

  function pressDigit(digit) {
    if (pin.length >= PIN_LENGTH || isWorking || isBlocked) return;
    setPin((current) => current + digit);
    setError("");
  }

  function deleteDigit() {
    if (isWorking || isBlocked) return;
    setPin((current) => current.slice(0, -1));
    setError("");
  }

  function resetLock() {
    const confirmed = window.confirm(
      "Lokale Sichtschutz-PIN wirklich zurücksetzen? Dadurch erhält jede Person mit Zugriff auf diesen Browser wieder Zugang zum Prototyp.",
    );
    if (!confirmed) return;

    safeStorageRemove("local", LOCK_STORAGE_KEY);
    safeStorageRemove("session", SESSION_UNLOCK_KEY);
    setMode("setup");
    setPin("");
    setConfirmation("");
    setPhase("pin");
    setIsWorking(false);
    setFailedAttempts(0);
    setBlockedUntil(0);
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

        <div
          className="mt-7 flex min-h-6 justify-center gap-3"
          role="status"
          aria-live="polite"
          aria-label={`${pin.length} von ${PIN_LENGTH} Ziffern eingegeben`}
        >
          {Array.from({ length: PIN_LENGTH }, (_, index) => (
            <span key={index} className={`h-3.5 w-3.5 rounded-full border-2 transition ${pin.length > index ? "border-db-red bg-db-red" : "border-slate-600"}`} />
          ))}
        </div>

        {isBlocked && (
          <p role="status" className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center text-xs font-bold text-amber-100">
            Neue Eingabe in {retrySeconds} Sekunden möglich.
          </p>
        )}
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-xs font-bold text-red-200">{error}</p>}

        <div className="mx-auto mt-7 grid max-w-xs grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button key={digit} type="button" disabled={isWorking || isBlocked} onClick={() => pressDigit(String(digit))} className="h-14 rounded-full bg-slate-800 text-xl font-black transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-db-red disabled:cursor-not-allowed disabled:opacity-40">
              {digit}
            </button>
          ))}
          <div />
          <button type="button" disabled={isWorking || isBlocked} onClick={() => pressDigit("0")} className="h-14 rounded-full bg-slate-800 text-xl font-black transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-db-red disabled:cursor-not-allowed disabled:opacity-40">0</button>
          <button type="button" disabled={isWorking || isBlocked || !pin} onClick={deleteDigit} className="h-14 rounded-full text-slate-400 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-db-red disabled:cursor-not-allowed disabled:opacity-40" aria-label="Letzte Ziffer löschen">
            <Delete className="mx-auto h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {mode === "setup" && (
          <button type="button" disabled={pin.length !== PIN_LENGTH || isWorking} onClick={() => void completeSetup()} className="mt-6 w-full rounded-xl bg-db-red px-4 py-3 text-sm font-black text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-40">
            {isWorking ? "Wird geprüft …" : phase === "pin" ? "PIN übernehmen" : "PIN speichern und öffnen"}
          </button>
        )}

        {mode === "unlock" && (
          <button type="button" disabled={isWorking} onClick={resetLock} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold text-slate-500 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-db-red disabled:opacity-40">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Lokale PIN vergessen oder zurücksetzen
          </button>
        )}

        <div className="mt-7 flex items-start gap-2 rounded-xl bg-white/5 p-3 text-xs font-semibold leading-5 text-slate-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
          Die PIN wird nicht im Klartext gespeichert. Die Sperre bleibt dennoch nur ein lokaler Sichtschutz für den Prototyp.
        </div>
      </motion.main>
    </div>
  );
}

function readLockConfig() {
  try {
    const parsed = JSON.parse(safeStorageGet("local", LOCK_STORAGE_KEY) || "null");
    return parsed?.salt && parsed?.verifier && parsed?.version === 2 ? parsed : null;
  } catch {
    return null;
  }
}

async function createVerifier(pin, saltBase64) {
  if (!globalThis.crypto?.subtle) throw new Error("web_crypto_unavailable");
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: base64ToBytes(saltBase64), iterations: 150_000, hash: "SHA-256" }, keyMaterial, 256);
  return bytesToBase64(new Uint8Array(bits));
}

function randomBase64(length) {
  if (!globalThis.crypto?.getRandomValues) throw new Error("secure_random_unavailable");
  return bytesToBase64(crypto.getRandomValues(new Uint8Array(length)));
}

function safeStorageGet(type, key) {
  try {
    return (type === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(type, key, value) {
  try {
    (type === "local" ? localStorage : sessionStorage).setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeStorageRemove(type, key) {
  try {
    (type === "local" ? localStorage : sessionStorage).removeItem(key);
  } catch {
    // Der lokale Sichtschutz darf bei blockiertem Browser-Speicher nicht abstürzen.
  }
}

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}
