import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Heart, Wind, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACTIONS = {
  circulation: {
    hr: [
      "Check rhythm on monitor",
      "Assess for arrhythmia",
      "Consider fluid bolus if hypotensive",
      "Prepare atropine/pacing if bradycardic"
    ],
    sbp: [
      "Increase fluid rate if hypovolemic",
      "Consider vasopressor support",
      "Check for bleeding/fluid loss",
      "Re-assess MAP target"
    ],
    map: [
      "Titrate vasopressors as needed",
      "Ensure adequate volume status",
      "Check pump settings/flow rates"
    ]
  },
  oxygenation: {
    spo2: [
      "Increase FiO₂ immediately",
      "Check ventilator settings",
      "Assess airway patency",
      "Suction if secretions present",
      "Consider recruitment maneuver"
    ],
    rr: [
      "Check for respiratory distress",
      "Assess minute ventilation",
      "Review sedation level",
      "Check for patient-ventilator dyssynchrony"
    ],
    etco2: [
      "Verify endotracheal tube placement",
      "Check for circuit disconnection",
      "Assess ventilation adequacy",
      "Review minute ventilation settings"
    ],
    fio2: [
      "Review oxygenation status",
      "Consider weaning if SpO₂ adequate"
    ],
    tv: [
      "Check for air leak",
      "Verify tidal volume settings",
      "Assess compliance"
    ],
    mv: [
      "Adjust respiratory rate",
      "Check tidal volume",
      "Assess for hyper/hypoventilation"
    ]
  },
  ventStatus: {
    disconnection: [
      "RECONNECT CIRCUIT IMMEDIATELY",
      "Manual ventilation if needed",
      "Check all connections",
      "Assess patient status"
    ],
    leakStatus: [
      "Inspect circuit for leaks",
      "Check cuff pressure",
      "Tighten connections",
      "Replace damaged components"
    ],
    pip: [
      "Check for bronchospasm",
      "Suction airway if needed",
      "Assess compliance",
      "Consider sedation if dyssynchrony"
    ],
    peep: [
      "Review PEEP settings",
      "Check for auto-PEEP",
      "Assess lung recruitment"
    ],
    pplat: [
      "Reduce tidal volume if >30",
      "Check compliance",
      "Assess for pneumothorax"
    ]
  }
};

export default function ActionMenu({ panel, criticalParams, onResolve }) {
  const actions = ACTIONS[panel] || {};
  const allActions = [];
  
  criticalParams.forEach(param => {
    if (actions[param]) {
      allActions.push(...actions[param]);
    }
  });

  const icon = panel === "circulation" ? Heart : panel === "oxygenation" ? Wind : Gauge;
  const Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-red-950/60 border border-red-500/70 p-4 mb-4"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-sm font-bold text-red-200 uppercase tracking-wide">
            Critical Alert — Recommended Actions
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

      {allActions.length > 0 ? (
        <ul className="space-y-2">
          {allActions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-red-400 mt-0.5">•</span>
              <span className="text-red-100">{action}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-red-200">Assess patient and check all vital signs.</p>
      )}
    </motion.div>
  );
}