import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "db-peace-theme";

export function ThemeToggle() {
  const reduceMotion = useReducedMotion();
  const [isDark, setIsDark] = useState(() => getInitialTheme() === "dark");

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    const saved = readStoredTheme();
    if (saved) return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function handleChange(event) {
      setIsDark(event.matches);
    }
    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Das Farbschema funktioniert auch ohne verfügbaren Browser-Speicher.
    }
  }

  return (
    <button type="button" onClick={toggleTheme} className="relative flex h-10 w-10 items-center justify-center rounded-xl text-db-dark transition hover:bg-db-dark/5 focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:text-white dark:hover:bg-white/10" aria-label={isDark ? "Helles Farbschema aktivieren" : "Dunkles Farbschema aktivieren"} aria-pressed={isDark}>
      <motion.span initial={false} animate={reduceMotion ? undefined : { rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }} className={`absolute ${reduceMotion && isDark ? "hidden" : ""}`}>
        <Sun className="h-5 w-5" aria-hidden="true" />
      </motion.span>
      <motion.span initial={false} animate={reduceMotion ? undefined : { rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0 }} className={reduceMotion && !isDark ? "hidden" : ""}>
        <Moon className="h-5 w-5" aria-hidden="true" />
      </motion.span>
    </button>
  );
}

function getInitialTheme() {
  const stored = readStoredTheme();
  if (stored) return stored;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

function readStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}
