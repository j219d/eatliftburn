
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function App() {
  const [screen, setScreen] = useState("home");
  const [calories, setCalories] = useState(() => parseInt(localStorage.getItem("calories")) || 0);
  const [protein, setProtein] = useState(() => parseInt(localStorage.getItem("protein")) || 0);
  const [steps, setSteps] = useState(() => parseInt(localStorage.getItem("steps")) || 0);
  const [deficitGoal, setDeficitGoal] = useState(() => parseInt(localStorage.getItem("deficitGoal")) || 1000);
  const [proteinGoal, setProteinGoal] = useState(() => parseInt(localStorage.getItem("proteinGoal")) || 140);
  const [stepGoal] = useState(10000);
  const [checklist, setChecklist] = useState(() => JSON.parse(localStorage.getItem("checklist")) || {
  supplements: false,
  sunlight: false,
  concentrace: false
});
  const [foodLog, setFoodLog] = useState(() => JSON.parse(localStorage.getItem("foodLog")) || []);
  const [workoutLog, setWorkoutLog] = useState(() => JSON.parse(localStorage.getItem("workoutLog")) || {});
  const [weightLog, setWeightLog] = useState(() => JSON.parse(localStorage.getItem("weightLog")) || []);
  const [newWeight, setNewWeight] = useState("");

  const [customFood, setCustomFood] = useState({ name: "", cal: "", prot: "" });
  const [customWorkout, setCustomWorkout] = useState({});
  const [customSteps, setCustomSteps] = useState("");

  const workouts = {
  "Push-ups": 0.5,
  "Pull-ups": 1,
  "Biceps": 0.5,
  "Bench Press": 0.5,
  "Triceps": 0.5,
  "Leg Press": 0.5,
  "Run": "run" // special handling
};

  const foodOptions = [
  // 🥩 Mains (proteins, eggs, dairy)
  { name: "2 eggs + butter", cal: 175, prot: 12 },
  { name: "2 eggs, 1 egg white + butter", cal: 190, prot: 15 },
  { name: "Chicken breast (50g)", cal: 82, prot: 15 },
  { name: "Chicken breast (100g)", cal: 165, prot: 31 },
  { name: "Chicken breast (150g)", cal: 248, prot: 46 },
  { name: "Chicken breast (200g)", cal: 330, prot: 62 },
  { name: "Cottage cheese (47g)", cal: 48, prot: 5.5 },
  { name: "Cottage cheese (95g)", cal: 95, prot: 11 },
  { name: "Cottage cheese (full tub, 238g)", cal: 238, prot: 27.5 },
  { name: "Egg", cal: 70, prot: 6 },
  { name: "Egg white", cal: 15, prot: 3 },
  { name: "Yogurt 0%", cal: 117, prot: 20 },
  { name: "Protein ice cream", cal: 400, prot: 52 },
{ name: "Protein scoop (1)", cal: 75, prot: 15 },
{ name: "Protein scoop (2)", cal: 150, prot: 30 },
    { name: "Ground beef 90/10 (50g)", cal: 125, prot: 13 },
{ name: "Ground beef 90/10 (100g)", cal: 250, prot: 26 },
{ name: "Ground beef 90/10 (150g)", cal: 375, prot: 39 },
{ name: "Ground beef 90/10 (200g)", cal: 500, prot: 52 },



  // 🍫 Snacks / Packaged protein
  { name: "Promix bar", cal: 150, prot: 15 },
  { name: "Quest bar", cal: 190, prot: 21 },
  { name: "Quest chips", cal: 140, prot: 20 },

  // 🍎 Fruits
  { name: "Apple", cal: 95, prot: 1 },
  { name: "Banana", cal: 105, prot: 1 },
  { name: "Watermelon triangle", cal: 50, prot: 1 },

  // 🥗 Veggies & Salads
  { name: "Tomato", cal: 20, prot: 1 },
  { name: "Cucumber", cal: 16, prot: 1 },
  { name: "Carrot", cal: 25, prot: 0.5 },
  { name: "Green onions", cal: 5, prot: 0 },
    { name: "Sweet potato (1/2)", cal: 56, prot: 1 },
{ name: "Sweet potato (1)", cal: 112, prot: 2 },
  { name: "Spinach (handful)", cal: 15, prot: 1.5 },
  { name: "Israeli salad (small)", cal: 40, prot: 1 },
  { name: "Israeli salad (medium)", cal: 70, prot: 1.5 },
  { name: "Israeli salad (large)", cal: 100, prot: 2 },
    

  // 🥤 Drinks
  { name: "Carrot juice", cal: 94, prot: 2 },

  // 🥑 Fats & Seeds
  { name: "Avocado (1 whole)", cal: 240, prot: 3 },
{ name: "Avocado (1/2)", cal: 120, prot: 1.5 },
  { name: "Butter (1 tsp)", cal: 35, prot: 0 },
  { name: "Flax seeds (1 tbsp)", cal: 55, prot: 2 },
  { name: "Olive oil (1 tsp)", cal: 40, prot: 0 },
  { name: "Olive oil (1 tbsp)", cal: 120, prot: 0 },
  { name: "Pumpkin seeds (1 tbsp)", cal: 60, prot: 3 },
  { name: "Walnut (1 whole)", cal: 26, prot: 0.6 }
  ];

  const totalBurn = Object.entries(workoutLog).reduce((sum, [type, value]) => {
  if (type === "Run") return sum + Math.round(value * 70);
  if (type === "Steps") return sum + Math.round(value * 0.04);
  if (type === "Treadmill") return sum + value;
  if (type === "Swim") return sum + Math.round(value * 7);
  if (workouts[type]) return sum + Math.round(value * workouts[type]);
  return sum + value;
}, 0);

const estimatedDeficit = 1620 + totalBurn - calories;

  useEffect(() => {
    localStorage.setItem("calories", calories);
    localStorage.setItem("protein", protein);
    localStorage.setItem("steps", steps);
    localStorage.setItem("deficitGoal", deficitGoal);
    localStorage.setItem("proteinGoal", proteinGoal);
    localStorage.setItem("checklist", JSON.stringify(checklist));
    localStorage.setItem("foodLog", JSON.stringify(foodLog));
    localStorage.setItem("workoutLog", JSON.stringify(workoutLog));
    localStorage.setItem("weightLog", JSON.stringify(weightLog));
  }, [calories, protein, steps, deficitGoal, proteinGoal, checklist, foodLog, workoutLog, weightLog]);

  const resetDay = () => {
  const confirmReset = window.confirm("Are you sure?");
  if (!confirmReset) return;

  setCalories(0);
  setProtein(0);
  setSteps(0);
  setFoodLog([]);
  setWorkoutLog({});
  setChecklist({ supplements: false, sunlight: false, concentrace: false });

  // Clear localStorage for daily data
  localStorage.removeItem("calories");
  localStorage.removeItem("protein");
  localStorage.removeItem("steps");
  localStorage.removeItem("foodLog");
  localStorage.removeItem("workoutLog");
  localStorage.removeItem("checklist");

  // ❗️Do NOT remove "weightLog" – it stays
};

const logWorkout = (type, reps) => {
  const burn = Math.round(workouts[type] * reps);
  setWorkoutLog(prev => {
    const updated = { ...prev };
    updated[type] = (updated[type] || 0) + reps;
    return updated;
  });
  if (type === "Steps") {
    setSteps(prev => {
      const totalSteps = prev + reps;
      return totalSteps;
    });
  }
};

  const deleteWorkout = (type) => {
  const reps = workoutLog[type];
  const burn = type === "Run"
    ? Math.round(reps * 70)
    : type === "Steps"
    ? Math.round(reps * 0.04)
    : Math.round(reps * workouts[type]);

  // ✅ Fix step count for Run
  if (type === "Run") {
    const runSteps = Math.round(reps * 800);
    setSteps(prev => prev - runSteps);
  }

  if (type === "Steps") {
    setSteps(prev => prev - reps);
  }

  setWorkoutLog(prev => {
    const updated = { ...prev };
    delete updated[type];
    return updated;
  });
};

  const addFood = (food) => {
    setCalories(prev => prev + food.cal);
    setProtein(prev => prev + food.prot);
    setFoodLog(prev => [...prev, food]);
  };

  const deleteFood = (index) => {
    const removed = foodLog[index];
    setCalories(prev => prev - removed.cal);
    setProtein(prev => prev - removed.prot);
    setFoodLog(foodLog.filter((_, i) => i !== index));
  };

  const addWeight = () => {
    const weight = parseFloat(newWeight);
    if (!isNaN(weight)) {
      setWeightLog([...weightLog, { date: new Date().toLocaleDateString(), weight }]);
      setNewWeight("");
    }
  };

  const deleteWeight = (i) => {
    setWeightLog(weightLog.filter((_, idx) => idx !== i));
  };

  const avgWeight =
    weightLog.length === 0
      ? 0
      : weightLog.reduce((acc, w) => acc + w.weight, 0) / weightLog.length;

  const overviewStyle = {
    fontSize: "16px",
    margin: "4px 0"
  };

const navBtnStyle = {
  fontSize: "16px",
  padding: "10px",
  margin: "6px 0",
  borderRadius: "10px",
  width: "100%",
  backgroundColor: "#eee",
  color: "#0070f3",
  border: "none"
};

  const HomeButton = () => (
    <button onClick={() => setScreen("home")} style={navBtnStyle}>⬅ Home</button>
  );

  if (screen === "food") {
  return (
    <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", maxWidth: "500px", margin: "auto" }}>
  <HomeButton />
  <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
  {"🍽️ Food Log"}
</h1>

      <div style={{ marginBottom: "20px" }}>
        <select
          defaultValue=""
          onChange={(e) => {
            const selected = JSON.parse(e.target.value);
            addFood({ ...selected, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
            e.target.value = "";
          }}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fff"
          }}
        >
          <option value="" disabled>Select Food</option>
          {foodOptions.map((f, i) => (
            <option key={i} value={JSON.stringify(f)}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <input
          placeholder="Custom food name"
          value={customFood.name}
          onChange={e => setCustomFood({ ...customFood, name: e.target.value })}
          style={{ display: "block", marginBottom: "8px", padding: "10px", fontSize: "16px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <input
  placeholder="Calories"
  type="number"
  value={customFood.cal}
  onChange={e => setCustomFood({ ...customFood, cal: e.target.value })}
  style={{ display: "block", marginBottom: "8px", padding: "10px", fontSize: "16px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
/>

<input
  placeholder="Protein"
  type="number"
  value={customFood.prot}
  onChange={e => setCustomFood({ ...customFood, prot: e.target.value })}
  style={{ display: "block", marginBottom: "12px", padding: "10px", fontSize: "16px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
/>
        <button
          onClick={() => {
  const { name, cal, prot } = customFood;
  const parsedCal = parseInt(cal);
  const parsedProt = parseInt(prot);

  if (name && !isNaN(parsedCal) && !isNaN(parsedProt)) {
    setCalories(c => c + parsedCal);
    setProtein(p => p + parsedProt);
    setFoodLog(f => [...f, {
      name,
      cal: parsedCal,
      prot: parsedProt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setCustomFood({ name: "", cal: "", prot: "" });
  }
}}

          style={{
            padding: "10px 16px",
            backgroundColor: "#0070f3",
            color: "white",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            width: "100%"
          }}
        >
          Add Custom Food
        </button>
      </div>

      <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>Logged Foods</h2>
      <ul style={{ paddingLeft: "16px" }}>
        {foodLog.map((f, i) => (
          <li key={i} style={{ fontSize: "16px", marginBottom: "6px" }}>
            {f.time && <strong style={{ marginRight: "6px", color: "#888" }}>{f.time}</strong>}
            {f.name} — {f.cal} cal, {f.prot}g{" "}
            <button onClick={() => deleteFood(i)} style={{ marginLeft: "8px" }}>❌</button>
          </li>
        ))}
      </ul>

      <div style={{
        marginTop: "24px",
        backgroundColor: "#f1f1f1",
        padding: "12px 16px",
        borderRadius: "10px",
        textAlign: "center",
        fontSize: "18px",
        fontWeight: "bold"
      }}>
        Total: {calories} cal / {protein}g protein
      </div>
    </div>
  );
}

  // Rebuilt from clean backup (May 26)

if (screen === "workouts") {
  return (
    <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", maxWidth: "500px", margin: "auto" }}>
      <HomeButton />
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>🏋️ Workouts</h1>

      {Object.entries(workoutCategories).map(([category, items], i) => (
        <div key={i}>
          <h3 style={{ marginTop: "20px", marginBottom: "8px", fontSize: "18px", color: "#555" }}>{category}</h3>
          {Object.keys(items).map((type, j) => (
            <div key={j} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <label style={{ width: "100px", fontSize: "16px" }}>{type}</label>
              <input
                type="number"
                step={type === "Run" ? "0.01" : "1"}
                placeholder={type === "Run" ? "Kilometers" : type === "Plank" ? "Seconds" : "Reps"}
                value={customWorkout[type] || ""}
                onChange={(e) => setCustomWorkout({ ...customWorkout, [type]: e.target.value })}
                style={{ width: "100px", padding: "8px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <button
                onClick={() => {
                  const input = parseFloat(customWorkout[type]);
                  if (!isNaN(input)) {
                    const rate = burnRates[type];
                    const cal = typeof rate === "function" ? rate(input) : Math.round(input * rate);

                    if (type === "Run") {
                      const runSteps = Math.round(input * 800);
                      setSteps(prev => prev + runSteps);
                    }
                    if (type === "Steps") {
                      setSteps(prev => prev + input);
                    }

                    setWorkoutLog(prev => ({
                      ...prev,
                      [type]: (prev[type] || 0) + input
                    }));
                    setCustomWorkout({ ...customWorkout, [type]: "" });
                  }
                }}
                style={{
                  padding: "8px 12px",
                  fontSize: "16px",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      ))}

      {/* Summary */}
      {Object.keys(workoutLog).length > 0 && (
        <>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginTop: "24px", marginBottom: "12px" }}>Summary</h2>
          <ul style={{ paddingLeft: "16px", marginBottom: "16px" }}>
            {Object.entries(workoutLog).map(([type, value], i) => {
              const rate = burnRates[type];
              const cal = typeof rate === "function" ? rate(value) : Math.round(value * rate);
              let display;
              if (type === "Run") display = `${value} km - ${cal} cal`;
              else if (type === "Steps") display = `${value} steps - ${cal} cal`;
              else if (type === "Swim") display = `${value} laps - ${cal} cal`;
              else if (type === "Plank") display = `${value} sec - ${cal} cal`;
              else display = `${value} reps - ${cal} cal`;

              return (
                <li key={i} style={{ fontSize: "16px", marginBottom: "6px" }}>
                  {type}: {display} <button onClick={() => deleteWorkout(type)} style={{ marginLeft: "8px" }}>❌</button>
                </li>
              );
            })}
          </ul>
          <div style={{
            backgroundColor: "#f1f1f1",
            padding: "12px 16px",
            borderRadius: "10px",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold"
          }}>
            Total Burn: {
              Object.entries(workoutLog).reduce((sum, [type, value]) => {
                const rate = burnRates[type];
                const num = Number(value);
                const burn = typeof rate === "function" ? rate(num) : Math.round(num * rate);
                return sum + (isNaN(burn) ? 0 : burn);
              }, 0)
            } cal
          </div>
        </>
      )}

      <button
        onClick={() => {
          setWorkoutLog({});
          setCustomWorkout({});
        }}
        style={{
          marginTop: "20px",
          backgroundColor: "#ff4d4f",
          color: "white",
          padding: "8px 12px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px"
        }}
      >
        Reset Workouts
      </button>
    </div>
  );
}


export default App;
