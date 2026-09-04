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
    <div className="border-l-4 border-db-red pl-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 font-schild text-sm font-semibold uppercase tracking-[0.18em] text-ink-muted">
            <GraduationCap className="h-4 w-4 text-db-red" />
            <span>Wissen &amp; Vorbeugen</span>
          </div>
          <h1 className="mt-2 font-schild text-4xl font-bold leading-[0.98] tracking-tight text-ink">
            Kurs- & Seminar-Katalog
          </h1>
          <p className="mt-3 max-w-[52ch] text-base font-normal leading-relaxed text-ink-muted">
            Geprüfte Angebote von Bundeszentrale, Gewerkschaften und Fachstellen — mit Direktlink zum jeweiligen Anbieter.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-ink-muted group-focus-within:text-db-red transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Kurse durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-line/20 bg-surface py-3 pl-10 pr-4 text-base font-normal text-ink transition placeholder:text-ink-muted focus:border-db-red focus:outline-none focus:ring-2 focus:ring-db-red/20"
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

  /*
   * Ein Kurs als Tafel-Zeile. Links steht der Anbieter — bei geprüften
   * Angeboten von aussen ist das die Frage, die vor dem Klicken kommt: von wem
   * ist das eigentlich?
   */
  const renderCourse = (course) => (
    <div key={course.id} className="group border-b border-line/15 py-5">
      <div className="grid gap-x-4 sm:grid-cols-[104px_1fr]">
        <p className="font-schild text-xs font-semibold uppercase leading-tight tracking-[0.12em] text-ink-muted">
          {course.provider}
        </p>
        <div className="mt-1 sm:mt-0">
          <h3 className="font-schild text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">
            {course.title}
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm font-normal leading-relaxed text-ink-muted">
            {course.desc}
          </p>

          {course.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-line/20 px-2.5 py-1 font-schild text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {course.requirements && (
            <p className="mt-3 border-l-2 border-line/20 pl-3 text-sm font-normal leading-relaxed text-ink-muted">
              <span className="font-semibold text-ink">Was du dafür brauchst: </span>
              {course.requirements}
            </p>
          )}

          {course.link !== "" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCourseDetail(course)}
                className="inline-flex min-h-11 items-center gap-2 bg-contrast px-4 font-schild text-base font-bold text-contrast-ink transition hover:opacity-90"
              >
                Details ansehen <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedCourseForLeave(course)}
                className="inline-flex min-h-11 items-center gap-2 border border-line/20 px-4 font-schild text-base font-bold text-ink transition hover:border-db-red hover:text-db-red"
              >
                <TentTree className="h-4 w-4" /> Bildungsurlaub
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Search Results View
  if (searchQuery.trim() !== "") {
    return (
      <div className="space-y-6 animate-fadeIn">
        {renderHeader()}
        
        <div className="mb-6 border-b border-line/10 pb-4">
          <h2 className="text-xl font-schild font-bold text-ink flex items-center gap-2">
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

        <div className="py-4">
          <h2 className="border-b-2 border-ink pb-2 font-schild text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            Wonach suchst du?
          </h2>
          <div>
            {courseCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group flex w-full items-baseline gap-3 border-b border-line/15 py-4 text-left transition hover:bg-line/5"
                >
                  <Icon className="h-5 w-5 shrink-0 translate-y-1 text-ink" />
                  <span className="flex-1">
                    <span className="block font-schild text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">
                      {cat.title}
                    </span>
                    <span className="mt-1 block text-sm font-normal leading-snug text-ink-muted">
                      {cat.desc}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="self-center text-lg text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-db-red"
                  >
                    →
                  </span>
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
        <h2 className="text-xl font-schild font-bold text-ink flex items-center gap-2">
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
