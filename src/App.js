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
  const [customWorkout, setCustomWorkout] = useState({});
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

  const logWorkout = (type, reps) => {
    const burn = Math.round(workouts[type] * reps);
    setWorkoutLog(prev => {
      const updated = { ...prev };
      updated[type] = (updated[type] || 0) + reps;
      return updated;
    });
    setManualBurn(prev => prev + burn);
    if (type === "Steps") {
      setSteps(prev => {
        const totalSteps = prev + reps;
        return totalSteps;
      });
    }
  };

  const deleteWorkout = (type) => {
    const reps = workoutLog[type];
    const burn = Math.round(workouts[type] * reps);
    setManualBurn(prev => prev - burn);
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
    fontSize: "18px",
    padding: "14px 20px",
    margin: "6px"
  };

  const HomeButton = () => (
    <button onClick={() => setScreen("home")} style={navBtnStyle}>⬅ Home</button>
  );

  if (screen === "food") {
    return (
      <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif" }}>
        <HomeButton />
        <h2>Food Log</h2>
        <select
          defaultValue=""
          onChange={(e) => {
            const selected = JSON.parse(e.target.value);
            addFood(selected);
          }}
        >
          <option value="" disabled>Select Food</option>
          {foodOptions.map((f, i) => (
            <option key={i} value={JSON.stringify(f)}>
              {f.name}
            </option>
          ))}
        </select>
        <div>
          <input
            placeholder="Name"
            value={customFood.name}
            onChange={e =>
              setCustomFood({ ...customFood, name: e.target.value })
            }
          />
          <input
            placeholder="Calories"
            type="number"
            value={customFood.cal}
            onChange={e =>
              setCustomFood({ ...customFood, cal: e.target.value })
            }
          />
          <input
            placeholder="Protein"
            type="number"
            value={customFood.prot}
            onChange={e =>
              setCustomFood({ ...customFood, prot: e.target.value })
            }
          />
          <button
            onClick={() => {
              const { name, cal, prot } = customFood;
              const parsedCal = parseInt(cal);
              const parsedProt = parseInt(prot);
              if (name && parsedCal && parsedProt) {
                addFood({ name, cal: parsedCal, prot: parsedProt });
                setCustomFood({ name: "", cal: "", prot: "" });
              }
            }}
          >
            Add
          </button>
        </div>
        <ul>
          {foodLog.map((f, i) => (
            <li key={i}>
              {f.name} - {f.cal} cal, {f.prot}g{" "}
              <button onClick={() => deleteFood(i)}>❌</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (screen === "workouts") {
    return (
      <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif" }}>
        <HomeButton />
        <h2>Workout Log</h2>
        {Object.keys(workouts).map((type, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <label>{type}:</label>
            <input
              type="number"
              placeholder="Reps"
              value={customWorkout[type] || ""}
              onChange={(e) =>
                setCustomWorkout({ ...customWorkout, [type]: e.target.value })
              }
            />
            <button
              onClick={() => {
                const reps = parseInt(customWorkout[type]);
                if (!isNaN(reps)) {
                  logWorkout(type, reps);
                  setCustomWorkout({ ...customWorkout, [type]: "" });
                }
              }}
            >
              Add
            </button>
          </div>
        ))}
        <h3>Workout Summary</h3>
        <ul>
          {Object.entries(workoutLog).map(([type, reps], i) => (
            <li key={i}>
              {type}: {reps} reps — {Math.round(reps * workouts[type])} cal{" "}
              <button onClick={() => deleteWorkout(type)}>❌</button>
            </li>
          ))}
        </ul>
        <p>Total Workout Burn: {manualBurn} cal</p>
      </div>
    );
  }

  if (screen === "weight") {
    const data = {
      labels: weightLog.map((w) => w.date),
      datasets: [
        {
          label: "Weight (lbs)",
          data: weightLog.map((w) => w.weight),
          fill: false,
          borderColor: "#4caf50",
          tension: 0.1,
        },
      ],
    };

    return (
      <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif" }}>
        <HomeButton />
        <h2>Weight Tracker</h2>
        <input
          placeholder="Enter weight"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
        />
        <button onClick={addWeight}>Log Weight</button>
        <ul>
          {weightLog.map((w, i) => (
            <li key={i}>
              {w.date}: {w.weight} lbs{" "}
              <button onClick={() => deleteWeight(i)}>❌</button>
            </li>
          ))}
        </ul>
        {weightLog.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <Line data={data} />
          </div>
        )}
      </div>
    );
  }

  if (screen === "summary") {
    return (
      <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif" }}>
        <HomeButton />
        <h2>Weekly Summary</h2>
        <p>Avg Deficit: {estimatedDeficit}</p>
        <p>Avg Protein: {protein}</p>
        <p>Steps: {steps}</p>
        <p>Avg Weight: {avgWeight.toFixed(1)} lbs</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>EatLiftBurn</h1>
      <div style={{ fontSize: "14px", marginBottom: "20px", color: "#555" }}>
        an app by Jon Deutsch
      </div>
      <h2>Today's Overview</h2>
      <p style={overviewStyle}>Calories Eaten: {calories}</p>
      <p style={overviewStyle}>Calories Burned: {totalBurned}</p>
      <p style={overviewStyle}>Deficit: {estimatedDeficit} / {deficitGoal}</p>
      <p style={overviewStyle}>Protein: {protein} / {proteinGoal}</p>
      <p style={overviewStyle}>Steps: {steps} / {stepGoal}</p>

      <h3 style={{ marginTop: "20px" }}>Checklist</h3>
      {Object.keys(checklist).map((key) => (
        <div key={key}>
          <label>
            <input
              type="checkbox"
              checked={checklist[key]}
              onChange={() =>
                setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
              }
            />{" "}
            {key}
          </label>
        </div>
      ))}

      <div style={{ marginTop: "24px" }}>
        <button style={navBtnStyle} onClick={() => setScreen("food")}>
          🍽️ Food Log
        </button>
        <button style={navBtnStyle} onClick={() => setScreen("workouts")}>
          🏋️ Workouts
        </button>
        <button style={navBtnStyle} onClick={() => setScreen("weight")}>
          ⚖️ Weight
        </button>
        <button style={navBtnStyle} onClick={() => setScreen("summary")}>
          📊 Summary
        </button>
      </div>

      <button
        onClick={resetDay}
        style={{
          backgroundColor: "#d32f2f",
          color: "white",
          padding: "12px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          marginTop: "20px"
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default App;
