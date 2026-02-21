import React from "react";
import VitalTile from "./VitalTile";
import { Heart, Activity } from "lucide-react";

export default function CirculationPanel({ data, statuses, novice }) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2 mb-1">
        <Heart className="w-4 h-4 text-rose-400" />
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Circulation
        </h2>
      </div>

      <VitalTile
        label="Heart Rate"
        value={data.hr}
        unit="bpm"
        status={statuses.hr}
        large={statuses.hr !== "normal"}
        novice={novice}
      />

      <VitalTile
        label={novice ? "Blood Pressure" : "Systolic / Diastolic"}
        value={`${data.sbp}/${data.dbp}`}
        unit="mmHg"
        status={statuses.sbp}
        large={statuses.sbp !== "normal"}
        novice={novice}
      />

      <VitalTile
        label="MAP"
        value={data.map}
        unit="mmHg"
        status={statuses.map}
        novice={novice}
      />

      {!novice && (
        <div className="mt-auto pt-2 border-t border-slate-700/40">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Activity className="w-3 h-3" />
            <span>Perfusion index: —</span>
          </div>
        </div>
      )}
    </div>
  );
}