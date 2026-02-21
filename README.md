# Aegis — Adaptive Emergency Triage and Dispatch Interface

Aegis is a cognitive decision-support cockpit that analyzes emergency call transcripts, monitors patient vitals in real time, and recommends optimal responder deployment while providing pre-arrival preparation guidance to emergency responders.

The system reduces cognitive load, accelerates dispatch decisions, and improves responder readiness through adaptive human-computer interaction and real-time situational intelligence.

---

## Overview

Emergency response is a time-critical domain where seconds can determine patient outcomes. Dispatchers and responders must interpret incomplete information, monitor evolving patient vitals, and make high-stakes decisions under pressure.

Aegis augments emergency response workflows by transforming emergency call transcripts, patient telemetry, and incident locations into structured, actionable intelligence. The system dynamically adapts its interface based on severity, highlights critical vitals, and recommends responder deployment and preparation guidance.

Instead of static dashboards, Aegis provides an adaptive command cockpit that prioritizes critical signals and reduces cognitive overload during high-stress emergency scenarios.

---

## Key Features

### Real-Time Incident Intelligence Extraction

Aegis processes emergency transcripts and telemetry to extract structured incident intelligence, including:

* Emergency type classification
* Severity assessment
* Biomarker and symptom detection
* Confidence scoring and incident summaries

This enables responders to rapidly understand patient condition and required intervention.

---

### Adaptive Vitals Cockpit Interface

Aegis includes a real-time cockpit interface that continuously monitors patient vitals, including:

* Heart rate
* Oxygen saturation
* Circulation metrics
* Ventilation status

When vitals cross critical thresholds, the interface dynamically expands and prioritizes urgent information, enabling responders to focus immediately on life-threatening conditions.

---

### Pre-Arrival Preparation Guidance

Based on extracted biomarkers and severity, Aegis recommends responder preparation actions, including:

* Required medical equipment (AED, oxygen, airway kit)
* Suggested intervention protocols (CPR readiness, ventilation support)
* Scene risk awareness and preparation

This allows responders to arrive fully prepared, reducing response latency and improving outcomes.

---

### Intelligent Responder Deployment Optimization

Aegis evaluates responder units based on:

* Distance from incident location
* Skill level and certification (EMT, paramedic, advanced life support)
* Incident severity and capability requirements

The system recommends optimal responder assignment to maximize survival probability and operational efficiency.

---

### Interactive Map Visualization

Aegis provides a real-time interactive map displaying:

* Active incident locations
* Nearby responder units
* Patient telemetry locations

This enhances situational awareness and dispatch coordination.

---

### Real-Time Telemetry and Simulation Engine

Aegis includes a real-time simulation engine that streams:

* Incoming emergency incidents
* Live patient vitals telemetry
* Incident location data

This enables demonstration of live emergency response workflows and adaptive interface behavior.

---

## System Architecture

```
Emergency Transcript + Patient Telemetry + Location
                        ↓
Real-Time Simulation Engine (useSimulatedData.jsx)
                        ↓
Incident Intelligence Extraction Layer
                        ↓
Adaptive Command Cockpit Interface
                        ↓
Responder Deployment and Preparation Guidance
                        ↓
Interactive Map Visualization and Incident Monitoring
```

---

## Tech Stack

### Frontend

* React (Vite)
* JavaScript / TypeScript
* Tailwind CSS
* Custom cockpit interface components

### Visualization

* Interactive map visualization (AmbulanceMap.jsx)
* Real-time telemetry monitoring panels

### Architecture

* Component-based cockpit system
* Real-time simulation engine using React hooks
* Modular telemetry panels for circulation, oxygenation, and ventilation

### Backend Integration (Extensible)

* Claude API integration for transcript analysis (planned / extensible)
* Dispatch and responder assignment logic (planned / extensible)

### Data

* Simulated responder location dataset
* Simulated incident telemetry streams
* Simulated patient vitals monitoring

---

## Repository Structure

```
Aegis/
├── src/
│   ├── api/
│   │   └── base44Client.js
│   │
│   ├── components/
│   │   ├── cockpit/
│   │   │   ├── ActionMenu.jsx
│   │   │   ├── CirculationPanel.jsx
│   │   │   ├── ModeToggle.jsx
│   │   │   ├── OxygenationPanel.jsx
│   │   │   ├── VentStatusPanel.jsx
│   │   │   ├── VitalTile.jsx
│   │   │   ├── WaveformChart.jsx
│   │   │   └── useSimulatedData.jsx
│   │   │
│   │   ├── map/
│   │   │   ├── AmbulanceMap.jsx
│   │   │   └── patientData.jsx
│   │   │
│   │   └── ui/
│   │       └── UserNotRegisteredError.jsx
│   │
│   ├── hooks/
│   │   └── use-mobile.jsx
│   │
│   ├── lib/
│   │   ├── AuthContext.jsx
│   │   ├── NavigationTracker.jsx
│   │   └── PageNotFound.jsx
│   │
│   ├── utils/
│   │   └── index.ts
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── pages.config.js
│
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── eslint.config.js
├── jsconfig.json
├── components.json
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js 18+
* npm or yarn

---

### Installation

Clone the repository:

```
git clone https://github.com/your-username/aegis.git
cd aegis
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## Example Workflow

1. Incoming incident appears in cockpit interface
2. Patient vitals stream in real time
3. Cockpit interface highlights critical metrics dynamically
4. Map displays incident location and responder positions
5. System recommends preparation guidance and responder deployment

---

## Motivation

Emergency response systems today rely heavily on manual interpretation and static dashboards, which introduce delays, cognitive overload, and inconsistent decision-making.

Aegis demonstrates a new paradigm in adaptive human-computer interaction: real-time, intelligent command interfaces that dynamically prioritize critical information and assist responders in life-saving decision-making.

This approach has the potential to significantly improve emergency response efficiency, responder preparedness, and patient survival outcomes.

---

## Inspiration

Inspired by emergency command center interfaces, modern cockpit telemetry systems, and emerging AI-assisted triage technologies.

Aegis explores how adaptive interfaces and real-time intelligence extraction can improve emergency response workflows.

---

## Disclaimer

Aegis is a research prototype created for demonstration and hackathon purposes.

It is not intended for real-world emergency deployment or medical decision-making.

All outputs should be treated as decision-support suggestions requiring human verification.

---

## Future Work

* Real-time transcript ingestion and analysis via Claude API
* Live responder GPS tracking integration
* Automated responder assignment engine
* Hospital routing and availability optimization
* Multi-incident command coordination
* Mobile responder interface

---

## Authors

Built by:

* Steven Ngo
* Howard Lin
* Elliott Yaroslavsky
* Aarav Trivedi

---

## Demo

Coming soon.
