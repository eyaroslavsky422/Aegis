import React from "react";
import VitalTile from "../cockpit/VitalTile";
import { AlertTriangle } from "lucide-react";

export default function SepsisMetricsPanel({ data, statuses, primaryThreat }) {
  const getStatus = (param) => param === primaryThreat ? "primary" : statuses[param];
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Sepsis Metrics
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <VitalTile
          label="EtCO₂"
          value={Math.round(data.etco2)}
          unit="mmHg"
          status={getStatus("etco2")}
        />
        <VitalTile
          label="Lactate"
          value={data.lactate.toFixed(1)}
          unit="mmol/L"
          status={getStatus("lactate")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <VitalTile
          label="Shock Index"
          value={data.shockIndex.toFixed(2)}
          status={getStatus("shockIndex")}
        />
        <VitalTile
          label="qSOFA"
          value={data.qsofa}
          status={getStatus("qsofa")}
        />
      </div>
    </div>
  );
}