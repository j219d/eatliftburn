// Eatliftburn App – Full Update May 2025
// Includes checklist spacing, home title, food log ❌, workout + steps logging, weight tracker, and summary cleanup

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
  const [customSteps, setCustomSteps] = useState("");
  const [customFood, setCustomFood] = useState({ name: "", cal: "", prot: "" });
  const [customWorkout, setCustomWorkout] = useState({});

  const workouts = {
    "Push-ups": 0.29,
    "Pull-ups": 0.5,
    "Biceps": 0.25,
    "Bench Press": 0.42,
    "Triceps": 0.3,
    "Leg Press": 0.35
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
    setWorkoutLog(prev => {
      const updated = { ...prev };
      updated[type] = (updated[type] || 0) + reps;
      return updated;
    });
    setManualBurn(b => b + burn);
  };

  const totalWorkoutCalories = Object.entries(workoutLog).reduce((sum, [type, reps]) => {
    return sum + Math.round(reps * workouts[type]);
  }, 0);

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

  const foodOptions = [
    { name: "Chicken breast", cal: 165, prot: 31 },
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
    { name: "2 eggs, 1 egg white + butter", cal: 190, prot: 15 }
  ];

  const HomeButton = () => <button style={{ fontSize: "18px", padding: "10px 16px", marginBottom: "16px" }} onClick={() => setScreen("home")}>⬅ Home</button>;

  if (screen === "food") return (
    <div style={{ padding: "20px" }}>
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
        <button onClick={addCustomFood}>Add</button>
      </div>
      <ul>{foodLog.map((f, i) => <li key={i}>{f.name} - {f.cal} cal, {f.prot}g <button onClick={() => setFoodLog(foodLog.filter((_, idx) => idx !== i))}>❌</button></li>)}</ul>
    </div>
  );

  if (screen === "workouts") return (
    <div style={{ padding: "20px" }}>
      <HomeButton />
      <h2>Workout Log</h2>
      <label>Steps walked today:</label>
      <input type="number" value={customSteps} onChange={(e) => setCustomSteps(e.target.value)} />
      <button onClick={() => setSteps(parseInt(customSteps))}>Log Steps</button>
      {Object.keys(workouts).map((type, i) => (
        <div key={i}>
          <label>{type} reps: </label>
          <input type="number" onChange={e => setCustomWorkout({ ...customWorkout, [type]: parseInt(e.target.value) || 0 })} />
          <button onClick={() => logWorkout(type, customWorkout[type] || 0)}>Add</button>
        </div>
      ))}
      <h3>Workout Summary:</h3>
      <ul>
        {Object.entries(workoutLog).map(([type, reps], i) => (
          <li key={i}>{type}: {reps} reps — {Math.round(reps * workouts[type])} cal</li>
        ))}
      </ul>
      <p><strong>Total Workout Burn:</strong> {totalWorkoutCalories} cal</p>
    </div>
  );

  if (screen === "weight") return (
    <div style={{ padding: "20px" }}>
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
      <Line data={weightChartData} />
      <ul>{weightLog.map((w, i) => <li key={i}>{w.date}: {w.weight} <button onClick={() => setWeightLog(weightLog.filter((_, idx) => idx !== i))}>❌</button></li>)}</ul>
    </div>
  );

  if (screen === "summary") return (
    <div style={{ padding: "20px" }}>
      <HomeButton />
      <h2>Weekly Summary</h2>
      <p>Avg Deficit: {estimatedDeficit}</p>
      <p>Avg Protein: {protein}</p>
      <p>Steps: {steps}</p>
      <p>Avg Weight: {avgWeight.toFixed(1)}</p>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '6px' }}>Eatliftburn, an app by Jon Deutsch</h1>
      <h2 style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '4px' }}>Overview</h2>
      <p>Deficit: {estimatedDeficit} / {deficitGoal}</p>
      <p>Protein: {protein} / {proteinGoal}</p>
      <p>Steps: {steps} / {stepGoal}</p>
      <h3 style={{ marginTop: '12px', marginBottom: '4px' }}>Checklist</h3>
      {Object.keys(checklist).map(key => (
        <div key={key}>
          <label>
            <input type="checkbox" checked={checklist[key]} onChange={() => setChecklist(c => ({ ...c, [key]: !c[key] }))} /> {key}
          </label>
        </div>
      ))}
      <div style={{ marginTop: '20px' }}>
        <button style={{ fontSize: '16px', padding: '10px', margin: '4px' }} onClick={() => setScreen("food")}>🍽️ Food Log</button>
        <button style={{ fontSize: '16px', padding: '10px', margin: '4px' }} onClick={() => setScreen("workouts")}>🏋️ Workouts</button>
        <button style={{ fontSize: '16px', padding: '10px', margin: '4px' }} onClick={() => setScreen("weight")}>⚖️ Weight</button>
        <button style={{ fontSize: '16px', padding: '10px', margin: '4px' }} onClick={() => setScreen("summary")}>📊 Summary</button>
      </div>
      <button onClick={resetDay} style={{ backgroundColor: '#f44336', color: 'white', fontSize: '16px', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>Reset Day</button>
    </div>
  );
}

export default App;
