import React from "react";
import { motion } from "framer-motion";
import { Phone, ShieldAlert, HeartHandshake, Building2, PhoneCall, ExternalLink, ArrowRight } from "lucide-react";

export function ContactsView() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-db-dark dark:text-white mb-2">
          Wichtige Kontakte & SOS
        </h1>
        <p className="text-lg text-db-rail dark:text-white/70 font-medium">
          Hier findest du alle wichtigen Ansprechpartner – egal ob es brennt oder du einfach jemanden zum Reden brauchst.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Akute Nothilfe */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-db-dark/80 rounded-lg p-6 border-2 border-red-500/20 shadow-sm flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500 text-white p-3 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-db-dark dark:text-white">Akute Gefahr</h2>
          </div>
          
          <div className="space-y-4 flex-grow">
            <ContactCard 
              name="Polizei / Notruf"
              number="110"
              desc="Bei akuter Bedrohung, Gewalt oder Gefahr im Verzug."
              urgent
            />
            <ContactCard 
              name="DB Sicherheit"
              number="0800 123 4567" // Placeholder
              desc="Für Sicherheitsvorfälle an Bahnhöfen und in Zügen."
              urgent
            />
          </div>
        </motion.div>

        {/* DB Interne Ansprechpartner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-db-dark/80 rounded-lg p-6 border border-db-dark/10 dark:border-white/10 shadow-sm flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-db-dark text-white dark:bg-white dark:text-db-dark p-3 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-db-dark dark:text-white">DB Intern</h2>
          </div>
          
          <div className="space-y-4 flex-grow">
            <ContactCard 
              name="JAV & Betriebsrat"
              desc="Vertretung deiner Interessen im Betrieb."
              action="Im DB Intranet suchen"
              icon={<ArrowRight className="w-4 h-4" />}
            />
            <ContactCard 
              name="AFK / NGK"
              desc="Ausbildungsfachkräfte & Nachwuchskräfte-Betreuer."
              action="Im DB Intranet suchen"
              icon={<ArrowRight className="w-4 h-4" />}
            />
            <ContactCard 
              name="Gleichstellungsbeauftragte"
              desc="Bei Fragen zu Gleichstellung und Diskriminierung."
              action="Kontakt via E-Mail"
              icon={<ArrowRight className="w-4 h-4" />}
            />
          </div>
        </motion.div>

        {/* Vertrauliche Beratung */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-db-dark/80 rounded-lg p-6 border border-db-dark/10 dark:border-white/10 shadow-sm flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 p-3 rounded-xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-db-dark dark:text-white">Vertraulich & Extern</h2>
          </div>
          
          <div className="space-y-4 flex-grow">
            <ContactCard 
              name="Telefonseelsorge"
              number="0800 111 0 111"
              desc="Kostenlos, anonym und 24/7 erreichbar bei Sorgen aller Art."
            />
            <ContactCard 
              name="Hilfetelefon Gewalt gegen Frauen"
              number="116 016"
              desc="Beratung für Frauen, die Gewalt erlebt haben."
            />
            <ContactCard 
              name="Antidiskriminierungsstelle"
              number="0800 546 546 5"
              desc="Beratung bei Diskriminierung am Arbeitsplatz."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ContactCard({ name, number, desc, urgent, action, icon }) {
  return (
    <div className={`p-4 rounded-xl border ${urgent ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30' : 'bg-db-dark/5 dark:bg-white/5 border-transparent'} transition hover:border-db-dark/20 dark:hover:border-white/20 group`}>
      <h3 className={`font-black mb-1 ${urgent ? 'text-red-700 dark:text-red-400' : 'text-db-dark dark:text-white'}`}>
        {name}
      </h3>
      <p className="text-sm font-medium text-db-rail dark:text-white/60 mb-3 leading-relaxed">
        {desc}
      </p>
      {number ? (
        <a 
          href={`tel:${number.replace(/\s/g, '')}`}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
            urgent 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-white dark:bg-db-dark text-db-dark dark:text-white border border-db-dark/10 dark:border-white/10 hover:shadow-sm'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          {number}
        </a>
      ) : (
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-white dark:bg-db-dark text-db-dark dark:text-white border border-db-dark/10 dark:border-white/10 hover:shadow-sm">
          {action}
          {icon}
        </button>
      )}
    </div>
  );
}
