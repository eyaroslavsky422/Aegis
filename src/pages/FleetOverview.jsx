import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PATIENTS } from "../components/map/patientData";
import AmbulanceMap from "../components/map/AmbulanceMap";
import { Ambulance, MapPin, Clock, User, AlertCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FleetOverview() {
  const hospitalPos = PATIENTS[0].hospitalPos;
  
  // Sort patients by severity (number of critical params)
  const sortedPatients = [...PATIENTS].sort((a, b) => b.criticalParams.length - a.criticalParams.length);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Ambulance className="w-6 h-6 text-red-400" />
            <h1 className="text-lg font-bold tracking-wide">
              <span className="text-sky-400">AEGIS</span> <span className="text-slate-400">FLEET</span>
            </h1>
            <div className="ml-4 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/40">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {PATIENTS.length} Active Transports
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Patient List */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Active Patients <span className="text-xs font-normal text-slate-500">(Sorted by Severity)</span>
            </h2>
            {sortedPatients.map((patient, idx) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`${createPageUrl(patient.condition === "Sepsis" ? "SepsisCockpit" : "RespiratoryCockpit")}?patient=${patient.id}`}
                  className="block"
                >
                  <div className={cn(
                    "rounded-2xl border backdrop-blur-sm p-4 transition-all hover:scale-[1.02] cursor-pointer",
                    patient.criticalParams.length > 0
                      ? "bg-red-950/40 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                      : "bg-slate-800/60 border-slate-700/50 hover:border-slate-600"
                  )}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{patient.name}</p>
                          <p className="text-xs text-slate-400">{patient.id}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                      <div>
                        <p className="text-slate-500">Age</p>
                        <p className="text-slate-200 font-medium">{patient.age} years</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Condition</p>
                        <p className="text-slate-200 font-medium">{patient.condition}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>ETA: {patient.eta} min</span>
                      </div>
                      {patient.criticalParams.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-red-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{patient.criticalParams.length} Critical</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Live Map */}
          <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Live Tracking
            </h2>
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-3 overflow-hidden">
              <div className="h-[600px]">
                <AmbulanceMap
                  ambulancePos={hospitalPos}
                  allPatients={PATIENTS}
                  hospitalPos={hospitalPos}
                  patientId="All Units"
                  eta={0}
                  compact={false}
                  expandable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}