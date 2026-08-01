import React, { useState } from "react";
import { X, Copy, CheckCircle2, TentTree, User, Building2, Calendar, FileText } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-db-dark/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-db-dark/5 transition"
        >
          <X className="h-6 w-6 text-db-dark/50" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-teal-50 rounded-xl">
            <TentTree className="h-6 w-6 text-teal-600" />
          </div>
          <h2 className="text-2xl font-black text-db-dark">Antrag auf Bildungsurlaub</h2>
        </div>
        <p className="text-sm font-semibold text-db-rail mb-8">
          Für den Kurs: <span className="font-bold text-db-dark">{course.title}</span>
        </p>

        {step === 1 ? (
          <form onSubmit={handleGenerate} className="space-y-6 animate-fadeIn">
            <div className="bg-db-warm/30 rounded-xl p-4 border border-db-dark/5 text-xs font-semibold text-db-rail leading-relaxed">
              <span className="font-bold text-db-dark">Datenschutz-Hinweis:</span> Alle Eingaben sind zu 100% freiwillig. Die Daten werden nicht gespeichert, sondern dienen nur dazu, den Antragstext für dich im Browser zu generieren. Du kannst die Felder auch leer lassen und später selbst im Text ergänzen.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-db-dark flex items-center gap-1.5"><User className="h-3.5 w-3.5"/> Dein Name (optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Max Mustermann"
                  className="w-full rounded-lg border border-db-dark/15 p-2.5 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-db-dark flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5"/> Abteilung / Bereich (optional)</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="z.B. Instandhaltung"
                  className="w-full rounded-lg border border-db-dark/15 p-2.5 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-db-dark flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5"/> Kurs-Datum / Zeitraum (optional)</label>
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
              className="w-full rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-extrabold text-white hover:bg-teal-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Antrag jetzt generieren
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-db-dark/5 rounded-xl p-4 sm:p-6 border border-db-dark/10 relative group">
              <pre className="whitespace-pre-wrap text-sm font-medium text-db-dark font-sans leading-relaxed">
                {generatedText}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2.5 bg-white rounded-lg shadow-sm border border-db-dark/10 hover:bg-db-warm transition flex items-center gap-2 text-xs font-bold text-db-dark"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                {copied ? "Kopiert!" : "Kopieren"}
              </button>
            </div>
            
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
              <p className="text-sm font-bold text-teal-800">
                Nächster Schritt:
              </p>
              <p className="text-xs font-semibold text-teal-700 mt-1">
                Kopiere diesen Text und schicke ihn per E-Mail an deine Führungskraft. Vergiss nicht, später die offizielle Anmeldebestätigung des Kursanbieters nachzureichen.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-db-dark px-6 py-3 text-sm font-extrabold text-white hover:bg-db-dark/90 transition shadow-lg"
            >
              Fenster schließen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
