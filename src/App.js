




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
  // Screen starts on "onboarding" if no saved profile; otherwise "home"
  const [screen, setScreen] = useState(() => {
    try {
      const up = JSON.parse(localStorage.getItem("userProfile") || "null");
      return (up && up.sex && up.heightCm && up.birthDate) ? "home" : "onboarding";
    } catch { return "onboarding"; }
  });
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


  // --- NEW: Workout logging mode (simple vs advanced) ---
  const [workoutMode, setWorkoutMode] = useState(() => {
    const v = localStorage.getItem("workoutMode");
    if (v === "simple" || v === "advanced") return v;
    return "advanced"; // default to detailed (existing) mode
  });
  useEffect(() => { try { localStorage.setItem("workoutMode", workoutMode); } catch {} }, [workoutMode]);
  const [showWorkoutSettings, setShowWorkoutSettings] = useState(false);
const [showModes, setShowModes] = useState(false);

const [fatGoal, setFatGoal] = useState(
  () => parseFloat(localStorage.getItem("fatGoal")) || 50
);
const [carbGoal, setCarbGoal] = useState(
  () => parseFloat(localStorage.getItem("carbGoal")) || 120
);
const [fiberGoal, setFiberGoal] = useState(() => parseFloat(localStorage.getItem("fiberGoal")) || 28);
const waterGoal = 81; // ounces (default ≈3×27oz)
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

  const [cutFiber, setCutFiber] = useState(() => parseFloat(localStorage.getItem('cutFiber')) || 28);
  const [maintFiber, setMaintFiber] = useState(() => parseFloat(localStorage.getItem('maintFiber')) || 28);
  const [bulkFiber, setBulkFiber] = useState(() => parseFloat(localStorage.getItem('bulkFiber')) || 28);


  // checklist state moved to dynamic version above

// === Home Display toggles (persisted) ===
const [displaySettings, setDisplaySettings] = useState(() => {
  try {
    const s = JSON.parse(localStorage.getItem("displaySettings"));
    return s || {
      showCalories: true,
      showProtein:  true,
      showFat:      true,
      showCarbs:    true,
      showFiber:    true,
      showWater:    true,
      showSteps:    true,
      showChecklist:true
    };
  } catch { 
    return {
      showCalories: true, showProtein: true, showFat: true, showCarbs: true,
      showFiber: true, showWater: true, showSteps: true, showChecklist: true
    };
  }
});
useEffect(() => {
  try { localStorage.setItem("displaySettings", JSON.stringify(displaySettings)); } catch {}
}, [displaySettings]);

// === Goals editable in Settings (persisted) ===
const [waterGoalOz, setWaterGoalOz] = useState(() => {
  try { const v = parseFloat(localStorage.getItem("waterGoalOz")); return isNaN(v) ? 81 : v; } catch { return 81; }
});
const [stepsGoalCustom, setStepsGoalCustom] = useState(() => {
  try { const v = parseInt(localStorage.getItem("stepsGoalCustom")); return isNaN(v) ? 10000 : v; } catch { return 10000; }
});
useEffect(() => { try { localStorage.setItem("waterGoalOz", String(waterGoalOz)); } catch {} }, [waterGoalOz]);
useEffect(() => { try { localStorage.setItem("stepsGoalCustom", String(stepsGoalCustom)); } catch {} }, [stepsGoalCustom]);

// derived goals used by Home
const waterGoalEff = Math.max(1, waterGoalOz);
const stepGoalEff  = Math.max(1, stepsGoalCustom);

// === Customizable checklist ===
// names list
const [checklistItems, setChecklistItems] = useState(() => {
  try {
    const a = JSON.parse(localStorage.getItem("checklistItems"));
    return Array.isArray(a) && a.length ? a : ["supplements","sunlight"];
  } catch { return ["supplements","sunlight"]; }
});
// per-item checked state
const [checklist, setChecklist] = useState(() => {
  try {
    const s = JSON.parse(localStorage.getItem("checklist"));
    if (s && typeof s === "object") return s;
  } catch {}
  const obj = {};
  (JSON.parse(localStorage.getItem("checklistItems")) || ["supplements","sunlight"]).forEach(k => obj[k] = false);
  return obj;
});
// persist both
useEffect(() => {
  try {
    localStorage.setItem("checklistItems", JSON.stringify(checklistItems));
    localStorage.setItem("checklist", JSON.stringify(checklist));
  } catch {}
}, [checklistItems, checklist]);
// ensure state stays in sync when items change
useEffect(() => {
  setChecklist(prev => {
    const next = { ...prev };
    // add missing keys
    checklistItems.forEach(k => { if (!(k in next)) next[k] = false; });
    // remove deleted keys
    Object.keys(next).forEach(k => { if (!checklistItems.includes(k)) delete next[k]; });
    return next;
  });
}, [checklistItems]);

// input helper for adding items
const [newChecklistName, setNewChecklistName] = useState("");
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

  // === User Profile (persisted) ===
  const [userProfile, setUserProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("userProfile")); } catch { return null; }
  });
  useEffect(() => {
    if (userProfile) {
      try { localStorage.setItem("userProfile", JSON.stringify(userProfile)); } catch {}
    }
  }, [userProfile]);

  // Settings form state (prefilled when opening settings)
  const [settingsSex, setSettingsSex] = useState("male");
  const [settingsHeight, setSettingsHeight] = useState("");
  const [settingsBirth, setSettingsBirth] = useState("");
  const [settingsWeight, setSettingsWeight] = useState("");

  // Onboarding form state
  const [onbSex, setOnbSex] = useState("male");
  const [onbHeight, setOnbHeight] = useState("");
  const [onbBirth, setOnbBirth] = useState("");
  const [onbWeight, setOnbWeight] = useState("");

  // When switching to settings, hydrate form fields
  useEffect(() => {
    if (screen === "settings") {
      const up = userProfile || {};
      setSettingsSex(up.sex || "male");
      setSettingsHeight(up.heightCm ? String(up.heightCm) : "");
      setSettingsBirth(up.birthDate || "");
      const latest = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : "";
      setSettingsWeight(latest ? String(latest) : "");
    }
  }, [screen, userProfile, weightLog]);


  // --- Effective profile values for BMR (profile or your defaults) ---
  const birthDateEff = (userProfile && userProfile.birthDate) ? new Date(userProfile.birthDate) : birthDate;
  const isMaleEff    = (userProfile && userProfile.sex) ? (userProfile.sex === "male") : isMale;
  const heightCmEff  = (userProfile && parseFloat(userProfile.heightCm)) ? parseFloat(userProfile.heightCm) : heightCm;

  // ▶ compute age
  const today = new Date();
  let age = today.getFullYear() - birthDateEff.getFullYear();
  const m = today.getMonth() - birthDateEff.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDateEff.getDate())) age--;

  // ▶ latest weight (lbs)
  const latestWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : null;

  // ▶ true BMR via Mifflin–St Jeor
  const bmr = latestWeight
    ? Math.round(
        10 * (latestWeight / 2.20462) +  // lbs → kg
        6.25 * heightCmEff -
        5 * age +
        (isMaleEff ? 5 : -161)
      )
    : null;

  // ▶ unified threshold: BMR or fallback 1600
  const calorieThreshold = bmr || 1600;

  const [customFood, setCustomFood] = useState({ name: "", cal: "", prot: "", fat: "", carbs: "", fiber: "" });
  // === Liquids logger state & defs ===
  const [liquidKey, setLiquidKey] = useState("");
  const [liquidUnit, setLiquidUnit] = useState("tbsp");
  const [liquidQty, setLiquidQty] = useState("");

