import React from "react";
import { X, ExternalLink, BookOpen, Info, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { useDialog } from "../lib/useDialog";

/**
 * Zeigt die Eckdaten eines Bildungsangebots und führt zum echten Anbieter.
 *
 * Bewusst kein In-App-Lehrplan und kein Zertifikat: Der Prototyp veranstaltet
 * keine Kurse und kann deshalb auch keine Teilnahme bescheinigen. Was er kann,
 * ist eine persönliche Merknotiz — klar als solche gekennzeichnet.
 */
export function CourseDetailModal({ course, onClose }) {
  const dialogRef = useDialog(Boolean(course), onClose);

  if (!course) return null;

  const hatLink = Boolean(course.link);

  const notizHerunterladen = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text("Meine Lernnotiz", 15, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110, 110, 110);
    doc.text("Persönliche Merkhilfe aus dem Prototyp DB Peace AI.", 15, 33);
    doc.text("Dies ist kein Nachweis und keine Teilnahmebestätigung.", 15, 39);

    doc.setDrawColor(210, 210, 210);
    doc.line(15, 45, 195, 45);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text("Angebot, das ich mir vorgemerkt habe:", 15, 58);

    doc.setFontSize(13);
    const titel = doc.splitTextToSize(course.title, 180);
    doc.text(titel, 15, 68);

    let y = 68 + titel.length * 7 + 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Anbieter: ${course.provider}`, 15, y);
    y += 8;
    doc.text(`Vorgemerkt am: ${new Date().toLocaleDateString("de-DE")}`, 15, y);
    y += 12;

    if (course.desc) {
      doc.setFont("helvetica", "bold");
      doc.text("Worum es geht:", 15, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const beschreibung = doc.splitTextToSize(course.desc, 180);
      doc.text(beschreibung, 15, y);
      y += beschreibung.length * 6 + 6;
    }

    if (course.requirements) {
      doc.setFont("helvetica", "bold");
      doc.text("Was ich dafür brauche:", 15, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const anforderungen = doc.splitTextToSize(course.requirements, 180);
      doc.text(anforderungen, 15, y);
      y += anforderungen.length * 6 + 6;
    }

    if (hatLink) {
      doc.setFont("helvetica", "bold");
      doc.text("Zum Anbieter:", 15, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 80, 180);
      doc.text(course.link, 15, y);
    }

    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text(
      "Erstellt mit DB Peace AI (Prototyp). Keine offizielle Bescheinigung der Deutschen Bahn AG.",
      15,
      280
    );

    doc.save(`Lernnotiz_${course.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 60)}.pdf`);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60  p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kurs-titel"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface  rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative border border-slate-200 dark:border-white/10 outline-none"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <span className="inline-block bg-db-red text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
            {course.provider}
          </span>

          <h2 id="kurs-titel" className="text-xl font-schild font-bold text-white pr-8">
            {course.title}
          </h2>
        </div>

        {/* Inhalt */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Worum es geht
            </h3>
            <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed">{course.desc}</p>
          </div>

          {course.requirements && (
            <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-4 border border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Was du dafür brauchst</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-white/70">{course.requirements}</p>
            </div>
          )}

          {course.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/10 text-sm font-bold text-slate-700 dark:text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-lg border border-warn-line bg-warn p-4 flex gap-3">
            <Info className="w-4 h-4 text-warn-ink shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-warn-ink leading-relaxed">
              Dieses Angebot wird von der genannten Organisation durchgeführt, nicht von dieser App.
              Anmeldung, Inhalte, Termine und mögliche Nachweise laufen direkt über den Anbieter.
            </p>
          </div>
        </div>

        {/* Fußzeile */}
        <div className="border-t border-slate-200 dark:border-white/10 p-4 flex flex-col sm:flex-row gap-2 shrink-0 bg-surface ">
          {hatLink ? (
            <a
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-db-dark dark:bg-db-red px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 transition"
            >
              Zum Anbieter <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <p className="flex-1 text-sm font-medium text-slate-500 dark:text-white/60 self-center text-center sm:text-left">
              Für dieses Angebot ist noch kein Link hinterlegt.
            </p>
          )}

          <button
            onClick={notizHerunterladen}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-white/20 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition"
          >
            <Download className="h-4 w-4" /> Als Lernnotiz sichern
          </button>
        </div>
      </div>
    </div>
  );
}
