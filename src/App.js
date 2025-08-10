



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


// ▶ personal constants for BMR calculation
const heightCm = 170;
const birthDate = new Date(1990, 8, 21);  // Sep 21, 1990
const isMale = true;
function App() {
  const [screen, setScreen] = useState("home");
  const [toastMsg, setToastMsg] = useState("");
  const [calories, setCalories] = useState(() => parseInt(localStorage.getItem("calories")) || 0);
  const [protein, setProtein] = useState(() => parseInt(localStorage.getItem("protein")) || 0);
  const [steps, setSteps] = useState(() => parseInt(localStorage.getItem("steps")) || 0);
  // ▶ default deficit goal to saved override or personal threshold
const [deficitGoal, setDeficitGoal] = useState(() => {
  const saved = parseInt(localStorage.getItem("deficitGoal"), 10);
  return !isNaN(saved) ? saved : 500;  // ✅ fallback to 500 instead of calorieThreshold
});

  const [proteinGoal, setProteinGoal] = useState(() => parseFloat(localStorage.getItem("proteinGoal")) || 140);
const [fat, setFat] = useState(() => parseFloat(localStorage.getItem("fat")) || 0);
const [carbs, setCarbs] = useState(() => parseFloat(localStorage.getItem("carbs")) || 0);
const [fiber, setFiber] = useState(() => parseFloat(localStorage.getItem("fiber")) || 0);
const [water, setWater] = useState(() => parseInt(localStorage.getItem("water")) || 0);

// 🧠 Daily macro/water goals
const [mode, setMode] = useState(() => localStorage.getItem("mode") || "Cut");
const [showModes, setShowModes] = useState(false);

const [fatGoal, setFatGoal] = useState(
  () => parseFloat(localStorage.getItem("fatGoal")) || 50
);
const [carbGoal, setCarbGoal] = useState(
  () => parseFloat(localStorage.getItem("carbGoal")) || 120
);
const fiberGoal = 28;
const waterGoal = 3; // bottles of 27oz (~2.5L)
  const [stepGoal] = useState(10000);
  // ▶ Mode offsets (editable in Mode Settings)
  const [cutDeficit, setCutDeficit] = useState(() => parseInt(localStorage.getItem("cutDeficit")) || 500);
  const [bulkSurplus, setBulkSurplus] = useState(() => parseInt(localStorage.getItem("bulkSurplus")) || 100);
  // Per-mode macro presets
  const [cutProtein, setCutProtein] = useState(() => parseFloat(localStorage.getItem('cutProtein')) || 140);
  const [cutFat, setCutFat] = useState(() => parseFloat(localStorage.getItem('cutFat')) || 50);
  const [cutCarb, setCutCarb] = useState(() => parseFloat(localStorage.getItem('cutCarb')) || 120);

  const [maintProtein, setMaintProtein] = useState(() => parseFloat(localStorage.getItem('maintProtein')) || 140);
  const [maintFat, setMaintFat] = useState(() => parseFloat(localStorage.getItem('maintFat')) || 55);
  const [maintCarb, setMaintCarb] = useState(() => parseFloat(localStorage.getItem('maintCarb')) || 160);

  const [bulkProtein, setBulkProtein] = useState(() => parseFloat(localStorage.getItem('bulkProtein')) || 150);
  const [bulkFat, setBulkFat] = useState(() => parseFloat(localStorage.getItem('bulkFat')) || 60);
  const [bulkCarb, setBulkCarb] = useState(() => parseFloat(localStorage.getItem('bulkCarb')) || 200);


  const [checklist, setChecklist] = useState(() => JSON.parse(localStorage.getItem("checklist")) || {
  supplements: false,
  sunlight: false,
  concentrace: false,
  teffilin: false
});
// collapsed/expanded state for the Checklist (persisted)
const [isChecklistCollapsed, setIsChecklistCollapsed] = useState(() => {
  try {
    return localStorage.getItem("isChecklistCollapsed") === "true";
  } catch {
    return false;
  }
});

useEffect(() => {
  try {
    localStorage.setItem("isChecklistCollapsed", String(isChecklistCollapsed));
  } catch {}
}, [isChecklistCollapsed]);
const allChecklistItemsComplete = Object.values(checklist).every(Boolean);
  const [foodLog, setFoodLog] = useState(() => JSON.parse(localStorage.getItem("foodLog")) || []);
  const [workoutLog, setWorkoutLog] = useState(() => JSON.parse(localStorage.getItem("workoutLog")) || {});
  const [weightLog, setWeightLog] = useState(() => JSON.parse(localStorage.getItem("weightLog")) || []);
  const [newWeight, setNewWeight] = useState("");

  // ▶ compute age
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  // ▶ latest weight (lbs)
  const latestWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : null;

  // ▶ true BMR via Mifflin–St Jeor
  const bmr = latestWeight
    ? Math.round(
        10 * (latestWeight / 2.20462) +  // lbs → kg
        6.25 * heightCm -
        5 * age +
        (isMale ? 5 : -161)
      )
    : null;

  // ▶ unified threshold: BMR or fallback 1600
  const calorieThreshold = bmr || 1600;

  const [customFood, setCustomFood] = useState({ name: "", cal: "", prot: "", fat: "", carbs: "", fiber: "" });
  const [customWorkout, setCustomWorkout] = useState({});
// Steps intensity + per-step kcal factors
const [stepIntensity, setStepIntensity] = useState("Med");
const STEP_FACTORS = { Slow: 0.028, Med: 0.039, Fast: 0.051 };
const cycleStepIntensity = () =>
  setStepIntensity(prev => (prev === "Med" ? "Fast" : prev === "Fast" ? "Slow" : "Med"));

  const [customSteps, setCustomSteps] = useState("");
  const [foodSearch,   setFoodSearch]   = useState("");

  const workouts = {
  "Leg Press": 0.4,
  "Bench Press": 0.3,
  "Incline Press": 0.25,
  "Pull-ups": 0.4,
  "Shoulder Press": 0.3,
  "Glute Abductor": 0.25,
  "Low Pull": 0.3,
  "Hamstring Curl": 0.25,
  "Lunges": 0.4,
  "Back Extensions": 0.2,
  "Core Pull": 0.2,
  "Biceps": 0.2,
  "Triceps": 0.2,
  "Push-ups": 0.3,
  "Plank": 0.04,
  "Run": "run",
  "Bike": "bike"
};
  
const foodOptions = [
  { name: "Almond Milk (1/4 cup)", cal: 23, prot: 0.9, fat: 1.9, carbs: 0.5, fiber: 0 },
  { name: "Almond Milk (1/2 cup)", cal: 46, prot: 1.8, fat: 3.8, carbs: 1.0, fiber: 0 },
  { name: "Almond Milk (3/4 cup)", cal: 68, prot: 2.7, fat: 5.8, carbs: 1.4, fiber: 0 },
  { name: "Almond Milk (1 cup)",   cal: 91, prot: 3.6, fat: 7.7, carbs: 1.9, fiber: 0 },
  { name: "Apple", cal: 95, prot: 1, fat: 0.3, carbs: 25, fiber: 4.4 },
  { name: "Asparagus (cooked, 50g)", cal: 10, prot: 1.1, fat: 0.1, carbs: 1.9, fiber: 1.1 },
  { name: "Asparagus (cooked, 75g)",  cal: 15, prot: 1.7, fat: 0.15, carbs: 2.8, fiber: 1.6 },
  { name: "Asparagus (cooked, 100g)", cal: 20, prot: 2.2, fat: 0.2, carbs: 3.7, fiber: 2.1 },
  { name: "Asparagus (cooked, 150g)", cal: 30, prot: 3.3, fat: 0.3, carbs: 5.6, fiber: 3.2 },
  { name: "Avocado (half)", cal: 120, prot: 1.5, fat: 10, carbs: 6, fiber: 5 },
  { name: "Avocado (whole)", cal: 240, prot: 3, fat: 20, carbs: 12, fiber: 10 },
  { name: "Banana (half)", cal: 53, prot: 0.6, fat: 0.2, carbs: 13.5, fiber: 1.6 },
  { name: "Banana (whole)", cal: 105, prot: 1.3, fat: 0.4, carbs: 27, fiber: 3.1 },
  { name: "Blueberries (½ cup)", cal: 42, prot: 0.6, fat: 0.25, carbs: 10.7, fiber: 1.8 },
  { name: "Blueberries (1 cup)", cal: 84, prot: 1.1, fat: 0.5, carbs: 21.4, fiber: 3.6 },
  { name: "Brazil nut", cal: 33, prot: 0.75, fat: 3.4, carbs: 0.6, fiber: 0.2 },
  { name: "Bread (sourdough rye slice 56g)", cal: 145, prot: 4.5, fat: 1.0, carbs: 27, fiber: 3.3 },
  { name: "Bread (Lechamim bun 75g)", cal: 225, prot: 7, fat: 4.5, carbs: 40, fiber: 1.5 },
  { name: "Broccoli (50g)",  cal: 18, prot: 1.2, fat: 0.2, carbs: 3.5, fiber: 1.7 },
  { name: "Broccoli (100g)", cal: 35, prot: 2.4, fat: 0.4, carbs: 7.0, fiber: 3.3 },
  { name: "Broccoli (150g)", cal: 53, prot: 3.6, fat: 0.6, carbs: 10.5, fiber: 5.0 },
  { name: "Broccoli (200g)", cal: 70, prot: 4.8, fat: 0.8, carbs: 14.0, fiber: 6.6 },
  { name: "Butter (1 tsp)", cal: 35, prot: 0, fat: 4, carbs: 0, fiber: 0 },
  { name: "Butter (½ tbsp)", cal: 51, prot: 0.05, fat: 5.8, carbs: 0, fiber: 0 },
  { name: "Butter (1 tbsp)", cal: 102, prot: 0.1, fat: 11.5, carbs: 0, fiber: 0 },
  { name: "Carrot (50g)", cal: 21, prot: 0.5, fat: 0.1, carbs: 5, fiber: 1.4 },
  { name: "Carrot (100g)", cal: 41, prot: 0.9, fat: 0.2, carbs: 10, fiber: 2.8 },
  { name: "Carrot (150g)", cal: 62, prot: 1.4, fat: 0.3, carbs: 15, fiber: 4.2 },
  { name: "Carrots Peas and Corn (frozen, 100g)", cal: 63, prot: 3, fat: 1.1, carbs: 10, fiber: 4 },
  { name: "Chia pudding (2 tbsp chia + 3/4 cup almond milk)", cal: 206, prot: 5, fat: 9, carbs: 12, fiber: 10 },
  { name: "Chia seeds (1 tbsp)", cal: 58, prot: 2, fat: 3.7, carbs: 5.1, fiber: 4.1 },
  { name: "Chicken breast (50g)", cal: 82, prot: 15, fat: 1.8, carbs: 0, fiber: 0 },
  { name: "Chicken breast (100g)", cal: 165, prot: 31, fat: 3.6, carbs: 0, fiber: 0 },
  { name: "Chicken breast (130g)", cal: 215, prot: 40, fat: 4.7, carbs: 0, fiber: 0 },
  { name: "Chicken breast (150g)", cal: 248, prot: 46, fat: 5.4, carbs: 0, fiber: 0 },
  { name: "Chicken breast (160g)", cal: 264, prot: 50, fat: 5.8, carbs: 0, fiber: 0 },
  { name: "Chicken breast (200g)", cal: 330, prot: 62, fat: 7.2, carbs: 0, fiber: 0 },
  { name: "Chocolate chips (10g)", cal: 58, prot: 1, fat: 4, carbs: 5, fiber: 1.8 },
  { name: "Corn (100g)", cal: 85, prot: 2.2, fat: 1.3, carbs: 15.3, fiber: 1.5 },
  { name: "Cottage cheese 5% (50g)", cal: 48, prot: 5.5, fat: 2.5, carbs: 0.8, fiber: 0 },
  { name: "Cottage cheese 5% (100g)", cal: 95, prot: 11, fat: 5, carbs: 1.5, fiber: 0 },
  { name: "Cottage cheese 5% (250g full tub)", cal: 238, prot: 27.5, fat: 12.5, carbs: 3.8, fiber: 0 },
  { name: "Cucumber", cal: 16, prot: 1, fat: 0.1, carbs: 4, fiber: 0.5 },
  { name: "Date (1 Medjool)", cal: 66, prot: 0.4, fat: 0.1, carbs: 18, fiber: 1.6 },
  { name: "Egg", cal: 70, prot: 6, fat: 5, carbs: 0.6, fiber: 0 },
  { name: "Egg white", cal: 15, prot: 3, fat: 0, carbs: 0.2, fiber: 0 },
  { name: "Eggs (2) + butter", cal: 175, prot: 12, fat: 13, carbs: 0.6, fiber: 0 },
  { name: "Eggs (2), Egg white (1) + butter", cal: 190, prot: 15, fat: 13, carbs: 0.8, fiber: 0 },
  { name: "Fig (1 medium)", cal: 37, prot: 0.4, fat: 0.2, carbs: 10, fiber: 1.4 },
  { name: "Flax seeds (1 tbsp)", cal: 55, prot: 2, fat: 4.3, carbs: 3, fiber: 2.8 },
  { name: "Green onions", cal: 5, prot: 0, fat: 0, carbs: 1, fiber: 0.3 },
  { name: "Green beans (100g, roasted, no oil)", cal: 38, prot: 2.2, fat: 0.4, carbs: 8, fiber: 3.6 },
  { name: "Green beans (200g, roasted, no oil)", cal: 76, prot: 4.4, fat: 0.8, carbs: 16, fiber: 7.2 },
  { name: "Green beans (300g, roasted, no oil)", cal: 114, prot: 6.6, fat: 1.2, carbs: 24, fiber: 10.8 },
  { name: "Ground beef 90/10 (50g)", cal: 73, prot: 9.3, fat: 4, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (100g)", cal: 145, prot: 18.6, fat: 8, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (150g)", cal: 218, prot: 27.9, fat: 12, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (200g)", cal: 290, prot: 37.2, fat: 16, carbs: 0, fiber: 0 },
  { name: "Honey (½ tsp)", cal: 7.5, prot: 0, fat: 0, carbs: 2, fiber: 0 },
  { name: "Honey (1 tsp)", cal: 15, prot: 0, fat: 0, carbs: 4, fiber: 0 },
  { name: "Honey (½ tbsp)", cal: 22.5, prot: 0, fat: 0, carbs: 6, fiber: 0 },
  { name: "Honey (1 tbsp)", cal: 45, prot: 0, fat: 0, carbs: 12, fiber: 0 },
  { name: "Hummus (100g)", cal: 170, prot: 7, fat: 10, carbs: 14, fiber: 4 },
  { name: "Israeli salad (large)", cal: 100, prot: 2, fat: 0.5, carbs: 10, fiber: 3 },
  { name: "Israeli salad (medium)", cal: 70, prot: 1.5, fat: 0.3, carbs: 7, fiber: 2 },
  { name: "Israeli salad (small)", cal: 40, prot: 1, fat: 0.2, carbs: 4, fiber: 1 },
  { name: "Lychee (1 fruit)",  cal: 6,  prot: 0.1, fat: 0, carbs: 1.6, fiber: 0.1 },
  { name: "Lychee (5 fruits)", cal: 30, prot: 0.5, fat: 0, carbs: 8, fiber: 0.5 },
  { name: "Lychee (10 fruits)",cal: 60, prot: 1.0, fat: 0.1, carbs: 16, fiber: 1.0 },
  { name: "Mac n' Cheese (½ box of Goodles)",cal: 338, prot: 19, fat: 6, carbs: 60, fiber: 9 },
  { name: "Maple syrup (1 tsp)", cal: 17, prot: 0, fat: 0, carbs: 4.5, fiber: 0 },
  { name: "Maple syrup (½ tbsp)", cal: 26, prot: 0, fat: 0, carbs: 6.7, fiber: 0 },
  { name: "Maple syrup (1 tbsp)", cal: 52, prot: 0, fat: 0, carbs: 13.4, fiber: 0 },
  { name: "Oats (¼ cup)", cal: 73, prot: 2.4, fat: 1.7, carbs: 11.2, fiber: 2.4 },
  { name: "Oats (½ cup)", cal: 146, prot: 4.8, fat: 3.4, carbs: 22.4, fiber: 4.8 },
  { name: "Olive oil (1 tsp)", cal: 40, prot: 0, fat: 4.7, carbs: 0, fiber: 0 }, 
  { name: "Olive oil (½ tbsp)", cal: 60, prot: 0, fat: 7.0, carbs: 0, fiber: 0 }, 
  { name: "Olive oil (1 tbsp)", cal: 120, prot: 0, fat: 14, carbs: 0, fiber: 0 },
  { name: "Oreo (1 cookie)", cal: 52, prot: 0.35, fat: 2.15, carbs: 7.5, fiber: 0.05 },
  { name: "Oreo (2 cookies)", cal: 104, prot: 0.7, fat: 4.3, carbs: 15, fiber: 0.1 },
  { name: "Parmesan cheese (10g)", cal: 40, prot: 3.2, fat: 3.0, carbs: 0, fiber: 0 },
  { name: "Parmesan cheese (15g)", cal: 60, prot: 4.8, fat: 4.5, carbs: 0, fiber: 0 },
  { name: "Parmesan cheese (20g)", cal: 80, prot: 6.4, fat: 6.0, carbs: 0, fiber: 0 },
  { name: "Parmesan cheese (25g)", cal: 101, prot: 8.0, fat: 7.5, carbs: 0, fiber: 0 },
  { name: "Parmesan cheese (30g)", cal: 121, prot: 9.6, fat: 9.0, carbs: 0, fiber: 0 },
  { name: "Peanut butter (1 tsp)", cal: 47, prot: 2, fat: 4, carbs: 2, fiber: 0.5 },
  { name: "Peanut butter (1 tbsp)", cal: 94, prot: 4, fat: 8, carbs: 3, fiber: 1 },
  { name: "Peanut butter (PBfit 1 tbsp)", cal: 30, prot: 4, fat: 1, carbs: 3, fiber: 1 },
  { name: "Peanut butter (PBfit 2 tbsp)", cal: 60, prot: 8, fat: 2, carbs: 6, fiber: 2 },
  { name: "Peas (frozen, 50g)", cal: 37, prot: 3.5, fat: 0.8, carbs: 5.3, fiber: 2.6 },
  { name: "Peas (frozen, 100g)", cal: 73, prot: 6.9, fat: 1.5, carbs: 10.5, fiber: 5.1 },
  { name: "Peas (frozen, 150g)", cal: 110, prot: 10.4, fat: 2.3, carbs: 15.8, fiber: 7.7 },
  { name: "Peas (frozen, 200g)", cal: 146, prot: 13.8, fat: 3.0, carbs: 21.0, fiber: 10.2 },
  { name: "Peas (frozen, 1 cup)", cal: 102, prot: 9.7, fat: 2.1, carbs: 14.7, fiber: 7.1 },
  { name: "Pita (½)",  cal: 138, prot: 4.6, fat: 0.6, carbs: 27.9, fiber: 1.1 },
  { name: "Pita (full)", cal: 275, prot: 9.1, fat: 1.2, carbs: 55.7, fiber: 2.2 },
  { name: "Potato (50g)", cal: 43, prot: 1, fat: 0, carbs: 10, fiber: 1 },
  { name: "Potato (100g)", cal: 86, prot: 2, fat: 0, carbs: 20, fiber: 2 },
  { name: "Potato (150g)", cal: 129, prot: 3, fat: 0, carbs: 30, fiber: 3 },
  { name: "Potato (200g)", cal: 172, prot: 4, fat: 0, carbs: 40, fiber: 4 },
  { name: "Protein bar (promix vanilla)", cal: 150, prot: 15, fat: 3, carbs: 17, fiber: 5 },
  { name: "Protein bar (maxx)", cal: 217, prot: 21, fat: 6.8, carbs: 20, fiber: 3.9 },
  { name: "Protein bar (quest chocolate peanut butter)", cal: 190, prot: 20, fat: 9, carbs: 22, fiber: 11 },
  { name: "Protein bar (quest cookie dough)", cal: 190, prot: 21, fat: 9, carbs: 21, fiber: 12 },
  { name: "Protein bar (quest mini cookie dough)", cal: 80, prot: 8, fat: 3.5, carbs: 9, fiber: 5 },
  { name: "Protein chips (quest)", cal: 140, prot: 20, fat: 4.5, carbs: 4, fiber: 1 },
  { name: "Protein Ice Cream (PBfit Banana 1 vanilla)", cal: 409, prot: 44, fat: 3, carbs: 56, fiber: 5 },
  { name: "Protein Ice Cream (plain+unflavored)", cal: 257, prot: 36, fat: 2.5, carbs: 21, fiber: 0 },
  { name: "Protein pancakes (kodiak ½ cup)", cal: 220, prot: 14, fat: 2, carbs: 30, fiber: 3 },
  { name: "Protein scoop (1 Promix Chocolate)", cal: 80, prot: 15.5, fat: 0.75, carbs: 4.5 },
  { name: "Protein scoop (2 Promix Chocolate)", cal: 160, prot: 31, fat: 1.5, carbs: 9 },
  { name: "Protein scoop (1 Promix Unflavored)", cal: 65, prot: 15, fat: 0.25, carbs: 1 },
  { name: "Protein scoop (2 Promix Unflavored)", cal: 130, prot: 30, fat: 0.5, carbs: 2 },
  { name: "Protein scoop (1 Promix Vanilla)", cal: 75, prot: 15, fat: 0.25, carbs: 3.5 },
  { name: "Protein scoop (2 Promix Vanilla)", cal: 150, prot: 30, fat: 0.5, carbs: 7 },
  { name: "Pumpkin seeds (1 tsp)", cal: 20, prot: 1, fat: 1.5, carbs: 0.7, fiber: 0.4 },
  { name: "Pumpkin seeds (1 tbsp)", cal: 60, prot: 3, fat: 4.5, carbs: 2, fiber: 1.1 },
  { name: "Rice (50g cooked)", cal: 65, prot: 1.3, fat: 0.1, carbs: 14, fiber: 0.2 },
  { name: "Rice (100g cooked)", cal: 130, prot: 2.6, fat: 0.2, carbs: 28, fiber: 0.4 },
  { name: "Rice (150g cooked)", cal: 195, prot: 3.9, fat: 0.3, carbs: 42, fiber: 0.6 },
  { name: "Rice (200g cooked)", cal: 260, prot: 5.2, fat: 0.4, carbs: 56, fiber: 0.8 },
  { name: "Salmon (85g wild sockeye pouch)", cal: 100, prot: 17, fat: 3.5, carbs: 0, fiber: 0 },
  { name: "Salmon (50g)", cal: 103, prot: 11, fat: 6.5, carbs: 0, fiber: 0 },
  { name: "Salmon (100g)", cal: 206, prot: 22, fat: 13, carbs: 0, fiber: 0 },
  { name: "Salmon (150g)", cal: 309, prot: 33, fat: 19.5, carbs: 0, fiber: 0 },
  { name: "Salmon (200g)", cal: 412, prot: 44, fat: 26, carbs: 0, fiber: 0 },
  { name: "Spinach (frozen, 100g)", cal: 28, prot: 3.2, fat: 0.5, carbs: 3.2, fiber: 3.0 },
  { name: "Spinach (handful)", cal: 15, prot: 1.5, fat: 0.3, carbs: 2, fiber: 1 },
  { name: "Strawberries (½ cup)", cal: 25, prot: 0.5, fat: 0.25, carbs: 5.9, fiber: 1.5 },
  { name: "Strawberries (1 cup)", cal: 49, prot: 1, fat: 0.5, carbs: 11.7, fiber: 3 },
  { name: "Sweet potato (50g)", cal: 43, prot: 1, fat: 0, carbs: 10, fiber: 1.5 },
  { name: "Sweet potato (100g)", cal: 86, prot: 2, fat: 0.1, carbs: 20, fiber: 3 },
  { name: "Sweet potato (150g)", cal: 129, prot: 3, fat: 0.2, carbs: 30, fiber: 4.5 },
  { name: "Sweet potato (200g)", cal: 172, prot: 4, fat: 0.2, carbs: 40, fiber: 6 },
  { name: "Tomato", cal: 20, prot: 1, fat: 0.2, carbs: 5, fiber: 1.5 },
  { name: "Tuna (150g)", cal: 156, prot: 37.2, fat: 0.9, carbs: 0, fiber: 0 },
  { name: "Walnut", cal: 26, prot: 0.6, fat: 2.6, carbs: 0.6, fiber: 0.3 },
  { name: "Walnuts (3)", cal: 78, prot: 1.8, fat: 7.8, carbs: 1.8, fiber: 0.9 },
  { name: "Water (27oz)", cal: 0, prot: 0, fat: 0, carbs: 0, fiber: 0, water: 1 },
  { name: "Watermelon triangle", cal: 50, prot: 1, fat: 0.2, carbs: 12, fiber: 0.6 },
  { name: "Yogurt 0% (Pro)", cal: 117, prot: 20, fat: 0.3, carbs: 6, fiber: 0 },
  { name: "Yogurt 0% (Fage)", cal: 80, prot: 16, fat: 0, carbs: 5, fiber: 0 },
  { name: "Yogurt 2% (Fage)", cal: 100, prot: 215, fat: 3, carbs: 5, fiber: 0 }
];


  const totalBurn = Object.entries(workoutLog).reduce((sum, [type, value]) => {
  if (typeof value === "object" && value !== null && typeof value.cal === "number") {
    return sum + value.cal;
  }
  if (type === "Swim") return sum + Math.round(value * 7);
  if (type === "Plank") return sum + Math.round(value * 0.04);
  if (workouts[type]) return sum + Math.round(value * workouts[type]);
  return sum;
}, 0)

const estimatedDeficit = calorieThreshold + totalBurn - calories;

// dynamic goals used by progress bars
const modeCalOffset = mode === "Cut" ? -cutDeficit : (mode === "Bulk" ? bulkSurplus : 0);
const caloriesBudget = Math.max(0, calorieThreshold + totalBurn + modeCalOffset); // dynamic goal that grows with steps/workouts and shifts by mode (Cut -500, Bulk +100) // grows as you add steps/workouts
const waterCount = water + (checklist.concentrace ? 1 : 0); // Concentrace counts as 1 bottle

useEffect(() => {
    if (mode === "Cut") {
      setProteinGoal(cutProtein);
      setFatGoal(cutFat);
      setCarbGoal(cutCarb);
    } else if (mode === "Maintenance") {
      setProteinGoal(maintProtein);
      setFatGoal(maintFat);
      setCarbGoal(maintCarb);
    } else {
      setProteinGoal(bulkProtein);
      setFatGoal(bulkFat);
      setCarbGoal(bulkCarb);
    }

  localStorage.setItem("calories", calories);
  localStorage.setItem("protein", protein);
  localStorage.setItem("fat", fat);
  localStorage.setItem("carbs", carbs);
  localStorage.setItem("fiber", fiber);
  localStorage.setItem("water", water);
  localStorage.setItem("steps", steps);
  localStorage.setItem("deficitGoal", deficitGoal);
  localStorage.setItem("proteinGoal", proteinGoal);
  localStorage.setItem("checklist", JSON.stringify(checklist));
  localStorage.setItem("foodLog", JSON.stringify(foodLog));
  localStorage.setItem("workoutLog", JSON.stringify(workoutLog));
  localStorage.setItem("weightLog", JSON.stringify(weightLog));
    localStorage.setItem("fatGoal", fatGoal);
    localStorage.setItem("carbGoal", carbGoal);
    localStorage.setItem("mode", mode);
    localStorage.setItem("cutDeficit", String(cutDeficit));
    localStorage.setItem("bulkSurplus", String(bulkSurplus));
    localStorage.setItem("cutProtein", String(cutProtein));
    localStorage.setItem("cutFat", String(cutFat));
    localStorage.setItem("cutCarb", String(cutCarb));
    localStorage.setItem("maintProtein", String(maintProtein));
    localStorage.setItem("maintFat", String(maintFat));
    localStorage.setItem("maintCarb", String(maintCarb));
    localStorage.setItem("bulkProtein", String(bulkProtein));
    localStorage.setItem("bulkFat", String(bulkFat));
    localStorage.setItem("bulkCarb", String(bulkCarb));
}, [calories, protein, fat, carbs, fiber, water, steps, deficitGoal, proteinGoal, checklist, foodLog, workoutLog, fatGoal, carbGoal, mode, checklist, foodLog, workoutLog, weightLog]);


  // 🛠️ Whenever mode changes, override the home-page goals
  useEffect(() => {
    if (mode === "Cut") {
      setProteinGoal(cutProtein);
      setFatGoal(cutFat);
      setCarbGoal(cutCarb);
    } else if (mode === "Maintenance") {
      setProteinGoal(maintProtein);
      setFatGoal(maintFat);
      setCarbGoal(maintCarb);
    } else {
      setProteinGoal(bulkProtein);
      setFatGoal(bulkFat);
      setCarbGoal(bulkCarb);
    }

    /* numeric defaults removed; user settings apply */
  }, [mode]);

  const resetDay = () => {
  const confirmReset = window.confirm("Are you sure?");
  if (!confirmReset) return;

  setCalories(0);
  setProtein(0);
  setFat(0);
  setCarbs(0);
  setFiber(0);
  setWater(0);
  setSteps(0);
  setFoodLog([]);
  setWorkoutLog({});
  setChecklist({ supplements: false, sunlight: false, concentrace: false, teffilin: false});

  // Optional: clear localStorage for those too
  localStorage.removeItem("calories");
  localStorage.removeItem("protein");
  localStorage.removeItem("steps");
  localStorage.removeItem("fat");
  localStorage.removeItem("carbs");
  localStorage.removeItem("fiber");
  localStorage.removeItem("water");
  localStorage.removeItem("foodLog");
  localStorage.removeItem("workoutLog");
  localStorage.removeItem("checklist");
};

  // ❗️Do NOT remove "weightLog" – it stays

const logWorkout = (type, reps) => {
  let burn;
  if (type === "Plank") {
    burn = Math.round(reps * 0.04); // ~2.4 cal/min
  } else {
    burn = Math.round(workouts[type] * reps);
  }

  setWorkoutLog(prev => {
    const updated = { ...prev };
    updated[type] = (updated[type] || 0) + reps;
    return updated;
  });

  if (type === "Steps") {
  setSteps(prev => prev + reps);
}

  if (type === "Run") {
    const runSteps = Math.round(reps * 1100);
    setSteps(prev => prev + runSteps);
  }
};


  const deleteWorkout = (type) => {
  const reps = workoutLog[type];

  // Calculate burn (optional – only needed if displayed or used elsewhere)
  const burn =
  type === "Run"
    ? Math.round(reps * 65)
    : type === "Steps"
    ? Math.round(reps * 0.035)
    : type === "Plank"
    ? Math.round(reps * 0.04)
    : Math.round(reps * workouts[type]);

  // ✅ Fix step count reversals
  if (type === "Steps") {
  const stepCount = workoutLog["Steps"]?.reps || 0;
  setSteps(prev => Math.max(0, prev - stepCount));
}

if (type === "Run") {
  const stepCount = workoutLog["Run"]?.stepsAdded || 0;
  setSteps(prev => Math.max(0, prev - stepCount));
}

  if (type === "Treadmill" && reps?.steps) {
  setSteps(prev => Math.max(0, prev - reps.steps));
}

  setWorkoutLog((prev) => {
    const updated = { ...prev };
    delete updated[type];
    return updated;
  });
};


  const addFood = (food) => {
  const completeFood = {
    name: food.name || "Unnamed",
    cal: parseInt(food.cal) || 0,
    prot: parseInt(food.prot) || 0,
    fat: parseFloat(food.fat) || 0,
    carbs: parseFloat(food.carbs) || 0,
    fiber: parseFloat(food.fiber) || 0,
    water: parseInt(food.water) || 0, // 👈 Add this line
    time: food.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  if (!completeFood.name || isNaN(completeFood.cal) || isNaN(completeFood.prot)) {
    console.error("Invalid food entry:", food);
    return;
  }

  setFoodLog(prev => [...prev, completeFood]);
  setCalories(prev => prev + completeFood.cal);
  setProtein(prev => prev + completeFood.prot);
  setFat(prev => prev + completeFood.fat);
  setCarbs(prev => prev + completeFood.carbs);
  setFiber(prev => prev + completeFood.fiber);
  if (completeFood.water > 0) {
    setWater(prev => prev + completeFood.water); // ✅ This syncs water log to homepage
  }
};
  
const deleteFood = (index) => {
  const item = foodLog[index];
  if (!item) return;

  setFoodLog(prev => prev.filter((_, i) => i !== index));
  setCalories(prev => prev - (item.cal || 0));
  setProtein(prev => prev - (item.prot || 0));
  setFat(prev => prev - (item.fat || 0));
  setCarbs(prev => prev - (item.carbs || 0));
  setFiber(prev => prev - (item.fiber || 0));
  setWater(prev => prev - (item.water || 0)); // ✅ ADDED
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
  <button onClick={() => setScreen("home")} style={navBtnStyle}>⬅️ Home</button>
);

const inputStyleFull = {
  flex: "1 1 100%",
  maxWidth: "100%",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const inputStyleThird = {
  flex: "1 1 calc(33.333% - 12px)",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

  // ---------- Progress bar component ----------
  
  // ---------- Progress bar component ----------
  
  // ---------- Progress bar component ----------
  const Progress = ({ label, value, goal, suffix = "", dangerWhenOver = false, successWhenMet = false }) => {
    const safeGoal = goal > 0 ? goal : 1;
    const pctRaw = (value / safeGoal) * 100;
    const pct = Math.max(0, Math.min(100, pctRaw)); // cap at 100%
    const isOver = value > safeGoal;
    const isMet = value >= safeGoal;

    let fillStyle;
    if (dangerWhenOver && isOver) {
      fillStyle = { background: "#ff4d4f" }; // red
    } else if (successWhenMet && isMet) {
      fillStyle = { background: "#22c55e" }; // green
    } else {
      fillStyle = { background: "linear-gradient(90deg,#2b76ff,#6aa7ff)" }; // blue
    }

    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
          <span><strong>{label}</strong></span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {Math.round(value * 10) / 10}{suffix} / {Math.round(safeGoal * 10) / 10}{suffix}
          </span>
        </div>
        <div style={{ height: 18, background: "#eef1f5", borderRadius: 999, overflow: "hidden" }}>
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: 999,
              transition: "width .25s ease",
              ...fillStyle
            }}
          />
        </div>
      </div>
    );
  };
  // --------------------------------------------


if (screen === "food") {
  return (
    <>
      <div style={{
        position:        "fixed",
        top:             0,
        left:            0,
        right:           0,
        height:          "56px",
        backgroundColor: "#fff",
        borderBottom:    "1px solid #ddd",
        boxShadow:       "0 1px 4px rgba(0,0,0,0.1)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        zIndex:          100
      }}>
        <button onClick={() => setScreen("home")} style={{
          border:     "none",
          background: "transparent",
          fontSize:   "18px",
          cursor:     "pointer"
        }}>
          🏠 Home
        </button>
      {/* Toast */}
      {toastMsg && (
        <div style={{ position:"fixed", bottom:"72px", left:0, right:0, display:"flex", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#333", color:"#fff", padding:"8px 12px", borderRadius:"999px", fontSize:"14px", boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
            {toastMsg}
          </div>
        </div>
      )}
      </div>

      <div style={{
        padding:       "24px",
        paddingTop:    "58px",
        paddingBottom: "80px",
        fontFamily:    "Inter, Arial, sans-serif",
        maxWidth:      "500px",
        margin:        "auto"
      }}>
        <h1 style={{
          fontSize:    "24px",
          fontWeight:  "bold",
          textAlign:   "center",
          marginBottom:"16px"
        }}>
          🍽️ Food Log
        </h1>

        {/* ← the rest of your Food UI goes here unchanged */}

      <div style={{ marginBottom: "20px" }}>
{/* 👇 search filter input */}
<div
  style={{
    display:       "flex",
    alignItems:    "center",
    justifyContent:"center",
    marginBottom:  "12px",
  }}
>
  <div
    style={{
      position: "relative",
      width:    "85%",
      maxWidth: "400px"  // optional cap on how wide it grows
    }}
  >
    <input
      type="text"
      placeholder="🔍 Search foods…"
      value={foodSearch}
      onChange={e => setFoodSearch(e.target.value)}
      style={{
        width:        "100%",
        padding:      "10px 32px 10px 10px",
        fontSize:     "16px",
        borderRadius: "8px",
        border:       "1px solid #ccc",
        boxSizing:    "border-box",
      }}
    />
    <button
      onClick={() => setFoodSearch("")}
      style={{
        position:     "absolute",
        right:        "10px",
        top:          "50%",
        transform:    "translateY(-50%)",
        border:       "none",
        background:   "transparent",
        fontSize:     "16px",
        cursor:       "pointer",
      }}
    >
      ✖
    </button>
  </div>
</div>

        {/* Live search results (instant pick) */}
        {foodSearch && foodSearch.length >= 2 && (
          <div style={{ background:"#fff", border:"1px solid #ddd", borderRadius:"8px", margin:"8px 0", overflow:"hidden" }}>
            {foodOptions.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase())).slice(0,8).map((f, idx) => (
              <button key={idx} onClick={() => { addFood({ ...f, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }); setFoodSearch(""); }}
                style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 12px", border:"none", background:"white", cursor:"pointer" }}>
                {f.name}
              </button>
            ))}
            {foodOptions.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase())).length === 0 && (
              <div style={{ padding:"10px 12px", color:"#666" }}>No matches</div>
            )}
          </div>
        )}

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
{foodOptions
.filter(f =>
f.name.toLowerCase().includes(foodSearch.toLowerCase())
)
.map((f, i) => (
<option key={i} value={JSON.stringify(f)}>
{f.name}
</option>
))
}
        </select>
      </div>

     <div style={{ marginBottom: "24px" }}>
    {/* six inputs in a 3×2 grid, each 80% wide */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "8px",
      marginBottom: "12px",
      justifyItems: "center",
    }}
  >
    <input
      placeholder="Custom food"
      value={customFood.name}
      onChange={e => setCustomFood({ ...customFood, name: e.target.value })}
      style={{
        padding: "12px",
        width: "80%",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
    <input
      placeholder="Calories"
      type="text" inputMode="decimal"
      value={customFood.cal}
      onChange={e => setCustomFood({ ...customFood, cal: e.target.value })}
      style={{
        padding: "12px",
        width: "80%",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
    <input
      placeholder="Protein"
      type="text" inputMode="decimal"
      value={customFood.prot}
      onChange={e => setCustomFood({ ...customFood, prot: e.target.value })}
      style={{
        padding: "12px",
        width: "80%",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
    <input
      placeholder="Fat"
      type="text" inputMode="decimal"
      value={customFood.fat}
      onChange={e => setCustomFood({ ...customFood, fat: e.target.value })}
      style={{
        padding: "12px",
        width: "80%",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
    <input
      placeholder="Carbs"
      type="text" inputMode="decimal"
      value={customFood.carbs}
      onChange={e => setCustomFood({ ...customFood, carbs: e.target.value })}
      style={{
        padding: "12px",
        width: "80%",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
    <input
      placeholder="Fiber"
      type="text" inputMode="decimal"
      value={customFood.fiber}
      onChange={e => setCustomFood({ ...customFood, fiber: e.target.value })}
      style={{
        padding: "12px",
        width: "80%",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  </div>

        <button
          onClick={() => {
  const { name, cal, prot, fat, carbs, fiber } = customFood;

  const parsedCal = parseInt(cal);
  const parsedProt = parseInt(prot);
  const parsedFat = fat !== "" && !isNaN(parseFloat(fat)) ? parseFloat(fat) : undefined;
  const parsedCarbs = carbs !== "" && !isNaN(parseFloat(carbs)) ? parseFloat(carbs) : undefined;
  const parsedFiber = fiber !== "" && !isNaN(parseFloat(fiber)) ? parseFloat(fiber) : undefined;

  if (name && !isNaN(parsedCal) && !isNaN(parsedProt)) {
    setCalories(c => c + parsedCal);
    setProtein(p => p + parsedProt);
    if (parsedFat !== undefined) setFat(f => f + parsedFat);
    if (parsedCarbs !== undefined) setCarbs(c => c + parsedCarbs);
    if (parsedFiber !== undefined) setFiber(f => f + parsedFiber);

    setFoodLog(f => [
      ...f,
      {
        name,
        cal: parsedCal,
        prot: parsedProt,
        ...(parsedFat !== undefined && { fat: parsedFat }),
        ...(parsedCarbs !== undefined && { carbs: parsedCarbs }),
        ...(parsedFiber !== undefined && { fiber: parsedFiber }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setCustomFood({
      name: "",
      cal: "",
      prot: "",
      fat: "",
      carbs: "",
      fiber: ""
    });
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
      <ul style={{ listStyle: "none", padding: 0 }}>
  {foodLog.map((f, i) => (
    <li key={i} style={{ fontSize: "16px", marginBottom: "6px" }}>
      {f.time && <strong style={{ marginRight: "6px", color: "#888" }}>{f.time}</strong>}
      {f.name} — {f.cal} cal, {f.prot}g protein
      {f.fat ? `, ${f.fat}g fat` : ""}
      {f.carbs ? `, ${f.carbs}g carbs` : ""}
      {f.fiber ? `, ${f.fiber}g fiber` : ""}
      <button onClick={() => deleteFood(i)} style={{ marginLeft: "8px" }}>❌</button>
    </li>
  ))}
</ul>
    
<div style={{
  marginTop:     "24px",
  backgroundColor:"#f1f1f1",
  padding:       "12px 16px",
  borderRadius:  "10px",
  display:       "flex",
  flexDirection: "column",
  gap:           "8px",
  fontSize:      "16px",
  fontWeight:    "600",
  color:         "#333"
}}>
  <div style={{
    textAlign: "center",
    fontSize:  "20px",
    fontWeight:"700"
  }}>
    Calories: {calories} cal
  </div>

  <div style={{
    display:        "flex",
    justifyContent: "space-between"
  }}>
    <div>Protein: {Math.round(protein * 10) / 10} g</div>
    <div>Carbs:   {Math.round(carbs   * 10) / 10} g</div>
  </div>

  <div style={{
    display:        "flex",
    justifyContent: "space-between"
  }}>
    <div>Fat:   {Math.round(fat   * 10) / 10} g</div>
    <div>Fiber: {Math.round(fiber * 10) / 10} g</div>
  </div>
</div>
      
</div>
{/* — Fixed Bottom Tab Bar — */}
        <div style={{
          position:     "fixed",
          bottom:       0,
          left:         0,
          right:        0,
          display:      "flex",
          height:       "56px",
          backgroundColor: "#fff",
          borderTop:    "1px solid #ddd",
          boxShadow:    "0 -1px 4px rgba(0,0,0,0.1)"
        }}>
          <button onClick={() => setScreen("food")}     style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>🍽️ Food</button>
          <button onClick={() => setScreen("workouts")} style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>🏋️ Workouts</button>
          <button onClick={() => setScreen("weight")}   style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>⚖️ Weight</button>
        </div>
      </>
    );
  }

  if (screen === "workouts") {
  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "56px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100
      }}>
        <button onClick={() => setScreen("home")} style={{
          border:     "none",
          background: "transparent",
          fontSize:   "18px",
          cursor:     "pointer"
        }}>
          🏠 Home
        </button>
      </div>

      <div style={{
        padding:       "24px",
        paddingTop:    "58px",
        paddingBottom: "80px",
        fontFamily:    "Inter, Arial, sans-serif",
        maxWidth:      "500px",
        margin:        "auto"
      }}>
        <h1 style={{
          fontSize:    "24px",
          fontWeight:  "bold",
          textAlign:   "center",
          marginBottom:"12px"
        }}>
          🏋️ Workouts
        </h1>
      {/* ====== STANDARD STRENGTH ROWS (unchanged behavior) ====== */}
      {[
        ["Core Pull", "Reps"],
        ["Biceps", "Reps"],
        ["Triceps", "Reps"],
        ["Push-ups", "Reps"],
        ["Plank", "Seconds"]
      ].map(([type, ph], i) => (
        <div key={`std-${i}`} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <label style={{ width: "100px", fontSize: "16px" }}>{type}</label>
          <input
            type="text" inputMode="decimal"
            placeholder={ph}
            value={customWorkout[type] || ""}
            onChange={(e) => setCustomWorkout({ ...customWorkout, [type]: e.target.value })}
            style={{ width: "100px", padding: "8px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <button
            onClick={() => {
              const v = parseFloat(customWorkout[type]);
              if (!isNaN(v)) {
                setWorkoutLog(prev => ({ ...prev, [type]: (prev[type] || 0) + v }));
                setCustomWorkout({ ...customWorkout, [type]: "" });
              }
            }}
            style={{ padding: "8px 12px", fontSize: "16px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "8px" }}
          >
            Add
          </button>
        </div>
      ))}

      {/* ====== ORDER AFTER PLANK: BIKE, SWIM, RUN, TREADMILL, STEPS ====== */}

      {/* Bike (km) */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <label style={{ width: "100px", fontSize: "16px" }}>Bike</label>
        <input
          type="text" inputMode="decimal" placeholder="Kilometers"
          value={customWorkout.Bike || ""}
          onChange={(e) => setCustomWorkout({ ...customWorkout, Bike: e.target.value })}
          style={{ width: "100px", padding: "8px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          onClick={() => {
            const km = parseFloat(customWorkout.Bike);
            if (!isNaN(km)) {
              const cal = Math.round(km * 15);
              setWorkoutLog(prev => ({ ...prev, Bike: { reps: (prev.Bike?.reps || 0) + km, cal: (prev.Bike?.cal || 0) + cal } }));
              setCustomWorkout({ ...customWorkout, Bike: "" });
            }
          }}
          style={{ padding: "8px 12px", fontSize: "16px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "8px" }}
        >
          Add
        </button>
      </div>

      {/* Swim (laps) */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <label style={{ width: "100px", fontSize: "16px" }}>Swim</label>
        <input
          type="number" inputMode="numeric" min="0" placeholder="Laps"
          value={customWorkout.Swim || ""}
          onChange={(e) => setCustomWorkout({ ...customWorkout, Swim: e.target.value })}
          style={{ width: "100px", padding: "8px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          onClick={() => {
            const laps = parseInt(customWorkout.Swim);
            if (!isNaN(laps)) {
              setWorkoutLog(prev => ({ ...prev, Swim: (prev.Swim || 0) + laps }));
              setCustomWorkout({ ...customWorkout, Swim: "" });
            }
          }}
          style={{ padding: "8px 12px", fontSize: "16px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "8px" }}
        >
          Add
        </button>
      </div>

      {/* Run (km) */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <label style={{ width: "100px", fontSize: "16px" }}>Run</label>
        <input
          type="text" inputMode="decimal" placeholder="Kilometers"
          value={customWorkout.Run || ""}
          onChange={(e) => setCustomWorkout({ ...customWorkout, Run: e.target.value })}
          style={{ width: "100px", padding: "8px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          onClick={() => {
            const km = parseFloat(customWorkout.Run);
            if (!isNaN(km)) {
              const cal = Math.round(km * 60);
              const runSteps = Math.round(km * 1100);
              setSteps(prev => prev + runSteps);
              setWorkoutLog(prev => ({
                ...prev,
                Run: {
                  reps: (prev.Run?.reps || 0) + km,
                  cal: (prev.Run?.cal || 0) + cal,
                  stepsAdded: (prev.Run?.stepsAdded || 0) + runSteps
                }
              }));
              setCustomWorkout({ ...customWorkout, Run: "" });
            }
          }}
          style={{ padding: "8px 12px", fontSize: "16px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "8px" }}
        >
          Add
        </button>
      </div>

      {/* Treadmill (Cal + KM) — fixed 100px middle column, no overlap */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <label style={{ width: "100px", fontSize: "16px" }}>Treadmill</label>
        <div style={{ width: "140px", display: "flex", gap: "4px" }}>
          <input
            type="number" inputMode="numeric" min="0" placeholder="Cal"
            value={customWorkout.treadCal || ""}
            onChange={(e) => setCustomWorkout({ ...customWorkout, treadCal: e.target.value })}
            style={{ flex: "1 1 0", minWidth: 0, padding: "8px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="text" inputMode="decimal" placeholder="KM"
            value={customWorkout.treadKm || ""}
            onChange={(e) => setCustomWorkout({ ...customWorkout, treadKm: e.target.value })}
            style={{ flex: "1 1 0", minWidth: 0, padding: "8px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
        </div>
        <button
          onClick={() => {
            const cal = parseInt(customWorkout.treadCal);
            const km  = parseFloat(customWorkout.treadKm);
            if (!isNaN(cal) && !isNaN(km)) {
              const estimatedSteps = Math.round(km * 1250);
              setSteps(prev => prev + estimatedSteps);
              setWorkoutLog(prev => ({
                ...prev,
                Treadmill: {
                  cal:   (prev.Treadmill?.cal   || 0) + cal,
                  steps: (prev.Treadmill?.steps || 0) + estimatedSteps
                }
              }));
              setCustomWorkout({ ...customWorkout, treadCal: "", treadKm: "" });
            }
          }}
          style={{ padding: "8px 12px", fontSize: "16px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "8px" }}
        >
          Add
        </button>
      </div>

      {/* Steps with compact Med/Fast/Slow cycler kept BETWEEN label and input */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <div style={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "16px" }}>Steps</span>
          <button
            onClick={cycleStepIntensity}
            aria-label="Cycle steps intensity"
            style={{ minWidth: "44px", padding: "6px 8px", fontSize: "12px", borderRadius: "999px", border: "1px solid #ccc", background: "#f7f7f7" }}
          >
            {stepIntensity}
          </button>
        </div>
        <input
          type="number" inputMode="numeric" min="0" placeholder="Steps"
          value={customWorkout.Steps || ""}
          onChange={(e) => setCustomWorkout({ ...customWorkout, Steps: e.target.value })}
          style={{ width: "100px", padding: "8px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          onClick={() => {
            const stepsVal = parseInt(customWorkout.Steps);
            if (!isNaN(stepsVal)) {
              const perStep = STEP_FACTORS[stepIntensity] ?? 0.039;
              const cals = Math.round(stepsVal * perStep);
              setSteps(prev => {
                const newSteps = prev + stepsVal;
                localStorage.setItem("steps", String(newSteps));
                return newSteps;
              });
              setWorkoutLog(prev => ({
                ...prev,
                Steps: {
                  reps: (prev.Steps?.reps || 0) + stepsVal,
                  cal:  (prev.Steps?.cal  || 0) + cals
                }
              }));
              setCustomWorkout({ ...customWorkout, Steps: "" });
            }
          }}
          style={{ padding: "8px 12px", fontSize: "16px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "8px" }}
        >
          Add
        </button>
      </div>
        <>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginTop: "24px", marginBottom: "12px" }}>
            Logged Workouts
          </h2>
          <ul style={{ paddingLeft: "16px", marginBottom: "16px" }}>
            {Object.entries(workoutLog).map(([type, value], i) => {
              let display = "";

              // Object-type entries (Run, Steps, Bike, Treadmill…)
              if (typeof value === "object" && value !== null) {
                const reps = value.reps ?? 0;
                const cal = value.cal ?? 0;
                const steps = value.stepsAdded ?? value.steps ?? 0;
                if (type === "Treadmill") {
                  display = `${cal} cal, ${steps} steps`;
                } else if (type === "Run") {
                  display = `${reps} km – ${cal} cal, ${steps} steps`;
                } else if (type === "Steps") {
                  display = `${reps} steps – ${cal} cal`;
                } else if (type === "Bike") {
                  display = `${reps} km – ${cal} cal`;
                } else {
                  display = `${reps} reps – ${cal} cal`;
                }

              // Number-type entries (Swim, Plank, or other reps)
              } else if (type === "Swim") {
                const laps = value;
                const cal = Math.round(laps * 7);
                display = `${laps} laps – ${cal} cal`;
              } else if (type === "Plank") {
                const cal = Math.round(value * 0.04);
                display = `${value} sec – ${cal} cal`;
              } else if (workouts[type]) {
                const cal = Math.round(value * workouts[type]);
                display = `${value} reps – ${cal} cal`;
              } else {
                display = `${value} reps – ${Math.round(value * (workouts[type] || 1))} cal`;
              }

              return (
                <li key={i} style={{ fontSize: "16px", marginBottom: "6px" }}>
                  {type}: {display}
                  <button onClick={() => deleteWorkout(type)} style={{ marginLeft: "8px" }}>
                    ❌
                  </button>
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
                if (typeof value === "object" && value !== null && typeof value.cal === "number") {
                  return sum + value.cal;
                }
                if (type === "Swim") return sum + Math.round(value * 7);
                if (type === "Plank") return sum + Math.round(value * 0.04);
                if (workouts[type]) return sum + Math.round(value * workouts[type]);
                return sum;
              }, 0)
            } cal
          </div>
        </>

    </div>
 {/* — Fixed Bottom Tab Bar — */}
        <div style={{
          position:     "fixed",
          bottom:       0,
          left:         0,
          right:        0,
          display:      "flex",
          height:       "56px",
          backgroundColor: "#fff",
          borderTop:    "1px solid #ddd",
          boxShadow:    "0 -1px 4px rgba(0,0,0,0.1)"
        }}>
          <button onClick={() => setScreen("food")}     style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>🍽️ Food</button>
          <button onClick={() => setScreen("workouts")} style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>🏋️ Workouts</button>
          <button onClick={() => setScreen("weight")}   style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>⚖️ Weight</button>
        </div>
      </>
    );
  }

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

  return (
    <>
      <div style={{
        position:        "fixed",
        top:             0,
        left:            0,
        right:           0,
        height:          "56px",
        backgroundColor: "#fff",
        borderBottom:    "1px solid #ddd",
        boxShadow:       "0 1px 4px rgba(0,0,0,0.1)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        zIndex:          100
      }}>
        <button onClick={() => setScreen("home")} style={{
          border:     "none",
          background: "transparent",
          fontSize:   "18px",
          cursor:     "pointer"
        }}>
          🏠 Home
        </button>
      </div>

      <div style={{
        padding:       "24px",
        paddingTop:    "58px",
        paddingBottom: "80px",
        fontFamily:    "Inter, Arial, sans-serif",
        maxWidth:      "500px",
        margin:        "auto"
      }}>
        <h1 style={{
          fontSize:    "24px",
          fontWeight:  "bold",
          textAlign:   "center",
          marginBottom:"12px"
        }}>
          ⚖️ Weight Tracker
        </h1>

        {/* Latest weight */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>
            {latestWeight} lb
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>
            {latestDate}
          </div>
        </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input type="text" inputMode="decimal"
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
      </div>

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
        </div>
      )}

      {/* History */}
      <ul style={{ paddingLeft: "16px" }}>
        {weightLog.map((w, i) => (
          <li key={i} style={{ fontSize: "16px", marginBottom: "6px" }}>
            {w.date}: {w.weight} lbs{" "}
            <button onClick={() => deleteWeight(i)} style={{ marginLeft: "8px" }}>❌</button>
          </li>
        ))}
    </ul>
  </div>
 {/* — Fixed Bottom Tab Bar — */}
        <div style={{
          position:     "fixed",
          bottom:       0,
          left:         0,
          right:        0,
          display:      "flex",
          height:       "56px",
          backgroundColor: "#fff",
          borderTop:    "1px solid #ddd",
          boxShadow:    "0 -1px 4px rgba(0,0,0,0.1)"
        }}>
          <button onClick={() => setScreen("food")}     style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>🍽️ Food</button>
          <button onClick={() => setScreen("workouts")} style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>🏋️ Workouts</button>
          <button onClick={() => setScreen("weight")}   style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>⚖️ Weight</button>
        </div>
      </>
    );
  }


  if (screen === "modeSettings") {
    return (
      <>
        <div style={{position:"fixed", top:0, left:0, right:0, height:"56px", backgroundColor:"#fff",
                     borderBottom:"1px solid #ddd", boxShadow:"0 1px 4px rgba(0,0,0,0.1)",
                     display:"flex", alignItems:"center", justifyContent:"center", zIndex:100}}>
          <button onClick={() => setScreen("home")} style={{ border:"none", background:"transparent", fontSize:"18px", cursor:"pointer"}}>
            🏠 Home
          </button>
        </div>

        <div style={{ padding:"24px", paddingTop:"58px", paddingBottom:"80px", fontFamily:"Inter, Arial, sans-serif", maxWidth:"500px", margin:"auto"}}>
          <h1 style={{ fontSize:"24px", fontWeight:"bold", textAlign:"center", marginBottom:"16px"}}>⚙️ Mode Settings</h1>

          <div style={{ background:"#f9f9f9", borderRadius:"12px", padding:"16px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            <label style={{ display:"block", marginBottom:"12px", fontSize:"16px" }}>
              Cut deficit (calories):
              <input
                type="number" inputMode="numeric" min="0"
                min="0"
                value={cutDeficit}
                onChange={(e) => setCutDeficit(Math.max(0, parseInt(e.target.value || "0")))}
                style={{ width:"110px", padding:"10px", fontSize:"14px", borderRadius:"8px", border:"1px solid #ccc", marginTop:"6px" }}
              />
            </label>

            <label style={{ display:"block", marginBottom:"12px", fontSize:"16px" }}>
              Bulk surplus (calories):
              <input
                type="number" inputMode="numeric" min="0"
                min="0"
                value={bulkSurplus}
                onChange={(e) => setBulkSurplus(Math.max(0, parseInt(e.target.value || "0")))}
                style={{ width:"110px", padding:"10px", fontSize:"14px", borderRadius:"8px", border:"1px solid #ccc", marginTop:"6px" }}
              />
            </label>

            <div style={{ display:"flex", gap:"8px" }}>
              <button
                onClick={() => { 
                  localStorage.setItem("cutDeficit", String(cutDeficit));
                  localStorage.setItem("bulkSurplus", String(bulkSurplus));
                  localStorage.setItem("cutProtein", String(cutProtein));
                  localStorage.setItem("cutFat", String(cutFat));
                  localStorage.setItem("cutCarb", String(cutCarb));
                  localStorage.setItem("maintProtein", String(maintProtein));
                  localStorage.setItem("maintFat", String(maintFat));
                  localStorage.setItem("maintCarb", String(maintCarb));
                  localStorage.setItem("bulkProtein", String(bulkProtein));
                  localStorage.setItem("bulkFat", String(bulkFat));
                  localStorage.setItem("bulkCarb", String(bulkCarb));
                  if (mode === "Cut") { setProteinGoal(cutProtein); setFatGoal(cutFat); setCarbGoal(cutCarb); }
                  else if (mode === "Maintenance") { setProteinGoal(maintProtein); setFatGoal(maintFat); setCarbGoal(maintCarb); }
                  else { setProteinGoal(bulkProtein); setFatGoal(bulkFat); setCarbGoal(bulkCarb); }
                  setScreen("home");
                }}
                style={{ flex:1, padding:"10px 16px", fontSize:"14px", backgroundColor:"#1976d2", color:"#fff", border:"none", borderRadius:"8px" }}
              >
                Save
              </button>
              <button
                onClick={() => { setCutDeficit(500); setBulkSurplus(100); setCutProtein(140); setCutFat(50); setCutCarb(120); setMaintProtein(140); setMaintFat(55); setMaintCarb(160); setBulkProtein(150); setBulkFat(60); setBulkCarb(200); if (mode === "Cut") { setProteinGoal(140); setFatGoal(50); setCarbGoal(120); } else if (mode === "Maintenance") { setProteinGoal(140); setFatGoal(55); setCarbGoal(160); } else { setProteinGoal(150); setFatGoal(60); setCarbGoal(200); } } }
                style={{ flex:1, padding:"10px 16px", fontSize:"16px", backgroundColor:"#eee", color:"#000", border:"none", borderRadius:"8px" }}
              >
                Reset to defaults
              </button>
            </div>
          </div>
        
          <h2 style={{ marginTop:"20px" }}>✂️ Cut Macros</h2>
          <div style={{ display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap", marginTop:"8px" }}>
          <label>Protein (g): <input type="text" inputMode="decimal" value={cutProtein} onChange={e => setCutProtein(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Fat (g): <input type="text" inputMode="decimal" value={cutFat} onChange={e => setCutFat(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Carbs (g): <input type="text" inputMode="decimal" value={cutCarb} onChange={e => setCutCarb(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          </div>

          <h2>🧰 Maintenance Macros</h2>
          <div style={{ display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap", marginTop:"8px" }}>
          <label>Protein (g): <input type="text" inputMode="decimal" value={maintProtein} onChange={e => setMaintProtein(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Fat (g): <input type="text" inputMode="decimal" value={maintFat} onChange={e => setMaintFat(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Carbs (g): <input type="text" inputMode="decimal" value={maintCarb} onChange={e => setMaintCarb(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          </div>

          <h2>🍚 Bulk Macros</h2>
          <div style={{ display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap", marginTop:"8px" }}>
          <label>Protein (g): <input type="text" inputMode="decimal" value={bulkProtein} onChange={e => setBulkProtein(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Fat (g): <input type="text" inputMode="decimal" value={bulkFat} onChange={e => setBulkFat(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Carbs (g): <input type="text" inputMode="decimal" value={bulkCarb} onChange={e => setBulkCarb(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          </div>
        </div>

        {/* — Fixed Bottom Tab Bar — */}
        <div style={{ position:"fixed", bottom:0, left:0, right:0, display:"flex", height:"56px", backgroundColor:"#fff",
                      borderTop:"1px solid #ddd", boxShadow:"0 -1px 4px rgba(0,0,0,0.1)" }}>
          <button onClick={() => setScreen("food")} style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>🍽️ Food</button>
          <button onClick={() => setScreen("workouts")} style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>🏋️ Workouts</button>
          <button onClick={() => setScreen("weight")} style={{ flex:1,border:"none",background:"transparent",fontSize:"16px",cursor:"pointer" }}>⚖️ Weight</button>
        </div>
      </>
    );
  }

   return (
    <>
      <div style={{
        padding: "24px",
        paddingBottom: "80px",            // make room for the tab bar
        fontFamily: "Inter, Arial, sans-serif",
        maxWidth: "500px",
        margin: "auto"
      }}>

    {/* Overview Box */}
<div style={{
backgroundColor: "#f9f9f9",
borderRadius:    "12px",
padding:         "16px",
boxShadow:       "0 1px 4px rgba(0,0,0,0.05)",
marginBottom:    "20px"
}}>
<div style={{
  display:      "flex",
  alignItems:   "center",
  marginBottom: "14px"
}}>
  <h2 style={{
    flex:       1,
    fontSize:   "17px",
    fontWeight: "600",
    margin:     0
  }}>
    📊 Today
  </h2>

  {/* Inline Mode button */}
  <button
    onClick={() => setShowModes(!showModes)}
    style={{
      backgroundColor: "#1976d2",
      color:           "white",
      padding:         "4px 10px",
      fontSize:        "13px",
      border:          "none",
      borderRadius:    "6px",
      marginRight:     "8px"
    }}
  >
    Mode: {mode}
  </button>

  {/* Reset button */}
  <button
    onClick={resetDay}
    style={{
      backgroundColor: "#d32f2f",
      color:           "white",
      padding:         "4px 10px",
      fontSize:        "13px",
      border:          "none",
      borderRadius:    "6px"
    }}
  >
    Reset
  </button>
</div>

    {showModes && (
  <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
    {["Cut","Maintenance","Bulk"].map(m => (
      <button
        key={m}
        onClick={() => { setMode(m); setShowModes(false); }}
        style={{
          padding: "4px 8px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: mode === m ? "#1976d2" : "#eee",
          color: mode === m ? "white" : "#000"
        }}
      >
        {m}
      </button>
    ))}
    <button
      onClick={() => { setShowModes(false); setScreen("modeSettings"); }}
      style={{
        padding: "4px 8px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#eee",
        color: "#000"
      }}
      aria-label="Open mode settings"
      title="Settings"
    >
      ⚙️
    </button>
  </div>
)}

      
      {/* === Progress bars (temp shown above numbers for verification) === */}
      <div style={{ height: "6px" }} />
      <Progress label="Calories" value={calories} goal={caloriesBudget} dangerWhenOver />
      <Progress label="Protein"  value={protein}  goal={proteinGoal} suffix="g" successWhenMet />
      <Progress label="Fat"      value={fat}      goal={fatGoal}     suffix="g" successWhenMet />
      <Progress label="Carbs"    value={carbs}    goal={carbGoal}    suffix="g" successWhenMet />
      <Progress label="Fiber"    value={fiber}    goal={fiberGoal}   suffix="g" successWhenMet />
      <Progress label="Water"    value={waterCount} goal={waterGoal} successWhenMet />
      <Progress label="Steps"    value={steps}    goal={stepGoal} successWhenMet />


    </div>

    {/* Checklist Box */}
    <div style={{
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      marginBottom: "12px"
    }}>
<div style={{
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "0px",
  marginBottom: "0px"
}}>
  <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
    {allChecklistItemsComplete ? "✅" : "☑️"} Checklist
  </h3>
  <button
    onClick={() => setIsChecklistCollapsed(v => !v)}
    style={{
      marginLeft: "auto",
      border: "none",
      background: "transparent",
      color: "inherit",
      fontSize: "16px",
      lineHeight: 1,
      cursor: "pointer",
      padding: 0
    }}
    aria-label={isChecklistCollapsed ? "Expand checklist" : "Collapse checklist"}
    title={isChecklistCollapsed ? "Expand" : "Collapse"}
  >
    {isChecklistCollapsed ? "▶" : "▼"}
  </button>
</div>

{!isChecklistCollapsed && (<div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
  {["concentrace", "teffilin", "sunlight", "supplements"].map((key) => (
    <label key={key} style={{ fontSize: "16px" }}>
      <input
        type="checkbox"
        checked={checklist[key]}
        onChange={() =>
          setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        style={{ marginRight: "10px" }}
      />
      {key === "concentrace"
        ? "Concentrace 💧"
        : key === "teffilin"
        ? "Tefillin ✡️"
        : key === "sunlight"
        ? "Sunlight 🌞"
        : key === "supplements"
        ? "Supplements 💊"
        : key}
    </label>
  ))}
</div>)}
    </div>
    

  </div>
 {/* — Fixed Bottom Tab Bar — */}
      <div style={{
        position:     "fixed",
        bottom:       0,
        left:         0,
        right:        0,
        display:      "flex",
        height:       "56px",
        backgroundColor: "#fff",
        borderTop:    "1px solid #ddd",
        boxShadow:    "0 -1px 4px rgba(0,0,0,0.1)"
      }}>
        <button
          onClick={() => setScreen("food")}
          style={{
            flex:1,
            border:"none",
            background:"transparent",
            fontSize:"16px",
            cursor:"pointer"
          }}
        >
          🍽️ Food
        </button>
        <button
          onClick={() => setScreen("workouts")}
          style={{
            flex:1,
            border:"none",
            background:"transparent",
            fontSize:"16px",
            cursor:"pointer"
          }}
        >
          🏋️ Workouts
        </button>
        <button
          onClick={() => setScreen("weight")}
          style={{
            flex:1,
            border:"none",
            background:"transparent",
            fontSize:"16px",
            cursor:"pointer"
          }}
        >
          ⚖️ Weight
        </button>
      </div>
    </>
  );
}

export default App;