const liquidDefs = {
  almond_butter:      { name: "Almond butter",         perTsp: { cal: 34, prot: 1.2, fat: 3,   carbs: 1.1, fiber: 0.5 }, note: "" },
  almond_milk:        { name: "Almond milk (unsweet)", perTsp: { cal: 2,  prot: 0.1, fat: 0.2, carbs: 0.1, fiber: 0 }, note: "" },
  avocado_oil:        { name: "Avocado oil",           perTsp: { cal: 40, prot: 0,   fat: 4.7, carbs: 0,   fiber: 0 }, note: "" },
  butter:             { name: "Butter",                perTsp: { cal: 34, prot: 0,   fat: 3.8, carbs: 0,   fiber: 0 }, note: "" },
  chicken_broth:      { name: "Chicken broth",         perTsp: { cal: 1.5, prot: 0.2, fat: 0,   carbs: 0.1, fiber: 0 }, note: "" },
  coconut_cream:      { name: "Coconut cream",         perTsp: { cal: 30, prot: 0.3, fat: 3.2, carbs: 0.4, fiber: 0.1 }, note: "" },
  coconut_oil:        { name: "Coconut oil",           perTsp: { cal: 40, prot: 0,   fat: 4.7, carbs: 0,   fiber: 0 }, note: "" },
  heavy_cream:        { name: "Heavy cream",           perTsp: { cal: 17, prot: 0.1, fat: 1.8, carbs: 0.2, fiber: 0 }, note: "" },
  honey:              { name: "Honey",                 perTsp: { cal: 21, prot: 0,   fat: 0,   carbs: 5.7,   fiber: 0 }, note: "" },
  jam:                { name: "Jam",                   perTsp: { cal: 17, prot: 0,   fat: 0,   carbs: 4.4, fiber: 0.1 }, note: "" },
  ketchup:            { name: "Ketchup",               perTsp: { cal: 5,  prot: 0,   fat: 0,   carbs: 1.2, fiber: 0 }, note: "" },
  maple_syrup:        { name: "Maple syrup",           perTsp: { cal: 17, prot: 0,   fat: 0,   carbs: 4.5, fiber: 0 }, note: "" },
  milk:               { name: "Milk (whole)",          perTsp: { cal: 3.1, prot: 0.16, fat: 0.16, carbs: 0.24, fiber: 0 }, note: "" },
  olive_oil:          { name: "Olive oil",             perTsp: { cal: 40, prot: 0,   fat: 4.7, carbs: 0,   fiber: 0 }, note: "" },
  peanut_butter:      { name: "Peanut butter",         perTsp: { cal: 47, prot: 1.3, fat: 2.7, carbs: 1,   fiber: 0.3 }, note: "" },
  pesto:              { name: "Pesto",                 perTsp: { cal: 27, prot: 0.6, fat: 2.7, carbs: 0.6, fiber: 0.1 }, note: "" },
  silan:              { name: "Silan",                 perTsp: { cal: 20, prot: 0,   fat: 0,   carbs: 5,   fiber: 0 }, note: "" },
  soy_sauce:          { name: "Soy sauce",             perTsp: { cal: 3,  prot: 0.5, fat: 0,   carbs: 0.4, fiber: 0 }, note: "" },
  sriracha:           { name: "Sriracha",              perTsp: { cal: 5,  prot: 0,   fat: 0,   carbs: 1,   fiber: 0 }, note: "" },
  techina:            { name: "Techina",               perTsp: { cal: 27, prot: 0.8, fat: 2.4, carbs: 1,   fiber: 0.3 }, note: "" },
  water:              { name: "Water",                 perFlOz: { water: 1 }, note: "" }
};

  // Volume conversion maps
  const tspUnits = {
    "1/2 tsp": 0.5,
    "tsp": 1,
    "1/2 tbsp": 1.5,  // 0.5 tbsp = 1.5 tsp
    "tbsp": 3,
    "1/4 cup": 12,    // 1/4 cup = 4 tbsp = 12 tsp
    "1/2 cup": 24,
    "3/4 cup": 36,
    "1 cup": 48,
    "oz": 6
  };

  const flOzUnits = {
    "tsp": 1/6,       // 1 tsp = 0.1667 fl oz
    "1/2 tsp": 1/12,
    "1/2 tbsp": 0.25, // 0.5 tbsp = 0.25 fl oz
    "tbsp": 0.5,
    "1/4 cup": 2,
    "1/2 cup": 4,
    "3/4 cup": 6,
    "1 cup": 8,
    "oz": 1
  };

  function computeLiquidTotals(key, unit, qtyStr) {
    const qty = Math.max(0, parseFloat(qtyStr || "0"));
    const def = liquidDefs[key];
    if (!def || qty === 0) return { cal:0, prot:0, fat:0, carbs:0, fiber:0, water:0, labelAddon:"" };

    // Water uses fl oz; others use tsp-based mapping
    if (key === "water") {
      const ozEach = flOzUnits[unit] ?? 0;
      const totalOz = ozEach * qty;
      return { cal:0, prot:0, fat:0, carbs:0, fiber:0, water: totalOz, labelAddon: `${totalOz} oz` };
    }

    const tspEach = tspUnits[unit] ?? 0;
    const tspTotal = tspEach * qty;
    const perTsp = def.perTsp;
    return {
      cal:   Math.round((perTsp.cal   || 0) * tspTotal),
      prot:  Math.round((perTsp.prot  || 0) * tspTotal),
      fat: +((perTsp.fat   || 0) * tspTotal).toFixed(1),
      carbs:+((perTsp.carbs || 0) * tspTotal).toFixed(1),
      fiber:+((perTsp.fiber || 0) * tspTotal).toFixed(1),
      water: 0,
      labelAddon: `${tspTotal} tsp`
    };
  }

  function addLiquid() {
    const def = liquidDefs[liquidKey];
    if (!def) return;
    const t = computeLiquidTotals(liquidKey, liquidUnit, liquidQty);
    const prettyName = def.name + " (" + liquidQty + "× " + liquidUnit + ")";
    addFood({ name: prettyName, cal: t.cal, prot: t.prot, fat: t.fat, carbs: t.carbs, fiber: t.fiber, water: t.water });
    setLiquidQty("");
    // toast now handled in addFood
  }

  const [customWorkout, setCustomWorkout] = useState({});
  const [customSteps, setCustomSteps] = useState("");
  const [foodSearch,   setFoodSearch]   = useState("");
  const [weighedKey, setWeighedKey] = useState("");
  const [weighedGrams, setWeighedGrams] = useState("");
const [weighedQuery, setWeighedQuery] = useState("");

