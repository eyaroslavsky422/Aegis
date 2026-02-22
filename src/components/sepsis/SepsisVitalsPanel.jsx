import React from "react";
import VitalTile from "../cockpit/VitalTile";
import { Heart, Wind, Activity, Droplet, Thermometer } from "lucide-react";

export default function SepsisVitalsPanel({ data, statuses, primaryThreat }) {
  const getStatus = (param) => param === primaryThreat ? "primary" : statuses[param];
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-emerald-400" />
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Vital Signs
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <VitalTile
          label="Heart Rate"
          value={Math.round(data.hr)}
          unit="bpm"
          status={getStatus("hr")}
        />
        <VitalTile
          label="Blood Pressure"
          value={`${Math.round(data.sbp)}/${Math.round(data.dbp)}`}
          sublabel={`MAP ${Math.round(data.map)}`}
          status={getStatus("map")}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <VitalTile
          label="Resp Rate"
          value={Math.round(data.rr)}
          unit="/min"
          status={getStatus("rr")}
        />
        <VitalTile
          label="SpO₂"
          value={Math.round(data.spo2)}
          unit="%"
          status={getStatus("spo2")}
        />
        <VitalTile
          label="Temp"
          value={data.temp.toFixed(1)}
          unit="°C"
          status={getStatus("temp")}
        />
      </div>
    </div>
  );
}