import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ModeToggle({ novice, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(true)}
        className={cn(
          "relative px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors",
          novice ? "text-white" : "text-slate-500 hover:text-slate-300"
        )}
      >
        {novice && (
          <motion.div
            layoutId="modeIndicator"
            className="absolute inset-0 rounded-lg bg-sky-600/80"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">Novice</span>
      </button>
      <button
        onClick={() => onChange(false)}
        className={cn(
          "relative px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors",
          !novice ? "text-white" : "text-slate-500 hover:text-slate-300"
        )}
      >
        {!novice && (
          <motion.div
            layoutId="modeIndicator"
            className="absolute inset-0 rounded-lg bg-violet-600/80"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">Expert</span>
      </button>
    </div>
  );
}