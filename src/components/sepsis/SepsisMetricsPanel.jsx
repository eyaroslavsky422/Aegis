import React from "react";
import VitalTile from "../cockpit/VitalTile";
import { AlertTriangle } from "lucide-react";

export default function SepsisMetricsPanel({ data, statuses, onCriticalClick }) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Sepsis Metrics
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div 
          onClick={() => statuses.etco2 === "critical" && onCriticalClick("etco2")}
          className={statuses.etco2 === "critical" ? "cursor-pointer" : ""}
        >
          <VitalTile
            label="EtCO₂"
            value={Math.round(data.etco2)}
            unit="mmHg"
            status={statuses.etco2}
          />
        </div>
        <div 
          onClick={() => statuses.lactate === "critical" && onCriticalClick("lactate")}
          className={statuses.lactate === "critical" ? "cursor-pointer" : ""}
        >
          <VitalTile
            label="Lactate"
            value={data.lactate.toFixed(1)}
            unit="mmol/L"
            status={statuses.lactate}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div 
          onClick={() => statuses.shockIndex === "critical" && onCriticalClick("shockIndex")}
          className={statuses.shockIndex === "critical" ? "cursor-pointer" : ""}
        >
          <VitalTile
            label="Shock Index"
            value={data.shockIndex.toFixed(2)}
            status={statuses.shockIndex}
          />
        </div>
        <div 
          onClick={() => statuses.qsofa === "critical" && onCriticalClick("qsofa")}
          className={statuses.qsofa === "critical" ? "cursor-pointer" : ""}
        >
          <VitalTile
            label="qSOFA"
            value={data.qsofa}
            status={statuses.qsofa}
          />
        </div>
      </div>
    </div>
  );
}