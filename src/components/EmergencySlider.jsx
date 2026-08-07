import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { CheckCircle2, Phone, X } from "lucide-react";

export function EmergencySlider({ phoneNumber, label, colorClass = "bg-red-500", iconColor = "text-red-500" }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [containerWidth, setContainerWidth] = useState(280);
  const containerRef = useRef(null);
  const thumbRef = useRef(null);
  const callButtonRef = useRef(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const thumbWidth = 56;
  const maxDrag = Math.max(0, containerWidth - thumbWidth - 8);
  const textOpacity = useTransform(x, [0, Math.max(1, maxDrag / 2)], [1, 0]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    function updateWidth() {
      const width = container.getBoundingClientRect().width;
      if (width > 0) setContainerWidth(width);
    }

    updateWidth();
    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(container);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (isConfirmed) window.requestAnimationFrame(() => callButtonRef.current?.focus());
  }, [isConfirmed]);

  function confirm() {
    setIsConfirmed(true);
    void controls.start({ x: maxDrag });
  }

  function handleDragEnd(_event, info) {
    if (maxDrag > 0 && info.offset.x >= maxDrag - 20) {
      confirm();
      return;
    }
    void controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 22 } });
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    confirm();
  }

  function cancel() {
    setIsConfirmed(false);
    void controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 22 } });
    window.requestAnimationFrame(() => thumbRef.current?.focus());
  }

  function startCall() {
    const sanitizedNumber = String(phoneNumber).replace(/[^\d+]/g, "");
    if (!/^\+?\d{3,15}$/.test(sanitizedNumber)) return;
    window.location.assign(`tel:${sanitizedNumber}`);
  }

  if (isConfirmed) {
    return (
      <div className="rounded-2xl border border-db-dark/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-db-dark/50" role="group" aria-label={`Anruf bei ${phoneNumber} bestätigen`}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <p className="font-black text-db-dark dark:text-white">Anruf bestätigen</p>
            <p className="mt-1 text-sm font-semibold text-db-rail dark:text-white/60">
              Die Telefon-App wird mit <strong>{phoneNumber}</strong> geöffnet. Die App sendet keinen Standort und keine weiteren Daten.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={cancel} className="flex items-center justify-center gap-2 rounded-xl border border-db-dark/15 px-4 py-2.5 text-sm font-black text-db-dark focus:outline-none focus:ring-2 focus:ring-db-red/30 dark:border-white/15 dark:text-white">
            <X className="h-4 w-4" aria-hidden="true" />
            Abbrechen
          </button>
          <button ref={callButtonRef} type="button" onClick={startCall} className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-black text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40">
            <Phone className="h-4 w-4" aria-hidden="true" />
            Anrufen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative flex h-16 w-full items-center overflow-hidden rounded-full p-1 shadow-inner ${colorClass} bg-opacity-20`}>
      <motion.div style={{ opacity: textOpacity }} className="pointer-events-none absolute w-full px-16 text-center text-sm font-black uppercase tracking-wide text-db-dark/70 dark:text-white/80">
        {label}
      </motion.div>
      <motion.div
        ref={thumbRef}
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        onKeyDown={handleKeyDown}
        animate={controls}
        style={{ x }}
        whileTap={{ scale: 0.95 }}
        className={`z-10 flex h-14 w-14 cursor-grab items-center justify-center rounded-full bg-white shadow-md outline-none active:cursor-grabbing focus:ring-4 focus:ring-db-red/30 ${iconColor}`}
        role="button"
        tabIndex={0}
        aria-pressed="false"
        aria-label={`${label}. Nach rechts wischen oder Enter drücken und anschließend den Anruf bestätigen.`}
      >
        <Phone className="h-6 w-6" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
