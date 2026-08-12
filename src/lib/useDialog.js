import { useEffect, useRef } from "react";

const FOKUSSIERBAR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Standardverhalten für modale Dialoge:
 * Escape schließt, Tab bleibt im Dialog gefangen, der Fokus springt beim Öffnen
 * hinein und beim Schließen dorthin zurück, wo er herkam.
 *
 * Rückgabe: ref, die auf den Dialog-Container gesetzt wird.
 */
export function useDialog(offen, onClose) {
  const ref = useRef(null);
  const zuvorFokussiert = useRef(null);

  useEffect(() => {
    if (!offen) return;

    zuvorFokussiert.current = document.activeElement;

    // Ersten sinnvollen Punkt fokussieren, sonst den Container selbst
    const ziel = ref.current?.querySelector(FOKUSSIERBAR) ?? ref.current;
    ziel?.focus?.();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const elemente = ref.current?.querySelectorAll(FOKUSSIERBAR);
      if (!elemente?.length) return;

      const erster = elemente[0];
      const letzter = elemente[elemente.length - 1];

      if (e.shiftKey && document.activeElement === erster) {
        e.preventDefault();
        letzter.focus();
      } else if (!e.shiftKey && document.activeElement === letzter) {
        e.preventDefault();
        erster.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Hintergrund nicht mitscrollen lassen
    const vorherigesOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = vorherigesOverflow;
      zuvorFokussiert.current?.focus?.();
    };
  }, [offen, onClose]);

  return ref;
}
