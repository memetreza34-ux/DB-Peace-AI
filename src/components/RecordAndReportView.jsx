import React, { useState, useRef } from "react";
import AnonymousReport from "./AnonymousReport.jsx";
import { AISmartReport } from "./AISmartReport.jsx";
import { NotebookPen, Megaphone, Plus, Clock, FileText, CheckCircle2, Camera, X, ArrowLeft } from "lucide-react";

export function RecordAndReportView() {
  const [subTab, setSubTab] = useState(null); // null | 'protokoll' | 'meldung' | 'ki'

  // Local storage / state for recorded entries
  const [records, setRecords] = useState([
    {
      id: 1,
      date: "2026-07-20",
      time: "14:15",
      location: "Werkstatt / Pausenraum",
      category: "Beleidigung & Ausgrenzung",
      description: "Wiederholte abwertende Sprüche während der Teambesprechung.",
      witnesses: "2 Kolleg:innen anwesend",
      files: [],
    },
  ]);

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLoc, setNewLoc] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      setNewFiles([...newFiles, ...filesArray]);
    }
  };

  const removeFile = (index) => {
    const file = newFiles[index];
    if (file.url) {
      URL.revokeObjectURL(file.url);
    }
    setNewFiles(newFiles.filter((_, i) => i !== index));
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
    newFiles.forEach(f => { if (f.url) URL.revokeObjectURL(f.url); });
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
              <span>Säule 2: Festhalten & Melden</span>
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
          <h2 className="text-2xl sm:text-3xl font-black text-db-dark">Was möchtest du tun?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
            <button
              onClick={() => setSubTab("protokoll")}
              className="group rounded-xl border border-db-dark/10 bg-white p-5 hover:-translate-y-1 hover:border-amber-400 transition shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <NotebookPen className="h-6 w-6 text-amber-500" />
                <span className="font-black text-db-dark text-lg group-hover:text-amber-600 transition-colors">Vorfall festhalten</span>
              </div>
              <p className="text-sm font-semibold text-db-rail">Privates Gedächtnisprotokoll anlegen, um Fakten sofort zu sichern.</p>
            </button>

            <button
              onClick={() => setSubTab("meldung")}
              className="group rounded-xl border border-db-dark/10 bg-white p-5 hover:-translate-y-1 hover:border-db-red transition shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <Megaphone className="h-6 w-6 text-db-red" />
                <span className="font-black text-db-dark text-lg group-hover:text-db-red transition-colors">Meldung verfassen</span>
              </div>
              <p className="text-sm font-semibold text-db-rail">Einen Vorfall offiziell, sachlich und auf Wunsch anonym melden.</p>
            </button>

            <button
              onClick={() => setSubTab("ki")}
              className="group rounded-xl border border-db-dark/10 bg-white p-5 hover:-translate-y-1 hover:border-blue-500 transition shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-black text-db-dark text-lg group-hover:text-blue-600 transition-colors">🤖 KI-Assistent</span>
              </div>
              <p className="text-sm font-semibold text-db-rail">Schreibe oder diktiere frei, was passiert ist. Die KI füllt das Formular für dich aus.</p>
            </button>
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      {subTab && (
        <button
          onClick={() => setSubTab(null)}
          className="flex items-center gap-2 text-sm font-bold text-db-rail hover:text-db-red transition"
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
          <div className="rounded-md bg-white border border-db-dark/10 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-db-dark/10">
              <div>
                <h2 className="text-lg font-black text-db-dark">Dein Anonymes Gedächtnisprotokoll</h2>
                <p className="text-xs font-semibold text-db-rail">
                  Sichere Fakten (Datum, Zeit, Ort), solange deine Erinnerung frisch ist.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 rounded-xl bg-db-red px-4 py-2 text-xs sm:text-sm font-extrabold text-white hover:bg-db-red/90 transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Eintrag hinzufügen</span>
              </button>
            </div>

            {/* Quick Add Form */}
            {showForm && (
              <form onSubmit={handleAddRecord} className="mt-4 p-4 rounded-xl bg-db-warm/50 border border-db-dark/10 space-y-4">
                <h3 className="text-sm font-black text-db-dark">Neuer Protokoll-Eintrag</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-db-rail">Datum</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-db-dark/15 p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-db-rail">Uhrzeit</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-db-dark/15 p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-db-rail">Ort / Kontext</label>
                    <input
                      type="text"
                      placeholder="z.B. Werkstatt, Pausenraum, Chat"
                      value={newLoc}
                      onChange={(e) => setNewLoc(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-db-dark/15 p-2 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-db-rail">Was genau ist passiert? (Ohne Klarnamen)</label>
                  <textarea
                    rows={3}
                    placeholder="Beschreibe den Vorfall sachlich: Wer hat was gesagt/getan?"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-db-dark/15 p-2.5 text-xs font-semibold"
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
                      className="flex items-center gap-1.5 rounded-lg border border-db-dark/15 bg-white px-3 py-1.5 text-xs font-bold text-db-dark hover:bg-db-warm transition"
                    >
                      <Camera className="h-4 w-4 text-db-red" />
                      <span>Foto / Datei anhängen</span>
                    </button>
                  </div>
                  
                  {/* File Preview */}
                  {newFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {newFiles.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 rounded-md bg-white border border-db-dark/10 px-2 py-1 shadow-sm">
                          <span className="text-[10px] font-semibold text-db-dark truncate max-w-[120px]">{f.name}</span>
                          <button type="button" onClick={() => removeFile(idx)} className="text-db-rail hover:text-red-500">
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
                      newFiles.forEach(f => { if (f.url) URL.revokeObjectURL(f.url); });
                      setNewFiles([]); 
                      setShowForm(false); 
                    }}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-db-rail hover:bg-db-dark/5"
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
                <div className="text-center py-8 text-db-rail/70 text-xs font-medium">
                  Noch keine Protokoll-Einträge vorhanden.
                </div>
              ) : (
                records.map((r) => (
                  <div 
                    key={r.id} 
                    onClick={() => setSelectedRecord(r)}
                    className="cursor-pointer rounded-xl border border-db-dark/10 p-4 bg-white hover:border-db-red/30 transition shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-extrabold text-db-rail">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-db-dark">
                          <Clock className="h-3.5 w-3.5 text-db-red" /> {r.date} um {r.time} Uhr
                        </span>
                        <span className="rounded bg-db-warm px-2 py-0.5 text-db-dark">
                          📍 {r.location}
                        </span>
                      </div>
                      <span className="text-green-600 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Anonym gesichert
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-db-dark leading-relaxed">
                      {r.description}
                    </p>
                    
                    {/* Render attached files if any */}
                    {r.files && r.files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-db-dark/5">
                        {r.files.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 rounded-lg bg-db-warm/50 border border-db-dark/10 px-2 py-1">
                            <Camera className="h-3.5 w-3.5 text-db-rail" />
                            <span className="text-[11px] font-semibold text-db-dark">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Action to switch to Meldungs-Assistent */}
            <div className="mt-6 p-4 rounded-xl bg-db-warm/40 border border-db-dark/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-semibold text-db-dark">
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
        <div className="rounded-md bg-white border border-db-dark/10 p-4 sm:p-6 shadow-sm">
          <AnonymousReport />
        </div>
      )}
      {/* Selected Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-db-dark/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative">
            <button 
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-db-warm/50 hover:bg-db-dark/10 transition text-db-dark"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-black text-db-dark mb-4 flex items-center gap-2">
              <NotebookPen className="h-6 w-6 text-db-red" />
              Protokoll-Eintrag
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm font-extrabold text-db-rail">
              <span className="flex items-center gap-1 text-db-dark">
                <Clock className="h-4 w-4 text-db-red" /> {selectedRecord.date} um {selectedRecord.time} Uhr
              </span>
              <span className="rounded bg-db-warm px-2 py-1 text-db-dark">
                📍 {selectedRecord.location}
              </span>
            </div>
            
            <div className="bg-db-soft rounded-xl p-4 border border-db-dark/5 mb-6">
              <h3 className="text-xs font-bold text-db-rail uppercase tracking-wider mb-2">Beschreibung</h3>
              <p className="text-sm font-semibold text-db-dark whitespace-pre-wrap leading-relaxed">
                {selectedRecord.description}
              </p>
            </div>

            {selectedRecord.files && selectedRecord.files.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-db-rail uppercase tracking-wider mb-3">Anhänge ({selectedRecord.files.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedRecord.files.map((file, idx) => (
                    <div key={idx} className="rounded-xl border border-db-dark/10 bg-db-warm/10 overflow-hidden group">
                      {file.url ? (
                        <div className="relative aspect-video bg-db-dark/5">
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center aspect-video bg-db-dark/5">
                          <FileText className="h-8 w-8 text-db-rail/50" />
                        </div>
                      )}
                      <div className="p-2 text-[10px] font-bold text-db-dark truncate bg-white">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg bg-db-dark px-6 py-2.5 text-sm font-extrabold text-white hover:bg-db-dark/90 transition shadow-md"
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
