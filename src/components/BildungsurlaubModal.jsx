import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useModalDialog } from "../hooks/useModalDialog.js";

const emptyForm = { name: "", department: "", dates: "" };

export function BildungsurlaubModal({ course, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(emptyForm);
  const [copyState, setCopyState] = useState("idle");
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const resultHeadingRef = useRef(null);
  const isOpen = Boolean(course);

  useModalDialog({ isOpen, onClose: closeModal, dialogRef, initialFocusRef: closeButtonRef });

  const safeCourse = useMemo(() => ({
    title: String(course?.title || "[Kurstitel prüfen]").slice(0, 180),
    provider: String(course?.provider || "[Anbieter prüfen]").slice(0, 140),
  }), [course]);

  const generatedText = useMemo(() => createRequestText(safeCourse, formData), [safeCourse, formData]);

  useEffect(() => {
    if (!course) return;
    setStep(1);
    setFormData(emptyForm);
    setCopyState("idle");
    setError("");
  }, [course]);

  useEffect(() => {
    if (step === 2) window.requestAnimationFrame(() => resultHeadingRef.current?.focus());
  }, [step]);

  if (!course) return null;

  function closeModal() {
    setStep(1);
    setFormData(emptyForm);
    setCopyState("idle");
    setError("");
    onClose();
  }

  async function copyToClipboard() {
    try {
      await copyText(generatedText);
      setCopyState("copied");
      setError("");
    } catch {
      setCopyState("error");
      setError("Automatisches Kopieren war nicht möglich. Markiere den Text manuell oder nutze den PDF-Export.");
    }
  }

  function downloadPdf() {
    try {
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
      const lines = doc.splitTextToSize(generatedText, 180);
      let y = 40;
      for (const line of lines) {
        if (y > 272) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += 5.4;
      }

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setDrawColor(210, 210, 210);
      doc.line(15, y + 4, 195, y + 4);
      doc.setFontSize(8.5);
      doc.setTextColor(110, 110, 110);
      doc.text("Unverbindliche Vorlage aus einem Demonstrationsprototyp.", 15, y + 12);
      doc.text("Kein Anerkennungsnachweis, keine Genehmigung und keine Rechtsberatung.", 15, y + 18);
      doc.save(`Freistellungsanfrage_${safeFileName(safeCourse.title)}.pdf`);
      setError("");
    } catch {
      setError("Der PDF-Export ist fehlgeschlagen. Kopiere den Text oder versuche es erneut.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-db-dark/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-request-title"
        aria-describedby="leave-request-description"
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl outline-none sm:p-8"
      >
        <button ref={closeButtonRef} type="button" onClick={closeModal} className="absolute right-5 top-5 rounded-full p-2 text-db-dark/50 transition hover:bg-db-dark/5 hover:text-db-dark focus:outline-none focus:ring-2 focus:ring-teal-600/30" aria-label="Vorlage schließen">
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

        <p id="leave-request-description" className="mt-4 text-sm font-semibold leading-6 text-db-rail">
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
          <form onSubmit={(event) => { event.preventDefault(); setStep(2); setCopyState("idle"); setError(""); }} className="mt-7 space-y-6">
            <div className="rounded-xl border border-db-dark/5 bg-db-soft p-4 text-xs font-semibold leading-5 text-db-rail">
              Die Angaben bleiben nur im React-Zustand dieser geöffneten Seite. Sie werden von dieser Funktion nicht an einen Server gesendet.
              Ein Browser, Gerät oder Erweiterungen können dennoch eigene Spuren hinterlassen; nutze bei sensiblen Angaben ein vertrauenswürdiges Gerät.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field icon={User} label="Name (optional)" value={formData.name} placeholder="Name erst vor dem Versenden ergänzen" onChange={(value) => updateForm("name", value)} />
              <Field icon={Building2} label="Bereich (optional)" value={formData.department} placeholder="z. B. Instandhaltung" onChange={(value) => updateForm("department", value)} />
              <div className="sm:col-span-2">
                <Field icon={Calendar} label="Geplanter Zeitraum (optional)" value={formData.dates} placeholder="z. B. 12.–14. Oktober 2026" onChange={(value) => updateForm("dates", value)} />
              </div>
            </div>

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-black text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Unverbindlichen Text erzeugen
            </button>
          </form>
        ) : (
          <div className="mt-7 space-y-6">
            <h3 ref={resultHeadingRef} tabIndex={-1} className="text-lg font-black text-db-dark outline-none">Erstellte Vorlage prüfen</h3>
            <div className="rounded-xl border border-db-dark/10 bg-db-soft p-5">
              <pre className="whitespace-pre-wrap break-words font-sans text-sm font-medium leading-7 text-db-dark">{generatedText}</pre>
            </div>

            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-800">{error}</p>}

            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => void copyToClipboard()} className="flex items-center justify-center gap-2 rounded-xl border border-db-dark/10 bg-white px-5 py-3 text-sm font-black text-db-dark transition hover:border-teal-600 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600/30">
                {copyState === "copied" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copyState === "copied" ? "Kopiert" : "Text kopieren"}
              </button>
              <button type="button" onClick={downloadPdf} className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30">
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
              <button type="button" onClick={() => { setStep(1); setCopyState("idle"); setError(""); }} className="rounded-xl border border-db-dark/10 px-5 py-3 text-sm font-black text-db-dark hover:bg-db-soft focus:outline-none focus:ring-2 focus:ring-teal-600/30">Angaben bearbeiten</button>
              <button type="button" onClick={closeModal} className="rounded-xl bg-db-dark px-5 py-3 text-sm font-black text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30">Schließen</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function updateForm(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
    setCopyState("idle");
    setError("");
  }
}

function Field({ icon: Icon, label, onChange, placeholder, value }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-xs font-black text-db-dark">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </span>
      <input type="text" value={value} onChange={(event) => onChange(event.target.value.slice(0, 160))} maxLength={160} placeholder={placeholder} className="w-full rounded-xl border border-db-dark/15 p-3 text-sm font-semibold outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15" />
    </label>
  );
}

function createRequestText(course, formData) {
  return `Betreff: Bitte um Prüfung einer Freistellung für Weiterbildung

Sehr geehrte Damen und Herren,

ich interessiere mich für die folgende Weiterbildung und bitte um Prüfung, ob eine Freistellung, Bildungszeit oder eine andere betriebliche Unterstützung möglich ist:

Kurstitel: ${course.title}
Anbieter laut Demo-Katalog: ${course.provider}
${formData.dates ? `Geplanter Zeitraum: ${formData.dates}\n` : ""}
Bitte prüfen Sie insbesondere:
- ob das Angebot aktuell tatsächlich stattfindet,
- ob Anbieter und Veranstaltung die erforderliche Anerkennung besitzen,
- welche gesetzliche, tarifliche oder betriebliche Regelung in meinem Fall gilt,
- welche Fristen und Nachweise einzuhalten sind.

Ich reiche offizielle Kursbeschreibung, Termin, Kosten, Anerkennungsnachweis und Anmeldeunterlagen nach, sobald diese direkt beim Anbieter geprüft wurden.

Mit freundlichen Grüßen
${formData.name || "[Name ergänzen]"}
${formData.department ? `Bereich: ${formData.department}` : ""}`;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("copy_failed");
}

function safeFileName(value) {
  return value.replace(/[^a-zA-Z0-9äöüÄÖÜß-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80) || "Weiterbildung";
}
