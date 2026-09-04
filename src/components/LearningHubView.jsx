import React, { useState } from "react";
import TrainingMode from "./TrainingMode.jsx";
import { GraduationCap, ArrowLeft, ExternalLink, Globe, Award, UsersRound, Video, Search, TentTree } from "lucide-react";
import coursesDataJSON from "../data/coursesData.json";
import { BildungsurlaubModal } from "./BildungsurlaubModal.jsx";
import { CourseDetailModal } from "./CourseDetailModal.jsx";

// Real-world course data
const courseCategories = [
  {
    id: "online",
    title: "Kostenlose Online-Kurse",
    icon: Globe,
    desc: "Staatliche & NGO-Angebote, frei zugänglich.",
    color: "blue",
    textColor: "text-blue-500"
  },
  {
    id: "partner",
    title: "Präsenz-Seminare & DB Partner",
    icon: UsersRound,
    desc: "Gewerkschaftliche Trainings und DB Initiativen.",
    color: "emerald",
    textColor: "text-emerald-500"
  },
  {
    id: "zertifikat",
    title: "Zertifikatslehrgänge",
    icon: Award,
    desc: "Noch nicht hinterlegt – im Pilotbetrieb mit der DB abzustimmen.",
    color: "red",
    textColor: "text-red-500"
  },
  {
    id: "training",
    title: "Interaktives App-Training",
    icon: Video,
    desc: "Unser In-App Szenario-Simulator für Zivilcourage.",
    color: "amber",
    textColor: "text-amber-500"
  }
];

const coursesData = coursesDataJSON;

export function LearningHubView() {
  const [activeCategory, setActiveCategory] = useState(null); // null | 'online' | 'partner' | 'zertifikat' | 'training'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseForLeave, setSelectedCourseForLeave] = useState(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);

  // Header UI
  const renderHeader = () => (
    <div className="bg-surface-inverse p-5 text-ink-inverse relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-db-warm ">
            <GraduationCap className="h-3.5 w-3.5 text-amber-400" />
            <span>Wissen &amp; Vorbeugen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Kurs- & Seminar-Katalog
          </h1>
          <p className="text-sm font-medium text-white/80 leading-relaxed">
            Geprüfte Angebote von Bundeszentrale, Gewerkschaften und Fachstellen — mit Direktlink zum jeweiligen Anbieter.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-db-warm group-focus-within:text-db-red transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Kurse durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-db-red focus:bg-white/20 transition-all  shadow-inner"
          />
        </div>
      </div>
    </div>
  );

  const allCourses = Object.values(coursesData).flat();
  const filteredCourses = searchQuery.trim() !== ""
    ? allCourses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const renderCourse = (course) => (
    <div key={course.id} className="rounded-md border border-line/10 bg-surface p-5 sm:p-5 shadow-sm hover:shadow-md transition group">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-ink">{course.title}</h3>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider">{course.provider}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {course.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded bg-db-warm/50 dark:bg-db-dark/30 border border-line/5  text-sm font-bold text-ink">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm font-semibold text-db-dark/80 dark:text-white/80 max-w-2xl leading-relaxed">
            {course.desc}
          </p>
          {course.requirements && (
            <div className="mt-3 rounded-lg bg-surface-sunk  p-3 border border-line/5 ">
              <p className="text-sm font-bold text-ink mb-1">Was du dafür brauchst:</p>
              <p className="text-sm font-normal text-ink-muted">{course.requirements}</p>
            </div>
          )}
        </div>
        {course.link !== "" && (
          <div className="shrink-0 pt-2 sm:pt-0 flex flex-col gap-2">
            <button
              onClick={() => setSelectedCourseDetail(course)}
              className="inline-flex items-center gap-2 rounded-lg bg-db-dark px-4 py-2 text-sm font-bold text-white hover:bg-db-dark/90 transition shadow-sm w-full sm:w-auto justify-center"
            >
              Details ansehen <ExternalLink className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelectedCourseForLeave(course)}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700 hover:bg-teal-100 border border-teal-200 transition shadow-sm w-full sm:w-auto justify-center"
            >
              <TentTree className="h-4 w-4" /> Bildungsurlaub
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Search Results View
  if (searchQuery.trim() !== "") {
    return (
      <div className="space-y-6 animate-fadeIn">
        {renderHeader()}
        
        <div className="mb-6 border-b border-line/10 pb-4">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <Search className="h-6 w-6 text-ink" />
            Suchergebnisse für "{searchQuery}"
          </h2>
          <p className="text-sm font-normal text-ink-muted mt-1">
            {filteredCourses.length} {filteredCourses.length === 1 ? "Kurs" : "Kurse"} gefunden
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredCourses.map(renderCourse)}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-ink font-bold">Keine Kurse gefunden.</p>
              <p className="text-sm text-ink-muted">Probiere einen anderen Suchbegriff (z.B. "Online" oder "Konflikt").</p>
            </div>
          )}
        </div>

        <BildungsurlaubModal
          course={selectedCourseForLeave}
          onClose={() => setSelectedCourseForLeave(null)}
        />
        <CourseDetailModal
          course={selectedCourseDetail}
          onClose={() => setSelectedCourseDetail(null)}
        />
      </div>
    );
  }

  // Grid Selection View
  if (!activeCategory) {
    return (
      <div className="space-y-8 animate-fadeIn">
        {renderHeader()}

        <div className="text-center space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
            {courseCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group rounded-xl border border-line/10 bg-surface p-5 hover:-translate-y-1 hover:border-db-dark dark:hover:border-white/50 transition shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`h-6 w-6 ${cat.textColor}`} />
                    <span className="font-bold text-ink text-lg group-hover:text-db-red dark:group-hover:text-db-red transition-colors">{cat.title}</span>
                  </div>
                  <p className="text-sm font-normal text-ink-muted">{cat.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Detail View: In-App Training
  if (activeCategory === "training") {
    return (
      <div className="space-y-6 animate-fadeIn">
        {renderHeader()}
        <button
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-db-red dark:hover:text-db-red transition"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück zum Katalog
        </button>
        <div className="rounded-md bg-surface border border-line/10 p-4 sm:p-5 shadow-sm">
          <TrainingMode />
        </div>
      </div>
    );
  }

  // Detail View: External Courses (Online, Partner, Zertifikat)
  const currentCategoryObj = courseCategories.find(c => c.id === activeCategory) || courseCategories[0];
  const coursesList = coursesData[activeCategory] || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {renderHeader()}
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-db-red dark:hover:text-db-red transition"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück zum Katalog
        </button>
      </div>

      <div className="mb-6 border-b border-line/10 pb-4">
        <h2 className="text-xl font-bold text-ink flex items-center gap-2">
          <currentCategoryObj.icon className={`h-6 w-6 ${currentCategoryObj.textColor}`} />
          {currentCategoryObj.title}
        </h2>
        <p className="text-sm font-normal text-ink-muted mt-1">
          {currentCategoryObj.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {coursesList.map(renderCourse)}
      </div>

      <BildungsurlaubModal
        course={selectedCourseForLeave}
        onClose={() => setSelectedCourseForLeave(null)}
      />

      <CourseDetailModal
        course={selectedCourseDetail}
        onClose={() => setSelectedCourseDetail(null)}
      />
    </div>
  );
}
