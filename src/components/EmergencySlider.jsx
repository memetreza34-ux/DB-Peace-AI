import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Phone, CheckCircle2, MapPin, Loader2 } from "lucide-react";

export function EmergencySlider({ phoneNumber, label, colorClass = "bg-red-500", iconColor = "text-red-500" }) {
  const [isTriggered, setIsTriggered] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(false); // false = not sending, true = sent
  const [containerWidth, setContainerWidth] = useState(280);
  const containerRef = useRef(null);
  const timeout1Ref = useRef(null);
  const timeout2Ref = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const controls = useAnimation();
  const x = useMotionValue(0);
  const thumbWidth = 56;
  const maxDrag = Math.max(0, containerWidth - thumbWidth - 8);

  // Opacity of the text fades out as we drag
  const textOpacity = useTransform(x, [0, maxDrag / 2], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x >= maxDrag - 20) {
      // Triggered!
      setIsTriggered(true);
      controls.start({ x: maxDrag });
      
      // Simulate GPS dispatch
      timeout1Ref.current = setTimeout(() => {
        setGpsStatus(true);
        timeout2Ref.current = setTimeout(() => {
          // Execute call after GPS simulation
          window.location.href = `tel:${phoneNumber.replace(/\\s+/g, '')}`;
        }, 1500);
      }, 1500);
    } else {
      // Not dragged enough, snap back
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const handleCancel = () => {
    clearTimeout(timeout1Ref.current);
    clearTimeout(timeout2Ref.current);
    setIsTriggered(false);
    setGpsStatus(false);
    controls.start({ x: 0 });
  };

  if (isTriggered) {
    return (
      <div className="space-y-2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full h-16 flex items-center justify-center text-white font-bold shadow-schwebend transition-colors duration-500 ${gpsStatus ? 'bg-emerald-500' : 'bg-db-dark'}`}
        >
          {!gpsStatus ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin text-amber-400" />
              <MapPin className="h-4 w-4 mr-1 text-amber-400" />
              <span className="text-sm">GPS wird gesendet...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-6 w-6 mr-2" />
              <span className="text-sm">Standort übermittelt. Anruf startet...</span>
            </>
          )}
        </motion.div>
        {!gpsStatus && (
          <button 
            onClick={handleCancel}
            className="w-full py-2 text-sm font-medium text-db-rail hover:text-db-dark transition"
          >
            Abbrechen
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full h-16 overflow-hidden flex items-center p-1 ${colorClass} bg-opacity-20 `}>
      <motion.div 
        style={{ opacity: textOpacity }}
        className="absolute w-full pointer-events-none pl-16 text-center font-schild text-base font-bold uppercase tracking-[0.14em] text-ink"
      >
        {label}
      </motion.div>
      
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`h-14 w-14 bg-white flex items-center justify-center shadow-schwebend cursor-grab active:cursor-grabbing z-10 ${iconColor}`}
      >
        <Phone className="h-6 w-6" />
      </motion.div>
      
      {/* Track Background */}
      <div className={`absolute inset-0 -z-10 ${colorClass} opacity-10`}></div>
    </div>
  );
}
