import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  ExternalLink,
  HeartHandshake,
  Info,
  PhoneCall,
  ShieldAlert,
} from "lucide-react";

const emergencyContacts = [
  {
    name: "Polizei",
    number: "110",
    description: "Bei akuter Bedrohung, Gewalt oder einer unmittelbar gefährlichen Situation.",
  },
  {
    name: "Feuerwehr und Rettungsdienst",
    number: "112",
    description: "Bei medizinischen Notfällen, Feuer oder akuter Gefahr für Leben und Gesundheit.",
  },
];

const externalContacts = [
  {
    name: "TelefonSeelsorge",
    number: "116 123",
    description: "Kostenfreie Unterstützung in Krisen und schwierigen Lebenslagen, Tag und Nacht.",
    website: "https://www.telefonseelsorge.de/",
    availability: "24 Stunden täglich",
  },
  {
    name: "Hilfetelefon Gewalt gegen Frauen",
    number: "116 016",
    description: "Anonyme und kostenfreie Beratung für betroffene Frauen sowie unterstützende Personen.",
    website: "https://www.hilfetelefon.de/",
    availability: "24 Stunden täglich",
  },
  {
    name: "Antidiskriminierungsstelle des Bundes",
    number: "0800 546 546 5",
    description: "Erste Orientierung bei Benachteiligung und Diskriminierung, auch im Arbeitsleben.",
    website: "https://www.antidiskriminierungsstelle.de/",
    availability: "Montag bis Donnerstag, 9 bis 15 Uhr",
  },
];

const internalPaths = [
  {
    title: "Ausbildungsbetreuung",
    description: "Zuständige Ausbildungsfachkraft, Lernbegleitung oder Ausbildungsleitung über die bekannten internen Wege suchen.",
  },
  {
    title: "JAV oder Betriebsrat",
    description: "Lokale Vertretung im Intranet, Telefonbuch oder über die Interessenvertretung des Standorts ermitteln.",
  },
  {
    title: "Weitere zuständige Stellen",
    description: "Je nach Situation können Gleichstellung, Schwerbehindertenvertretung, Compliance oder betriebliche Sozialberatung zuständig sein.",
  },
];

export function ContactsView() {
  return (
    <div className="w-full space-y-8">
      <header>
        <p className="text-sm font-black uppercase tracking-wider text-db-red">Hilfewege</p>
        <h1 className="mt-2 text-3xl font-black text-db-dark dark:text-white">
          Geprüfte externe Hilfe und interne Suchwege
        </h1>
        <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-db-rail dark:text-white/70">
          Die App kennt keine internen DB-Kontaktdaten. Nutze für interne Stellen ausschließlich das Intranet,
          das betriebliche Telefonbuch oder bestätigte Kontakte deines Standorts.
        </p>
      </header>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-100">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            Nummern und Erreichbarkeit wurden am 6. August 2026 anhand der offiziellen Anbieter-Seiten geprüft.
            Vor einer produktiven Veröffentlichung muss diese Prüfung regelmäßig wiederholt werden.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ContactSection
          title="Akute Gefahr"
          icon={ShieldAlert}
          tone="danger"
          delay={0}
        >
          {emergencyContacts.map((contact) => (
            <PhoneCard key={contact.name} {...contact} urgent />
          ))}
          <p className="rounded-lg bg-red-50 p-3 text-xs font-semibold leading-5 text-red-800 dark:bg-red-950/30 dark:text-red-200">
            Die App überträgt keinen Standort. Nenne am Telefon deinen Standort und beschreibe die Gefahr so konkret wie möglich.
          </p>
        </ContactSection>

        <ContactSection
          title="Interne Ansprechwege"
          icon={Building2}
          tone="neutral"
          delay={0.08}
        >
          {internalPaths.map((item) => (
            <article key={item.title} className="rounded-xl border border-db-dark/10 bg-db-soft p-4 dark:border-white/10 dark:bg-white/5">
              <h3 className="font-black text-db-dark dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-db-rail dark:text-white/65">{item.description}</p>
            </article>
          ))}
        </ContactSection>

        <ContactSection
          title="Vertrauliche externe Beratung"
          icon={HeartHandshake}
          tone="support"
          delay={0.16}
        >
          {externalContacts.map((contact) => (
            <PhoneCard key={contact.name} {...contact} />
          ))}
        </ContactSection>
      </div>
    </div>
  );
}

function ContactSection({ children, delay, icon: Icon, title, tone }) {
  const iconClass = tone === "danger"
    ? "bg-red-600 text-white"
    : tone === "support"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : "bg-db-dark text-white dark:bg-white dark:text-db-dark";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex h-full flex-col rounded-xl bg-white p-6 shadow-sm dark:bg-db-dark/80 ${
        tone === "danger" ? "border-2 border-red-500/20" : "border border-db-dark/10 dark:border-white/10"
      }`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-black text-db-dark dark:text-white">{title}</h2>
      </div>
      <div className="flex flex-1 flex-col gap-4">{children}</div>
    </motion.section>
  );
}

function PhoneCard({ availability, description, name, number, urgent = false, website }) {
  const phoneValue = number.replace(/[^\d+]/g, "");

  return (
    <article className={`rounded-xl border p-4 ${
      urgent
        ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20"
        : "border-db-dark/10 bg-db-soft dark:border-white/10 dark:bg-white/5"
    }`}>
      <h3 className={`font-black ${urgent ? "text-red-800 dark:text-red-300" : "text-db-dark dark:text-white"}`}>
        {name}
      </h3>
      <p className="mt-2 text-sm font-medium leading-6 text-db-rail dark:text-white/65">{description}</p>
      {availability && (
        <p className="mt-2 text-xs font-bold text-db-rail dark:text-white/50">Erreichbarkeit: {availability}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`tel:${phoneValue}`}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black transition ${
            urgent
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-white text-db-dark shadow-sm ring-1 ring-db-dark/10 hover:ring-db-red dark:bg-db-dark dark:text-white dark:ring-white/10"
          }`}
        >
          <PhoneCall className="h-4 w-4" aria-hidden="true" />
          {number}
        </a>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-db-dark/10 bg-white px-3 py-2 text-xs font-black text-db-dark hover:border-db-red hover:text-db-red dark:border-white/10 dark:bg-db-dark dark:text-white"
          >
            Offizielle Seite
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
