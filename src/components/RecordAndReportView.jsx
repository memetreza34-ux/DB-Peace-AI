import React, { useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  Bot,
  Clock,
  Download,
  FileText,
  Megaphone,
  NotebookPen,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useModalDialog } from "../hooks/useModalDialog.js";
import { AISmartReport } from "./AISmartReport.jsx";
import AnonymousReport from "./AnonymousReport.jsx";

const emptyEntry = {
  date: "",
  time: "",
  location: "",
  description: "",
  witnesses: "",
};

export function RecordAndReportView() {
  const [subTab, setSubTab] = useState(null);
  const [records, setRecords] = useState([]);
  const [draft, setDraft] = useState(emptyEntry);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState("");
  const [exportError, setExportError] = useState("");

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function openForm() {
    setDraft(emptyEntry);
    setError("");
    setShowForm(true);
  }

  function cancelForm() {
    setDraft(emptyEntry);
    setError("");
    setShowForm(false);
  }

  function addRecord(event) {
    event.preventDefault();
    const description = draft.description.trim();
    if (description.length < 20) {
      setError("Beschreibe den Vorfall mit mindestens 20 Zeichen.");
      return;
    }

    const entry = {
      id: createRecordId(),
      date: draft.date || "Nicht angegeben",
      time: draft.time || "Nicht angegeben",
      location: draft.location.trim() || "Nicht angegeben",
      description,
      witnesses: draft.witnesses.trim() || "Nicht angegeben",
      source: "Manuell erstellt",
    };

    setRecords((current) => [entry, ...current]);
    cancelForm();
  }

  function addAiRecord(report) {
    const sourceMode = report.sourceMode === "ai" ? "ai" : "local";
    const entry = {
      id: createRecordId(),
      date: report.date || "Nicht angegeben",
      time: report.time || "Nicht angegeben",
      location: report.location || "Nicht angegeben",
      description: report.description,
      witnesses: report.witnesses || "Nicht angegeben",
      category: report.category,
      urgency: report.urgency,
      source: sourceMode === "ai" ? "Gemini-strukturierter Entwurf · ungeprüft" : "Lokaler Schlüsselwort-Fallback",
    };

    setRecords((current) => [entry, ...current]);
    setSubTab("protocol");
    setExportError("");
    setSelectedRecord(entry);
  }

  function selectRecord(record) {
    setExportError("");
    setSelectedRecord(record);
  }

  function deleteRecord(id) {
    setRecords((current) => current.filter((record) => record.id !== id));
    if (selectedRecord?.id === id) setSelectedRecord(null);
    setExportError("");
  }

  function exportRecord(record) {
    setExportError("");
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(226, 0, 26);
      doc.text("DB Peace – Gedächtnisprotokoll", 18, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(90, 90, 90);
      doc.text("Lokaler Demonstrationsentwurf – nicht automatisch gespeichert oder übermittelt", 18, 30);

      const content = [
        `Datum: ${record.date}`,
        `Uhrzeit: ${record.time}`,
        `Ort / Kontext: ${record.location}`,
        `Mögliche Zeug:innen: ${record.witnesses}`,
        `Quelle: ${record.source}`,
        record.category ? `Kategorie: ${record.category}` : null,
        record.urgency ? `Dringlichkeitsorientierung: ${record.urgency}` : null,
        "",
        "Sachverhalt:",
        record.description,
        "",
        "Hinweis: Vor Verwendung auf Richtigkeit prüfen. Menschen entscheiden über weitere Schritte.",
      ].filter(Boolean).join("\n");

      const lines = doc.splitTextToSize(content, 174);
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      let y = 43;
      for (const line of lines) {
        if (y > 278) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 18, y);
        y += 5.5;
      }
      doc.save(`DB-Peace-Protokoll-${safeFileSegment(record.date)}-${record.id.slice(0, 8)}.pdf`);
    } catch {
      setExportError("Das Gedächtnisprotokoll konnte nicht als PDF erzeugt werden. Der Sitzungsentwurf wurde nicht verändert.");
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-xl bg-gradient-to-r from-db-dark to-db-rail p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-db-warm">
          <NotebookPen className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          Festhalten und vorbereiten
        </div>
        <h1 className="mt-3 text-3xl font-black">Gedächtnisprotokoll und Meldungsentwurf</h1>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/75">
          Halte Fakten im aktuellen App-Zustand fest oder erstelle einen exportierbaren Entwurf. Nichts wird automatisch an DB, HR, JAV oder andere Stellen übertragen.
        </p>
      </header>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200">
        Die Protokolle bleiben nur im Arbeitsspeicher dieser geöffneten App. Bei Neuladen oder Schließen können sie verloren gehen. Exportiere wichtige Entwürfe als PDF und speichere sie anschließend an einem geeigneten sicheren Ort.
      </div>

      {exportError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800 dark:border-red-900/50 dark:bg-red-950/25 dark:text-red-300">
          {exportError}
        </p>
      )}

      {!subTab ? (
        <Selection onSelect={setSubTab} recordCount={records.length} />
      ) : (
        <>
          <button type="button" onClick={() => setSubTab(null)} className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-black text-db-rail hover:bg-db-soft hover:text-db-red focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:text-white/60 dark:hover:bg-white/5">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zur Auswahl
          </button>

          {subTab === "protocol" && (
            <ProtocolView
              records={records}
              draft={draft}
              error={error}
              showForm={showForm}
              onOpenForm={openForm}
              onCancelForm={cancelForm}
              onUpdate={updateDraft}
              onSubmit={addRecord}
              onSelect={selectRecord}
              onDelete={deleteRecord}
              onExport={exportRecord}
            />
          )}
          {subTab === "report" && <AnonymousReport />}
          {subTab === "ai" && <AISmartReport onReportGenerated={addAiRecord} />}
        </>
      )}

      {selectedRecord && (
        <RecordModal
          record={selectedRecord}
          exportError={exportError}
          onClose={() => {
            setExportError("");
            setSelectedRecord(null);
          }}
          onDelete={deleteRecord}
          onExport={exportRecord}
        />
      )}
    </div>
  );
}

