import React, { useEffect, useState } from "react";
import axios from "axios";
import MapView from "./components/MapView";
import "./App.css";

// 🔥 Typing Component
function TypingText({ text }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="hack-corner">
      {displayed}
      <span className="cursor">|</span>
    </div>
  );
}

function App() {
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [targets, setTargets] = useState([]);
  const [selectedMissile, setSelectedMissile] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/countries")
      .then(res => setCountries(res.data))
      .catch(err => console.error(err));
  }, []);

  function selectBestMissile(missiles, targets) {
    if (!targets || targets.length === 0) return missiles[0];

    const maxDistance = Math.max(...targets.map(t => t.distance_km));

    return (
      missiles.find(m => m.range >= maxDistance) ||
      missiles[missiles.length - 1]
    );
  }

  async function handleCountrySelect(c) {
    try {
      setSelected(c);
      setTargets([]);
      setSelectedMissile(null);

      if (!c.missiles || c.missiles.length === 0) return;

      const firstMissile = c.missiles[0];

      const res = await fetch(
        `http://127.0.0.1:8000/targets/${c.name}/${firstMissile.name}`
      );
      const data = await res.json();

      const best = selectBestMissile(c.missiles, data);
      setSelectedMissile(best);

      const res2 = await fetch(
        `http://127.0.0.1:8000/targets/${c.name}/${best.name}`
      );
      const finalTargets = await res2.json();

      setTargets(finalTargets);

    } catch (err) {
      console.error(err);
    }
  }

  async function handleMissileSelect(m) {
    try {
      if (!selected) return;

      setSelectedMissile(m);

      const res = await fetch(
        `http://127.0.0.1:8000/targets/${selected.name}/${m.name}`
      );
      const data = await res.json();

      setTargets(data);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="app-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🚀 Missile Control</h2>

        <div className="section">
          <h4>Countries</h4>
          {countries.map((c, i) => (
            <button
              key={i}
              className={`btn ${selected?.name === c.name ? "active" : ""}`}
              onClick={() => handleCountrySelect(c)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {selected && (
          <div className="section">
            <h4>Missiles</h4>
            {selected.missiles.map((m, i) => (
              <button
                key={i}
                className={`btn missile ${
                  selectedMissile?.name === m.name ? "active" : ""
                }`}
                onClick={() => handleMissileSelect(m)}
              >
                {m.name}
                <span>{m.range} km</span>
              </button>
            ))}
          </div>
        )}

        {selectedMissile && (
          <div className="info-card">
            <h4>🚀 Selected Missile</h4>
            <p><b>Name:</b> {selectedMissile.name}</p>
            <p><b>Range:</b> {selectedMissile.range} km</p>
            <p><b>Type:</b> {selectedMissile.type}</p>
            <p><b>Speed:</b> Mach {selectedMissile.speed}</p>
          </div>
        )}

        {targets.length > 0 && (
          <div className="info-card">
            <h4>🎯 Targets</h4>
            {targets.map((t, i) => (
              <div key={i} className="target-item">
                <span>{t.capital}</span>
                <span>{t.distance_km} km</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="map-container">
        <MapView
          country={selected}
          targets={targets}
          selectedMissile={selectedMissile}
        />

        {/* 🔥 Typing Hack UI */}
        {selected && (
          <TypingText
            text={`>> ${selected.name.toUpperCase()} SYSTEM ONLINE`}
          />
        )}
      </div>

    </div>
  );
}

export default App;