const workouts = {
  // Day 1
  "1 - Pull-ups": 1.0,
  "1 - Dips": 0.6,
  "1 - Lunges": 0.8,
  "1 - Push-ups (Opt)": 0.5,
  "1 - Leg Raises (Opt)": 0.3,

  // Day 2
  "2 - Bench Press": 0.6,
  "2 - Incline Press": 0.6,
  "2 - Shoulder Press": 0.6,
  "2 - Triceps": 0.3,
  "2 - Core Pull": 0.5,
  "2 - Dumbbell Lat Raise (Opt)": 0.3,

  // Day 3
  "3 - Barbell Bicep Curl": 0.4,
  "3 - Pull-ups": 1.0,
  "3 - Low Pull": 0.6,
  "3 - Rope Face Pulls": 0.3,
  "3 - Dumbbell Bicep Curl (Opt)": 0.4,

  // Day 4
  "4 - Leg Press": 0.8,
  "4 - Calf Raises": 0.2,
  "4 - Leg Curl": 0.5,
  "4 - Glute Abductor (Opt)": 0.4,
  "4 - Lunges (Opt)": 0.8,

  // Cardio
  "Run": "run",
  "Bike": "bike",
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
  { name: "Blackberries (1)",   cal: 3,  prot: 0.1, fat: 0.0, carbs: 0.7, fiber: 0.4 },
  { name: "Blackberries (3)", cal: 9,  prot: 0.3, fat: 0.1, carbs: 2.0, fiber: 1.1 },
  { name: "Blackberries (5)", cal: 15, prot: 0.5, fat: 0.2, carbs: 3.4, fiber: 1.9 },
  { name: "Blackberries (10)", cal: 30, prot: 1.0, fat: 0.4, carbs: 6.8, fiber: 3.8 },
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
  { name: "Chicken thigh (BBQ, no skin, 50g)",  cal: 100, prot: 13, fat: 4,  carbs: 0, fiber: 0 },
  { name: "Chicken thigh (BBQ, no skin, 100g)", cal: 200, prot: 26, fat: 8,  carbs: 0, fiber: 0 },
  { name: "Chicken thigh (BBQ, no skin, 150g)", cal: 300, prot: 39, fat: 12, carbs: 0, fiber: 0 },
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
  { name: "Ground beef 90/10 (50g raw)", cal: 73, prot: 9.3, fat: 4, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (100g raw)", cal: 145, prot: 18.6, fat: 8, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (150g raw)", cal: 218, prot: 27.9, fat: 12, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (200g raw)", cal: 290, prot: 37.2, fat: 16, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (50g cooked)", cal: 88, prot: 12.5, fat: 4, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (100g cooked)", cal: 176, prot: 25, fat: 8, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (150g cooked)", cal: 264, prot: 37.5, fat: 12, carbs: 0, fiber: 0 },
  { name: "Ground beef 90/10 (200g cooked)", cal: 352, prot: 50, fat: 16, carbs: 0, fiber: 0 },
  { name: "Ground beef 80/20 (50g raw)", cal: 127, prot: 8.5, fat: 10, carbs: 0, fiber: 0 },
  { name: "Ground beef 80/20 (100g raw)", cal: 254, prot: 17, fat: 20, carbs: 0, fiber: 0 },
  { name: "Ground beef 80/20 (150g raw)", cal: 381, prot: 25.5, fat: 30, carbs: 0, fiber: 0 },
  { name: "Ground beef 80/20 (200g raw)", cal: 508, prot: 34, fat: 40, carbs: 0, fiber: 0 },
  { name: "Ground beef 80/20 (50g cooked)", cal: 127, prot: 12.9, fat: 8.5, carbs: 0, fiber: 0 },
  { name: "Ground beef 80/20 (100g cooked)", cal: 254, prot: 25.8, fat: 17, carbs: 0, fiber: 0 },
  { name: "Ground beef 80/20 (150g cooked)", cal: 381, prot: 38.7, fat: 25.5, carbs: 0, fiber: 0 },
  { name: "Ground beef 80/20 (200g cooked)", cal: 508, prot: 51.6, fat: 34, carbs: 0, fiber: 0 },
  { name: "Honey (½ tsp)",  cal: 10.5, prot: 0, fat: 0, carbs: 2.7, fiber: 0 },
  { name: "Honey (1 tsp)",  cal: 21,   prot: 0, fat: 0, carbs: 5.7, fiber: 0 },
  { name: "Honey (½ tbsp)", cal: 32,   prot: 0, fat: 0, carbs: 8.5, fiber: 0 },
  { name: "Honey (1 tbsp)", cal: 64,   prot: 0, fat: 0, carbs: 17,  fiber: 0 },
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
  { name: "Pancakes (½ cup Kodiak)", cal: 220, prot: 14, fat: 2, carbs: 30, fiber: 3 },
  { name: "Pancakes (3 Kodiak)", cal: 190, prot: 14, fat: 2, carbs: 30, fiber: 4 },
  { name: "Parmesan cheese (10g)", cal: 40, prot: 3.2, fat: 3.0, carbs: 0, fiber: 0 },
  { name: "Parmesan cheese (15g)", cal: 60, prot: 4.8, fat: 4.5, carbs: 0, fiber: 0 },
  { name: "Parmesan cheese (20g)", cal: 80, prot: 6.4, fat: 6.0, carbs: 0, fiber: 0 },
  { name: "Parmesan cheese (25g)", cal: 101, prot: 8.0, fat: 7.5, carbs: 0, fiber: 0 },
  { name: "Parmesan cheese (30g)", cal: 121, prot: 9.6, fat: 9.0, carbs: 0, fiber: 0 },
  { name: "Peanut butter (1 tsp)", cal: 47, prot: 2, fat: 4, carbs: 2, fiber: 0.5 },
  { name: "Peanut butter (1 tbsp)", cal: 94, prot: 4, fat: 8, carbs: 3, fiber: 1 },
  { name: "Peanut butter (PBfit 1 tbsp)", cal: 30, prot: 3.5, fat: 1, carbs: 3, fiber: 1 },
  { name: "Peanut butter (PBfit 2 tbsp)", cal: 60, prot: 7, fat: 2, carbs: 6, fiber: 2 },
  { name: "Peas (frozen, 50g)", cal: 37, prot: 3.5, fat: 0.8, carbs: 5.3, fiber: 2.6 },
  { name: "Peas (frozen, 100g)", cal: 73, prot: 6.9, fat: 1.5, carbs: 10.5, fiber: 5.1 },
  { name: "Peas (frozen, 150g)", cal: 110, prot: 10.4, fat: 2.3, carbs: 15.8, fiber: 7.7 },
  { name: "Peas (frozen, 200g)", cal: 146, prot: 13.8, fat: 3.0, carbs: 21.0, fiber: 10.2 },
  { name: "Peas (frozen, 1 cup)", cal: 102, prot: 9.7, fat: 2.1, carbs: 14.7, fiber: 7.1 },
  { name: "Pita (½)",  cal: 138, prot: 4.6, fat: 0.6, carbs: 27.9, fiber: 1.1 },
  { name: "Pita (full)", cal: 275, prot: 9.1, fat: 1.2, carbs: 55.7, fiber: 2.2 },
  { name: "Popcorn (LesserEvil small bag)", cal: 50, prot: 1, fat: 3, carbs: 7, fiber: 2 },
  { name: "Potato (50g)", cal: 43, prot: 1, fat: 0, carbs: 10, fiber: 1 },
  { name: "Potato (100g)", cal: 86, prot: 2, fat: 0, carbs: 20, fiber: 2 },
  { name: "Potato (150g)", cal: 129, prot: 3, fat: 0, carbs: 30, fiber: 3 },
  { name: "Potato (200g)", cal: 172, prot: 4, fat: 0, carbs: 40, fiber: 4 },
  { name: "Protein bar (Promix)", cal: 150, prot: 15, fat: 3, carbs: 17, fiber: 5 },
  { name: "Protein bar (David)", cal: 150, prot: 28, fat: 2.5, carbs: 12, fiber: 1 },
  { name: "Protein bar (Maxx)", cal: 217, prot: 21, fat: 6.8, carbs: 20, fiber: 3.9 },
  { name: "Protein bar (Quest chocolate peanut butter)", cal: 190, prot: 20, fat: 9, carbs: 22, fiber: 11 },
  { name: "Protein bar (Quest cookie dough)", cal: 190, prot: 21, fat: 9, carbs: 21, fiber: 12 },
  { name: "Protein bar (Quest mini cookie dough)", cal: 80, prot: 8, fat: 3.5, carbs: 9, fiber: 5 },
  { name: "Protein chips (Quest)", cal: 140, prot: 20, fat: 4.5, carbs: 4, fiber: 1 },
  { name: "Protein Ice Cream (PBfit Banana 1 vanilla)", cal: 409, prot: 44, fat: 3, carbs: 56, fiber: 5 },
  { name: "Protein Ice Cream (unflavored)", cal: 257, prot: 36, fat: 2.5, carbs: 21, fiber: 0 },
  { name: "Protein Ice Cream (vanilla)", cal: 267, prot: 36, fat: 2.5, carbs: 23.5, fiber: 0 },
  { name: "Protein Ice Cream (strawberries)", cal: 260, prot: 36, fat: 2.5, carbs: 21.25, fiber: 0 },
  { name: "Protein Ice Cream (unflavored USA)", cal: 220, prot: 32, fat: 2.2, carbs: 20, fiber: 0 },
  { name: "Protein scoop (1 Promix Chocolate)", cal: 80, prot: 15.5, fat: 0.75, carbs: 4.5 },
  { name: "Protein scoop (2 Promix Chocolate)", cal: 160, prot: 31, fat: 1.5, carbs: 9 },
  { name: "Protein scoop (1 Promix Unflavored)", cal: 65, prot: 15, fat: 0.25, carbs: 1 },
  { name: "Protein scoop (2 Promix Unflavored)", cal: 130, prot: 30, fat: 0.5, carbs: 2 },
  { name: "Protein scoop (1 Promix Vanilla)", cal: 75, prot: 15, fat: 0.25, carbs: 3.5 },
  { name: "Protein scoop (2 Promix Vanilla)", cal: 150, prot: 30, fat: 0.5, carbs: 7 },
  { name: "Psyllium Husk (1 tsp)", cal: 15, prot: 0, fat: 0, carbs: 4, fiber: 4 },
  { name: "Pumpkin seeds (1 tsp)",    cal: 19, prot: 0.8, fat: 1.6, carbs: 0.4, fiber: 0.1 },
  { name: "Pumpkin seeds (1/2 tbsp)", cal: 29, prot: 1.2, fat: 2.4, carbs: 0.6, fiber: 0.2 },
  { name: "Pumpkin seeds (1 tbsp)",   cal: 57, prot: 2.4, fat: 4.8, carbs: 1.2, fiber: 0.3 },
  { name: "Ribeye steak (50g)", cal: 144, prot: 12.4, fat: 10, carbs: 0, fiber: 0 },
  { name: "Ribeye steak (100g)", cal: 288, prot: 24.8, fat: 20, carbs: 0, fiber: 0 },
  { name: "Ribeye steak (150g)", cal: 432, prot: 37.2, fat: 30, carbs: 0, fiber: 0 },
  { name: "Ribeye steak (200g)", cal: 576, prot: 49.6, fat: 40, carbs: 0, fiber: 0 },
  { name: "Rice (50g cooked)", cal: 65, prot: 1.3, fat: 0.1, carbs: 14, fiber: 0.2 },
  { name: "Rice (100g cooked)", cal: 130, prot: 2.6, fat: 0.2, carbs: 28, fiber: 0.4 },
  { name: "Rice (150g cooked)", cal: 195, prot: 3.9, fat: 0.3, carbs: 42, fiber: 0.6 },
  { name: "Rice (200g cooked)", cal: 260, prot: 5.2, fat: 0.4, carbs: 56, fiber: 0.8 },
  { name: "Salmon (85g wild sockeye pouch)", cal: 100, prot: 17, fat: 3.5, carbs: 0, fiber: 0 },
  { name: "Salmon (50g)", cal: 103, prot: 11, fat: 6.5, carbs: 0, fiber: 0 },
  { name: "Salmon (100g)", cal: 206, prot: 22, fat: 13, carbs: 0, fiber: 0 },
  { name: "Salmon (150g)", cal: 309, prot: 33, fat: 19.5, carbs: 0, fiber: 0 },
  { name: "Salmon (200g)", cal: 412, prot: 44, fat: 26, carbs: 0, fiber: 0 },
  { name: "Salmon Jerky", cal: 80, prot: 7, fat: 4, carbs: 5, fiber: 0 },
  { name: "Soda (Poppi Cola Can)", cal: 25, prot: 0, fat: 0, carbs: 8, fiber: 3 },
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
  { name: "Waffles (2 Kodiak)", cal: 230, prot: 12, fat: 11, carbs: 23, fiber: 3 },
  { name: "Walnut", cal: 26, prot: 0.6, fat: 2.6, carbs: 0.6, fiber: 0.3 },
  { name: "Walnuts (3)", cal: 78, prot: 1.8, fat: 7.8, carbs: 1.8, fiber: 0.9 },
  { name: "Water (27oz)", cal: 0, prot: 0, fat: 0, carbs: 0, fiber: 0, water: 27 },
  { name: "Watermelon triangle", cal: 50, prot: 1, fat: 0.2, carbs: 12, fiber: 0.6 },
  { name: "Wrap (1 Egglife)", cal: 30, prot: 5.5, fat: 0, carbs: 1.5, fiber: 1 },
  { name: "Yogurt 0% (Pro)", cal: 117, prot: 20, fat: 0.3, carbs: 6, fiber: 0 },
  { name: "Yogurt 0% (Fage)", cal: 80, prot: 16, fat: 0, carbs: 5, fiber: 0 },
  { name: "Yogurt 2% (Fage)", cal: 100, prot: 15, fat: 3, carbs: 5, fiber: 0 }
];

