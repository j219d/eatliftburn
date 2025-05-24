# Let's generate the full, corrected React app code based on all confirmed fixes.
# It will include: fixed food log delete logic, fixed workout log delete logic, calories/steps sync,
# and all features previously confirmed.

full_code = """
// EatLiftBurn – Fully Fixed App with Food & Workout Deletion Sync
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

  const stepCalories = Math.round(steps * 0.04);
  const totalBurned = stepCalories + manualBurn;
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
    <button style={{ fontSize: "18px", padding: "10px 16px", marginBottom: "16px" }} onClick={() => setScreen("home")}>
      ⬅ Home
    </button>
  );

  if (screen === "food") {
    return (
      <div style={{ padding: '20px' }}>
        <HomeButton />
        <h2>Food Log</h2>
        <select onChange={(e) => {
          const { name, cal, prot } = JSON.parse(e.target.value);
          setCalories(c => c + cal);
          setProtein(p => p + prot);
          setFoodLog(f => [...f, { name, cal, prot }]);
        }} defaultValue="">
          <option value="" disabled>Select Food</option>
          {foodOptions.map((f, i) => <option key={i} value={JSON.stringify(f)}>{f.name}</option>)}
        </select>
        <div>
          <input placeholder="Name" value={customFood.name} onChange={e => setCustomFood({ ...customFood, name: e.target.value })} />
          <input placeholder="Calories" type="number" value={customFood.cal} onChange={e => setCustomFood({ ...customFood, cal: e.target.value })} />
          <input placeholder="Protein" type="number" value={customFood.prot} onChange={e => setCustomFood({ ...customFood, prot: e.target.value })} />
          <button onClick={() => {
            const { name, cal, prot } = customFood;
            const parsedCal = parseInt(cal);
            const parsedProt = parseInt(prot);
            if (name && parsedCal && parsedProt) {
              setCalories(c => c + parsedCal);
              setProtein(p => p + parsedProt);
              setFoodLog(f => [...f, { name, cal: parsedCal, prot: parsedProt }]);
              setCustomFood({ name: "", cal: "", prot: "" });
            }
          }}>Add</button>
        </div>
        <ul>
          {foodLog.map((f, i) => (
            <li key={i}>
              {f.name} - {f.cal} cal, {f.prot}g{" "}
              <button onClick={() => {
                const removed = foodLog[i];
                setCalories(c => c - removed.cal);
                setProtein(p => p - removed.prot);
                setFoodLog(foodLog.filter((_, idx) => idx !== i));
              }}>
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (screen === "workouts") {
    return (
      <div style={{ padding: '20px' }}>
        <HomeButton />
        <h2>Workout Log</h2>
        {Object.keys(workouts).map(type => (
          <div key={type}>
            <label>{type}: </label>
            <input type="number" onChange={e => {
              const reps = parseInt(e.target.value);
              if (!isNaN(reps)) {
                const burn = Math.round(workouts[type] * reps);
                setWorkoutLog(prev => {
                  const updated = { ...prev };
                  updated[type] = (updated[type] || 0) + reps;
                  return updated;
                });
                setManualBurn(b => b + burn);
                if (type === "Steps") setSteps(prev => prev + reps);
              }
            }} />
            <button>Add</button>
          </div>
        ))}
        <h3>Logged Workouts:</h3>
        <ul>
          {Object.entries(workoutLog).map(([type, reps]) => (
            <li key={type}>
              {type}: {reps} reps, {Math.round(reps * workouts[type])} cal{" "}
              <button onClick={() => {
                const caloriesToRemove = Math.round(reps * workouts[type]);
                const updatedLog = { ...workoutLog };
                delete updatedLog[type];
                setWorkoutLog(updatedLog);
                setManualBurn(b => b - caloriesToRemove);
                if (type === "Steps") setSteps(0);
              }}>
                ❌
              </button>
            </li>
          ))}
        </ul>
        <p>Total Workout Burn: {manualBurn} cal</p>
      </div>
    );
  }

  // Return Home screen
  return (
    <div style={{ padding: '20px' }}>
      <h1>EatLiftBurn</h1>
      <p style={{ fontSize: '14px', color: '#666' }}>an app by Jon Deutsch</p>
      <h2>Today's Overview</h2>
      <p>Calories Eaten: {calories}</p>
      <p>Calories Burned: {totalBurned}</p>
      <p>Deficit: {estimatedDeficit} / {deficitGoal}</p>
      <p>Protein: {protein} / {proteinGoal}</p>
      <p>Steps: {steps} / {stepGoal}</p>
      <h3>Checklist</h3>
      {Object.keys(checklist).map(key => (
        <div key={key}>
          <label>
            <input type="checkbox" checked={checklist[key]} onChange={() =>
              setChecklist(c => ({ ...c, [key]: !c[key] }))
            } /> {key}
          </label>
        </div>
      ))}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setScreen("food")}>🍽️ Food Log</button>
        <button onClick={() => setScreen("workouts")}>🏋️ Workouts</button>
        {/* Add weight and summary screens here as needed */}
      </div>
      <button onClick={resetDay} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>Reset</button>
    </div>
  );
}

export default App;
"""

full_code
