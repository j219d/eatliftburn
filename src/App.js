
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
  const [deficitGoal, setDeficitGoal] = useState(() => parseInt(localStorage.getItem("deficitGoal")) || 500);
  const [proteinGoal, setProteinGoal] = useState(() => parseInt(localStorage.getItem("proteinGoal")) || 140);
  const [stepGoal] = useState(10000);
  const [checklist, setChecklist] = useState(() => JSON.parse(localStorage.getItem("checklist")) || {
  supplements: false,
  sunlight: false,
  concentrace: false
// removed suspicious closing token
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
  "Romanian Deadlifts": 0.5,
  "Glute Kickbacks": 0.4,
  "Glute Bridge": 0.4,
  "Lunges": 0.5,
  "Plank": "plank", // handled as seconds
  "Row Machine": "row", // handled as minutes
  "Run": "run"
};
  
const foodOptions = [
  { name: "Apple", cal: 95, prot: 1 },
  { name: "Avocado (1/2)", cal: 120, prot: 1.5 },
  { name: "Avocado (1 whole)", cal: 240, prot: 3 },
  { name: "Banana", cal: 105, prot: 1 },
  { name: "Butter (1 tsp)", cal: 35, prot: 0 },
  { name: "Carrot", cal: 25, prot: 0.5 },
  { name: "Carrot juice", cal: 94, prot: 2 },
  { name: "Chicken breast (50g)", cal: 82, prot: 15 },
  { name: "Chicken breast (100g)", cal: 165, prot: 31 },
  { name: "Chicken breast (150g)", cal: 248, prot: 46 },
  { name: "Chicken breast (200g)", cal: 330, prot: 62 },
  { name: "Cottage cheese (47g)", cal: 48, prot: 5.5 },
  { name: "Cottage cheese (95g)", cal: 95, prot: 11 },
  { name: "Cottage cheese (full tub, 238g)", cal: 238, prot: 27.5 },
  { name: "Cucumber", cal: 16, prot: 1 },
  { name: "Egg", cal: 70, prot: 6 },
  { name: "Egg white", cal: 15, prot: 3 },
  { name: "Eggs (2) + butter", cal: 175, prot: 12 },
  { name: "Eggs (2), Egg white (1) + butter", cal: 190, prot: 15 },
  { name: "Flax seeds (1 tbsp)", cal: 55, prot: 2 },
  { name: "Green onions", cal: 5, prot: 0 },
  { name: "Ground beef 90/10 (50g)", cal: 73, prot: 9.3 },
  { name: "Ground beef 90/10 (100g)", cal: 145, prot: 18.6 },
  { name: "Ground beef 90/10 (150g)", cal: 218, prot: 27.9 },
  { name: "Ground beef 90/10 (200g)", cal: 290, prot: 37.2 },
  { name: "Israeli salad (large)", cal: 100, prot: 2 },
  { name: "Israeli salad (medium)", cal: 70, prot: 1.5 },
  { name: "Israeli salad (small)", cal: 40, prot: 1 },
  { name: "Olive oil (1 tbsp)", cal: 120, prot: 0 },
  { name: "Olive oil (1 tsp)", cal: 40, prot: 0 },
  { name: "Promix protein bar", cal: 150, prot: 15 },
  { name: "Protein ice cream", cal: 400, prot: 52 },
  { name: "Protein scoop (1)", cal: 75, prot: 15 },
  { name: "Protein scoop (2)", cal: 150, prot: 30 },
  { name: "Pumpkin seeds (1 tbsp)", cal: 60, prot: 3 },
  { name: "Quest chips", cal: 140, prot: 20 },
  { name: "Quest protein bar", cal: 190, prot: 21 },
  { name: "Spinach (handful)", cal: 15, prot: 1.5 },
  { name: "Sweet potato (1/2)", cal: 56, prot: 1 },
  { name: "Sweet potato (1)", cal: 112, prot: 2 },
  { name: "Tomato", cal: 20, prot: 1 },
  { name: "Walnut (1 whole)", cal: 26, prot: 0.6 },
  { name: "Watermelon triangle", cal: 50, prot: 1 },
  { name: "Yogurt 0%", cal: 117, prot: 20 }
];


  const totalBurn = Object.entries(workoutLog).reduce((sum, [type, value]) => {
  if (type === "Run") return sum + Math.round(value * 70);
  if (type === "Steps") return sum + Math.round(value * 0.04);
  if (type === "Treadmill") return sum + value;
  if (type === "Swim") return sum + Math.round(value * 7);
  if (type === "Plank") return sum + Math.round(value * 0.04);
  if (type === "Row Machine") return sum + Math.round(value * 6);
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
  let burn;
  if (type === "Plank") {
    burn = Math.round(reps * 0.04); // ~2.4 cal/min
  } else if (type === "Row Machine") {
    burn = Math.round(reps * 6); // 6 cal per min
  } else {
    burn = Math.round(workouts[type] * reps);
  }

  setWorkoutLog(prev => {
    const updated = { ...prev };
    updated[type] = (updated[type] || 0) + reps;
    return updated;
// removed suspicious closing token

  if (type === "Steps") {
    setSteps(prev => prev + reps);
  }

  if (type === "Run") {
    const runSteps = Math.round(reps * 800);
    setSteps(prev => prev + runSteps);
  }
};


  const deleteWorkout = (type) => {
  const reps = workoutLog[type];
  const burn =
  type === "Run"
    ? Math.round(reps * 70)
    : type === "Steps"
    ? Math.round(reps * 0.04)
    : type === "Plank"
    ? Math.round(reps * 0.04)
    : type === "Row Machine"
    ? Math.round(reps * 6)
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
// removed suspicious closing token
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
// removed suspicious closing token

  if (screen === "food") {
  // removed duplicate return (
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

  if (screen === "workouts") {
// removed duplicate return (
    <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", maxWidth: "500px", margin: "auto" }}>
      <HomeButton />
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>🏋️ Workouts</h1>

      {/* Strength + Run entries */}
      {}

      {/* Steps section - separate from workouts */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <label style={{ width: "100px", fontSize: "16px" }}>Steps</label>
        <input
          type="number"
          placeholder="Steps"
          value={customWorkout["Steps"] || ""}
          onChange={(e) =>
            setCustomWorkout({ ...customWorkout, Steps: e.target.value })
          }
          style={{ width: "100px", padding: "8px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          onClick={() => {
            const steps = parseInt(customWorkout["Steps"]);
            if (!isNaN(steps)) {
              const stepCalories = Math.round(steps * 0.04); // flat walking only
              setSteps(prev => prev + steps); // steps tracker
              setWorkoutLog(prev => ({
                ...prev,
                Steps: (prev["Steps"] || 0) + steps
              }));
              setCustomWorkout({ ...customWorkout, Steps: "" });
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

{/* Treadmill Entry */}
<div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
  <label style={{ width: "100px", fontSize: "16px" }}>Treadmill</label>
  
  <input
    type="number"
    placeholder="Cal"
    value={customWorkout.treadCal || ""}
    onChange={(e) => setCustomWorkout({ ...customWorkout, treadCal: e.target.value })}
    style={{
      width: "43px", // 🔻 halved
      height: "23.5px",
      padding: "6px",
      fontSize: "14px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  />
  
  <input
    type="number"
    placeholder="KM"
    step="0.01"
    value={customWorkout.treadKm || ""}
    onChange={(e) => setCustomWorkout({ ...customWorkout, treadKm: e.target.value })}
    style={{
      width: "39.125px", // 🔻 halved
      height: "23.5px",
      padding: "6px",
      fontSize: "14px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  />
  
  <button
    onClick={() => {
      const cal = parseInt(customWorkout.treadCal);
      const km = parseFloat(customWorkout.treadKm);
      if (!isNaN(cal) && !isNaN(km)) {
        const estimatedSteps = Math.round(km * 1250);
        setSteps(prev => prev + estimatedSteps);
        setWorkoutLog(prev => ({
          ...prev,
          Treadmill: (prev.Treadmill || 0) + cal
        }));
        setCustomWorkout({ ...customWorkout, treadCal: "", treadKm: "" });
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

{/* Swim Entry (50m laps, 7 cal/lap) */}
<div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
  <label style={{ width: "100px", fontSize: "16px" }}>Swim</label>

  <input
    type="number"
    placeholder="Laps"
    value={customWorkout["Swim"] || ""}
    onChange={(e) => setCustomWorkout({ ...customWorkout, Swim: e.target.value })}
    style={{
      width: "100px",
      padding: "8px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  />

  <button
    onClick={() => {
      const laps = parseInt(customWorkout["Swim"]);
      if (!isNaN(laps)) {
        const cal = Math.round(laps * 7); // 7 cal per 50m lap
        setWorkoutLog(prev => ({
          ...prev,
          Swim: (prev.Swim || 0) + laps
        }));
        setCustomWorkout({ ...customWorkout, Swim: "" });
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

      {/* Workout Summary */}
      {Object.keys(workoutLog).length > 0 && (
        <>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginTop: "24px", marginBottom: "12px" }}>Summary</h2>
          <ul style={{ paddingLeft: "16px", marginBottom: "16px" }}>
            {Object.entries(workoutLog).map(([type, value], i) => {
              let cal;
let display;

if (type === "Run") {
  cal = Math.round(value * 70);
  display = `${value} km — ${cal} cal`;
} else if (type === "Steps") {
  cal = Math.round(value * 0.04);
  display = `${value} steps — ${cal} cal`;
} else if (type === "Treadmill") {
  cal = value;
  display = `${cal} cal`;
} else if (type === "Swim") {
  const laps = value;
  cal = Math.round(laps * 7);
  display = `${laps} laps — ${cal} cal`;
} else if (type === "Plank") {
  cal = Math.round(value * 0.04);
  display = `${value} sec — ${cal} cal`;
} else if (type === "Row Machine") {
  cal = Math.round(value * 6);
  display = `${value} min — ${cal} cal`;
} else if (workouts[type]) {
  cal = Math.round(value * workouts[type]);
  display = `${value} reps — ${cal} cal`;
  <>
// removed duplicate return
  <ul>
    {Object.entries(workoutLog).map(([type, val], i) => {
      const rate = burnRates[type];
      let cal = 0;
      let display = "";
      const value = parseFloat(val);
      if (!isNaN(value)) {
        if (typeof rate === "function") {
          cal = rate(value);
        } else {
          cal = value * rate;
        }
        display = `${cal} cal`;
      }
// removed duplicate return (
        <li key={i} style={{ fontSize: "16px", marginBottom: "6px" }}>
          {type}: {display}{" "}
          <button onClick={() => deleteWorkout(type)} style={{ marginLeft: "8px" }}>❌</button>
        </li>
      
    })}
  </>
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
        if (!isNaN(value)) {
          const v = parseFloat(value);
          return sum + (typeof rate === "function" ? rate(v) : v * rate);
        }
        return sum;
      }, 0)
    } cal
    if (type === "Run") return sum + Math.round(value * 70);
    if (type === "Steps") return sum + Math.round(value * 0.04);
    if (type === "Treadmill") return sum + value;
    if (type === "Swim") return sum + Math.round(value * 7);
    if (workouts[type]) return sum + Math.round(value * workouts[type]);
    return sum + value;
  }, 0)
} cal
        </>
// removed suspicious closing token

  if (screen === "weight") {
  const latestWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : "—";
  const latestDate = weightLog.length > 0 ? weightLog[weightLog.length - 1].date : "";

  const data = {
    labels: weightLog.map((w) => w.date),
    datasets: [
      {
        label: "Weight (lbs)",
        data: weightLog.map((w) => w.weight),
        borderColor: "#0070f3",
        backgroundColor: "#0070f3",
        fill: false,
        tension: 0.3,
      },
    ],
  };

// removed duplicate return (
    <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", maxWidth: "500px", margin: "auto" }}>
      <HomeButton />
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "12px" }}>⚖️ Weight Tracker</h1>

      {/* Latest weight */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>{latestWeight} lb</div>
        <div style={{ fontSize: "14px", color: "#666" }}>{latestDate}</div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          placeholder="Enter weight"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          style={{ flex: 1, padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          onClick={addWeight}
          style={{
            padding: "10px 16px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px"
          }}
        >
          Log
        </button>

      {/* Chart */}
      {weightLog.length > 0 && (
        <div style={{
          backgroundColor: "#fff",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          marginBottom: "24px"
        }}>
          <Line data={data} />
// removed suspicious closing token

      {/* History */}
      <ul style={{ paddingLeft: "16px" }}>
        {weightLog.map((w, i) => (
          <li key={i} style={{ fontSize: "16px", marginBottom: "6px" }}>
            {w.date}: {w.weight} lbs{" "}
            <button onClick={() => deleteWeight(i)} style={{ marginLeft: "8px" }}>❌</button>
          </li>
        ))}
      </ul>

// removed duplicate return (
  <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", maxWidth: "500px", margin: "auto" }}>
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
  <img src="/logo-banner.png" alt="EatLiftBurn logo" style={{ width: "45%", height: "auto" }} />

    {/* Overview Box */}
    <div style={{
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      marginBottom: "20px"
    }}>
      <h2 style={{
  fontSize: "17px",
  fontWeight: "600",
  marginTop: "0px",
  marginBottom: "8px"
}}>
  📊 Today
</h2>

      <div style={{ fontSize: "16px", marginBottom: "8px" }}>
        <strong>Calories Eaten:</strong> {calories}
      <div style={{ fontSize: "16px", marginBottom: "8px" }}>
        <strong>Calories Burned:</strong>{" "}
{
  Object.entries(workoutLog).reduce((sum, [type, value]) => {
    if (type === "Run") return sum + Math.round(value * 70);
    if (type === "Steps") return sum + Math.round(value * 0.04);
    if (type === "Treadmill") return sum + value;
    if (type === "Swim") return sum + Math.round(value * 7);
    if (workouts[type]) return sum + Math.round(value * workouts[type]);
    return sum + value;
  }, 0)
}
      <div style={{ fontSize: "16px", marginBottom: "8px" }}>
  <strong>Deficit:</strong>{" "}
  <span style={{ color: estimatedDeficit >= deficitGoal ? "green" : "red" }}>
    {estimatedDeficit}
  </span>
  <span> / {deficitGoal}</span>
  {estimatedDeficit >= deficitGoal && (
    <span style={{ fontSize: "12px", marginLeft: "4px" }}>✅</span>
// removed suspicious closing token

<div style={{ fontSize: "16px", marginBottom: "8px" }}>
  <strong>Protein:</strong>{" "}
  <span style={{ color: protein >= proteinGoal ? "green" : "red" }}>
    {protein}
  </span>
  <span> / {proteinGoal}</span>
  {protein >= proteinGoal && (
    <span style={{ fontSize: "12px", marginLeft: "4px" }}>✅</span>
// removed suspicious closing token

<div style={{ fontSize: "16px" }}>
  <strong>Steps:</strong>{" "}
  <span style={{ color: steps >= stepGoal ? "green" : "red" }}>
    {steps}
  </span>
  <span> / {stepGoal}</span>
  {steps >= stepGoal && (
    <span style={{ fontSize: "12px", marginLeft: "4px" }}>✅</span>
// removed suspicious closing token


    {/* Checklist Box */}
    <div style={{
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      marginBottom: "12px"
    }}>
      <h3 style={{
  fontSize: "18px",
  fontWeight: "600",
  marginTop: "0px",
  marginBottom: "12px"
}}>
  ☑️ Checklist
</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {["sunlight", "supplements", "concentrace"].map((key) => (
  <label key={key} style={{ fontSize: "16px" }}>
    <input
      type="checkbox"
      checked={checklist[key]}
      onChange={() =>
        setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
      }
      style={{ marginRight: "10px" }}
    />
    {key === "sunlight"
      ? "Sunlight 🌞"
      : key === "supplements"
      ? "Supplements 💊"
      : key === "concentrace"
      ? "Concentrace 💧"
      : key}
  </label>
))}

    {/* Navigation Buttons */}
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
      <button style={navBtnStyle} onClick={() => setScreen("food")}>
  🍽️ Food Log
</button>
      <button style={navBtnStyle} onClick={() => setScreen("workouts")}>🏋️ Workouts</button>
      <button style={navBtnStyle} onClick={() => setScreen("weight")}>⚖️ Weight</button>
    
    <button
      onClick={resetDay}
      style={{
  backgroundColor: "#d32f2f",
  color: "white",
  padding: "8px 20px",
  fontSize: "15px",
  border: "none",
  borderRadius: "8px",
  width: "140px",
  maxWidth: "100%",
  display: "block",
  margin: "0 auto",
  marginTop: "3px"
}}
    >
      Reset
    </button>

export default App;


{workoutList.map((type, index) => (
  <div key={index}>
    <input
      type="number"
      value={customWorkout[type] || ""}
      onChange={(e) =>
        setCustomWorkout({ ...customWorkout, [type]: e.target.value })
      }
      placeholder={
        type === "Run"
          ? "Kilometers"
          : type === "Plank"
          ? "Seconds"
          : type === "Treadmill"
          ? "Minutes"
          : "Reps"
      }
    />
    <button onClick={() => logWorkout(type)}>Add</button>
    <span>{type}</span>
))}


{screen === "workouts" && (
  <div style={{ padding: "24px", fontFamily: "Inter, Arial", maxWidth: "500px", margin: "auto" }}>
    <button onClick={() => setScreen('home')} style={{ fontSize: "18px", padding: "10px 20px", marginBottom: '20px' }}>⬅️ Home</button>
    <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>🏋️ Workouts</h1>
    {[
      "Push-ups", "Pull-ups", "Biceps", "Bench Press", "Triceps",
      "Leg Press", "Lunges", "Smith Machine Squats", "RDLs", "Glute Abductor",
      "Low Pull", "Back Extensions", "Core Pull", "Plank",
      "Run", "Steps", "Swim", "Treadmill"
    ].map((type, index) => (
      <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <label style={{ width: "140px", fontSize: "16px" }}>{type}</label>
        {type === "Treadmill" ? (
          <>
            <input
              type="number"
              placeholder="Cal"
              value={customWorkout["TreadmillCal"] || ""}
              onChange={(e) => setCustomWorkout({ ...customWorkout, TreadmillCal: e.target.value })}
              style={{ width: "60px", padding: "6px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <input
              type="number"
              placeholder="KM"
              value={customWorkout["TreadmillKm"] || ""}
              onChange={(e) => setCustomWorkout({ ...customWorkout, TreadmillKm: e.target.value })}
              style={{ width: "60px", padding: "6px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </>
        ) : (
          <input
            type="number"
            placeholder={
              type === "Plank" ? "Seconds"
              : type === "Run" ? "Kilometers"
              : type === "Swim" ? "Laps"
              : type === "Steps" ? "Steps"
              : "Reps"
            }
            value={customWorkout[type] || ""}
            onChange={(e) => setCustomWorkout({ ...customWorkout, [type]: e.target.value })}
            style={{ width: "100px", padding: "8px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
// removed suspicious closing token
        <button
          onClick={() => {
            let input = parseFloat(customWorkout[type]);
            if (type === "Treadmill") {
              const cal = parseFloat(customWorkout["TreadmillCal"]);
              const km = parseFloat(customWorkout["TreadmillKm"]);
              if (!isNaN(cal) && !isNaN(km)) {
                const stepsToAdd = Math.round(km * 1250);
                setSteps(prev => prev + stepsToAdd);
                setWorkoutLog(prev => ({ ...prev, Treadmill: (prev.Treadmill || 0) + cal }));
                setCustomWorkout({ ...customWorkout, TreadmillCal: "", TreadmillKm: "" });
              }
              return;
            }
            if (!isNaN(input)) {
              const rate = burnRates[type];
              const cal = typeof rate === "function" ? rate(input) : Math.round(input * rate);
              if (type === "Steps") setSteps(prev => prev + input);
              if (type === "Run") setSteps(prev => prev + Math.round(input * 800));
              setWorkoutLog(prev => ({ ...prev, [type]: (prev[type] || 0) + input }));
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
    ))}
    <h3 style={{ marginTop: "30px", fontSize: "18px" }}>Today's Workout Log:</h3>
    <ul>
      {Object.entries(workoutLog).map(([type, val]) => (
        <li key={type}>{type}: {val}</li>
      ))}
    </ul>
    <p style={{ fontWeight: "bold" }}>Total Burn: {
      Object.entries(workoutLog).reduce((acc, [type, val]) => {
        const rate = burnRates[type];
        const cal = typeof rate === "function" ? rate(parseFloat(val)) : Math.round(parseFloat(val) * rate);
        return acc + cal;
      }, 0)
    } cal</p>
// removed extra </div>
// removed suspicious closing token
</ul>
