import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Gauge, AlertTriangle, Unplug } from "lucide-react";
import VitalTile from "./VitalTile";
import SearchBox from "@/components/SearchBox";
import { cn } from "@/lib/utils";

export default function VentStatusPanel({ data, statuses, novice }) {
  const [expanded, setExpanded] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const hasAlert = data.disconnection || data.leakStatus !== "None";

  return (
    <div className="flex flex-col gap-3 h-full">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between gap-2 group"
      >
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-violet-400" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Vent Status
          </h2>
          {hasAlert && !expanded && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </motion.span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col gap-3"
          >
            {/* Safety alerts */}
            {data.disconnection && (
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="flex items-center gap-2 rounded-xl bg-red-950/60 border border-red-500/70 p-3"
              >
                <Unplug className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm font-semibold text-red-300">DISCONNECTION</p>
                  <p className="text-[10px] text-red-400/80">Check circuit immediately</p>
                </div>
              </motion.div>
            )}

            {data.leakStatus !== "None" && !data.disconnection && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-950/40 border border-amber-500/50 p-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-sm font-semibold text-amber-300">Leak: {data.leakStatus}</p>
                  <p className="text-[10px] text-amber-400/70">Monitor circuit integrity</p>
                </div>
              </div>
            )}

            {/* Pressure tiles */}
            <div className="grid grid-cols-2 gap-3">
              <VitalTile
                label={novice ? "Peak Pressure" : "PIP"}
                value={data.pip}
                unit="cmH₂O"
                status={statuses.pip}
                novice={novice}
              />
              <VitalTile
                label="PEEP"
                value={data.peep}
                unit="cmH₂O"
                status={statuses.peep}
                novice={novice}
              />
            </div>

            {!novice && (
              <>
                <VitalTile
                  label="Plateau Pressure"
                  value={data.pplat}
                  unit="cmH₂O"
                  status={statuses.pplat}
                  novice={novice}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-3">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400">I:E Ratio</span>
                    <p className="font-mono text-lg font-bold text-slate-200 mt-1">{data.ieRatio}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-3">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400">Driving ΔP</span>
                    <p className="font-mono text-lg font-bold text-slate-200 mt-1">{data.pip - data.peep}</p>
                    <span className="text-[9px] text-slate-500">cmH₂O</span>
                  </div>
                </div>
              </>
            )}

            {/* No alerts indicator */}
            {!hasAlert && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-950/30 border border-emerald-700/30 p-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400/80 font-medium">All systems normal</span>
              </div>
            )}

            <SearchBox
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Type here..."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}