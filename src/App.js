import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function App() {
  const [screen, setScreen] = useState("home");
  const [calories, setCalories] = useState(() => parseInt(localStorage.getItem("calories")) || 0);
  const [protein, setProtein] = useState(() => parseInt(localStorage.getItem("protein")) || 0);
  const [steps, setSteps] = useState(() => parseInt(localStorage.getItem("steps")) || 0);
  const [manualBurn, setManualBurn] = useState(() => parseInt(localStorage.getItem("manualBurn")) || 0);
  const [deficitGoal, setDeficitGoal] = useState(() => parseInt(localStorage.getItem("deficitGoal")) || 1000);
  const [proteinGoal, setProteinGoal] = useState(() => parseInt(localStorage.getItem("proteinGoal")) || 130);
  const [stepGoal] = useState(10000);
  const [checklist, setChecklist] = useState(() => JSON.parse(localStorage.getItem("checklist")) || {
    supplements: false,
    sunlight: false
  });
  const [foodLog, setFoodLog] = useState(() => JSON.parse(localStorage.getItem("foodLog")) || []);
  const [workoutLog, setWorkoutLog] = useState(() => JSON.parse(localStorage.getItem("workoutLog")) || {});
  const [weightLog, setWeightLog] = useState(() => JSON.parse(localStorage.getItem("weightLog")) || []);
  const [newWeight, setNewWeight] = useState("");
  const [customFood, setCustomFood] = useState({ name: "", cal: "", prot: "" });
  const [customSteps, setCustomSteps] = useState("");

  const workouts = {
    "Push-ups": 0.29,
    "Pull-ups": 0.5,
    "Biceps": 0.25,
    "Bench Press": 0.42,
    "Triceps": 0.3,
    "Leg Press": 0.35,
    "Steps": 0.04
  };

  const foodOptions = [
    { name: "Chicken breast (50g)", cal: 82, prot: 15 },
    { name: "Chicken breast (100g)", cal: 165, prot: 31 },
    { name: "Chicken breast (150g)", cal: 248, prot: 46 },
    { name: "Chicken breast (200g)", cal: 330, prot: 62 },
    { name: "Apple", cal: 95, prot: 1 },
    { name: "Promix bar", cal: 150, prot: 15 },
    { name: "Quest bar", cal: 190, prot: 21 },
    { name: "Egg", cal: 70, prot: 6 },
    { name: "Egg white", cal: 15, prot: 3 },
    { name: "Tomatoes", cal: 20, prot: 1 },
    { name: "Green onions", cal: 5, prot: 0 },
    { name: "Butter (1 tsp)", cal: 35, prot: 0 },
    { name: "Olive oil (1 tbsp)", cal: 120, prot: 0 },
    { name: "Protein ice cream", cal: 400, prot: 52 },
    { name: "2 eggs + butter", cal: 175, prot: 12 },
    { name: "2 eggs, 1 egg white + butter", cal: 190, prot: 15 },
    { name: "Yogurt 0%", cal: 117, prot: 20 }
  ];

  const totalBurned = manualBurn;
  const estimatedDeficit = 1740 + totalBurned - calories;

  useEffect(() => {
    localStorage.setItem("calories", calories);
    localStorage.setItem("protein", protein);
    localStorage.setItem("steps", steps);
    localStorage.setItem("manualBurn", manualBurn);
    localStorage.setItem("deficitGoal", deficitGoal);
    localStorage.setItem("proteinGoal", proteinGoal);
    localStorage.setItem("checklist", JSON.stringify(checklist));
    localStorage.setItem("foodLog", JSON.stringify(foodLog));
    localStorage.setItem("workoutLog", JSON.stringify(workoutLog));
    localStorage.setItem("weightLog", JSON.stringify(weightLog));
  }, [calories, protein, steps, manualBurn, deficitGoal, proteinGoal, checklist, foodLog, workoutLog, weightLog]);

  const resetDay = () => {
    setCalories(0);
    setProtein(0);
    setSteps(0);
    setManualBurn(0);
    setFoodLog([]);
    setWorkoutLog({});
    setChecklist({ supplements: false, sunlight: false });
  };

  const HomeButton = () => (
    <button
      onClick={() => setScreen("home")}
      style={{
        fontSize: "16px",
        padding: "10px 16px",
        backgroundColor: "#eee",
        border: "1px solid #ccc",
        borderRadius: "6px",
        marginBottom: "16px"
      }}
    >
      ⬅ Home
    </button>
  );

  if (screen === "home") {
    return (
      <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>EatLiftBurn</h1>
        <div style={{ fontSize: "14px", marginBottom: "20px", color: "#555" }}>an app by Jon Deutsch</div>

        <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>Today's Overview</h2>
          <p>Calories Eaten: {calories}</p>
          <p>Calories Burned: {totalBurned}</p>
          <p>Deficit: {estimatedDeficit} / {deficitGoal}</p>
          <p>Protein: {protein} / {proteinGoal}</p>
          <p>Steps: {steps} / {stepGoal}</p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "8px" }}>Checklist</h3>
          {Object.keys(checklist).map((key) => (
            <div key={key} style={{ marginBottom: "6px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={checklist[key]}
                  onChange={() => setChecklist((c) => ({ ...c, [key]: !c[key] }))}
                />{" "}
                {key}
              </label>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          <button style={navBtnStyle} onClick={() => setScreen("food")}>🍽 Food Log</button>
          <button style={navBtnStyle} onClick={() => setScreen("workouts")}>🏋️ Workouts</button>
          <button style={navBtnStyle} onClick={() => setScreen("weight")}>⚖️ Weight</button>
          <button style={navBtnStyle} onClick={() => setScreen("summary")}>📊 Summary</button>
        </div>

        <button
          onClick={resetDay}
          style={{
            backgroundColor: "#d32f2f",
            color: "#fff",
            padding: "12px",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            width: "100%",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          Reset
        </button>
      </div>
    );
  }

  const navBtnStyle = {
    fontSize: "18px",
    padding: "14px 20px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    cursor: "pointer"
  };

  if (screen === "food") {
    return (
      <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
        <HomeButton />
        <div style={cardStyle}>
          <h2>Food Log</h2>
          <select
            onChange={(e) => {
              const { name, cal, prot } = JSON.parse(e.target.value);
              setCalories((c) => c + cal);
              setProtein((p) => p + prot);
              setFoodLog((f) => [...f, { name, cal, prot }]);
            }}
            defaultValue=""
            style={{ padding: "10px", borderRadius: "8px", marginBottom: "12px", width: "100%" }}
          >
            <option value="" disabled>Select Food</option>
            {foodOptions.map((f, i) => (
              <option key={i} value={JSON.stringify(f)}>
                {f.name}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              placeholder="Name"
              value={customFood.name}
              onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Calories"
              type="number"
              value={customFood.cal}
              onChange={(e) => setCustomFood({ ...customFood, cal: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Protein"
              type="number"
              value={customFood.prot}
              onChange={(e) => setCustomFood({ ...customFood, prot: e.target.value })}
              style={inputStyle}
            />
            <button
              onClick={() => {
                const { name, cal, prot } = customFood;
                const parsedCal = parseInt(cal);
                const parsedProt = parseInt(prot);
                if (name && parsedCal && parsedProt) {
                  setCalories((c) => c + parsedCal);
                  setProtein((p) => p + parsedProt);
                  setFoodLog((f) => [...f, { name, cal: parsedCal, prot: parsedProt }]);
                  setCustomFood({ name: "", cal: "", prot: "" });
                }
              }}
              style={navBtnStyle}
            >
              Add
            </button>
          </div>

          <ul>
            {foodLog.map((f, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                {f.name} — {f.cal} cal, {f.prot}g{" "}
                <button
                  onClick={() => {
                    const removed = foodLog[i];
                    setCalories((c) => c - removed.cal);
                    setProtein((p) => p - removed.prot);
                    setFoodLog(foodLog.filter((_, idx) => idx !== i));
                  }}
                  style={{ marginLeft: "8px", background: "transparent", color: "red", border: "none", fontSize: "18px" }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100px"
  };

  if (screen === "workouts") {
    return (
      <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
        <HomeButton />
        <div style={cardStyle}>
          <h2>Workout Log</h2>
          {Object.keys(workouts).map((type, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "12px", gap: "8px" }}>
              <label style={{ minWidth: "100px" }}>{type}:</label>
              <input
                type="number"
                placeholder="Reps"
                onChange={e => setCustomSteps(e.target.value)}
                value={type === "Steps" ? customSteps : ""}
                style={inputStyle}
              />
              <button onClick={() => {
                const reps = parseInt(customSteps);
                if (!isNaN(reps)) {
                  const burn = Math.round(workouts[type] * reps);
                  setWorkoutLog(prev => {
                    const updated = { ...prev };
                    updated[type] = (updated[type] || 0) + reps;
                    return updated;
                  });
                  setManualBurn(m => m + burn);
                  if (type === "Steps") setSteps(s => s + reps);
                  setCustomSteps("");
                }
              }} style={navBtnStyle}>Add</button>
            </div>
          ))}

          <h3 style={{ marginTop: "20px" }}>Workout Summary</h3>
          <ul style={{ marginTop: "8px" }}>
            {Object.entries(workoutLog).map(([type, reps], i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                {type}: {reps} reps — {Math.round(reps * workouts[type])} cal{" "}
                <button
                  onClick={() => {
                    const burn = Math.round(reps * workouts[type]);
                    const updated = { ...workoutLog };
                    delete updated[type];
                    setWorkoutLog(updated);
                    setManualBurn(m => m - burn);
                    if (type === "Steps") setSteps(0);
                  }}
                  style={{ marginLeft: "8px", background: "transparent", color: "red", border: "none", fontSize: "18px" }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "12px", fontWeight: "bold" }}>Total Workout Burn: {manualBurn} cal</p>
        </div>
      </div>
    );
  }

  if (screen === "weight") {
    const data = {
      labels: weightLog.map(w => w.date),
      datasets: [
        {
          label: "Weight (lbs)",
          data: weightLog.map(w => w.weight),
          fill: false,
          borderColor: "#4caf50",
          tension: 0.3,
          pointRadius: 4
        }
      ]
    };

    return (
      <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
        <HomeButton />
        <div style={cardStyle}>
          <h2>Weight Tracker</h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <input
              placeholder="Enter weight"
              value={newWeight}
              onChange={e => setNewWeight(e.target.value)}
              style={inputStyle}
            />
            <button
              onClick={() => {
                const val = parseFloat(newWeight);
                if (!isNaN(val)) {
                  setWeightLog(w => [...w, { date: new Date().toLocaleDateString(), weight: val }]);
                  setNewWeight("");
                }
              }}
              style={navBtnStyle}
            >
              Log
            </button>
          </div>

          <ul>
            {weightLog.map((w, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                {w.date}: {w.weight} lbs{" "}
                <button
                  onClick={() => setWeightLog(weightLog.filter((_, idx) => idx !== i))}
                  style={{ marginLeft: "8px", background: "transparent", color: "red", border: "none", fontSize: "18px" }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          {weightLog.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <Line data={data} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === "summary") {
    const avgWeight =
      weightLog.length > 0
        ? weightLog.reduce((sum, w) => sum + w.weight, 0) / weightLog.length
        : 0;

    return (
      <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
        <HomeButton />
        <div style={cardStyle}>
          <h2>Weekly Summary</h2>
          <p>Avg Deficit: {estimatedDeficit}</p>
          <p>Avg Protein: {protein}</p>
          <p>Steps: {steps}</p>
          <p>Avg Weight: {avgWeight.toFixed(1)} lbs</p>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
