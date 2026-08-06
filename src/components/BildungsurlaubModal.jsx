import React, { useMemo, useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Info,
  TentTree,
  User,
  X,
} from "lucide-react";
import { jsPDF } from "jspdf";

export function BildungsurlaubModal({ course, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", department: "", dates: "" });
  const [copyState, setCopyState] = useState("idle");

  const safeCourse = useMemo(() => ({
    title: String(course?.title || "[Kurstitel prüfen]").slice(0, 180),
    provider: String(course?.provider || "[Anbieter prüfen]").slice(0, 140),
  }), [course]);

  if (!course) return null;

  const generatedText = `Betreff: Bitte um Prüfung einer Freistellung für Weiterbildung

Sehr geehrte Damen und Herren,

ich interessiere mich für die folgende Weiterbildung und bitte um Prüfung, ob eine Freistellung, Bildungszeit oder eine andere betriebliche Unterstützung möglich ist:

Kurstitel: ${safeCourse.title}
Anbieter laut Demo-Katalog: ${safeCourse.provider}
${formData.dates ? `Geplanter Zeitraum: ${formData.dates}\n` : ""}
Bitte prüfen Sie insbesondere:
- ob das Angebot aktuell tatsächlich stattfindet,
- ob der Anbieter und die Veranstaltung die erforderliche Anerkennung besitzen,
- welche gesetzliche, tarifliche oder betriebliche Regelung in meinem Fall gilt,
- welche Fristen und Nachweise einzuhalten sind.

Ich reiche offizielle Kursbeschreibung, Termin, Kosten, Anerkennungsnachweis und Anmeldeunterlagen nach, sobald diese direkt beim Anbieter geprüft wurden.

Mit freundlichen Grüßen
${formData.name || "[Name ergänzen]"}
${formData.department ? `Bereich: ${formData.department}` : ""}`;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  function downloadPdf() {
    const doc = new jsPDF();
    doc.setFillColor(15, 118, 110);
    doc.rect(0, 0, 210, 26, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text("ANFRAGE ZUR PRÜFUNG EINER FREISTELLUNG", 15, 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(35, 35, 35);
    doc.text(doc.splitTextToSize(generatedText, 180), 15, 40);

    doc.setDrawColor(210, 210, 210);
    doc.line(15, 260, 195, 260);
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 110);
    doc.text("Erstellt mit DB Peace AI – unverbindliche Vorlage aus einem Demonstrationsprototyp.", 15, 268);
    doc.text("Kein Anerkennungsnachweis, keine Genehmigung und keine Rechtsberatung.", 15, 274);
    doc.save(`Freistellungsanfrage_${safeFileName(safeCourse.title)}.pdf`);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-db-dark/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-request-title"
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-db-dark/50 transition hover:bg-db-dark/5 hover:text-db-dark"
          aria-label="Vorlage schließen"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 pr-12">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
            <TentTree className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-teal-700">Unverbindliche Vorlage</p>
            <h2 id="leave-request-title" className="text-2xl font-black text-db-dark">Freistellung prüfen lassen</h2>
          </div>
        </div>

        <p className="mt-4 text-sm font-semibold leading-6 text-db-rail">
          Demo-Katalogeintrag: <span className="font-black text-db-dark">{safeCourse.title}</span>
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-950">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Die App prüft weder Anerkennung noch Anspruch, Bundesland, Tarifvertrag, Frist oder betriebliche Regelung.
            Der Kursdatensatz ist ungeprüft. Vor dem Versenden alle Angaben direkt beim Anbieter und bei der zuständigen Stelle bestätigen.
          </p>
        </div>

        {step === 1 ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setStep(2);
              setCopyState("idle");
            }}
            className="mt-7 space-y-6"
          >
            <div className="rounded-xl border border-db-dark/5 bg-db-soft p-4 text-xs font-semibold leading-5 text-db-rail">
              Die Angaben bleiben nur im React-Zustand dieser geöffneten Seite. Sie werden von dieser Funktion nicht an einen Server gesendet.
              Ein Browser, Gerät oder Erweiterungen können dennoch eigene Spuren hinterlassen; nutze bei sensiblen Angaben ein vertrauenswürdiges Gerät.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                icon={User}
                label="Name (optional)"
                value={formData.name}
                placeholder="Name erst vor dem Versenden ergänzen"
                onChange={(value) => setFormData((current) => ({ ...current, name: value }))}
              />
              <Field
                icon={Building2}
                label="Bereich (optional)"
                value={formData.department}
                placeholder="z. B. Instandhaltung"
                onChange={(value) => setFormData((current) => ({ ...current, department: value }))}
              />
              <div className="sm:col-span-2">
                <Field
                  icon={Calendar}
                  label="Geplanter Zeitraum (optional)"
                  value={formData.dates}
                  placeholder="z. B. 12.–14. Oktober 2026"
                  onChange={(value) => setFormData((current) => ({ ...current, dates: value }))}
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-black text-white transition hover:bg-teal-800"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Unverbindlichen Text erzeugen
            </button>
          </form>
        ) : (
          <div className="mt-7 space-y-6">
            <div className="rounded-xl border border-db-dark/10 bg-db-soft p-5">
              <pre className="whitespace-pre-wrap font-sans text-sm font-medium leading-7 text-db-dark">{generatedText}</pre>
            </div>

            {copyState === "error" && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-800">
                Automatisches Kopieren war nicht möglich. Markiere den Text manuell.
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void copyToClipboard()}
                className="flex items-center justify-center gap-2 rounded-xl border border-db-dark/10 bg-white px-5 py-3 text-sm font-black text-db-dark transition hover:border-teal-600 hover:text-teal-700"
              >
                {copyState === "copied" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copyState === "copied" ? "Kopiert" : "Text kopieren"}
              </button>
              <button
                type="button"
                onClick={downloadPdf}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                PDF-Vorlage herunterladen
              </button>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm font-semibold leading-6 text-teal-950">
              <p className="font-black">Vor dem Versenden ergänzen und prüfen:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>offizielle Kursseite und genauer Termin</li>
                <li>Anerkennungsnachweis für das zuständige Bundesland</li>
                <li>Antragsfrist und betrieblicher Prozess</li>
                <li>Kosten, Arbeitszeit und erforderliche Anlagen</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-db-dark/10 px-5 py-3 text-sm font-black text-db-dark hover:bg-db-soft"
              >
                Angaben bearbeiten
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-db-dark px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
              >
                Schließen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, onChange, placeholder, value }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-xs font-black text-db-dark">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, 160))}
        placeholder={placeholder}
        className="w-full rounded-xl border border-db-dark/15 p-3 text-sm font-semibold outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
      />
    </label>
  );
}

function safeFileName(value) {
  return value.replace(/[^a-zA-Z0-9äöüÄÖÜß-]+/g, "_").slice(0, 80);
}
