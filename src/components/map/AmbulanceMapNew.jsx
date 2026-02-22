import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_STYLE = "mapbox://styles/mapbox/navigation-night-v1";
;
const ROUTE_SOURCE_ID = "patient-routes-source";
const ROUTE_LAYER_ID = "patient-routes-layer";
const TERRAIN_SOURCE_ID = "mapbox-dem";
const BUILDINGS_LAYER_ID = "3d-buildings";
const MAP_PITCH = 55;
const MAP_BEARING = -20;
const MAP_TERRAIN_EXAGGERATION = 1.15;

const toLngLat = (position) => [position[1], position[0]];
const toCenterPoint = (firstPoint, secondPoint) => [
  (firstPoint[0] + secondPoint[0]) / 2,
  (firstPoint[1] + secondPoint[1]) / 2,
];

const createPopupContent = ({ title, subtitle, etaMinutes }) => {
  const container = document.createElement("div");
  container.style.fontSize = "12px";
  container.style.lineHeight = "1.4";

  const titleNode = document.createElement("p");
  titleNode.style.fontWeight = "700";
  titleNode.style.margin = "0";
  titleNode.textContent = title;
  container.appendChild(titleNode);

  if (subtitle) {
    const subtitleNode = document.createElement("p");
    subtitleNode.style.margin = "2px 0 0";
    subtitleNode.style.color = "#64748b";
    subtitleNode.textContent = subtitle;
    container.appendChild(subtitleNode);
  }

  if (etaMinutes) {
    const etaNode = document.createElement("p");
    etaNode.style.margin = "6px 0 0";
    etaNode.textContent = `ETA: ${etaMinutes} min`;
    container.appendChild(etaNode);
  }

  return container;
};

const createMarkerElement = (color, sizePx) => {
  const markerEl = document.createElement("div");
  markerEl.style.width = `${sizePx}px`;
  markerEl.style.height = `${sizePx}px`;
  markerEl.style.borderRadius = "9999px";
  markerEl.style.background = color;
  markerEl.style.border = "3px solid #fff";
  markerEl.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.35)";
  return markerEl;
};

