// EatLiftBurn – Full App with All Screens Restored
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

  const workouts = {
    "Push-ups": 0.29,
    "Pull-ups": 0.5,
    "Biceps": 0.25,
    "Bench Press": 0.42,
    "Triceps": 0.3,
    "Leg Press": 0.35,
    "Steps": 0.04
  };

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

  const average = arr => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const avgWeight = average(weightLog.map(w => parseFloat(w.weight)));

  const HomeButton = () => <button style={{ fontSize: "18px", padding: "10px 16px", marginBottom: "16px" }} onClick={() => setScreen("home")}>⬅ Home</button>;

  if (screen === "food") {
    return (
      <div style={{ padding: '20px' }}>
        <HomeButton />
        <h2>Food Log</h2>
        <ul>{foodLog.map((f, i) => <li key={i}>{f.name || 'Food'} - {f.cal} cal, {f.prot}g <button onClick={() => setFoodLog(foodLog.filter((_, idx) => idx !== i))}>❌</button></li>)}</ul>
      </div>
    );
  }

  if (screen === "workouts") {
    return (
      <div style={{ padding: '20px' }}>
        <HomeButton />
        <h2>Workout Log</h2>
        <ul>{Object.entries(workoutLog).map(([type, reps], i) => (
          <li key={i}>{type}: {reps} reps — {Math.round(reps * workouts[type])} cal <button onClick={() => {
            const updated = { ...workoutLog };
            setManualBurn(b => b - Math.round(reps * workouts[type]));
            delete updated[type];
            setWorkoutLog(updated);
          }}>❌</button></li>
        ))}</ul>
        <p><strong>Total Workout Burn:</strong> {Object.entries(workoutLog).reduce((sum, [type, reps]) => sum + Math.round(reps * workouts[type]), 0)} cal</p>
      </div>
    );
  }

  if (screen === "weight") {
    return (
      <div style={{ padding: '20px' }}>
        <HomeButton />
        <h2>Weight Tracker</h2>
        <input value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Enter weight" />
        <button onClick={() => {
          if (newWeight) {
            const updated = [...weightLog, { date: new Date().toLocaleDateString(), weight: newWeight }];
            setWeightLog(updated);
            setNewWeight("");
          }
        }}>Add</button>
        <Line data={{
          labels: weightLog.map(entry => entry.date),
          datasets: [{ label: "Weight", data: weightLog.map(entry => entry.weight), fill: false, borderColor: "#4bc0c0", tension: 0.1 }]
        }} />
        <ul>{weightLog.map((w, i) => <li key={i}>{w.date}: {w.weight} <button onClick={() => setWeightLog(weightLog.filter((_, idx) => idx !== i))}>❌</button></li>)}</ul>
      </div>
    );
  }

  if (screen === "summary") {
    return (
      <div style={{ padding: '20px' }}>
        <HomeButton />
        <h2>Weekly Summary</h2>
        <p>Avg Deficit: {estimatedDeficit}</p>
        <p>Avg Protein: {protein}</p>
        <p>Steps: {steps}</p>
        <p>Avg Weight: {avgWeight.toFixed(1)}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>EatLiftBurn</h1>
      <div style={{ fontSize: '14px', marginBottom: '12px', color: '#555' }}>an app by Jon Deutsch</div>
      <h2 style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '4px' }}>Today's Overview</h2>
      <p style={{ margin: '4px 0' }}>Calories Eaten: {calories}</p>
      <p style={{ margin: '4px 0' }}>Calories Burned: {totalBurned}</p>
      <p style={{ margin: '4px 0' }}>Deficit: {estimatedDeficit} / {deficitGoal}</p>
      <p style={{ margin: '4px 0' }}>Protein: {protein} / {proteinGoal}</p>
      <p style={{ margin: '4px 0' }}>Steps: {steps} / {stepGoal}</p>
      <h3 style={{ marginTop: '12px', marginBottom: '4px' }}>Checklist</h3>
      {Object.keys(checklist).map(key => (
        <div key={key}>
          <label>
            <input type="checkbox" checked={checklist[key]} onChange={() => setChecklist(c => ({ ...c, [key]: !c[key] }))} /> {key}
          </label>
        </div>
      ))}
      <div style={{ marginTop: '24px' }}>
        <button style={{ fontSize: '18px', padding: '14px 20px', margin: '6px' }} onClick={() => setScreen("food")}>🍽️ Food Log</button>
        <button style={{ fontSize: '18px', padding: '14px 20px', margin: '6px' }} onClick={() => setScreen("workouts")}>🏋️ Workouts</button>
        <button style={{ fontSize: '18px', padding: '14px 20px', margin: '6px' }} onClick={() => setScreen("weight")}>⚖️ Weight</button>
        <button style={{ fontSize: '18px', padding: '14px 20px', margin: '6px' }} onClick={() => setScreen("summary")}>📊 Summary</button>
      </div>
      <button onClick={resetDay} style={{ backgroundColor: '#f44336', color: 'white', fontSize: '16px', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>Reset</button>
    </div>
  );
}

export default App;
