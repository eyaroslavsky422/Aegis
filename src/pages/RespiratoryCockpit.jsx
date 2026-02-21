import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSimulatedData from "../components/cockpit/useSimulatedData";
import CirculationPanel from "../components/cockpit/CirculationPanel";
import OxygenationPanel from "../components/cockpit/OxygenationPanel";
import VentStatusPanel from "../components/cockpit/VentStatusPanel";
import ModeToggle from "../components/cockpit/ModeToggle";
import { Siren, Clock } from "lucide-react";

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-mono text-xs text-slate-400 tabular-nums">
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

export default function RespiratoryCockpit() {
  const { data, statuses, waveform } = useSimulatedData();
  const [novice, setNovice] = useState(true);

  const hasCritical = Object.values(statuses).some(s => s === "critical") || data.disconnection;

  return (
    <div className={`min-h-screen bg-slate-950 text-white transition-colors duration-700 ${
      hasCritical ? "bg-[radial-gradient(ellipse_at_center,_rgba(127,29,29,0.15)_0%,_rgb(2,6,23)_70%)]" : ""
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60">
        <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Siren className="w-5 h-5 text-red-400" />
              <h1 className="text-sm font-bold tracking-wide">
                RESPIRATORY <span className="text-sky-400">COCKPIT</span>
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/40">
              <div className={`w-1.5 h-1.5 rounded-full ${hasCritical ? "bg-red-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                {hasCritical ? "Alert Active" : "Monitoring"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle novice={novice} onChange={setNovice} />
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <LiveClock />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-screen-2xl mx-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={novice ? "novice" : "expert"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`grid gap-4 ${
              novice
                ? "grid-cols-1 lg:grid-cols-[1fr_2fr_1fr]"
                : "grid-cols-1 lg:grid-cols-[280px_1fr_280px]"
            }`}
          >
            {/* LEFT — Circulation */}
            <section className="order-2 lg:order-1">
              <CirculationPanel data={data} statuses={statuses} novice={novice} />
            </section>

            {/* CENTER — Oxygenation & Ventilation */}
            <section className="order-1 lg:order-2">
              <OxygenationPanel data={data} statuses={statuses} waveform={waveform} novice={novice} />
            </section>

            {/* RIGHT — Vent Status & Safety */}
            <section className="order-3">
              <VentStatusPanel data={data} statuses={statuses} novice={novice} />
            </section>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom safety bar */}
      {hasCritical && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <div className="bg-red-950/90 backdrop-blur-lg border-t border-red-500/50 px-4 py-2.5">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-red-400"
              />
              <span className="text-sm font-semibold text-red-200 tracking-wide">
                CRITICAL VALUES DETECTED — ASSESS PATIENT IMMEDIATELY
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}