function MapboxMapContent({
  center,
  compact,
  isExpanded,
  fitCoordinates,
  routeFeatures,
  markers,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const mapMarkersRef = useRef([]);
  const lastFitSignatureRef = useRef("");
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const clearMarkers = useCallback(() => {
    mapMarkersRef.current.forEach((marker) => marker.remove());
    mapMarkersRef.current = [];
  }, []);

  const syncRouteLayer = useCallback(
    (mapInstance) => {
      const routeSource = mapInstance.getSource(ROUTE_SOURCE_ID);
      const routeLayer = mapInstance.getLayer(ROUTE_LAYER_ID);

      if (!routeFeatures.length) {
        if (routeLayer) mapInstance.removeLayer(ROUTE_LAYER_ID);
        if (routeSource) mapInstance.removeSource(ROUTE_SOURCE_ID);
        return;
      }

      const routeData = {
        type: "FeatureCollection",
        features: routeFeatures,
      };

      if (routeSource) {
        routeSource.setData(routeData);
      } else {
        mapInstance.addSource(ROUTE_SOURCE_ID, {
          type: "geojson",
          data: routeData,
        });
      }

      if (!routeLayer) {
        mapInstance.addLayer({
          id: ROUTE_LAYER_ID,
          type: "line",
          source: ROUTE_SOURCE_ID,
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": ["coalesce", ["get", "color"], "#3b82f6"],
            "line-width": 3,
            "line-opacity": 0.65,
            "line-dasharray": [2, 2],
          },
        });
      }
    },
    [routeFeatures]
  );

  const syncThreeD = useCallback((mapInstance) => {
    if (!mapInstance.getSource(TERRAIN_SOURCE_ID)) {
      mapInstance.addSource(TERRAIN_SOURCE_ID, {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
    }

    mapInstance.setTerrain({
      source: TERRAIN_SOURCE_ID,
      exaggeration: MAP_TERRAIN_EXAGGERATION,
    });

    if (typeof mapInstance.setFog === "function") {
      mapInstance.setFog({
        color: "rgb(255, 241, 224)",
        "high-color": "rgb(255, 231, 204)",
        "horizon-blend": 0.08,
      });
    }

    if (mapInstance.getLayer(BUILDINGS_LAYER_ID)) return;

    const firstLabelLayerId = mapInstance
      .getStyle()
      ?.layers?.find((layer) => layer.type === "symbol" && layer.layout?.["text-field"])?.id;

    mapInstance.addLayer(
      {
        id: BUILDINGS_LAYER_ID,
        source: "composite",
        "source-layer": "building",
        filter: ["==", ["get", "extrude"], "true"],
        type: "fill-extrusion",
        minzoom: 13,
        paint: {
          "fill-extrusion-color": "#f1d8b5",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            13,
            0,
            15,
            ["get", "height"],
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            13,
            0,
            15,
            ["get", "min_height"],
          ],
          "fill-extrusion-opacity": 0.72,
        },
      },
      firstLabelLayerId
    );
  }, []);

  const syncMarkers = useCallback(
    (mapInstance) => {
      clearMarkers();

      markers.forEach((markerData) => {
        const marker = new mapboxgl.Marker({
          element: createMarkerElement(markerData.color, markerData.sizePx),
        }).setLngLat(toLngLat(markerData.position));

        if (markerData.popup) {
          marker.setPopup(
            new mapboxgl.Popup({ offset: 14 }).setDOMContent(createPopupContent(markerData.popup))
          );
        }

        marker.addTo(mapInstance);
        mapMarkersRef.current.push(marker);
      });
    },
    [clearMarkers, markers]
  );

  const syncViewport = useCallback(
    (mapInstance) => {
      if (fitCoordinates.length) {
        const fitSignature = `${isExpanded ? "expanded" : "compact"}:${fitCoordinates
          .map((coord) => coord.join(","))
          .join("|")}`;

        if (fitSignature !== lastFitSignatureRef.current) {
          const bounds = new mapboxgl.LngLatBounds();
          fitCoordinates.forEach((coordinate) => bounds.extend(toLngLat(coordinate)));

          mapInstance.fitBounds(bounds, {
            padding: isExpanded ? 80 : 45,
            duration: 0,
            maxZoom: routeFeatures.length > 1 ? 13 : 14,
            pitch: MAP_PITCH,
            bearing: MAP_BEARING,
          });

          lastFitSignatureRef.current = fitSignature;
        }
      } else {
        lastFitSignatureRef.current = "";
        mapInstance.easeTo({
          center: toLngLat(center),
          zoom: routeFeatures.length > 1 ? 12.5 : 12,
          pitch: MAP_PITCH,
          bearing: MAP_BEARING,
          duration: 0,
        });
      }
    },
    [center, fitCoordinates, isExpanded, routeFeatures]
  );

  useEffect(() => {
    if (!mapContainerRef.current || !token || mapRef.current) return undefined;

    mapboxgl.accessToken = token;

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      center: toLngLat(center),
      zoom: routeFeatures.length > 1 ? 12.5 : 12,
      pitch: MAP_PITCH,
      bearing: MAP_BEARING,
      attributionControl: true,
    });

    if (compact && !isExpanded) {
      mapInstance.scrollZoom.disable();
    } else {
      mapInstance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-left");
    }

    mapRef.current = mapInstance;

    return () => {
      clearMarkers();
      mapInstance.remove();
      mapRef.current = null;
      lastFitSignatureRef.current = "";
    };
  }, []);

  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance || !token) return;

    const applyUpdates = () => {
      syncThreeD(mapInstance);
      syncRouteLayer(mapInstance);
      syncMarkers(mapInstance);
      syncViewport(mapInstance);
    };

    if (mapInstance.isStyleLoaded()) {
      applyUpdates();
    } else {
      mapInstance.once("load", applyUpdates);
    }
  }, [syncMarkers, syncRouteLayer, syncThreeD, syncViewport, token]);

  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    const resizeTimer = window.setTimeout(() => {
      mapInstance.resize();
    }, 0);

    return () => window.clearTimeout(resizeTimer);
  }, [isExpanded, compact]);

  if (!token) {
    return (
      <div className="h-full w-full rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-200">
        Add <code>VITE_MAPBOX_ACCESS_TOKEN</code> in <code>.env.local</code> to display the
        Mapbox map.
      </div>
    );
  }

  return <div ref={mapContainerRef} className="h-full w-full rounded-xl overflow-hidden" />;
}

