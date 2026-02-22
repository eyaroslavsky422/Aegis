import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, Ambulance, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const ambulanceIcon = L.divIcon({
  html: `<div style="background: #ef4444; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
      <path d="M10 17h4V5H2v12h3m5-8h7l3 3v5h-3"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  </div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const hospitalIcon = L.divIcon({
  html: `<div style="background: #3b82f6; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
      <path d="M12 8v8M8 12h8" stroke="#3b82f6" stroke-width="2"/>
    </svg>
  </div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const patientIcon = L.divIcon({
  html: `<div style="background: #f59e0b; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
      <circle cx="12" cy="8" r="5"/>
      <path d="M3 21v-2a7 7 0 0 1 14 0v2"/>
    </svg>
  </div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Component to animate ambulance position
function AnimatedAmbulance({ startPos, endPos, eta, icon, patientName, patientId }) {
  const [position, setPosition] = useState(startPos);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalTime = eta * 60 * 1000; // eta in minutes to milliseconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / totalTime, 1);
      
      const lat = startPos[0] + (endPos[0] - startPos[0]) * newProgress;
      const lng = startPos[1] + (endPos[1] - startPos[1]) * newProgress;
      
      setPosition([lat, lng]);
      setProgress(newProgress);
      
      if (newProgress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [startPos, endPos, eta]);

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className="text-xs">
          <p className="font-bold">{patientName}</p>
          <p className="text-slate-600">{patientId}</p>
          <p className="mt-1">ETA: {Math.ceil(eta * (1 - progress))} min</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function AmbulanceMap({ ambulancePos, hospitalPos, patientId, eta, compact = false, expandable = true, allPatients = null, awaitingPickup = null }) {
  const [expanded, setExpanded] = useState(false);

  // Calculate center from all positions including awaiting pickup
  const center = allPatients || awaitingPickup
    ? (() => {
        const positions = [];
        if (allPatients) positions.push(...allPatients.map(p => p.ambulancePos));
        if (awaitingPickup) positions.push(...awaitingPickup.map(p => p.location));
        return [
          positions.reduce((sum, p) => sum + p[0], 0) / positions.length,
          positions.reduce((sum, p) => sum + p[1], 0) / positions.length,
        ];
      })()
    : [
        (ambulancePos[0] + hospitalPos[0]) / 2,
        (ambulancePos[1] + hospitalPos[1]) / 2,
      ];

  const MapContent = ({ isExpanded = false }) => (
    <MapContainer
      center={center}
      zoom={allPatients || awaitingPickup ? 13 : 12}
      className="w-full h-full rounded-xl"
      zoomControl={!compact || isExpanded}
      scrollWheelZoom={true}
      dragging={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      
      {/* Show awaiting pickup patients */}
      {awaitingPickup && awaitingPickup.map((patient) => {
        // Calculate ambulance position approaching patient
        const ambulanceDistance = patient.estimatedArrival / 60; // minutes to hours
        const bearing = Math.atan2(
          patient.hospitalPos[1] - patient.location[1],
          patient.hospitalPos[0] - patient.location[0]
        );
        const approachingAmbulance = [
          patient.location[0] - Math.cos(bearing) * 0.02 * ambulanceDistance,
          patient.location[1] - Math.sin(bearing) * 0.02 * ambulanceDistance,
        ];
        
        return (
          <React.Fragment key={patient.id}>
            <Marker position={patient.location} icon={patientIcon}>
              <Popup>
                <div className="text-xs">
                  <p className="font-bold">{patient.name}</p>
                  <p className="text-slate-600">{patient.id}</p>
                  <p className="mt-1 text-amber-600 font-semibold">Awaiting Pickup</p>
                  <p>Unit ETA: {patient.estimatedArrival} min</p>
                </div>
              </Popup>
            </Marker>
            <AnimatedAmbulance
              startPos={approachingAmbulance}
              endPos={patient.location}
              eta={patient.estimatedArrival}
              icon={ambulanceIcon}
              patientName={patient.name}
              patientId={`Responding to ${patient.id}`}
            />
            <Polyline
              positions={[approachingAmbulance, patient.location]}
              color="#f59e0b"
              weight={2}
              dashArray="10, 10"
              opacity={0.6}
            />
          </React.Fragment>
        );
      })}
      
      {/* Show all patients or single patient */}
      {allPatients ? (
        <>
          {allPatients.map((patient) => (
            <React.Fragment key={patient.id}>
              <AnimatedAmbulance
                startPos={patient.ambulancePos}
                endPos={patient.hospitalPos}
                eta={patient.eta}
                icon={ambulanceIcon}
                patientName={patient.name}
                patientId={patient.id}
              />
              <Polyline
                positions={[patient.ambulancePos, patient.hospitalPos]}
                color={patient.criticalParams.length > 0 ? "#ef4444" : "#3b82f6"}
                weight={2}
                dashArray="10, 10"
                opacity={0.5}
              />
            </React.Fragment>
          ))}
          <Marker position={hospitalPos} icon={hospitalIcon}>
            <Popup>
              <div className="text-xs font-bold">
                Receiving Hospital
              </div>
            </Popup>
          </Marker>
        </>
      ) : (
        <>
          <AnimatedAmbulance
            startPos={ambulancePos}
            endPos={hospitalPos}
            eta={eta}
            icon={ambulanceIcon}
            patientName={`Patient ${patientId}`}
            patientId={patientId}
          />
          <Marker position={hospitalPos} icon={hospitalIcon}>
            <Popup>
              <div className="text-xs font-bold">
                Receiving Hospital
              </div>
            </Popup>
          </Marker>
          <Polyline
            positions={[ambulancePos, hospitalPos]}
            color="#3b82f6"
            weight={3}
            dashArray="10, 10"
            opacity={0.6}
          />
        </>
      )}
    </MapContainer>
  );

  if (!expandable) {
    return (
      <div className={compact ? "h-48" : "h-96"} style={{ position: 'relative' }}>
        <MapContent isExpanded={false} />
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className={compact ? "h-48" : "h-64"} style={{ position: 'relative' }}>
          <MapContent isExpanded={false} />
        </div>
        <Button
          onClick={() => setExpanded(true)}
          size="sm"
          className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-800 text-white gap-1.5 backdrop-blur-sm z-[1000]"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Expand
        </Button>
        {eta && (
          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
            ETA: {eta} min
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl h-[80vh] bg-slate-900 rounded-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-white">Patient: {patientId}</p>
                <p className="text-xs text-slate-300">ETA: {eta} min to hospital</p>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4 z-[1000] bg-slate-900/90 hover:bg-slate-800 text-white gap-1.5 backdrop-blur-sm px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
                Close
              </button>
              <MapContent isExpanded={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}