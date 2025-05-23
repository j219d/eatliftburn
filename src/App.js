// Eatliftburn App - Updated with logic fixes and modern UI styling
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
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      }
    ]
  };

  const average = arr => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const avgWeight = average(weightLog.map(w => parseFloat(w.weight)));
  const weightDelta = goalWeight ? (avgWeight - goalWeight).toFixed(1) : null;

  if (screen === "food") return (
    <div className="p-4">
      <button onClick={() => setScreen("home")} className="text-blue-500">⬅ Home</button>
      <h2 className="text-xl font-bold mb-2">Food Log</h2>
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
        <option value={JSON.stringify([70, 6, "Egg"])}>Egg</option>
        <option value={JSON.stringify([15, 3, "Egg white"])}>Egg white</option>
        <option value={JSON.stringify([20, 1, "Tomatoes"])}>Tomatoes</option>
        <option value={JSON.stringify([5, 0, "Green onions"])}>Green onions</option>
        <option value={JSON.stringify([35, 0, "Butter (1 tsp)"])}>Butter</option>
        <option value={JSON.stringify([120, 0, "Olive oil (1 tbsp)"])}>Olive oil</option>
        <option value={JSON.stringify([400, 52, "Protein ice cream"])}>Protein ice cream</option>
      </select>
      <div className="flex gap-2 mt-2">
        <input type="text" placeholder="Name" value={customFood.name} onChange={e => setCustomFood({ ...customFood, name: e.target.value })} />
        <input type="number" placeholder="Calories" value={customFood.cal} onChange={e => setCustomFood({ ...customFood, cal: e.target.value })} />
        <input type="number" placeholder="Protein" value={customFood.prot} onChange={e => setCustomFood({ ...customFood, prot: e.target.value })} />
        <button onClick={addCustomFood} className="bg-blue-500 text-white px-2">Add</button>
      </div>
      <ul className="mt-4 space-y-1">{foodLog.map((f, i) => <li key={i}>{f.name} - {f.cal} kcal, {f.prot}g</li>)}</ul>
    </div>
  );

  if (screen === "workouts") return (
    <div className="p-4">
      <button onClick={() => setScreen("home")} className="text-blue-500">⬅ Home</button>
      <h2 className="text-xl font-bold mb-2">Workout Log</h2>
      <div className="space-y-2">
        {Object.keys(workouts).map((w, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span>{w}</span>
            <input type="number" placeholder="Reps" onChange={e => setCustomWorkout({ ...customWorkout, [w]: parseInt(e.target.value) || 0 })} />
            <button onClick={() => logWorkout(w, customWorkout[w] || 0)} className="bg-green-500 text-white px-2 rounded">Add</button>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-1">{workoutLog.map((w, i) => <li key={i}>{w.type} x{w.reps} — {w.burn} cal <button onClick={() => removeWorkout(i)} className="text-red-500">❌</button></li>)}</ul>
    </div>
  );

  if (screen === "weight") return (
    <div className="p-4">
      <button onClick={() => setScreen("home")} className="text-blue-500">⬅ Home</button>
      <h2 className="text-xl font-bold mb-2">Weight Tracker</h2>
      <input value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Enter weight" />
      <button onClick={() => {
        if (newWeight) {
          const updated = [...weightLog, { date: new Date().toLocaleDateString(), weight: newWeight }];
          setWeightLog(updated);
          setNewWeight("");
        }
      }} className="ml-2 bg-blue-500 text-white px-2 py-1">Add</button>
      <Line data={weightChartData} className="mt-4" />
      <ul className="mt-2">{weightLog.map((w, i) => <li key={i}>{w.date}: {w.weight} <button onClick={() => setWeightLog(weightLog.filter((_, idx) => idx !== i))} className="text-red-500 ml-2">❌</button></li>)}</ul>
    </div>
  );

  if (screen === "summary") return (
    <div className="p-4">
      <button onClick={() => setScreen("home")} className="text-blue-500">⬅ Home</button>
      <h2 className="text-xl font-bold mb-2">Weekly Summary</h2>
      <p>Avg Deficit: {estimatedDeficit}</p>
      <p>Avg Protein: {protein}</p>
      <p>Steps: {steps}</p>
      <p>Avg Weight: {avgWeight.toFixed(1)}</p>
      {goalWeight > 0 && <p>To Goal ({goalWeight}): {weightDelta} lbs remaining</p>}
      <input
        type="number"
        value={goalWeight}
        onChange={(e) => setGoalWeight(parseFloat(e.target.value))}
        placeholder="Set Goal Weight"
        className="mt-2"
      />
    </div>
  );

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Eatliftburn</h1>
      <h2 className="text-xl mt-2 font-semibold">Overview</h2>
      <p>Deficit: {estimatedDeficit} / {deficitGoal}</p>
      <p>Protein: {protein} / {proteinGoal}</p>
      <p>Steps: {steps} / {stepGoal}</p>
      <div className="h-4 bg-gray-300 rounded overflow-hidden my-1">
        <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (estimatedDeficit / deficitGoal) * 100)}%` }}></div>
      </div>
      <div className="h-4 bg-gray-300 rounded overflow-hidden my-1">
        <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (protein / proteinGoal) * 100)}%` }}></div>
      </div>
      <div>
        <h2 className="font-bold">Checklist</h2>
        {Object.keys(checklist).map((key) => (
          <div key={key}><label><input type="checkbox" checked={checklist[key]} onChange={() => setChecklist(c => ({ ...c, [key]: !c[key] }))} /> {key}</label></div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-gray-200 p-4 rounded shadow text-lg" onClick={() => setScreen("food")}>🍽️ Food Log</button>
        <button className="bg-gray-200 p-4 rounded shadow text-lg" onClick={() => setScreen("workouts")}>🏋️ Workout Log</button>
        <button className="bg-gray-200 p-4 rounded shadow text-lg" onClick={() => setScreen("weight")}>⚖️ Weight Tracker</button>
        <button className="bg-gray-200 p-4 rounded shadow text-lg" onClick={() => setScreen("summary")}>📊 Weekly Summary</button>
      </div>
      <button onClick={resetDay} className="bg-red-500 text-white px-3 py-1 mt-4 rounded">Reset Day</button>
    </div>
  );
}

export default App;
