import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSimulatedData from "../components/cockpit/useSimulatedData";
import CirculationPanel from "../components/cockpit/CirculationPanel";
import OxygenationPanel from "../components/cockpit/OxygenationPanel";
import VentStatusPanel from "../components/cockpit/VentStatusPanel";
import ModeToggle from "../components/cockpit/ModeToggle";
import ActionMenu from "../components/cockpit/ActionMenu";
import { PATIENTS } from "../components/map/patientData";
import { Siren, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

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
  const { data, statuses, waveform, resetToNormal } = useSimulatedData();
  const [novice, setNovice] = useState(true);
  const [resolvedPanel, setResolvedPanel] = useState(null);
  
  // Get patient ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('patient') || 'AMB-2401';
  const patient = PATIENTS.find(p => p.id === patientId) || PATIENTS[0];

  const hasCritical = Object.values(statuses).some(s => s === "critical") || data.disconnection;

  // Determine which panel has critical values
  const circulationCritical = ["hr", "sbp", "dbp", "map"].filter(k => statuses[k] === "critical");
  const oxygenationCritical = ["spo2", "rr", "etco2", "fio2", "tv", "mv"].filter(k => statuses[k] === "critical");
  const ventStatusCritical = data.disconnection || data.leakStatus !== "None" || 
    ["pip", "peep", "pplat"].filter(k => statuses[k] === "critical").length > 0;

  const criticalPanel = resolvedPanel ? null :
    circulationCritical.length > 0 ? "circulation" :
    oxygenationCritical.length > 0 ? "oxygenation" :
    ventStatusCritical ? "ventStatus" : null;

  const criticalParams = 
    criticalPanel === "circulation" ? circulationCritical :
    criticalPanel === "oxygenation" ? oxygenationCritical :
    criticalPanel === "ventStatus" ? (data.disconnection ? ["disconnection"] : data.leakStatus !== "None" ? ["leakStatus"] : ["pip", "peep", "pplat"].filter(k => statuses[k] === "critical")) :
    [];

  const handleResolve = () => {
    resetToNormal(criticalParams);
    setResolvedPanel(criticalPanel);
    setTimeout(() => setResolvedPanel(null), 500);
  };



  return (
    <div className={`min-h-screen bg-slate-950 text-white transition-colors duration-700 ${
      hasCritical ? "bg-[radial-gradient(ellipse_at_center,_rgba(127,29,29,0.15)_0%,_rgb(2,6,23)_70%)]" : ""
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60">
        <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              to={createPageUrl("FleetOverview")} 
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Siren className="w-5 h-5 text-red-400" />
              <h1 className="text-sm font-bold tracking-wide">
                <span className="text-sky-400">AEGIS</span>
              </h1>
            </div>
            <div className="hidden sm:block h-4 w-px bg-slate-700" />
            <div className="hidden sm:block text-xs">
              <p className="font-semibold text-slate-200">{patient.name}, {patient.age}</p>
              <p className="text-slate-500">{patient.id} • {patient.condition}</p>
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
              criticalPanel === "circulation" ? "grid-cols-1 lg:grid-cols-[3fr_1fr_1fr]" :
              criticalPanel === "oxygenation" ? "grid-cols-1 lg:grid-cols-[1fr_3fr_1fr]" :
              criticalPanel === "ventStatus" ? "grid-cols-1 lg:grid-cols-[1fr_1fr_3fr]" :
              novice ? "grid-cols-1 lg:grid-cols-[1fr_2fr_1fr]" : "grid-cols-1 lg:grid-cols-[280px_1fr_280px]"
            }`}
          >
            {/* LEFT — Circulation */}
            <motion.section 
              layout
              className="order-2 lg:order-1"
            >
              {criticalPanel === "circulation" && (
                <ActionMenu 
                  panel="circulation" 
                  criticalParams={criticalParams}
                  onResolve={handleResolve}
                />
              )}
              <CirculationPanel data={data} statuses={statuses} novice={novice} />
            </motion.section>

            {/* CENTER — Oxygenation & Ventilation */}
            <motion.section 
              layout
              className="order-1 lg:order-2"
            >
              {criticalPanel === "oxygenation" && (
                <ActionMenu 
                  panel="oxygenation" 
                  criticalParams={criticalParams}
                  onResolve={handleResolve}
                />
              )}
              <OxygenationPanel data={data} statuses={statuses} waveform={waveform} novice={novice} />
            </motion.section>

            {/* RIGHT — Vent Status & Safety */}
            <motion.section 
              layout
              className="order-3"
            >
              {criticalPanel === "ventStatus" && (
                <ActionMenu 
                  panel="ventStatus" 
                  criticalParams={criticalParams}
                  onResolve={handleResolve}
                />
              )}
              <VentStatusPanel data={data} statuses={statuses} novice={novice} />
            </motion.section>
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