import React, { useState, useRef, useEffect, useCallback } from "react";
import AnonymousReport from "./AnonymousReport.jsx";
import { AISmartReport } from "./AISmartReport.jsx";
import { NotebookPen, Megaphone, Plus, Clock, FileText, Camera, X, ArrowLeft, Trash2, Smartphone, AlertTriangle } from "lucide-react";
import { protokollLaden, protokollSpeichern, dateiEinlesen, speicherHinweis } from "../lib/protokoll.js";
import { useDialog } from "../lib/useDialog.js";

export function RecordAndReportView() {
  const [subTab, setSubTab] = useState(null); // null | 'protokoll' | 'meldung' | 'ki'

  // Die Einträge liegen im Speicher dieses Geräts — siehe src/lib/protokoll.js.
  const [records, setRecords] = useState(() => protokollLaden().eintraege);
  const [speicherFehler, setSpeicherFehler] = useState("");

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLoc, setNewLoc] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (subTab !== "protokoll") {
      setNewFiles([]);
      setShowForm(false);
    }
  }, [subTab]);

  // Jede Änderung geht sofort auf das Gerät. Schlägt das fehl, sagt die App das,
  // statt den Eintrag stillschweigend zu verlieren.
  useEffect(() => {
    const { ok, fehler } = protokollSpeichern(records);
    setSpeicherFehler(ok ? "" : fehler);
  }, [records]);

  const handleFileChange = async (e) => {
    if (!e.target.files?.length) return;
    const eingelesen = await Promise.all(Array.from(e.target.files).map(dateiEinlesen));
    setNewFiles((aktuell) => [...aktuell, ...eingelesen]);
    e.target.value = ""; // damit dieselbe Datei erneut ausgewählt werden kann
  };

  const removeFile = (index) => {
    setNewFiles((aktuell) => aktuell.filter((_, i) => i !== index));
  };

  const handleDeleteRecord = (id) => {
    const confirmed = window.confirm(
      "Diesen Eintrag von diesem Gerät löschen? Das lässt sich nicht rückgängig machen."
    );
    if (!confirmed) return;
    setRecords((aktuell) => aktuell.filter((r) => r.id !== id));
    setSelectedRecord(null);
  };

  const schliesseDetail = useCallback(() => setSelectedRecord(null), []);
  const detailRef = useDialog(Boolean(selectedRecord), schliesseDetail);

  const handleAlleLoeschen = () => {
    const confirmed = window.confirm(
      "Wirklich alle Protokoll-Einträge von diesem Gerät löschen? Das lässt sich nicht rückgängig machen."
    );
    if (!confirmed) return;
    setRecords([]);
    setSelectedRecord(null);
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    const entry = {
      id: Date.now(),
      date: newDate || new Date().toISOString().split("T")[0],
      time: newTime || "12:00",
      location: newLoc || "Nicht angegeben",
      category: "Vorfall-Protokoll",
      description: newDesc,
      witnesses: "Keine Angaben",
      files: newFiles,
    };
    setRecords([entry, ...records]);
    setNewDesc("");
    setNewLoc("");
    setNewFiles([]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-md bg-gradient-to-r from-db-dark via-db-dark/90 to-db-rail p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-db-warm backdrop-blur-md">
              <NotebookPen className="h-3.5 w-3.5 text-amber-400" />
              <span>Festhalten &amp; Melden</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Gedächtnisprotokoll & Vorfall-Meldung
            </h1>
            <p className="text-sm font-medium text-white/80 leading-relaxed">
              Halte Geschehnisse sachlich und anonym fest – als Gedächtnisstütze für dich selbst oder als vorbereitete Meldung für JAV, Betriebsrat oder Ausbilder:innen.
            </p>
          </div>

        </div>
      </div>

      {/* STEP 1: GRID SELECTION */}
      {!subTab && (
        <div className="text-center space-y-6 py-4">
          <h2 className="text-2xl sm:text-3xl font-black text-db-dark dark:text-white">Was möchtest du tun?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
            <button
              onClick={() => setSubTab("protokoll")}
              className="group rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50 p-5 hover:-translate-y-1 hover:border-amber-400 dark:hover:border-amber-400 transition shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <NotebookPen className="h-6 w-6 text-amber-500" />
                <span className="font-black text-db-dark dark:text-white text-lg group-hover:text-amber-600 transition-colors">Vorfall festhalten</span>
              </div>
              <p className="text-sm font-semibold text-db-rail dark:text-white/60">Privates Gedächtnisprotokoll anlegen, um Fakten sofort zu sichern.</p>
            </button>

            <button
              onClick={() => setSubTab("meldung")}
              className="group rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50 p-5 hover:-translate-y-1 hover:border-db-red dark:hover:border-db-red transition shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <Megaphone className="h-6 w-6 text-db-red" />
                <span className="font-black text-db-dark dark:text-white text-lg group-hover:text-db-red transition-colors">Meldung verfassen</span>
              </div>
              <p className="text-sm font-semibold text-db-rail dark:text-white/60">Einen Vorfall offiziell, sachlich und auf Wunsch anonym melden.</p>
            </button>

            <button
              onClick={() => setSubTab("ki")}
              className="group rounded-xl border border-db-dark/10 dark:border-white/10 bg-white dark:bg-db-dark/50 p-5 hover:-translate-y-1 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-black text-db-dark dark:text-white text-lg group-hover:text-blue-600 transition-colors">🤖 KI-Assistent</span>
              </div>
              <p className="text-sm font-semibold text-db-rail dark:text-white/60">Schreibe oder diktiere frei, was passiert ist. Die KI füllt das Formular für dich aus.</p>
            </button>
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      {subTab && (
        <button
          onClick={() => setSubTab(null)}
          className="flex items-center gap-2 text-sm font-bold text-db-rail dark:text-white/60 hover:text-db-red dark:hover:text-db-red transition"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück zur Übersicht
        </button>
      )}

      {/* Sub-Tab 3: KI Assistent */}
      {subTab === "ki" && (
        <AISmartReport 
          onReportGenerated={(generatedReport) => {
            const entry = {
              id: Date.now(),
              date: generatedReport.date,
              time: generatedReport.time,
              location: generatedReport.location,
              category: generatedReport.category,
              description: generatedReport.description,
              witnesses: "Keine Angaben",
              files: [],
            };
            setRecords([entry, ...records]);
          }} 
        />
      )}

      {/* Sub-Tab 1: Vorfall Festhalten (Gedächtnisprotokoll) */}
      {subTab === "protokoll" && (
        <div className="space-y-6">
          <div className="rounded-md bg-white dark:bg-db-dark/50 border border-db-dark/10 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-db-dark/10 dark:border-white/10">
              <div>
                <h2 className="text-lg font-black text-db-dark dark:text-white">Dein Gedächtnisprotokoll</h2>
                <p className="text-xs font-semibold text-db-rail dark:text-white/60">
                  Halte Fakten fest (Datum, Zeit, Ort), solange deine Erinnerung frisch ist.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {records.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAlleLoeschen}
                    className="flex min-h-11 items-center gap-1.5 rounded-xl border border-db-dark/15 dark:border-white/15 px-3 py-2 text-xs font-bold text-db-rail dark:text-white/60 hover:border-db-red hover:text-db-red transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Alles löschen</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowForm(!showForm)}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-db-red px-4 py-2 text-xs sm:text-sm font-extrabold text-white hover:bg-db-red/90 transition shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Eintrag hinzufügen</span>
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-db-soft dark:bg-white/5 border border-db-dark/10 dark:border-white/10 p-3">
              <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-db-rail dark:text-white/60" />
              <p className="text-[11px] font-semibold leading-relaxed text-db-rail dark:text-white/60">
                {speicherHinweis()}
              </p>
            </div>

            {speicherFehler && (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-db-red/30 bg-red-50 dark:bg-red-950/20 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-db-red" />
                <p className="text-[11px] font-bold leading-relaxed text-db-red dark:text-red-300">
                  {speicherFehler}
                </p>
              </div>
            )}

            {/* Quick Add Form */}
            {showForm && (
              <form onSubmit={handleAddRecord} className="mt-4 p-4 rounded-xl bg-db-warm/50 dark:bg-db-dark/30 border border-db-dark/10 dark:border-white/10 space-y-4">
                <h3 className="text-sm font-black text-db-dark dark:text-white">Neuer Protokoll-Eintrag</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-db-rail dark:text-white/60">Datum</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-db-dark/15 dark:border-white/15 bg-white dark:bg-db-dark/30 dark:text-white p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-db-rail dark:text-white/60">Uhrzeit</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-db-dark/15 dark:border-white/15 bg-white dark:bg-db-dark/30 dark:text-white p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-db-rail dark:text-white/60">Ort / Kontext</label>
                    <input
                      type="text"
                      placeholder="z.B. Werkstatt, Pausenraum, Chat"
                      value={newLoc}
                      onChange={(e) => setNewLoc(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-db-dark/15 dark:border-white/15 bg-white dark:bg-db-dark/30 dark:text-white p-2 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-db-rail dark:text-white/60">Was genau ist passiert? (Ohne Klarnamen)</label>
                  <textarea
                    rows={3}
                    placeholder="Beschreibe den Vorfall sachlich: Wer hat was gesagt/getan?"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-db-dark/15 dark:border-white/15 bg-white dark:bg-db-dark/30 dark:text-white p-2.5 text-xs font-semibold"
                  />
                </div>
                
                {/* File Upload Section */}
                <div className="flex flex-col gap-2">
                  <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg border border-db-dark/15 dark:border-white/15 bg-white dark:bg-db-dark/30 px-3 py-1.5 text-xs font-bold text-db-dark dark:text-white hover:bg-db-warm dark:hover:bg-white/5 transition"
                    >
                      <Camera className="h-4 w-4 text-db-red" />
                      <span>Foto / Datei anhängen</span>
                    </button>
                  </div>
                  
                  {/* File Preview */}
                  {newFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {newFiles.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 rounded-md bg-white dark:bg-db-dark/50 border border-db-dark/10 dark:border-white/10 px-2 py-1 shadow-sm">
                          <span className="text-[10px] font-semibold text-db-dark dark:text-white truncate max-w-[120px]">{f.name}</span>
                          <button type="button" onClick={() => removeFile(idx)} className="text-db-rail dark:text-white/60 hover:text-red-500 dark:hover:text-red-400">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewFiles([]);
                      setShowForm(false);
                    }}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-db-rail dark:text-white/60 hover:bg-db-dark/5 dark:hover:bg-white/5"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-db-dark px-4 py-1.5 text-xs font-extrabold text-white hover:bg-db-dark/90"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            )}

            {/* List of Entries */}
            <div className="mt-4 space-y-3">
              {records.length === 0 ? (
                <div className="text-center py-8 text-db-rail/70 dark:text-white/40 text-xs font-medium">
                  Noch keine Protokoll-Einträge vorhanden.
                </div>
              ) : (
                records.map((r) => (
                  <div 
                    key={r.id} 
                    onClick={() => setSelectedRecord(r)}
                    className="cursor-pointer rounded-xl border border-db-dark/10 dark:border-white/10 p-4 bg-white dark:bg-db-dark/30 hover:border-db-red/30 dark:hover:border-db-red/50 transition shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-extrabold text-db-rail dark:text-white/60">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-db-dark dark:text-white">
                          <Clock className="h-3.5 w-3.5 text-db-red" /> {r.date} um {r.time} Uhr
                        </span>
                        <span className="rounded bg-db-warm dark:bg-db-dark/50 px-2 py-0.5 text-db-dark dark:text-white">
                          📍 {r.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {r.beispiel && (
                          <span className="rounded bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 text-amber-800 dark:text-amber-300">
                            Beispiel
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-bold text-db-rail dark:text-white/60">
                          <Smartphone className="h-3.5 w-3.5" /> Nur auf diesem Gerät
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecord(r.id);
                          }}
                          aria-label="Eintrag löschen"
                          className="flex h-11 w-11 items-center justify-center rounded-lg text-db-rail dark:text-white/60 hover:bg-db-red/10 hover:text-db-red transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-db-dark dark:text-white leading-relaxed">
                      {r.description}
                    </p>
                    
                    {/* Render attached files if any */}
                    {r.files && r.files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-db-dark/5 dark:border-white/5">
                        {r.files.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 rounded-lg bg-db-warm/50 dark:bg-db-dark/50 border border-db-dark/10 dark:border-white/10 px-2 py-1">
                            <Camera className="h-3.5 w-3.5 text-db-rail dark:text-white/60" />
                            <span className="text-[11px] font-semibold text-db-dark dark:text-white">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Action to switch to Meldungs-Assistent */}
            <div className="mt-6 p-4 rounded-xl bg-db-warm/40 dark:bg-db-dark/30 border border-db-dark/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-semibold text-db-dark dark:text-white">
                Bereit, aus deinen Notizen einen sachlichen Entwurf für eine Vorfall-Meldung zu generieren?
              </div>
              <button
                type="button"
                onClick={() => setSubTab("meldung")}
                className="shrink-0 rounded-xl bg-db-red px-4 py-2 text-xs font-black text-white hover:bg-db-red/90 transition shadow-sm"
              >
                Meldung in 5 Schritten verfassen →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Melden (5-Schritte-Assistent) */}
      {subTab === "meldung" && (
        <div className="rounded-md bg-white dark:bg-db-dark/50 border border-db-dark/10 dark:border-white/10 p-4 sm:p-6 shadow-sm">
          <AnonymousReport />
        </div>
      )}
      {/* Selected Record Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-db-dark/60 backdrop-blur-sm p-4"
          onClick={schliesseDetail}
        >
          <div
            ref={detailRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="protokoll-eintrag-titel"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-db-dark rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative border dark:border-white/10 outline-none"
          >
            <button
              aria-label="Schließen"
              onClick={schliesseDetail}
              className="absolute top-4 right-4 p-2 rounded-full bg-db-warm/50 dark:bg-db-dark/50 hover:bg-db-dark/10 dark:hover:bg-white/10 transition text-db-dark dark:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2
              id="protokoll-eintrag-titel"
              className="text-xl font-black text-db-dark dark:text-white mb-4 flex items-center gap-2"
            >
              <NotebookPen className="h-6 w-6 text-db-red" />
              Protokoll-Eintrag
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm font-extrabold text-db-rail dark:text-white/60">
              <span className="flex items-center gap-1 text-db-dark dark:text-white">
                <Clock className="h-4 w-4 text-db-red" /> {selectedRecord.date} um {selectedRecord.time} Uhr
              </span>
              <span className="rounded bg-db-warm dark:bg-db-dark/50 px-2 py-1 text-db-dark dark:text-white">
                📍 {selectedRecord.location}
              </span>
            </div>
            
            <div className="bg-db-soft dark:bg-db-dark/30 rounded-xl p-4 border border-db-dark/5 dark:border-white/5 mb-6">
              <h3 className="text-xs font-bold text-db-rail dark:text-white/60 uppercase tracking-wider mb-2">Beschreibung</h3>
              <p className="text-sm font-semibold text-db-dark dark:text-white whitespace-pre-wrap leading-relaxed">
                {selectedRecord.description}
              </p>
            </div>

            {selectedRecord.files && selectedRecord.files.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-db-rail dark:text-white/60 uppercase tracking-wider mb-3">Anhänge ({selectedRecord.files.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedRecord.files.map((file, idx) => (
                    <div key={idx} className="rounded-xl border border-db-dark/10 dark:border-white/10 bg-db-warm/10 dark:bg-db-dark/30 overflow-hidden group">
                      {file.url ? (
                        <div className="relative aspect-video bg-db-dark/5 dark:bg-white/5">
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center aspect-video bg-db-dark/5 dark:bg-white/5">
                          <FileText className="h-8 w-8 text-db-rail/50 dark:text-white/30" />
                        </div>
                      )}
                      <div className="bg-white dark:bg-db-dark/50 p-2">
                        <p className="truncate text-[10px] font-bold text-db-dark dark:text-white">{file.name}</p>
                        {!file.gespeichert && (
                          <p className="mt-0.5 text-[10px] font-semibold leading-tight text-db-rail dark:text-white/50">
                            Nur der Name gemerkt — die Datei liegt weiter auf deinem Gerät.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={() => handleDeleteRecord(selectedRecord.id)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-db-dark/15 dark:border-white/15 px-5 py-2.5 text-sm font-extrabold text-db-rail dark:text-white/70 transition hover:border-db-red hover:text-db-red"
              >
                <Trash2 className="h-4 w-4" />
                Eintrag löschen
              </button>
              <button
                onClick={schliesseDetail}
                className="min-h-11 rounded-lg bg-db-dark px-6 py-2.5 text-sm font-extrabold text-white hover:bg-db-dark/90 transition shadow-md"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
