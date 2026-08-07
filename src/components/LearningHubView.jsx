import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpenCheck,
  GraduationCap,
  Info,
  Search,
  TentTree,
  UsersRound,
  Video,
} from "lucide-react";
import coursesDataJSON from "../data/coursesData.json";
import TrainingMode from "./TrainingMode.jsx";
import { BildungsurlaubModal } from "./BildungsurlaubModal.jsx";
import { CourseDetailModal } from "./CourseDetailModal.jsx";

const categoryDefinitions = [
  {
    id: "online",
    title: "Fiktive Online-Beispiele",
    icon: BookOpenCheck,
    description: "Vollständig erfundene Datensätze zum Testen der digitalen Katalogansicht.",
    iconClass: "text-blue-600",
  },
  {
    id: "praesenz",
    title: "Fiktive Präsenz-Beispiele",
    icon: UsersRound,
    description: "Erfundene Workshops ohne reale Anbieter-, Termin- oder Buchungsdaten.",
    iconClass: "text-emerald-600",
  },
  {
    id: "zertifikat",
    title: "Demo-Einträge mit Abschlussfeld",
    icon: Award,
    description: "Nur zur Darstellung der UI; kein Eintrag besitzt einen bestätigten Abschluss oder Nachweis.",
    iconClass: "text-red-600",
  },
  {
    id: "training",
    title: "In-App-Demo-Training",
    icon: Video,
    description: "Lokaler Szenario-Simulator ohne offiziellen Abschluss, Punktzahl oder Kompetenzmessung.",
    iconClass: "text-amber-600",
  },
];

const coursesData = coursesDataJSON;

