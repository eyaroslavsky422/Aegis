import { useState, useEffect, useRef } from "react";

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
  const [primaryThreat, setPrimaryThreat] = useState(null);
  const historyRef = useRef({ map: [], etco2: [] });

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
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update time since alert only once per minute
  useEffect(() => {
    const minuteInterval = setInterval(() => {
      setData(prev => ({
        ...prev,
        timeSinceAlert: prev.timeSinceAlert + 1,
      }));
    }, 60000);

    return () => clearInterval(minuteInterval);
  }, []);

  useEffect(() => {
    // Update history for trend detection
    historyRef.current.map.push(data.map);
    historyRef.current.etco2.push(data.etco2);
    if (historyRef.current.map.length > 10) historyRef.current.map.shift();
    if (historyRef.current.etco2.length > 10) historyRef.current.etco2.shift();

    // Calculate trend (drop over last 5-10 readings)
    const mapTrend = historyRef.current.map.length >= 5 
      ? historyRef.current.map[0] - data.map 
      : 0;
    const etco2Trend = historyRef.current.etco2.length >= 5 
      ? historyRef.current.etco2[0] - data.etco2 
      : 0;

    const baseStatuses = {
      hr: data.hr > 120 ? "critical" : data.hr > 100 ? "warning" : "normal",
      map: data.map < 65 ? "critical" : data.map < 70 ? "warning" : "normal",
      rr: data.rr > 25 ? "critical" : data.rr > 20 ? "warning" : "normal",
      spo2: data.spo2 < 93 ? "critical" : data.spo2 < 95 ? "warning" : "normal",
      temp: data.temp > 38 || data.temp < 36 ? "critical" : "normal",
      etco2: data.etco2 < 25 ? "critical" : data.etco2 < 30 ? "warning" : "normal",
      lactate: data.lactate > 4 ? "critical" : data.lactate > 2 ? "warning" : "normal",
      shockIndex: data.shockIndex > 1 ? "critical" : data.shockIndex > 0.9 ? "warning" : "normal",
      qsofa: data.qsofa >= 2 ? "critical" : "normal",
    };

    // Determine Primary Threat candidates with severity scores
    const threats = [];
    if (data.map < 55 || mapTrend > 10) threats.push({ param: "map", score: data.map < 55 ? 100 : 50 });
    if (data.etco2 < 20 || etco2Trend > 5) threats.push({ param: "etco2", score: data.etco2 < 20 ? 95 : 45 });
    if (data.lactate >= 4) threats.push({ param: "lactate", score: 90 });

    // Pick the worst threat as Primary
    const worst = threats.sort((a, b) => b.score - a.score)[0];
    setPrimaryThreat(worst ? worst.param : null);

    setStatuses(baseStatuses);
  }, [data]);

  const resetToNormal = (params) => {
    setData(prev => {
      const updated = { ...prev };
      params.forEach(param => {
        if (param === "map") updated.map = 70;
        if (param === "etco2") updated.etco2 = 35;
        if (param === "lactate") updated.lactate = 1.5;
      });
      return updated;
    });
  };

  return { data, statuses, primaryThreat, resetToNormal };
}