function Selection({ onSelect, recordCount }) {
  const cards = [
    {
      id: "protocol",
      title: "Vorfall festhalten",
      text: "Sachliches Gedächtnisprotokoll im aktuellen App-Zustand erstellen.",
      icon: NotebookPen,
      accent: "text-amber-600 bg-amber-500/10",
      badge: recordCount ? `${recordCount} Entwurf${recordCount === 1 ? "" : "e"}` : null,
    },
    {
      id: "report",
      title: "Meldungsentwurf verfassen",
      text: "Vorfall in fünf Schritten strukturieren und als PDF exportieren.",
      icon: Megaphone,
      accent: "text-db-red bg-db-red/10",
    },
    {
      id: "ai",
      title: "Text mit KI strukturieren",
      text: "Freitext über den lokalen Gemini-Proxy in Felder aufteilen lassen.",
      icon: Bot,
      accent: "text-violet-700 bg-violet-500/10",
    },
  ];

  return (
    <section>
      <h2 className="text-center text-2xl font-black text-db-dark dark:text-white">Was möchtest du tun?</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map(({ id, title, text, icon: Icon, accent, badge }) => (
          <button key={id} type="button" onClick={() => onSelect(id)} className="group rounded-xl border border-db-dark/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-db-red/40 focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/10 dark:bg-db-dark/50">
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}><Icon className="h-5 w-5" aria-hidden="true" /></div>
              {badge && <span className="rounded-full bg-db-soft px-2.5 py-1 text-[10px] font-black text-db-rail dark:bg-white/10 dark:text-white/60">{badge}</span>}
            </div>
            <h3 className="mt-4 text-lg font-black text-db-dark group-hover:text-db-red dark:text-white">{title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-db-rail dark:text-white/60">{text}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProtocolView({ records, draft, error, showForm, onOpenForm, onCancelForm, onUpdate, onSubmit, onSelect, onDelete, onExport }) {
  return (
    <section className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-db-dark/50 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-db-dark/10 pb-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-db-dark dark:text-white">Private Entwürfe dieser Sitzung</h2>
          <p className="mt-1 text-xs font-semibold text-db-rail dark:text-white/60">Keine Datenbank, keine Cloud und keine automatische Synchronisation.</p>
        </div>
        <button type="button" onClick={showForm ? onCancelForm : onOpenForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-db-red px-4 py-2.5 text-sm font-black text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-db-red/30">
          {showForm ? <X className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
          {showForm ? "Formular schließen" : "Eintrag hinzufügen"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="mt-5 space-y-4 rounded-xl border border-db-dark/10 bg-db-soft p-4 dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Datum optional" type="date" value={draft.date} onChange={(value) => onUpdate("date", value)} />
            <Input label="Uhrzeit optional" type="time" value={draft.time} onChange={(value) => onUpdate("time", value)} />
            <Input label="Ort / Kontext optional" value={draft.location} maxLength={180} placeholder="Ohne Klarnamen" onChange={(value) => onUpdate("location", value)} />
          </div>
          <Input label="Mögliche Zeug:innen optional" value={draft.witnesses} maxLength={300} placeholder="z. B. zwei Kolleg:innen – keine Klarnamen" onChange={(value) => onUpdate("witnesses", value)} />
          <label className="block">
            <span className="text-sm font-black text-db-dark dark:text-white">Sachliche Beschreibung</span>
            <textarea value={draft.description} onChange={(event) => onUpdate("description", event.target.value.slice(0, 3_000))} maxLength={3_000} rows={6} className="mt-2 w-full rounded-xl border border-db-dark/15 bg-white p-3 text-sm font-medium leading-6 text-db-dark outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/20 dark:border-white/15 dark:bg-db-dark/40 dark:text-white" placeholder="Was wurde gesagt oder getan? Was hast du selbst beobachtet?" />
            <span className="mt-1 block text-right text-[10px] font-bold text-db-rail/60 dark:text-white/40">{draft.description.length}/3000</span>
          </label>
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onCancelForm} className="rounded-xl border border-db-dark/15 px-4 py-2.5 text-sm font-black text-db-dark focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/15 dark:text-white">Abbrechen</button>
            <button type="submit" className="rounded-xl bg-db-dark px-5 py-2.5 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:bg-white dark:text-db-dark">In Sitzung übernehmen</button>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-3">
        {records.length ? records.map((record) => (
          <article key={record.id} className="rounded-xl border border-db-dark/10 p-4 transition hover:border-db-red/30 dark:border-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <button type="button" onClick={() => onSelect(record)} className="min-w-0 flex-1 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-db-red/30">
                <div className="flex flex-wrap items-center gap-2 text-xs font-black text-db-rail dark:text-white/60">
                  <span className="flex items-center gap-1 text-db-dark dark:text-white"><Clock className="h-3.5 w-3.5 text-db-red" aria-hidden="true" />{record.date} · {record.time}</span>
                  <span className="rounded bg-db-soft px-2 py-0.5 dark:bg-white/10">{record.location}</span>
                  <span className="rounded bg-violet-50 px-2 py-0.5 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300">{record.source}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-db-dark dark:text-white">{record.description}</p>
              </button>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => onExport(record)} className="rounded-lg border border-db-dark/10 p-2 text-db-rail hover:border-db-red hover:text-db-red focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/10" aria-label="Eintrag als PDF exportieren"><Download className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" onClick={() => onDelete(record.id)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:border-red-900/50" aria-label="Eintrag löschen"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
              </div>
            </div>
          </article>
        )) : (
          <div className="rounded-xl border border-dashed border-db-dark/15 py-12 text-center dark:border-white/15">
            <FileText className="mx-auto h-10 w-10 text-db-dark/15 dark:text-white/15" aria-hidden="true" />
            <p className="mt-3 text-sm font-black text-db-dark dark:text-white">Noch keine Entwürfe in dieser Sitzung</p>
            <p className="mt-1 text-xs font-semibold text-db-rail dark:text-white/60">Erstelle einen manuellen Eintrag oder übernimm einen strukturierten Entwurf.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Input({ label, onChange, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-black text-db-rail dark:text-white/60">{label}</span>
      <input {...props} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-db-dark/15 bg-white p-2.5 text-sm font-semibold text-db-dark outline-none focus:border-db-red focus:ring-2 focus:ring-db-red/20 dark:border-white/15 dark:bg-db-dark/40 dark:text-white" />
    </label>
  );
}

function RecordModal({ record, exportError, onClose, onDelete, onExport }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const rows = useMemo(() => [
    ["Datum", record.date],
    ["Uhrzeit", record.time],
    ["Ort / Kontext", record.location],
    ["Mögliche Zeug:innen", record.witnesses],
    ["Quelle", record.source],
    ...(record.category ? [["Kategorie", record.category]] : []),
    ...(record.urgency ? [["Dringlichkeitsorientierung", record.urgency]] : []),
  ], [record]);

  useModalDialog({
    isOpen: true,
    onClose,
    dialogRef,
    initialFocusRef: closeButtonRef,
  });

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} tabIndex={-1} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl outline-none dark:bg-db-dark" role="dialog" aria-modal="true" aria-labelledby="record-modal-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-db-red">Sitzungsentwurf</p>
            <h2 id="record-modal-title" className="mt-1 text-2xl font-black text-db-dark dark:text-white">Gedächtnisprotokoll</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="rounded-full p-2 text-db-rail hover:bg-db-soft focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:text-white/60 dark:hover:bg-white/10" aria-label="Protokoll schließen"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-db-soft p-3 dark:bg-white/5"><dt className="text-[10px] font-black uppercase tracking-wide text-db-red">{label}</dt><dd className="mt-1 text-sm font-semibold text-db-dark dark:text-white">{value}</dd></div>
          ))}
        </dl>
        <div className="mt-4 rounded-xl bg-db-soft p-4 dark:bg-white/5">
          <p className="text-[10px] font-black uppercase tracking-wide text-db-red">Sachverhalt</p>
          <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-db-dark dark:text-white">{record.description}</p>
        </div>
        {exportError && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-800 dark:border-red-900/50 dark:bg-red-950/25 dark:text-red-300">{exportError}</p>}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button type="button" onClick={() => onDelete(record.id)} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-black text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:border-red-900/50 dark:text-red-300"><Trash2 className="h-4 w-4" aria-hidden="true" />Löschen</button>
          <button type="button" onClick={() => onExport(record)} className="flex items-center justify-center gap-2 rounded-xl bg-db-dark px-4 py-3 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:bg-white dark:text-db-dark"><Download className="h-4 w-4" aria-hidden="true" />PDF</button>
          <button type="button" onClick={onClose} className="rounded-xl bg-db-red px-4 py-3 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-db-red/30">Schließen</button>
        </div>
      </div>
    </div>
  );
}

function createRecordId() {
  return globalThis.crypto?.randomUUID?.() || `record-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function safeFileSegment(value) {
  return String(value || "Nicht-angegeben")
    .replace(/[^a-zA-Z0-9äöüÄÖÜß-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "Nicht-angegeben";
}