export default function AmbulanceMap({
  ambulancePos,
  hospitalPos,
  patientId,
  eta,
  compact = false,
  expandable = true,
  allPatients = null,
}) {
  const [expanded, setExpanded] = useState(false);

  const hasPatientCollection = Array.isArray(allPatients) && allPatients.length > 0;

  const center = useMemo(() => {
    if (hasPatientCollection) {
      const total = allPatients.reduce(
        (acc, patient) => [acc[0] + patient.ambulancePos[0], acc[1] + patient.ambulancePos[1]],
        [0, 0]
      );

      return [total[0] / allPatients.length, total[1] / allPatients.length];
    }

    return toCenterPoint(ambulancePos, hospitalPos);
  }, [allPatients, ambulancePos, hasPatientCollection, hospitalPos]);

  const mapContentData = useMemo(() => {
    if (hasPatientCollection) {
      const routes = [];
      const mapMarkers = [
        {
          position: hospitalPos,
          color: "#3b82f6",
          sizePx: 28,
          popup: {
            title: "Receiving Hospital",
          },
        },
      ];
      const fitPoints = [hospitalPos];

      allPatients.forEach((patient) => {
        routes.push({
          type: "Feature",
          properties: {
            color: patient.criticalParams?.length > 0 ? "#ef4444" : "#3b82f6",
          },
          geometry: {
            type: "LineString",
            coordinates: [toLngLat(patient.ambulancePos), toLngLat(patient.hospitalPos)],
          },
        });

        mapMarkers.push({
          position: patient.ambulancePos,
          color: "#ef4444",
          sizePx: 32,
          popup: {
            title: patient.name || `Patient ${patient.id}`,
            subtitle: patient.id,
            etaMinutes: patient.eta,
          },
        });

        fitPoints.push(patient.ambulancePos);
        fitPoints.push(patient.hospitalPos);
      });

      return {
        routes,
        mapMarkers,
        fitPoints,
      };
    }

    return {
      routes: [
        {
          type: "Feature",
          properties: {
            color: "#3b82f6",
          },
          geometry: {
            type: "LineString",
            coordinates: [toLngLat(ambulancePos), toLngLat(hospitalPos)],
          },
        },
      ],
      mapMarkers: [
        {
          position: ambulancePos,
          color: "#ef4444",
          sizePx: 32,
          popup: {
            title: `Patient: ${patientId}`,
            etaMinutes: eta,
          },
        },
        {
          position: hospitalPos,
          color: "#3b82f6",
          sizePx: 28,
          popup: {
            title: "Receiving Hospital",
          },
        },
      ],
      fitPoints: [ambulancePos, hospitalPos],
    };
  }, [
    allPatients,
    ambulancePos,
    eta,
    hasPatientCollection,
    hospitalPos,
    patientId,
  ]);

  const renderMapContent = (isExpanded = false) => (
    <MapboxMapContent
      center={center}
      compact={compact}
      isExpanded={isExpanded}
      fitCoordinates={mapContentData.fitPoints}
      routeFeatures={mapContentData.routes}
      markers={mapContentData.mapMarkers}
    />
  );

  if (!expandable) {
    return (
      <div className={compact ? "h-48" : "h-full"} style={{ position: "relative" }}>
        {renderMapContent(false)}
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className={compact ? "h-48" : "h-64"} style={{ position: "relative" }}>
          {renderMapContent(false)}
        </div>
        <Button
          onClick={() => {
            setExpanded(true);
          }}
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
              <Button
                onClick={() => setExpanded(false)}
                size="sm"
                className="absolute top-4 right-4 z-[1000] bg-slate-900/90 hover:bg-slate-800 text-white gap-1.5 backdrop-blur-sm"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Close
              </Button>
              {renderMapContent(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}