import React from "react";
import VitalTile from "./VitalTile";
import WaveformChart from "./WaveformChart";
import { Wind } from "lucide-react";

export default function OxygenationPanel({ data, statuses, waveform, novice }) {
  const etco2Color = statuses.etco2 === "critical" ? "#f87171" : statuses.etco2 === "warning" ? "#fbbf24" : "#34d399";

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2 mb-1">
        <Wind className="w-4 h-4 text-sky-400" />
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Oxygenation & Ventilation
        </h2>
      </div>

      {/* Primary row */}
      <div className="grid grid-cols-2 gap-3">
        <VitalTile
          label={novice ? "Oxygen Level" : "SpO₂"}
          value={data.spo2}
          unit="%"
          status={statuses.spo2}
          large
          novice={novice}
        />
        <VitalTile
          label={novice ? "Breathing Rate" : "Resp Rate"}
          value={data.rr}
          unit="bpm"
          status={statuses.rr}
          large
          novice={novice}
        />
      </div>

      {/* EtCO₂ with waveform */}
      <VitalTile
        label={novice ? "Exhaled CO₂" : "EtCO₂"}
        value={data.etco2}
        unit="mmHg"
        status={statuses.etco2}
        large
        novice={novice}
      >
        <div className="w-full flex flex-col">
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`font-mono font-bold text-3xl leading-none ${
              statuses.etco2 === "critical" ? "text-red-400" : statuses.etco2 === "warning" ? "text-amber-400" : "text-emerald-400"
            }`}>
              {data.etco2}
            </span>
            <span className="text-[10px] text-slate-500">mmHg</span>
          </div>
          <WaveformChart data={waveform} color={etco2Color} height={50} />
        </div>
      </VitalTile>

      {/* Secondary vitals */}
      <div className={novice ? "grid grid-cols-2 gap-3" : "grid grid-cols-3 gap-3"}>
        <VitalTile
          label="FiO₂"
          value={data.fio2}
          unit="%"
          status={statuses.fio2}
          novice={novice}
        />
        <VitalTile
          label={novice ? "Breath Size" : "Tidal Vol"}
          value={data.tv}
          unit="mL"
          status={statuses.tv}
          novice={novice}
        />
        {!novice && (
          <VitalTile
            label="Min Vent"
            value={data.mv}
            unit="L/min"
            status={statuses.mv}
            novice={novice}
          />
        )}
      </div>
    </div>
  );
}