// Eatliftburn App - Plain CSS version with improved styling and layout
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
  const [workoutLog, setWorkoutLog] = useState(() => JSON.parse(localStorage.getItem("workoutLog")) || []);
  const [weightLog, setWeightLog] = useState(() => JSON.parse(localStorage.getItem("weightLog")) || []);
  const [newWeight, setNewWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState(() => parseFloat(localStorage.getItem("goalWeight")) || 0);
  const [customFood, setCustomFood] = useState({ name: "", cal: "", prot: "" });
  const [customWorkout, setCustomWorkout] = useState({});

  const workouts = {
    "Push-ups": 0.29,
    "Pull-ups": 0.5,
    "Bench Press": 0.42,
    "Leg Press": 0.35,
    "Bicep Curls": 0.25,
    "Tricep Pulls": 0.3
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
    localStorage.setItem("goalWeight", goalWeight);
  }, [calories, protein, steps, manualBurn, deficitGoal, proteinGoal, checklist, foodLog, workoutLog, weightLog, goalWeight]);

  const resetDay = () => {
    setCalories(0);
    setProtein(0);
    setSteps(0);
    setManualBurn(0);
    setFoodLog([]);
    setWorkoutLog([]);
    setChecklist({ supplements: false, sunlight: false });
  };

  const addCustomFood = () => {
    const { name, cal, prot } = customFood;
    const parsedCal = parseInt(cal);
    const parsedProt = parseInt(prot);
    if (name && parsedCal && parsedProt) {
      setCalories(c => c + parsedCal);
      setProtein(p => p + parsedProt);
      setFoodLog(f => [...f, { name, cal: parsedCal, prot: parsedProt }]);
      setCustomFood({ name: "", cal: "", prot: "" });
    }
  };

  const logWorkout = (type, reps) => {
    const burn = Math.round(workouts[type] * reps);
    setWorkoutLog(w => [...w, { type, reps, burn }]);
    setManualBurn(b => b + burn);
  };

  const removeWorkout = (index) => {
    const removed = workoutLog[index];
    setManualBurn(b => b - removed.burn);
    setWorkoutLog(log => log.filter((_, i) => i !== index));
  };

  const weightChartData = {
    labels: weightLog.map(entry => entry.date),
    datasets: [
      {
        label: "Weight",
        data: weightLog.map(entry => entry.weight),
        fill: false,
        borderColor: "#4bc0c0",
        tension: 0.1
      }
    ]
  };

  const average = arr => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const avgWeight = average(weightLog.map(w => parseFloat(w.weight)));
  const weightDelta = goalWeight ? (avgWeight - goalWeight).toFixed(1) : null;

  const buttonStyle = {
    padding: '12px 16px',
    margin: '8px',
    fontSize: '16px',
    borderRadius: '8px',
    backgroundColor: '#eee',
    border: '1px solid #ccc',
    cursor: 'pointer'
  };

  const titleStyle = { fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' };

  if (screen === "food") return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => setScreen("home")}>⬅ Home</button>
      <div style={titleStyle}>Food Log</div>
      <select onChange={(e) => {
        const [cal, prot, name] = JSON.parse(e.target.value);
        setCalories(c => c + cal);
        setProtein(p => p + prot);
        setFoodLog(f => [...f, { name, cal, prot }]);
      }} defaultValue="">
        <option value="" disabled>Log food</option>
        <option value={JSON.stringify([165, 31, "Chicken breast (150g)"])}>Chicken breast</option>
        <option value={JSON.stringify([95, 1, "Apple"])}>Apple</option>
        <option value={JSON.stringify([260, 20, "Promix bar"])}>Promix bar</option>
        <option value={JSON.stringify([190, 21, "Quest bar"])}>Quest bar</option>
      </select>
      <div>
        <input placeholder="Name" value={customFood.name} onChange={e => setCustomFood({ ...customFood, name: e.target.value })} />
        <input placeholder="Calories" type="number" value={customFood.cal} onChange={e => setCustomFood({ ...customFood, cal: e.target.value })} />
        <input placeholder="Protein" type="number" value={customFood.prot} onChange={e => setCustomFood({ ...customFood, prot: e.target.value })} />
        <button onClick={addCustomFood}>Add</button>
      </div>
      <ul>{foodLog.map((f, i) => <li key={i}>{f.name} - {f.cal} cal, {f.prot}g</li>)}</ul>
    </div>
  );

  if (screen === "home") return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Eatliftburn</h1>
      <h2 style={titleStyle}>Overview</h2>
      <p>Deficit: {estimatedDeficit} / {deficitGoal}</p>
      <p>Protein: {protein} / {proteinGoal}</p>
      <p>Steps: {steps} / {stepGoal}</p>
      <h3 style={{ fontWeight: 'bold' }}>Checklist</h3>
      {Object.keys(checklist).map(key => (
        <div key={key}>
          <label>
            <input type="checkbox" checked={checklist[key]} onChange={() => setChecklist(c => ({ ...c, [key]: !c[key] }))} /> {key}
          </label>
        </div>
      ))}
      <div style={{ marginTop: '20px' }}>
        <button style={buttonStyle} onClick={() => setScreen("food")}>🍽️ Food Log</button>
        <button style={buttonStyle} onClick={() => setScreen("workouts")}>🏋️ Workouts</button>
        <button style={buttonStyle} onClick={() => setScreen("weight")}>⚖️ Weight</button>
        <button style={buttonStyle} onClick={() => setScreen("summary")}>📊 Summary</button>
      </div>
      <button onClick={resetDay} style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white' }}>Reset Day</button>
    </div>
  );

  return <div>Loading...</div>;
}

export default App;