export function LearningHubView() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseForLeave, setSelectedCourseForLeave] = useState(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);

  const allCourses = useMemo(
    () => Object.values(coursesData).flat().map(normalizeCourse),
    [],
  );

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("de-DE");
    if (!query) return [];

    return allCourses.filter((course) =>
      [course.title, course.provider, course.description, course.tags.join(" ")]
        .join(" ")
        .toLocaleLowerCase("de-DE")
        .includes(query),
    );
  }, [allCourses, searchQuery]);

  const currentCategory = categoryDefinitions.find((category) => category.id === activeCategory);
  const currentCourses = activeCategory && activeCategory !== "training"
    ? (coursesData[activeCategory] || []).map(normalizeCourse)
    : [];

  function renderHeader() {
    return (
      <header className="relative overflow-hidden rounded-xl bg-gradient-to-r from-db-dark to-slate-700 p-6 text-white shadow-md">
        <div className="grid gap-6 md:grid-cols-[1fr_19rem] md:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-red-100">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Lern- und Präventionsprototyp
            </div>
            <h1 className="mt-3 text-3xl font-black">Fiktiven Demo-Lernkatalog ausprobieren</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
              Alle {allCourses.length} Katalogeinträge sind bewusst erfunden. Anbieter, Titel, Termine, Kosten,
              Anerkennung und Verfügbarkeit stellen keine realen Angebote dar.
            </p>
          </div>

          <label className="relative block">
            <span className="sr-only">Fiktive Demo-Kurse durchsuchen</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              maxLength={120}
              onChange={(event) => setSearchQuery(event.target.value.slice(0, 120))}
              placeholder="Demo-Einträge durchsuchen"
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none placeholder:text-white/45 focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/30"
            />
          </label>
        </div>
      </header>
    );
  }

  function renderNotice() {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/25 dark:text-amber-100">
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          Diese Liste ist ausschließlich Testmaterial für den Prototyp. Sie ist weder Empfehlung noch Buchungsplattform.
          Für ein echtes Lernangebot müssen Anbieter, Kursseite, Termin, Kosten, Anerkennung und betriebliche Freistellung separat recherchiert und bestätigt werden.
        </p>
      </div>
    );
  }

  function renderCourse(course) {
    return (
      <article
        key={course.id}
        className="rounded-xl border border-db-dark/10 bg-white p-5 shadow-sm transition hover:border-db-dark/20 hover:shadow-md dark:border-white/10 dark:bg-white/5"
      >
        <div className="flex flex-col justify-between gap-5 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-violet-800">
                Fiktiver Demo-Eintrag
              </span>
              <span className="text-xs font-bold text-db-rail dark:text-white/50">{course.provider}</span>
            </div>
            <h2 className="mt-3 text-lg font-black text-db-dark dark:text-white">{course.title}</h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-db-rail dark:text-white/65">
              {course.description}
            </p>

            {course.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="rounded-lg border border-db-dark/5 bg-db-soft px-2.5 py-1 text-[10px] font-black text-db-dark dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:w-48 lg:flex-col">
            <button
              type="button"
              onClick={() => setSelectedCourseDetail(course.raw)}
              className="rounded-xl bg-db-dark px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-db-red/30"
            >
              Details und Demo-Training
            </button>
            <button
              type="button"
              onClick={() => setSelectedCourseForLeave(course.raw)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-black text-teal-800 transition hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
            >
              <TentTree className="h-4 w-4" aria-hidden="true" />
              Prüfanfrage als Demo
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (searchQuery.trim()) {
    return (
      <div className="space-y-6">
        {renderHeader()}
        {renderNotice()}
        <section>
          <h2 className="text-2xl font-black text-db-dark dark:text-white">Suchergebnisse</h2>
          <p className="mt-1 text-sm font-semibold text-db-rail dark:text-white/60">
            {filteredCourses.length} fiktive Demo-Einträge für „{searchQuery}“
          </p>
          <div className="mt-5 grid gap-4">
            {filteredCourses.length > 0 ? filteredCourses.map(renderCourse) : (
              <div className="rounded-xl border border-db-dark/10 bg-white p-8 text-center dark:border-white/10 dark:bg-white/5">
                <p className="font-black text-db-dark dark:text-white">Keine passenden Demo-Einträge gefunden.</p>
              </div>
            )}
          </div>
        </section>
        <Modals
          selectedCourseDetail={selectedCourseDetail}
          selectedCourseForLeave={selectedCourseForLeave}
          setSelectedCourseDetail={setSelectedCourseDetail}
          setSelectedCourseForLeave={setSelectedCourseForLeave}
        />
      </div>
    );
  }

  if (!activeCategory) {
    return (
      <div className="space-y-6">
        {renderHeader()}
        {renderNotice()}
        <div className="grid gap-4 sm:grid-cols-2">
          {categoryDefinitions.map((category) => {
            const Icon = category.icon;
            const count = category.id === "training" ? 1 : (coursesData[category.id] || []).length;
            return (
              <button
                type="button"
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="rounded-xl border border-db-dark/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-db-red hover:shadow-md focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${category.iconClass}`} aria-hidden="true" />
                    <h2 className="font-black text-db-dark dark:text-white">{category.title}</h2>
                  </div>
                  <span className="rounded-full bg-db-soft px-2.5 py-1 text-xs font-black text-db-rail dark:bg-white/10 dark:text-white/60">{count}</span>
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-db-rail dark:text-white/60">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeCategory === "training") {
    return (
      <div className="space-y-6">
        {renderHeader()}
        <BackButton onClick={() => setActiveCategory(null)} />
        {renderNotice()}
        <div className="rounded-xl border border-db-dark/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6">
          <TrainingMode />
        </div>
      </div>
    );
  }

  const CategoryIcon = currentCategory?.icon || GraduationCap;

  return (
    <div className="space-y-6">
      {renderHeader()}
      <BackButton onClick={() => setActiveCategory(null)} />
      {renderNotice()}
      <section>
        <div className="flex items-center gap-3 border-b border-db-dark/10 pb-4 dark:border-white/10">
          <CategoryIcon className={`h-6 w-6 ${currentCategory?.iconClass || "text-db-red"}`} aria-hidden="true" />
          <div>
            <h2 className="text-2xl font-black text-db-dark dark:text-white">{currentCategory?.title}</h2>
            <p className="mt-1 text-sm font-semibold text-db-rail dark:text-white/60">{currentCategory?.description}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4">{currentCourses.map(renderCourse)}</div>
      </section>
      <Modals
        selectedCourseDetail={selectedCourseDetail}
        selectedCourseForLeave={selectedCourseForLeave}
        setSelectedCourseDetail={setSelectedCourseDetail}
        setSelectedCourseForLeave={setSelectedCourseForLeave}
      />
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-db-dark/10 bg-white px-4 py-2 text-sm font-black text-db-dark hover:border-db-red hover:text-db-red focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Zurück zu den Kategorien
    </button>
  );
}

function Modals({
  selectedCourseDetail,
  selectedCourseForLeave,
  setSelectedCourseDetail,
  setSelectedCourseForLeave,
}) {
  return (
    <>
      <BildungsurlaubModal course={selectedCourseForLeave} onClose={() => setSelectedCourseForLeave(null)} />
      <CourseDetailModal course={selectedCourseDetail} onClose={() => setSelectedCourseDetail(null)} />
    </>
  );
}

function normalizeCourse(course) {
  const raw = course || {};
  return {
    id: String(raw.id || `${raw.provider || "demo"}-${raw.title || "course"}`),
    title: String(raw.title || "Unbenannter Demo-Eintrag").slice(0, 180),
    provider: String(raw.provider || "Fiktiver Demo-Anbieter").slice(0, 140),
    description: String(raw.desc || "Keine Demo-Beschreibung hinterlegt.").slice(0, 1_200),
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => String(tag).slice(0, 50)).slice(0, 8) : [],
    raw,
  };
}
