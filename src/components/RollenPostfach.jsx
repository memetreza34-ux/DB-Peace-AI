import React, { useMemo, useState } from "react";
import {
  AlarmClock,
  ArrowLeft,
  BarChart3,
  Clock,
  EyeOff,
  Info,
  Inbox,
  Lock,
  Repeat,
  Scale,
  Send,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { DEMO_FAELLE } from "../data/demoFaelle.js";
import {
  rolleFinden,
  gruppeVon,
  sichtbareFaelle,
  darf,
  weiterleitungsRegel,
  ausgeblendeteEigene,
  istMeineRolle,
} from "../lib/rolle.js";
import { aktionenFuer } from "../config/aktionen.js";
import { hinweiseFuer } from "../lib/hinweise.js";
import { musterErkennen, sperrBegruendung } from "../lib/muster.js";
import { eingangsDatum, fristenFuer, fristStand } from "../lib/fristen.js";

/**
 * Das Postfach einer Rolle — dieselbe Ansicht für JAV, Betriebsrat, HR und alle
 * anderen, nur mit anderen Fällen darin.
 *
 * Die Fälle kommen ausschließlich über sichtbareFaelle(). Diese Komponente
 * filtert nichts selbst und bekommt auch keine Gesamtliste als Prop — was eine
 * Rolle nicht sehen darf, kommt hier gar nicht erst an.
 */
export function RollenPostfach({ rolleId, onExit, onRolleWechseln }) {
  const rolle = rolleFinden(rolleId);
  const gruppe = gruppeVon(rolleId);
  const regel = weiterleitungsRegel(rolleId);
  const zeigtFristen = darf(rolleId, "fristenSetzen");

  const grundFaelle = useMemo(() => sichtbareFaelle(rolleId, DEMO_FAELLE), [rolleId]);
  // Nur die selbst gemeldeten Vorgänge werden gezählt. Fälle über die eigene
  // Person bleiben ungezählt — sonst verriete die Zahl, dass es sie gibt.
  const eigeneAusgeblendet = useMemo(() => ausgeblendeteEigene(rolleId, DEMO_FAELLE), [rolleId]);
  const eigeneRolle = istMeineRolle(rolleId);
  const aktionen = aktionenFuer(rolleId);
  const auswertung = useMemo(() => musterErkennen(grundFaelle), [grundFaelle]);
  const zeigtAuswertung = darf(rolleId, "statistik");
  const [antworten, setAntworten] = useState({});
  const [gewaehlteId, setGewaehlteId] = useState(grundFaelle[0]?.id ?? null);
  const [entwurf, setEntwurf] = useState("");
  const [weiterleitHinweis, setWeiterleitHinweis] = useState(false);

  const faelle = grundFaelle.map((fall) => ({
    ...fall,
    verlauf: [...fall.verlauf, ...(antworten[fall.id] ?? [])],
  }));
  const gewaehlt = faelle.find((fall) => fall.id === gewaehlteId) ?? null;

  if (!rolle) {
    return (
      <div className="p-8">
        <p className="font-bold text-db-dark dark:text-white">Diese Rolle gibt es nicht.</p>
        <button onClick={onExit} className="mt-4 font-black text-db-red underline">
          Zurück
        </button>
      </div>
    );
  }

  const antworten_senden = (event) => {
    event.preventDefault();
    if (!entwurf.trim() || !gewaehlt) return;
    const neu = {
      id: Date.now(),
      von: "rolle",
      text: entwurf.trim(),
      zeit: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    };
    setAntworten((aktuell) => ({
      ...aktuell,
      [gewaehlt.id]: [...(aktuell[gewaehlt.id] ?? []), neu],
    }));
    setEntwurf("");
  };

  const aktionAusfuehren = (aktion) => {
    if (!gewaehlt) return;
    const vermerk = {
      id: Date.now(),
      von: "system",
      text: `${rolle.kurz}: ${aktion.vermerk}`,
      zeit: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    };
    setAntworten((aktuell) => ({
      ...aktuell,
      [gewaehlt.id]: [...(aktuell[gewaehlt.id] ?? []), vermerk],
    }));
  };

  return (
    <div className="min-h-screen bg-db-soft dark:bg-db-dark">
      <header className="border-b border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-db-red">
                {eigeneRolle ? "Deine Rolle" : "Vorschau"} · {gruppe?.name}
              </p>
              <h1 className="mt-1 text-2xl font-black text-db-dark dark:text-white">{rolle.name}</h1>
              <p className="mt-1 max-w-2xl text-sm font-semibold text-db-rail dark:text-white/60">
                {rolle.beschreibung}
              </p>
              {(rolle.grundlage || rolle.grundlageOffen) && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-db-rail/80 dark:text-white/50">
                  <Scale className="h-3.5 w-3.5" />
                  {rolle.grundlage || rolle.grundlageOffen}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onRolleWechseln}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-db-dark/15 dark:border-white/15 px-4 py-2 text-xs font-black text-db-dark dark:text-white transition hover:border-db-red hover:text-db-red"
              >
                <Repeat className="h-4 w-4" />
                Andere Rolle
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-db-dark dark:bg-white px-4 py-2 text-xs font-black text-white dark:text-db-dark transition hover:opacity-90"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück zur Azubi-Ansicht
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 py-6">
        {/* Ohne diesen Hinweis wirkt die Ansicht wie ein echtes Meldesystem. */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm font-semibold leading-relaxed text-amber-900 dark:text-amber-200">
            Vorschau mit frei erfundenen Beispielfällen. Keine echten Meldungen, keine echten
            Personen, keine Verbindung zu DB-Systemen. Antworten, die du hier schreibst, bleiben in
            diesem Browser-Tab und erreichen niemanden.
          </p>
        </div>

        {/* Der Kern der Sache: die Trennung, und dass sie auch für Zahlen gilt. */}
        <div className="flex items-start gap-3 rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50 p-4">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-db-red" />
          <p className="text-sm font-semibold leading-relaxed text-db-rail dark:text-white/70">
            Hier stehen ausschließlich Fälle, die an <strong className="text-db-dark dark:text-white">{rolle.kurz}</strong>{" "}
            gerichtet wurden. Was an eine andere Stelle ging, ist in dieser Ansicht nicht sichtbar —
            auch nicht als Zahl und nicht in einer Auswertung.
          </p>
        </div>

        {eigeneAusgeblendet > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50 p-4">
            <UserCheck className="mt-0.5 h-5 w-5 shrink-0 text-db-red" />
            <p className="text-sm font-semibold leading-relaxed text-db-rail dark:text-white/70">
              {eigeneAusgeblendet === 1 ? "Ein Vorgang wird" : `${eigeneAusgeblendet} Vorgänge werden`} dir
              hier nicht angezeigt: {eigeneAusgeblendet === 1 ? "Du hast ihn" : "Du hast sie"} selbst
              gemeldet. Niemand bearbeitet seinen eigenen Fall.{" "}
              {eigeneAusgeblendet === 1 ? "Du findest ihn" : "Du findest sie"} in deiner Sammlung —
              zuständig ist hier jemand anderes aus dem Gremium.
            </p>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Liste */}
          <div className="lg:col-span-5 rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50 overflow-hidden">
            <div className="flex items-center justify-between border-b border-db-dark/10 dark:border-white/10 px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-black text-db-dark dark:text-white">
                <Inbox className="h-4 w-4 text-db-red" />
                Posteingang
              </h2>
              <span className="rounded-full bg-db-soft dark:bg-white/10 px-2.5 py-0.5 text-xs font-black text-db-rail dark:text-white/70">
                {faelle.length}
              </span>
            </div>

            {faelle.length === 0 ? (
              <p className="p-6 text-center text-sm font-semibold text-db-rail dark:text-white/50">
                Keine Fälle für diese Rolle.
              </p>
            ) : (
              <ul className="divide-y divide-db-dark/5 dark:divide-white/5">
                {faelle.map((fall) => (
                  <li key={fall.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setGewaehlteId(fall.id);
                        setWeiterleitHinweis(false);
                      }}
                      className={`w-full px-4 py-3.5 text-left transition ${
                        fall.id === gewaehlteId
                          ? "bg-db-red/5 border-l-4 border-db-red"
                          : "border-l-4 border-transparent hover:bg-db-soft dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-db-dark dark:text-white">
                          {fall.kategorie}
                        </span>
                        <StatusMarke status={fall.status} />
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs font-semibold text-db-rail dark:text-white/60">
                        {fall.zusammenfassung}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-db-rail/70 dark:text-white/40">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {fall.eingegangen}
                        </span>
                        {fall.anonym && (
                          <span className="flex items-center gap-1">
                            <EyeOff className="h-3 w-3" />
                            anonym
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-7 rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50">
            {!gewaehlt ? (
              <p className="p-8 text-center text-sm font-semibold text-db-rail dark:text-white/50">
                Wähle links einen Fall aus.
              </p>
            ) : (
              <div className="flex flex-col">
                <div className="border-b border-db-dark/10 dark:border-white/10 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-black text-db-dark dark:text-white">
                      {gewaehlt.kategorie}
                    </h2>
                    <StatusMarke status={gewaehlt.status} />
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-db-rail dark:text-white/70">
                    {gewaehlt.zusammenfassung}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-db-rail/70 dark:text-white/50">
                    <span>{gewaehlt.id}</span>
                    <span>·</span>
                    <span>{gewaehlt.eingegangen}</span>
                    {gewaehlt.anonym && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <EyeOff className="h-3.5 w-3.5" /> anonym eingereicht
                        </span>
                      </>
                    )}
                    {zeigtFristen && gewaehlt.frist && (
                      <>
                        <span>·</span>
                        <span className="rounded bg-db-soft dark:bg-white/10 px-2 py-0.5">
                          {gewaehlt.frist}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Hinweisleiste rolleId={rolleId} fall={gewaehlt} />

                <div className="max-h-80 space-y-3 overflow-y-auto p-5">
                  {gewaehlt.verlauf.map((eintrag) => (
                    <Nachricht key={eintrag.id} eintrag={eintrag} rolleKurz={rolle.kurz} />
                  ))}
                </div>

                {aktionen.length > 0 && (
                  <div className="border-t border-db-dark/10 dark:border-white/10 p-4">
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-db-rail dark:text-white/50">
                      Was {rolle.kurz} hier tun kann
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aktionen.map((aktion) => (
                        <button
                          key={aktion.id}
                          type="button"
                          onClick={() => aktionAusfuehren(aktion)}
                          title={aktion.beschreibung}
                          className="flex min-h-11 items-center gap-2 rounded-xl border border-db-dark/15 dark:border-white/15 bg-white dark:bg-db-dark/30 px-3.5 text-xs font-black text-db-dark dark:text-white transition hover:border-db-red hover:text-db-red"
                        >
                          <UserCheck className="h-4 w-4" />
                          {aktion.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form
                  onSubmit={antworten_senden}
                  className="border-t border-db-dark/10 dark:border-white/10 p-4 space-y-3"
                >
                  <label htmlFor="antwort" className="sr-only">
                    Antwort schreiben
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="antwort"
                      type="text"
                      value={entwurf}
                      onChange={(event) => setEntwurf(event.target.value)}
                      placeholder={
                        gewaehlt.anonym ? "Anonym zurückschreiben …" : "Antwort schreiben …"
                      }
                      className="min-h-11 flex-1 rounded-xl border border-db-dark/15 dark:border-white/15 bg-white dark:bg-db-dark/30 px-3 text-sm font-semibold text-db-dark dark:text-white"
                    />
                    <button
                      type="submit"
                      className="flex min-h-11 items-center gap-2 rounded-xl bg-db-red px-4 text-sm font-black text-white transition hover:bg-red-700"
                    >
                      <Send className="h-4 w-4" />
                      <span className="hidden sm:inline">Senden</span>
                    </button>
                  </div>

                  {regel.erlaubt && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setWeiterleitHinweis((offen) => !offen)}
                        className="flex min-h-11 items-center gap-2 text-xs font-black text-db-rail dark:text-white/60 transition hover:text-db-red"
                      >
                        <UserCheck className="h-4 w-4" />
                        An eine andere Stelle weitergeben
                      </button>
                      {weiterleitHinweis && (
                        <p className="mt-2 rounded-xl border border-db-dark/10 dark:border-white/10 bg-db-soft dark:bg-white/5 p-3 text-xs font-semibold leading-relaxed text-db-rail dark:text-white/70">
                          {regel.bedingung} Die betroffene Person wird gefragt und sieht im eigenen
                          Verlauf, was sie entschieden hat. In dieser Vorschau wird nichts
                          weitergegeben.
                        </p>
                      )}
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        {zeigtAuswertung && <Auswertung ergebnis={auswertung} rolleKurz={rolle.kurz} />}
      </div>
    </div>
  );
}

function Hinweisleiste({ rolleId, fall }) {
  const hinweise = hinweiseFuer(rolleId, fall);
  const fristen = fristenFuer(rolleId, fall);
  const eingang = eingangsDatum(fall);

  if (hinweise.length === 0 && (fristen.length === 0 || !eingang)) return null;

  return (
    <div className="space-y-2 border-t border-db-dark/10 dark:border-white/10 bg-db-soft/60 dark:bg-white/5 p-4">
      {eingang &&
        fristen.map((frist) => {
          const stand = fristStand(frist, eingang);
          const farbe =
            stand.stand === "ueberfaellig"
              ? "border-db-red/40 bg-red-50 dark:bg-red-950/20 text-db-redInk dark:text-red-300"
              : stand.stand === "knapp"
                ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300"
                : "border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/30 text-db-rail dark:text-white/70";
          return (
            <div key={frist.id} className={`flex items-start gap-2.5 rounded-xl border p-3 ${farbe}`}>
              <AlarmClock className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-xs font-black">
                  {frist.bezeichnung}: {stand.text}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold leading-relaxed opacity-80">
                  {frist.erklaerung} ({frist.grundlage})
                </p>
              </div>
            </div>
          );
        })}

      {hinweise.map((hinweis) => (
        <div
          key={hinweis.id}
          className="flex items-start gap-2.5 rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/30 p-3"
        >
          <Scale className="mt-0.5 h-4 w-4 shrink-0 text-db-red" />
          <div>
            <p className="text-xs font-black text-db-dark dark:text-white">{hinweis.titel}</p>
            <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-db-rail dark:text-white/60">
              {hinweis.text}
            </p>
            <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-db-rail/70 dark:text-white/40">
              {hinweis.grundlage} · keine Rechtsberatung
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Auswertung({ ergebnis, rolleKurz }) {
  return (
    <div className="rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50 p-5">
      <h2 className="flex items-center gap-2 text-sm font-black text-db-dark dark:text-white">
        <BarChart3 className="h-4 w-4 text-db-red" />
        Häufungen im Postfach von {rolleKurz}
      </h2>

      {ergebnis.muster.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {ergebnis.muster.map((eintrag) => (
            <li
              key={eintrag.kategorie}
              className="flex items-center justify-between rounded-xl bg-db-soft dark:bg-white/5 px-3.5 py-2.5"
            >
              <span className="text-sm font-bold text-db-dark dark:text-white">{eintrag.kategorie}</span>
              <span className="text-sm font-black text-db-red">{eintrag.anzahl} Fälle</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl border border-db-dark/10 dark:border-white/10 bg-db-soft dark:bg-white/5 p-3.5 text-xs font-semibold leading-relaxed text-db-rail dark:text-white/60">
          Hier steht nichts — und das ist Absicht. {sperrBegruendung(ergebnis.schwelle)}
        </p>
      )}
    </div>
  );
}

function StatusMarke({ status }) {
  const marken = {
    offen: { text: "offen", klasse: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300" },
    "in-bearbeitung": {
      text: "in Bearbeitung",
      klasse: "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
    },
    abgeschlossen: {
      text: "abgeschlossen",
      klasse: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
  };
  const marke = marken[status] ?? marken.offen;
  return (
    <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-black ${marke.klasse}`}>
      {marke.text}
    </span>
  );
}

function Nachricht({ eintrag, rolleKurz }) {
  if (eintrag.von === "system") {
    return (
      <p className="flex items-center justify-center gap-2 text-center text-[11px] font-bold text-db-rail/70 dark:text-white/40">
        <ShieldCheck className="h-3.5 w-3.5" />
        {eintrag.text} · {eintrag.zeit}
      </p>
    );
  }

  const vonRolle = eintrag.von === "rolle";
  return (
    <div className={`flex ${vonRolle ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
          vonRolle
            ? "bg-db-dark dark:bg-white text-white dark:text-db-dark"
            : "bg-db-soft dark:bg-white/10 text-db-dark dark:text-white"
        }`}
      >
        <p className="text-[11px] font-black uppercase tracking-wide opacity-60">
          {vonRolle ? rolleKurz : "meldende Person"}
        </p>
        <p className="mt-1 text-sm font-semibold leading-relaxed">{eintrag.text}</p>
        <p className="mt-1 text-[11px] font-bold opacity-50">{eintrag.zeit}</p>
      </div>
    </div>
  );
}