// ⚖️ Per-100g macro table for weighed logging (cooked/no-oil where applicable)
const weighedFoods = [
  { key: "avocado", label: "Avocado", per100: { cal: 160, prot: 2, fat: 15, carbs: 8.5, fiber: 6.7 } },
  { key: "chicken_breast_cooked", label: "Chicken breast (cooked)", per100: { cal: 165, prot: 31, fat: 3.6, carbs: 0, fiber: 0 } },
  { key: "chicken_thigh_bbq_ns", label: "Chicken thigh (BBQ, no skin)", per100: { cal: 200, prot: 26, fat: 8, carbs: 0, fiber: 0 } },
  { key: "broccoli_cooked", label: "Broccoli (cooked, no oil)", per100: { cal: 35, prot: 2.4, fat: 0.4, carbs: 7.0, fiber: 3.3 } },
  { key: "carrot_cooked", label: "Carrot (cooked)", per100: { cal: 41, prot: 0.9, fat: 0.2, carbs: 10, fiber: 2.8 } },
  { key: "dates_medjool", label: "Dates (Medjool)", per100: { cal: 277, prot: 1.8, fat: 0.2, carbs: 75, fiber: 6.7 } },
  { key: "fig", label: "Fig", per100: { cal: 74, prot: 0.8, fat: 0.3, carbs: 19.0, fiber: 2.9 } },
  { key: "green_beans_roasted", label: "Green beans (roasted, no oil)", per100: { cal: 38, prot: 2.2, fat: 0.4, carbs: 8, fiber: 3.6 } },
  { key: "rice_cooked", label: "Rice (cooked)", per100: { cal: 130, prot: 2.6, fat: 0.2, carbs: 28, fiber: 0.4 } },
  { key: "ribeye_cooked", label: "Ribeye steak (cooked)", per100: { cal: 288, prot: 24.8, fat: 20, carbs: 0, fiber: 0 } },
  { key: "cottage_5pct", label: "Cottage cheese 5%", per100: { cal: 95, prot: 11, fat: 5, carbs: 1.5, fiber: 0 } },
  { key: "tuna_canned_water", label: "Tuna (canned in water, drained)", per100: { cal: 132, prot: 29, fat: 1, carbs: 0, fiber: 0 } },
  { key: "sweet_potato_cooked", label: "Sweet potato (cooked)", per100: { cal: 86, prot: 2, fat: 0.1, carbs: 20, fiber: 3 } },
  { key: "ground_beef_90_10_raw", label: "Ground beef 90/10 (raw)", per100: { cal: 145, prot: 18.6, fat: 8, carbs: 0, fiber: 0 } },
  { key: "ground_beef_90_10_cooked", label: "Ground beef 90/10 (cooked)", per100: { cal: 176, prot: 25, fat: 8, carbs: 0, fiber: 0 } },
  { key: "ground_beef_80_20_raw", label: "Ground beef 80/20 (raw)", per100: { cal: 254, prot: 17, fat: 20, carbs: 0, fiber: 0 } },
  { key: "ground_beef_80_20_cooked", label: "Ground beef 80/20 (cooked)", per100: { cal: 254, prot: 25.8, fat: 17, carbs: 0, fiber: 0 } },
  { key: "cottage_goodculture_4pct", label: "Cottage cheese Good Culture 4%", per100: { cal: 98, prot: 12, fat: 4, carbs: 3, fiber: 0 } },
  { key: "salmon_cooked", label: "Salmon (cooked)", per100: { cal: 206, prot: 22, fat: 13, carbs: 0, fiber: 0 } },
  { key: "tuna_cooked", label: "Tuna (cooked, not canned)", per100: { cal: 184, prot: 29, fat: 1, carbs: 0, fiber: 0 } },
  { key: "branzino_cooked", label: "Branzino (cooked)", per100: { cal: 143, prot: 20.5, fat: 6.8, carbs: 0, fiber: 0 } },
  { key: "egg_whites", label: "Egg whites", per100: { cal: 52, prot: 11, fat: 0.2, carbs: 0.7, fiber: 0 } },
  { key: "parmesan", label: "Parmesan", per100: { cal: 431, prot: 38, fat: 29, carbs: 4, fiber: 0 } },
  { key: "cheddar", label: "Cheddar", per100: { cal: 402, prot: 25, fat: 33, carbs: 1.3, fiber: 0 } },
  { key: "pecorino_romano", label: "Pecorino Romano", per100: { cal: 387, prot: 32, fat: 26, carbs: 3, fiber: 0 } },
  { key: "oats_dry", label: "Oats (dry)", per100: { cal: 389, prot: 16.9, fat: 6.9, carbs: 66.3, fiber: 10.6 } },
  { key: "oats_bobsredmill", label: "Oats (Bob's Red Mill)", per100: { cal: 375, prot: 10.4, fat: 6.25, carbs: 68.8, fiber: 8.3 } },
  { key: "quinoa_raw", label: "Quinoa (raw)", per100: { cal: 368, prot: 14.1, fat: 6.1, carbs: 64.2, fiber: 7 } },
  { key: "quinoa_cooked", label: "Quinoa (cooked)", per100: { cal: 120, prot: 4.1, fat: 1.9, carbs: 21.3, fiber: 2.8 } },
  { key: "pasta_raw", label: "Pasta (raw)", per100: { cal: 371, prot: 13, fat: 1.5, carbs: 75, fiber: 3.2 } },
  { key: "pasta_cooked", label: "Pasta (cooked)", per100: { cal: 131, prot: 5, fat: 1.1, carbs: 25, fiber: 1.4 } },
  { key: "walnuts", label: "Walnuts", per100: { cal: 654, prot: 15, fat: 65, carbs: 14, fiber: 7 } },
  { key: "cashews", label: "Cashews", per100: { cal: 553, prot: 18, fat: 44, carbs: 30, fiber: 3.3 } },
  { key: "pistachios", label: "Pistachios", per100: { cal: 560, prot: 20, fat: 45, carbs: 28, fiber: 10 } },
  { key: "almonds", label: "Almonds", per100: { cal: 579, prot: 21, fat: 50, carbs: 22, fiber: 12 } },
  { key: "peanut_butter", label: "Peanut butter", per100: { cal: 588, prot: 25, fat: 50, carbs: 20, fiber: 6 } },
  { key: "almond_butter", label: "Almond butter", per100: { cal: 614, prot: 21, fat: 56, carbs: 19, fiber: 7 } },
  { key: "butter", label: "Butter", per100: { cal: 717, prot: 0.9, fat: 81, carbs: 0.1, fiber: 0 } },
  { key: "broccoli_raw", label: "Broccoli (raw)", per100: { cal: 34, prot: 2.8, fat: 0.4, carbs: 6.6, fiber: 2.6 } },
  { key: "cauliflower_cooked", label: "Cauliflower (cooked)", per100: { cal: 23, prot: 1.8, fat: 0.5, carbs: 4.1, fiber: 2.3 } },
  { key: "cauliflower_raw", label: "Cauliflower (raw)", per100: { cal: 25, prot: 1.9, fat: 0.3, carbs: 4.9, fiber: 2 } },
  { key: "green_beans_raw", label: "Green beans (raw)", per100: { cal: 31, prot: 1.8, fat: 0.1, carbs: 7, fiber: 3.4 } },
  { key: "spinach_cooked", label: "Spinach (cooked)", per100: { cal: 23, prot: 3, fat: 0.3, carbs: 3.8, fiber: 2.4 } },
  { key: "spinach_raw", label: "Spinach (raw)", per100: { cal: 23, prot: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2 } },
  { key: "kale", label: "Kale", per100: { cal: 49, prot: 4.3, fat: 0.9, carbs: 8.8, fiber: 3.6 } },
  { key: "carrot_raw", label: "Carrot (raw)", per100: { cal: 41, prot: 0.9, fat: 0.2, carbs: 10, fiber: 2.8 } },
  { key: "cucumber", label: "Cucumber", per100: { cal: 16, prot: 0.7, fat: 0.1, carbs: 3.6, fiber: 0.5 } },
  { key: "tomato_cooked", label: "Tomato (cooked)", per100: { cal: 18, prot: 0.9, fat: 0.2, carbs: 4, fiber: 1.2 } },
  { key: "tomato_raw", label: "Tomato (raw)", per100: { cal: 20, prot: 1, fat: 0.2, carbs: 4, fiber: 1.5 } },
  { key: "strawberries", label: "Strawberries", per100: { cal: 32, prot: 0.7, fat: 0.3, carbs: 7.7, fiber: 2 } },
  { key: "blueberries", label: "Blueberries", per100: { cal: 57, prot: 0.7, fat: 0.3, carbs: 14.5, fiber: 2.4 } },
  { key: "raspberries", label: "Raspberries", per100: { cal: 52, prot: 1.2, fat: 0.7, carbs: 11.9, fiber: 6.5 } },
  { key: "blackberries", label: "Blackberries", per100: { cal: 43, prot: 1.4, fat: 0.5, carbs: 9.6, fiber: 5.3 } },
  { key: "banana", label: "Banana", per100: { cal: 89, prot: 1.1, fat: 0.3, carbs: 23, fiber: 2.6 } },
  { key: "apple", label: "Apple", per100: { cal: 52, prot: 0.3, fat: 0.2, carbs: 14, fiber: 2.4 } },
  { key: "grapes", label: "Grapes", per100: { cal: 69, prot: 0.7, fat: 0.2, carbs: 18, fiber: 0.9 } },
  { key: "mango", label: "Mango", per100: { cal: 60, prot: 0.8, fat: 0.4, carbs: 15, fiber: 1.6 } },
  { key: "pineapple", label: "Pineapple", per100: { cal: 50, prot: 0.5, fat: 0.1, carbs: 13, fiber: 1.4 } },
  { key: "watermelon", label: "Watermelon", per100: { cal: 30, prot: 0.6, fat: 0.2, carbs: 8, fiber: 0.4 } },
  { key: "yogurt_fage0", label: "Yogurt (Fage 0%)", per100: { cal: 53, prot: 10.6, fat: 0, carbs: 2.9, fiber: 0 } },
  { key: "pomegranate", label: "Pomegranate", per100: { cal: 83, prot: 1.7, fat: 1.2, carbs: 18.7, fiber: 4.0 } },
  { key: "hummus", label: "Hummus", per100: { cal: 166, prot: 7.9, fat: 9.6, carbs: 14.3, fiber: 6.0 } },
  { key: "pumpkin_seeds", label: "Pumpkin seeds", per100: { cal: 633, prot: 26.7, fat: 53.3, carbs: 13.3, fiber: 3.3 } },
  { key: "lamb_shoulder_cooked", label: "Lamb shoulder (cooked)", per100: { cal: 276, prot: 25, fat: 20, carbs: 0, fiber: 0 } }
];
// Helper: compute macros from grams using per-100g profile
function computeFromGrams(per100, grams) {
  if (!per100) return { cal:0, prot:0, fat:0, carbs:0, fiber:0, grams:0 };
  const g = Math.max(0, parseFloat(grams) || 0);
  const s = g / 100;
  return {
    cal:   Math.round((per100.cal   || 0) * s),
    prot:  Math.round((per100.prot  || 0) * s), // whole grams to match existing addFood()
    fat: +((per100.fat   || 0) * s).toFixed(1),
    carbs:+((per100.carbs || 0) * s).toFixed(1),
    fiber:+((per100.fiber || 0) * s).toFixed(1),
    grams: g
  };
}




