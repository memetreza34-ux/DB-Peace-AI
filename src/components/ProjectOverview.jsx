import React, { useState, useEffect } from "react";
import { lesen, schreiben } from "../lib/speicher.js";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, CheckCircle2, Sparkles, X, HeartHandshake, FileText, LayoutDashboard, Eye, Clock } from "lucide-react";

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "Workshop: Zivilcourage im Arbeitsalltag",
    description: "Wir möchten einen 2-stündigen Workshop für alle Azubis organisieren, um zu üben, wie man bei Mobbing oder dummen Sprüchen als Zeuge richtig eingreift.",
    initiator: "Azubi-Team Süd (Lisa M. & Tom K.)",
    category: "Workshop",
    participants: 12,
    views: 145,
    enrollmentStatus: "none",
  },
  {
    id: 2,
    title: "Safe Space Café am Freitag",
    description: "Ein wöchentlicher, lockerer Austausch in der Kantine. Ein sicherer Ort, um über Probleme in der Ausbildung zu sprechen, ohne Führungskräfte.",
    initiator: "JAV München (Abteilung IT)",
    category: "Event",
    participants: 5,
    views: 89,
    enrollmentStatus: "none",
  },
  {
    id: 3,
    title: "Anti-Rassismus Kampagne am Werkstor",
    description: "Plakataktion und Flyer-Verteilung, um ein Zeichen für Vielfalt und gegen Diskriminierung am Standort zu setzen.",
    initiator: "Gewerkschaftsjugend (Standort Mitte)",
    category: "Kampagne",
    participants: 28,
    views: 412,
    enrollmentStatus: "accepted",
  }
];

