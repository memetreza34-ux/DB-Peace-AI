import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  PhoneCall,
  GraduationCap,
  Lightbulb,
  LineChart,
  ShieldCheck,
  Siren,
  ArrowRight,
  TrainFront,
  Sparkles,
  Scale
} from "lucide-react";
import { MoodTracker } from "./MoodTracker";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DashboardHome({ onNavigate, onOpenEmergency }) {
  const dashboardItems = [
    {
      id: "record-report",
      title: "Festhalten & Melden",
      description: "Privates Gedächtnisprotokoll oder offizielle, anonyme Meldung.",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      borderColor: "hover:border-blue-500 hover:shadow-blue-500/10 dark:hover:border-blue-400",
      action: () => onNavigate("record-report")
    },
    {
      id: "support",
      title: "Ansprechpartner",
      description: "Kontakte zu JAV, Betriebsrat, Vertrauenspersonen & externer Hilfe.",
      icon: PhoneCall,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
      borderColor: "hover:border-emerald-500 hover:shadow-emerald-500/10 dark:hover:border-emerald-400",
      action: () => onNavigate("support")
    },
    {
      id: "learning",
      title: "Kurse & Seminare",
      description: "Wissen, Trainings und Präventions-Seminare zu Mobbing & Konflikten.",
      icon: GraduationCap,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
      borderColor: "hover:border-purple-500 hover:shadow-purple-500/10 dark:hover:border-purple-400",
      action: () => onNavigate("learning")
    },
    {
      id: "rights",
      title: "Rechte & Gesetze",
      description: "AGG, BBiG und DB-Richtlinien auf gut Deutsch erklärt.",
      icon: Scale,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-500/10 dark:bg-teal-500/20",
      borderColor: "hover:border-teal-500 hover:shadow-teal-500/10 dark:hover:border-teal-400",
      action: () => onNavigate("rights")
    },
    {
      id: "project",
      title: "Projekte & Ideen",
      description: "Reiche eigene Präventions-Ideen ein oder arbeite an Projekten mit.",
      icon: Lightbulb,
      color: "text-amber-500 dark:text-amber-400",
      bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
      borderColor: "hover:border-amber-500 hover:shadow-amber-500/10 dark:hover:border-amber-400",
      action: () => onNavigate("project")
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Auswertungen, Trends und Statistiken zum Betriebsklima.",
      icon: LineChart,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20",
      borderColor: "hover:border-indigo-500 hover:shadow-indigo-500/10 dark:hover:border-indigo-400",
      action: () => onNavigate("analytics")
    }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      
      {/* Welcome Banner */}
      <motion.div 
        variants={itemVariants}
        className="rounded-3xl bg-db-dark px-6 py-10 sm:px-10 sm:py-14 text-center shadow-2xl shadow-db-dark/20 relative overflow-hidden group"
      >
        {/* Background Glow */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 -translate-x-1/2 -mt-20 h-64 w-[600px] rounded-full bg-db-red/30 blur-[120px] pointer-events-none" 
        />
        
        {/* Animated Background Train Track Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 pointer-events-none" />
        
        {/* Animated Train */}
        <motion.div
          initial={{ x: "-150%", opacity: 0 }}
          animate={{ x: "250vw", opacity: [0, 1, 1, 0] }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "linear",
            delay: 1
          }}
          className="absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none opacity-20"
        >
          <div className="flex items-center text-white/10">
            <TrainFront className="h-24 w-24 sm:h-32 sm:w-32" />
            <div className="h-16 w-32 border-2 border-white/10 rounded-xl ml-2"></div>
            <div className="h-16 w-32 border-2 border-white/10 rounded-xl ml-2"></div>
          </div>
        </motion.div>

        {/* Floating Sparkles */}
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 left-10 sm:left-20 text-db-red pointer-events-none"
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-8 right-10 sm:right-20 text-db-red pointer-events-none"
        >
          <Sparkles className="h-8 w-8" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 max-w-2xl mx-auto">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-lg"
          >
            Willkommen bei DB Peace
          </motion.h1>
          <p className="text-base sm:text-lg font-medium text-white/80 max-w-xl">
            Dein digitaler Raum für ein respektvolles Miteinander. Wähle aus, was du gerade brauchst.
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="max-w-md mx-auto w-full z-20 relative">
        <MoodTracker />
      </motion.div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-20">
        {dashboardItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              key={item.id}
              onClick={item.action}
              className={`group flex flex-col items-start rounded-2xl border border-db-dark/5 dark:border-white/10 bg-white/70 dark:bg-db-dark/50 backdrop-blur-md p-6 text-left transition-colors shadow-sm hover:shadow-xl dark:hover:bg-db-dark/80 ${item.borderColor}`}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110 ${item.bgColor} ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-db-dark dark:text-white mb-2 group-hover:text-db-red dark:group-hover:text-db-red transition-colors">
                {item.title}
              </h3>
              <p className="text-sm font-semibold text-db-rail dark:text-white/70 flex-1">
                {item.description}
              </p>
              
              <div className="mt-4 flex w-full items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                <span className="text-xs font-black uppercase text-db-red tracking-wider">Öffnen</span>
                <ArrowRight className="h-4 w-4 text-db-red" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Secondary Actions / Footer of Dashboard */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenEmergency}
          className="flex items-center gap-4 rounded-2xl border border-red-200/50 dark:border-red-500/20 bg-white/70 dark:bg-red-500/5 backdrop-blur-md p-5 text-left transition hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 group"
        >
          <div className="rounded-xl bg-red-100 dark:bg-red-500/20 p-3 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
            <Siren className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-black text-db-dark dark:text-white">Akuter Notfall</h4>
            <p className="text-xs font-semibold text-db-rail dark:text-white/70 mt-0.5">Sofortige Hilfe & Kontakte</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate("privacy")}
          className="flex items-center gap-4 rounded-2xl border border-emerald-200/50 dark:border-emerald-500/20 bg-white/70 dark:bg-emerald-500/5 backdrop-blur-md p-5 text-left transition hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 group"
        >
          <div className="rounded-xl bg-emerald-100 dark:bg-emerald-500/20 p-3 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-black text-db-dark dark:text-white">DB Compliance</h4>
            <p className="text-xs font-semibold text-db-rail dark:text-white/70 mt-0.5">Offizielle Konzern-Richtlinien</p>
          </div>
        </motion.button>
      </motion.div>

    </motion.div>
  );
}
