import React from "react";
import { Droplets, Syringe, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ResuscitationPanel({ data }) {
  const minutes = Math.floor(data.timeSinceAlert);
  const isUrgent = minutes > 60;

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Droplets className="w-4 h-4 text-sky-400" />
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Resuscitation
        </h2>
      </div>

      {/* Time Since Alert */}
      <div className={`rounded-xl p-3 ${isUrgent ? 'bg-red-950/50 border border-red-500/50' : 'bg-slate-700/40'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-400' : 'text-slate-400'}`} />
            <span className="text-xs text-slate-400">Time Since Alert</span>
          </div>
          <div className="flex items-baseline gap-1">
            <motion.span
              key={minutes}
              initial={{ scale: 1.2, color: isUrgent ? "#ef4444" : "#3b82f6" }}
              animate={{ scale: 1, color: isUrgent ? "#fca5a5" : "#60a5fa" }}
              className="text-2xl font-bold tabular-nums"
            >
              {minutes}
            </motion.span>
            <span className="text-xs text-slate-500">min</span>
          </div>
        </div>
        {isUrgent && (
          <p className="text-[10px] text-red-300 mt-1 font-medium">
            ⚠ Approaching 1-hour bundle deadline
          </p>
        )}
      </div>

      {/* Fluids */}
      <div className="rounded-xl bg-slate-700/40 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-medium text-slate-300">Fluids Given</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-sky-400 tabular-nums">
            {data.fluidsGiven.toFixed(1)}
          </span>
          <span className="text-sm text-slate-500">L crystalloids</span>
        </div>
        <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(data.fluidsGiven / 3) * 100}%` }}
            className="h-full bg-gradient-to-r from-sky-500 to-sky-400"
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          Target: 30 mL/kg (~2.5-3L)
        </p>
      </div>

      {/* Vasopressor */}
      <div className="rounded-xl bg-slate-700/40 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Syringe className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-medium text-slate-300">Vasopressor</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-purple-300 font-medium">
            {data.vasopressor}
          </span>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-purple-400"
            />
            <span className="text-[10px] text-purple-300 font-semibold">RUNNING</span>
          </div>
        </div>
      </div>
    </div>
  );
}