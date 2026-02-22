import { useState, useEffect, useRef } from "react";

const NORMAL_RANGES = {
  spo2: { min: 94, max: 100, critLow: 90, critHigh: 100, unit: "%", label: "SpO₂" },
  rr: { min: 12, max: 20, critLow: 8, critHigh: 30, unit: "bpm", label: "Resp Rate" },
  etco2: { min: 35, max: 45, critLow: 25, critHigh: 55, unit: "mmHg", label: "EtCO₂" },
  hr: { min: 60, max: 100, critLow: 40, critHigh: 150, unit: "bpm", label: "Heart Rate" },
  sbp: { min: 90, max: 140, critLow: 80, critHigh: 180, unit: "mmHg", label: "Systolic BP" },
  dbp: { min: 60, max: 90, critLow: 50, critHigh: 110, unit: "mmHg", label: "Diastolic BP" },
  map: { min: 65, max: 105, critLow: 55, critHigh: 120, unit: "mmHg", label: "MAP" },
  fio2: { min: 21, max: 100, critLow: 21, critHigh: 100, unit: "%", label: "FiO₂" },
  tv: { min: 350, max: 550, critLow: 250, critHigh: 700, unit: "mL", label: "Tidal Vol" },
  mv: { min: 5, max: 10, critLow: 3, critHigh: 15, unit: "L/min", label: "Min Vent" },
  peep: { min: 5, max: 10, critLow: 0, critHigh: 20, unit: "cmH₂O", label: "PEEP" },
  pip: { min: 15, max: 30, critLow: 10, critHigh: 40, unit: "cmH₂O", label: "Peak Insp" },
  pplat: { min: 15, max: 28, critLow: 10, critHigh: 35, unit: "cmH₂O", label: "Plateau" },
};

function getStatus(key, value) {
  const r = NORMAL_RANGES[key];
  if (!r) return "normal";
  if (value <= r.critLow || value >= r.critHigh) return "critical";
  if (value < r.min || value > r.max) return "warning";
  return "normal";
}

function jitter(base, range) {
  return +(base + (Math.random() - 0.5) * range).toFixed(1);
}

export default function useSimulatedData() {
  const [data, setData] = useState({
    spo2: 96, rr: 16, etco2: 38, hr: 78, sbp: 122, dbp: 74, map: 90,
    fio2: 40, tv: 450, mv: 7.2, peep: 6, pip: 22, pplat: 18,
    ieRatio: "1:2.0", leakStatus: "None", disconnection: false,
  });

  const resetToNormal = (params) => {
    setData(prev => {
      const updated = { ...prev };
      params.forEach(param => {
        const r = NORMAL_RANGES[param];
        if (r) {
          updated[param] = Math.round((r.min + r.max) / 2);
        }
        if (param === "disconnection") updated.disconnection = false;
        if (param === "leakStatus") updated.leakStatus = "None";
      });
      return updated;
    });
  };

  const waveformRef = useRef([]);
  const [waveform, setWaveform] = useState([]);
  const phaseRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const sbp = jitter(prev.sbp, 4);
        const dbp = jitter(prev.dbp, 3);
        return {
          spo2: Math.round(jitter(prev.spo2, 1.5)),
          rr: Math.round(jitter(prev.rr, 1)),
          etco2: Math.round(jitter(prev.etco2, 2)),
          hr: Math.round(jitter(prev.hr, 2)),
          sbp: Math.round(sbp),
          dbp: Math.round(dbp),
          map: Math.round((sbp + 2 * dbp) / 3),
          fio2: prev.fio2,
          tv: Math.round(jitter(prev.tv, 20)),
          mv: +jitter(prev.mv, 0.3).toFixed(1),
          peep: prev.peep,
          pip: Math.round(jitter(prev.pip, 1.5)),
          pplat: Math.round(jitter(prev.pplat, 1)),
          ieRatio: prev.ieRatio,
          leakStatus: Math.random() > 0.95 ? "Minor" : "None",
          disconnection: Math.random() > 0.98,
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Periodic critical events every 5-10 seconds
  useEffect(() => {
    const triggerCriticalEvent = () => {
      const events = [
        () => setData(prev => ({ ...prev, spo2: 88 + Math.random() * 3 })),
        () => setData(prev => ({ ...prev, rr: 32 + Math.random() * 5 })),
        () => setData(prev => ({ ...prev, etco2: 20 + Math.random() * 3 })),
        () => setData(prev => ({ ...prev, pip: 35 + Math.random() * 5 })),
        () => setData(prev => ({ ...prev, disconnection: true })),
        () => setData(prev => ({ ...prev, leakStatus: "High Leak" })),
      ];
      
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      randomEvent();
    };

    const scheduleNext = () => {
      const delay = 5000 + Math.random() * 5000;
      return setTimeout(() => {
        triggerCriticalEvent();
        scheduleNext();
      }, delay);
    };

    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, []);

  // Capnography waveform simulation
  useEffect(() => {
    const waveInterval = setInterval(() => {
      phaseRef.current = (phaseRef.current + 1) % 60;
      const p = phaseRef.current;
      let y = 0;
      if (p >= 5 && p < 10) y = ((p - 5) / 5) * data.etco2;
      else if (p >= 10 && p < 30) y = data.etco2 + Math.sin((p - 10) / 20 * Math.PI * 0.3) * 3;
      else if (p >= 30 && p < 35) y = data.etco2 * (1 - (p - 30) / 5);
      else y = 0;

      waveformRef.current = [...waveformRef.current.slice(-79), { t: Date.now(), v: Math.max(0, y) }];
      setWaveform([...waveformRef.current]);
    }, 50);
    return () => clearInterval(waveInterval);
  }, [data.etco2]);

  const statuses = {};
  Object.keys(NORMAL_RANGES).forEach(k => {
    statuses[k] = getStatus(k, data[k]);
  });
  if (data.disconnection) statuses.disconnection = "critical";
  if (data.leakStatus !== "None") statuses.leakStatus = "warning";

  return { data, statuses, waveform, ranges: NORMAL_RANGES, resetToNormal };
}