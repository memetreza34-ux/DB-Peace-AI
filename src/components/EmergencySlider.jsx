import React, { useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Phone, CheckCircle2 } from "lucide-react";

export function EmergencySlider({ phoneNumber, label, colorClass = "bg-red-500", iconColor = "text-red-500" }) {
  const [isTriggered, setIsTriggered] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerWidth = 280; // approximate width of the slider container
  const thumbWidth = 56;
  const maxDrag = containerWidth - thumbWidth - 8; // 8 for padding/margin

  // Opacity of the text fades out as we drag
  const textOpacity = useTransform(x, [0, maxDrag / 2], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x >= maxDrag - 20) {
      // Triggered!
      setIsTriggered(true);
      controls.start({ x: maxDrag });
      // Execute call
      window.location.href = `tel:${phoneNumber.replace(/\s+/g, '')}`;
    } else {
      // Not dragged enough, snap back
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  if (isTriggered) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg"
      >
        <CheckCircle2 className="h-6 w-6 mr-2" />
        Anruf wird gestartet...
      </motion.div>
    );
  }

  return (
    <div className={`relative w-full h-16 rounded-full overflow-hidden flex items-center p-1 shadow-inner ${colorClass} bg-opacity-20 backdrop-blur-md`}>
      <motion.div 
        style={{ opacity: textOpacity }}
        className="absolute w-full text-center pointer-events-none text-sm font-black tracking-wide text-db-dark mix-blend-overlay opacity-70 uppercase"
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
        className={`h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing z-10 ${iconColor}`}
      >
        <Phone className="h-6 w-6" />
      </motion.div>
      
      {/* Track Background */}
      <div className={`absolute inset-0 -z-10 ${colorClass} opacity-10`}></div>
    </div>
  );
}
