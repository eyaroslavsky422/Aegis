import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statusStyles = {
  normal: {
    bg: "bg-slate-800/60 border-slate-700/50",
    text: "text-emerald-400",
    glow: "",
    scale: 1,
  },
  warning: {
    bg: "bg-amber-950/40 border-amber-500/60",
    text: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    scale: 1.02,
  },
  critical: {
    bg: "bg-red-950/50 border-red-500/70",
    text: "text-red-400",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.25)]",
    scale: 1.05,
  },
};

export default function VitalTile({ label, value, unit, status = "normal", large, novice, sublabel, children }) {
  const s = statusStyles[status] || statusStyles.normal;

  return (
    <motion.div
      layout
      animate={{ scale: s.scale }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "rounded-2xl border backdrop-blur-sm p-3 flex flex-col justify-between transition-colors duration-500",
        s.bg, s.glow,
        large ? "min-h-[120px]" : "min-h-[90px]"
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 leading-tight">
          {label}
        </span>
        {unit && (
          <span className="text-[10px] text-slate-500 font-mono shrink-0">{unit}</span>
        )}
      </div>

      {children ? (
        <div className="flex-1 flex items-center">{children}</div>
      ) : (
        <div className="flex items-baseline gap-1 mt-auto">
          <motion.span
            key={value}
            initial={{ opacity: 0.6, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "font-mono font-bold tracking-tight leading-none",
              s.text,
              large ? "text-4xl" : novice ? "text-3xl" : "text-2xl"
            )}
          >
            {value}
          </motion.span>
          {sublabel && (
            <span className="text-[10px] text-slate-500 ml-1">{sublabel}</span>
          )}
        </div>
      )}

      {status === "critical" && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl border-2 border-red-500/40 pointer-events-none"
        />
      )}
    </motion.div>
  );
}