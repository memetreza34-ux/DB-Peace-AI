import React, { useEffect, useMemo, useState } from "react";
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
import { abonnieren, alleFaelle, fallWeitergeben, verlaufErgaenzen } from "../lib/faelle.js";
import { POSTFACH_ROLLEN } from "../config/rollen.js";
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
const jetzt = () => new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

export function RollenPostfach({ rolleId, onExit, onRolleWechseln }) {
  const rolle = rolleFinden(rolleId);
  const gruppe = gruppeVon(rolleId);
  const regel = weiterleitungsRegel(rolleId);
  const zeigtFristen = darf(rolleId, "fristenSetzen");

  const [bestand, setBestand] = useState(() => alleFaelle());
  useEffect(() => abonnieren(setBestand), []);

  const grundFaelle = useMemo(() => sichtbareFaelle(rolleId, bestand), [rolleId, bestand]);
  // Nur die selbst gemeldeten Vorgänge werden gezählt. Fälle über die eigene
  // Person bleiben ungezählt — sonst verriete die Zahl, dass es sie gibt.
  const eigeneAusgeblendet = useMemo(() => ausgeblendeteEigene(rolleId, bestand), [rolleId, bestand]);
  const eigeneRolle = istMeineRolle(rolleId);
  const aktionen = aktionenFuer(rolleId);
  const auswertung = useMemo(() => musterErkennen(grundFaelle), [grundFaelle]);
  const zeigtAuswertung = darf(rolleId, "statistik");

  // Fristen laufen im Hintergrund weiter — wer erst beim Öffnen eines Falls
  // merkt, dass eine abgelaufen ist, merkt es zu spät.
  const fristenLage = useMemo(() => {
    if (!zeigtFristen) return { ueberfaellig: 0, knapp: 0 };
    let ueberfaellig = 0;
    let knapp = 0;
    for (const fall of grundFaelle) {
      if (fall.status === "abgeschlossen") continue;
      const eingang = eingangsDatum(fall);
      if (!eingang) continue;
      for (const frist of fristenFuer(rolleId, fall)) {
        const stand = fristStand(frist, eingang).stand;
        if (stand === "ueberfaellig") ueberfaellig += 1;
        else if (stand === "knapp") knapp += 1;
      }
    }
    return { ueberfaellig, knapp };
  }, [grundFaelle, rolleId, zeigtFristen]);
  const [gewaehlteId, setGewaehlteId] = useState(grundFaelle[0]?.id ?? null);
  const [entwurf, setEntwurf] = useState("");
  const [weiterleitHinweis, setWeiterleitHinweis] = useState(false);

  const faelle = grundFaelle;
  const gewaehlt = faelle.find((fall) => fall.id === gewaehlteId) ?? null;

  if (!rolle) {
    return (
      <div className="p-6">
        <p className="font-bold text-ink">Diese Rolle gibt es nicht.</p>
        <button onClick={onExit} className="mt-4 font-bold text-db-red underline">
          Zurück
        </button>
      </div>
    );
  }

  const antworten_senden = (event) => {
    event.preventDefault();
    if (!entwurf.trim() || !gewaehlt) return;
    verlaufErgaenzen(gewaehlt.id, {
      id: Date.now(),
      von: "rolle",
      text: entwurf.trim(),
      zeit: jetzt(),
    });
    setEntwurf("");
  };

  const aktionAusfuehren = (aktion) => {
    if (!gewaehlt) return;

    // Was eine andere Stelle einbezieht, geht nicht ohne die betroffene Person.
    if (aktion.brauchtZustimmung) {
      const bestaetigt = window.confirm(
        `${aktion.beschreibung}\n\nHat die meldende Person dem zugestimmt? ` +
          "Ohne ihre Zustimmung darf der Fall nicht weitergegeben werden."
      );
      if (!bestaetigt) return;
    }
    verlaufErgaenzen(gewaehlt.id, {
      id: Date.now(),
      von: "system",
      text: `${rolle.kurz}: ${aktion.vermerk}`,
      zeit: jetzt(),
    });
  };

  const weitergeben = (zielId) => {
    const ziel = POSTFACH_ROLLEN.find((eintrag) => eintrag.id === zielId);
    if (!gewaehlt || !ziel) return;

    const bestaetigt = window.confirm(
      `Fall an ${ziel.kurz} weitergeben?\n\n${regel.bedingung}\n\n` +
        "Die Weitergabe steht danach für beide Seiten im Verlauf und lässt sich nicht zurücknehmen."
    );
    if (!bestaetigt) return;

    fallWeitergeben(gewaehlt.id, rolle.kurz, ziel.id, ziel.kurz, jetzt());
    setWeiterleitHinweis(false);
    setGewaehlteId(null);
  };

  return (
    <div className="min-h-screen bg-surface-sunk ">
      <header className="border-b border-line/10 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-db-red">
                {eigeneRolle ? "Deine Rolle" : "Vorschau"} · {gruppe?.name}
              </p>
              <h1 className="mt-1 text-2xl font-bold text-ink">{rolle.name}</h1>
              <p className="mt-1 max-w-2xl text-sm font-normal text-ink-muted">
                {rolle.beschreibung}
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm font-normal text-ink-muted ">
                {(rolle.grundlage || rolle.grundlageOffen) && (
                  <span className="flex items-center gap-1.5 font-bold">
                    <Scale className="h-3.5 w-3.5" />
                    {rolle.grundlage || rolle.grundlageOffen}
                  </span>
                )}
                {rolle.themen?.length > 0 && <span>· {rolle.themen.join(" · ")}</span>}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onRolleWechseln}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-line/15 px-4 py-2 text-sm font-bold text-ink transition hover:border-db-red hover:text-db-red"
              >
                <Repeat className="h-4 w-4" />
                Andere Rolle
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-contrast  px-4 py-2 text-sm font-bold text-contrast-ink  transition hover:opacity-90"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück zur Azubi-Ansicht
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* pb-28 hält den unteren Rand frei von den schwebenden Schaltflächen
          (Quick Exit). Auf dem Handy verdeckte der Knopf sonst den letzten
          Absatz — und Dienstgeräte sind genau der Fall, für den das zählt. */}
      <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-5 py-5 pb-28 sm:pb-8">
        {/* Zwei Aussagen, die immer gelten: erfundene Fälle, und die Trennung.
            Bewusst in einer Zeile statt in zwei Absätzen — davor stehen im
            Ernstfall noch Fristenwarnung und Befangenheitshinweis. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-line/10 bg-surface px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
            <Info className="h-4 w-4 shrink-0" />
            Erfundene Beispielfälle — nichts davon erreicht jemanden
          </span>
          <span className="flex items-center gap-2 text-sm font-medium text-ink-muted">
            <Lock className="h-4 w-4 shrink-0 text-db-red" />
            Nur Fälle an {rolle.kurz}. Andere Stellen sind hier unsichtbar, auch als Zahl
          </span>
        </div>

        {(fristenLage.ueberfaellig > 0 || fristenLage.knapp > 0) && (
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              fristenLage.ueberfaellig > 0
                ? "border-db-red/40 bg-red-50 dark:bg-red-950/20"
                : "border-amber-300 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20"
            }`}
          >
            <AlarmClock
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                fristenLage.ueberfaellig > 0 ? "text-db-red" : "text-amber-600 dark:text-amber-400"
              }`}
            />
            <p
              className={`text-sm font-semibold leading-relaxed ${
                fristenLage.ueberfaellig > 0
                  ? "text-db-redInk dark:text-red-300"
                  : "text-amber-900 dark:text-amber-200"
              }`}
            >
              {fristenLage.ueberfaellig > 0 && (
                <>
                  <strong>
                    {fristenLage.ueberfaellig === 1
                      ? "Eine Frist ist abgelaufen"
                      : `${fristenLage.ueberfaellig} Fristen sind abgelaufen`}
                    .
                  </strong>{" "}
                  Die meldende Person sieht das ebenfalls.{" "}
                </>
              )}
              {fristenLage.knapp > 0 && (
                <>
                  {fristenLage.knapp === 1
                    ? "Eine weitere Frist läuft in den nächsten Tagen ab."
                    : `${fristenLage.knapp} weitere Fristen laufen in den nächsten Tagen ab.`}
                </>
              )}
            </p>
          </div>
        )}

        {eigeneAusgeblendet > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-line/10 bg-surface p-4">
            <UserCheck className="mt-0.5 h-5 w-5 shrink-0 text-db-red" />
            <p className="text-sm font-normal leading-relaxed text-ink-muted">
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
          <div className="lg:col-span-5 rounded-xl border border-line/10 bg-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-line/10 px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
                <Inbox className="h-4 w-4 text-db-red" />
                Posteingang
              </h2>
              <span className="rounded-full bg-surface-sunk  px-2.5 py-0.5 text-sm font-medium text-ink-muted">
                {faelle.length}
              </span>
            </div>

            {faelle.length === 0 ? (
              <p className="p-5 text-center text-sm font-normal text-ink-muted ">
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
                        <span className="text-sm font-bold text-ink">
                          {fall.kategorie}
                        </span>
                        <StatusMarke status={fall.status} />
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm font-normal text-ink-muted">
                        {fall.zusammenfassung}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-ink-muted ">
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
          <div className="lg:col-span-7 rounded-xl border border-line/10 bg-surface">
            {!gewaehlt ? (
              <p className="p-6 text-center text-sm font-normal text-ink-muted ">
                Wähle links einen Fall aus.
              </p>
            ) : (
              <div className="flex flex-col">
                <div className="border-b border-line/10 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-bold text-ink">
                      {gewaehlt.kategorie}
                    </h2>
                    <StatusMarke status={gewaehlt.status} />
                  </div>
                  <p className="mt-2 text-sm font-normal leading-relaxed text-ink-muted">
                    {gewaehlt.zusammenfassung}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium text-db-rail/70 dark:text-white/50">
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
                        <span className="rounded bg-surface-sunk  px-2 py-0.5">
                          {gewaehlt.frist}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {gewaehlt.status === "abgeschlossen" && (
                  <p className="border-t border-line/10 bg-surface-sunk  px-5 py-3 text-sm font-normal leading-relaxed text-ink-muted">
                    Abgeschlossen. Wie lange ein abgeschlossener Vorgang sichtbar bleibt und wer
                    ihn löscht, ist vor einem Pilotbetrieb zu klären — die App legt das nicht
                    eigenmächtig fest.
                  </p>
                )}

                <Hinweisleiste rolleId={rolleId} fall={gewaehlt} />

                <div className="max-h-80 space-y-3 overflow-y-auto p-5">
                  {gewaehlt.verlauf.map((eintrag) => (
                    <Nachricht key={eintrag.id} eintrag={eintrag} rolleKurz={rolle.kurz} />
                  ))}
                </div>

                {aktionen.length > 0 && (
                  <div className="border-t border-line/10 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted ">
                      Was {rolle.kurz} hier tun kann
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aktionen.map((aktion) => (
                        <button
                          key={aktion.id}
                          type="button"
                          onClick={() => aktionAusfuehren(aktion)}
                          title={aktion.beschreibung}
                          className="flex min-h-11 items-center gap-2 rounded-xl border border-line/15 bg-surface px-3.5 text-sm font-bold text-ink transition hover:border-db-red hover:text-db-red"
                        >
                          <UserCheck className="h-4 w-4" />
                          {aktion.label}
                          {aktion.grundlage && (
                            <span className="font-medium text-ink-muted ">
                              {aktion.grundlage}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form
                  onSubmit={antworten_senden}
                  className="border-t border-line/10 p-4 space-y-3"
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
                      className="min-h-11 flex-1 rounded-xl border border-line/15 bg-surface px-3 text-sm font-semibold text-ink"
                    />
                    <button
                      type="submit"
                      className="flex min-h-11 items-center gap-2 rounded-xl bg-db-red px-4 text-sm font-bold text-white transition hover:bg-red-700"
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
                        className="flex min-h-11 items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-db-red"
                      >
                        <UserCheck className="h-4 w-4" />
                        An eine andere Stelle weitergeben
                      </button>
                      {weiterleitHinweis && (
                        <div className="mt-2 rounded-xl border border-line/10 bg-surface-sunk p-3">
                          <p className="text-sm font-normal leading-relaxed text-ink-muted">
                            {regel.bedingung} Die Weitergabe steht danach für beide Seiten im
                            Verlauf — der Fall verschwindet aus diesem Postfach und liegt bei der
                            gewählten Stelle.
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {POSTFACH_ROLLEN.filter((ziel) => ziel.id !== rolleId).map((ziel) => (
                              <button
                                key={ziel.id}
                                type="button"
                                onClick={() => weitergeben(ziel.id)}
                                className="min-h-11 rounded-lg border border-line/15 bg-surface px-3 text-sm font-bold text-ink transition hover:border-db-red hover:text-db-red"
                              >
                                {ziel.kurz}
                              </button>
                            ))}
                          </div>
                        </div>
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
    <div className="space-y-2 border-t border-line/10 bg-surface-sunk  p-4">
      {eingang &&
        fristen.map((frist) => {
          const stand = fristStand(frist, eingang);
          const farbe =
            stand.stand === "ueberfaellig"
              ? "border-db-red/40 bg-red-50 dark:bg-red-950/20 text-db-redInk dark:text-red-300"
              : stand.stand === "knapp"
                ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300"
                : "border-line/10 bg-surface text-ink-muted";
          return (
            <div key={frist.id} className={`flex items-start gap-2.5 rounded-xl border p-3 ${farbe}`}>
              <AlarmClock className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-bold">
                  {frist.bezeichnung}: {stand.text}
                </p>
                <p className="mt-0.5 text-sm font-semibold leading-relaxed opacity-80">
                  {frist.erklaerung} ({frist.grundlage})
                </p>
              </div>
            </div>
          );
        })}

      {hinweise.map((hinweis) => (
        <div
          key={hinweis.id}
          className="flex items-start gap-2.5 rounded-xl border border-line/10 bg-surface p-3"
        >
          <Scale className="mt-0.5 h-4 w-4 shrink-0 text-db-red" />
          <div>
            <p className="text-sm font-bold text-ink">{hinweis.titel}</p>
            <p className="mt-0.5 text-sm font-normal leading-relaxed text-ink-muted">
              {hinweis.text}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink-muted ">
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
    <div className="rounded-xl border border-line/10 bg-surface p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
        <BarChart3 className="h-4 w-4 text-db-red" />
        Häufungen im Postfach von {rolleKurz}
      </h2>

      {ergebnis.muster.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {ergebnis.muster.map((eintrag) => (
            <li
              key={eintrag.kategorie}
              className="flex items-center justify-between rounded-xl bg-surface-sunk px-3.5 py-2.5"
            >
              <span className="text-sm font-bold text-ink">{eintrag.kategorie}</span>
              <span className="text-sm font-bold text-db-red">{eintrag.anzahl} Fälle</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl border border-line/10 bg-surface-sunk p-3.5 text-sm font-normal leading-relaxed text-ink-muted">
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
    <span className={`shrink-0 rounded px-2 py-0.5 text-sm font-bold ${marke.klasse}`}>
      {marke.text}
    </span>
  );
}

function Nachricht({ eintrag, rolleKurz }) {
  if (eintrag.von === "system") {
    return (
      <p className="flex items-center justify-center gap-2 text-center text-sm font-medium text-ink-muted ">
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
            ? "bg-contrast  text-contrast-ink "
            : "bg-surface-sunk  text-ink"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-wide opacity-60">
          {vonRolle ? rolleKurz : "meldende Person"}
        </p>
        <p className="mt-1 text-sm font-semibold leading-relaxed">{eintrag.text}</p>
        <p className="mt-1 text-sm font-bold opacity-50">{eintrag.zeit}</p>
      </div>
    </div>
  );
}
