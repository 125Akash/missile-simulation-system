import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Circle,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import rocket from "../assets/rocket.png";

// 🔥 Curve generator
function getCurvePoints(start, end, steps = 50) {
  const points = [];
  const midLat = (start[0] + end[0]) / 2 + 20;
  const midLng = (start[1] + end[1]) / 2;

  for (let t = 0; t <= 1; t += 1 / steps) {
    const lat =
      (1 - t) * (1 - t) * start[0] +
      2 * (1 - t) * t * midLat +
      t * t * end[0];

    const lng =
      (1 - t) * (1 - t) * start[1] +
      2 * (1 - t) * t * midLng +
      t * t * end[1];

    points.push([lat, lng]);
  }

  return points;
}

// ⏱ Time calculation
function calculateTime(distanceKm, speedMach) {
  const speedKmh = speedMach * 1225;
  const timeSeconds = (distanceKm / speedKmh) * 3600;
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = Math.floor(timeSeconds % 60);
  return `${minutes}m ${seconds}s`;
}

// 🚀 Rocket icon
const rocketIcon = new L.Icon({
  iconUrl: rocket,
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

// 🎥 Auto Zoom
function AutoZoom({ target }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 5, { duration: 2 });
    }
  }, [target, map]);

  return null;
}

// 🔥 Fallback for small missiles
function generateNearbyTarget(country) {
  const latOffset = (Math.random() - 0.5) * 6;
  const lngOffset = (Math.random() - 0.5) * 6;

  return {
    country: "Nearby Target",
    capital: "Local Strike",
    lat: country.capital.lat + latOffset,
    lng: country.capital.lng + lngOffset,
    distance_km: Math.floor(Math.random() * 400 + 100),
  };
}

function MapView({ country, targets, selectedMissile }) {
  const [angle, setAngle] = useState(0);
  const [activeTargets, setActiveTargets] = useState([]);
  const [impactQueue, setImpactQueue] = useState([]);
  const [currentImpact, setCurrentImpact] = useState(null);

  // 📡 Radar rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // 🔁 Reset
  useEffect(() => {
    setActiveTargets([]);
    setImpactQueue([]);
    setCurrentImpact(null);
  }, [country, targets]);

  // 🚀 Launch missiles (WITH FALLBACK)
  useEffect(() => {
    if (!country) return;

    const launchTargets =
      targets.length > 0
        ? targets
        : [generateNearbyTarget(country)];

    launchTargets.forEach((t, i) => {
      setTimeout(() => {
        setActiveTargets((prev) => [
          ...prev,
          { ...t, id: i, progress: 0, hit: false },
        ]);
      }, i * 400);
    });
  }, [country, targets]);

  // 🚀 Animate missiles
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTargets((prev) =>
        prev.map((t) => {
          const newProgress = t.progress >= 1 ? 1 : t.progress + 0.02;

          if (newProgress >= 1 && !t.hit) {
            setImpactQueue((q) => [...q, t]);
          }

          return {
            ...t,
            progress: newProgress,
            hit: newProgress >= 1,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 🎥 Sequential zoom
  useEffect(() => {
    if (impactQueue.length === 0 || currentImpact) return;

    const next = impactQueue[0];
    setCurrentImpact(next);
    setImpactQueue((q) => q.slice(1));

    setTimeout(() => setCurrentImpact(null), 2500);
  }, [impactQueue, currentImpact]);

  // ✅ Safety check
  if (!country?.capital?.lat || !country?.capital?.lng) {
    return <p>Invalid country data</p>;
  }

  const radarCenter = [
    country.capital.lat,
    country.capital.lng,
  ];

  const angleRad = (angle * Math.PI) / 180;
  const radarEnd = [
    country.capital.lat + Math.cos(angleRad) * 10,
    country.capital.lng + Math.sin(angleRad) * 10,
  ];

  return (
    <MapContainer
      center={[country.capital.lat, country.capital.lng]}
      zoom={3}
      style={{ height: "100%", width: "100%" }}
    >
      <AutoZoom target={currentImpact} />

      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      {/* 📡 Radar */}
      <Circle
        center={radarCenter}
        radius={2000000}
        pathOptions={{ color: "green", fillOpacity: 0.1 }}
      />

      <Polyline
        positions={[radarCenter, radarEnd]}
        pathOptions={{ color: "lime", weight: 2 }}
      />

      {/* 🔴 Range */}
      {selectedMissile && (
        <Circle
          center={radarCenter}
          radius={selectedMissile.range * 1000}
          pathOptions={{
            color: "red",
            dashArray: "5,5",
            fillOpacity: 0.05,
          }}
        />
      )}

      {/* 🎯 Styled Targets */}
      {targets.map((t, i) => (
        <Marker
          key={i}
          position={[t.lat, t.lng]}
          icon={
            new L.DivIcon({
              html: `
                <div style="
                  width:14px;
                  height:14px;
                  border-radius:50%;
                  background:${
                    t.distance_km < 2000
                      ? "#ff3b3b"
                      : t.distance_km < 5000
                      ? "#ffa500"
                      : "#ffff00"
                  };
                  box-shadow:0 0 12px ${
                    t.distance_km < 2000 ? "#ff3b3b" : "#ffa500"
                  };
                  border:2px solid white;
                "></div>
              `,
              className: "",
            })
          }
        />
      ))}

      {/* 🚀 Missiles */}
      {activeTargets.map((t) => {
        const start = radarCenter;
        const end = [t.lat, t.lng];

        const curve = getCurvePoints(start, end);
        const index = Math.floor(t.progress * (curve.length - 1));
        const position = curve[index];

        return (
          <div key={t.id}>
            <Polyline positions={curve} pathOptions={{ color: "orange" }} />

            <Polyline
              positions={curve.slice(0, index + 1)}
              pathOptions={{ color: "yellow", weight: 4 }}
            />

            <Marker position={position} icon={rocketIcon} />

            {/* 💥 Explosion + Time Box */}
            {t.progress >= 1 && (
              <Marker
                position={[t.lat, t.lng]}
                icon={
                  new L.DivIcon({
                    html: `
                      <div style="
                        display:flex;
                        flex-direction:column;
                        align-items:center;
                      ">
                        <div style="
                          width:18px;
                          height:18px;
                          background:red;
                          border-radius:50%;
                          box-shadow:0 0 25px orange;
                          margin-bottom:6px;
                        "></div>

                        <div style="
                          color:black;
                          font-size:12px;
                          background:white;
                          padding:5px 10px;
                          border-radius:6px;
                          border:1px solid #ccc;
                          font-weight:600;
                          box-shadow:0 2px 8px rgba(0,0,0,0.4);
                        ">
                          ⏱ ${calculateTime(
                            t.distance_km,
                            selectedMissile?.speed || 20
                          )}
                        </div>
                      </div>
                    `,
                    className: "",
                  })
                }
              />
            )}
          </div>
        );
      })}
    </MapContainer>
  );
}

export default MapView;