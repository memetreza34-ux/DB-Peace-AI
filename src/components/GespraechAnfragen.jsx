import React, { useState } from "react";
import { MessageCircle, X, CheckCircle2 } from "lucide-react";
import { useDialog } from "../lib/useDialog";
import { rolleFinden } from "../lib/rolle.js";

/*
 * Der kurze Weg: „Ich will mit jemandem reden."
 *
 * Der Melde-Assistent hat fünf Schritte und erzeugt einen Vorgang. Das ist
 * richtig für eine Meldung — und zu viel für jemanden, der erst einmal nur
 * fragen möchte, ob er sich das einbildet. Hier reichen zwei Felder.
 *
 * Der Wunsch landet im selben Postfach, aber als eigene Art gekennzeichnet:
 * die Rolle sieht sofort, dass ein Gespräch gesucht wird und keine
 * Bearbeitung erwartet wird.
 */
export function GespraechAnfragen({ rolleId, personName, onClose }) {
  const dialogRef = useDialog(Boolean(rolleId), onClose);
  const [anliegen, setAnliegen] = useState("");
  const [anonym, setAnonym] = useState(true);
  const [name, setName] = useState("");
  const [gesendet, setGesendet] = useState(null);
  const [fehler, setFehler] = useState("");
  const [sendet, setSendet] = useState(false);

  if (!rolleId) return null;
  const rolle = rolleFinden(rolleId);

  const absenden = async (event) => {
    event.preventDefault();
    if (!anliegen.trim() || sendet) return;
    setSendet(true);
    setFehler("");
    try {
      const antwort = await fetch("/api/meldungen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empfaenger: rolleId,
          kategorie: "Gesprächswunsch",
          art: "gespraech",
          anonym,
          inhalt: {
            anliegen: anliegen.trim(),
            ...(anonym ? {} : { absender: name.trim() }),
            ...(personName ? { gewuenschtePerson: personName } : {}),
          },
        }),
      });
      if (!antwort.ok) throw new Error(String(antwort.status));
      setGesendet(await antwort.json());
    } catch {
      setFehler(
        "Die Anfrage konnte nicht abgelegt werden. Läuft der lokale Server? Du erreichst die Stelle auch direkt über die Sprechstunde.",
      );
    } finally {
      setSendet(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-db-dark/60 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gespraech-titel"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg outline-none dark:bg-db-dark"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Dialog schließen"
          className="absolute right-4 top-4 flex min-h-11 min-w-11 items-center justify-center rounded-full text-db-dark/50 transition hover:bg-db-dark/5 dark:text-white/50"
        >
          <X className="h-6 w-6" />
        </button>

        {gesendet ? (
          <div>
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            <h2 id="gespraech-titel" className="mt-3 text-2xl font-black text-db-dark dark:text-white">
              Anfrage ist angekommen
            </h2>
            <p className="mt-3 font-semibold leading-relaxed text-db-rail dark:text-white/70">
              {rolle?.kurz ?? rolleId} sieht deinen Gesprächswunsch im Postfach. Kennzeichen{" "}
              <span className="font-black text-db-dark dark:text-white">{gesendet.id}</span>.
            </p>
            <p className="mt-3 text-xs font-bold leading-relaxed text-db-rail dark:text-white/50">
              Abgelegt auf diesem Rechner, unverschlüsselt. Nichts geht ins Internet oder erreicht
              jemanden bei der Deutschen Bahn.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-db-dark px-5 font-black text-white transition hover:bg-db-red dark:bg-white dark:text-db-dark"
            >
              Schließen
            </button>
          </div>
        ) : (
          <form onSubmit={absenden}>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-db-red/10 p-3 text-db-red">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h2 id="gespraech-titel" className="text-2xl font-black text-db-dark dark:text-white">
                Gespräch anfragen
              </h2>
            </div>
            <p className="mt-3 font-semibold leading-relaxed text-db-rail dark:text-white/70">
              Bei {personName ? `${personName} (${rolle?.kurz ?? rolleId})` : (rolle?.kurz ?? rolleId)}.
              Du musst nichts melden und nichts beweisen — es reicht, dass dich etwas beschäftigt.
            </p>

            <label className="mt-5 block text-sm font-black text-db-dark dark:text-white">
              Worum geht es ungefähr?
              <textarea
                value={anliegen}
                onChange={(event) => setAnliegen(event.target.value)}
                rows={4}
                required
                placeholder="Ein, zwei Sätze reichen. Keine Namen nötig."
                className="mt-2 w-full rounded-xl border border-db-dark/15 bg-white p-3 text-base font-medium text-db-dark placeholder:text-db-rail/60 focus:border-db-red focus:outline-none focus:ring-2 focus:ring-db-red/20 dark:border-white/15 dark:bg-db-dark/50 dark:text-white"
              />
            </label>

            <label className="mt-4 flex items-start gap-3 rounded-xl border border-db-dark/10 bg-db-soft p-4 dark:border-white/10 dark:bg-white/5">
              <input
                type="checkbox"
                checked={anonym}
                onChange={(event) => setAnonym(event.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-db-red"
              />
              <span className="text-sm font-bold leading-relaxed text-db-dark dark:text-white">
                Anonym bleiben
                <span className="mt-1 block font-semibold text-db-rail dark:text-white/60">
                  Ohne Namen kann die Stelle dich nicht von sich aus erreichen — du fragst später
                  selbst nach, mit dem Kennzeichen.
                </span>
              </span>
            </label>

            {!anonym && (
              <label className="mt-4 block text-sm font-black text-db-dark dark:text-white">
                Dein Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="damit die Stelle dich ansprechen kann"
                  className="mt-2 w-full rounded-xl border border-db-dark/15 bg-white p-3 text-base font-medium text-db-dark placeholder:text-db-rail/60 focus:border-db-red focus:outline-none focus:ring-2 focus:ring-db-red/20 dark:border-white/15 dark:bg-db-dark/50 dark:text-white"
                />
              </label>
            )}

            {fehler && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                {fehler}
              </p>
            )}

            <button
              type="submit"
              disabled={!anliegen.trim() || sendet}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-db-red px-5 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {sendet ? "Wird abgelegt …" : "Anfrage abschicken"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
