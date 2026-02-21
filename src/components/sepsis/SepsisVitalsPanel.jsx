import React from "react";
import VitalTile from "../cockpit/VitalTile";
import { Heart, Wind, Activity, Droplet, Thermometer } from "lucide-react";

export default function SepsisVitalsPanel({ data, statuses, primaryThreat, onCriticalClick }) {
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
        <div 
          onClick={() => (statuses.hr === "critical" || getStatus("hr") === "primary") && onCriticalClick("hr")}
          className={(statuses.hr === "critical" || getStatus("hr") === "primary") ? "cursor-pointer" : ""}
        >
          <VitalTile
            label="Heart Rate"
            value={Math.round(data.hr)}
            unit="bpm"
            status={getStatus("hr")}
          />
        </div>
        <div 
          onClick={() => (statuses.map === "critical" || getStatus("map") === "primary") && onCriticalClick("map")}
          className={(statuses.map === "critical" || getStatus("map") === "primary") ? "cursor-pointer" : ""}
        >
          <VitalTile
            label="Blood Pressure"
            value={`${Math.round(data.sbp)}/${Math.round(data.dbp)}`}
            sublabel={`MAP ${Math.round(data.map)}`}
            status={getStatus("map")}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div 
          onClick={() => (statuses.rr === "critical" || getStatus("rr") === "primary") && onCriticalClick("rr")}
          className={(statuses.rr === "critical" || getStatus("rr") === "primary") ? "cursor-pointer" : ""}
        >
          <VitalTile
            label="Resp Rate"
            value={Math.round(data.rr)}
            unit="/min"
            status={getStatus("rr")}
          />
        </div>
        <div 
          onClick={() => (statuses.spo2 === "critical" || getStatus("spo2") === "primary") && onCriticalClick("spo2")}
          className={(statuses.spo2 === "critical" || getStatus("spo2") === "primary") ? "cursor-pointer" : ""}
        >
          <VitalTile
            label="SpO₂"
            value={Math.round(data.spo2)}
            unit="%"
            status={getStatus("spo2")}
          />
        </div>
        <div 
          onClick={() => (statuses.temp === "critical" || getStatus("temp") === "primary") && onCriticalClick("temp")}
          className={(statuses.temp === "critical" || getStatus("temp") === "primary") ? "cursor-pointer" : ""}
        >
          <VitalTile
            label="Temp"
            value={data.temp.toFixed(1)}
            unit="°C"
            status={getStatus("temp")}
          />
        </div>
      </div>
    </div>
  );
}