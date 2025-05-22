import { useState } from 'react';

export default function Home() {
  const [weight, setWeight] = useState(157); // default weight in lbs
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [steps, setSteps] = useState(0);
  const [manualBurn, setManualBurn] = useState(0);
  const [exerciseLog, setExerciseLog] = useState([]);
  const [deficit, setDeficit] = useState(1740);

  const BMR = 1740;

  const stepCalories = (steps, weight) => steps * (weight * 0.0004); // based on ~0.04 cal/step @157lbs

  const calcDeficit = (newCalories, newSteps, manualBurn) => {
    const stepBurn = stepCalories(newSteps, weight);
    return Math.round(BMR + stepBurn + manualBurn - newCalories);
  };

  const handleWeightChange = (e) => {
    const w = parseInt(e.target.value);
    setWeight(w);
    setDeficit(calcDeficit(calories, steps, manualBurn));
  };

  const handleFoodLog = (e) => {
    e.preventDefault();
    const foodCals = parseInt(e.target.calories.value);
    const foodProtein = parseInt(e.target.protein.value);
    const updatedCalories = calories + foodCals;
    setCalories(updatedCalories);
    setProtein(prev => prev + foodProtein);
    setDeficit(calcDeficit(updatedCalories, steps, manualBurn));
    e.target.reset();
  };

  const handleStepLog = (e) => {
    e.preventDefault();
    const addedSteps = parseInt(e.target.steps.value);
    const updatedSteps = steps + addedSteps;
    setSteps(updatedSteps);
    setDeficit(calcDeficit(calories, updatedSteps, manualBurn));
    e.target.reset();
  };

  const handleManualBurn = (e) => {
    e.preventDefault();
    const addedBurn = parseInt(e.target.burn.value);
    const updatedManualBurn = manualBurn + addedBurn;
    setManualBurn(updatedManualBurn);
    setDeficit(calcDeficit(calories, steps, updatedManualBurn));
    e.target.reset();
  };

  const handlePresetFood = (e) => {
    const value = e.target.value;
    const presets = {
      'chicken_50': { cal: 82, protein: 15 },
      'chicken_100': { cal: 165, protein: 31 },
      'chicken_150': { cal: 247, protein: 46 },
      'chicken_200': { cal: 330, protein: 62 },
      'apple': { cal: 95, protein: 0.5 },
      'promix': { cal: 150, protein: 15 },
      'quest': { cal: 190, protein: 20 },
      'egg': { cal: 70, protein: 6 },
      'egg_white': { cal: 17, protein: 3.5 },
      'tomato': { cal: 22, protein: 1 },
      'green_onion': { cal: 5, protein: 0.2 },
      'butter': { cal: 100, protein: 0 },
      'olive_oil_tsp': { cal: 40, protein: 0 },
      'olive_oil_tbsp': { cal: 120, protein: 0 },
      'protein_icecream': { cal: 400, protein: 30 },
    };
    const item = presets[value];
    if (item) {
      const updatedCalories = calories + item.cal;
      setCalories(updatedCalories);
      setProtein(prev => prev + item.protein);
      setDeficit(calcDeficit(updatedCalories, steps, manualBurn));
    }
    e.target.value = '';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff' }}>
      <h1>EATLIFTBURN</h1>

      <label>Body Weight (lbs): </label>
      <input type="number" value={weight} onChange={handleWeightChange} style={{ marginBottom: '20px' }} />

      <p>Calories consumed: {calories}</p>
      <p>Protein: {protein}g</p>
      <p>Steps: {steps}</p>
      <p>Manual Burn: {manualBurn} cal</p>
      <p>Estimated Deficit: {deficit}</p>

      <hr />

      <h2>Log Preset Food</h2>
      <select onChange={handlePresetFood} defaultValue="">
        <option value="" disabled>Select food...</option>
        <option value="chicken_50">Chicken Breast (50g)</option>
        <option value="chicken_100">Chicken Breast (100g)</option>
        <option value="chicken_150">Chicken Breast (150g)</option>
        <option value="chicken_200">Chicken Breast (200g)</option>
        <option value="apple">Medium Apple</option>
        <option value="promix">Promix Protein Bar</option>
        <option value="quest">Quest Protein Bar</option>
        <option value="egg">Egg</option>
        <option value="egg_white">Egg White</option>
        <option value="tomato">Tomato</option>
        <option value="green_onion">Green Onion</option>
        <option value="butter">Butter</option>
        <option value="olive_oil_tsp">Olive Oil (1 tsp)</option>
        <option value="olive_oil_tbsp">Olive Oil (1 tbsp)</option>
        <option value="protein_icecream">Protein Ice Cream</option>
      </select>

      <h2>Log Custom Food</h2>
      <form onSubmit={handleFoodLog}>
        <input name="calories" type="number" placeholder="Calories" required />
        <input name="protein" type="number" placeholder="Protein (g)" required />
        <button type="submit">Add</button>
      </form>

      <h2>Log Steps (flat pace walk)</h2>
      <form onSubmit={handleStepLog}>
        <input name="steps" type="number" placeholder="Steps" required />
        <button type="submit">Add</button>
      </form>

      <h2>Log Manual Burn (e.g. treadmill calories)</h2>
      <form onSubmit={handleManualBurn}>
        <input name="burn" type="number" placeholder="Calories burned" required />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

// --- next.config.js ---
module.exports = {
  reactStrictMode: true,
};