// --- Simple session calories via METs ---
// Intensity: 'low' | 'moderate' | 'vigorous'
// Rest: 'short' | 'normal' | 'long'

function sessionCalories(minutes, intensity, rest, latestWeight) {
  // Conservative NET calories: count only exercise above resting (BMR already handled elsewhere).
  // Lower METs typical for resistance work; subtract 1.0 MET resting; stronger rest deductions.
  const weightKg = latestWeight ? latestWeight / 2.20462 : 70; // safe fallback
  const baseMET = intensity === "vigorous" ? 5.0 : intensity === "moderate" ? 3.5 : 2.5; // conservative
  const netMET  = Math.max(0, baseMET - 1.0); // remove resting component
  const restFactor = rest === "long" ? 0.75 : rest === "short" ? 0.95 : 0.85;
  const mins = Math.max(0, Number(minutes) || 0);
  const kcalPerMin = (netMET * 3.5 * weightKg) / 200;
  const kcal = Math.round(kcalPerMin * mins * restFactor);
  // Soft cap to avoid inflated numbers for typical weights sessions.
  return Math.max(0, Math.min(kcal, 400));
}


function SimpleSession({ addSession, latestWeight }) {
  const [minutes, setMinutes] = React.useState("");
  const [intensity, setIntensity] = React.useState("moderate");
  const [rest, setRest] = React.useState("normal");

  const cal = sessionCalories(parseFloat(minutes || 0), intensity, rest, latestWeight);

  function handleAdd() {
    if (!minutes || parseFloat(minutes) <= 0) return;
    addSession({
      minutes: Math.round(parseFloat(minutes)),
      intensity,
      rest,
      cal
    });
    setMinutes("");
  }

  return (
    <div className="card" style={{padding:"14px 12px", borderRadius:12, border:"1px solid #eee", margin:"10px 0"}}>
      <div style={{fontWeight:700, fontSize:16, marginBottom:10}}>Quick Session (Simple Mode)</div>
      <label style={{display:"block", marginBottom:8}}>
        Minutes
        <input
          type="number"
          inputMode="numeric"
          value={minutes}
          onChange={e=>setMinutes(e.target.value)}
          placeholder="e.g., 30"
          style={{width:"100%", padding:8, borderRadius:10, border:"1px solid #ddd"}}
        />
      </label>
      <div style={{display:"flex", gap:8, marginBottom:10}}>
        <select value={intensity} onChange={e=>setIntensity(e.target.value)} style={{flex:1, padding:8, borderRadius:10}}>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="vigorous">Vigorous</option>
        </select>
        <select value={rest} onChange={e=>setRest(e.target.value)} style={{flex:1, padding:8, borderRadius:10}}>
          <option value="short">Short breaks</option>
          <option value="normal">Normal breaks</option>
          <option value="long">Long breaks</option>
        </select>
      </div>
      <div style={{fontSize:14, opacity:0.85, marginBottom:10}}>
        Est. calories: <b>{cal}</b>
      </div>
      <button type="button" onClick={handleAdd} style={{width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #ddd"}}>
        Add
      </button>
    </div>
  );
}

// Store simple sessions inside workoutLog.Session so totalBurn auto-includes them
function addSimpleSession(entry, setWorkoutLog, setToastMsg) {
  setWorkoutLog(prev => {
    const existing = prev.Session && Array.isArray(prev.Session.entries) ? prev.Session : { entries: [], cal: 0 };
    const entries = [...existing.entries, entry];
    const cal = entries.reduce((s,x)=>s + (x.cal||0), 0);
    return { ...prev, Session: { entries, cal } };
  });
  if (setToastMsg) {
    setToastMsg(`Logged ${entry.minutes} min ${entry.intensity} session · ${entry.cal} kcal`);
    setTimeout(()=>setToastMsg(""), 1500);
  }
}


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
const waterCount = water;

useEffect(() => {
    if (mode === "Cut") {
      setProteinGoal(cutProtein);
      setFatGoal(cutFat);
      setCarbGoal(cutCarb);
      setFiberGoal(cutFiber);
    } else if (mode === "Maintenance") {
      setProteinGoal(maintProtein);
      setFatGoal(maintFat);
      setCarbGoal(maintCarb);
      setFiberGoal(maintFiber);
    } else {
      setProteinGoal(bulkProtein);
      setFatGoal(bulkFat);
      setCarbGoal(bulkCarb);
      setFiberGoal(bulkFiber);
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
    localStorage.setItem("cutFiber", String(cutFiber));
    localStorage.setItem("maintFiber", String(maintFiber));
    localStorage.setItem("bulkFiber", String(bulkFiber));
    localStorage.setItem("fiberGoal", String(fiberGoal));
}, [calories, protein, fat, carbs, fiber, water, steps, deficitGoal, proteinGoal, checklist, foodLog, workoutLog, fatGoal, carbGoal, mode, checklist, foodLog, workoutLog, weightLog]);


  // 🛠️ Whenever mode changes, override the home-page goals
  useEffect(() => {
    if (mode === "Cut") {
      setProteinGoal(cutProtein);
      setFatGoal(cutFat);
      setCarbGoal(cutCarb);
      setFiberGoal(cutFiber);
    } else if (mode === "Maintenance") {
      setProteinGoal(maintProtein);
      setFatGoal(maintFat);
      setCarbGoal(maintCarb);
      setFiberGoal(maintFiber);
    } else {
      setProteinGoal(bulkProtein);
      setFatGoal(bulkFat);
      setCarbGoal(bulkCarb);
      setFiberGoal(bulkFiber);
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
    ? Math.round(reps *  68)
    : type === "Steps"
    ? Math.round(reps  * 0.03)
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

  setToastMsg(completeFood.name + " added");
  setTimeout(() => setToastMsg(""), 1200);
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

  // Save settings and sync weight
  const saveSettings = () => {
    const h = parseFloat(settingsHeight);
    if (!settingsBirth || isNaN(h) || h <= 0) {
      alert("Please enter a valid birthday and height (cm).");
      return;
    }
    const nextProfile = { sex: settingsSex, heightCm: h, birthDate: settingsBirth };
    setUserProfile(nextProfile);

    const w = parseFloat(settingsWeight);
    const latest = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : null;
    if (!isNaN(w) && w > 0 && (latest === null || Math.abs(w - latest) > 0.0001)) {
      setWeightLog(prev => [...prev, { date: new Date().toLocaleDateString(), weight: w }]);
    }
    setScreen("home");
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
  const Progress = ({ label, value, goal, suffix = "", goalSuffix = "", dangerWhenOver = false, successWhenMet = false  }) => {
    const safeGoal = goal > 0 ? goal : 1;
    const pctRaw = (value / safeGoal) * 100;
    const pct = Math.max(0, Math.min(100, pctRaw)); // cap at 100%
    const isOver = value > safeGoal;
    const isMet = value >= safeGoal;

    let fillStyle;

    // Maintenance-only tolerance: Calories bar ONLY
    if (label === "Calories" && mode === "Maintenance") {
      const delta = value - safeGoal; // negative when under

      if (delta <= 0 && delta >= -50) {
        // Within 50 UNDER: normal blue with a *very short* red kiss at the end
        fillStyle = { background: "linear-gradient(90deg, #2b76ff 0%, #6aa7ff 98%, #ff4d4f 100%)" };
      } else if (delta > 0 && delta <= 50) {
        // Within 50 OVER: tiny blue lead-in into red
        fillStyle = { background: "linear-gradient(90deg, #2b76ff 0%, #ff4d4f 3%, #ff4d4f 100%)" };
      } else if (dangerWhenOver && isOver) {
        fillStyle = { background: "#ff4d4f" };
      } else if (successWhenMet && isMet) {
        fillStyle = { background: "#22c55e" };
      } else {
        fillStyle = { background: "linear-gradient(90deg,#2b76ff,#6aa7ff)" };
      }
    } else {
      if (dangerWhenOver && isOver) {
        fillStyle = { background: "#ff4d4f" };
      } else if (successWhenMet && isMet) {
        fillStyle = { background: "#22c55e" };
      } else {
        fillStyle = { background: "linear-gradient(90deg,#2b76ff,#6aa7ff)" };
      }
    }

    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
          <span><strong>{label}</strong></span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {Math.round(value * 10) / 10} / {Math.round(safeGoal * 10) / 10}{goalSuffix ? goalSuffix : ""}
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


// ===================== SETTINGS SCREEN =====================
if (screen === "settings") {
  return (
    <>
      <div style={{
        position:"fixed", top:0, left:0, right:0, height:"56px", background:"#fff",
        borderBottom:"1px solid #ddd", boxShadow:"0 1px 4px rgba(0,0,0,0.1)",
        display:"flex", alignItems:"center", justifyContent:"center", zIndex:100
      }}>
        <button onClick={() => setScreen("home")} style={{ border:"none", background:"transparent", fontSize:"18px", cursor:"pointer" }}>🏠 Home</button>
      </div>

      <div style={{ padding:"24px", paddingTop:"70px", paddingBottom:"80px", fontFamily:"Inter, Arial, sans-serif", maxWidth:"500px", margin:"auto" }}>
        <h1 style={{ fontSize:"22px", fontWeight:"bold", textAlign:"center", marginBottom:"8px" }}>⚙️ Settings</h1>
        <div style={{ background:"#f9f9f9", borderRadius:"12px", padding:"16px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", marginBottom:"16px" }}>
          <div style={{ display:"flex", gap:"18px", alignItems:"center", justifyContent:"center", marginBottom:"12px" }}>
            <label style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <input type="radio" name="sex" value="male" checked={settingsSex==="male"} onChange={()=>setSettingsSex("male")} />
              Male
            </label>
            <label style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <input type="radio" name="sex" value="female" checked={settingsSex==="female"} onChange={()=>setSettingsSex("female")} />
              Female
            </label>
          </div>

          {/* Settings profile row: Weight & Height side-by-side; Birthday below */}
{/* Profile: Weight & Height on one line; Birthday below inline */}
<div style={{ display:"grid", gridTemplateColumns:"auto auto", gap:"16px", justifyContent:"center", alignItems:"end", marginBottom:"10px" }}>
  <label style={{ display:"grid", gap:"6px", justifyItems:"center" }}>
    <div style={{ fontSize:"14px", color:"#555" }}>Weight (lbs)</div>
    <input
      type="number"
      inputMode="decimal"
      value={settingsWeight}
      onChange={e=>setSettingsWeight(e.target.value)}
      size={5}
      style={{ width:"12ch", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc", textAlign:"center" }}
    />
  </label>

  <label style={{ display:"grid", gap:"6px", justifyItems:"center" }}>
    <div style={{ fontSize:"14px", color:"#555" }}>Height (cm)</div>
    <input
      type="number"
      inputMode="decimal"
      value={settingsHeight}
      onChange={e=>setSettingsHeight(e.target.value)}
      size={5}
      style={{ width:"12ch", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc", textAlign:"center" }}
    />
  </label>
</div>

<div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
  <div style={{ fontSize:"14px", color:"#555" }}>Birthday</div>
  <input
    type="date"
    value={settingsBirth}
    onChange={e=>setSettingsBirth(e.target.value)}
    style={{ width:"16ch", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc", textAlign:"center" }}
  />
</div>


          {/* Home Page Display toggles */}
          <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:"12px", padding:"12px", margin:"12px 0" }}>
            <div style={{ fontWeight:600, marginBottom:"6px" }}>Home Page Display</div>
            {[
              ["Calories","showCalories"],
              ["Protein","showProtein"],
              ["Fats","showFat"],
              ["Carbs","showCarbs"],
              ["Fiber","showFiber"],
              ["Water","showWater"],
              ["Steps","showSteps"],
              ["Checklist","showChecklist"]
            ].map(([label,key]) => (
              <label key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0" }}>
                <span>{label}</span>
                <input type="checkbox" checked={!!displaySettings[key]} onChange={e=>setDisplaySettings(s=>({ ...s, [key]: e.target.checked }))} />
              </label>
            ))}
          </div>

          {/* Goals */}
          <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:"12px", padding:"12px", margin:"12px 0" }}>
            <div style={{ fontWeight:600, marginBottom:"6px" }}>Goals</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <label style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                <span>Water (oz)</span>
                <input type="number" inputMode="decimal" value={waterGoalOz} onChange={e=>setWaterGoalOz(Math.max(1, parseFloat(e.target.value||"0")||1))} style={{ padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc", width:"8ch" }} />
              </label>
              <label style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                <span>Steps</span>
                <input type="number" inputMode="numeric" value={stepsGoalCustom} onChange={e=>setStepsGoalCustom(Math.max(1, parseInt(e.target.value||"0")||1))} style={{ padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc", width:"8ch" }} />
              </label>
            </div>
          </div>

          {/* Checklist customization */}
          <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:"12px", padding:"12px", margin:"12px 0" }}>
            <div style={{ display:"flex", alignItems:"center" }}>
              <div style={{ fontWeight:600 }}>Checklist</div>
              
            </div>

            <div style={{ display:"flex", gap:"8px", marginTop:"10px" }}>
              <input
                type="text"
                placeholder="Add new checklist item"
                value={newChecklistName}
                onChange={e=>setNewChecklistName(e.target.value)}
                style={{ flex:"0 0 66%", maxWidth:"66%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }}
              />
              <button
                onClick={()=>{
                  const name = (newChecklistName||"").trim();
                  if (!name) return;
                  if (!checklistItems.includes(name)) {
                    setChecklistItems(prev => [...prev, name]);
                  }
                  setNewChecklistName("");
                }}
                style={{ padding:"10px 12px", fontSize:"16px", borderRadius:"8px", border:"none", background:"#1976d2", color:"#fff", cursor:"pointer" }}
              >
                Add
              </button>
            </div>

            <div style={{ marginTop:"10px" }}>
              {checklistItems.length === 0 ? (
                <div style={{ color:"#666" }}>No items — you can also hide the entire checklist in “Home Page Display”.</div>
              ) : (
                <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                  {checklistItems.map(item => (
                    <li key={item} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #eee" }}>
                      <span>{item}</span>
                      <button
                        onClick={()=>{
                          setChecklistItems(prev => prev.filter(i => i !== item));
                          setChecklist(prev => { const c = { ...prev }; delete c[item]; return c; });
                        }}
                        style={{ border:"none", background:"#eee", borderRadius:"6px", padding:"4px 8px", cursor:"pointer" }}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button onClick={saveSettings} style={{ width:"100%", padding:"12px", fontSize:"16px", borderRadius:"10px", border:"none", background:"#1976d2", color:"#fff", cursor:"pointer" }}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}

// ===================== ONBOARDING SCREEN =====================
if (screen === "onboarding") {
  const startApp = () => {
    const h = parseFloat(onbHeight);
    const w = parseFloat(onbWeight);
    if (!onbBirth || isNaN(h) || h <= 0 || isNaN(w) || w <= 0) {
      alert("Please fill in sex, height (cm), birthday, and weight (lbs).");
      return;
    }
    const nextProfile = { sex: onbSex, heightCm: h, birthDate: onbBirth };
    setUserProfile(nextProfile);
    // seed weight log
    if (weightLog.length === 0) {
      setWeightLog([{ date: new Date().toLocaleDateString(), weight: w }]);
    } else {
      const latest = weightLog[weightLog.length - 1].weight;
      if (Math.abs(latest - w) > 0.0001) {
        setWeightLog(prev => [...prev, { date: new Date().toLocaleDateString(), weight: w }]);
      }
    }
    setScreen("home");
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", maxWidth: "500px", margin: "40px auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "24px" }}>
        Welcome to EatLiftBurn
      </h1>

      <div style={{ background: "#f9f9f9", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        {/* Sex selection */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input type="radio" name="sex" value="male" checked={onbSex === "male"} onChange={() => setOnbSex("male")} />
            Male
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input type="radio" name="sex" value="female" checked={onbSex === "female"} onChange={() => setOnbSex("female")} />
            Female
          </label>
        </div>

        {/* Weight & Height on one line, narrow centered inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "16px", justifyContent: "center", marginBottom: "16px" }}>
          <label style={{ display: "grid", gap: "6px", justifyItems: "center" }}>
            <div style={{ fontSize: "14px", color: "#555" }}>Weight (lbs)</div>
            <input
              type="number"
              inputMode="decimal"
              value={onbWeight}
              onChange={e => setOnbWeight(e.target.value)}
              style={{ width: "12ch", padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", textAlign: "center" }}
            />
          </label>

          <label style={{ display: "grid", gap: "6px", justifyItems: "center" }}>
            <div style={{ fontSize: "14px", color: "#555" }}>Height (cm)</div>
            <input
              type="number"
              inputMode="decimal"
              value={onbHeight}
              onChange={e => setOnbHeight(e.target.value)}
              style={{ width: "12ch", padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", textAlign: "center" }}
            />
          </label>
        </div>

        {/* Birthday below on one line with label */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ fontSize: "14px", color: "#555" }}>Birthday</div>
          <input
            type="date"
            value={onbBirth}
            onChange={e => setOnbBirth(e.target.value)}
            style={{ width: "16ch", padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", textAlign: "center" }}
          />
        </div>

        <button
          onClick={startApp}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "none",
            background: "#1976d2",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

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

      
{/* 🔎 Search & Select (Card) */}
<div style={{
  marginTop: "12px",
  marginBottom: "18px",
  padding: "12px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  background: "#fafafa"
}}>
  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
    <span style={{ fontSize: 18 }}>🔎</span>
    <h3 style={{ margin: 0, fontSize: 18 }}>Search & Select</h3>
  </div>
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

      </div>

{/* ⚖️ Weigh & Log */}
      <div style={{
        marginTop: "12px",
        marginBottom: "18px",
        padding: "12px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fafafa"
      }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: 18 }}>⚖️</span>
          <h3 style={{ margin: 0, fontSize: 18 }}>Weigh & Log</h3>
        </div>

        
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
          <input
            type="text"
            placeholder="Search..."
            value={weighedQuery}
            onChange={(e) => setWeighedQuery(e.target.value)}
            style={{ padding: "10px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc", flex: "1 1 160px", minWidth: 0 }}
          />

          <select
            value={weighedKey}
            onChange={(e) => setWeighedKey(e.target.value)}
            style={{ padding: "8px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc", flex: "1 1 200px", maxWidth: "220px", minWidth: 0 }}
          >
            <option value="">Select food</option>
            {weighedFoods
              .filter(f => !weighedQuery || f.label.toLowerCase().includes(weighedQuery.toLowerCase()))
              .sort((a,b) => a.label.localeCompare(b.label))
              .map(f => (
                <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text" inputMode="decimal"
            placeholder="Grams"
            value={weighedGrams}
            onChange={e => setWeighedGrams(e.target.value)}
            style={{ padding: "8px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc", width: "60px", minWidth: 0, textAlign: "center" }}
          />

          <button
            onClick={() => {
              const def = weighedFoods.find(f => f.key === weighedKey);
              if (!def) return;
              const calc = computeFromGrams(def.per100, weighedGrams);
              addFood({
                name: `${def.label} (${calc.grams}g)`,
                cal: calc.cal,
                prot: calc.prot,
                fat:  calc.fat,
                carbs: calc.carbs,
                fiber: calc.fiber,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
              setWeighedGrams("");
              setWeighedQuery("");
            }}
            style={{ padding: "8px 12px", fontSize: "15px", background: "#0070f3", color: "#fff", border: "none", borderRadius: "8px" }}
            disabled={!weighedKey || !weighedGrams}
          >
            Add
          </button>
        </div>

  {/* live preview */}
  
        {weighedKey && weighedGrams && (() => {
          const def = weighedFoods.find(x => x.key === weighedKey);
          if (!def) return null;
          const { cal, prot, fat, carbs, fiber, grams } = computeFromGrams(def.per100, weighedGrams);
          return (
            <div style={{ marginTop: 10, fontSize: 14, color: "#333" }}>
              Preview: <strong>{def.label} ({grams}g)</strong> — {cal} cal, {prot}g protein
              {fat ? `, ${fat}g fat` : ""}{carbs ? `, ${carbs}g carbs` : ""}{fiber ? `, ${fiber}g fiber` : ""}
            </div>
          );
        })()}
      </div>
      
      {/* Liquids (Card) */}
      <div style={{
        marginTop: "12px",
        marginBottom: "18px",
        padding: "12px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fafafa"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: 18, fontWeight: 600, marginBottom: "10px" }}>
  <span>🥄</span>
  <div>Measure</div>
</div>


        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <select
  value={liquidKey}
  onChange={(e) => setLiquidKey(e.target.value)}
  style={{
    padding: "8px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "180px",
  }}
>
  <option value="" disabled>Select item</option>
  {Object.entries(liquidDefs).map(([key, item]) => (
    <option key={key} value={key}>{item.name}</option>
  ))}
</select>

          <select
            value={liquidUnit}
            onChange={(e) => setLiquidUnit(e.target.value)}
            style={{ padding: "8px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option>1/2 tsp</option>
            <option>tsp</option>
            <option>1/2 tbsp</option>
            <option>tbsp</option>
            <option>1/4 cup</option>
            <option>1/2 cup</option>
            <option>3/4 cup</option>
            <option>1 cup</option>
          
            <option>oz</option></select>

          <input
            type="number" inputMode="decimal"
            min="0"
            step="0.25"
            value={liquidQty}
            onChange={(e) => setLiquidQty(e.target.value)}
            placeholder="Qty"
            style={{ width: "90px", padding: "8px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc" }}
          />

          <button
            onClick={addLiquid}
            style={{ padding: "8px 12px", fontSize: "15px", background: "#0070f3", color: "#fff", border: "none", borderRadius: "8px" }}
          >
            Add
          </button>
        </div>

        {/* live preview */}
        {(() => {
          const t = computeLiquidTotals(liquidKey, liquidUnit, liquidQty);
          const _qtyOk = parseFloat(liquidQty || "0") > 0;
          if (!_qtyOk) return null;
          if (!liquidKey) return null;
          if (!t) return null;
          const n = { olive_oil:"Olive oil", avocado_oil:"Avocado oil", peanut_butter:"Peanut butter", maple_syrup:"Maple syrup", silan:"Silan (date syrup)", honey:"Honey", water:"Water" }[liquidKey];
          const unitLabel = liquidUnit;
          return (
            <div style={{ marginTop: 10, fontSize: 14, color: "#333" }}>
              Preview: <strong>{n} ({liquidQty}× {unitLabel})</strong>
              {liquidKey === "water"
                ? <> — adds {Math.round((flOzUnits[unitLabel] || 0) * parseFloat(liquidQty || "0") * 10)/10} oz water</>
                : <> — {t.cal} cal, {t.prot}g protein{t.fat ? `, ${t.fat}g fat` : ""}{t.carbs ? `, ${t.carbs}g carbs` : ""}{t.fiber ? `, ${t.fiber}g fiber` : ""}</>
              }
            </div>
          );
        })()}
      </div>
{/* 🧪 Custom Food (Card) */}
<div style={{
  marginTop: "12px",
  marginBottom: "18px",
  padding: "12px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  background: "#fafafa"
}}>
  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
    <span style={{ fontSize: 18 }}>🧪</span>
    <h3 style={{ margin: 0, fontSize: 18 }}>Custom Food</h3>
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
  if (!name || isNaN(parsedCal)) return;
  const parsedProt = prot === "" || isNaN(parseInt(prot)) ? 0 : parseInt(prot);
  const parsedFat  = fat === ""  || isNaN(parseFloat(fat))  ? 0 : parseFloat(fat);
  const parsedCarb = carbs === ""|| isNaN(parseFloat(carbs))? 0 : parseFloat(carbs);
  const parsedFib  = fiber === ""|| isNaN(parseFloat(fiber))? 0 : parseFloat(fiber);
  addFood({ name, cal: parsedCal, prot: parsedProt, fat: parsedFat, carbs: parsedCarb, fiber: parsedFib, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
  setCustomFood({ name: "", cal: "", prot: "", fat: "", carbs: "", fiber: "" });
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
          🏋️ Workouts <button type="button" onClick={()=>setShowWorkoutSettings(true)} style={{marginLeft:8, fontSize:14, border:'1px solid #ddd', borderRadius:8, padding:'2px 6px', background:'#fff'}}>⚙️</button>
        </h1>

      {/* Strength + Run entries */}
{workoutMode === "simple" ? (
  <SimpleSession addSession={(entry)=>addSimpleSession(entry, setWorkoutLog, setToastMsg)} latestWeight={latestWeight} />
) : (<>

      {Object.keys(workouts).map((type, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <label style={{ width: "100px", fontSize: "16px" }}>{type}</label>
          <input
  type="text" inputMode="decimal"
  step={type === "Run" ? "0.01" : "1"}
  placeholder={(
  type === "Run" || type === "Bike"
    ? "Kilometers"
    : type === "Plank"
    ? "Seconds"
    : type === "Swim"
    ? "Laps"
    : "Reps"
)}

  value={customWorkout[type] || ""}
  onChange={(e) =>
    setCustomWorkout({ ...customWorkout, [type]: e.target.value })
  }
  style={{ width: "100px", padding: "8px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
/>
          <button
            onClick={() => {
  const input = parseFloat(customWorkout[type]);
  if (!isNaN(input)) {
    // --- NEW: handle Bike rides
if (type === "Bike") {
const cal = Math.round(input * 15);        // 15 cal/km
setWorkoutLog(prev => {
  const prevReps = prev[type]?.reps || 0;
  const prevCal = prev[type]?.cal || 0;
  return { ...prev, [type]: { reps: prevReps + input, cal: prevCal + cal } };
});
setCustomWorkout({ ...customWorkout, [type]: "" });
return;
}
// existing Run handling
if (type === "Run") {
  const cal = Math.round(input *  68);
  const runSteps = Math.round(input * 1100);

  setSteps(prev => prev + runSteps);

setWorkoutLog(prev => {
  const prevReps = prev[type]?.reps || 0;
  const prevCal = prev[type]?.cal || 0;
  const prevSteps = prev[type]?.stepsAdded || 0;

  return {
    ...prev,
    [type]: {
      reps: prevReps + input,
      cal: prevCal + cal,
      stepsAdded: prevSteps + runSteps
    }
  };
});

  setCustomWorkout({ ...customWorkout, [type]: "" });
  return; // Exit early
}

    // fallback for other reps-based workouts
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

      {/* Steps section - separate from workouts */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <label style={{ width: "100px", fontSize: "16px" }}>Steps</label>
        <input
          type="number" inputMode="numeric" min="0"
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
              const stepCalories = Math.round(steps  * 0.03); // updated: * 0.03 kcal/step
              setSteps(prev => {
  const newSteps = prev + steps;
  localStorage.setItem("steps", newSteps.toString());
  return newSteps;
});
 // steps tracker
              setWorkoutLog(prev => ({
  ...prev,
  Steps: {
    reps: (prev["Steps"]?.reps || 0) + steps,
    cal: Math.round(((prev["Steps"]?.reps || 0) + steps)  * 0.03)
  }
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
      </div>

{/* Treadmill Entry */}
<div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
  <label style={{ width: "100px", fontSize: "16px" }}>Treadmill</label>
  
  <input
    type="number" inputMode="numeric" min="0"
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
    type="text" inputMode="decimal"
    placeholder="KM"
   
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
        const estimatedSteps = Math.round(km *  1350);
        setSteps(prev => {
  const newSteps = prev + estimatedSteps;
  return newSteps;
});

        setWorkoutLog(prev => ({
  ...prev,
  Treadmill: {
    cal: (prev.Treadmill?.cal || 0) + cal,
    steps: (prev.Treadmill?.steps || 0) + estimatedSteps
  }
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
</div>

{/* Swim Entry (50m laps, 7 cal/lap) */}
<div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
  <label style={{ width: "100px", fontSize: "16px" }}>Swim</label>

  <input
    type="number" inputMode="numeric" min="0"
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
</div>

        {/* Logged Workouts */}
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

    
</>)}
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
{/* --- Workout Settings Modal --- */}
{showWorkoutSettings && (
  <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999}}
    onClick={()=>setShowWorkoutSettings(false)}
  >
    <div onClick={e=>e.stopPropagation()} style={{background:"#fff", padding:16, borderRadius:14, width:"92%", maxWidth:420}}>
      <div style={{fontWeight:700, marginBottom:10}}>Workout logging mode</div>
      <label style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
        <input type="radio" name="workoutMode" value="simple" checked={workoutMode === "simple"} onChange={()=>setWorkoutMode("simple")} />
        <span>Simple (time + intensity + rest)</span>
      </label>
      <label style={{display:"flex", alignItems:"center", gap:10}}>
        <input type="radio" name="workoutMode" value="advanced" checked={workoutMode === "advanced"} onChange={()=>setWorkoutMode("advanced")} />
        <span>Advanced (per-exercise sets/reps)</span>
      </label>
      <div style={{display:"flex", gap:8, marginTop:14}}>
        <button type="button" onClick={()=>setShowWorkoutSettings(false)} style={{flex:1, padding:10, borderRadius:10}}>Close</button>
      </div>
    </div>
  </div>
)}

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
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", justifyContent: "center" }}>
        <input type="text" inputMode="decimal"
          placeholder="Enter weight"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          style={{ width: "30%", padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
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
    localStorage.setItem("cutFiber", String(cutFiber));
    localStorage.setItem("maintFiber", String(maintFiber));
    localStorage.setItem("bulkFiber", String(bulkFiber));
    localStorage.setItem("fiberGoal", String(fiberGoal));
                  if (mode === "Cut") { setProteinGoal(cutProtein); setFatGoal(cutFat); setCarbGoal(cutCarb); setFiberGoal(cutFiber); }
                  else if (mode === "Maintenance") { setProteinGoal(maintProtein); setFatGoal(maintFat); setCarbGoal(maintCarb); setFiberGoal(maintFiber); }
                  else { setProteinGoal(bulkProtein); setFatGoal(bulkFat); setCarbGoal(bulkCarb); setFiberGoal(bulkFiber); }
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
          <label>Carbs (g): <input type="text" inputMode="decimal" value={cutCarb} onChange={e => setCutCarb(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label> <label>Fiber (g): <input type="text" inputMode="decimal" value={cutFiber} onChange={e => setCutFiber(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          </div>

          <h2>🧰 Maintenance Macros</h2>
          <div style={{ display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap", marginTop:"8px" }}>
          <label>Protein (g): <input type="text" inputMode="decimal" value={maintProtein} onChange={e => setMaintProtein(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Fat (g): <input type="text" inputMode="decimal" value={maintFat} onChange={e => setMaintFat(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Carbs (g): <input type="text" inputMode="decimal" value={maintCarb} onChange={e => setMaintCarb(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label> <label>Fiber (g): <input type="text" inputMode="decimal" value={maintFiber} onChange={e => setMaintFiber(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          </div>

          <h2>🍚 Bulk Macros</h2>
          <div style={{ display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap", marginTop:"8px" }}>
          <label>Protein (g): <input type="text" inputMode="decimal" value={bulkProtein} onChange={e => setBulkProtein(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Fat (g): <input type="text" inputMode="decimal" value={bulkFat} onChange={e => setBulkFat(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
          <label>Carbs (g): <input type="text" inputMode="decimal" value={bulkCarb} onChange={e => setBulkCarb(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label> <label>Fiber (g): <input type="text" inputMode="decimal" value={bulkFiber} onChange={e => setBulkFiber(parseFloat(e.target.value)||0)}  style={{ width:"80px" }} /></label>
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
  
  <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-start", gap:"8px", margin:0 }}>
    <button
      onClick={() => setScreen("settings")}
      style={{ background:"transparent", border:"1px solid #ddd", borderRadius:"999px", padding:"4px 10px", cursor:"pointer" }}
      title="Settings"
    >⚙️</button>

    
  </div>


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
      marginLeft:      "auto",
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
      {displaySettings.showCalories && (
        <Progress label="Calories" value={calories} goal={caloriesBudget} dangerWhenOver />
      )}
      {displaySettings.showProtein && (
        <Progress label="Protein"  value={protein}  goal={proteinGoal} successWhenMet goalSuffix="g" />
      )}
      {displaySettings.showFat && (
        <Progress label="Fat"      value={fat}      goal={fatGoal}    successWhenMet goalSuffix="g" />
      )}
      {displaySettings.showCarbs && (
        <Progress label="Carbs"    value={carbs}    goal={carbGoal}   successWhenMet goalSuffix="g" />
      )}
      {displaySettings.showFiber && (
        <Progress label="Fiber"    value={fiber}    goal={fiberGoal}  successWhenMet goalSuffix="g" />
      )}
      {displaySettings.showWater && (
        <Progress label="Water"    value={waterCount} goal={waterGoalEff} successWhenMet goalSuffix="oz" />
      )}
      {displaySettings.showSteps && (
        <Progress label="Steps"    value={steps}    goal={stepGoalEff} successWhenMet />
      )}


    </div>

    {/* Checklist Box */}
    {displaySettings.showChecklist && (<div style={{
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
  {checklistItems.map((key) => (
    <label key={key} style={{ fontSize: "16px" }}>
      <input
        type="checkbox"
        checked={checklist[key]}
        onChange={() =>
          setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        style={{ marginRight: "10px" }}
      />
      {key === "sunlight" ? "Sunlight 🌞" : key === "supplements" ? "Supplements 💊" : key}
    </label>
  ))}
</div>)}
    </div>)}
    

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
