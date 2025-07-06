
// This is the fixed React App.js base structure for EatLiftBurn
// It ensures `showProfileSelector` is only declared once and supports profile-based macro logic

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [mode, setMode] = useState("Cut");
  const [selectedProfile, setSelectedProfile] = useState("Jon");
  const [weightLog, setWeightLog] = useState(() => {
    const stored = localStorage.getItem("weightLog");
    return stored ? JSON.parse(stored) : [];
  });
  const [showProfileSelector, setShowProfileSelector] = useState(false); // Fixed: declared only once

  const latestWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : 70;
  const weightKg = latestWeight * 0.453592;
  const bmr = selectedProfile === "Jon" ? 1610 : 1450;

  const getProteinGoal = () => {
    if (mode === "Cut" || mode === "Bulk") return Math.ceil(0.9 * weightKg);
    return Math.ceil(0.8 * weightKg);
  };

  const getFatGoal = () => {
    const pct = selectedProfile === "Chava"
      ? mode === "Bulk" ? 0.35 : 0.30
      : mode === "Bulk" ? 0.30 : 0.25;
    return Math.round((pct * bmr) / 9);
  };

  const getCarbGoal = () => {
    const factor = mode === "Cut" ? 1.8 : mode === "Maintenance" ? 2.2 : 2.5;
    return Math.round(factor * weightKg);
  };

  const protein = getProteinGoal();
  const fat = getFatGoal();
  const carbs = getCarbGoal();

  return (
    <div className="App">
      <h1>EatLiftBurn</h1>
      <div>
        <button onClick={() => setShowProfileSelector(!showProfileSelector)}>
      {selectedProfile === "Jon" ? "👨" : "👩"}
    </button>
        {showProfileSelector && (
          <div>
            <button onClick={() => setSelectedProfile("Jon")}>Jon</button>
            <button onClick={() => setSelectedProfile("Chava")}>Chava</button>
          </div>
        )}
      </div>
      <div>
        <h2>Mode: {mode}</h2>
        <button onClick={() => setMode("Cut")}>Cut</button>
        <button onClick={() => setMode("Maintenance")}>Maintenance</button>
        <button onClick={() => setMode("Bulk")}>Bulk</button>
      </div>
      <div>
        <p>Profile: {selectedProfile}</p>
        <p>Latest Weight: {latestWeight} lbs</p>
        <p>Protein goal: {protein}g</p>
        <p>Fat goal: {fat}g</p>
        <p>Carb goal: {carbs}g</p>
      </div>
    </div>
  );
}

export default App;
