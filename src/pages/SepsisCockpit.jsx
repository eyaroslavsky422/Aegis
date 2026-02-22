import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSepsisData from "../components/sepsis/useSepsisData";
import SepsisVitalsPanel from "../components/sepsis/SepsisVitalsPanel";
import SepsisMetricsPanel from "../components/sepsis/SepsisMetricsPanel";
import ResuscitationPanel from "../components/sepsis/ResuscitationPanel";
import SepsisActionMenu from "../components/sepsis/SepsisActionMenu";
import AmbulanceMap from "../components/map/AmbulanceMap";
import { PATIENTS } from "../components/map/patientData";
import { Siren, Clock, MapPin, Activity, ArrowLeft } from "lucide-react";
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

export default function SepsisCockpit() {
  const { data, statuses, primaryThreat, resetToNormal } = useSepsisData();
  const [resolvedPanel, setResolvedPanel] = useState(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('patient') || 'AMB-2401';
  const patient = PATIENTS.find(p => p.id === patientId) || PATIENTS[0];

  const hasCritical = Object.values(statuses).some(s => s === "critical") || primaryThreat;

  // Determine which panel has the primary threat
  const vitalsParams = ["hr", "map", "rr", "spo2", "temp"];
  const metricsParams = ["etco2", "lactate", "shockIndex", "qsofa"];
  
  const criticalPanel = resolvedPanel ? null :
    vitalsParams.includes(primaryThreat) ? "vitals" :
    metricsParams.includes(primaryThreat) ? "metrics" : null;

  const handleResolve = () => {
    if (primaryThreat) {
      resetToNormal([primaryThreat]);
      setResolvedPanel(criticalPanel);
      setTimeout(() => setResolvedPanel(null), 500);
    }
  };

  // Reset resolved state when new critical emerges
  useEffect(() => {
    if (!hasCritical) {
      setResolvedPanel(null);
    }
  }, [hasCritical]);

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
                <span className="text-sky-400">AEGIS</span> <span className="text-amber-400">SEPSIS</span>
              </h1>
            </div>
            <div className="hidden sm:block h-4 w-px bg-slate-700" />
            <div className="hidden sm:block text-xs">
              <p className="font-semibold text-slate-200">{patient.name}, {patient.age}</p>
              <p className="text-slate-500">{patient.id} • {patient.condition}</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-amber-900/60 border border-amber-700/40">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-medium text-amber-300 uppercase tracking-wider">
                Sepsis Alert Active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <LiveClock />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-screen-2xl mx-auto p-4">
        {/* Legend */}
        <div className="mb-4 px-4 py-2 bg-slate-800/40 rounded-xl border border-slate-700/30">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-amber-300">Amber</span> = warning • <span className="font-semibold text-red-300">Red</span> = critical • <span className="font-semibold text-purple-300">Purple</span> = immediate intervention (auto-expanded)
          </p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={criticalPanel || "normal"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`grid gap-4 ${
              criticalPanel === "vitals" ? "grid-cols-1 lg:grid-cols-[3fr_1fr_1fr]" :
              criticalPanel === "metrics" ? "grid-cols-1 lg:grid-cols-[1fr_3fr_1fr]" :
              "grid-cols-1 lg:grid-cols-3"
            }`}
          >
            {/* LEFT — Vital Signs */}
            <motion.section 
              layout
              className="order-1"
            >
              {criticalPanel === "vitals" && primaryThreat && (
                <SepsisActionMenu 
                  parameter={primaryThreat} 
                  onResolve={handleResolve}
                  inline={true}
                />
              )}
              <SepsisVitalsPanel 
                data={data} 
                statuses={statuses}
                primaryThreat={primaryThreat}
              />
            </motion.section>

            {/* CENTER — Sepsis Metrics */}
            <motion.section 
              layout
              className="order-2"
            >
              {criticalPanel === "metrics" && primaryThreat && (
                <SepsisActionMenu 
                  parameter={primaryThreat} 
                  onResolve={handleResolve}
                  inline={true}
                />
              )}
              <SepsisMetricsPanel 
                data={data} 
                statuses={statuses}
                primaryThreat={primaryThreat}
              />
            </motion.section>

            {/* RIGHT — Resuscitation */}
            <motion.section 
              layout
              className="order-3"
            >
              <ResuscitationPanel data={data} />
            </motion.section>
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Map Section */}
      <section className="max-w-screen-2xl mx-auto px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Location & Transport
            </h2>
          </div>
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">{patient.eta} min</span> to hospital
          </div>
        </div>
        <AmbulanceMap
          ambulancePos={patient.ambulancePos}
          hospitalPos={patient.hospitalPos}
          patientId={patient.id}
          eta={patient.eta}
          compact={true}
        />
      </section>

      {/* Bottom alert bar */}
      {hasCritical && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <div className="bg-amber-950/90 backdrop-blur-lg border-t border-amber-500/50 px-4 py-2.5">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-amber-400"
              />
              <span className="text-sm font-semibold text-amber-200 tracking-wide">
                SEPSIS CRITICAL VALUES — INITIATE BUNDLE PROTOCOL
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}