export default function ProjectOverview() {
  const [projects, setProjects] = useState(() => {
    const saved = lesen("db-peace-projects");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  useEffect(() => {
    schreiben("db-peace-projects", JSON.stringify(projects));
  }, [projects]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", category: "Workshop" });

  const handleJoin = (id) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        if (p.enrollmentStatus === "none") {
          return { ...p, enrollmentStatus: "pending" };
        } else if (p.enrollmentStatus === "pending") {
          // Allow cancelling the request
          return { ...p, enrollmentStatus: "none" };
        }
      }
      return p;
    }));
  };

  const handleSubmitIdea = (e) => {
    e.preventDefault();
    if (!newIdea.title.trim() || !newIdea.description.trim()) return;

    const newProject = {
      id: Date.now(),
      title: newIdea.title,
      description: newIdea.description,
      initiator: "Du (Dein DB-Profil)",
      category: newIdea.category,
      participants: 1,
      views: 0,
      enrollmentStatus: "accepted", // You created it, so you are in
    };

    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    setNewIdea({ title: "", description: "", category: "Workshop" });
  };

  return (
    <div className="w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white dark:bg-db-dark/50 p-6 sm:p-8 rounded-lg border border-db-dark/5 dark:border-white/10 shadow-sm relative overflow-hidden">
        
        {/* Background Graphic */}
        <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
          <HeartHandshake className="w-96 h-96 text-db-dark dark:text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold text-db-dark dark:text-white mb-2">
            Initiativen & Projekte
          </h2>
          <p className="text-lg text-db-rail dark:text-white/70 font-medium">
            Gemeinsam für ein besseres Arbeitsklima. Melde dich hier verbindlich für Projekte an. Ersteller müssen deine Teilnahme bestätigen.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 shrink-0 inline-flex items-center gap-2 bg-db-red hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold transition shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Neue Idee eintragen
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map(project => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              layout
              className="bg-white dark:bg-db-dark/80 rounded-lg p-6 border border-db-dark/10 dark:border-white/10 shadow-sm flex flex-col justify-between group hover:shadow-md hover:border-db-red/30 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider bg-db-dark/5 dark:bg-white/10 text-db-dark dark:text-white px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-db-rail dark:text-white/60 font-bold text-sm bg-db-dark/5 dark:bg-white/5 px-2 py-1 rounded-lg" title="Aufrufe">
                      <Eye className="w-4 h-4" />
                      <span>{project.views}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-db-rail dark:text-white/60 font-bold text-sm bg-db-dark/5 dark:bg-white/5 px-2 py-1 rounded-lg" title="Teilnehmer">
                      <Users className="w-4 h-4" />
                      <span>{project.participants}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-db-dark dark:text-white mb-3 leading-tight group-hover:text-db-red transition-colors">
                  {project.title}
                </h3>
                <p className="text-db-dark/80 dark:text-white/70 text-sm font-medium mb-6">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-db-rail dark:text-white/50 mb-3 bg-db-dark/5 dark:bg-white/5 p-3 rounded-xl border border-db-dark/5 dark:border-white/5">
                  <span className="block mb-1 opacity-70">Initiiert von:</span> 
                  <span className="text-db-dark dark:text-white text-sm">{project.initiator}</span>
                </div>
                
                <button
                  onClick={() => handleJoin(project.id)}
                  disabled={project.enrollmentStatus === "accepted"}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                    project.enrollmentStatus === "accepted" 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default" 
                      : project.enrollmentStatus === "pending"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                      : "bg-db-dark dark:bg-white text-white dark:text-db-dark hover:scale-[1.02]"
                  }`}
                >
                  {project.enrollmentStatus === "accepted" && (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Teilnahme bestätigt!
                    </>
                  )}
                  {project.enrollmentStatus === "pending" && (
                    <>
                      <Clock className="w-5 h-5" /> Anfrage gesendet (Ausstehend)
                    </>
                  )}
                  {project.enrollmentStatus === "none" && (
                    <>
                      <Sparkles className="w-5 h-5" /> Teilnehmen & Anmelden
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Idea Modal — bewusst ohne AnimatePresence, sonst bleibt das Overlay
          nach dem Schließen unsichtbar im DOM liegen und fängt weiter Klicks ab. */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-db-dark/60 "
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-db-dark rounded-lg p-6 md:p-8 shadow-lg border border-db-dark/10 dark:border-white/10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-db-rail hover:text-db-dark dark:hover:text-white hover:bg-db-dark/5 dark:hover:bg-white/10 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-db-red/10 text-db-red flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-db-dark dark:text-white">Neue Projekt-Idee</h3>
                  <p className="text-sm font-semibold text-db-rail dark:text-white/70">Finde Mitstreiter für dein Projekt.</p>
                </div>
              </div>

              <form onSubmit={handleSubmitIdea} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-db-dark dark:text-white mb-1.5">Titel des Projekts</label>
                  <input
                    type="text"
                    required
                    value={newIdea.title}
                    onChange={e => setNewIdea({...newIdea, title: e.target.value})}
                    placeholder="z.B. Stammtisch für Vielfalt"
                    className="w-full bg-db-dark/5 dark:bg-white/5 border border-db-dark/10 dark:border-white/10 rounded-xl px-4 py-3 text-db-dark dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-db-red focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-db-dark dark:text-white mb-1.5">Kategorie</label>
                  <select
                    value={newIdea.category}
                    onChange={e => setNewIdea({...newIdea, category: e.target.value})}
                    className="w-full bg-db-dark/5 dark:bg-white/5 border border-db-dark/10 dark:border-white/10 rounded-xl px-4 py-3 text-db-dark dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-db-red focus:border-transparent transition appearance-none"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Event">Event</option>
                    <option value="Kampagne">Kampagne</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-db-dark dark:text-white mb-1.5">Worum geht es?</label>
                  <textarea
                    required
                    rows="4"
                    value={newIdea.description}
                    onChange={e => setNewIdea({...newIdea, description: e.target.value})}
                    placeholder="Beschreibe kurz deine Idee und warum sie wichtig ist..."
                    className="w-full bg-db-dark/5 dark:bg-white/5 border border-db-dark/10 dark:border-white/10 rounded-xl px-4 py-3 text-db-dark dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-db-red focus:border-transparent transition resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-db-red hover:bg-red-700 text-white py-3.5 rounded-xl font-bold transition flex justify-center items-center gap-2 shadow-sm"
                  >
                    Projekt veröffentlichen
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
      )}
    </div>
  );
}
