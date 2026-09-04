import React, { useState } from "react";
import { X, Copy, CheckCircle2, TentTree, User, Building2, Calendar, FileText, Download } from "lucide-react";
import { jsPDF } from "jspdf";

export function BildungsurlaubModal({ course, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    dates: "",
  });
  const [copied, setCopied] = useState(false);

  if (!course) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const generatedText = `Sehr geehrte Vorgesetzte, sehr geehrte Personalabteilung,

hiermit beantrage ich gem. Bildungszeitgesetz / Anspruch auf Bildungsurlaub die Freistellung für die Teilnahme an folgender beruflicher Weiterbildung:

Titel des Seminars: ${course.title}
Anbieter: ${course.provider}
${formData.dates ? `Geplanter Zeitraum: ${formData.dates}\n` : ""}
Die Veranstaltung ist eine anerkannte Weiterbildung und dient meiner beruflichen sowie persönlichen Qualifizierung, insbesondere im Bereich Konfliktmanagement und Deeskalation.

Bitte lassen Sie mich wissen, welche weiteren Unterlagen (z.B. Anmeldebestätigung, Ablaufplan) Sie für die finale Genehmigung benötigen.

Mit freundlichen Grüßen,
${formData.name || "[Dein Name]"}
${formData.department ? `Abteilung: ${formData.department}` : ""}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(13, 148, 136); // Teal 600
    doc.rect(0, 0, 210, 25, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("ANTRAG AUF BILDUNGSURLAUB / BILDUNGSZEIT", 15, 17);

    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    
    const lines = doc.splitTextToSize(generatedText, 180);
    doc.text(lines, 15, 40);

    doc.setDrawColor(200, 200, 200);
    doc.line(15, 250, 195, 250);

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Erstellt mit DB Peace AI - Vorlage gem. BZGB / Bildungszeitgesetz", 15, 260);

    doc.save(`Bildungsurlaub_Antrag_${course.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-db-dark/60  p-4 animate-fadeIn">
      <div className="bg-white rounded-lg p-5 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-db-dark/5 transition"
        >
          <X className="h-6 w-6 text-db-dark/50" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-db-soft rounded-xl">
            <TentTree className="h-6 w-6 text-db-red" />
          </div>
          <h2 className="text-2xl font-bold text-db-dark">Antrag auf Bildungsurlaub</h2>
        </div>
        <p className="text-sm font-normal text-db-rail mb-8">
          Für den Kurs: <span className="font-bold text-db-dark">{course.title}</span>
        </p>

        {step === 1 ? (
          <form onSubmit={handleGenerate} className="space-y-6 animate-fadeIn">
            <div className="bg-db-soft rounded-xl p-4 border border-db-dark/5 text-sm font-normal text-db-rail leading-relaxed">
              <span className="font-bold text-db-dark">Datenschutz-Hinweis:</span> Alle Eingaben sind zu 100% freiwillig. Die Daten werden nicht gespeichert, sondern dienen nur dazu, den Antragstext für dich im Browser zu generieren. Du kannst die Felder auch leer lassen und später selbst im Text ergänzen.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-db-dark flex items-center gap-1.5"><User className="h-3.5 w-3.5"/> Dein Name (optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Max Mustermann"
                  className="w-full rounded-lg border border-db-dark/15 p-2.5 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-db-dark flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5"/> Abteilung / Bereich (optional)</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="z.B. Instandhaltung"
                  className="w-full rounded-lg border border-db-dark/15 p-2.5 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-bold text-db-dark flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5"/> Kurs-Datum / Zeitraum (optional)</label>
                <input
                  type="text"
                  value={formData.dates}
                  onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                  placeholder="z.B. 12.10.2026 - 14.10.2026"
                  className="w-full rounded-lg border border-db-dark/15 p-2.5 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-db-dark px-5 py-3.5 text-sm font-bold text-white hover:bg-db-dark transition shadow-lg flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Antrag jetzt generieren
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-db-dark/5 rounded-xl p-4 sm:p-5 border border-db-dark/10 relative group">
              <pre className="whitespace-pre-wrap text-sm font-medium text-db-dark font-sans leading-relaxed">
                {generatedText}
              </pre>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-white rounded-lg shadow-sm border border-db-dark/10 hover:bg-db-warm transition flex items-center gap-1.5 text-sm font-bold text-db-dark"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Kopiert!" : "Kopieren"}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="p-2 bg-db-dark text-white rounded-lg shadow-sm hover:bg-db-dark transition flex items-center gap-1.5 text-sm font-bold"
                >
                  <Download className="h-4 w-4" />
                  PDF Herunterladen
                </button>
              </div>
            </div>
            
            <div className="bg-db-soft rounded-xl p-4 border border-db-dark/10">
              <p className="text-sm font-bold text-teal-800">
                Nächster Schritt:
              </p>
              <p className="text-sm font-semibold text-db-dark mt-1">
                Kopiere diesen Text und schicke ihn per E-Mail an deine Führungskraft. Vergiss nicht, später die offizielle Anmeldebestätigung des Kursanbieters nachzureichen.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-db-dark px-5 py-3 text-sm font-bold text-white hover:bg-db-dark/90 transition shadow-lg"
            >
              Fenster schließen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
