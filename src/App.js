



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

  

  // ▶ User profile (onboarding + settings)
  const [userProfile, setUserProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("userProfile")); } catch { return null; }
  });

  // seed onboarding if no profile on first load
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userProfile");
      const up = raw ? JSON.parse(raw) : null;
      if (!up || !up.sex || !up.heightCm || !up.birthDate) {
        setScreen("onboarding");
      }
    } catch {
      setScreen("onboarding");
    }
  }, []);

  // persist profile
  useEffect(() => {
    if (userProfile) {
      try { localStorage.setItem("userProfile", JSON.stringify(userProfile)); } catch {}
    }
  }, [userProfile]);



  // form state for Settings & Onboarding (hooks declared at top level)
  const [settingsSex, setSettingsSex] = useState((userProfile && userProfile.sex) || "male");
  const [settingsHeight, setSettingsHeight] = useState(userProfile && userProfile.heightCm ? String(userProfile.heightCm) : "");
  const [settingsBirth, setSettingsBirth] = useState((userProfile && userProfile.birthDate) || "");
  const [settingsWeight, setSettingsWeight] = useState("");

  const [onbSex, setOnbSex] = useState("male");
  const [onbHeight, setOnbHeight] = useState("");
  const [onbBirth, setOnbBirth] = useState("");
  const [onbWeight, setOnbWeight] = useState("");

  // when entering the Settings screen, prefill from profile & latest weight
  useEffect(() => {
    
if (screen === "settings") {

  const onSave = () => {
    const h = parseFloat(settingsHeight);
    if (!settingsBirth || isNaN(h) || h <= 0) {
      alert("Please enter a valid birthday and height (cm).");
      return;
    }
    const nextProfile = { sex: settingsSex, heightCm: Math.round(h), birthDate: settingsBirth };
    saveSettings(nextProfile, parseFloat(settingsWeight));
  };

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
        <p style={{ textAlign:"center", color:"#666", marginTop:0 }}>Update your profile so BMR is accurate for you.</p>

        <div style={{ background:"#f9f9f9", borderRadius:"12px", padding:"16px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", marginBottom:"16px" }}>
          <div style={{ display:"flex", gap:"16px", alignItems:"center", marginBottom:"12px" }}>
            <label style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <input type="radio" name="sex" value="male" checked={settingsSex==="male"} onChange={()=>setSettingsSex("male")} />
              Male
            </label>
            <label style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <input type="radio" name="sex" value="female" checked={settingsSex==="female"} onChange={()=>setSettingsSex("female")} />
              Female
            </label>
          </div>

          <label style={{ display:"block", marginBottom:"10px" }}>
            <div style={{ fontSize:"14px", color:"#555", marginBottom:"4px" }}>Height (cm)</div>
            <input type="number" inputMode="numeric" value={settingsHeight} onChange={e=>setSettingsHeight(e.target.value)} style={{ width:"100%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }} />
          </label>

          <label style={{ display:"block", marginBottom:"10px" }}>
            <div style={{ fontSize:"14px", color:"#555", marginBottom:"4px" }}>Birthday</div>
            <input type="date" value={settingsBirth} onChange={e=>setSettingsBirth(e.target.value)} style={{ width:"100%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }} />
          </label>

          <label style={{ display:"block", marginBottom:"10px" }}>
            <div style={{ fontSize:"14px", color:"#555", marginBottom:"4px" }}>Weight (lbs)</div>
            <input type="number" inputMode="decimal" value={settingsWeight} onChange={e=>setSettingsWeight(e.target.value)} style={{ width:"100%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }} />
            <div style={{ fontSize:"12px", color:"#777", marginTop:"6px" }}>Changing this will add a new entry to your Weight Log.</div>
          </label>

          <button onClick={onSave} style={{ width:"100%", padding:"12px", fontSize:"16px", borderRadius:"10px", border:"none", background:"#1976d2", color:"#fff", cursor:"pointer" }}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}

if (screen === "onboarding") {

  const onStart = () => {
    const h = parseFloat(onbHeight);
    const w = parseFloat(onbWeight);
    if (!onbBirth || isNaN(h) || h <= 0 || isNaN(w) || w <= 0) {
      alert("Please fill in sex, height (cm), birthday, and weight (lbs).");
      return;
    }
    const nextProfile = { sex: onbSex, heightCm: Math.round(h), birthDate: onbBirth };
    // Seed weight log with first entry
    if (weightLog.length === 0) {
      setWeightLog([{ date: new Date().toLocaleDateString(), weight: w }]);
    } else {
      const latest = weightLog[weightLog.length - 1].weight;
      if (Math.abs(latest - w) > 0.0001) {
        setWeightLog(prev => [...prev, { date: new Date().toLocaleDateString(), weight: w }]);
      }
    }
    setUserProfile(nextProfile);
    try { localStorage.setItem("userProfile", JSON.stringify(nextProfile)); } catch {}
    setScreen("home");
  };

  return (
    <div style={{ padding:"24px", paddingBottom:"24px", fontFamily:"Inter, Arial, sans-serif", maxWidth:"500px", margin:"40px auto" }}>
      <h1 style={{ fontSize:"24px", fontWeight:"bold", textAlign:"center", marginBottom:"8px" }}>Welcome to EatLiftBurn</h1>
      <p style={{ textAlign:"center", color:"#666", marginTop:0, marginBottom:"16px" }}>
        A quick one‑time setup so your BMR and goals are accurate.
      </p>

      <div style={{ background:"#f9f9f9", borderRadius:"12px", padding:"16px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display:"flex", gap:"16px", alignItems:"center", marginBottom:"12px" }}>
          <label style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <input type="radio" name="sex" value="male" checked={onbSex==="male"} onChange={()=>setOnbSex("male")} />
            Male
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <input type="radio" name="sex" value="female" checked={onbSex==="female"} onChange={()=>setOnbSex("female")} />
            Female
          </label>
        </div>

        <label style={{ display:"block", marginBottom:"10px" }}>
          <div style={{ fontSize:"14px", color:"#555", marginBottom:"4px" }}>Height (cm)</div>
          <input type="number" inputMode="numeric" value={onbHeight} onChange={e=>setOnbHeight(e.target.value)} style={{ width:"100%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }} />
        </label>

        <label style={{ display:"block", marginBottom:"10px" }}>
          <div style={{ fontSize:"14px", color:"#555", marginBottom:"4px" }}>Birthday</div>
          <input type="date" value={onbBirth} onChange={e=>setOnbBirth(e.target.value)} style={{ width:"100%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }} />
        </label>

        <label style={{ display:"block", marginBottom:"10px" }}>
          <div style={{ fontSize:"14px", color:"#555", marginBottom:"4px" }}>Weight (lbs)</div>
          <input type="number" inputMode="decimal" value={onbWeight} onChange={e=>setOnbWeight(e.target.value)} style={{ width:"100%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }} />
        </label>

        <button onClick={onStart} style={{ width:"100%", padding:"12px", fontSize:"16px", borderRadius:"10px", border:"none", background:"#1976d2", color:"#fff", cursor:"pointer", marginTop:"8px" }}>
          Save & Continue
        </button>
      </div>
    </div>
  );
}
const nextProfile = { sex, heightCm: Math.round(h), birthDate: birth };
    // Seed weight log with first entry
    if (weightLog.length === 0) {
      setWeightLog([{ date: new Date().toLocaleDateString(), weight: w }]);
    } else {
      const latest = weightLog[weightLog.length - 1].weight;
      if (Math.abs(latest - w) > 0.0001) {
        setWeightLog(prev => [...prev, { date: new Date().toLocaleDateString(), weight: w }]);
      }
    }
    setUserProfile(nextProfile);
    try { localStorage.setItem("userProfile", JSON.stringify(nextProfile)); } catch {}
    setScreen("home");
  };

  return (
    <div style={{ padding:"24px", paddingBottom:"24px", fontFamily:"Inter, Arial, sans-serif", maxWidth:"500px", margin:"40px auto" }}>
      <h1 style={{ fontSize:"24px", fontWeight:"bold", textAlign:"center", marginBottom:"8px" }}>Welcome to EatLiftBurn</h1>
      <p style={{ textAlign:"center", color:"#666", marginTop:0, marginBottom:"16px" }}>
        A quick one‑time setup so your BMR and goals are accurate.
      </p>

      <div style={{ background:"#f9f9f9", borderRadius:"12px", padding:"16px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display:"flex", gap:"16px", alignItems:"center", marginBottom:"12px" }}>
          <label style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <input type="radio" name="sex" value="male" checked={sex==="male"} onChange={()=>setSex("male")} />
            Male
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <input type="radio" name="sex" value="female" checked={sex==="female"} onChange={()=>setSex("female")} />
            Female
          </label>
        </div>

        <label style={{ display:"block", marginBottom:"10px" }}>
          <div style={{ fontSize:"14px", color:"#555", marginBottom:"4px" }}>Height (cm)</div>
          <input type="number" inputMode="numeric" value={height} onChange={e=>setHeight(e.target.value)} style={{ width:"100%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }} />
        </label>

        <label style={{ display:"block", marginBottom:"10px" }}>
          <div style={{ fontSize:"14px", color:"#555", marginBottom:"4px" }}>Birthday</div>
          <input type="date" value={birth} onChange={e=>setBirth(e.target.value)} style={{ width:"100%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }} />
        </label>

        <label style={{ display:"block", marginBottom:"10px" }}>
          <div style={{ fontSize:"14px", color:"#555", marginBottom:"4px" }}>Weight (lbs)</div>
          <input type="number" inputMode="decimal" value={weightLbs} onChange={e=>setWeightLbs(e.target.value)} style={{ width:"100%", padding:"10px", fontSize:"16px", borderRadius:"8px", border:"1px solid #ccc" }} />
        </label>

        <button onClick={onStart} style={{ width:"100%", padding:"12px", fontSize:"16px", borderRadius:"10px", border:"none", background:"#1976d2", color:"#fff", cursor:"pointer", marginTop:"8px" }}>
          Save & Continue
        </button>
      </div>
    </div>
  );
}


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
            style={{ padding: "10px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc", width: "60px", minWidth: 0, textAlign: "center" }}
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
            }}
            style={{ padding: "10px 14px", background: "#0070f3", color: "#fff", border: "none", borderRadius: "8px" }}
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

      {/* Strength + Run entries */}
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
setWorkoutLog(prev => ({
...prev,
[type]: { reps: input, cal }
}));
setCustomWorkout({ ...customWorkout, [type]: "" });
return;
}
// existing Run handling
if (type === "Run") {
  const cal = Math.round(input * 60);
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
              const stepCalories = Math.round(steps * 0.035); // updated: 0.035 kcal/step
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
    cal: Math.round(((prev["Steps"]?.reps || 0) + steps) * 0.035)
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
        const estimatedSteps = Math.round(km * 1250);
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

  
  {/* Small gear button to open Settings */}
  <button
    onClick={() => setScreen("settings")}
    style={{
      marginLeft:"8px",
      background:"transparent",
      color:"#444",
      padding:"4px 8px",
      fontSize:"16px",
      border:"1px solid #ddd",
      borderRadius:"999px",
      cursor:"pointer"
    }}
    title="Settings"
  >
    ⚙️
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
