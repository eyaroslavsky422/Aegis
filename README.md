# Aegis: Adaptive Emergency Triage and Dispatch Interface

Aegis is a cognitive decision-support cockpit that analyzes emergency call transcripts, monitors patient vitals in real time, and recommends optimal responder deployment while providing pre-arrival preparation guidance to emergency responders.

The system reduces cognitive load, accelerates dispatch decisions, and improves responder readiness through adaptive human-computer interaction and real-time situational intelligence.

> Link: https://aegis-phi.vercel.app/FleetOverview
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

Support: [https://app.base44.com/support](https://app.base44.com/support)


# Aegis: Adaptive Emergency Triage and Dispatch Interface

Aegis is a cognitive decision-support interface that analyzes emergency call transcripts in real time, extracts critical biomarkers, and recommends optimal responder deployment while providing pre-arrival preparation guidance to first responders.

The system reduces cognitive load, accelerates dispatch decisions, and improves responder readiness through adaptive human-computer interaction.

---

## Overview

Emergency response is a time-critical process where seconds can determine outcomes. Dispatchers and responders must rapidly interpret incomplete, chaotic information and make high-stakes decisions under preshoiwsure.

Aegis augments emergency response workflows by transforming raw emergency call transcripts into structured, actionable intelligence, enabling responders to prepare effectively and ensuring optimal unit deployment based on severity, proximity, and required skill level.

Instead of static dispatch interfaces, Aegis dynamically adapts information presentation based on incident urgency, prioritizing critical signals and reducing cognitive overhead.

---

## Key Features

### Real-Time Transcript Intelligence Extraction

Aegis processes emergency call transcripts and extracts structured incident intelligence, including:

* Emergency type classification
* Severity assessment
* Biomarker and symptom detection
* Confidence scoring and rationale

This enables rapid situational awareness without requiring manual interpretation.

---

### Pre-Arrival Preparation Guidance

Aegis proactively prepares responders before they arrive on scene by recommending:

* Required medical equipment
* Suggested intervention protocols
* Scene risk considerations

This reduces preparation time and improves response effectiveness.

Example output:

```
Emergency: Cardiac Arrest  
Severity: CRITICAL  

Prepare immediately:
• Defibrillator
• Oxygen kit
• Airway equipment

Suggested protocol:
• Assess airway, breathing, circulation
• Begin CPR if indicated
```

---

### Intelligent Responder Deployment Optimization

Aegis evaluates available responder units based on:

* Distance from incident
* Skill level and certification (EMT, paramedic, advanced life support)
* Incident severity and required capabilities

The system recommends optimal responder deployment to maximize survival probability and response efficiency.

---

### Adaptive Command Interface (Human-Computer Interaction Innovation)

Aegis dynamically adjusts interface complexity based on incident severity and responder needs.

Critical incidents surface prioritized preparation guidance and deployment recommendations, while lower-priority incidents present simplified views.

This adaptive interface reduces cognitive load and improves decision clarity during high-stress scenarios.

---

### Interactive Map Visualization

Aegis provides a real-time visual map displaying:

* Incident location
* Nearby responder units
* Recommended deployment selections

This improves situational awareness and dispatch transparency.

---

## System Architecture

```
Emergency Call Transcript
          ↓
AI Triage Engine (Biomarker Extraction + Severity Assessment)
          ↓
Deployment Optimization Engine
          ↓
Adaptive Command Interface
          ↓
Responder Preparation Guidance + Deployment Recommendations
```

---

## Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Mapbox GL JS (or Google Maps API)

### Backend

* Next.js API Routes
* OpenAI GPT for structured triage intelligence extraction

### Data

* Simulated responder location dataset
* Real-time incident intelligence generation

---

## Repository Structure

```
aegis/
├── app/
│   ├── page.tsx                # Main dashboard interface
│   └── api/
│       ├── triage/route.ts    # Transcript analysis endpoint
│       └── deploy/route.ts    # Deployment recommendation endpoint
│
├── components/
│   ├── Dashboard/             # Command interface panels
│   └── Map/                   # Map visualization components
│
├── lib/
│   ├── triage/                # Transcript analysis logic
│   ├── deploy/                # Unit selection and scoring logic
│   └── data/                  # Simulated responder datasets
│
├── types/                     # TypeScript data models
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js 18+
* npm or yarn
* Claude API key (Anthropic)

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

Create environment file:

```
.env.local
```

Add:

```
ANTHROPIC_API_KEY=your_api_key_here
MAPBOX_ACCESS_TOKEN=your_mapbox_secret_token_here
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token_here
```

Run development server:

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

## ElevenLabs Medical Assistant Agent

This project includes a deployed ElevenLabs Conversational AI agent integration.

- Agent name: `Medical Assistant`
- Agent ID: `agent_2601kj1apm99fbm983n8krtj6zp8`
- Frontend component: `src/components/MedicalAssistantAgent.jsx`
- Backend token endpoint: `GET /api/elevenlabs/token`

### Required environment variables

For the backend (`server.js`):

```bash
ELEVENLABS_API_KEY=your_server_side_api_key
ELEVENLABS_AGENT_ID=agent_2601kj1apm99fbm983n8krtj6zp8
```

For the frontend (optional, defaults to `http://localhost:3000`):

```bash
VITE_API_BASE_URL=http://localhost:3000
```

### Run with agent enabled

In one terminal:

```bash
node server.js
```

In another terminal:

```bash
npm run dev
```

The `Medical Assistant` control appears in the app and starts/stops live WebRTC conversation sessions using server-minted conversation tokens.

---

## Example Workflow

1. Input emergency call transcript:

```
"My father collapsed and isn't breathing."
```

2. Aegis extracts incident intelligence:

* Cardiac arrest detected
* Severity: CRITICAL
* Biomarkers: unconscious, not breathing

3. Aegis recommends:

* Prepare defibrillator and airway equipment
* Dispatch paramedic-level EMS unit
* Shows recommended unit on map

4. Responders arrive better prepared and informed.

---

## Motivation

Emergency dispatch systems today rely heavily on manual interpretation and static interfaces. This introduces delays, cognitive overload, and inconsistent decision-making.

Aegis demonstrates a new paradigm in human-computer interaction: adaptive, intelligent interfaces that dynamically prioritize information and support decision-making in high-stakes environments.

This approach has the potential to improve emergency response efficiency, responder preparedness, and ultimately, patient outcomes.

---

## Inspiration

Inspired by early dispatch automation research and prototypes such as TriageAI, which explored automated triage extraction and dispatch assistance.

Aegis extends this concept into a real-time adaptive command interface focused on responder preparation, deployment optimization, and cognitive workload reduction.

---

## Disclaimer

Aegis is a research prototype created for demonstration and hackathon purposes.

It is not intended for real-world emergency deployment or medical decision-making.

All outputs should be treated as decision-support suggestions requiring human verification.

---

## Future Work

* Real-time speech-to-text integration
* Live responder tracking integration
* Hospital availability and routing optimization
* Multi-incident resource allocation
* Mobile responder interface

---

## Authors

Built by: Steven Ngo, Howard Lin, Elliott Yaroslavsky, Aarav Trivedi

---

## Demo

Coming soon.
