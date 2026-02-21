import { useState, useEffect } from "react";

const jitter = (base, range = 2) => base + (Math.random() - 0.5) * range;

export default function useSepsisData() {
  const [data, setData] = useState({
    hr: 128,
    sbp: 82,
    dbp: 58,
    map: 66,
    rr: 30,
    spo2: 92,
    temp: 39.1,
    etco2: 22,
    lactate: 4.5,
    shockIndex: 1.56,
    qsofa: 2,
    fluidsGiven: 1.5,
    vasopressor: "Norepinephrine 0.08 mcg/kg/min",
    timeSinceAlert: 12,
  });

  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        hr: jitter(prev.hr, 3),
        sbp: jitter(prev.sbp, 2),
        dbp: jitter(prev.dbp, 2),
        map: jitter(prev.map, 2),
        rr: jitter(prev.rr, 2),
        spo2: jitter(prev.spo2, 1),
        temp: jitter(prev.temp, 0.1),
        etco2: jitter(prev.etco2, 1),
        lactate: jitter(prev.lactate, 0.2),
        shockIndex: jitter(prev.shockIndex, 0.05),
        timeSinceAlert: prev.timeSinceAlert + 1,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setStatuses({
      hr: data.hr > 120 ? "critical" : data.hr > 100 ? "warning" : "normal",
      map: data.map < 65 ? "critical" : data.map < 70 ? "warning" : "normal",
      rr: data.rr > 25 ? "critical" : data.rr > 20 ? "warning" : "normal",
      spo2: data.spo2 < 93 ? "critical" : data.spo2 < 95 ? "warning" : "normal",
      temp: data.temp > 38 || data.temp < 36 ? "critical" : "normal",
      etco2: data.etco2 < 25 ? "critical" : data.etco2 < 30 ? "warning" : "normal",
      lactate: data.lactate > 4 ? "critical" : data.lactate > 2 ? "warning" : "normal",
      shockIndex: data.shockIndex > 1 ? "critical" : data.shockIndex > 0.9 ? "warning" : "normal",
      qsofa: data.qsofa >= 2 ? "critical" : "normal",
    });
  }, [data]);

  return { data, statuses };
}