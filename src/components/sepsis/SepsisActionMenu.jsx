import React from "react";
import { motion } from "framer-motion";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SEPSIS_ACTIONS = {
  hr: [
    "Assess for arrhythmia on monitor",
    "Check for signs of septic shock",
    "Consider fluid bolus if hypotensive",
    "Review vasopressor dosing"
  ],
  map: [
    "Increase fluid resuscitation rate",
    "Initiate/titrate vasopressors (target MAP ≥65)",
    "Reassess volume status",
    "Consider norepinephrine first-line"
  ],
  rr: [
    "Assess work of breathing",
    "Check for metabolic acidosis",
    "Consider respiratory support",
    "Monitor for fatigue/respiratory failure"
  ],
  spo2: [
    "Increase oxygen delivery",
    "Assess airway/breathing",
    "Consider high-flow nasal cannula",
    "Prepare for possible intubation"
  ],
  temp: [
    "Administer antipyretics if >39°C",
    "Blood cultures before antibiotics",
    "Consider cooling measures",
    "Monitor for hypothermia if <36°C"
  ],
  etco2: [
    "Low EtCO₂ indicates hyperventilation",
    "May suggest compensation for metabolic acidosis",
    "Check arterial blood gas",
    "Monitor lactate and pH"
  ],
  lactate: [
    "CRITICAL: Indicates tissue hypoperfusion",
    "Aggressive fluid resuscitation (30 mL/kg)",
    "Initiate vasopressors if MAP <65 after fluids",
    "Recheck lactate in 2-4 hours",
    "Source control essential"
  ],
  shockIndex: [
    "High shock index suggests hemodynamic instability",
    "Increase fluid resuscitation",
    "Prepare for vasopressor support",
    "Continuous hemodynamic monitoring"
  ],
  qsofa: [
    "qSOFA ≥2 indicates high-risk sepsis",
    "Complete sepsis bundle within 1 hour",
    "Blood cultures, then broad-spectrum antibiotics",
    "30 mL/kg crystalloid bolus",
    "Consider ICU transfer"
  ]
};

export default function SepsisActionMenu({ parameter, onResolve, inline = false, onClose }) {
  const actions = SEPSIS_ACTIONS[parameter] || [];
  
  const labels = {
    hr: "Heart Rate",
    map: "Mean Arterial Pressure",
    rr: "Respiratory Rate",
    spo2: "SpO₂",
    temp: "Temperature",
    etco2: "EtCO₂",
    lactate: "Lactate",
    shockIndex: "Shock Index",
    qsofa: "qSOFA Score"
  };

  if (inline) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-purple-950/60 border border-purple-500/70 p-4 mb-4"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-purple-200 uppercase tracking-wide">
              Primary Threat — {labels[parameter]}
            </h3>
          </div>
          <Button
            onClick={onResolve}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Resolved
          </Button>
        </div>

        {actions.length > 0 ? (
          <ul className="space-y-2">
            {actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-purple-400 mt-0.5">•</span>
                <span className="text-purple-100">{action}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-purple-200">Assess patient and check all vital signs.</p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-amber-200">
              {labels[parameter]} — Critical
            </h3>
          </div>
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-amber-300 mb-3">Recommended Actions:</p>
          {actions.length > 0 ? (
            <ul className="space-y-2">
              {actions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span className="text-slate-200">{action}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-300">Assess patient and check all vital signs.</p>
          )}
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white"
        >
          Close
        </Button>
      </motion.div>
    </motion.div>
  );
}