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
  const [checklist, setChecklist] = useState(() => JSON.parse(localStorage.getItem("checklist")) || {
    workout: false,
    cardio: false,
    deficit: false,
    protein: false,
    supplements: false,
    sunlight: false,
    steps: false,
  });
  const [foodLog, setFoodLog] = useState(() => JSON.parse(localStorage.getItem("foodLog")) || []);
  const [workoutLog, setWorkoutLog] = useState(() => JSON.parse(localStorage.getItem("workoutLog")) || []);
  const [weightLog, setWeightLog] = useState(() => JSON.parse(localStorage.getItem("weightLog")) || []);
  const [newWeight, setNewWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState(() => parseFloat(localStorage.getItem("goalWeight")) || 0);

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
    setChecklist({
      workout: false,
      cardio: false,
      deficit: false,
      protein: false,
      supplements: false,
      sunlight: false,
      steps: false,
    });
  };

  const removeFood = (index) => {
    const removed = foodLog[index];
    setCalories(c => c - removed.cal);
    setProtein(p => p - removed.prot);
    setFoodLog(log => log.filter((_, i) => i !== index));
  };

  const removeWorkout = (index) => {
    setWorkoutLog(log => log.filter((_, i) => i !== index));
  };

  const logWeight = () => {
    if (newWeight) {
      const updated = [...weightLog, { date: new Date().toLocaleDateString(), weight: newWeight }];
      setWeightLog(updated);
      setNewWeight("");
    }
  };

  const removeWeight = (index) => {
    setWeightLog(log => log.filter((_, i) => i !== index));
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
  const weeklyCalories = calories; // Replace with 7-day rolling in future
  const weeklyProtein = protein;
  const weeklySteps = steps;
  const avgDeficit = estimatedDeficit;
  const avgWeight = average(weightLog.map(w => parseFloat(w.weight)));
  const weightDelta = goalWeight ? (avgWeight - goalWeight).toFixed(1) : null;

  if (screen === "food") return (
    <div className="p-4">
      <button onClick={() => setScreen("home")}>⬅ Home</button>
      <h2 className="text-xl font-bold">Food Log</h2>
      <select onChange={(e) => {
        const [cal, prot, name] = JSON.parse(e.target.value);
        setCalories(c => c + cal);
        setProtein(p => p + prot);
        setFoodLog(f => [...f, { name, cal, prot }]);
      }} defaultValue="">
        <option value="" disabled>Log food</option>
        <option value={JSON.stringify([165, 31, "Chicken breast (150g)"])}>Chicken breast</option>
        <option value={JSON.stringify([95, 1, "Medium apple"])}>Apple</option>
      </select>
      <input type="text" placeholder="Custom food" onKeyDown={(e) => {
        if (e.key === "Enter") {
          const [name, cal, prot] = e.target.value.split(",");
          if (name && cal && prot) {
            setCalories(c => c + parseInt(cal));
            setProtein(p => p + parseInt(prot));
            setFoodLog(f => [...f, { name, cal: parseInt(cal), prot: parseInt(prot) }]);
            e.target.value = "";
          }
        }
      }} placeholder="Name,Calories,Protein" className="block my-2" />
      <ul>{foodLog.map((f, i) => <li key={i}>{f.name} - {f.cal} kcal <button onClick={() => removeFood(i)}>❌</button></li>)}</ul>
    </div>
  );

  if (screen === "workouts") return (
    <div className="p-4">
      <button onClick={() => setScreen("home")}>⬅ Home</button>
      <h2 className="text-xl font-bold">Workout Log</h2>
      <input type="number" value={steps} onChange={(e) => setSteps(parseInt(e.target.value))} placeholder="Steps" />
      <input type="number" value={manualBurn} onChange={(e) => setManualBurn(parseInt(e.target.value))} placeholder="Manual Burn" />
      <button onClick={() => setWorkoutLog(w => [...w, "Push-ups"])}>Add Push-ups</button>
      <ul>{workoutLog.map((w, i) => <li key={i}>{w} <button onClick={() => removeWorkout(i)}>❌</button></li>)}</ul>
    </div>
  );

  if (screen === "weight") return (
    <div className="p-4">
      <button onClick={() => setScreen("home")}>⬅ Home</button>
      <h2 className="text-xl font-bold">Weight Tracker</h2>
      <input value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Enter weight" />
      <button onClick={logWeight}>Add</button>
      <Line data={weightChartData} />
      <ul>{weightLog.map((w, i) => <li key={i}>{w.date}: {w.weight} <button onClick={() => removeWeight(i)}>❌</button></li>)}</ul>
    </div>
  );

  if (screen === "summary") return (
    <div className="p-4">
      <button onClick={() => setScreen("home")}>⬅ Home</button>
      <h2 className="text-xl font-bold">Weekly Summary</h2>
      <p>Avg Deficit: {avgDeficit}</p>
      <p>Avg Protein: {weeklyProtein}</p>
      <p>Avg Steps: {weeklySteps}</p>
      <p>Avg Weight: {avgWeight.toFixed(1)}</p>
      {goalWeight > 0 && <p>To Goal ({goalWeight}): {weightDelta} lbs remaining</p>}
      <input
        type="number"
        value={goalWeight}
        onChange={(e) => setGoalWeight(parseFloat(e.target.value))}
        placeholder="Set Goal Weight"
      />
    </div>
  );

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Eatliftburn</h1>
      <p>Deficit: {estimatedDeficit} / {deficitGoal}</p>
      <p>Protein: {protein} / {proteinGoal}</p>
      <p>Steps: {steps}</p>
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
        <button className="bg-gray-200 p-4 rounded" onClick={() => setScreen("food")}>🍽️ Food Log</button>
        <button className="bg-gray-200 p-4 rounded" onClick={() => setScreen("workouts")}>🏋️ Workout Log</button>
        <button className="bg-gray-200 p-4 rounded" onClick={() => setScreen("weight")}>⚖️ Weight Tracker</button>
        <button className="bg-gray-200 p-4 rounded" onClick={() => setScreen("summary")}>📊 Weekly Summary</button>
      </div>
      <button onClick={resetDay} className="bg-red-500 text-white px-3 py-1 mt-4 rounded">Reset Day</button>
    </div>
  );
}

export default App;

