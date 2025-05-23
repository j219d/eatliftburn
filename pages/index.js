import React, { useState, useEffect } from "react";

export default function Home() {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [steps, setSteps] = useState(0);
  const [manualBurn, setManualBurn] = useState(0);
  const [foodLog, setFoodLog] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [weightLog, setWeightLog] = useState([]);
  const [newWeight, setNewWeight] = useState("");
  const [deficitGoal, setDeficitGoal] = useState(1000);
  const [proteinGoal, setProteinGoal] = useState(130);
  const [checklist, setChecklist] = useState({
    workout: false,
    cardio: false,
    deficit: false,
    protein: false,
    supplements: false,
    sunlight: false,
    steps: false,
  });

  const stepCalories = Math.round(steps * 0.04);
  const totalBurned = stepCalories + manualBurn;
  const estimatedDeficit = 1740 + totalBurned - calories;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedWeights = JSON.parse(localStorage.getItem("weightLog")) || [];
      setWeightLog(storedWeights);
      const storedChecklist = JSON.parse(localStorage.getItem("checklist")) || checklist;
      setChecklist(storedChecklist);
      const storedDeficit = parseInt(localStorage.getItem("deficitGoal"));
      if (storedDeficit) setDeficitGoal(storedDeficit);
      const storedProtein = parseInt(localStorage.getItem("proteinGoal"));
      if (storedProtein) setProteinGoal(storedProtein);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checklist", JSON.stringify(checklist));
    }
  }, [checklist]);

  const addFood = (cal, prot, name) => {
    setCalories((prev) => prev + cal);
    setProtein((prev) => prev + prot);
    const entry = { name, cal, prot };
    setFoodLog((prev) => [...prev, entry]);
  };

  const removeFood = (index) => {
    const updated = [...foodLog];
    const removed = updated.splice(index, 1)[0];
    setFoodLog(updated);
    setCalories((prev) => prev - removed.cal);
    setProtein((prev) => prev - removed.prot);
  };

  const logWorkout = (name) => {
    setWorkoutLog((prev) => [...prev, name]);
  };

  const removeWorkout = (index) => {
    const updated = [...workoutLog];
    updated.splice(index, 1);
    setWorkoutLog(updated);
  };

  const logWeight = () => {
    if (newWeight) {
      const updated = [...weightLog, { date: new Date().toLocaleDateString(), weight: newWeight }];
      setWeightLog(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("weightLog", JSON.stringify(updated));
      }
      setNewWeight("");
    }
  };

  const editWeight = (index, newVal) => {
    const updated = [...weightLog];
    updated[index].weight = newVal;
    setWeightLog(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("weightLog", JSON.stringify(updated));
    }
  };

  const removeWeight = (index) => {
    const updated = [...weightLog];
    updated.splice(index, 1);
    setWeightLog(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("weightLog", JSON.stringify(updated));
    }
  };

  const resetAll = () => {
    setCalories(0);
    setProtein(0);
    setSteps(0);
    setManualBurn(0);
    setFoodLog([]);
    setWorkoutLog([]);
    setWeightLog([]);
    setChecklist({
      workout: false,
      cardio: false,
      deficit: false,
      protein: false,
      supplements: false,
      sunlight: false,
      steps: false,
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("weightLog");
      localStorage.removeItem("checklist");
    }
  };

  const updateChecklist = (item) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleDeficitGoalChange = (e) => {
    const val = parseInt(e.target.value);
    setDeficitGoal(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("deficitGoal", val);
    }
  };

  const handleProteinGoalChange = (e) => {
    const val = parseInt(e.target.value);
    setProteinGoal(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("proteinGoal", val);
    }
  };

  return (
    <main className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Eatliftburn Tracker</h1>

      <div className="space-y-2">
        <div>
          <label>Calories: {calories}</label><br />
          <label>Protein: {protein}g</label><br />
          <label>Steps: {steps} ({stepCalories} cal)</label><br />
          <label>Manual Burn: {manualBurn} cal</label><br />
          <label>Deficit: {estimatedDeficit} cal</label>
        </div>

        <div className="flex gap-2">
          <select onChange={(e) => {
            const [cal, prot, name] = JSON.parse(e.target.value);
            addFood(cal, prot, name);
          }} defaultValue="">
            <option value="" disabled>Log food</option>
            <option value={JSON.stringify([165, 31, "Chicken breast (150g)"])}>Chicken breast (150g)</option>
            <option value={JSON.stringify([95, 1, "Medium apple"])}>Medium apple</option>
            <option value={JSON.stringify([260, 20, "Promix bar"])}>Promix bar</option>
            <option value={JSON.stringify([190, 21, "Quest bar"])}>Quest bar</option>
            <option value={JSON.stringify([70, 6, "Egg"])}>Egg</option>
            <option value={JSON.stringify([15, 3, "Egg white"])}>Egg white</option>
            <option value={JSON.stringify([20, 1, "Tomatoes"])}>Tomatoes</option>
            <option value={JSON.stringify([5, 0, "Green onions"])}>Green onions</option>
            <option value={JSON.stringify([35, 0, "Butter (1 tsp)"])}>Butter (1 tsp)</option>
            <option value={JSON.stringify([120, 0, "Olive oil (1 tbsp)"])}>Olive oil (1 tbsp)</option>
            <option value={JSON.stringify([400, 52, "Protein ice cream"])}>Protein ice cream</option>
          </select>
        </div>

        <div>
          <h2 className="font-bold">Food Log</h2>
          <ul>
            {foodLog.map((item, index) => (
              <li key={index}>
                {item.name} - {item.cal} kcal{" "}
                <button onClick={() => removeFood(index)} className="text-red-500">❌</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2">
          <input type="number" placeholder="Steps" onChange={(e) => setSteps(parseInt(e.target.value) || 0)} />
          <input type="number" placeholder="Manual burn" onChange={(e) => setManualBurn(Math.round(parseFloat(e.target.value) || 0))} />
        </div>

        <div className="flex gap-2">
          <button onClick={() => logWorkout("Push-ups")}>Add Push-ups</button>
          <button onClick={() => logWorkout("Leg Press")}>Add Leg Press</button>
          <button onClick={() => logWorkout("Pull-ups")}>Add Pull-ups</button>
        </div>

        <div>
          <h2 className="font-bold">Workout Log</h2>
          <ul>
            {workoutLog.map((w, idx) => (
              <li key={idx}>
                {w} <button onClick={() => removeWorkout(idx)} className="text-red-500">❌</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label>Deficit goal:</label>
          <select value={deficitGoal} onChange={handleDeficitGoalChange}>
            {[500, 750, 1000, 1250, 1500].map((g) => <option key={g} value={g}>{g} kcal</option>)}
          </select>
          <br />
          <label>Protein goal:</label>
          <select value={proteinGoal} onChange={handleProteinGoalChange}>
            {[100, 120, 130, 150, 160].map((g) => <option key={g} value={g}>{g} g</option>)}
          </select>
        </div>

        <div>
          <div className="h-4 bg-gray-300 rounded overflow-hidden my-1">
            <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (estimatedDeficit / deficitGoal) * 100)}%` }}></div>
          </div>
          <div className="h-4 bg-gray-300 rounded overflow-hidden my-1">
            <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (protein / proteinGoal) * 100)}%` }}></div>
          </div>
        </div>

        <div>
          <h2 className="font-bold">Checklist</h2>
          {Object.keys(checklist).map((item) => (
            <div key={item}>
              <label>
                <input type="checkbox" checked={checklist[item]} onChange={() => updateChecklist(item)} /> {item}
              </label>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-bold">Weight Log</h2>
          <input type="number" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Log weight" />
          <button onClick={logWeight} className="ml-2">Add</button>
          <ul>
            {weightLog.map((entry, idx) => (
              <li key={idx}>
                {entry.date}: 
                <input className="ml-2" value={entry.weight} onChange={(e) => editWeight(idx, e.target.value)} />
                <button onClick={() => removeWeight(idx)} className="text-red-500 ml-2">❌</button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={resetAll} className="bg-red-500 text-white px-3 py-1 mt-2 rounded">Reset All</button>
      </div>
    </main>
  );
}
